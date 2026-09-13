import { Card } from '@/components/ui/card';
import { SCORE_WEIGHTS } from '@/lib/domain/initial-score';
import { SCORE_BANDS } from '@/lib/domain/score';
import { cn } from '@/lib/utils/cn';

const CRITERIA = [
  { label: 'Importância', weight: SCORE_WEIGHTS.importance, note: 'Direto' },
  { label: 'Domínio', weight: SCORE_WEIGHTS.domain, note: 'Invertido' },
  { label: 'Urgência', weight: SCORE_WEIGHTS.urgency, note: 'Direto' },
  { label: 'Relevância', weight: SCORE_WEIGHTS.relevance, note: 'Direto' },
] as const;

const percent = (weight: number) => `${Math.round(weight * 100)}%`;

/**
 * Leitura, nao configuracao: os pesos vivem na regra de negocio do backend
 * e nao ha endpoint para altera-los. Mostrar e util; fingir que da para
 * editar nao seria (front.md secao 20).
 */
export function ScoreWeights() {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <caption className="sr-only">Peso de cada critério no cálculo do score inicial</caption>
        <thead>
          <tr className="border-b border-line text-left">
            <th scope="col" className="px-4 py-3 font-medium text-ink-soft">
              Critério
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-ink-soft">
              Peso
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-ink-soft">
              Sentido
            </th>
          </tr>
        </thead>
        <tbody>
          {CRITERIA.map((criterion) => (
            <tr key={criterion.label} className="border-b border-line last:border-0">
              <th scope="row" className="px-4 py-3 text-left font-medium text-ink">
                {criterion.label}
              </th>
              <td className="tabular px-4 py-3 font-semibold text-ink">
                {percent(criterion.weight)}
              </td>
              <td className="px-4 py-3 text-ink-soft">{criterion.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function ScoreBandsTable() {
  return (
    <Card className="overflow-hidden">
      <ul className="divide-y divide-line">
        {SCORE_BANDS.map((band) => (
          <li key={band.id} className="flex items-center gap-3 px-4 py-3">
            <span className={cn('size-2.5 shrink-0 rounded-full', band.dot)} aria-hidden />
            <span className="tabular w-20 shrink-0 text-sm font-semibold text-ink">
              {band.min}–{band.max}
            </span>
            <span className={cn('text-sm font-medium', band.text)}>{band.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
