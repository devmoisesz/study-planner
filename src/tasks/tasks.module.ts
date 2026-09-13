import { Module } from "@nestjs/common";
import { CreateTaskController } from "./controllers/create-task.controller.js";
import { CreateTaskService } from "./services/create-task.service.js";
import { DatabaseModule } from "../database/database.module.js";
import { PrismaTasksRepository } from "./repositories/prisma/prisma-tasks.repository.js";
import { TasksRepository } from "./repositories/tasks.repository.js";

@Module({
    controllers: [CreateTaskController],
    imports: [DatabaseModule],
    providers: [
        CreateTaskService,
        PrismaTasksRepository,
        {
            provide: TasksRepository,
            useExisting: PrismaTasksRepository
        }
    ]
})
export class TasksModule {}
