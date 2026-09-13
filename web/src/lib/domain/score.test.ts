import { describe, expect, it } from 'vitest';
import type { Task } from '@/types/api';
import { SCORE_BANDS, byScoreDesc, clampScore, scoreBand } from './score';

describe('clampScore', () => {
  it('mantem o valor dentro de 0..100', () => {
    expect(clampScore(-30)).toBe(0);
    expect(clampScore(150)).toBe(100);
    expect(clampScore(42)).toBe(42);
  });

  it('arredonda e sobrevive a valor invalido', () => {
    expect(clampScore(38.7)).toBe(39);
    expect(clampScore(58.5)).toBe(59);
    expect(clampScore(Number.NaN)).toBe(0);
  });
});

describe('SCORE_BANDS', () => {
  it('cobre 0..100 sem buraco nem sobreposicao', () => {
    expect(SCORE_BANDS[0]?.min).toBe(0);
    expect(SCORE_BANDS[SCORE_BANDS.length - 1]?.max).toBe(100);

    SCORE_BANDS.forEach((band, index) => {
      const next = SCORE_BANDS[index + 1];
      if (next) expect(next.min).toBe(band.max + 1);
    });
  });

  it('resolve uma faixa para todo score inteiro de 0 a 100', () => {
    for (let score = 0; score <= 100; score += 1) {
      expect(scoreBand(score)).toBeDefined();
    }
  });
});

describe('scoreBand', () => {
  // Tabela do plan.md secao 2.
  it.each([
    [0, 'Tranquilo'],
    [19, 'Tranquilo'],
    [20, 'Baixa prioridade'],
    [39, 'Baixa prioridade'],
    [40, 'Atenção'],
    [59, 'Atenção'],
    [60, 'Alta prioridade'],
    [79, 'Alta prioridade'],
    [80, 'Urgente'],
    [100, 'Urgente'],
  ])('score %i e "%s"', (score, label) => {
    expect(scoreBand(score).label).toBe(label);
  });

  it('clampa antes de decidir a faixa', () => {
    expect(scoreBand(-5).id).toBe('calm');
    expect(scoreBand(420).id).toBe('urgent');
  });
});

describe('byScoreDesc', () => {
  const task = (id: string, score: number, createdAt: string): Task => ({
    id,
    title: id,
    description: null,
    score,
    createdAt,
    updatedAt: createdAt,
  });

  it('ordena do maior score para o menor', () => {
    const ordered = byScoreDesc([
      task('media', 50, '2026-01-01T00:00:00.000Z'),
      task('alta', 90, '2026-01-01T00:00:00.000Z'),
      task('baixa', 20, '2026-01-01T00:00:00.000Z'),
    ]);

    expect(ordered.map((item) => item.id)).toEqual(['alta', 'media', 'baixa']);
  });

  it('desempata pela mais recente para a ordem nao oscilar', () => {
    const ordered = byScoreDesc([
      task('antiga', 70, '2026-01-01T00:00:00.000Z'),
      task('nova', 70, '2026-06-01T00:00:00.000Z'),
    ]);

    expect(ordered.map((item) => item.id)).toEqual(['nova', 'antiga']);
  });

  it('nao muta o array recebido', () => {
    const input = [task('a', 10, '2026-01-01T00:00:00.000Z'), task('b', 90, '2026-01-01T00:00:00.000Z')];
    byScoreDesc(input);
    expect(input.map((item) => item.id)).toEqual(['a', 'b']);
  });
});
