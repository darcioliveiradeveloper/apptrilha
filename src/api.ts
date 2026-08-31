const BASE = "/api";

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data as { error?: string }).error) || "Algo deu errado. Tente novamente.";
    throw new Error(message);
  }
  return data as T;
}

export const TOKEN_KEY = "trilha:token:v1";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

export function apiLogin(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function apiRegister(payload: { name: string; email: string; password: string; code: string }) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function apiMe(token: string) {
  return request<{ user: User }>("/auth/me", { method: "GET" }, token);
}

export interface ActivationCode {
  id: string;
  code: string;
  usedBy: string | null;
  usedAt: string | null;
  createdAt: string;
}

export function apiListCodes(token: string) {
  return request<{ codes: ActivationCode[] }>("/codes", { method: "GET" }, token);
}

export function apiCreateCode(token: string) {
  return request<{ code: ActivationCode }>("/codes", { method: "POST" }, token);
}

export function apiDeleteCode(token: string, id: string) {
  return request<{ ok: boolean }>(`/codes/${id}`, { method: "DELETE" }, token);
}

export function apiChangeCode(token: string, id: string) {
  return request<{ code: ActivationCode }>(`/codes/${id}/change`, { method: "POST" }, token);
}
