import { Lock } from 'lucide-react';
import type { Metadata } from 'next';
import { ContentContainer } from '@/components/layout/content-container';
import { PageHeader } from '@/components/layout/page-header';
import { ScoreBandsTable, ScoreWeights } from '@/components/settings/score-weights';
import { Card } from '@/components/ui/card';
import { INITIAL_SCORE_RANGE } from '@/lib/domain/initial-score';

export const metadata: Metadata = { title: 'Configurações' };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <p className="text-xs text-ink-soft">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function ConfiguracoesPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Configurações"
        description="Como o Study Planner calcula e organiza suas prioridades."
      />

      <div className="flex flex-col gap-10">
        <Section
          title="Pesos do cálculo"
          description="Quanto cada resposta influencia o score de uma tarefa nova. Definido pela regra de negócio do servidor."
        >
          <ScoreWeights />
          <p className="text-xs text-ink-soft">
            O domínio entra invertido: quanto mais você já sabe, menos a tarefa precisa de
            atenção. Na prática, uma tarefa nova nasce entre{' '}
            <strong className="font-semibold text-ink">{INITIAL_SCORE_RANGE.min}</strong> e{' '}
            <strong className="font-semibold text-ink">{INITIAL_SCORE_RANGE.max}</strong>.
          </p>
        </Section>

        <Section
          title="Faixas de prioridade"
          description="A cor que cada score recebe no ranking."
        >
          <ScoreBandsTable />
        </Section>

        <Section
          title="Como o score muda"
          description="Você nunca edita o score direto. Ele só se move por estas duas ações."
        >
          <Card className="flex flex-col divide-y divide-line">
            <div className="flex flex-col gap-1 p-4">
              <span className="text-sm font-medium text-ink">Registrar produtividade</span>
              <code className="text-xs text-ink-soft">
                novoScore = score × (1 − produtividade ÷ 100)
              </code>
            </div>
            <div className="flex flex-col gap-1 p-4">
              <span className="text-sm font-medium text-ink">Aumentar prioridade</span>
              <code className="text-xs text-ink-soft">
                novoScore = score × (1 + aumento ÷ 100), no máximo 100
              </code>
            </div>
          </Card>
        </Section>

        <Section
          title="Ainda não disponível"
          description="Depende de recursos que o servidor ainda não oferece."
        >
          <Card className="flex flex-col divide-y divide-line">
            {[
              ['Ajustar os pesos', 'Escolher quanto cada critério influencia o seu score.'],
              ['Preferências visuais', 'Tema e densidade da listagem.'],
              ['Exportar suas tarefas', 'Baixar tudo em um arquivo.'],
            ].map(([title, description]) => (
              <div key={title} className="flex items-start gap-3 p-4">
                <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-faint" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink-soft">{title}</span>
                  <span className="text-xs text-ink-faint">{description}</span>
                </div>
              </div>
            ))}
          </Card>
        </Section>
      </div>
    </ContentContainer>
  );
}
