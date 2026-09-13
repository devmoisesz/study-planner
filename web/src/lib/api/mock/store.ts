/**
 * OVERLAY LOCAL — camada temporaria, no localStorage do navegador.
 *
 * Encolheu: recursos, contagem de recursos e exclusao agora vem da API real
 * (GET /resources, _count no list, DELETE /tasks/:id). Restam so as tres
 * coisas cujas rotas ainda nao existem:
 *
 *   scores         -> POST /tasks/:id/productivities e /priority-boost
 *   edits          -> PATCH /tasks/:id
 *   productivities -> POST /tasks/:id/productivities
 *
 * Para remover: implementar essas rotas, preencher os corpos marcados com
 * TODO(api) em ../tasks.ts e apagar esta pasta. Nenhuma tela muda.
 */

import type { Productivity } from '@/types/api';

const STORAGE_KEY = 'study-planner:overlay:v1';

export interface TaskEdit {
  title?: string;
  description?: string | null;
}

export interface Overlay {
  version: 1;
  /** Score depois de produtividade ou aumento manual. */
  scores: Record<string, number>;
  edits: Record<string, TaskEdit>;
  productivities: Record<string, Productivity[]>;
}

function emptyOverlay(): Overlay {
  return { version: 1, scores: {}, edits: {}, productivities: {} };
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

function mutate(change: (overlay: Overlay) => void): void {
  const overlay = readOverlay();
  change(overlay);
  writeOverlay(overlay);
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
