import axios from 'axios';
import { auth } from '../services/firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    try {
        if (auth.currentUser) {
            const token = await auth.currentUser.getIdToken(false);
            localStorage.setItem('authToken', token);
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            const stored = localStorage.getItem('authToken');
            if (stored) {
                config.headers.Authorization = `Bearer ${stored}`;
            }
        }
    } catch (error) {
        console.error('Token attach error:', error);
        const stored = localStorage.getItem('authToken');
        if (stored) {
            config.headers.Authorization = `Bearer ${stored}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api;