import { afterEach, describe, expect, it, vi } from "vitest";
import { FormspreeError, formspreeService } from "./formspree-service";

describe("formspreeService", () => {
  afterEach(() => vi.restoreAllMocks());

  it("accepts a successful Formspree response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
    const formData = new FormData();
    formData.set("name", "Ana");

    await expect(formspreeService.submit(formData)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://formspree.io/f/mzebojyd",
      expect.objectContaining({ method: "POST", body: formData }),
    );
  });

  it("rejects a non-successful response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 422 }));

    await expect(formspreeService.submit(new FormData())).rejects.toEqual(
      new FormspreeError("No se pudo enviar la solicitud. Inténtalo de nuevo."),
    );
  });

  it("rejects network failures with a user-facing error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Network error"));

    await expect(formspreeService.submit(new FormData())).rejects.toEqual(
      new FormspreeError("No se pudo conectar con el formulario. Inténtalo de nuevo."),
    );
  });
});

