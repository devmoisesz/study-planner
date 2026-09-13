import { Layers, ListOrdered, Plus, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Estrutura do front.md secao 6. Quatro destinos, nada alem disso. */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Prioridades', icon: ListOrdered },
  { href: '/tarefas/nova', label: 'Nova tarefa', icon: Plus },
  { href: '/recursos', label: 'Recursos', icon: Layers },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
] as const;

/**
 * Decide o item ativo.
 *
 * O detalhe de uma tarefa (/tarefas/<id>) pertence a Prioridades, porque e
 * de la que se chega nele — mas /tarefas/nova e um destino proprio e nao
 * pode acender os dois.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/') {
    if (pathname === '/') return true;
    return pathname.startsWith('/tarefas/') && pathname !== '/tarefas/nova';
  }

  if (href === '/tarefas/nova') return pathname === '/tarefas/nova';

  return pathname === href || pathname.startsWith(`${href}/`);
}
