import axios from 'axios';
import { auth } from '../services/firebase';

// Base API configuration
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Attach auth token
api.interceptors.request.use(async config => {
    let token = localStorage.getItem('authToken');

    // Check if Firebase has a current user and try to get a fresh token
    if (auth.currentUser) {
        try {
            token = await auth.currentUser.getIdToken();
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.error("Error refreshing token:", error);
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            // Optionally redirect to login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
