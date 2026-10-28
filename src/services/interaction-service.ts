import type { Interaction, InteractionInput } from "@/domain/types";
import { httpClient } from "./http-client";

export const interactionService = {
  create(data: InteractionInput) {
    return httpClient.request<Interaction>("/interactions", { method: "POST", body: data });
  },
  mine() {
    return httpClient.request<Interaction[]>("/interactions/mias");
  },
  all() {
    return httpClient.request<Interaction[]>("/interactions");
  },
};
