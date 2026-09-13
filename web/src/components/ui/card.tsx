import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Superficie branca padrao. O front.md exige que o card permaneca branco:
 * a cor de prioridade entra so por trilho, bolinha ou badge.
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
