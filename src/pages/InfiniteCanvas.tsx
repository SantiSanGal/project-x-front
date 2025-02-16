import React, { useCallback, useEffect, useRef, useState } from "react";
import { GRID_SIZE, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "@/constants";
import { Modal } from "@/components/Modal";

const InfiniteCanvas: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Estado para detectar si se está arrastrando (panning)
  const isDraggingRef = useRef(false);
  // Última posición del mouse (para calcular delta de arrastre)
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

  // Ref para almacenar la imagen cargada.
  const imageRef = useRef<HTMLImageElement | null>(null);

  /**
   * draw()
   *
   * Limpia y redibuja el canvas aplicando la transformación actual.
   * Se dibuja la imagen (o un fondo blanco si aún no se carga) en el área virtual
   * (2000×1000) y, sobre ella, se dibuja la grilla.
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { offsetX, offsetY, scale } = transformRef.current;

    // Limpiar el canvas completo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Guardar el contexto y aplicar la transformación (pan & zoom)
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // Desactivar el suavizado de imágenes para un efecto "pixel art"
    ctx.imageSmoothingEnabled = false;
    // Para mayor compatibilidad, también puedes establecer:
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;

    // Dibujar la imagen en el área virtual (2000×1000)
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    } else {
      // Si la imagen aún no se carga, pintar un fondo blanco
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    // Iniciar el dibujo de la grilla
    ctx.beginPath();
    const visibleLeft = -offsetX / scale;
    const visibleTop = -offsetY / scale;
    const visibleRight = visibleLeft + canvas.width / scale;
    const visibleBottom = visibleTop + canvas.height / scale;

    const startX = Math.max(0, Math.floor(visibleLeft / GRID_SIZE) * GRID_SIZE);
    const endX = Math.min(VIRTUAL_WIDTH, Math.ceil(visibleRight / GRID_SIZE) * GRID_SIZE);
    const startY = Math.max(0, Math.floor(visibleTop / GRID_SIZE) * GRID_SIZE);
    const endY = Math.min(VIRTUAL_HEIGHT, Math.ceil(visibleBottom / GRID_SIZE) * GRID_SIZE);

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

    // Restaurar el contexto
    ctx.restore();
  }, []);


  // Efecto para cargar la imagen y redibujar el canvas (draw ya está definido)
  useEffect(() => {
    const img = new Image();
    img.src = "/images/actual.png";
    img.onload = () => {
      imageRef.current = img;
      draw();
    };
  }, [draw]);

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
   * - Si no, se convierte la posición a coordenadas "mundo" y, si está dentro del área virtual,
   *   muestra "pointer"; de lo contrario, "default".
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
    if (isDraggingRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      transformRef.current.offsetX += dx;
      transformRef.current.offsetY += dy;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      draw();
    }
    updateCursor(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    updateCursor(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
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

    // Ajustar los offsets para mantener la posición bajo el mouse.
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
