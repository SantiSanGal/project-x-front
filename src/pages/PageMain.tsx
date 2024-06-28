import style from './styles/pageMain.module.css'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { encontrarMultiploMenorDeCinco } from "../utils/funcionesUtiles";
import { GestionCompra } from '../components/PageMain/GestionCompra';
import { getCanvasPixeles, getPixelesOcupados } from '../store/slices/canvas/thunks';
import { useDispatch } from '../hooks/hooks';
import { useSelector } from 'react-redux';
import { CanvasState, UserState } from '../interfaces';

export const PageMain = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);
  const [coors, setCoors] = useState({ x: 0, y: 0 })
  const isLogged = useSelector((state: UserState) => state.user.isLogged);
  const accessToken = useSelector((state: UserState) => state.user.accessToken)
  const canvasPixeles = useSelector((state: CanvasState) => state.canvas.canvasPixeles);

  // Trae los pixeles que aún no se hayan pintando en la imágen actual
  useEffect(() => {
    if (isLogged) {
      dispatch(getCanvasPixeles(accessToken))
    }
  }, [dispatch])

  // Pinta los pixeles que aún no se hayan pintando en la imágen actual
  useEffect(() => {
    if (isLogged) {
      canvasPixeles.map(({ coordenada_x, coordenada_y, color }) => {
        const canvas = canvasRef.current as HTMLCanvasElement | null;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.fillStyle = color;
        context.fillRect(coordenada_x, coordenada_y, 1, 1);
        context.stroke();
      })
    }
  }, [canvasPixeles])

  // De la imágen actual (generada cada 24hr), dibuja en un canvas
  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = 2000;
    canvas.height = 1000;
    canvas.style.width = `2000px`;
    canvas.style.height = `1000px`;

    const img = new Image();
    img.src = '/images/actual.png'
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

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
    }
  }, [])

  const handleShow = () => setShow(true);

  const handleClick: React.MouseEventHandler<HTMLCanvasElement> = async ({ nativeEvent: { offsetX, offsetY } }) => {
    if (isLogged) { //verifico si está loggueado

      //compruebo el sector en donde dió el click
      let sector = 0;
      if (offsetX >= 0 && offsetX <= 999) { //1 y 3
        if (offsetY >= 0 && offsetY <= 499) { //1
          sector = 1;
        } else { // 3
          sector = 3;
        }
      } else { // 2 y 4 
        if (offsetY >= 0 && offsetY <= 499) { // 2
          sector = 2;
        } else { // 4
          sector = 4;
        }
      }

      //traigo del estado global los pixeles ocupados del sector
      const pixelesOcupados = await dispatch(getPixelesOcupados(sector, accessToken));

      //recorro los pixeles ocupados del sector y verifico si en donde dió click, puede pintar nuevos pixeles
      let permitir = true;
      for (const { coordenada_x_inicio, coordenada_y_inicio, coordenada_x_fin, coordenada_y_fin } of pixelesOcupados) {
        if (offsetX >= coordenada_x_inicio && offsetX <= coordenada_x_fin && offsetY >= coordenada_y_inicio && offsetY <= coordenada_y_fin) {
          permitir = false;
          break;
        }
      }

      //si está permitido, muestra el modal para seleccionar los colores
      if (permitir) {
        const canvas = canvasRef.current as HTMLCanvasElement | null;
        if (!canvas) return;

        const xCinco = encontrarMultiploMenorDeCinco(offsetX);
        const yCinco = encontrarMultiploMenorDeCinco(offsetY);

        setCoors({ x: xCinco, y: yCinco });

        const context = canvas.getContext("2d");
        if (!context) return;

        context.fillStyle = "black";
        context.fillRect(xCinco, yCinco, 5, 5);
        context.stroke();
        handleShow();
      }
    } else { // si no está loggueado, va al login
      navigate('login');
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