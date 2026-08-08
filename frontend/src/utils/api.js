import axios from "axios";
import config from "../../config";

const API = axios.create({
  baseURL: config.baseURL,
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;