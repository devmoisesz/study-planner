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

const LINK_TONE: Record<NavVariant, { active: string; inactive: string; icon: string }> = {
  sidebar: {
    active: 'bg-sidebar-surface text-ink',
    inactive: 'text-sidebar-ink hover:bg-sidebar-surface hover:text-ink',
    icon: 'text-sidebar-muted',
  },
  drawer: {
    active: 'bg-sidebar-surface text-ink',
    inactive: 'text-sidebar-ink hover:bg-sidebar-surface hover:text-ink',
    icon: 'text-sidebar-muted',
  },
};

export function NavLinks({ variant = 'sidebar', onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const tone = LINK_TONE[variant];

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
                active ? tone.active : tone.inactive,
              )}
            >
              <Icon
                aria-hidden
                className={cn('size-[18px] shrink-0', active ? 'text-sidebar-ink' : tone.icon)}
              />
              <span className={LABEL_LAYOUT[variant]}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
