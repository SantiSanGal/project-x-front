export const Purchase = ({ xd }: any) => {
    return (
        <div className="purchase">
            <div className="purchaseData">
                <h5>Compra Nro.: {xd.compraId}</h5>
                <p>fecha: {xd.fecha}</p>
                <p>codigo afiliado: {xd.codigoAfiliado}</p>
                <p>cantidad de pixeles: {xd.cantidadDePx}</p>
                <p>monto compra: {xd.montoCompra}</p>
            </div>
            <div className="previewImg">
                <div className="imgContainer">
                    <img src="/xxx.png" alt="" />
                </div>
            </div>
        </div>
    )
}
