import type { Service, ServiceInput, ServicesResponse } from "@/domain/types";
import { httpClient } from "./http-client";

export const serviceService = {
  list(page = 1, limit = 6) {
    return httpClient.request<ServicesResponse>(`/services?page=${page}&limit=${limit}`);
  },
  create(data: ServiceInput) {
    return httpClient.request<Service>("/services", { method: "POST", body: data });
  },
  update(id: number, data: Partial<ServiceInput>) {
    return httpClient.request<Service>(`/services/${id}`, { method: "PUT", body: data });
  },
  remove(id: number) {
    return httpClient.request<null>(`/services/${id}`, { method: "DELETE" });
  },
};
