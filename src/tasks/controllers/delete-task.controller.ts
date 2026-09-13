import { Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { taskIdSchema } from "../schemas/task-id.schema.js";
import { DeleteTaskService } from "../services/delete-task.service.js";
import { ZodValidationPipe } from "../../validation/pipes/zod-validation.pipe.js";

@Controller("tasks")
export class DeleteTaskController {
    constructor(private readonly deleteTaskService: DeleteTaskService) {}

    @Delete(":id")
    @HttpCode(204)
    async execute(
        @Param("id", new ZodValidationPipe(taskIdSchema)) id: string
    ) {
        return this.deleteTaskService.execute(id);
    }
}
