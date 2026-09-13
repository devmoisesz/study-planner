import { Module } from "@nestjs/common";
import { ListResourcesController } from "./controllers/list-resources.controller.js";
import { ListResourcesService } from "./services/list-resources.service.js";
import { DatabaseModule } from "../database/database.module.js";
import { PrismaResourcesRepository } from "./repositories/prisma/prisma-resources.repository.js";
import { ResourcesRepository } from "./repositories/resources.repository.js";

@Module({
    controllers: [ListResourcesController],
    imports: [DatabaseModule],
    providers: [
        ListResourcesService,
        PrismaResourcesRepository,
        {
            provide: ResourcesRepository,
            useExisting: PrismaResourcesRepository
        }
    ]
})
export class ResourcesModule {}
