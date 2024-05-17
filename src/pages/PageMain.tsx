import style from './styles/pageMain.module.css'
import { useEffect, useRef, useState } from "react"
import { validarToken } from "../api/millionApi";
import { useNavigate } from 'react-router-dom'
import { encontrarMultiploMenorDeCinco } from "../utils/funcionesUtiles";
import { GestionCompra } from '../components/PageMain/GestionCompra';

export const PageMain = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const contextRef: any = useRef(null);
  const [show, setShow] = useState(false);
  const [coors, setCoors] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = 2000;
    canvas.height = 1000;
    canvas.style.width = `2000px`;
    canvas.style.height = `1000px`;

    // const squareWidth = canvas.width / 384; // -> 1920
    const squareWidth = canvas.width / 400;
    console.log('canvas.width', canvas.width);
    // const squareHeight = canvas.height / 216; // -> 1080
    const squareHeight = canvas.height / 200; // -> 1080
    console.log('canvas.height', canvas.height);

    // for (let i = 0; i < 216; i++) { //-> 1080
    for (let i = 0; i < 200; i++) {
      // for (let j = 0; j < 384; j++) { //1920
      for (let j = 0; j < 400; j++) {
        context.strokeStyle = "black";
        context.lineWidth = 1; 
        context.strokeRect(j * squareWidth, i * squareHeight, squareWidth, squareHeight);
      }
    }

    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();
    context.closePath();


    context.scale(1, 1);
    contextRef.current = context;
  }, [])

  const handleShow = () => setShow(true);

  const handleClick = async (event: any) => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = Math.floor(event.clientX - rect.left);
    const offsetY = Math.floor(event.clientY - rect.top);

    const x = offsetX
    const y = offsetY

    const xCinco = encontrarMultiploMenorDeCinco(x)
    const yCinco = encontrarMultiploMenorDeCinco(y)

    setCoors({ x: xCinco, y: yCinco })

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "black";
    context.fillRect(xCinco, yCinco, 5, 5);

    let tokenValido = await validarToken();
    // TODO: Validar que no haga click más de una vez, deshabilidar el click
    // porque queda cargando despues de un rato la primera vez
    if (!tokenValido) {
      // console.log('ep');
      navigate('login')
    } else {
      // console.log('habemus token');
      handleShow()
    }
  };

  return (
    <div className={style.pageMain}>
      <GestionCompra
        coors={coors}
        show={show}
        setShow={setShow}
      />



      <div className={style.contenidoPageMain}>
        <canvas
          ref={canvasRef}
          style={{
            boxShadow: '0px 7px 15px 0px rgba(0, 0, 0, 0.2)'
          }}
          onClick={handleClick}
        >
        </canvas>
      </div>

    </div>
  )
}