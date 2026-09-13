import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

/** Erro diz o que aconteceu e oferece o proximo passo. Nao pede desculpas. */
export function ErrorState({
  title,
  description,
  onRetry,
  isRetrying,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center rounded-lg border border-line bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      <span className="mb-4 inline-flex size-11 items-center justify-center rounded-md bg-danger-soft text-danger">
        <TriangleAlert aria-hidden className="size-5" />
      </span>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>
      ) : null}
      {onRetry ? (
        <Button className="mt-5" onClick={onRetry} isPending={isRetrying}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
