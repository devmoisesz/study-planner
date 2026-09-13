'use client';

import { createContext, useContext, useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface FieldContextValue {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Liga label, dica e erro ao controle sem que cada tela repita ids e
 * aria-describedby na mao. Input/Textarea/Select leem isso via contexto.
 */
export function useFieldControl(): FieldContextValue {
  return (
    useContext(FieldContext) ?? {
      controlId: '',
      describedBy: undefined,
      invalid: false,
      required: false,
    }
  );
}

export interface FieldProps {
  label: string;
  /**
   * Texto que ACIMA do controle explica o que responder. Use quando a
   * pessoa precisa da explicacao antes de interagir, nao depois.
   */
  description?: ReactNode;
  /** Texto de apoio permanente, abaixo. Substituido pelo erro quando houver. */
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  description,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const controlId = `${id}-control`;
  const descriptionId = `${id}-description`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy =
    [description ? descriptionId : null, error ? errorId : hint ? hintId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <FieldContext.Provider
      value={{ controlId, describedBy, invalid: Boolean(error), required: Boolean(required) }}
    >
      <div className={cn('flex flex-col gap-1.5', className)}>
        {/* O asterisco fica FORA do <label> de proposito: dentro dele, ainda
            que aria-hidden, ele entra no texto do rotulo e o nome acessivel
            do campo vira "Titulo*". Quem anuncia a obrigatoriedade e o
            aria-required do proprio controle. */}
        <div className="flex items-center gap-0.5">
          <label htmlFor={controlId} className="text-sm font-medium text-ink">
            {label}
          </label>
          {required ? (
            <span className="text-brand" aria-hidden>
              *
            </span>
          ) : null}
        </div>

        {description ? (
          <p id={descriptionId} className="-mt-0.5 text-xs text-ink-soft">
            {description}
          </p>
        ) : null}

        {children}

        {error ? (
          <p id={errorId} className="text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-ink-soft">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
