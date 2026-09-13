import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Largura maxima e respiro ao redor das listagens (front.md secao 10):
 * o conteudo nunca estica por toda a tela.
 */
export function ContentContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-content px-5 py-8 lg:px-8 lg:py-12', className)}>
      {children}
    </div>
  );
}
