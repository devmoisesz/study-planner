import type { Resource } from "../../generated/prisma/client.js";

/** Recurso com o titulo da tarefa de origem, para a listagem geral. */
export type ResourceWithTask = Resource & { taskTitle: string };

export abstract class ResourcesRepository {
    abstract listResources(): Promise<ResourceWithTask[]>;
}
