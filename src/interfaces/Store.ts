export interface UserState {
    user: {
        isLogged: boolean;
        accessToken: string;
    };
}

export interface CanvasState {
    canvas: {
        canvasPixeles: [],
        rangoUnoOcupado: [],
        rangoDosOcupado: [],
        rangoTresOcupado: [],
        rangoCuatroOcupado: [],
        isLoading: boolean
    };
}