import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IncreasePriorityDialog, ProductivityDialog } from './task-dialogs';

describe('ProductivityDialog', () => {
  it('mostra o preview do plan.md: 86 com 55% vira 39', () => {
    render(
      <ProductivityDialog open onClose={vi.fn()} currentScore={86} onConfirm={vi.fn()} />,
    );

    // jsdom nao move input[type=range] com setas; change e o caminho padrao.
    fireEvent.change(screen.getByRole('slider', { name: 'Produtividade' }), {
      target: { value: '55' },
    });

    expect(screen.getByText('86')).toBeInTheDocument();
    expect(screen.getByText('39')).toBeInTheDocument();
    expect(screen.getByText('Baixa prioridade')).toBeInTheDocument();
  });

  it('o slider e alcancavel por teclado e tem nome acessivel', async () => {
    const user = userEvent.setup();
    render(
      <ProductivityDialog open onClose={vi.fn()} currentScore={86} onConfirm={vi.fn()} />,
    );

    const slider = screen.getByRole('slider', { name: 'Produtividade' });
    await user.tab();
    expect(document.activeElement === slider || slider.tabIndex >= 0).toBe(true);
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
  });

  it('confirma com o percentual escolhido', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ProductivityDialog open onClose={vi.fn()} currentScore={86} onConfirm={onConfirm} />,
    );

    fireEvent.change(screen.getByRole('slider', { name: 'Produtividade' }), {
      target: { value: '55' },
    });
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(onConfirm).toHaveBeenCalledWith(55);
  });

  it('cancelar nao confirma', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ProductivityDialog open onClose={vi.fn()} currentScore={86} onConfirm={onConfirm} />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('IncreasePriorityDialog', () => {
  it('mostra o preview do plan.md: 39 com +50% vira 59', () => {
    render(
      <IncreasePriorityDialog open onClose={vi.fn()} currentScore={39} onConfirm={vi.fn()} />,
    );

    expect(screen.getByText('39')).toBeInTheDocument();
    expect(screen.getByText('59')).toBeInTheDocument();
  });

  it('avisa que o teto e 100', () => {
    render(
      <IncreasePriorityDialog open onClose={vi.fn()} currentScore={90} onConfirm={vi.fn()} />,
    );

    expect(screen.getByText('O score nunca passa de 100.')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
