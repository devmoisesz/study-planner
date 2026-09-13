'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Usa o <dialog> nativo: foco preso, Esc, top-layer e devolucao do foco
 * ao elemento anterior ja vem do browser. No mobile vira bottom sheet.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // O <dialog> nativo nao trava o scroll do body em todos os browsers.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    // O ::backdrop e um pseudo-elemento e nao aceita handler, entao o clique
    // fora do painel e detectado no proprio <dialog>. O caminho de teclado
    // ja existe e e nativo (Esc) alem do botao "Fechar" — nao falta rota.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        'w-full max-w-lg bg-transparent p-0 text-ink backdrop:backdrop-blur-[1px]',
        // mobile: colado embaixo. sm+: centralizado.
        'mt-auto mb-0 sm:m-auto',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-4 border border-line bg-surface p-5 shadow-raised',
          'rounded-t-lg sm:rounded-lg',
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="font-display text-lg font-semibold text-ink">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-sm text-ink-soft">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-background hover:text-ink"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        {children}

        {footer ? <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </dialog>
  );
}
