import { Controller, Get, HttpCode } from "@nestjs/common";
import { ListTasksService } from "../services/list-tasks.service.js";

@Controller("tasks/list")
export class ListTasksController {
    constructor(private readonly listTasksService: ListTasksService) {}

    @Get()
    @HttpCode(200)
    async execute() {
        return this.listTasksService.execute();
    }
}
