import { NavLink, Outlet } from 'react-router';

import { navItems } from '@/app/nav';
import { cn } from '@/lib/utils';

export function AppLayout() {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-x-4 gap-y-2 px-4 py-3 text-sm">
          {navItems.map(({ path, title }) => (
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
              {title}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
