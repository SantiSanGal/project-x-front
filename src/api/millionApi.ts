import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../interfaces';

export const millionApi = axios.create({
    baseURL: 'http://localhost:3331',
});

export const validarToken = async () => {
    const { accessToken } = useSelector((state: RootState) => ({
        accessToken: state.accessToken
    }));

    let tokenValido = false;

    try {
        const res = await millionApi.get('/auth/verify', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log('res', res);
        tokenValido = true;
    } catch (err) {
        console.log('err', err);
    }

    return tokenValido;
}
