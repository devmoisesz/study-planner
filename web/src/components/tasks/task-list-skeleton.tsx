import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** Skeleton com a forma real do card, nao barras genericas (front.md 22). */
export function TaskListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando suas tarefas…</span>

      {Array.from({ length: rows }).map((_, index) => (
        <Card key={index} className="relative overflow-hidden">
          <span aria-hidden className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-line" />
          <div className="flex gap-4 py-4 pl-5 pr-4 sm:pl-6">
            <Skeleton className="h-7 w-11 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3.5 w-3/4" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-36 rounded-md" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
