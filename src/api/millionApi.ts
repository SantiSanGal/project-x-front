import axios from 'axios';

export const millionApi = axios.create({
    baseURL: 'http://localhost:3331',
});

export const validarToken = async () => {
    let accessToken = localStorage.getItem('accessToken')

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
