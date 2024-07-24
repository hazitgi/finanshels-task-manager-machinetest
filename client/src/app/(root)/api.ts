// lib/axios.ts
import axios from 'axios';

// Create an Axios instance
let svc_name = "ingress-nginx-controller";
let ingress_nginx = "ingress-nginx";
let baseURL = 'https://localhost:4000/api' // Replace with your Ingress Nginx controller URL;

if (typeof window === "undefined") {
    baseURL = `https://${svc_name}.${ingress_nginx}.svc.cluster.local`
} else {
    if (process?.env?.NEXT_PUBLIC_API_BASE_URL) {
        baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
    }
}
const API = axios.create({
    baseURL: baseURL, // Replace with your API base URL
    timeout: 10000, // Set a timeout as needed
});

// Request Interceptor
API.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
API.interceptors.response.use(
    (response) => {
        // Handle responses here, e.g., log them
        return response;
    },
    (error) => {
        // Handle errors here, e.g., show notifications
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else {
            console.error('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);

export default API;
