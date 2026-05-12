import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = (email) => api.get(`/faculty/${email}`);
export const getFacultyList = () => api.get('/faculty');
export const getStats = () => api.get('/faculty/stats');
export const updateProfile = (data) => api.post('/faculty/update', data);
export const addPublication = (data) => api.post('/faculty/publications', data);
export const addProject = (data) => api.post('/faculty/projects', data);
export const addPatent = (data) => api.post('/faculty/patents', data);
export const addWorkshop = (data) => api.post('/faculty/workshops', data);
export const addNptel = (data) => api.post('/faculty/nptel', data);
export const uploadImage = (formData) => api.post('/faculty/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
