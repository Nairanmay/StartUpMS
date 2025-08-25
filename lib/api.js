import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set JSON content-type if data is NOT FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// =============================
// AUTH ENDPOINTS
// =============================
export const loginUser = (username, password) =>
  API.post("/auth/login/", { username, password });

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
  API.get("/auth/user/", { headers: { Authorization: `Bearer ${token}` } });

export const getCurrentUser = () => API.get("/users/me/");

// =============================
// PROJECT & TASK MANAGEMENT
// =============================
export const getEmployees = async () => {
  const res = await API.get("/users/");
  return res.data;
};

export const createTask = async (taskData) => {
  let payload;
  if (taskData.document) {
    payload = new FormData();
    Object.keys(taskData).forEach((key) => {
      if (key === "assigned_to_ids" && Array.isArray(taskData[key])) {
        taskData[key].forEach((id) => payload.append("assigned_to_ids", id));
      } else {
        payload.append(key, taskData[key]);
      }
    });
  } else {
    payload = taskData;
  }
  const res = await API.post("/api/tasks/", payload);
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await API.post("/api/projects/", projectData);
  return res.data;
};

export const getMyTasks = async () => {
  const res = await API.get("/api/tasks/");
  return res.data;
};

// Fetch projects with nested tasks
export const getProjectsWithTasks = async () => {
  const res = await API.get("/api/projects/with_tasks/");
  return res.data;
};

// Mark task as completed
export const markTaskCompleted = async (taskId) => {
  const res = await API.patch(
    `/api/tasks/${taskId}/`,
    { status: "Completed" },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const res = await API.delete(`/api/tasks/${taskId}/`);
  return res.data;
};

// Remove project
export const removeProject = async (projectId) => {
  const res = await API.delete(`/api/projects/${projectId}/`);
  return res.data;
};

// =============================
// DOCUMENT UPLOAD
// =============================
export const uploadTaskDocument = async (taskId, file) => {
  const formData = new FormData();
  formData.append("document", file);

  const res = await API.post(
    `/api/tasks/${taskId}/upload-document/`,
    formData
    // Do not manually set Content-Type; Axios handles it for FormData
  );
  return res.data;
};

// =============================
// COMPANY / USER ENDPOINTS
// =============================
export const getUsersByCompany = async (companyCode) => {
  const res = await API.get(`/users/company/${companyCode}/`);
  return res.data;
};
