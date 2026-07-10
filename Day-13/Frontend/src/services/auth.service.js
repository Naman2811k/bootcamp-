import axios from "axios";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI || "http://localhost:3000",
  withCredentials: true,
});

export const register = async ({ email, username, password }) => {
  const res = await apiInstance.post("/api/auth/register", {
    email,
    username,
    password,
  });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await apiInstance.post("/api/auth/login", {
    email,
    password,
  });
  return res.data;
};

export const Logout = async () => {
  const res = await apiInstance.post("/api/auth/logout");
  return res.data;
};
