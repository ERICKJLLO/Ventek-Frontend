import type { Service, ServiceInput, ServicesResponse } from "@/domain/types";
import { httpClient } from "./http-client";

export const serviceService = {
  list(page = 1, limit = 6) {
    return httpClient.request<ServicesResponse>(`/services?page=${page}&limit=${limit}`);
  },
  async listAll(limit = 100) {
    const firstPage = await this.list(1, limit);
    const services = [...firstPage.data];
    for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
      const response = await this.list(page, limit);
      services.push(...response.data);
    }
    return services;
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
