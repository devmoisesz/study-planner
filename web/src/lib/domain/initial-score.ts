import { clampScore } from './score';

/**
 * ESPELHO de src/tasks/services/utils/calculate-initial-task-score.ts no backend.
 *
 * Existe SO para o preview ao vivo no formulario. O score persistido e sempre
 * o que a API devolveu. Se o backend mudar os pesos, este arquivo e o teste
 * que o trava precisam mudar junto.
 */

export const CRITERION_MIN = 1;
export const CRITERION_MAX = 10;

export const SCORE_WEIGHTS = {
  importance: 0.3,
  /** Invertido: quanto mais voce domina, menor a prioridade. */
  domain: 0.3,
  urgency: 0.2,
  relevance: 0.2,
} as const;

export interface ScoreCriteria {
  importance: number;
  domain: number;
  urgency: number;
  relevance: number;
}

export function calculateInitialScore({
  importance,
  domain,
  urgency,
  relevance,
}: ScoreCriteria): number {
  const invertedDomain = CRITERION_MAX - domain;

  const weighted =
    importance * SCORE_WEIGHTS.importance +
    invertedDomain * SCORE_WEIGHTS.domain +
    urgency * SCORE_WEIGHTS.urgency +
    relevance * SCORE_WEIGHTS.relevance;

  return clampScore(weighted * 10);
}

/**
 * Faixa alcancavel na criacao, verificada exaustivamente nos 10^4 casos
 * pelo teste ao lado:
 *
 *   min 7  = importancia 1, dominio 10, urgencia 1, relevancia 1
 *            (dominio 10 zera a parcela invertida)
 *   max 97 = importancia 10, dominio 1, urgencia 10, relevancia 10
 *
 * Ou seja: a faixa azul E alcancavel, mas so para algo que voce ja domina
 * por completo e nao considera importante. 98 a 100 sao inalcancaveis na
 * criacao — so via aumento manual de prioridade.
 */
export const INITIAL_SCORE_RANGE = { min: 7, max: 97 } as const;
