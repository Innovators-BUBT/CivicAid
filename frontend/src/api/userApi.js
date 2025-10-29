import axios from 'axios';

// Create axios instance with default configuration
const API = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API functions
export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const forgotPassword = (data) => API.post('/users/forgot-password', data);
export const resetPassword = (data) => API.post('/users/reset-password', data);
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (data) => API.put('/users/profile', data);

// Complaint API functions
export const submitComplaint = (data) => API.post('/complaints/submit', data);
export const getUserComplaints = (params) => API.get('/complaints/my-complaints', { params });
export const getComplaintById = (id) => API.get(`/complaints/${id}`);
export const updateComplaint = (id, data) => API.put(`/complaints/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/complaints/${id}`);
export const searchComplaints = (params) => API.get('/complaints/search', { params });
export const addComment = (id, data) => API.post(`/complaints/${id}/comments`, data);

// Admin API functions
export const getAllComplaints = (params) => API.get('/complaints/admin/all', { params });
export const updateComplaintStatus = (id, data) => API.put(`/complaints/admin/${id}/status`, data);
export const assignComplaint = (id, data) => API.put(`/complaints/admin/${id}/assign`, data);
export const getComplaintStats = () => API.get('/complaints/admin/stats');
export const getAllUsers = () => API.get('/users');
export const getAvailableVolunteers = () => API.get('/users/available-volunteers');

// Task API functions
export const createTask = (data) => API.post('/tasks', data);
export const getTasks = () => API.get('/tasks');
export const getMyTasks = () => API.get('/tasks/my-tasks');
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const assignTask = (id, data) => API.put(`/tasks/${id}/assign`, data);
export const updateTaskProgress = (id, data) => API.put(`/tasks/${id}/progress`, data);
export const getTaskStats = () => API.get('/tasks/stats');
export const getAvailableAssignees = (params) => API.get('/tasks/available-assignees', { params });

export default API;
