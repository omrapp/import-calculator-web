import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router';

import { navItems } from '@/app/nav';
import { LanguageSwitcher } from '@/features/i18n';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-svh">
      <header className="border-b print:hidden">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-4 py-3">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {navItems.map(({ path, titleKey }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  cn(
                    'text-muted-foreground hover:text-foreground',
                    isActive && 'font-medium text-foreground',
                  )
                }
              >
                {t(titleKey)}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
