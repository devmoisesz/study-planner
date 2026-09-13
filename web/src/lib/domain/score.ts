import type { RankedTask, Task } from '@/types/api';

export const SCORE_MIN = 0;
export const SCORE_MAX = 100;

export type ScoreBandId = 'calm' | 'low' | 'attention' | 'high' | 'urgent';

export interface ScoreBand {
  id: ScoreBandId;
  /** Rotulo exibido ao usuario. */
  label: string;
  min: number;
  max: number;
  /** Classes literais — o Tailwind nao resolve nome de classe montado em runtime. */
  dot: string;
  text: string;
  soft: string;
  /** Fundo e borda usados pelos cards do ranking. */
  card: string;
  /** So a borda ESQUERDA: o card continua branco com borda discreta. */
  borderLeft: string;
}

/** Faixas do plan.md secao 2. Ordem crescente, sem buracos nem sobreposicao. */
export const SCORE_BANDS: readonly ScoreBand[] = [
  {
    id: 'calm',
    label: 'Tranquilo',
    min: 0,
    max: 19,
    dot: 'bg-score-calm',
    text: 'text-score-calm-ink',
    soft: 'bg-score-calm-soft',
    card: 'border-score-calm/25 bg-score-calm-soft',
    borderLeft: 'border-l-score-calm',
  },
  {
    id: 'low',
    label: 'Baixa prioridade',
    min: 20,
    max: 39,
    dot: 'bg-score-low',
    text: 'text-score-low-ink',
    soft: 'bg-score-low-soft',
    card: 'border-score-low/25 bg-score-low-soft',
    borderLeft: 'border-l-score-low',
  },
  {
    id: 'attention',
    label: 'Atenção',
    min: 40,
    max: 59,
    dot: 'bg-score-attention',
    text: 'text-score-attention-ink',
    soft: 'bg-score-attention-soft',
    card: 'border-score-attention/25 bg-score-attention-soft',
    borderLeft: 'border-l-score-attention',
  },
  {
    id: 'high',
    label: 'Alta prioridade',
    min: 60,
    max: 79,
    dot: 'bg-score-high',
    text: 'text-score-high-ink',
    soft: 'bg-score-high-soft',
    card: 'border-score-high/25 bg-score-high-soft',
    borderLeft: 'border-l-score-high',
  },
  {
    id: 'urgent',
    label: 'Urgente',
    min: 80,
    max: 100,
    dot: 'bg-score-urgent',
    text: 'text-score-urgent-ink',
    soft: 'bg-score-urgent-soft',
    card: 'border-score-urgent/40 bg-score-urgent-soft',
    borderLeft: 'border-l-score-urgent',
  },
] as const;

/** Mantem o score dentro de 0..100 e inteiro. */
export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return SCORE_MIN;
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, Math.round(value)));
}

/**
 * Unico lugar que decide cor e rotulo de um score.
 * Nenhum componente deve reimplementar essa tabela.
 */
export function scoreBand(score: number): ScoreBand {
  const value = clampScore(score);
  const band = SCORE_BANDS.find((candidate) => value >= candidate.min && value <= candidate.max);

  // SCORE_BANDS cobre 0..100 inteiro; o fallback existe so para o tipo.
  return band ?? (SCORE_BANDS[SCORE_BANDS.length - 1] as ScoreBand);
}

/** Ordena do maior score para o menor, como o backend faz. */
export function byScoreDesc<T extends Task | RankedTask>(tasks: readonly T[]): T[] {
  return [...tasks].sort((first, second) => {
    if (second.score !== first.score) return second.score - first.score;
    // Empate: mais recente primeiro, para a ordem nao oscilar entre renders.
    return Date.parse(second.createdAt) - Date.parse(first.createdAt);
  });
}
