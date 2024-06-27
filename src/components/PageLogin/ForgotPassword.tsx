import style from './../../components/styles/forgotPassword.module.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import { millionApi } from '../../api/millionApi';

export const ForgotPassword = ({ show, handleClose }: any) => {

    const handleSubmit = () => {
        const emailElement = document.getElementById('emailEnviar');
        if (emailElement) {
            const email = (emailElement as HTMLInputElement).value;
            millionApi.post('auth/forgot-password', {
                email: email
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className={style.header}>
                    <Modal.Title>Password Recovery</Modal.Title>
                </Modal.Header>
                <Modal.Body className={style.body}>
                    <input type="email" id='emailEnviar' placeholder='Enter your email' />
                </Modal.Body>
                <Modal.Footer className={style.footer}>
                    <Button variant="success" onClick={handleSubmit}>
                        Send Mail
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}