import { z } from 'zod';
import { CRITERION_MAX, CRITERION_MIN } from '@/lib/domain/initial-score';
import type { CreateTaskInput } from '@/types/api';
import { RESOURCE_TYPES } from '@/types/api';

/**
 * Espelha src/tasks/schemas/create-task.schema.ts do backend, com duas
 * diferencas de proposito:
 *
 * 1. mensagens em PT-BR, porque as do backend sao do Zod em ingles;
 * 2. `url` aqui e string sempre presente (o input HTML nunca devolve
 *    undefined). O backend reprova string vazia, entao a chave e OMITIDA
 *    em toCreateTaskInput — nunca enviada como "".
 */

const criterion = z.number().int().min(CRITERION_MIN).max(CRITERION_MAX);

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === '' || z.url().safeParse(value).success, {
    message: 'Informe um endereço completo (com https://) ou deixe em branco.',
  });

export const resourceFormSchema = z.object({
  title: z.string().trim().min(1, 'Dê um título ao recurso.'),
  type: z.enum(RESOURCE_TYPES),
  url: optionalUrl,
  description: z.string().trim(),
});

export const createTaskFormSchema = z.object({
  title: z.string().trim().min(1, 'Dê um nome para a tarefa.'),
  description: z.string().trim(),
  importance: criterion,
  domain: criterion,
  urgency: criterion,
  relevance: criterion,
  resources: z.array(resourceFormSchema),
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;
export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export const EMPTY_RESOURCE: ResourceFormValues = {
  title: '',
  type: 'YOUTUBE',
  url: '',
  description: '',
};

/** Todos os criterios no meio da escala: score inicial 50, sem vies. */
export const CREATE_TASK_DEFAULTS: CreateTaskFormValues = {
  title: '',
  description: '',
  importance: 5,
  domain: 5,
  urgency: 5,
  relevance: 5,
  resources: [],
};

function omitEmpty(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * Converte o que o formulario coletou no payload que o backend aceita.
 * Campos opcionais vazios sao OMITIDOS, nunca enviados como "".
 */
export function toCreateTaskInput(
  values: CreateTaskFormValues,
  omittedResourceIndexes: ReadonlySet<number> = new Set(),
): CreateTaskInput {
  const resources = values.resources
    .map((resource, index) => ({ resource, index }))
    .filter(
      ({ resource, index }) =>
        resource.title.trim() !== '' && !omittedResourceIndexes.has(index),
    )
    .map(({ resource }) => ({
      title: resource.title.trim(),
      type: resource.type,
      ...(omitEmpty(resource.url)
        ? { url: omitEmpty(resource.url) as string }
        : {}),
      ...(omitEmpty(resource.description)
        ? { description: omitEmpty(resource.description) as string }
        : {}),
    }));

  return {
    title: values.title.trim(),
    ...(omitEmpty(values.description)
      ? { description: omitEmpty(values.description) as string }
      : {}),
    importance: values.importance,
    domain: values.domain,
    urgency: values.urgency,
    relevance: values.relevance,
    ...(resources.length > 0 ? { resources } : {}),
  };
}
