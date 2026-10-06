import axios from "axios";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://routerhub-backend.onrender.com/api";

const baseURL = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
