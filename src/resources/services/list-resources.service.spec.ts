import { describe, expect, it, vi } from "vitest";
import type { ResourcesRepository } from "../repositories/resources.repository.js";
import { ListResourcesService } from "./list-resources.service.js";

describe("List Resources Service", () => {
  it("should return the resources provided by the repository", async () => {
    const resources = [
      { id: "resource-1", title: "Aula de Trigonometria", taskTitle: "Estudar Trigonometria" }
    ];
    const resourcesRepository = {
      listResources: vi.fn().mockResolvedValue(resources)
    } as unknown as ResourcesRepository;
    const sut = new ListResourcesService(resourcesRepository);

    const result = await sut.execute();

    expect(result).toEqual(resources);
    expect(resourcesRepository.listResources).toHaveBeenCalledOnce();
  });
});
