/**
 * OVERLAY LOCAL — camada temporaria.
 *
 * O backend hoje so expoe POST /tasks e GET /tasks/list. Tudo que as telas
 * de detalhe, recursos e acoes precisam alem disso mora aqui, no
 * localStorage do navegador.
 *
 * Os dados NAO sao inventados: os `resources` gravados aqui sao exatamente
 * os que o POST /tasks real devolveu. O que e local e a LEITURA deles,
 * porque o GET /tasks/list nao faz include.
 *
 * Para remover esta camada: apagar a pasta mock/ e preencher os corpos
 * marcados com TODO(api) em ../tasks.ts. Nenhuma tela muda.
 */

import type { Productivity, Resource } from '@/types/api';

const STORAGE_KEY = 'study-planner:overlay:v1';

export interface TaskEdit {
  title?: string;
  description?: string | null;
}

export interface Overlay {
  version: 1;
  /** Recursos por task, vindos da resposta real do POST /tasks. */
  resources: Record<string, Resource[]>;
  /** Score depois de produtividade ou aumento manual. */
  scores: Record<string, number>;
  edits: Record<string, TaskEdit>;
  deletedIds: string[];
  productivities: Record<string, Productivity[]>;
}

function emptyOverlay(): Overlay {
  return {
    version: 1,
    resources: {},
    scores: {},
    edits: {},
    deletedIds: [],
    productivities: {},
  };
}

export function readOverlay(): Overlay {
  if (typeof window === 'undefined') return emptyOverlay();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyOverlay();

    const parsed = JSON.parse(raw) as Partial<Overlay>;
    if (parsed.version !== 1) return emptyOverlay();

    return { ...emptyOverlay(), ...parsed };
  } catch {
    // Modo privado, cota estourada ou JSON corrompido: seguir sem overlay.
    return emptyOverlay();
  }
}

function writeOverlay(overlay: Overlay): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
  } catch {
    // Persistencia indisponivel: a sessao atual continua funcionando.
  }
}

function mutate(change: (overlay: Overlay) => void): Overlay {
  const overlay = readOverlay();
  change(overlay);
  writeOverlay(overlay);
  return overlay;
}

export function rememberResources(taskId: string, resources: Resource[]): void {
  if (resources.length === 0) return;
  mutate((overlay) => {
    overlay.resources[taskId] = resources;
  });
}

export function resourcesOf(taskId: string, overlay = readOverlay()): Resource[] {
  return overlay.resources[taskId] ?? [];
}

export function rememberScore(taskId: string, score: number): void {
  mutate((overlay) => {
    overlay.scores[taskId] = score;
  });
}

export function rememberEdit(taskId: string, edit: TaskEdit): void {
  mutate((overlay) => {
    overlay.edits[taskId] = { ...overlay.edits[taskId], ...edit };
  });
}

export function rememberDeletion(taskId: string): void {
  mutate((overlay) => {
    if (!overlay.deletedIds.includes(taskId)) overlay.deletedIds.push(taskId);
    delete overlay.resources[taskId];
    delete overlay.scores[taskId];
    delete overlay.edits[taskId];
    delete overlay.productivities[taskId];
  });
}

export function rememberProductivity(taskId: string, percentage: number): Productivity {
  const entry: Productivity = {
    id: crypto.randomUUID(),
    percentage,
    taskId,
    createdAt: new Date().toISOString(),
  };

  mutate((overlay) => {
    overlay.productivities[taskId] = [...(overlay.productivities[taskId] ?? []), entry];
  });

  return entry;
}

export function productivitiesOf(taskId: string, overlay = readOverlay()): Productivity[] {
  return [...(overlay.productivities[taskId] ?? [])].sort(
    (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
  );
}
