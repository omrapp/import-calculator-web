import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { isLanguage, SUPPORTED_LANGUAGES, useLanguage } from '@/features/i18n';

export function SettingsView() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);
  const siteUrl = window.location.origin;

  const share = async () => {
    if (typeof navigator.share === 'function') {
      await navigator
        .share({ title: t('home.title'), url: siteUrl })
        .catch(() => undefined);
      return;
    }
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8">
      <h1 className="text-2xl font-semibold">{t('nav.settings')}</h1>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-lg font-semibold">
          {t('settings.language')}
        </legend>
        <RadioGroup
          value={language}
          onValueChange={value => {
            if (isLanguage(value)) void setLanguage(value);
          }}
        >
          {SUPPORTED_LANGUAGES.map(code => (
            <div key={code} className="flex items-center gap-3">
              <RadioGroupItem value={code} id={`language-${code}`} />
              <Label htmlFor={`language-${code}`}>
                {t(`settings.languages.${code}`)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      <section className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold">{t('settings.share_site')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('pages.settings.share_hint')}
        </p>
        <Button type="button" variant="outline" onClick={() => void share()}>
          {copied ? <Check /> : <Share2 />}
          {copied ? t('result.link_copied') : t('settings.share_site')}
        </Button>
      </section>
    </section>
  );
}
