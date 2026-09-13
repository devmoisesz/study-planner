import { describe, expect, it } from 'vitest';
import { NAV_ITEMS, isNavItemActive } from './nav-items';

describe('NAV_ITEMS', () => {
  it('tem exatamente os quatro destinos do front.md', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'Prioridades',
      'Nova tarefa',
      'Recursos',
      'Configurações',
    ]);
  });
});

describe('isNavItemActive', () => {
  it.each([
    ['/', '/', true],
    ['/', '/recursos', false],
    ['/tarefas/nova', '/tarefas/nova', true],
    ['/recursos', '/recursos', true],
    ['/configuracoes', '/configuracoes', true],
  ])('pathname %s com href %s -> %s', (pathname, href, expected) => {
    expect(isNavItemActive(pathname, href)).toBe(expected);
  });

  it('o detalhe de uma tarefa acende Prioridades', () => {
    expect(isNavItemActive('/tarefas/abc-123', '/')).toBe(true);
  });

  it('e nao acende Nova tarefa junto', () => {
    expect(isNavItemActive('/tarefas/abc-123', '/tarefas/nova')).toBe(false);
  });

  it('a tela de nova tarefa nao acende Prioridades', () => {
    expect(isNavItemActive('/tarefas/nova', '/')).toBe(false);
  });

  it('nunca acende mais de um item ao mesmo tempo', () => {
    for (const pathname of ['/', '/tarefas/nova', '/tarefas/abc', '/recursos', '/configuracoes']) {
      const active = NAV_ITEMS.filter((item) => isNavItemActive(pathname, item.href));
      expect(active, `pathname ${pathname}`).toHaveLength(1);
    }
  });
});
