import { ResourceFactory } from "./resource.factory.js";
import type { CreateResourceData } from "./resource.factory.js";

export interface CreateTaskData {
    title: string;
    description?: string;
    score: number;
    resources?: CreateResourceData[];
}

export class TaskFactory {
    static create(data: CreateTaskData): CreateTaskData {
        return {
            title: data.title,
            description: data.description,
            score: data.score,
            resources: data.resources?.map((resource) =>
                ResourceFactory.create(resource)
            )
        };
    }
}
