import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
axiosClient.interceptors.request.use(
  (config) => {
    // This check is important to avoid errors when Next.js runs code on the server.
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          // If there's no refresh token, the user must log in again.
          console.error("No refresh token found. Redirecting to login.");
          window.location.href = '/login'; 
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem('access', access);

        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // If the refresh token itself is invalid, the session is over.
        console.error("Token refresh failed. Logging out user.", refreshError);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

