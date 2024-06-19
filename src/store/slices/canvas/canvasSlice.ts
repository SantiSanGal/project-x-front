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
        canvasPixeles: [],
        isLoading: false
    },
    reducers: {
        startLoadingCanvas: (state) => {
            state.isLoading = true;
        },
        setCanvas: (state, action) => {
            state.isLoading = false;
            state.canvasPixeles = action.payload.canvasPixeles
        }
    },
})

export const { startLoadingCanvas, setCanvas } = canvasSlice.actions;