export interface TypePurchase {
    id_datos_compra: number;
    fecha: string;
    link_adjunta: string;
    monto: string;
}

export interface EditCompraProps {
    idPurchase: number;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
