import { millionApi } from "@/api/million.api";

export const getEstadoPago = async (isLogged: boolean, hashPedido: string) => {
    console.log('getEstadoPago hashPedido', hashPedido);


    try {
        if (isLogged) {
            const { data } = await millionApi.get(`/consultarEstadoPago/${hashPedido}`);
            console.log('getEstadoPago data', data);
            return data.data;
        } else {
            return []
        }
    } catch (error) {
        throw error;
    }
};