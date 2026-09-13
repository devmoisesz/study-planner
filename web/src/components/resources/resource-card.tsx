import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { resourceTypeMeta } from '@/lib/domain/resource-type';
import type { Resource } from '@/types/api';

interface ResourceCardProps {
  resource: Resource;
  /** Quando presente, mostra de qual tarefa o recurso veio. */
  taskTitle?: string;
  taskId?: string;
  /** Oculte quando a lista ja estiver agrupada por tipo: seria redundante. */
  showType?: boolean;
}

export function ResourceCard({
  resource,
  taskTitle,
  taskId,
  showType = true,
}: ResourceCardProps) {
  const meta = resourceTypeMeta(resource.type);
  const Icon = meta.icon;

  return (
    <article className="flex gap-3 rounded-md border border-line bg-surface p-4">
      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-sm bg-background text-ink-soft">
        <Icon aria-hidden className="size-4" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-sm font-semibold text-ink">{resource.title}</h3>
          {showType ? (
            <span className="text-2xs font-medium text-ink-faint">{meta.label}</span>
          ) : null}
        </div>

        {resource.description ? (
          <p className="text-sm text-ink-soft">{resource.description}</p>
        ) : null}

        {resource.url ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-fit items-center gap-1 rounded-sm text-xs font-medium text-brand-strong hover:underline"
          >
            Abrir material
            <ExternalLink aria-hidden className="size-3" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        ) : null}

        {taskTitle && taskId ? (
          <p className="mt-0.5 text-xs text-ink-faint">
            De{' '}
            <Link href={`/tarefas/${taskId}`} className="rounded-sm font-medium hover:text-ink">
              {taskTitle}
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
