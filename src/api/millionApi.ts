import axios from 'axios';
let accessToken = localStorage.getItem('accessToken')

export const millionApi = axios.create({
    baseURL: 'http://localhost:3331',
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
});

//hacer que retorne true or false
export const validarToken = async () => {
    let tokenValido = true
    // await axios.get('/validar')
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))

    return tokenValido
}

