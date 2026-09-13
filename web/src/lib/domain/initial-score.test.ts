import { describe, expect, it } from 'vitest';
import { CRITERION_MAX, CRITERION_MIN, INITIAL_SCORE_RANGE, calculateInitialScore } from './initial-score';

describe('calculateInitialScore', () => {
  /**
   * Casos copiados dos specs do backend
   * (src/tasks/services/create-task.service.spec.ts). Se um destes quebrar,
   * o preview do frontend divergiu da regra oficial.
   */
  it('reproduz o caso "Estudar Trigonometria" do backend', () => {
    expect(calculateInitialScore({ importance: 9, domain: 3, urgency: 8, relevance: 9 })).toBe(82);
  });

  it('reproduz o caso "Estudar NestJs" do backend', () => {
    expect(calculateInitialScore({ importance: 9, domain: 7, urgency: 3, relevance: 5 })).toBe(52);
  });

  it('trata dominio de forma inversa', () => {
    const pouco = calculateInitialScore({ importance: 5, domain: 1, urgency: 5, relevance: 5 });
    const muito = calculateInitialScore({ importance: 5, domain: 10, urgency: 5, relevance: 5 });

    expect(pouco).toBeGreaterThan(muito);
  });

  it('so o dominio muda o resultado quando o resto e igual', () => {
    const base = { importance: 6, urgency: 6, relevance: 6 };
    const scores = [1, 5, 10].map((domain) => calculateInitialScore({ ...base, domain }));

    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('respeita a faixa alcancavel de 34 a 97 documentada no dominio', () => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (let importance = CRITERION_MIN; importance <= CRITERION_MAX; importance += 1)
      for (let domain = CRITERION_MIN; domain <= CRITERION_MAX; domain += 1)
        for (let urgency = CRITERION_MIN; urgency <= CRITERION_MAX; urgency += 1)
          for (let relevance = CRITERION_MIN; relevance <= CRITERION_MAX; relevance += 1) {
            const score = calculateInitialScore({ importance, domain, urgency, relevance });
            min = Math.min(min, score);
            max = Math.max(max, score);
          }

    expect({ min, max }).toEqual(INITIAL_SCORE_RANGE);
  });
});
