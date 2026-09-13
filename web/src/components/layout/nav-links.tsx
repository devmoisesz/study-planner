'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, isNavItemActive } from '@/components/layout/nav-items';
import { cn } from '@/lib/utils/cn';

type NavVariant = 'sidebar' | 'drawer';

interface NavLinksProps {
  /**
   * `sidebar` encolhe para so-icones entre md e lg;
   * `drawer` sempre mostra o rotulo.
   */
  variant?: NavVariant;
  onNavigate?: () => void;
}

const LINK_LAYOUT: Record<NavVariant, string> = {
  sidebar: 'justify-center px-0 lg:justify-start lg:px-3',
  drawer: 'px-3',
};

/** sr-only mantem o nome no fluxo de leitores de tela mesmo quando encolhido. */
const LABEL_LAYOUT: Record<NavVariant, string> = {
  sidebar: 'sr-only lg:not-sr-only',
  drawer: '',
};

export function NavLinks({ variant = 'sidebar', onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              title={variant === 'sidebar' ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors',
                LINK_LAYOUT[variant],
                active
                  ? 'bg-brand-subtle text-brand-strong'
                  : 'text-ink-soft hover:bg-background hover:text-ink',
              )}
            >
              <Icon
                aria-hidden
                className={cn('size-[18px] shrink-0', active ? 'text-brand' : 'text-ink-faint')}
              />
              <span className={LABEL_LAYOUT[variant]}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
