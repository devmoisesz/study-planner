import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, parseColorTokens } from './contrast';

/**
 * Le os tokens direto do globals.css: o teste nao pode divergir da fonte
 * de verdade porque nao guarda copia dos valores.
 */
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');
const token = parseColorTokens(css);

/** [descricao, frente, fundo, minimo] — 4.5 texto, 3 grafico/texto grande. */
const PAIRS: ReadonlyArray<[string, string, string, number]> = [
  ['texto principal sobre branco', 'ink', 'surface', 4.5],
  ['texto principal sobre o fundo', 'ink', 'background', 4.5],
  ['texto secundario sobre branco', 'ink-soft', 'surface', 4.5],
  ['texto secundario sobre o fundo', 'ink-soft', 'background', 4.5],
  ['placeholder sobre branco', 'ink-faint', 'surface', 4.5],
  ['placeholder sobre o fundo', 'ink-faint', 'background', 4.5],
  ['rotulo do botao primario', 'on-brand', 'brand-strong', 4.5],
  ['rotulo do botao primario em hover', 'on-brand', 'brand-deep', 4.5],
  ['marca como grafico sobre branco', 'brand', 'surface', 3],
  ['marca como grafico sobre o fundo', 'brand', 'background', 3],
  ['item de navegacao ativo', 'brand-strong', 'brand-subtle', 4.5],
  ['erro sobre branco', 'danger', 'surface', 4.5],
  ['erro sobre fundo de erro', 'danger', 'danger-soft', 4.5],
];

const SCORE_BANDS = ['calm', 'low', 'attention', 'high', 'urgent'] as const;

describe('contraste dos tokens', () => {
  it('extrai os tokens do globals.css', () => {
    expect(Object.keys(token).length).toBeGreaterThan(15);
    expect(token['brand']).toBe('#2563eb');
  });

  it.each(PAIRS)('%s atinge o minimo', (_name, foreground, background, minimum) => {
    const front = token[foreground];
    const back = token[background];

    expect(front, `token --color-${foreground} ausente`).toBeDefined();
    expect(back, `token --color-${background} ausente`).toBeDefined();
    expect(contrastRatio(front as string, back as string)).toBeGreaterThanOrEqual(minimum);
  });

  it.each(SCORE_BANDS)('a faixa "%s" e legivel no badge e no card', (band) => {
    const ink = token[`score-${band}-ink`];
    const soft = token[`score-${band}-soft`];

    expect(ink, `token --color-score-${band}-ink ausente`).toBeDefined();
    expect(soft, `token --color-score-${band}-soft ausente`).toBeDefined();
    expect(contrastRatio(ink as string, soft as string)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ink as string, token['surface'] as string)).toBeGreaterThanOrEqual(4.5);
  });
});
