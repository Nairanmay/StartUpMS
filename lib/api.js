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
  
  if (taskData instanceof FormData) {
    payload = taskData;
  } else if (taskData.document) {
    payload = new FormData();
    Object.keys(taskData).forEach((key) => {
      // FIX: Changed back to assigned_to_ids to match the custom serializer field
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
// DOCUMENT UPLOAD (Tasks)
// =============================
export const uploadTaskDocument = async (taskId, file) => {
  const formData = new FormData();
  formData.append("document", file);

// FIX: Removed the manual headers so Axios can automatically 
  // set 'multipart/form-data' along with the required boundary string.
  const res = await API.post("/api/documents/", formData);
  return res.data;
};

// =============================
// COMPANY / USER ENDPOINTS
// =============================
export const getUsersByCompany = async (companyCode) => {
  const res = await API.get(`/users/company/${companyCode}/`);
  return res.data;
};

// =============================
// DOCUMENT HUB ENDPOINTS
// =============================

export const getDocuments = async (search = "") => {
  const res = await API.get("/api/documents/", {
    params: { search },
  });
  return res.data;
};

export const uploadDocument = async (file, title, description, userId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  if (description) formData.append("description", description);
  
  // FIX 1: Append the user ID so the backend knows who uploaded it
  if (userId) formData.append("uploaded_by", userId);

  // FIX 2: Removed the manual headers so Axios can automatically set the boundary
  const res = await API.post("/api/documents/", formData);
  return res.data;
};

export const deleteDocument = async (docId) => {
  const res = await API.delete(`/api/documents/${docId}/`);
  return res.data;
};
// =============================
// COMPANY PROFILE ENDPOINTS
// =============================
export const getCompanyProfile = async () => {
  const res = await API.get("/api/company-profile/");
  return res.data;
};

export const updateCompanyProfile = async (data) => {
  const res = await API.post("/api/company-profile/", data);
  return res.data;
};

export const getPitchDeckAnalysis = async () => {
  try {
    const res = await API.get("/api/pitchdeck/analyze/");
    return res.data;
  } catch (error) {
    // FIX: If the error is 404, it just means no deck exists yet.
    // Return null silently so the dashboard treats it as "No Data" instead of a crash.
    if (error.response && error.response.status === 404) {
      return null;
    }
    
    // For other errors (500, Network Error), keep logging them
    console.error("Error fetching pitch deck:", error);
    return null;
  }
};