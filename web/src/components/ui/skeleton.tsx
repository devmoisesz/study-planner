import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/** Bloco de carregamento. Use dentro de um container com aria-busy. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-sm bg-line', className)}
      {...props}
    />
  );
}
