import axios from "axios";

export const http = axios.create({
  baseURL: import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: false,
});

export const Services = {
  get: (url, config = {}) => http.get(url, config),
  post: (url, data, config = {}) => http.post(url, data, config),
  put: (url, data, config = {}) => http.put(url, data, config),
  delete: (url, config = {}) => http.delete(url, config),
};

export default Services;
