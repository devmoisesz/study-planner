import { Module } from "@nestjs/common";
import { ResourcesModule } from "./resources/resources.module.js";
import { TasksModule } from "./tasks/tasks.module.js";

@Module({
    imports: [TasksModule, ResourcesModule]
})
export class HttpModule {}
