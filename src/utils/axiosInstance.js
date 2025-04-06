// src/utils/axiosInstance.js
import axios from "axios";
import { BASE_API_URL } from "../config/config";

const instance = axios.create({
  baseURL: BASE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;