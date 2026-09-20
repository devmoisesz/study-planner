'use server';

import { redirect } from 'next/navigation';
import type { ZodError } from 'zod';
import { createSession, deleteSession } from '@/lib/auth/session';
import { loginSchema, registerSchema } from '@/lib/domain/auth-schema';

type AuthField = 'name' | 'email' | 'password';

export interface AuthActionState {
  fieldErrors?: Partial<Record<AuthField, string>>;
  message?: string;
  values?: { name?: string; email?: string };
}

interface SessionResponse {
  accessToken: string;
}

interface ApiErrorBody {
  message?: string;
  errors?: Array<{ path?: Array<string | number>; message?: string }>;
}

class AuthApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.message ?? 'Authentication request failed');
  }
}

function apiOrigin(): string {
  return process.env.ORDO_API_ORIGIN ?? 'http://localhost:3000';
}

async function post<T>(path: string, data: object): Promise<T> {
  const response = await fetch(`${apiOrigin()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  const body = (await response.json().catch(() => ({}))) as ApiErrorBody | T;

  if (!response.ok) {
    throw new AuthApiError(response.status, body as ApiErrorBody);
  }

  return body as T;
}

function fieldErrors(error: ZodError): AuthActionState['fieldErrors'] {
  const result: AuthActionState['fieldErrors'] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === 'name' || field === 'email' || field === 'password') &&
      !result[field]
    ) {
      result[field] = issue.message;
    }
  }

  return result;
}

function safeDestination(value: FormDataEntryValue | null): string {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//')
    ? value
    : '/';
}

export async function loginAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const values = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      fieldErrors: fieldErrors(parsed.error),
      values: { email: values.email },
    };
  }

  try {
    const session = await post<SessionResponse>('/sessions', parsed.data);
    await createSession(session.accessToken);
  } catch (error) {
    return {
      message:
        error instanceof AuthApiError && error.status === 401
          ? 'E-mail ou senha incorretos.'
          : 'Não foi possível entrar agora. Tente novamente em instantes.',
      values: { email: parsed.data.email },
    };
  }

  redirect(safeDestination(formData.get('next')));
}

export async function registerAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };
  const parsed = registerSchema.safeParse(values);

  if (!parsed.success) {
    return {
      fieldErrors: fieldErrors(parsed.error),
      values: { name: values.name, email: values.email },
    };
  }

  let userCreated = false;

  try {
    await post('/users', parsed.data);
    userCreated = true;
    const session = await post<SessionResponse>('/sessions', {
      email: parsed.data.email,
      password: parsed.data.password,
    });
    await createSession(session.accessToken);
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 409) {
      return {
        fieldErrors: { email: 'Já existe uma conta com este e-mail.' },
        values: { name: parsed.data.name, email: parsed.data.email },
      };
    }

    return {
      message: userCreated
        ? 'Sua conta foi criada. Entre com seus dados para continuar.'
        : 'Não foi possível criar sua conta agora. Tente novamente em instantes.',
      values: { name: parsed.data.name, email: parsed.data.email },
    };
  }

  redirect('/');
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect('/login');
}
