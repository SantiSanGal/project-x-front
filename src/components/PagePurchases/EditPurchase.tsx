import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import { EditCompraProps } from "../../interfaces";
// import { millionApi } from "../../api/millionApi";

export const EditPurchase = ({ idPurchase, show, setShow }: EditCompraProps) => {
    //TODO: En vez de consultar los pixeles individuales, traer el objeto completo del componente padre
    //los datos ya están en pixeles

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
                                //TODO: hacer una tabla de 5x5 igual que en el post
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary">
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}