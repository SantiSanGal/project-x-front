import style from './../../components/styles/forgotPassword.module.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import { millionApi } from '../../api/millionApi';
import { validateEmail } from '../../utils/funcionesUtiles';
import { useState } from 'react';

export const ForgotPassword = ({ show, handleClose }: any) => {
    const [showError, setshowError] = useState<boolean>(false)
    const [messageError, setMessageError] = useState<string>('')
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    const handleSubmit = () => {
        const emailElement = document.getElementById('emailEnviar');
        if (emailElement) {
            const email = (emailElement as HTMLInputElement).value;

            if (email.length < 5) {
                setMessageError("Email should be at least 5 characters long.");
                setshowError(true);
                return;
            }

            if (email.length > 255) {
                setMessageError("Email should not exceed 255 characters.");
                setshowError(true);
                return;
            }

            if (!validateEmail(email)) {
                setMessageError("Please enter a valid email address.");
                setshowError(true);
                return;
            }

            millionApi.post('auth/forgot-password', {
                email: email
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });
        }
    };

    const handleInput = () => {
        setshowError(false)
        const emailElement = document.getElementById('emailEnviar');
        if (emailElement) {
            const email = (emailElement as HTMLInputElement).value;
            let valid = true;

            if (email.length <= 5) {
                setMessageError('Email should be at least 5 characters long');
                valid = false;
            } else if (email.length > 255) {
                setMessageError('Email should not exceed 255 characters');
                valid = false;
            } else if (!validateEmail(email)) {
                setMessageError('Please enter a valid email address');
                valid = false;
            }

            setIsDisabled(!valid);
            if (!valid) {
                setshowError(true);
            }
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className={`${style.header} ${style.noBorder}`}>
                    <Modal.Title>Password Recovery</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${style.body} ${style.noBorder}`}>
                    <input type="email" id='emailEnviar' placeholder='Enter your email' onInput={handleInput} />
                    {showError && <p className={style.errorMessage}>{messageError}</p>}
                </Modal.Body>
                <Modal.Footer className={`${style.footer} ${style.noBorder}`}>
                    <Button variant="success" onClick={handleSubmit} disabled={isDisabled}>
                        Send Mail
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
    
}
