import style from './../../pages/styles/pagePurchases.module.css'

export const Purchase = ({ purchase }: any) => {
    return (
        <div className={style.purchase}>
            <div className={style.purchaseData}>
                <h5>Compra Nro.: {purchase.id_datos_compra}</h5>
                <p>Fecha: {purchase.fecha}</p>
                <p>Link: {purchase.link_adjunta}</p>
                <p>Monto: {purchase.monto}</p>
            </div>
            <div className={style.previewImg}>
                <div className={style.imgContainer}>
                    <img src="/xxx.png" alt="" />
                </div>
                <button className='btn btn-success'>Editar</button>
            </div>
        </div>
    )
}
