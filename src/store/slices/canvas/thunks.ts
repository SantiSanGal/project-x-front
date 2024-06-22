import { millionApi } from "../../../api/millionApi"
import { AppDispatch, RootState } from "../../store"
import { setCanvas, startLoadingCanvas } from "./canvasSlice"

export const getCanvasPixeles = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(startLoadingCanvas())
        const { data } = await millionApi.get('canvas')
        dispatch(setCanvas(data))
    }
}