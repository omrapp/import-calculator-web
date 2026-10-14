import { Menu, X } from 'lucide-react';
import * as m from 'motion/react-m';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { Logo } from '@/components/brand';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/features/i18n';
import { ThemeToggle } from '@/features/theme';
import { fadeUp, staggerChildren } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { footerNav, primaryNav } from './nav';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex min-h-11 items-center rounded-lg px-3 text-base font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring',
    isActive
      ? 'bg-accent text-accent-foreground'
      : 'text-foreground hover:bg-muted',
  );

function LinkGroup({
  label,
  links,
  onNavigate,
}: {
  label: string;
  links: readonly { path: string; titleKey: string }[];
  onNavigate: () => void;
}) {
  const { t } = useTranslation();
  return (
    <section aria-label={label} className="flex flex-col gap-1">
      <h2 className="px-3 pb-1 text-xs font-medium text-muted-foreground">
        {label}
      </h2>
      <m.ul
        className="flex flex-col gap-0.5"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        {links.map(({ path, titleKey }) => (
          <m.li key={path} variants={fadeUp}>
            <NavLink to={path} end onClick={onNavigate} className={linkClass}>
              {t(titleKey)}
            </NavLink>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}

export function MobileNav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={t('nav.menu')}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[min(22rem,88vw)] gap-0 overflow-y-auto shadow-xl"
      >
        <SheetHeader className="flex-row items-center justify-between border-b px-4 py-3">
          <SheetTitle asChild>
            <div>
              <Logo size="sm" />
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t('nav.menu')}
          </SheetDescription>
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('common.close')}
            >
              <X />
            </Button>
          </SheetClose>
        </SheetHeader>

        <nav aria-label={t('nav.main')} className="flex flex-col gap-6 p-3">
          <LinkGroup
            label={t('nav.tools')}
            links={primaryNav}
            onNavigate={close}
          />
          <LinkGroup
            label={t('nav.information')}
            links={footerNav}
            onNavigate={close}
          />
        </nav>

        <div className="mt-auto flex items-center justify-between gap-2 border-t px-4 py-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
