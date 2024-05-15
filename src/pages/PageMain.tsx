import { useEffect, useRef, useState } from "react"
import './styles/pageMain.css'
import { validarToken } from "../api/millionApi";
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function encontrarMultiploMenorDe5(numero: number) {
  return Math.floor(numero / 5) * 5;
}

export const PageMain = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const contextRef: any = useRef(null);
  const [show, setShow] = useState(false);
  const [coors, setCoors] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.width = `1000px`;
    canvas.style.height = `1000px`;

    // const squareWidth = canvas.width / 384; // -> 1920
    const squareWidth = canvas.width / 200;
    console.log('canvas.width', canvas.width);
    // const squareHeight = canvas.height / 216; // -> 1080
    const squareHeight = canvas.height / 200; // -> 1080
    console.log('canvas.height', canvas.height);

    // for (let i = 0; i < 200; i++) { pinta de un color ramdom
    //   for (let j = 0; j < 200; j++) {
    //     context.fillStyle = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    //     context.fillRect(j * squareWidth, i * squareHeight, squareWidth, squareHeight);
    //   }
    // }

    // for (let i = 0; i < 216; i++) { //-> 1080
    for (let i = 0; i < 200; i++) {
      // for (let j = 0; j < 384; j++) { //1920
      for (let j = 0; j < 200; j++) {
        context.strokeStyle = "black"; // Color de borde negro
        context.lineWidth = 1; // Grosor del borde
        context.strokeRect(j * squareWidth, i * squareHeight, squareWidth, squareHeight); // Dibujar el borde
      }
    }


    context.scale(1, 1);
    contextRef.current = context;
  }, [])

  const handleClose = () => setShow(false);

  const handlePurchase = () => {
    console.log('coordenadas del click desde el purchase -> ', coors);
  }

  const handleShow = () => setShow(true);

  const handleClick = async (event: any) => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = Math.floor(event.clientX - rect.left);
    const offsetY = Math.floor(event.clientY - rect.top);

    setCoors({ x: offsetX, y: offsetY })

    const x = offsetX
    const y = offsetY

    const xCinco = encontrarMultiploMenorDe5(x)
    const yCinco = encontrarMultiploMenorDe5(y)

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
    <div className="pageMain">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Comprar Pixel</Modal.Title>
        </Modal.Header>
        <Modal.Body>Has seleccionado este rango, ¿Te parece correcto para pintar?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handlePurchase}>
            Buy
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="contenidoPageMain">
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