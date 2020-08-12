import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://api.baifff.tv'
});

export default clienteAxios;