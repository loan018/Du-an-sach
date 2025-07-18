import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // hoặc từ biến môi trường .env
  withCredentials: true, // nếu dùng cookie
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

