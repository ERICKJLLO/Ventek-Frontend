const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzebojyd";

export class FormspreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormspreeError";
  }
}

export const formspreeService = {
  async submit(formData: FormData): Promise<void> {
    let response: Response;
    try {
      response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
    } catch {
      throw new FormspreeError("No se pudo conectar con el formulario. Inténtalo de nuevo.");
    }

    if (!response.ok) {
      throw new FormspreeError("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    }
  },
};

