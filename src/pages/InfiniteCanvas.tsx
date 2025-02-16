import { Modal } from "@/components/Modal";
import { GRID_SIZE, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "@/constants";
import React, { useCallback, useEffect, useRef, useState } from "react";

const InfiniteCanvas: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Estado para detectar si se está arrastrando (panning)
  const isDraggingRef = useRef(false);
  // Última posición del mouse (para calcular delta de arrastre)
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Parámetros de transformación: desplazamientos de pan y escala de zoom.
  const transformRef = useRef<{
    offsetX: number;
    offsetY: number;
    scale: number;
  }>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  /**
   * draw()
   *
   * Limpia y redibuja el canvas usando la transformación actual.
   * Se dibujan las líneas de la grilla solo dentro del área virtual.
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { offsetX, offsetY, scale } = transformRef.current;

    // Limpiar el canvas completo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Guardar el estado del contexto y aplicar la transformación de pan & zoom.
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // Rellenar el fondo del área virtual
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Iniciar el dibujo de la grilla.
    ctx.beginPath();

    // Determinar el área visible en coordenadas del "mundo".
    const visibleLeft = -offsetX / scale;
    const visibleTop = -offsetY / scale;
    const visibleRight = visibleLeft + canvas.width / scale;
    const visibleBottom = visibleTop + canvas.height / scale;

    // Limitar el dibujo al área virtual.
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

    // Dibujar líneas verticales.
    for (let x = startX; x <= endX; x += GRID_SIZE) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    // Dibujar líneas horizontales.
    for (let y = startY; y <= endY; y += GRID_SIZE) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Restaurar el estado del contexto.
    ctx.restore();
  }, []);

  // Redimensionar el canvas para que siempre coincida con el tamaño de la ventana.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    // Configuración inicial
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  /**
   * updateCursor()
   *
   * Actualiza el estilo del cursor según la posición del mouse:
   * - Si se está arrastrando, muestra "grabbing".
   * - Si no se arrastra, convierte las coordenadas del mouse a "mundo" y,
   *   si están dentro del área virtual (2000×1000), muestra "pointer"; de lo contrario, "default".
   */
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

      if (
        worldX >= 0 &&
        worldX <= VIRTUAL_WIDTH &&
        worldY >= 0 &&
        worldY <= VIRTUAL_HEIGHT
      ) {
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "default";
      }
    }
  };

  // --- Eventos del Mouse para Pan (arrastre) ---

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    updateCursor(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Si se está arrastrando, actualizar la transformación y redibujar.
    if (isDraggingRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      transformRef.current.offsetX += dx;
      transformRef.current.offsetY += dy;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      draw();
    }
    // Actualizar el cursor (tanto si se arrastra como si no).
    updateCursor(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    updateCursor(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    // Al salir del canvas, dejamos el cursor en "default"
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }
  };

  // --- Evento de rueda para Zoom ---
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

    // Calcular la posición "mundo" antes del zoom.
    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;

    // Ajustar los offsets para mantener fija la posición bajo el mouse.
    transformRef.current.offsetX = mouseX - worldX * newScale;
    transformRef.current.offsetY = mouseY - worldY * newScale;
    transformRef.current.scale = newScale;

    draw();
    updateCursor(e);
  };

  // --- Evento de Click para detectar el bloque de la grilla ---
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const { offsetX, offsetY, scale } = transformRef.current;
    const worldX = (rawX - offsetX) / scale;
    const worldY = (rawY - offsetY) / scale;

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
    setOpenModal(true);
  };

  return (
    <>
      <Modal openModal={openModal} setOpenModal={setOpenModal} />
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
