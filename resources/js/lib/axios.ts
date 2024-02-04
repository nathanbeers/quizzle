import Axios, { AxiosInstance } from 'axios';

const backendUrl: string = 'https://quizzle-newnew.test/api';

const axios: AxiosInstance = Axios.create({
    baseURL: backendUrl,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
});

export default axios;
