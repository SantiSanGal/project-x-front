import { getCanvasPixeles, getPixelesOcupados } from "@/core/actions/canvas";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GRID_SIZE, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "@/constants";
import { PixelSelector } from "./select-pixels-modal-content";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface InfiniteCanvasProps {
  isLogged: boolean;
}

interface PintarData {
  coordenada_x: number;
  coordenada_y: number;
  color: string;
}

const InfiniteCanvas = ({ isLogged }: InfiniteCanvasProps) => {
  const [coors, setCoors] = useState({ x: 0, y: 0 });
  const [openModal, setOpenModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sector, setSector] = useState(1);

  const {
    // isLoading: pintarIsLoading,
    data: pintarData,
    // isError: pintarIsError,
    // error: pintarError,
    refetch: refetchPintar,
  } = useQuery({
    queryKey: ["pintar"],
    staleTime: 1000 * 60 * 60,
    queryFn: () => getCanvasPixeles(isLogged),
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
  });

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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { offsetX, offsetY, scale } = transformRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    // Desactivar suavizado para efecto "pixel art"
    ctx.imageSmoothingEnabled = false;

    // Fondo
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    // Dibuja la cuadrícula
    ctx.beginPath();
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

    for (let x = startX; x <= endX; x += GRID_SIZE) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += GRID_SIZE) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Dibuja los píxeles de pintarData
    if (isLogged && pintarData) {
      pintarData.forEach(
        ({ coordenada_x, coordenada_y, color }: PintarData) => {
          ctx.fillStyle = color;
          ctx.fillRect(coordenada_x, coordenada_y, 1, 1);
        }
      );
    }

    ctx.restore();
  }, [pintarData, isLogged]);

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

  const updateCursor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (isDraggingRef.current) {
      canvas.style.cursor = "grabbing";
    } else {
      const rect = canvas.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const { offsetX, offsetY, scale } = transformRef.current;
      const worldX = (rawX - offsetX) / scale;
      const worldY = (rawY - offsetY) / scale;
      canvas.style.cursor =
        worldX >= 0 &&
        worldX <= VIRTUAL_WIDTH &&
        worldY >= 0 &&
        worldY <= VIRTUAL_HEIGHT
          ? "pointer"
          : "default";
    }
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
    if (isDraggingRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      transformRef.current.offsetX += dx;
      transformRef.current.offsetY += dy;
      lastPosRef.current = { x: e.clientX, y: e.clientY };

      // Verificar si se superó el umbral (por ejemplo, 5 píxeles)
      if (initialPosRef.current) {
        const totalDx = Math.abs(e.clientX - initialPosRef.current.x);
        const totalDy = Math.abs(e.clientY - initialPosRef.current.y);
        if (totalDx > 5 || totalDy > 5) {
          hasDraggedRef.current = true;
        }
      }
      draw();
    }
    updateCursor(e);

    // Actualizar el sector cuando se haga hover (o arrastre) dentro del área virtual (2000x1000)
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const { offsetX, offsetY, scale } = transformRef.current;
      const worldX = (rawX - offsetX) / scale;
      const worldY = (rawY - offsetY) / scale;
      // Verificar que esté dentro del área virtual
      if (
        worldX >= 0 &&
        worldX <= VIRTUAL_WIDTH &&
        worldY >= 0 &&
        worldY <= VIRTUAL_HEIGHT
      ) {
        let newSector: number | null = null;
        if (worldX >= 0 && worldX <= 999 && worldY >= 0 && worldY <= 499) {
          newSector = 1;
        } else if (
          worldX >= 1000 &&
          worldX <= 1999 &&
          worldY >= 0 &&
          worldY <= 499
        ) {
          newSector = 2;
        } else if (
          worldX >= 0 &&
          worldX <= 999 &&
          worldY >= 500 &&
          worldY <= 999
        ) {
          newSector = 3;
        } else if (
          worldX >= 1000 &&
          worldX <= 1999 &&
          worldY >= 500 &&
          worldY <= 999
        ) {
          newSector = 4;
        }
        if (newSector !== null && newSector !== sector) {
          setSector(newSector);
          console.log("Nuevo sector asignado:", newSector);
        }
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    updateCursor(e);
    initialPosRef.current = null;
  };

  const handleMouseLeave = (_e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    initialPosRef.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { scale, offsetX, offsetY } = transformRef.current;
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = scale * zoomFactor;
    if (newScale < 0.1 || newScale > 10) return;
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
    // Solo se ejecuta la acción si el click es genuino (sin haber arrastrado más de 5 píxeles)
    if (hasDraggedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const { offsetX, offsetY, scale } = transformRef.current;
    const worldX = (rawX - offsetX) / scale;
    const worldY = (rawY - offsetY) / scale;

    // Verificar que el click se realice dentro del área virtual 2000x1000
    if (
      worldX < 0 ||
      worldX > VIRTUAL_WIDTH ||
      worldY < 0 ||
      worldY > VIRTUAL_HEIGHT
    ) {
      return;
    }

    // Si el usuario no está logueado, mostrar toast error y salir
    if (!isLogged) {
      toast.error("Please log in first before making a selection.");
      return;
    }

    // Cálculo de la celda (alineada a la cuadrícula) a seleccionar
    const gridXStart = Math.floor(worldX / GRID_SIZE) * GRID_SIZE;
    const gridYStart = Math.floor(worldY / GRID_SIZE) * GRID_SIZE;

    // Verificar si el área ya está ocupada (solo si el usuario está logueado)
    if (ocupadosData && Array.isArray(ocupadosData)) {
      let permitir = true;
      for (const occupied of ocupadosData) {
        if (
          gridXStart >= occupied.coordenada_x_inicio &&
          gridXStart <= occupied.coordenada_x_fin &&
          gridYStart >= occupied.coordenada_y_inicio &&
          gridYStart <= occupied.coordenada_y_fin
        ) {
          permitir = false;
          break;
        }
      }
      if (!permitir) {
        return;
      }
    }

    // Si está permitido, pinta el bloque (simulando la reserva) y abre el modal
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(gridXStart, gridYStart, GRID_SIZE, GRID_SIZE);
      ctx.stroke();
    }
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
        refetchOcupados={refetchOcupados}
      />
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
