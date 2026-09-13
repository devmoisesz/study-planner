import { Controller, Get, HttpCode } from "@nestjs/common";
import { ListResourcesService } from "../services/list-resources.service.js";

@Controller("/resources")
export class ListResourcesController {
    constructor(private readonly listResourcesService: ListResourcesService) {}

    @Get()
    @HttpCode(200)
    async execute() {
        return this.listResourcesService.execute();
    }
}
