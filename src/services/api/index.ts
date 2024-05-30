import axios from 'axios';
import axiosInstance from './axiosConfig';


const baseURL = '';

type Request = {
    url: string;
    body?: any;
    auth?: boolean;
};

const get = async ({ url, auth = true }: Request) => {
    return (await (auth ? axiosInstance.get(url) : axios.get(baseURL + url))).data;
};
const api = {
    get,
};

export default api;
