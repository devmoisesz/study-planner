import { describe, expect, it } from 'vitest';
import { applyPriorityBoost, applyProductivity, clampPercentage } from './productivity';

describe('applyProductivity', () => {
  /** Exemplo do plan.md secao 4: 86 com 55% vira 39. */
  it('reproduz o exemplo do plan.md', () => {
    expect(applyProductivity(86, 55)).toBe(39);
  });

  it('produtividade 100% zera o score e 0% nao muda nada', () => {
    expect(applyProductivity(86, 100)).toBe(0);
    expect(applyProductivity(86, 0)).toBe(86);
  });

  it('nunca sai de 0..100', () => {
    expect(applyProductivity(100, 150)).toBe(0);
    expect(applyProductivity(0, 50)).toBe(0);
  });
});

describe('applyPriorityBoost', () => {
  /** Exemplo do plan.md secao 5: 39 com +50% vira 59. */
  it('reproduz o exemplo do plan.md', () => {
    expect(applyPriorityBoost(39, 50)).toBe(59);
  });

  it('nunca passa de 100', () => {
    expect(applyPriorityBoost(90, 80)).toBe(100);
    expect(applyPriorityBoost(100, 10)).toBe(100);
  });

  it('aumento de 0% nao muda o score', () => {
    expect(applyPriorityBoost(42, 0)).toBe(42);
  });
});

describe('clampPercentage', () => {
  it('mantem entre 0 e 100', () => {
    expect(clampPercentage(-10)).toBe(0);
    expect(clampPercentage(140)).toBe(100);
    expect(clampPercentage(55.4)).toBe(55);
    expect(clampPercentage(Number.NaN)).toBe(0);
  });
});
