import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react"
import { millionApi } from '../../api/millionApi';

interface IndividualPixel {
    coordenada_x: number;
    coordenada_y: number;
    color: string;
}

interface ObjToSend {
    grupo_pixeles: {
        link: string;
        coordenada_x_inicio: number;
        coordenada_y_inicio: number;
        coordenada_x_fin: number;
        coordenada_y_fin: number;
    };
    pixeles: IndividualPixel[];
}

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

    const handleConfirmColorsOfPurchase = () => {
        let accessToken = localStorage.getItem('accessToken')
        let objToSend: ObjToSend = {
            grupo_pixeles: {
                link: 'http://validarstring.com',
                coordenada_x_inicio: coors.x,
                coordenada_y_inicio: coors.y,
                coordenada_x_fin: coors.x + 4,
                coordenada_y_fin: coors.y + 4
            },
            pixeles: []
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const inputColorElement = document.getElementById(`inputColor-${i}-${j}`) as HTMLInputElement;
                if (inputColorElement) {
                    const color = inputColorElement.value;
                    console.log(`color at [${i},${j}]`, color);
                    let objIndividualPixel = {
                        coordenada_x: coors.x + i,
                        coordenada_y: coors.x + j,
                        color: color
                    }
                    objToSend.pixeles.push(objIndividualPixel)
                }
            }
        }

        console.log('objToSend', objToSend);
        console.log('accessToken', accessToken);

        millionApi.post('/canvas', objToSend, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log('res', res);
            })
            .catch(e => {
                console.log('e', e);
            });


        setShow(false);
        setShowModalSeleccionarColores(false);
    };

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
                                arrayCinco.map((_fila, i) => (
                                    <tr
                                        key={i}
                                    >
                                        {
                                            arrayCinco.map((_columna, j) => (
                                                <td
                                                    key={j}
                                                    id={`td-${i}-${j}`}
                                                >
                                                    <input id={`inputColor-${i}-${j}`} type="color" />
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleConfirmColorsOfPurchase}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}