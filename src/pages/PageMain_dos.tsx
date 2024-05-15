import { useEffect, useRef, useState } from "react"
import './styles/pageMain.css'
import { Popover, Typography } from "@mui/material";

export const PageMain = () => {
  const [anchor, setAnchor] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);


  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = 2000;
    canvas.height = 1000;
    canvas.style.width = `2000px`;
    canvas.style.height = `1000px`;

    context.scale(1, 1);
    contextRef.current = context;
  }, [])

  const handleClick = (event: any) => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const x = Math.floor(offsetX);
    const y = Math.floor(offsetY);

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "black";
    context.fillRect(x, y, 1, 1);
    console.log("Coordenada del píxel clickeado:", { x, y });

    // setAnchor({ left: event.clientX, top: event.clientY });
  };

  // const openPopover = (event: any) => {
  //   setAnchor(event?.currentTarget)
  // }

  const open = Boolean(anchor);

  return (
    <div className="pageMain">
      <div className="contenidoPageMain">
        <canvas
          ref={canvasRef}
          onClick={handleClick}
        >
        </canvas>
      </div>
      {/* <Button
        variant="contained"
        color="secondary"
        onClick={openPopover}>
        Open Popover
      </Button> */}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Typography variant='h6' sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </div>
  )
}