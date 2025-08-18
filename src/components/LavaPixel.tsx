import { useEffect, useRef } from "react";

type LavaPixelsProps = {
  /** color del verde (usa el de tu tema). Ej: tailwind lime-600 #65a30d */
  green?: string;
  /** opacidad base de los pixeles (0–1) */
  alpha?: number;
  /** velocidad de la forma (px/seg) */
  speed?: number;
  /** clase para posicionar el canvas (normalmente absolute inset-0) */
  className?: string;
};

type Pt = { x: number; y: number };
type Particle = {
  x: number;
  y: number;
  a: number;
  t: number;
  s: number;
  color: string;
};
type Blob = {
  x: number;
  y: number;
  baseR: number;
  angle: number;
  speed: number;
  phase: number;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// Poisson-disc (Bridson). Evita solapes
function poisson(
  width: number,
  height: number,
  r: number,
  k = 30,
  limit = 3000
): Pt[] {
  const cell = r / Math.SQRT2;
  const gw = Math.ceil(width / cell),
    gh = Math.ceil(height / cell);
  const grid: (Pt | null)[] = Array(gw * gh).fill(null);
  const pts: Pt[] = [],
    active: Pt[] = [];
  const gi = (x: number, y: number) =>
    Math.floor(y / cell) * gw + Math.floor(x / cell);
  const hasN = (x: number, y: number) => {
    const gx = Math.floor(x / cell),
      gy = Math.floor(y / cell);
    for (let yy = Math.max(gy - 2, 0); yy <= Math.min(gy + 2, gh - 1); yy++) {
      for (let xx = Math.max(gx - 2, 0); xx <= Math.min(gx + 2, gw - 1); xx++) {
        const n = grid[yy * gw + xx];
        if (n) {
          const dx = n.x - x,
            dy = n.y - y;
          if (dx * dx + dy * dy < r * r) return true;
        }
      }
    }
    return false;
  };
  const p0 = { x: Math.random() * width, y: Math.random() * height };
  pts.push(p0);
  active.push(p0);
  grid[gi(p0.x, p0.y)] = p0;
  while (active.length && pts.length < limit) {
    const idx = (Math.random() * active.length) | 0;
    const p = active[idx];
    let found = false;
    for (let i = 0; i < k; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = r * (1 + Math.random());
      const x = p.x + Math.cos(ang) * rad,
        y = p.y + Math.sin(ang) * rad;
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      if (!hasN(x, y)) {
        const q = { x, y };
        pts.push(q);
        active.push(q);
        grid[gi(x, y)] = q;
        found = true;
        break;
      }
    }
    if (!found) active.splice(idx, 1);
  }
  return pts;
}

export default function LavaPixels({
  green = "#65a30d", // lime-600
  alpha = 0.95,
  speed = 56, // forma + rápida, pixeles fijos
  className,
}: LavaPixelsProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrap.current || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let width = 0,
      height = 0,
      dpr = Math.max(1, window.devicePixelRatio || 1);

    // parámetros dependientes del tamaño (responsivo)
    let MIN_DIST = 12; // separacion minima
    let PIXEL_SIZE = 3.6; // tamaño del cuadrado
    let BLOB_COUNT = 6;
    let BLOB_MIN_R = 0;
    let BLOB_MAX_R = 0;

    const FADING_SPEED = 0.03; // relajado
    const EDGE_SOFTNESS = 0.1; // borde blando (lava)
    const TURN_RATE = 0.9; // serpenteo rad/seg
    const BREATHE_AMPL = 0.22; // respiración de cada blob
    const BREATHE_FREQ = 0.28; // Hz
    const MIN_ON_FRACTION = 0.16; // nunca vacío
    const MAX_ON_FRACTION = 0.34;
    const SWELL_FREQ = 0.15; // respiración global
    const THRESH_GAIN = 2.4;

    let particles: Particle[] = [];
    let blobs: Blob[] = [];
    let thr = 0.35;
    let raf = 0,
      last = performance.now();

    const recolor = (n: number) => {
      // mitad negro, mitad verde
      const out: string[] = [];
      for (let i = 0; i < n; i++) {
        if (i % 2 === 0) out.push(`rgba(0,0,0,${alpha})`);
        else out.push(green);
      }
      // desordena un poco
      for (let i = out.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    };

    const build = () => {
      const rect = wrap.current!.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // escalar densidad y radios a tamaño del panel
      const scale = Math.sqrt((width * height) / (960 * 420)); // base: demo
      MIN_DIST = Math.max(8, 12 * scale);
      PIXEL_SIZE = Math.max(2.8, 3.6 * scale);
      BLOB_COUNT = Math.max(5, Math.round(6 * scale));
      const shortSide = Math.min(width, height);
      BLOB_MIN_R = shortSide * 0.22;
      BLOB_MAX_R = shortSide * 0.36;

      // genera puntos sin solape
      const pool = poisson(width, height, MIN_DIST, 30, 3200);
      const cols = recolor(pool.length);
      particles = pool.map((p, i) => ({
        x: p.x,
        y: p.y,
        a: 0,
        t: 0,
        s: PIXEL_SIZE + Math.random() * 1.1,
        color: cols[i],
      }));

      // blobs iniciales
      blobs = Array.from({ length: BLOB_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        baseR: BLOB_MIN_R + Math.random() * (BLOB_MAX_R - BLOB_MIN_R),
        angle: Math.random() * Math.PI * 2,
        speed: speed * (0.8 + Math.random() * 0.4),
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // mover blobs (serpenteo + rebote)
      for (const b of blobs) {
        b.angle += (Math.random() * 2 - 1) * TURN_RATE * dt;
        const vx = Math.cos(b.angle) * b.speed,
          vy = Math.sin(b.angle) * b.speed;
        b.x += vx * dt;
        b.y += vy * dt;
        if (b.x < 0) {
          b.x = 0;
          b.angle = Math.PI - b.angle;
        }
        if (b.x > width) {
          b.x = width;
          b.angle = Math.PI - b.angle;
        }
        if (b.y < 0) {
          b.y = 0;
          b.angle = -b.angle;
        }
        if (b.y > height) {
          b.y = height;
          b.angle = -b.angle;
        }
      }

      // respiración global -> % encendido objetivo (nunca vacío)
      const swell = (Math.sin((2 * Math.PI * SWELL_FREQ * now) / 1000) + 1) / 2;
      const targetOn =
        MIN_ON_FRACTION + (MAX_ON_FRACTION - MIN_ON_FRACTION) * swell;

      // campo de blobs y ajuste de umbral
      let lit = 0;
      const time = now / 1000;
      ctx.clearRect(0, 0, width, height); // canvas transparente encima del gradiente
      ctx.save();
      ctx.translate(0.5, 0.5);

      for (const p of particles) {
        let field = 0;
        for (const b of blobs) {
          const r =
            b.baseR *
            (1 + 0.22 * Math.sin(2 * Math.PI * BREATHE_FREQ * time + b.phase));
          const d = Math.hypot(p.x - b.x, p.y - b.y);
          field += smoothstep(r, 0, d);
        }
        const norm = field / blobs.length;
        const tSoft = smoothstep(
          thr - EDGE_SOFTNESS,
          thr + EDGE_SOFTNESS,
          norm
        );
        p.t = tSoft;
        if (norm > thr) lit++;

        p.a += (p.t - p.a) * FADING_SPEED;
        if (p.a <= 0.01) continue;
        ctx.globalAlpha = p.a;

        // usa color propio (negro o verde)
        ctx.fillStyle = p.color;
        const s = p.s;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.restore();

      // feedback -> mantener cobertura
      const litFrac = lit / particles.length;
      thr += (litFrac - targetOn) * THRESH_GAIN * dt;
      thr = clamp01(thr);

      raf = requestAnimationFrame(step);
    };

    build();
    last = performance.now();
    raf = requestAnimationFrame(step);

    // Responsivo
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      build();
      last = performance.now();
      raf = requestAnimationFrame(step);
    });
    ro.observe(wrap.current);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [alpha, speed, green]);

  return (
    <div ref={wrap} className={className ?? ""} aria-hidden>
      <canvas
        ref={ref}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
