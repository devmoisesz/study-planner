'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useWatch } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CreateTaskFormValues } from '@/lib/domain/create-task-schema';
import { EMPTY_RESOURCE } from '@/lib/domain/create-task-schema';
import {
  RESOURCE_TYPE_OPTIONS,
  resourceTypeMeta,
} from '@/lib/domain/resource-type';

interface SharedProps {
  control: Control<CreateTaskFormValues>;
  register: UseFormRegister<CreateTaskFormValues>;
  errors: FieldErrors<CreateTaskFormValues>;
  disabled?: boolean;
}

type FileChangeHandler = (index: number, file: File | null) => void;

interface ResourceFieldsetProps extends SharedProps {
  index: number;
  onRemove: () => void;
  onFileChange: (file: File | null) => void;
}

/** Um componente por recurso para que cada um possa observar o proprio tipo. */
function ResourceFieldset({
  index,
  control,
  register,
  errors,
  disabled,
  onRemove,
  onFileChange,
}: ResourceFieldsetProps) {
  const type = useWatch({ control, name: `resources.${index}.type` });
  const meta = resourceTypeMeta(type);
  const fieldErrors = errors.resources?.[index];
  const typeField = register(`resources.${index}.type`);

  return (
    <fieldset className="flex flex-col gap-4 rounded-md border border-line bg-surface p-4">
      <legend className="sr-only">Recurso {index + 1}</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Título" required error={fieldErrors?.title?.message}>
          <Input
            placeholder="Aula de ângulos notáveis"
            disabled={disabled}
            {...register(`resources.${index}.title`)}
          />
        </Field>

        <Field label="Tipo" required>
          <Select
            disabled={disabled}
            {...typeField}
            onChange={(event) => {
              typeField.onChange(event);
              if (event.target.value !== 'PDF') onFileChange(null);
            }}
          >
            {RESOURCE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Endereço"
          className="sm:col-span-2"
          // Livro normalmente nao tem URL, entao a dica acompanha o tipo.
          hint={
            meta.expectsUrl
              ? 'Cole o link completo, começando com https://'
              : 'Opcional para este tipo.'
          }
          error={fieldErrors?.url?.message}
        >
          <Input
            type="url"
            inputMode="url"
            placeholder={meta.expectsUrl ? 'https://…' : ''}
            disabled={disabled}
            {...register(`resources.${index}.url`)}
          />
        </Field>

        {meta.acceptsUpload ? (
          <Field
            label="Arquivo"
            className="sm:col-span-2"
            description="Se o PDF estiver no seu computador, escolha o arquivo em vez do link. Limite: 10 MB."
          >
            <FileInput
              accept="application/pdf,.pdf"
              disabled={disabled}
              onChange={onFileChange}
            />
          </Field>
        ) : null}

        <Field label="Descrição" className="sm:col-span-2">
          <Textarea
            rows={2}
            placeholder="Capítulo 8, páginas 184–193"
            disabled={disabled}
            {...register(`resources.${index}.description`)}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={onRemove}
          className="text-danger hover:bg-danger-soft hover:text-danger"
        >
          <Trash2 aria-hidden className="size-3.5" />
          Remover recurso
        </Button>
      </div>
    </fieldset>
  );
}

export function ResourceFields({
  control,
  register,
  errors,
  disabled,
  onFileChange,
  onResourceRemove,
}: SharedProps & {
  onFileChange?: FileChangeHandler;
  onResourceRemove?: (index: number) => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'resources',
  });

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Recursos</h2>
        <p className="text-xs text-ink-soft">
          Vídeos, livros, PDFs ou sites que ajudam nesta tarefa. Pode deixar em
          branco.
        </p>
      </div>

      {fields.map((field, index) => (
        <ResourceFieldset
          key={field.id}
          index={index}
          control={control}
          register={register}
          errors={errors}
          disabled={disabled}
          onRemove={() => {
            onResourceRemove?.(index);
            remove(index);
          }}
          onFileChange={(file) => onFileChange?.(index, file)}
        />
      ))}

      <div>
        <Button
          disabled={disabled}
          onClick={() => append({ ...EMPTY_RESOURCE })}
        >
          <Plus aria-hidden className="size-4" />
          Adicionar recurso
        </Button>
      </div>
    </section>
  );
}
