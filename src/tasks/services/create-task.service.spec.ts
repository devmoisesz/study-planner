import { beforeEach, describe, expect, it } from "vitest";
import { TasksInMemory } from "../repositories/in-memory/tasks-in-memory.js";
import { CreateTaskService } from "./create-task.service.js";

let tasksRepository: TasksInMemory;
let sut: CreateTaskService;

describe("Create Task Service", () => {
  beforeEach(() => {
    tasksRepository = new TasksInMemory();
    sut = new CreateTaskService(tasksRepository);
  });

  it("should be possible to create a task without resources", async () => {
    const result = await sut.execute({
        title: "Estudar NestJs",
        domain: 7,
        importance: 9,
        urgency: 3,
        relevance: 5
    });

    expect(result.score).toEqual(52);
    expect(result.title).toEqual("Estudar NestJs");
    expect(result.resources).toEqual([]);
    expect(tasksRepository.items[0].score).toBe(52);
  });

  it("should be possible to create a task with resources", async () => {
    const result = await sut.execute({
      title: "Estudar Trigonometria",
      description: "Estudar ângulos notáveis",
      importance: 9,
      domain: 3,
      urgency: 8,
      relevance: 9,
      resources: [
        {
          title: "Aula de Trigonometria",
          type: "YOUTUBE",
          url: "https://youtube.com/aula",
          description: "Aula sobre ângulos notáveis"
        },
        {
          title: "Livro de Matemática",
          type: "BOOK",
          description: "Capítulo 8"
        }
      ]
    });

    expect(result.score).toBe(82);
    expect(result.resources).toHaveLength(2);
    expect(result.resources[0]).toMatchObject({
      title: "Aula de Trigonometria",
      type: "YOUTUBE",
      taskId: result.id
    });
    expect(result.resources[1]).toMatchObject({
      title: "Livro de Matemática",
      type: "BOOK",
      url: null,
      taskId: result.id
    });
  });
});
