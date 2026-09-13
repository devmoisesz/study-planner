import type { Productivity } from '@/types/api';

const STORAGE_KEY = 'study-planner:overlay:v1';

export interface TaskEdit {
  title?: string;
  description?: string | null;
}

export interface Overlay {
  version: 1;
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
    return emptyOverlay();
  }
}

function writeOverlay(overlay: Overlay): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
  } catch {
    // localStorage may be unavailable (for example, private browsing mode).
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
