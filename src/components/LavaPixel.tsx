import { useEffect, useRef } from "react";

type LavaPixelsProps = {
  green?: string;
  alpha?: number;
  speed?: number; // 1 = base; podés bajar a 0.8 si aún te parece rápido
  className?: string;
};

type P = {
  i: number;
  j: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  a: number;
  color: string;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function fieldVal(x: number, y: number, t: number) {
  const s = 0.013;
  const a =
    Math.sin(x * s + t * 0.35) +
    Math.cos(y * s * 1.6 - t * 0.4) +
    Math.sin((x + y) * s * 0.6 + t * 0.23);
  return (a + 3) / 6;
}
function flowDir(x: number, y: number, t: number) {
  const e = 1.0;
  const gx = fieldVal(x + e, y, t) - fieldVal(x - e, y, t);
  const gy = fieldVal(x, y + e, t) - fieldVal(x, y - e, t);
  let vx = -gy,
    vy = gx;
  const n = Math.hypot(vx, vy) || 1;
  return { vx: vx / n, vy: vy / n };
}

export default function LavaPixels({
  green = "#65a30d",
  alpha = 0.9,
  speed = 1,
  className,
}: LavaPixelsProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrap.current || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    // ===== PRESET CALM =====
    let PIXEL_SIZE = 3;
    let CELL_GAP = 10;
    let FLOW_SPEED = 1 * speed; // ↓ más lento
    const JITTER = 10; // ↓ menos ruido
    const FADE_SPEED = 5; // ↓ fundidos más largos
    const MIN_LIFE = 10,
      MAX_LIFE = 10; // ↑ vidas más largas
    const FILL_SWELL = 1; // ↓ oleada lenta
    const FILL_MIN = 1,
      FILL_MAX = 10; // ↓ amplitud
    const CENTER_PULL = 6; // atrae al centro de la celda (px/s^2)
    const FRICTION = 1; // fricción por frame (a 60fps)
    const SPAWN_TRIES = 150;

    // ========================
    let width = 0,
      height = 0,
      dpr = Math.max(1, window.devicePixelRatio || 1);
    let cols = 0,
      rows = 0,
      cell = 0,
      half = 0,
      cross = 0;
    let particles: P[] = [];
    let occ: Uint8Array;
    let raf = 0,
      last = performance.now();

    function palette(n: number) {
      const out: string[] = [];
      for (let i = 0; i < n; i++)
        out.push(i % 2 === 0 ? `rgba(0,0,0,${alpha})` : green);
      for (let i = out.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    }

    function build() {
      const r = wrap.current!.getBoundingClientRect();
      width = Math.max(1, Math.round(r.width));
      height = Math.max(1, Math.round(r.height));
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scale = Math.sqrt((width * height) / (960 * 420));
      PIXEL_SIZE = Math.max(3, 3 * scale);
      CELL_GAP = 0 * scale;
      cell = PIXEL_SIZE + CELL_GAP;
      half = cell * 0.5;
      cross = half * 0.95; // margen para evitar saltos nerviosos
      cols = Math.max(1, Math.floor(width / cell));
      rows = Math.max(1, Math.floor(height / cell));

      occ = new Uint8Array(cols * rows);
      particles = [];

      // semilla inicial calmada
      const want = Math.floor(cols * rows * FILL_MIN);
      const colsArr = palette(want);
      for (let k = 0; k < want; k++)
        spawn(Math.random(), colsArr[k % colsArr.length]);
    }

    const id = (i: number, j: number) => j * cols + i;

    function spawn(_rand = Math.random(), forceColor?: string) {
      const t = performance.now() / 1000;
      for (let k = 0; k < SPAWN_TRIES; k++) {
        const i = (Math.random() * cols) | 0;
        const j = (Math.random() * rows) | 0;
        if (occ[id(i, j)]) continue;
        const x = (i + 0.5) * cell,
          y = (j + 0.5) * cell;
        const val = fieldVal(x, y, t);
        if (val < 0.45) continue; // favorece zonas “buenas”
        const life = MIN_LIFE + Math.random() * (MAX_LIFE - MIN_LIFE);
        const color =
          forceColor ?? (Math.random() < 0.5 ? `rgba(0,0,0,${alpha})` : green);
        occ[id(i, j)] = 1;
        particles.push({
          i,
          j,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          age: 0,
          life,
          a: 0,
          color,
        });
        return true;
      }
      return false;
    }

    function kill(p: P) {
      occ[id(p.i, p.j)] = 0;
      p.age = p.life + 1;
    }

    function step(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const t = now / 1000;
      const swell = (Math.sin(2 * Math.PI * FILL_SWELL * t) + 1) / 2;
      const targetFill = FILL_MIN + (FILL_MAX - FILL_MIN) * swell;
      const want = Math.floor(targetFill * cols * rows);
      while (particles.length < want) {
        if (!spawn()) break;
      }

      ctx.clearRect(0, 0, width, height);

      const fr = Math.pow(FRICTION, dt * 60); // fricción en función del dt

      for (let n = 0; n < particles.length; n++) {
        const p = particles[n];

        p.age += dt;
        const u = p.age / p.life;
        const targetA =
          smoothstep(0.0, 0.25, u) * (1 - smoothstep(0.75, 1.0, u));
        p.a += (targetA - p.a) * Math.min(1, FADE_SPEED * dt);

        // flujo suave + leve tirón al centro + fricción
        const cx = (p.i + 0.5) * cell + p.ox;
        const cy = (p.j + 0.5) * cell + p.oy;
        const { vx: dx, vy: dy } = flowDir(cx, cy, t);
        const spd = FLOW_SPEED * (0.9 + JITTER * (Math.random() - 0.5)); // ruido chico
        const tx = dx * spd,
          ty = dy * spd;
        p.vx += (tx - p.vx) * 0.25;
        p.vy += (ty - p.vy) * 0.25;
        // spring al centro
        p.vx += -p.ox * CENTER_PULL * dt;
        p.vy += -p.oy * CENTER_PULL * dt;
        // fricción
        p.vx *= fr;
        p.vy *= fr;

        p.ox += p.vx * dt;
        p.oy += p.vy * dt;

        // menos saltos: solo cruza si hay lugar y superó un umbral con margen
        if (p.ox > cross && p.i + 1 < cols && !occ[id(p.i + 1, p.j)]) {
          occ[id(p.i, p.j)] = 0;
          p.i++;
          occ[id(p.i, p.j)] = 1;
          p.ox -= cell;
        }
        if (p.ox < -cross && p.i - 1 >= 0 && !occ[id(p.i - 1, p.j)]) {
          occ[id(p.i, p.j)] = 0;
          p.i--;
          occ[id(p.i, p.j)] = 1;
          p.ox += cell;
        }
        if (p.oy > cross && p.j + 1 < rows && !occ[id(p.i, p.j + 1)]) {
          occ[id(p.i, p.j)] = 0;
          p.j++;
          occ[id(p.i, p.j)] = 1;
          p.oy -= cell;
        }
        if (p.oy < -cross && p.j - 1 >= 0 && !occ[id(p.i, p.j - 1)]) {
          occ[id(p.i, p.j)] = 0;
          p.j--;
          occ[id(p.i, p.j)] = 1;
          p.oy += cell;
        }

        if (p.age > p.life) {
          kill(p);
          continue;
        }
        if (p.a <= 0.01) continue;

        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.color;
        const x = (p.i + 0.5) * cell + p.ox;
        const y = (p.j + 0.5) * cell + p.oy;
        const s = PIXEL_SIZE | 0;
        ctx.fillRect((x - s / 2) | 0, (y - s / 2) | 0, s, s);
      }

      if (particles.length)
        particles = particles.filter((p) => p.age <= p.life);
      raf = requestAnimationFrame(step);
    }

    const handleResize = () => {
      cancelAnimationFrame(raf);
      build();
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    build();
    last = performance.now();
    raf = requestAnimationFrame(step);
    const ro = new ResizeObserver(handleResize);
    ro.observe(wrap.current!);

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
