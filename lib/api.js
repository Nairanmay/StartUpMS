import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Django backend URL
});

export const registerUser = (data) => API.post('/auth/register/', data);
export const loginUser = (data) => API.post('/auth/login/', data);
export const getUser = (token) =>
  API.get('/auth/user/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
