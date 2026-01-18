import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  getDoctors: () => api.get("/auth/doctors"),
};

// Appointments APIs
export const appointmentAPI = {
  create: (data) => api.post("/appointments", data),
  getMyAppointments: () => api.get("/appointments/my"),
  getDoctorPatients: () => api.get("/appointments/doctor/patients"),
  updateStatus: (id, data) => api.put(`/appointments/${id}`, data),
  markReminderSent: (id) => api.put(`/appointments/${id}/reminder`),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Health Records APIs
export const healthRecordAPI = {
  add: (data) => api.post("/health", data),
  getMyRecords: () => api.get("/health/my"),
  getPatientRecords: (patientId) => api.get(`/health/${patientId}`),
  delete: (id) => api.delete(`/health/${id}`),
};

// Blog APIs
export const blogAPI = {
  getAll: () => api.get("/blogs"),
  create: (data) => api.post("/blogs", data),
};

// Query APIs
export const queryAPI = {
  create: (data) => api.post("/queries", data),
  getAll: () => api.get("/queries"),
};

export default api;
