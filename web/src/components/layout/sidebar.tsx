import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { NavLinks } from '@/components/layout/nav-links';
import { LogoutButton } from '@/components/auth/logout-button';

/**
 * Desktop (lg+): 248px com rotulos.
 * Tablet (md..lg): 64px so com icones — nao e o desktop espremido.
 * Abaixo de md nao renderiza: quem navega e o drawer.
 */
export function Sidebar() {
  return (
    <div className="sticky top-0 hidden h-dvh shrink-0 border-r border-sidebar-line bg-sidebar md:flex md:w-16 md:flex-col lg:w-sidebar">
      <div className="flex h-16 items-center justify-center px-3 lg:justify-start lg:px-5">
        <Link
          href="/"
          aria-label="Study Planner — ir para Prioridades"
          className="rounded-md"
        >
          <Logo nameClassName="sr-only lg:not-sr-only" />
        </Link>
      </div>

      <nav aria-label="Principal" className="flex-1 px-2 lg:px-3">
        <NavLinks variant="sidebar" />
      </nav>

      <div className="border-t border-sidebar-line p-2 lg:p-3">
        <LogoutButton compact />
      </div>
    </div>
  );
}
