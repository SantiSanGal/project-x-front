import axios from 'axios';

export const millionApi = axios.create({
    baseURL: 'http://localhost:3333',
});