import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔐 Request interceptor — sumber token SATU
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken(); // 🔥 BENAR
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚪 Response interceptor — JANGAN brutal
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn("⚠️ Unauthorized request:", err.config?.url);
      // ❌ JANGAN auto logout dulu
    }
    return Promise.reject(err);
  }
);

export default api;
