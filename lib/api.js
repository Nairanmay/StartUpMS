import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

export const loginUser = (username, password) => {
  console.log("Sending payload:", { username, password }); // Debug
  return API.post('/auth/login/', { username, password });
};

export const registerUser = (data) =>
  API.post('/auth/register/', {
    username: data.username,
    email: data.email,
    password1: data.password1,        // ✅ Convert to password1
    password2: data.password2, // ✅ Convert to password2
    role: data.role,
    company_code: data.company_code || null,
  });

export const getUser = (token) =>
  API.get('/auth/user/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
