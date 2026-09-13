/**
 * Cliente HTTP do Study Planner.
 *
 * Tudo passa por /api/*, que o next.config.ts reescreve para a API Nest.
 * Mesma origem de proposito: o backend nao habilita CORS e nao deve ser
 * alterado para isso.
 */

/** Formato de um issue do Zod 4, como o ZodValidationPipe devolve. */
export interface ApiIssue {
  code: string;
  path: (string | number)[];
  message: string;
}

interface ApiErrorBody {
  message?: string;
  errors?: ApiIssue[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly issues: ApiIssue[];

  constructor(message: string, status: number, issues: ApiIssue[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.issues = issues;
  }

  /** true quando a falha foi de rede, nao uma resposta do servidor. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }

  /**
   * Mapeia os issues para `caminho.pontilhado -> mensagem`, no formato que
   * o react-hook-form usa em setError. Ex.: `resources.0.url`.
   */
  fieldErrors(): Record<string, string> {
    const result: Record<string, string> = {};

    for (const issue of this.issues) {
      const key = issue.path.join('.');
      if (key && !result[key]) result[key] = issue.message;
    }

    return result;
  }
}

const BASE_PATH = '/api';

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_PATH}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('Não foi possível falar com o servidor.', 0);
  }

  const body = await parseBody(response);

  if (!response.ok) {
    const parsed = (body ?? {}) as ApiErrorBody;
    const message =
      response.status === 400
        ? 'Alguns campos precisam de ajuste.'
        : (parsed.message ?? 'O servidor não conseguiu concluir a operação.');

    throw new ApiError(message, response.status, parsed.errors ?? []);
  }

  return body as T;
}
