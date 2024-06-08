//Para componente GestionCompra
export interface IndividualPixel {
    coordenada_x: number;
    coordenada_y: number;
    color: string;
}

export interface ObjToSend {
    grupo_pixeles: {
        link: string;
        coordenada_x_inicio: number;
        coordenada_y_inicio: number;
        coordenada_x_fin: number;
        coordenada_y_fin: number;
    };
    pixeles: IndividualPixel[];
}

export interface Coors {
    x: number;
    y: number;
}

export interface GestionCompraProps {
    coors: Coors;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}