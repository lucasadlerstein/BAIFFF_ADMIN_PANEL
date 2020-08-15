import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'https://api.baifff.tv'
});

export default clienteAxios;