interface Purchase {
    id_datos_compra: Number
    link_adjunta: String
    monto: Number
}

interface IndividualPixel {
    coordenada_x: number;
    coordenada_y: number;
    color: string;
}

interface ObjToSend {
    grupo_pixeles: {
        link: string;
        coordenada_x_inicio: number;
        coordenada_y_inicio: number;
        coordenada_x_fin: number;
        coordenada_y_fin: number;
    };
    pixeles: IndividualPixel[];
}

interface Coors {
    x: number;
    y: number;
}

interface GestionCompraProps {
    coors: Coors;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}