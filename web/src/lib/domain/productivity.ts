import { clampScore } from './score';

/**
 * Formulas do plan.md secoes 4 e 5. O frontend so calcula PREVIEW;
 * quando existir endpoint, o valor oficial vem do backend.
 */

export const PERCENTAGE_MIN = 0;
export const PERCENTAGE_MAX = 100;

export function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return PERCENTAGE_MIN;
  return Math.min(PERCENTAGE_MAX, Math.max(PERCENTAGE_MIN, Math.round(value)));
}

/** novoScore = scoreAtual x (1 - produtividade / 100) */
export function applyProductivity(score: number, percentage: number): number {
  return clampScore(score * (1 - clampPercentage(percentage) / 100));
}

/** novoScore = scoreAtual x (1 + aumento / 100), teto em 100. */
export function applyPriorityBoost(score: number, percentage: number): number {
  return clampScore(score * (1 + clampPercentage(percentage) / 100));
}
