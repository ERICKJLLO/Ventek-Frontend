import { describe, expect, it } from "vitest";
import { hasErrors, validateAuth } from "./validation";

describe("validateAuth", () => {
  it("reports each invalid registration field", () => {
    const errors = validateAuth({ name: "A", email: "not-an-email", password: "short" }, true);
    expect(errors).toEqual({
      name: "El nombre debe tener al menos 3 caracteres.",
      email: "Introduce un correo electrónico válido.",
      password: "La contraseña debe tener al menos 8 caracteres.",
    });
    expect(hasErrors(errors)).toBe(true);
  });

  it("accepts valid login values", () => {
    expect(validateAuth({ email: "user@example.com", password: "secret" }, false)).toEqual({});
  });
});
