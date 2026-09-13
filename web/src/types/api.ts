/**
 * Espelha o contrato REAL do backend Nest, verificado em execucao.
 * Nao adicionar campo que o backend nao persiste.
 */

export const RESOURCE_TYPES = ['YOUTUBE', 'BOOK', 'PDF', 'WEBSITE', 'OTHER'] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string | null;
  description: string | null;
  taskId: string;
  createdAt: string;
}

/** Formato devolvido por GET /tasks/list — sem `resources`. */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  score: number;
  createdAt: string;
  updatedAt: string;
}

/** Formato devolvido por POST /tasks — com `resources`. */
export interface TaskWithResources extends Task {
  resources: Resource[];
}

/** Task enriquecida para a UI. `resourceCount` nao vem do GET /tasks/list. */
export interface RankedTask extends Task {
  resourceCount: number;
}

export interface CreateResourceInput {
  title: string;
  type: ResourceType;
  /** Omitir quando vazio: o Zod do backend reprova string vazia. */
  url?: string;
  description?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  /** 1 a 10. Usados so para calcular o score inicial; nao sao persistidos. */
  importance: number;
  domain: number;
  urgency: number;
  relevance: number;
  resources?: CreateResourceInput[];
}

export interface Productivity {
  id: string;
  percentage: number;
  taskId: string;
  createdAt: string;
}
