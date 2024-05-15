import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react"

let arrayCinco = new Array(5).fill(null);
const pintarTable = (i: number, j: number) => {
    console.log('pintarTable', i, j);

}

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
                        {
                            arrayCinco.map((fila, i) => (
                                <tr>
                                    {
                                        arrayCinco.map((columna, j) => (
                                            <td onClick={() => pintarTable(i, j)}></td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
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