import axios from 'axios';

export const millionApi = axios.create({
    baseURL: 'http://localhost:3331',
});

//hacer que retorne true or false
export const validarToken = async () => {
    let tokenValido = true
    // await axios.get('/validar')
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))

    return tokenValido
}

