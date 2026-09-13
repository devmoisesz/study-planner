import type { ResourceType } from "../../generated/prisma/client.js";

export interface CreateResourceData {
    title: string;
    type: ResourceType;
    url?: string;
    description?: string;
}

export class ResourceFactory {
    static create(data: CreateResourceData): CreateResourceData {
        return {
            title: data.title,
            type: data.type,
            url: data.url,
            description: data.description
        };
    }
}
