import { beforeEach, describe, expect, it } from "vitest";
import { TasksInMemory } from "../repositories/in-memory/tasks-in-memory.js";
import { LogProductivityService } from "./log-productivity.service.js";
import { ProductivityInMemory } from "../repositories/in-memory/productivity-in-memory.js";

let tasksRepository: TasksInMemory;
let productivityRepository: ProductivityInMemory;
let sut: LogProductivityService;

describe("Log Productivity Service", () => {
  beforeEach(() => {
    tasksRepository = new TasksInMemory();
    productivityRepository = new ProductivityInMemory();
    sut = new LogProductivityService(tasksRepository, productivityRepository);
  });

  it("deve ser possivel registrar a produtividade", async () => {
    const task = await tasksRepository.create({title: 'Teste e2e', score: 70})

    await sut.execute(task.id, 0.5);

    const taskWithNewScore = await tasksRepository.findById(task.id)

    expect(taskWithNewScore?.score).toEqual(35);
    expect(productivityRepository.items).toEqual([
      expect.objectContaining({
        taskId: task.id,
        percentage: 50,
      }),
    ]);
  });

  it("arredonda o score e armazena a porcentagem em pontos percentuais", async () => {
    const task = await tasksRepository.create({ title: "Teste", score: 71 });

    await sut.execute(task.id, 0.01);

    await expect(tasksRepository.findById(task.id)).resolves.toEqual(
      expect.objectContaining({ score: 70 }),
    );
    expect(productivityRepository.items[0]).toEqual(
      expect.objectContaining({ percentage: 1 }),
    );
  });
});
