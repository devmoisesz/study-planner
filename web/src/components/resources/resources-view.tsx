'use client';

import { Layers, Plus } from 'lucide-react';
import Link from 'next/link';
import { ResourceList } from '@/components/resources/resource-list';
import { useResources } from '@/components/tasks/use-tasks';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { resourceTypeLabel } from '@/lib/domain/resource-type';
import { getErrorMessage } from '@/lib/api/client';
import { RESOURCE_TYPES } from '@/types/api';

function ResourcesSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando seus materiais…</span>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="flex gap-3 p-4">
          <Skeleton className="size-8 shrink-0 rounded-sm" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3.5 w-3/5" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ResourcesView() {
  const {
    data: resources,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useResources();

  if (isPending) return <ResourcesSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar seus materiais"
        description={getErrorMessage(
          error,
          'Não foi possível carregar seus materiais. Tente novamente.',
        )}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  if (resources.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="Nenhum material ainda"
        description="Os vídeos, livros e sites que você adicionar às tarefas aparecem aqui."
        action={
          <Link
            href="/tarefas/nova"
            className={buttonClasses({ variant: 'primary' })}
          >
            <Plus aria-hidden className="size-4" />
            Nova tarefa
          </Link>
        }
      />
    );
  }

  // Agrupado por tipo: quem procura material pensa "onde estava aquele PDF?".
  const groups = RESOURCE_TYPES.map((type) => ({
    type,
    items: resources.filter((resource) => resource.type === type),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.type} className="flex flex-col gap-3">
          <h2 className="flex items-baseline gap-2 text-sm font-semibold text-ink">
            {resourceTypeLabel(group.type)}
            <span className="tabular text-xs font-normal text-ink-faint">
              {group.items.length}
            </span>
          </h2>
          <ResourceList resources={group.items} showTask showType={false} />
        </section>
      ))}
    </div>
  );
}
