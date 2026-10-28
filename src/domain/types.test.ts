import { describe, expect, it } from "vitest";
import type { AuthResponse, ServicesResponse } from "./types";

describe("backend response contracts", () => {
  it("represents the paginated service response", () => {
    const response: ServicesResponse = {
      pagination: { page: 2, limit: 6, total: 9, totalPages: 2 },
      data: [{ id: 7, name: "Servicio", description: "Descripción", category: "Soporte tecnológico" }],
    };
    expect(response.pagination.totalPages).toBe(2);
    expect(response.data[0].category).toBe("Soporte tecnológico");
  });

  it("represents the login token and user returned by the backend", () => {
    const response: AuthResponse = {
      token: "token",
      user: { id: 1, name: "Usuario", email: "usuario@example.com", role: "user" },
    };
    expect(response.user.role).toBe("user");
  });
});
