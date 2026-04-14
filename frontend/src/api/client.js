import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE,
  // Send auth cookies (JWT) on cross-site requests to the backend.
  withCredentials: true,
});

// If a token is stored locally (set after login), send it as Bearer auth.
const storedToken = localStorage.getItem("auth_token");
if (storedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}
