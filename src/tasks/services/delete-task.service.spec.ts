import { NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it } from "vitest";
import { TasksInMemory } from "../repositories/in-memory/tasks-in-memory.js";
import { CreateTaskService } from "./create-task.service.js";
import { DeleteTaskService } from "./delete-task.service.js";

let tasksRepository: TasksInMemory;
let createTaskService: CreateTaskService;
let sut: DeleteTaskService;

describe("Delete Task Service", () => {
  beforeEach(() => {
    tasksRepository = new TasksInMemory();
    createTaskService = new CreateTaskService(tasksRepository);
    sut = new DeleteTaskService(tasksRepository);
  });

  it("should be possible to delete an existing task", async () => {
    const task = await createTaskService.execute({
      title: "Estudar Trigonometria",
      importance: 9,
      domain: 3,
      urgency: 8,
      relevance: 9
    });

    await sut.execute(task.id);

    expect(tasksRepository.items).toHaveLength(0);
  });

  it("should not delete other tasks", async () => {
    const first = await createTaskService.execute({
      title: "Estudar Trigonometria",
      importance: 9,
      domain: 3,
      urgency: 8,
      relevance: 9
    });
    await createTaskService.execute({
      title: "Estudar Genética",
      importance: 8,
      domain: 5,
      urgency: 6,
      relevance: 9
    });

    await sut.execute(first.id);

    expect(tasksRepository.items).toHaveLength(1);
    expect(tasksRepository.items[0].title).toBe("Estudar Genética");
  });

  it("should throw when the task does not exist", async () => {
    await expect(
      sut.execute("11111111-1111-4111-8111-111111111111")
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
