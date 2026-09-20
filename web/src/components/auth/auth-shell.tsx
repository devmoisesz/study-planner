import { BarChart3, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/layout/logo';

const BENEFITS = [
  { icon: BarChart3, text: 'Prioridades calculadas com critérios claros' },
  { icon: CheckCircle2, text: 'Progresso e produtividade no mesmo lugar' },
  { icon: Sparkles, text: 'Uma visão simples do que merece atenção agora' },
] as const;

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[minmax(24rem,0.85fr)_minmax(32rem,1.15fr)]">
      <section className="relative hidden overflow-hidden bg-brand-deep px-12 py-10 text-white lg:flex lg:flex-col">
        <div
          aria-hidden
          className="absolute -left-32 top-28 size-96 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="absolute -left-16 top-44 size-64 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-20 size-80 rounded-full bg-brand/30"
        />

        <Link
          href="/login"
          aria-label="Study Planner"
          className="relative w-fit rounded-md"
        >
          <Logo tone="inverse" />
        </Link>

        <div className="relative my-auto max-w-lg py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            Estude com direção
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight xl:text-[2.75rem] xl:leading-[1.08]">
            Menos dúvida sobre o que fazer. Mais foco no que importa.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-blue-100">
            Organize tarefas, materiais e evolução em um plano que se adapta ao
            seu ritmo.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm text-blue-50"
              >
                <span className="flex size-8 items-center justify-center rounded-md bg-white/10">
                  <Icon aria-hidden className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-blue-200">
          Seu plano de estudos, sempre em ordem.
        </p>
      </section>

      <section className="flex min-h-dvh flex-col px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-md items-center justify-between lg:hidden">
          <Logo />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 items-center py-10">
          <div className="w-full rounded-lg border border-line bg-surface p-6 shadow-raised sm:p-8">
            {children}
          </div>
        </div>

        <p className="text-center text-xs text-ink-faint lg:text-right">
          Feito para transformar intenção em progresso.
        </p>
      </section>
    </main>
  );
}
