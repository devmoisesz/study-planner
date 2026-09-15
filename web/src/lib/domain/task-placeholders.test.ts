import { describe, expect, it, vi } from 'vitest';
import {
  createTaskPlaceholders,
  TASK_DESCRIPTION_PLACEHOLDERS,
  TASK_TITLE_PLACEHOLDERS,
} from './task-placeholders';

describe('createTaskPlaceholders', () => {
  it('seleciona exemplos de título e descrição usando o sorteio informado', () => {
    const random = vi.fn().mockReturnValueOnce(0).mockReturnValueOnce(0.999999);

    expect(createTaskPlaceholders(random)).toEqual({
      title: TASK_TITLE_PLACEHOLDERS[0],
      description:
        TASK_DESCRIPTION_PLACEHOLDERS[TASK_DESCRIPTION_PLACEHOLDERS.length - 1],
    });
    expect(random).toHaveBeenCalledTimes(2);
  });

  it('preserva os placeholders que já existiam no formulário', () => {
    expect(TASK_TITLE_PLACEHOLDERS).toContain('Estudar Trigonometria');
    expect(TASK_DESCRIPTION_PLACEHOLDERS).toContain(
      'Revisar ângulos notáveis e a circunferência trigonométrica.',
    );
  });
});
