import { SelectPixelsModalContent } from "./select-pixels-modal-content";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GRID_SIZE, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "@/constants";

const InfiniteCanvas: React.FC = () => {
  const [coors, setCoors] = useState({ x: 0, y: 0 });
  const [openModal, setOpenModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

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
    ctx.restore();
  }, []);

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
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    updateCursor(e);
    initialPosRef.current = null;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
    // Solo se abre el modal si no se ha arrastrado
    if (hasDraggedRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const { offsetX, offsetY, scale } = transformRef.current;
    const worldX = (rawX - offsetX) / scale;
    const worldY = (rawY - offsetY) / scale;

    // Mostrar el modal solo si se hizo click dentro del área virtual 2000x1000
    if (
      worldX < 0 ||
      worldX > VIRTUAL_WIDTH ||
      worldY < 0 ||
      worldY > VIRTUAL_HEIGHT
    ) {
      return;
    }

    const gridXStart = Math.floor(worldX / GRID_SIZE) * GRID_SIZE;
    const gridYStart = Math.floor(worldY / GRID_SIZE) * GRID_SIZE;
    const gridXEnd = gridXStart + GRID_SIZE - 1;
    const gridYEnd = gridYStart + GRID_SIZE - 1;
    console.log("Raw click coordinates:", { x: rawX, y: rawY });
    console.log("Scaled (world) coordinates:", { x: worldX, y: worldY });
    console.log("Grid block coordinates:", {
      X_START: gridXStart,
      X_END: gridXEnd,
      Y_START: gridYStart,
      Y_END: gridYEnd,
    });
    setCoors({ x: gridXStart, y: gridYStart });
    setOpenModal(true);
  };

  return (
    <>
      <SelectPixelsModalContent
        openModal={openModal}
        setOpenModal={setOpenModal}
        coors={coors}
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
