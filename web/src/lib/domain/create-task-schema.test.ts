import { describe, expect, it } from 'vitest';
import {
  CREATE_TASK_DEFAULTS,
  createTaskFormSchema,
  toCreateTaskInput,
} from './create-task-schema';

const base = { ...CREATE_TASK_DEFAULTS, title: 'Estudar Trigonometria' };

describe('createTaskFormSchema', () => {
  it('exige titulo', () => {
    const result = createTaskFormSchema.safeParse({ ...base, title: '   ' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Dê um nome para a tarefa.');
  });

  it('aceita url vazia num recurso', () => {
    const result = createTaskFormSchema.safeParse({
      ...base,
      resources: [
        {
          title: 'Livro de Matemática',
          type: 'BOOK',
          url: '',
          description: 'Cap. 8',
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('reprova url malformada', () => {
    const result = createTaskFormSchema.safeParse({
      ...base,
      resources: [
        { title: 'Aula', type: 'YOUTUBE', url: 'youtube', description: '' },
      ],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['resources', 0, 'url']);
  });

  it('recusa criterio fora de 1..10', () => {
    expect(
      createTaskFormSchema.safeParse({ ...base, importance: 0 }).success,
    ).toBe(false);
    expect(
      createTaskFormSchema.safeParse({ ...base, importance: 11 }).success,
    ).toBe(false);
  });
});

describe('toCreateTaskInput', () => {
  it('OMITE url vazia em vez de mandar string vazia', () => {
    // Esta e a regra que quebra na pratica: o Zod do backend usa z.url(),
    // que reprova "" com 400.
    const input = toCreateTaskInput({
      ...base,
      resources: [
        {
          title: 'Livro de Matemática',
          type: 'BOOK',
          url: '',
          description: '',
        },
      ],
    });

    expect(input.resources?.[0]).toEqual({
      title: 'Livro de Matemática',
      type: 'BOOK',
    });
    expect(input.resources?.[0]).not.toHaveProperty('url');
  });

  it('omite descricao vazia da tarefa', () => {
    const input = toCreateTaskInput({ ...base, description: '   ' });
    expect(input).not.toHaveProperty('description');
  });

  it('omite o array de recursos quando nao ha nenhum', () => {
    expect(toCreateTaskInput(base)).not.toHaveProperty('resources');
  });

  it('descarta linha de recurso deixada em branco', () => {
    const input = toCreateTaskInput({
      ...base,
      resources: [
        {
          title: 'Aula',
          type: 'YOUTUBE',
          url: 'https://youtube.com/x',
          description: '',
        },
        { title: '  ', type: 'BOOK', url: '', description: '' },
      ],
    });

    expect(input.resources).toHaveLength(1);
  });

  it('omite o recurso que sera criado depois pelo upload de PDF', () => {
    const input = toCreateTaskInput(
      {
        ...base,
        resources: [
          { title: 'Apostila', type: 'PDF', url: '', description: '' },
          {
            title: 'Site',
            type: 'WEBSITE',
            url: 'https://example.com',
            description: '',
          },
        ],
      },
      new Set([0]),
    );

    expect(input.resources).toEqual([
      { title: 'Site', type: 'WEBSITE', url: 'https://example.com' },
    ]);
  });

  it('remove espacos das pontas', () => {
    const input = toCreateTaskInput({ ...base, title: '  Estudar Genética  ' });
    expect(input.title).toBe('Estudar Genética');
  });

  it('monta o payload completo igual ao exemplo do front.md secao 26', () => {
    const input = toCreateTaskInput({
      title: 'Estudar Trigonometria',
      description: 'Revisar ângulos notáveis',
      importance: 9,
      domain: 3,
      urgency: 8,
      relevance: 9,
      resources: [
        {
          title: 'Aula de Trigonometria',
          type: 'YOUTUBE',
          url: 'https://youtube.com/aula',
          description: 'Aula de revisão',
        },
      ],
    });

    expect(input).toEqual({
      title: 'Estudar Trigonometria',
      description: 'Revisar ângulos notáveis',
      importance: 9,
      domain: 3,
      urgency: 8,
      relevance: 9,
      resources: [
        {
          title: 'Aula de Trigonometria',
          type: 'YOUTUBE',
          url: 'https://youtube.com/aula',
          description: 'Aula de revisão',
        },
      ],
    });
  });
});
