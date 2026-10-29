import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormspreeContactForm } from "./FormspreeContactForm";
import { formspreeService } from "../services/formspree-service";

describe("FormspreeContactForm", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  function fillForm() {
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana López" } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText("Servicio"), { target: { value: "pagina-web" } });
    fireEvent.change(screen.getByLabelText("Tipo de cliente"), { target: { value: "persona" } });
    fireEvent.change(screen.getByLabelText("Cuéntanos qué necesitas"), { target: { value: "Necesito una página para mi negocio." } });
  }

  it("shows success only after Formspree accepts the request", async () => {
    vi.spyOn(formspreeService, "submit").mockResolvedValue(undefined);
    render(<FormspreeContactForm />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: "Enviar solicitud" }).closest("form")!);

    expect((await screen.findByRole("dialog")).getAttribute("hidden")).toBeNull();
  });

  it("prevents duplicate submissions while the request is pending", async () => {
    let resolveRequest!: () => void;
    const submitSpy = vi.spyOn(formspreeService, "submit").mockImplementation(
      () => new Promise<void>((resolve) => { resolveRequest = resolve; }),
    );
    render(<FormspreeContactForm />);
    fillForm();
    const form = screen.getByRole("button", { name: "Enviar solicitud" }).closest("form")!;

    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(submitSpy).toHaveBeenCalledOnce();
    resolveRequest();
    await waitFor(() => expect((screen.getByRole("button", { name: "Enviar solicitud" }) as HTMLButtonElement).disabled).toBe(false));
  });
});
