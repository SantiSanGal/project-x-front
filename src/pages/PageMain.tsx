import style from './styles/pageMain.module.css'
import { useEffect, useRef, useState } from "react"
import { validarToken } from "../api/millionApi";
import { useNavigate } from 'react-router-dom'
import { encontrarMultiploMenorDeCinco } from "../utils/funcionesUtiles";
import { GestionCompra } from '../components/PageMain/GestionCompra';

export const PageMain = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [coors, setCoors] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = 2000;
    canvas.height = 1000;
    canvas.style.width = `2000px`;
    canvas.style.height = `1000px`;

    //dibuja los cuadros de 5*5
    const squareWidth = canvas.width / 400;
    const squareHeight = canvas.height / 200;

    for (let i = 0; i < 200; i++) {
      for (let j = 0; j < 400; j++) {
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.strokeRect(j * squareWidth, i * squareHeight, squareWidth, squareHeight);
      }
    }

    //dibuja la linea vertical
    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.closePath();

    //dibuja la linea horizontal
    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();
    context.closePath();
  }, [])

  const handleShow = () => setShow(true);

  const handleClick: React.MouseEventHandler<HTMLCanvasElement> = async ({ nativeEvent: { offsetX, offsetY } }) => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    const xCinco = encontrarMultiploMenorDeCinco(offsetX)
    const yCinco = encontrarMultiploMenorDeCinco(offsetY)

    setCoors({ x: xCinco, y: yCinco })

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "black";
    context.fillRect(xCinco, yCinco, 5, 5);
    context.stroke();

    let tokenValido = await validarToken();
    if (!tokenValido) {
      navigate('login')
    } else {
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