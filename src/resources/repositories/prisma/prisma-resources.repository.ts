import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service.js";
import { ResourcesRepository } from "../resources.repository.js";
import type { ResourceWithTask } from "../resources.repository.js";

@Injectable()
export class PrismaResourcesRepository extends ResourcesRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async listResources(): Promise<ResourceWithTask[]> {
        const resources = await this.prisma.resource.findMany({
            orderBy: { createdAt: "desc" },
            include: { task: { select: { title: true } } }
        });

        return resources.map(({ task, ...resource }) => ({
            ...resource,
            taskTitle: task.title
        }));
    }
}
