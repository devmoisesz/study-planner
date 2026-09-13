import { describe, expect, it, vi } from "vitest";
import { NotFoundException } from "@nestjs/common";
import type { TasksRepository } from "../repositories/tasks.repository.js";
import { GetTaskService } from "./get-task.service.js";

describe("Get Task Service", () => {
    
    it("returns a task with resources and productivity history", async () => {
        const task = {
            id: "task-1",
            title: "Estudar trigonometria",
            resources: [],
            productivities: []
        };
        const tasksRepository = {
            findDetailsById: vi.fn().mockResolvedValue(task)
        } as unknown as TasksRepository;
        const sut = new GetTaskService(tasksRepository);

        await expect(sut.execute("task-1")).resolves.toEqual(task);
        expect(tasksRepository.findDetailsById).toHaveBeenCalledWith("task-1");
    });

    it("throws 404 when the task does not exist", async () => {
        const tasksRepository = {
            findDetailsById: vi.fn().mockResolvedValue(null)
        } as unknown as TasksRepository;
        const sut = new GetTaskService(tasksRepository);

        await expect(sut.execute("missing-task")).rejects.toBeInstanceOf(NotFoundException);
    });
});
