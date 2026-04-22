import axios from "axios";

/* ─────────────────────────────────────────────
   AXIOS INSTANCE
───────────────────────────────────────────── */
const API = axios.create({
  baseURL: "https://routerhub-backend.onrender.com/api",
  timeout: 15000,
});

/* ─────────────────────────────────────────────
   REQUEST INTERCEPTOR
───────────────────────────────────────────── */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ensure headers object exists
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ─────────────────────────────────────────────
   RESPONSE INTERCEPTOR
───────────────────────────────────────────── */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // 🔒 Unauthorized → logout
    if (status === 401) {
      console.warn("🔒 Session expired or invalid token");

      localStorage.removeItem("token");

      // avoid redirect loop
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // 🚫 Forbidden (admin issue)
    if (status === 403) {
      console.warn("⛔ Admin access required");
    }

    // 🌐 Network / server down
    if (!error.response) {
      console.error("🌐 Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

/* ─────────────────────────────────────────────
   HELPER METHODS (OPTIONAL)
───────────────────────────────────────────── */
export const apiGet = (url, config = {}) => API.get(url, config);
export const apiPost = (url, data, config = {}) => API.post(url, data, config);
export const apiPut = (url, data, config = {}) => API.put(url, data, config);
export const apiDelete = (url, config = {}) => API.delete(url, config);

/* ─────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────── */
export default API;