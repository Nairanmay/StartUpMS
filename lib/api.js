import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

// AUTH ENDPOINTS
export const loginUser = (username, password) => {
  console.log("Sending payload:", { username, password });
  return API.post("/auth/login/", { username, password });
};

export const registerUser = (data) =>
  API.post("/auth/register/", {
    username: data.username,
    email: data.email,
    password1: data.password1,
    password2: data.password2,
    role: data.role,
    company_code: data.company_code || null,
  });

export const getUser = (token) =>
  API.get("/auth/user/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ✅ New: Get current logged-in user details
export const getCurrentUser = () => {
  return API.get("/users/me/"); // Make sure your backend has /users/me/ route
};

// TASK MANAGEMENT ENDPOINTS
export const getEmployees = async () => {
  const res = await API.get("/users/");
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await API.post("/api/tasks/", taskData);  // include /api/
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await API.post("/api/projects/", projectData);  // include /api/
  return res.data;
};


export const getMyTasks = async () => {
  const res = await API.get("/api/tasks/");
  return res.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const res = await API.patch(`/api/tasks/${taskId}/`, { status });
  return res.data;
};

// ✅ Get all users for a company
export const getUsersByCompany = (companyCode) =>
  API.get(`/users/company/${companyCode}/`);

export const deleteTask = async (taskId) => {
  const res = await API.delete(`/api/tasks/${taskId}/`);
  return res.data;
};