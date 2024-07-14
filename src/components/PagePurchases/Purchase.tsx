import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from './../styles/pagePurchases.module.css'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { TypePurchase } from '../../interfaces';
import { EditPurchase } from './EditPurchase';
import { useState } from 'react';

interface PurchaseProps {
    purchase: TypePurchase;
}

export const Purchase: React.FC<PurchaseProps> = ({ purchase }: any) => {
    console.log('purchase', purchase);

    const [show, setShow] = useState(false)
    return (
        <div className={style.purchase}>
            <EditPurchase
                idPurchase={purchase.id_datos_compra}
                show={show}
                setShow={setShow}
            />

            <div className={style.purchaseData}>
                <h5>Purchase: {purchase.id_datos_compra}</h5>
                <p>Date: {purchase.fecha}</p>
                <p>Link: {purchase.link_adjunta}</p>
                <p>Amount: {purchase.monto}</p>
            </div>
            <div className={style.previewImg}>
                <div className={style.imgContainer}>
                    {/* TODO: tengo los pixeles individuales, recorrer y mostrar en un mini canvas */}
                    <img src="/xxx.png" alt="" />
                </div>
                <button
                    className={`btn btn-success ${style.btnEdit}`}
                    onClick={() => setShow(true)}
                >
                    Edit
                    &nbsp;
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </div>
        </div>
    )
}
