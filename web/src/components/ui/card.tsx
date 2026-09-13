import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Superficie base escura. Cards de prioridade acrescentam apenas seu tom
 * contextual por meio dos tokens de score.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-line bg-surface shadow-card',
        className,
      )}
      {...props}
    />
  );
}
