import type { AuthResponse, User } from "@/domain/types";
import { httpClient } from "./http-client";

export const authService = {
  register(data: { name: string; email: string; password: string }) {
    return httpClient.request<User>("/auth/register", { method: "POST", body: data });
  },
  login(data: { email: string; password: string }) {
    return httpClient.request<AuthResponse>("/auth/login", { method: "POST", body: data });
  },
};
