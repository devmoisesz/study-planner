import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

/** Tela vazia e um convite para agir, nunca um espaco em branco. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-lg border border-dashed border-line bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      <span className="mb-4 inline-flex size-11 items-center justify-center rounded-md bg-brand-subtle text-brand-strong">
        <Icon aria-hidden className="size-5" />
      </span>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
