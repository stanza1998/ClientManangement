import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7286/', // replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
