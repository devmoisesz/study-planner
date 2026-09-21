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

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Confira os dados informados e tente novamente.',
  401: 'Sua sessão expirou. Entre novamente para continuar.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Não encontramos o item solicitado. Atualize a página e tente novamente.',
  409: 'Não foi possível concluir porque esses dados já existem.',
  413: 'Este PDF excede o limite de 10 MB. Escolha um arquivo menor.',
  500: 'O servidor encontrou um problema. Tente novamente em alguns instantes.',
};

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

/** Retorna uma mensagem segura e útil para exibir na interface. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Não foi possível concluir esta ação. Tente novamente.',
): string {
  return error instanceof ApiError ? error.message : fallback;
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

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  const headers = new Headers(init?.headers);
  const isFormData =
    typeof FormData !== 'undefined' && init?.body instanceof FormData;

  // O browser precisa definir sozinho o boundary de multipart/form-data.
  // Para os demais requests, a API recebe JSON como antes.
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    response = await fetch(`${BASE_PATH}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      0,
    );
  }

  const body = await parseBody(response);

  if (!response.ok) {
    const parsed = (body ?? {}) as ApiErrorBody;
    const message =
      HTTP_ERROR_MESSAGES[response.status] ??
      'Não foi possível concluir agora. Tente novamente em alguns instantes.';

    throw new ApiError(message, response.status, parsed.errors ?? []);
  }

  return body as T;
}
