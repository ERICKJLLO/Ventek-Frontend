const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

class HttpClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    if (options.body !== undefined) headers.set("Content-Type", "application/json");
    if (this.token) headers.set("Authorization", `Bearer ${this.token}`);

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : "No se pudo completar la solicitud.";
      if (response.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new Event("ventek:unauthorized"));
      }
      throw new ApiError(response.status, message);
    }
    return payload as T;
  }

  async requestFormData<T>(path: string, formData: FormData, method = "POST"): Promise<T> {
    const headers = new Headers({ Accept: "application/json" });
    if (this.token) headers.set("Authorization", `Bearer ${this.token}`);
    const response = await fetch(`${API_URL}${path}`, { method, headers, body: formData });
    const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const message = typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
        ? payload.message : "No se pudo completar la solicitud.";
      if (response.status === 401 && typeof window !== "undefined") window.dispatchEvent(new Event("ventek:unauthorized"));
      throw new ApiError(response.status, message);
    }
    return payload as T;
  }
}

export const httpClient = new HttpClient();
