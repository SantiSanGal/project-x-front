export const Purchase = ({ purchase }: any) => {
    return (
        <div className="purchase">
            <div className="purchaseData">
                <h5>Compra Nro.: {purchase.compraId}</h5>
                <p>fecha: {purchase.fecha}</p>
                <p>codigo afiliado: {purchase.codigoAfiliado}</p>
                <p>cantidad de pixeles: {purchase.cantidadDePx}</p>
                <p>monto compra: {purchase.montoCompra}</p>
            </div>
            <div className="previewImg">
                <div className="imgContainer">
                    <img src="/xxx.png" alt="" />
                </div>
            </div>
        </div>
    )
}
