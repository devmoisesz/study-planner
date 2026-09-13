import { ResourcesRepository } from "../resources.repository.js";
import type { CreateResourceData } from "../resources.repository.js";
import type { ResourceWithTask } from "../resources.repository.js";

export class ResourcesInMemory extends ResourcesRepository {
    public items: ResourceWithTask[] = [];

    async listResources(): Promise<ResourceWithTask[]> {
        return [...this.items].sort(
            (first, second) =>
                second.createdAt.getTime() - first.createdAt.getTime()
        );
    }

    async create(data: CreateResourceData): Promise<ResourceWithTask> {
        const resource: ResourceWithTask = {
            id: crypto.randomUUID(),
            ...data,
            description: data.description ?? null,
            createdAt: new Date(),
            taskTitle: ""
        };

        this.items.push(resource);
        return resource;
    }
}
