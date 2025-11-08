import axios from "axios";

// ✅ Create an Axios instance
export const api = axios.create({
  baseURL: "https://dems-backend.vercel.app/api",   // ✅ UPDATED HERE
});

// ✅ Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("demp-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Optional: handle unauthorized responses (e.g., token expired)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized — token may be invalid.");
      // Optional: auto logout
    }
    return Promise.reject(err);
  }
);
