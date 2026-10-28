import { afterEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "./http-client";
import { serviceService } from "./service-service";

describe("serviceService.listAll", () => {
  afterEach(() => vi.restoreAllMocks());

  it("combines every backend page before local filtering", async () => {
    const listSpy = vi.spyOn(httpClient, "request")
      .mockResolvedValueOnce({
        pagination: { page: 1, limit: 2, total: 3, totalPages: 2 },
        data: [{ id: 1, name: "Uno", description: "", category: "Desarrollo web" }],
      })
      .mockResolvedValueOnce({
        pagination: { page: 2, limit: 2, total: 3, totalPages: 2 },
        data: [{ id: 2, name: "Dos", description: "", category: "Soporte tecnológico" }, { id: 3, name: "Tres", description: "", category: "Soporte tecnológico" }],
      });

    await expect(serviceService.listAll(2)).resolves.toHaveLength(3);
    expect(listSpy).toHaveBeenNthCalledWith(1, "/services?page=1&limit=2");
    expect(listSpy).toHaveBeenNthCalledWith(2, "/services?page=2&limit=2");
  });
});
