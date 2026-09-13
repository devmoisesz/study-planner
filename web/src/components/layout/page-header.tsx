import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Acao principal da pagina, alinhada ao titulo no desktop. */
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink lg:text-3xl">
          {title}
        </h1>
        {description ? <p className="text-sm text-ink-soft lg:text-base">{description}</p> : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
