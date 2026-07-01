import { User } from "@/types";

// ==================== CONFIG ====================
const BASE_URL = "https://library-backend-production-b9cf.up.railway.app/api";

// ==================== AUTH ====================

export interface AuthResponse {
  token: string;
  user: User & { role: "user" | "admin" };
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login gagal");
  }

  const response = await res.json();

  // Ambil dari dalam "data"
  const { token, user } = response.data;

  return { user, token };
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registrasi gagal");
  }

  return res.json();
};