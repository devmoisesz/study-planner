/** Utilitarios de contraste WCAG 2.1 (relative luminance + ratio). */

function channels(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;

  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
}

function linearize(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map(linearize) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razao de contraste entre duas cores, de 1:1 a 21:1. */
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (first, second) => second - first,
  ) as [number, number];

  return (lighter + 0.05) / (darker + 0.05);
}

/** Extrai os tokens `--color-*: #hex` de uma folha de estilo. */
export function parseColorTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};

  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    const [, name, value] = match;
    if (name && value) tokens[name] = value;
  }

  return tokens;
}
