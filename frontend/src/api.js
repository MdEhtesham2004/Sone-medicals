// interceptor for axios writing request headers using axios interceptors 
import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;

// basically written a function to get the access token from local storage and set it in the request header using axios interceptors.
// This is done to avoid writing the same code again and again in every api call.
// This is a good practice to keep the code clean and maintainable.
// The api object is created using axios.create() method which takes the base URL as an argument.
// The api object is then exported so that it can be used in other files.
// The interceptors.request.use() method is used to add the token to the request header.
// The config object contains the request details and we are adding the Authorization header to it.
// The token is retrieved from local storage using the getItem() method.
// If the token is present, it is added to the request header.
// If the token is not present, the request is sent without the Authorization header.
// The error is handled using the Promise.reject() method which returns a rejected promise with the error.
// This is done to avoid writing the same code again and again in every api call.
// This is a good practice to keep the code clean and maintainable.
// The api object is created using axios.create() method which takes the base URL as an argument.
