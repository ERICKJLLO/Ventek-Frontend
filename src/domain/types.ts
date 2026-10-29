export type UserRole = "user" | "admin" | string;

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  profileImageUrl?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ServicesResponse {
  pagination: Pagination;
  data: Service[];
}

export interface Interaction {
  id: number;
  userId: number;
  serviceId: number;
  message: string;
  createdAt: string;
  service?: Service;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface ServiceInput {
  name: string;
  description: string;
  category: string;
}

export interface InteractionInput {
  serviceId: number;
  message: string;
}
