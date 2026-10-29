import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, httpClient } from "./http-client";

describe("HttpClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    httpClient.setToken(null);
  });

  it("sends the bearer token and JSON body", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), { status: 200 }),
    );
    httpClient.setToken("session-token");
    const result = await httpClient.request<{ id: number }>("/services", {
      method: "POST",
      body: { name: "Servicio" },
    });
    expect(result).toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/services",
      expect.objectContaining({
        headers: expect.any(Headers),
        body: JSON.stringify({ name: "Servicio" }),
      }),
    );
    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer session-token");
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it.each([
    [401, "Token inválido o expirado"],
    [403, "No tienes permisos suficientes"],
    [500, "Error interno del servidor"],
  ])("exposes API error status %s and message", async (status, message) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message }), { status }),
    );
    await expect(httpClient.request("/private")).rejects.toEqual(
      new ApiError(status, message),
    );
  });

  it("emits an unauthorized event for an expired session", async () => {
    const handler = vi.fn();
    window.addEventListener("ventek:unauthorized", handler);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Token inválido o expirado" }), { status: 401 }),
    );
    await expect(httpClient.request("/private")).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener("ventek:unauthorized", handler);
  });

  it("handles a successful empty 204 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    await expect(httpClient.request("/services/1", { method: "DELETE" })).resolves.toBeNull();
  });

  it("sends multipart form data without overriding its content type", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), { status: 200 }),
    );
    const formData = new FormData();
    formData.set("file", new File(["image"], "profile.png", { type: "image/png" }));
    httpClient.setToken("session-token");

    await expect(httpClient.requestFormData<{ id: number }>("/auth/me/avatar", formData)).resolves.toEqual({ id: 1 });
    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("******");
    expect(headers.get("Content-Type")).toBeNull();
    expect(fetchMock.mock.calls[0][1]?.body).toBe(formData);
  });
});
