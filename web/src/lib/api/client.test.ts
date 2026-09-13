import { describe, expect, it } from 'vitest';
import { ApiError } from './client';

describe('ApiError.fieldErrors', () => {
  it('traduz o caminho do Zod para a chave do formulario', () => {
    // Formato real devolvido pelo backend, capturado em execucao:
    // POST /tasks com url vazia -> 400.
    const error = new ApiError('Alguns campos precisam de ajuste.', 400, [
      { code: 'invalid_format', path: ['resources', 0, 'url'], message: 'Invalid URL' },
      { code: 'too_small', path: ['title'], message: 'Too small' },
    ]);

    expect(error.fieldErrors()).toEqual({
      'resources.0.url': 'Invalid URL',
      title: 'Too small',
    });
  });

  it('mantem a primeira mensagem quando o mesmo campo falha duas vezes', () => {
    const error = new ApiError('x', 400, [
      { code: 'a', path: ['title'], message: 'primeira' },
      { code: 'b', path: ['title'], message: 'segunda' },
    ]);

    expect(error.fieldErrors()).toEqual({ title: 'primeira' });
  });

  it('ignora issue sem caminho', () => {
    const error = new ApiError('x', 400, [{ code: 'a', path: [], message: 'raiz' }]);
    expect(error.fieldErrors()).toEqual({});
  });

  it('reconhece falha de rede', () => {
    expect(new ApiError('offline', 0).isNetworkError).toBe(true);
    expect(new ApiError('boom', 500).isNetworkError).toBe(false);
  });
});
