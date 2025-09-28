import { api, setAdminToken } from "./api";

export async function adminLogin(email: string, password: string) {
  const { data } = await api.post("/admin/auth/login", { email, password });
  setAdminToken(data.token);
  return data;
}

export async function adminMe() {
  const { data } = await api.get("/admin/auth/me");
  return data;
}

export function adminLogout() {
  setAdminToken(undefined);
}
