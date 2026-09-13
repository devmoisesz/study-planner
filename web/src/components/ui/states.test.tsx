import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListChecks } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';

describe('EmptyState', () => {
  it('convida a agir em vez de mostrar tela em branco', () => {
    render(
      <EmptyState
        icon={ListChecks}
        title="Nenhuma tarefa ainda"
        description="Crie sua primeira tarefa."
        action={<button type="button">Nova tarefa</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Nenhuma tarefa ainda' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nova tarefa' })).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('e anunciado como alerta e oferece o proximo passo', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        title="Não foi possível carregar suas tarefas"
        description="O servidor não respondeu."
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('sem onRetry nao mostra botao', () => {
    render(<ErrorState title="Erro" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
