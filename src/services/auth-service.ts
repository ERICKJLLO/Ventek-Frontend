import type { AuthResponse, User } from "@/domain/types";
import { httpClient } from "./http-client";

export const authService = {
  register(data: { name: string; email: string; password: string }) {
    return httpClient.request<User>("/auth/register", { method: "POST", body: data });
  },
  login(data: { email: string; password: string }) {
    return httpClient.request<AuthResponse>("/api/auth/login", { method: "POST", body: data });
  },
  me() {
    return httpClient.request<User>("/auth/me");
  },
  updateProfile(data: { name: string; email: string; phone: string | null }) {
    return httpClient.request<User>("/auth/me", { method: "PUT", body: data });
  },
  changePassword(data: { currentPassword: string; newPassword: string }) {
    return httpClient.request<null>("/auth/me/password", { method: "PUT", body: data });
  },
};
