import {
  Check,
  Languages,
  Monitor,
  Moon,
  Palette,
  Settings,
  Share2,
  Sun,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { isLanguage, SUPPORTED_LANGUAGES, useLanguage } from '@/features/i18n';
import { isTheme, THEMES, useTheme } from '@/features/theme';

const THEME_ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

/**
 * A settings group: icon, heading, optional hint, then its controls. A radio
 * group renders as a fieldset whose legend is the heading.
 */
function Group({
  as: Root = 'section',
  icon,
  heading,
  hint,
  children,
}: {
  as?: 'fieldset' | 'section';
  icon: ReactNode;
  heading: string;
  hint?: string;
  children: ReactNode;
}) {
  const Heading = Root === 'fieldset' ? 'legend' : 'h2';
  return (
    <Root className="flex min-w-0 flex-col gap-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
      <Heading className="float-start flex w-full items-center gap-3 text-lg leading-tight font-semibold">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground ring-1 ring-highlight/20 ring-inset [&_svg]:size-4.5"
        >
          {icon}
        </span>
        {heading}
      </Heading>
      {hint && (
        <p className="clear-both -mt-2 text-sm text-muted-foreground">{hint}</p>
      )}
      <div className="clear-both">{children}</div>
    </Root>
  );
}

/** A radio drawn as a selectable tile; the whole tile is the label. */
function Option({
  id,
  value,
  icon,
  children,
}: {
  id: string;
  value: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border bg-background px-4 py-2.5 font-medium transition-colors duration-150 hover:bg-muted has-data-[state=checked]:border-highlight has-data-[state=checked]:bg-accent has-data-[state=checked]:text-accent-foreground [&_svg]:size-4"
    >
      <RadioGroupItem value={value} id={id} />
      {icon}
      {children}
    </Label>
  );
}

export function SettingsView() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
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
    <section className="mx-auto flex max-w-prose-tight flex-col gap-6">
      <PageHeader
        icon={<Settings />}
        title={t('nav.settings')}
        description={t('pages.settings.lead')}
      />

      <Group
        as="fieldset"
        icon={<Languages />}
        heading={t('settings.language')}
      >
        <RadioGroup
          value={language}
          onValueChange={value => {
            if (isLanguage(value)) void setLanguage(value);
          }}
          className="grid gap-2 sm:grid-cols-3"
        >
          {SUPPORTED_LANGUAGES.map(code => (
            <Option key={code} id={`language-${code}`} value={code}>
              {t(`settings.languages.${code}`)}
            </Option>
          ))}
        </RadioGroup>
      </Group>

      <Group
        as="fieldset"
        icon={<Palette />}
        heading={t('settings.theme.label')}
        hint={t('pages.settings.theme_hint')}
      >
        <RadioGroup
          value={theme}
          onValueChange={value => {
            if (isTheme(value)) setTheme(value);
          }}
          className="grid gap-2 sm:grid-cols-3"
        >
          {THEMES.map(value => {
            const Icon = THEME_ICONS[value];
            return (
              <Option
                key={value}
                id={`theme-${value}`}
                value={value}
                icon={<Icon aria-hidden />}
              >
                {t(`settings.theme.${value}`)}
              </Option>
            );
          })}
        </RadioGroup>
      </Group>

      <Group
        icon={<Share2 />}
        heading={t('settings.share_site')}
        hint={t('pages.settings.share_hint')}
      >
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => void share()}
        >
          {copied ? <Check /> : <Share2 />}
          {copied ? t('result.link_copied') : t('settings.share_site')}
        </Button>
      </Group>

      <p className="text-center text-sm text-muted-foreground">
        <bdi>{t('pages.about.version', { version: __APP_VERSION__ })}</bdi>
      </p>
    </section>
  );
}
