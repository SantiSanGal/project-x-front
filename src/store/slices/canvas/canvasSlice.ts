import { createSlice } from "@reduxjs/toolkit";

/**
 * La idea de esto es que como la imagen se actualiza cada 24hs para público general
 * con esto voy a consultar en la base de datos los px que aún no se hayan pintado 
 * en la actualización diaria cuando un usuario inicie sesión. Luego con los eventos ws
 * se vayan pintando los pixeles
 */
export const canvasSlice = createSlice({
    name: 'user',
    initialState: {
        canvasPixeles: [], //pixeles sin pintar desde la última actualización de cada 24hs
        rangoUnoOcupado: [], //rango de pixeles de 5x5 ocupados en el sector 1
        rangoDosOcupado: [], //rango de pixeles de 5x5 ocupados en el sector 2
        rangoTresOcupado: [], //rango de pixeles de 5x5 ocupados en el sector 3
        rangoCuatroOcupado: [], //rango de pixeles de 5x5 ocupados en el sector 4
        isLoading: false
    },
    reducers: {
        startLoadingCanvas: (state) => {
            state.isLoading = true;
        },
        setCanvas: (state, action) => {
            state.isLoading = false;
            state.canvasPixeles = action.payload.canvasPixeles
        },
        setRangosOcupados: (state, action) => {
            switch (action.payload.sector) {
                case 1:
                    state.rangoUnoOcupado = []
                    break;
                case 2:
                    state.rangoDosOcupado = []
                    break;
                case 3:
                    state.rangoTresOcupado = []
                    break;
                case 4:
                    state.rangoCuatroOcupado = []
                    break;
                default:
                    break;
            }
        }
    },
})

export const { startLoadingCanvas, setCanvas } = canvasSlice.actions;