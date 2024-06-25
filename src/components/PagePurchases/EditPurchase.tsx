import { useEffect } from "react"
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import { EditCompraProps } from "../../interfaces";
// import { millionApi } from "../../api/millionApi";

export const EditPurchase = ({ idPurchase, show, setShow }: EditCompraProps) => {
    console.log('idPurchase', idPurchase);

    useEffect(() => {
        //TODO: Consultar los px del id
        // millionApi
    }, [])

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccione Los colores para sus Pixeles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table >
                        <tbody>
                            {
                                // arrayCinco.map((_fila, i) => (
                                //     <tr
                                //         key={i}
                                //     >
                                //         {
                                //             arrayCinco.map((_columna, j) => (
                                //                 <td
                                //                     key={j}
                                //                     id={`td-${i}-${j}`}
                                //                 >
                                //                     <input id={`inputColor-${i}-${j}`} type="color" />
                                //                 </td>
                                //             ))
                                //         }
                                //     </tr>
                                // ))
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary">
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}