import { GRID_SIZE, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "@/constants";
import React, { useCallback, useEffect, useRef } from "react";

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // si el usuario está arrastrando (panning).
  const isDraggingRef = useRef(false);
  // Guarda la última posición del mouse (para calcular delta de arrastre)
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Parámetros de transformación: desplazamientos de panorámica y escala de zoom.
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
   * Clears and re-draws the canvas using the current transformation.
   * Only grid lines inside the virtual canvas (0 ≤ x ≤ 2000, 0 ≤ y ≤ 1000)
   * are drawn.
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { offsetX, offsetY, scale } = transformRef.current;

    // Clear the whole canvas (using DOM coordinates)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save the context state and apply the pan & zoom transform.
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // Optionally fill the background (outside the grid area)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Begin drawing grid lines.
    ctx.beginPath();

    // Determine the visible area in "world" coordinates.
    const visibleLeft = -offsetX / scale;
    const visibleTop = -offsetY / scale;
    const visibleRight = visibleLeft + canvas.width / scale;
    const visibleBottom = visibleTop + canvas.height / scale;

    // Limit drawing to our virtual canvas.
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

    // Draw vertical grid lines.
    for (let x = startX; x <= endX; x += GRID_SIZE) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    // Draw horizontal grid lines.
    for (let y = startY; y <= endY; y += GRID_SIZE) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Restore the context so that the transform does not affect future drawings.
    ctx.restore();
  }, []);

  // Resize the canvas to always match the window dimensions.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    // Initial size setup
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  // --- Mouse Events for Panning ---

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    // Compute how far the mouse has moved.
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    // Update the pan offsets.
    transformRef.current.offsetX += dx;
    transformRef.current.offsetY += dy;
    // Store the new last position.
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    draw();
  };

  const endDrag = () => {
    isDraggingRef.current = false;
  };

  // --- Wheel Event for Zooming ---
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { scale, offsetX, offsetY } = transformRef.current;

    // Use the wheel delta to determine zoom factor.
    // (Adjust factor as desired.)
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = scale * zoomFactor;
    // Optionally restrict zoom range.
    if (newScale < 0.1 || newScale > 10) return;

    // Get mouse position relative to the canvas.
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Compute the mouse pointer's position in world coordinates before zoom.
    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;

    // Update offsets so that the world coordinate under the mouse remains fixed.
    transformRef.current.offsetX = mouseX - worldX * newScale;
    transformRef.current.offsetY = mouseY - worldY * newScale;
    transformRef.current.scale = newScale;

    draw();
  };

  // --- Click Event for Detecting Grid Block ---
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the raw click coordinates (relative to the canvas element).
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const { offsetX, offsetY, scale } = transformRef.current;
    // Convert raw coordinates into “world” coordinates (i.e. within our 2000×1000 grid).
    const worldX = (rawX - offsetX) / scale;
    const worldY = (rawY - offsetY) / scale;

    // Determine the grid block that was clicked.
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
  };

  return (
    <canvas
      className="w-screen h-screen block"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onWheel={handleWheel}
      onClick={handleClick}
    />
  );
};

export default InfiniteCanvas;
