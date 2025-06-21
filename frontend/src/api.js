// // interceptor for axios writing request headers using axios interceptors 
// import axios from 'axios';
// import { ACCESS_TOKEN } from './constants';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     // withCredentials: true, 
// })

// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         // console.log("Token used in request:", token); 

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
// export default api;

// // basically written a function to get the access token from local storage and set it in the request header using axios interceptors.
// // This is done to avoid writing the same code again and again in every api call.
// // This is a good practice to keep the code clean and maintainable.
// // The api object is created using axios.create() method which takes the base URL as an argument.
// // The api object is then exported so that it can be used in other files.
// // The interceptors.request.use() method is used to add the token to the request header.
// // The config object contains the request details and we are adding the Authorization header to it.
// // The token is retrieved from local storage using the getItem() method.
// // If the token is present, it is added to the request header.
// // If the token is not present, the request is sent without the Authorization header.
// // The error is handled using the Promise.reject() method which returns a rejected promise with the error.
// // This is done to avoid writing the same code again and again in every api call.
// // This is a good practice to keep the code clean and maintainable.
// // The api object is created using axios.create() method which takes the base URL as an argument.


import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ 1. Request Interceptor – attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 2. Response Interceptor – handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is expired (401) and this is the first retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Prevent multiple refresh calls
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // 🔁 Make refresh token call
        const res = await axios.post(
          import.meta.env.VITE_API_URL + '/auth/refresh-token', // Update if your route is different
          {},
          { withCredentials: true } // send cookie refresh token
        );

        const newToken = res.data.accessToken;
        localStorage.setItem(ACCESS_TOKEN, newToken);

        api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;

        processQueue(null, newToken);

        // 🔄 Retry the failed request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem(ACCESS_TOKEN);
        window.location.href = '/login'; // or show login screen
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
