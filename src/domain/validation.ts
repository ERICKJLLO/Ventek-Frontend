export interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  serviceId?: string;
  message?: string;
  description?: string;
  category?: string;
}

export function validateAuth(
  values: { name?: string; email: string; password: string },
  isRegister: boolean,
): FieldErrors {
  const errors: FieldErrors = {};
  if (isRegister && values.name !== undefined && values.name.trim().length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Introduce un correo electrónico válido.";
  }
  if (values.password.length < (isRegister ? 8 : 1)) {
    errors.password = isRegister
      ? "La contraseña debe tener al menos 8 caracteres."
      : "La contraseña es obligatoria.";
  }
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
