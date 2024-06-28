import { millionApi } from "../../../api/millionApi"
import { AppDispatch, RootState } from "../../store"
import { setCanvas, setRangosOcupados, startLoadingCanvas } from "./canvasSlice"

export const getCanvasPixeles = (accessToken: string) => {
    return async (dispatch: AppDispatch, _getState: () => RootState) => {
        dispatch(startLoadingCanvas())
        const { data } = await millionApi.get('canvas', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log('data pixeles', data);
        dispatch(setCanvas(data))
    }
}

export const getPixelesOcupados = (idSector: number, accessToken: string) => {
    return async (dispatch: AppDispatch, _getState: () => RootState) => {
        const { data } = await millionApi.get(`/canvas/rangosOcupados/${idSector}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        dispatch(setRangosOcupados({ sector: idSector, data: data.data }));
        return data.data; // Devolver la data obtenida
    };
};
