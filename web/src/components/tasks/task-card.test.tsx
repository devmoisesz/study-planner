import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskCard } from './task-card';
import type { RankedTask } from '@/types/api';

const task: RankedTask = {
  id: 'task-1',
  title: 'Estudar Trigonometria',
  description: 'Revisar ângulos notáveis',
  score: 86,
  resourceCount: 3,
  createdAt: '2026-09-13T00:00:00.000Z',
  updatedAt: '2026-09-13T00:00:00.000Z',
};

function renderCard(overrides: Partial<RankedTask> = {}) {
  const handlers = {
    onRegisterProductivity: vi.fn(),
    onIncreasePriority: vi.fn(),
    onDelete: vi.fn(),
  };

  render(<TaskCard task={{ ...task, ...overrides }} {...handlers} />);
  return handlers;
}

describe('TaskCard', () => {
  it('mostra score, titulo e a faixa em TEXTO, nao so em cor', () => {
    renderCard();

    expect(screen.getByText('86')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Estudar Trigonometria' })).toBeInTheDocument();
    // WCAG 1.4.1: a prioridade nao pode depender apenas da cor.
    expect(screen.getByText('Urgente')).toBeInTheDocument();
  });

  it('o titulo leva para o detalhe da tarefa', () => {
    renderCard();
    expect(screen.getByRole('link', { name: 'Estudar Trigonometria' })).toHaveAttribute(
      'href',
      '/tarefas/task-1',
    );
  });

  it.each([
    [1, '1 recurso'],
    [3, '3 recursos'],
  ])('pluraliza %i recurso(s)', (resourceCount, expected) => {
    renderCard({ resourceCount });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('nao reserva espaco quando nao ha recursos nem descricao', () => {
    renderCard({ resourceCount: 0, description: null });

    expect(screen.queryByText(/recurso/)).not.toBeInTheDocument();
    expect(screen.queryByText('Revisar ângulos notáveis')).not.toBeInTheDocument();
  });

  it('registra produtividade com o percentual escolhido', async () => {
    const user = userEvent.setup();
    const { onRegisterProductivity } = renderCard();

    await user.click(screen.getByRole('button', { name: 'Produtividade' }));

    const dialog = screen.getByRole('dialog', { name: /Registrar produtividade/ });
    // Preview: 86 x (1 - 0.5) = 43
    expect(within(dialog).getByText('43')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Registrar' }));
    expect(onRegisterProductivity).toHaveBeenCalledWith(50);
  });

  it('exige confirmacao antes de excluir', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderCard();

    await user.click(screen.getByRole('button', { name: /Mais ações/ }));
    await user.click(screen.getByRole('button', { name: 'Excluir tarefa' }));

    expect(onDelete).not.toHaveBeenCalled();

    const dialog = screen.getByRole('dialog', { name: /Excluir tarefa/ });
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }));

    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('cancelar no dialogo de exclusao nao exclui', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderCard();

    await user.click(screen.getByRole('button', { name: /Mais ações/ }));
    await user.click(screen.getByRole('button', { name: 'Excluir tarefa' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onDelete).not.toHaveBeenCalled();
  });
});
