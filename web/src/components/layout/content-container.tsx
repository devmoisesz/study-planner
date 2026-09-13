import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Largura maxima e respiro ao redor das listagens (front.md secao 10):
 * o conteudo nunca estica por toda a tela.
 */
export function ContentContainer({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  /** A grade pode ocupar mais espaco sem alargar formularios. */
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 py-8 lg:px-8 lg:py-12',
        wide ? 'max-w-[90rem]' : 'max-w-content',
        className,
      )}
    >
      {children}
    </div>
  );
}
