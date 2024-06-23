import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

export const MyVerticallyCenteredModal = (props: any) => {
    useEffect(() => {
        setTimeout(() => {
            props.setShowModalCenter(false)
        }, 1500);
    }, [props.show])

    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: '150px', backgroundColor: 'aliceblue', borderRadius: '10px' }}>
                <div className="text-center">
                    <FontAwesomeIcon icon={faCircleCheck} bounce style={{ height: '50px', width: '50px', color: "#50623A", }} />
                    <h4 className="mt-2">{props.modalMessage}</h4>
                </div>
            </Modal.Body>
        </Modal>
    );
}
