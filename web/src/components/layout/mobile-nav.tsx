'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Logo } from '@/components/layout/logo';
import { NavLinks } from '@/components/layout/nav-links';
import { LogoutButton } from '@/components/auth/logout-button';

/**
 * Abaixo de md a sidebar vira drawer, como pede o front.md secao 23.
 * Usa <dialog> nativo pelo foco preso, Esc e devolucao de foco.
 */
export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  /**
   * Guardamos a rota em que o drawer foi aberto em vez de um booleano.
   * Assim "navegou -> fecha" e DERIVADO no render: quando o pathname muda,
   * `open` vira false sozinho, sem effect e sem render em cascata.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt !== null && openedAt === pathname;

  const close = () => setOpenedAt(null);

  // Effect legitimo: sincroniza com um sistema externo, o <dialog> do DOM.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) close();
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sidebar-line bg-sidebar px-4 md:hidden">
        <Link
          href="/"
          aria-label="Study Planner — ir para Prioridades"
          className="rounded-md"
        >
          <Logo />
        </Link>

        <button
          type="button"
          onClick={() => setOpenedAt(pathname)}
          aria-label="Abrir menu"
          aria-expanded={open}
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-sidebar-ink transition-colors hover:bg-sidebar-surface hover:text-ink"
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </header>

      {/* O ::backdrop e pseudo-elemento e nao aceita handler; o clique fora e
          detectado no proprio <dialog>. Esc ja fecha de forma nativa. */}
      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={handleBackdropClick}
        aria-label="Menu principal"
        className="m-0 mr-auto h-dvh max-h-none w-72 max-w-[85vw] bg-transparent p-0 md:hidden"
      >
        <div className="flex h-full flex-col bg-sidebar shadow-raised">
          <div className="flex h-14 items-center justify-between border-b border-sidebar-line px-4">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label="Fechar menu"
              className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-sidebar-ink transition-colors hover:bg-sidebar-surface hover:text-ink"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          {/* Sem aria-label: o <dialog> ja se chama "Menu principal", e dois
              landmarks "Principal" no mesmo documento e ruido. */}
          <nav className="flex-1 px-3 py-4">
            <NavLinks variant="drawer" onNavigate={close} />
          </nav>

          <div className="border-t border-sidebar-line p-3">
            <LogoutButton />
          </div>
        </div>
      </dialog>
    </>
  );
}
