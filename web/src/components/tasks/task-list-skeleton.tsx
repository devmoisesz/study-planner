import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** Skeleton com a forma real do card, nao barras genericas (front.md 22). */
export function TaskListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando suas tarefas…</span>

      {Array.from({ length: rows }).map((_, index) => (
        <Card key={index} className="relative overflow-hidden">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-line" />
          <div className="flex min-h-64 flex-col gap-4 p-5 pt-6">
            <div className="flex items-start justify-between">
              <Skeleton className="h-9 w-14" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex flex-1 flex-col gap-2 pt-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
            <div className="flex gap-2 border-t border-line pt-3">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
