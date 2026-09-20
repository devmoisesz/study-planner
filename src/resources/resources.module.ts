import { Module } from '@nestjs/common';
import { ListResourcesController } from './controllers/list-resources.controller.js';
import { ListResourcesService } from './services/list-resources.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { PrismaResourcesRepository } from './repositories/prisma/prisma-resources.repository.js';
import { ResourcesRepository } from './repositories/resources.repository.js';
import { UploadPdfController } from './controllers/upload-pdf.controller.js';
import { UploadPdfService } from './services/upload-pdf.service.js';
import { TasksModule } from '../tasks/tasks.module.js';

@Module({
  controllers: [ListResourcesController, UploadPdfController],
  imports: [DatabaseModule, TasksModule],
  providers: [
    ListResourcesService,
    UploadPdfService,
    PrismaResourcesRepository,
    {
      provide: ResourcesRepository,
      useExisting: PrismaResourcesRepository,
    },
  ],
})
export class ResourcesModule {}
