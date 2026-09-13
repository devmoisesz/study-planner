import { ResourcesRepository } from "../resources.repository.js";
import type { ResourceWithTask } from "../resources.repository.js";

export class ResourcesInMemory extends ResourcesRepository {
    public items: ResourceWithTask[] = [];

    async listResources(): Promise<ResourceWithTask[]> {
        return [...this.items].sort(
            (first, second) =>
                second.createdAt.getTime() - first.createdAt.getTime()
        );
    }
}
