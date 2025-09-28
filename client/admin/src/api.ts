import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export function setAdminToken(token?: string) {
  if (token) {
    localStorage.setItem("adminToken", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("adminToken");
    delete api.defaults.headers.common.Authorization;
  }
}

const saved = localStorage.getItem("adminToken");
if (saved) setAdminToken(saved);
