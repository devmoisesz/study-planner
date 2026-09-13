import { scoreBand } from '@/lib/domain/score';
import { cn } from '@/lib/utils/cn';

/**
 * O numero e o elemento com mais peso visual do produto: e ele que responde
 * "o que merece atencao agora". Tabular para os numerais alinharem na coluna
 * quando a lista e lida de cima para baixo.
 */
export function ScoreNumber({
  score,
  size = 'md',
  className,
}: {
  score: number;
  size?: 'md' | 'lg';
  className?: string;
}) {
  const band = scoreBand(score);

  return (
    <span
      className={cn(
        'tabular font-display font-bold leading-none',
        size === 'lg' ? 'text-3xl' : 'text-2xl',
        band.text,
        className,
      )}
    >
      {score}
    </span>
  );
}

/**
 * Bolinha + rotulo. O rotulo em texto e o que garante que a prioridade nao
 * dependa so de cor (WCAG 1.4.1).
 */
export function PriorityBadge({ score, className }: { score: number; className?: string }) {
  const band = scoreBand(score);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-2xs font-semibold',
        band.soft,
        band.text,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', band.dot)} aria-hidden />
      {band.label}
    </span>
  );
}

/** Trilho vertical colorido na borda esquerda do card. */
export function PriorityRail({ score }: { score: number }) {
  const band = scoreBand(score);

  return (
    <span
      aria-hidden
      className={cn('absolute inset-y-0 left-0 w-1 rounded-l-lg', band.dot)}
    />
  );
}
