import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export type InfoTopic = 'customs_duty' | 'duty_option_i' | 'duty_option_ii';

/** Small (i) button next to a field label that opens an explanation with a worked example. */
export function InfoButton({
  topic,
  label,
}: {
  topic: InfoTopic;
  /** The field's label, used in the button's accessible name. */
  label: string;
}) {
  const { t } = useTranslation();
  const key = `calculator.info.${topic}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 rounded-full text-muted-foreground hover:text-foreground"
          aria-label={t('calculator.info.open', { field: label })}
        >
          <Info className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(`${key}.title`)}</DialogTitle>
          <DialogDescription>{t(`${key}.body`)}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-muted/50 p-3 text-sm">
          <p className="mb-1.5 font-medium">{t('calculator.info.example')}</p>
          <p className="whitespace-pre-line tabular-nums" dir="auto">
            {t(`${key}.example`)}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{t(`${key}.tip`)}</p>
      </DialogContent>
    </Dialog>
  );
}
