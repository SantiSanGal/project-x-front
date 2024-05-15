import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react"

let arrayCinco = new Array(5).fill(null);
let arrayObjCompra = new Array()

interface Coors {
    x: number;
    y: number;
}

interface GestionCompraProps {
    coors: Coors;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}


export const GestionCompra = ({ coors, show, setShow }: GestionCompraProps) => {
    const [showModalSeleccionarColores, setShowModalSeleccionarColores] = useState(false);
    const handleClose = () => setShow(false);

    const handlePurchase = () => {
        console.log('coordenadas del click desde el purchase -> ', coors);
        //TODO: Hacer pasarela
        setShowModalSeleccionarColores(true)
    }

    const pintarTabla = (x: number, y: number) => {
        console.log('pintarTable', x, y);
        console.log(coors);
        arrayObjCompra.push({ x: coors.x + x, y: coors.y + y, color: '#0000' }) //TODO:Verificar si ya existen las coordenadas en el objeto y que solo sean 25
        console.log('arrayObjCompra', arrayObjCompra);

    }

    return (
        <>
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

            <Modal show={showModalSeleccionarColores} onHide={() => setShowModalSeleccionarColores(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccione Los colores para sus Pixeles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table >
                        <tbody>
                            {
                                arrayCinco.map((fila, i) => (
                                    <tr
                                        key={i}
                                    >
                                        {
                                            arrayCinco.map((columna, j) => (
                                                <td
                                                    key={j}
                                                    onClick={() => pintarTabla(i, j)}></td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePurchase}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}