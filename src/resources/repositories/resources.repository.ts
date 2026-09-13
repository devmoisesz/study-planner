import type { Resource } from "../../generated/prisma/client.js";

export abstract class ResourcesRepository {
    abstract listResources(): Promise<Resource[]>;
}
