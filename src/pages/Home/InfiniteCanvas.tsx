import { getCanvasPixeles, getPixelesOcupados } from "@/core/actions/canvas";
import { GRID_SIZE, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "@/constants";
import { PixelSelector } from "./select-pixels-modal-content";
import { GrupoPixelesDetail } from "./grupo-pixeles-detail";
import { WaitAlertModal } from "./wait-alert-modal";
import { useQuery } from "@tanstack/react-query";
import { SocketContext } from "@/store";
import { Modal } from "@/components";
import { toast } from "sonner";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface InfiniteCanvasProps {
  isLogged: boolean;
}

interface PintarData {
  coordenada_x: number;
  coordenada_y: number;
  color: string;
}

//TODO: hacer que si el grupo ya está ocupado muestre un modal con el grupo con los colores y que tenga las opciones de reportar o visitar link

const InfiniteCanvas = ({ isLogged }: InfiniteCanvasProps) => {
  const [ocupadoSeleccionado, setOcupadoSeleccionado] = useState();
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [codeReferShow, setCodeReferShow] = useState("");
  const [pagoparToken, setPagoparToken] = useState("");
  const [coors, setCoors] = useState({ x: 0, y: 0 });
  const [openModal, setOpenModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useContext(SocketContext);
  const [sector, setSector] = useState(1);

  // Para detectar si se está arrastrando (panning)
  const isDraggingRef = useRef(false);
  // Para guardar la posición inicial en mouseDown
  const initialPosRef = useRef<{ x: number; y: number } | null>(null);
  // Para marcar si se ha arrastrado (movimiento mayor al umbral)
  const hasDraggedRef = useRef(false);
  // Última posición del mouse (para calcular el delta)
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Parámetros de transformación: pan y zoom.
  const transformRef = useRef<{
    offsetX: number;
    offsetY: number;
    scale: number;
  }>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  // Ref para la imagen cargada
  const imageRef = useRef<HTMLImageElement | null>(null);
  // Ref para guardar la celda (cuadrito) sobre la que se hace hover
  const hoveredCellRef = useRef<{ x: number; y: number } | null>(null);

  /* --------------------------------- Queries -------------------------------- */
  const {
    // isLoading: pintarIsLoading,
    data: pintarData,
    // isError: pintarIsError,
    // error: pintarError,
    refetch: refetchPintar,
  } = useQuery({
    queryKey: ["pintar"],
    staleTime: 1000 * 60 * 60,
    queryFn: () => getCanvasPixeles(),
    enabled: isLogged,
  });

  const {
    // isLoading: ocupadosIsLoading,
    data: ocupadosData,
    // isError: ocupadosIsError,
    // error: ocupadosError,
    refetch: refetchOcupados,
  } = useQuery({
    queryKey: ["ocupados", sector],
    staleTime: 1000 * 60 * 60,
    queryFn: () => getPixelesOcupados(sector),
    enabled: isLogged,
  });
  /* ------------------------------- End Queries ------------------------------ */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { offsetX, offsetY, scale } = transformRef.current;
    const crisp = 0.5 / scale; // <-- offset “crisp” dependiente del zoom

    // Limpio canvas físico
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pan/zoom
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // ¡IMPORTANTE!
    ctx.imageSmoothingEnabled = false;

    // Fondo
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    // ---------------- Grilla (alineada con “crisp”) ----------------
    const visibleLeft = -offsetX / scale;
    const visibleTop = -offsetY / scale;
    const visibleRight = visibleLeft + canvas.width / scale;
    const visibleBottom = visibleTop + canvas.height / scale;

    const startX = Math.max(0, Math.floor(visibleLeft / GRID_SIZE) * GRID_SIZE);
    const endX = Math.min(
      VIRTUAL_WIDTH,
      Math.ceil(visibleRight / GRID_SIZE) * GRID_SIZE
    );
    const startY = Math.max(0, Math.floor(visibleTop / GRID_SIZE) * GRID_SIZE);
    const endY = Math.min(
      VIRTUAL_HEIGHT,
      Math.ceil(visibleBottom / GRID_SIZE) * GRID_SIZE
    );

    ctx.beginPath();
    for (let x = startX; x <= endX; x += GRID_SIZE) {
      ctx.moveTo(x + crisp, startY);
      ctx.lineTo(x + crisp, endY);
    }
    for (let y = startY; y <= endY; y += GRID_SIZE) {
      ctx.moveTo(startX, y + crisp);
      ctx.lineTo(endX, y + crisp);
    }
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5 / scale; // misma “finura” en cualquier zoom
    ctx.stroke();

    // ---------------- Píxeles pintados ----------------
    if (isLogged && pintarData) {
      for (const { coordenada_x, coordenada_y, color } of pintarData) {
        if (
          coordenada_x >= 0 &&
          coordenada_x < VIRTUAL_WIDTH &&
          coordenada_y >= 0 &&
          coordenada_y < VIRTUAL_HEIGHT
        ) {
          ctx.fillStyle = color;
          ctx.fillRect(coordenada_x, coordenada_y, 1, 1);
        }
      }
    }

    // ---------------- Hover (alineado con la grilla) ----------------
    if (hoveredCellRef.current) {
      const { x, y } = hoveredCellRef.current;
      const w = Math.min(GRID_SIZE, VIRTUAL_WIDTH - x);
      const h = Math.min(GRID_SIZE, VIRTUAL_HEIGHT - y);

      ctx.beginPath();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 0.5 / scale; // igual que la grilla
      // mismo offset “crisp” que usamos para las líneas de la grilla
      ctx.strokeRect(x + crisp, y + crisp, w, h);

      // (Opcional) sombreado suave del bloque
      // ctx.save();
      // ctx.globalAlpha = 0.06;
      // ctx.fillStyle = "#000";
      // ctx.fillRect(x, y, w, h);
      // ctx.restore();
    }

    ctx.restore();
  }, [pintarData, isLogged]);

  /* --------------------------------- Effects -------------------------------- */
  // Cargar imagen
  useEffect(() => {
    const img = new Image();
    img.src = "/images/actual.png";
    img.onload = () => {
      imageRef.current = img;
      draw();
    };
  }, [draw]);

  // Redimensionar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  useEffect(() => {
    if (!socket) return;

    const handleNuevoRegistro = () => {
      // refetchPintar();
      refetchOcupados();
    };

    const handlePintar = (data: any) => {
      console.log("handlePintar", data);
      refetchPintar();
    };

    socket.on("nuevo_registro", handleNuevoRegistro);
    socket.on("pintar", handlePintar);

    return () => {
      socket.off("nuevo_registro", handleNuevoRegistro);
      socket.off("pintar", handleNuevoRegistro);
    };
  }, [socket, refetchPintar, refetchOcupados]);
  /* ------------------------------- End Effects ------------------------------ */

  const updateCursor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      canvas.style.cursor = "grabbing";
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const { offsetX, offsetY, scale } = transformRef.current;

    const worldX = (rawX - offsetX) / scale;
    const worldY = (rawY - offsetY) / scale;

    const inside =
      worldX >= 0 &&
      worldX < VIRTUAL_WIDTH &&
      worldY >= 0 &&
      worldY < VIRTUAL_HEIGHT;

    canvas.style.cursor = inside ? "pointer" : "default";
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    // Guardar posición inicial
    initialPosRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    updateCursor(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // --- Panning (drag) ---
    if (isDraggingRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      transformRef.current.offsetX += dx;
      transformRef.current.offsetY += dy;

      lastPosRef.current = { x: e.clientX, y: e.clientY };

      // Marcar arrastre real (umbral 5px)
      if (initialPosRef.current) {
        const totalDx = Math.abs(e.clientX - initialPosRef.current.x);
        const totalDy = Math.abs(e.clientY - initialPosRef.current.y);
        if (totalDx > 5 || totalDy > 5) {
          hasDraggedRef.current = true;
        }
      }
    }

    updateCursor(e);

    // --- Hover y sector ---
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const { offsetX, offsetY, scale } = transformRef.current;

      const worldX = (rawX - offsetX) / scale;
      const worldY = (rawY - offsetY) / scale;

      // Hover (snap a GRID_SIZE) sólo si estamos dentro del área virtual
      if (
        worldX >= 0 &&
        worldX < VIRTUAL_WIDTH &&
        worldY >= 0 &&
        worldY < VIRTUAL_HEIGHT
      ) {
        // clamp para evitar caer justo en 1000
        const clampedX = Math.min(Math.max(worldX, 0), VIRTUAL_WIDTH - 0.0001);
        const clampedY = Math.min(Math.max(worldY, 0), VIRTUAL_HEIGHT - 0.0001);

        hoveredCellRef.current = {
          x: Math.floor(clampedX / GRID_SIZE) * GRID_SIZE,
          y: Math.floor(clampedY / GRID_SIZE) * GRID_SIZE,
        };
      } else {
        hoveredCellRef.current = null;
      }

      // Sectores: 4 cuadrantes de 500×500
      let newSector: number | null = null;
      if (
        worldX >= 0 &&
        worldX < VIRTUAL_WIDTH &&
        worldY >= 0 &&
        worldY < VIRTUAL_HEIGHT
      ) {
        const right = worldX >= 500; // 0..499 = izq, 500..999 = der
        const bottom = worldY >= 500; // 0..499 = arriba, 500..999 = abajo
        // 1: arriba-izq, 2: arriba-der, 3: abajo-izq, 4: abajo-der
        newSector = bottom ? (right ? 4 : 3) : right ? 2 : 1;
      }
      if (newSector !== null && newSector !== sector) {
        setSector(newSector);
        console.log("Nuevo sector asignado:", newSector);
      }
    }

    // Redibuja para actualizar hover y/o pan
    draw();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    updateCursor(e);
    initialPosRef.current = null;
  };

  const handleMouseLeave = (_e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    initialPosRef.current = null;
    hoveredCellRef.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }
    draw();
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { scale, offsetX, offsetY } = transformRef.current;
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

    let newScale = scale * zoomFactor;
    // límites razonables de zoom
    newScale = Math.max(0.1, Math.min(10, newScale));

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;

    transformRef.current.offsetX = mouseX - worldX * newScale;
    transformRef.current.offsetY = mouseY - worldY * newScale;
    transformRef.current.scale = newScale;

    draw();
    updateCursor(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Ignorar si el click vino con arrastre real
    if (hasDraggedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const { offsetX, offsetY, scale } = transformRef.current;

    const worldX = (rawX - offsetX) / scale;
    const worldY = (rawY - offsetY) / scale;

    // Dentro del área virtual 1000×1000
    if (
      worldX < 0 ||
      worldX >= VIRTUAL_WIDTH ||
      worldY < 0 ||
      worldY >= VIRTUAL_HEIGHT
    ) {
      return;
    }

    // Requiere login
    if (!isLogged) {
      toast.error("Please log in first before making a selection.");
      return;
    }

    // Snap al bloque 10×10 (con clamp para bordes)
    const clampedX = Math.min(Math.max(worldX, 0), VIRTUAL_WIDTH - 0.0001);
    const clampedY = Math.min(Math.max(worldY, 0), VIRTUAL_HEIGHT - 0.0001);
    const gridXStart = Math.floor(clampedX / GRID_SIZE) * GRID_SIZE;
    const gridYStart = Math.floor(clampedY / GRID_SIZE) * GRID_SIZE;

    // Verificar ocupación contra los rects recibidos
    if (ocupadosData && Array.isArray(ocupadosData)) {
      let permitir = true;
      for (const occupied of ocupadosData) {
        if (
          gridXStart >= occupied.coordenada_x_inicio &&
          gridXStart <= occupied.coordenada_x_fin &&
          gridYStart >= occupied.coordenada_y_inicio &&
          gridYStart <= occupied.coordenada_y_fin
        ) {
          setOpenDetailModal(true);
          setOcupadoSeleccionado(occupied);
          permitir = false;
          break;
        }
      }
      if (!permitir) return;
    }

    // Feedback visual inmediato del bloque seleccionado (no llama a draw)
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
      ctx.imageSmoothingEnabled = false; // ¡importante!

      const w =
        gridXStart + GRID_SIZE <= VIRTUAL_WIDTH
          ? GRID_SIZE
          : VIRTUAL_WIDTH - gridXStart;
      const h =
        gridYStart + GRID_SIZE <= VIRTUAL_HEIGHT
          ? GRID_SIZE
          : VIRTUAL_HEIGHT - gridYStart;

      ctx.fillStyle = "black";
      ctx.fillRect(gridXStart, gridYStart, w, h);
      ctx.restore();
    }

    // Abre el selector con las coords del bloque
    setCoors({ x: gridXStart, y: gridYStart });
    setOpenModal(true);
  };

  return (
    <>
      <PixelSelector
        coors={coors}
        openModal={openModal}
        setOpenModal={setOpenModal}
        refetchPintar={refetchPintar}
        setCodeReferShow={setCodeReferShow}
        setPagoparToken={setPagoparToken}
        refetchOcupados={refetchOcupados}
        setOpenAlertModal={setOpenAlertModal}
      />

      <WaitAlertModal
        codeReferShow={codeReferShow}
        openModal={openAlertModal}
        pagoparToken={pagoparToken}
        setOpenModal={setOpenAlertModal}
      />

      {/* TODO: Hacer modal para que obtenga los datos del grupo ocupado, pixeles individuales y se pueda ver el detalle o reportar */}
      {/* {ocupadoSeleccionado && ( */}
      <Modal
        openModal={openDetailModal}
        setOpenModal={setOpenDetailModal}
        className="w-[648px] h-[639px] bg-white"
      >
        <GrupoPixelesDetail />
      </Modal>
      {/* )} */}

      <canvas
        className="w-screen h-screen block bg-stone-800"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onClick={handleClick}
      />
    </>
  );
};

export default InfiniteCanvas;
