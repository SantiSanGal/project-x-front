import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react"
import { millionApi } from '../../api/millionApi';
import { GestionCompraProps, ObjToSend } from '../../interfaces';

let arrayCinco = new Array(5).fill(null);

export const GestionCompra = ({ coors, show, setShow }: GestionCompraProps) => {
    const [showModalSeleccionarColores, setShowModalSeleccionarColores] = useState(false);

    const handleConfirmColorsOfPurchase = () => {
        let accessToken = localStorage.getItem('accessToken')

        let grupo_pixeles_params: ObjToSend = {
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
                        coordenada_x: coors.x + j,
                        coordenada_y: coors.y + i,
                        color: color
                    }
                    grupo_pixeles_params.pixeles.push(objIndividualPixel)
                }
            }
        }

        //!

        console.log('coordenadas del click desde el purchase handlePurchase -> ', coors);
        let params: any = {
            coordenada_x_inicio: coors.x,
            coordenada_y_inicio: coors.y,
            coordenada_x_fin: coors.x + 4,
            coordenada_y_fin: coors.y + 4
        }

        //TODO: Post al back para verificar si los rangos están disponibles y generar pedido en pagopar

        millionApi.post('/pagopar/generarPedido', params, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(res => console.log(res))
            .catch(err => console.log('err', err))

        // millionApi.post('/canvas', grupo_pixeles_params, {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // })
        //     .then((res) => {
        //         console.log('res', res);
        //     })
        //     .catch(e => {
        //         console.log('e', e);
        //     });


        setShow(false);
        setShowModalSeleccionarColores(false);
    };

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Comprar Pixel</Modal.Title>
                </Modal.Header>
                <Modal.Body>Has seleccionado este rango, ¿Te parece correcto para pintar?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={() => setShowModalSeleccionarColores(true)}>
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