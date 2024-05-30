import axios from 'axios';

const baseURL = '';
let username = process.env.basicAuth
let password = process.env.basicPassword;
let auth = btoa(`${username}:${password}`);


const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'Authorization': `Basic ${auth}`
    },
});


export default axiosInstance;
