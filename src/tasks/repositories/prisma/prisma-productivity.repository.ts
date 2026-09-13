import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service.js";
import { Productivity, Task } from "../../../generated/prisma/client.js";
import { InputProductivity, ProductivityRepository } from "../productivity.repository.js";

@Injectable()
export class PrismaProductivityRepository extends ProductivityRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async create(data: InputProductivity): Promise<Productivity> {
        return await this.prisma.productivity.create({
            data: {
                taskId: data.taskId,
                percentage: data.percentage
            }
        })
    }
}
