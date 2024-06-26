import { millionApi } from "../../../api/millionApi"
import { AppDispatch, RootState } from "../../store"
import { setCanvas, setRangosOcupados, startLoadingCanvas } from "./canvasSlice"

export const getCanvasPixeles = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(startLoadingCanvas())
        // const { data } = await millionApi.get('canvas')
        // console.log('data pixeles', data);
        // dispatch(setCanvas(data))
    }
}

export const getPixelesOcupados = (idSector: number, accessToken: string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const { data } = await millionApi.get(`/canvas/rangosOcupados/${idSector}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        dispatch(setRangosOcupados({ sector: idSector, data: data.data }))
        console.log('data pixeles Ocupados', data);
    }
}