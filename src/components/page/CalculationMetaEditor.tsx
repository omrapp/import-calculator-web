import { Check, Pencil, X } from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  type CalculationMeta,
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
} from '@/features/calc-engine';
import { cn } from '@/lib/utils';

/**
 * A Calculation's title and description with a pencil to edit them in place.
 * An empty title falls back to `fallbackTitle` (e.g. "Calculation 3").
 */
export function CalculationMetaEditor({
  meta,
  fallbackTitle,
  onSave,
  className,
}: {
  meta: CalculationMeta | undefined;
  fallbackTitle: string;
  onSave: (meta: CalculationMeta) => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const startEditing = () => {
    setTitle(meta?.title ?? '');
    setDescription(meta?.description ?? '');
    setEditing(true);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const trimmed = description.trim();
    onSave({
      title: title.trim() || fallbackTitle,
      ...(trimmed ? { description: trimmed } : {}),
    });
    setEditing(false);
  };

  if (editing) {
    return (
      // A div, not a form: the editor can sit inside the calculator's form.
      <div
        role="group"
        aria-label={t('calculation_meta.edit')}
        data-export-ignore
        className={cn('flex flex-col gap-3', className)}
        onKeyDown={event => {
          if (event.key === 'Escape') setEditing(false);
          if (event.key === 'Enter' && event.target instanceof HTMLInputElement)
            save(event);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-title`}>{t('calculation_meta.title')}</Label>
          <Input
            id={`${id}-title`}
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder={fallbackTitle}
            maxLength={META_TITLE_MAX}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-description`}>
            {t('calculation_meta.description')}
          </Label>
          <Textarea
            id={`${id}-description`}
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder={t('calculation_meta.description_placeholder')}
            maxLength={META_DESCRIPTION_MAX}
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={save}>
            <Check />
            {t('common.save')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setEditing(false)}
          >
            <X />
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-lg font-semibold break-words">
          {meta?.title || fallbackTitle}
        </h2>
        {meta?.description ? (
          <p className="text-sm whitespace-pre-line break-words text-muted-foreground">
            {meta.description}
          </p>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="self-start text-sm text-muted-foreground underline-offset-4 hover:underline print:hidden"
            data-export-ignore
          >
            {t('calculation_meta.add_description')}
          </button>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="-me-2 shrink-0 text-muted-foreground print:hidden"
        onClick={startEditing}
        aria-label={t('calculation_meta.edit')}
        title={t('calculation_meta.edit')}
        data-export-ignore
      >
        <Pencil />
      </Button>
    </div>
  );
}
