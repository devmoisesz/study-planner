'use client';

import { ScoreNumber } from '@/components/tasks/score-display';
import { calculateInitialScore } from '@/lib/domain/initial-score';
import type { ScoreCriteria } from '@/lib/domain/initial-score';
import { scoreBand } from '@/lib/domain/score';

/**
 * Preview do score enquanto a pessoa move os sliders.
 *
 * Usa o espelho da formula do backend (initial-score.ts). O valor que fica
 * salvo e sempre o que a API devolver — por isso o texto diz "estimada".
 */
export function ScorePreview({ criteria }: { criteria: ScoreCriteria }) {
  const score = calculateInitialScore(criteria);
  const band = scoreBand(score);

  return (
    <div
      className="flex items-center gap-4 rounded-md border border-line bg-surface px-4 py-3"
      aria-live="polite"
    >
      <ScoreNumber score={score} size="lg" />

      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold text-ink">
          Prioridade estimada: {band.label.toLowerCase()}
        </span>
        <span className="text-xs text-ink-soft">
          O valor final é calculado pelo servidor ao salvar.
        </span>
      </div>
    </div>
  );
}
