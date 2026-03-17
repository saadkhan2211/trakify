import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("trakify-auth");
    if (raw) {
      const { state } = JSON.parse(raw);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try {
        localStorage.removeItem("trakify-auth");
      } catch {}
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
