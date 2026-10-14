import {
  Calculator,
  Car,
  FileText,
  type LucideIcon,
  MonitorSmartphone,
  Plane,
  Scale,
} from 'lucide-react';

/** Icon and accent per learning-module category. */
export const CATEGORY_STYLE: Record<
  string,
  { icon: LucideIcon; badge: string }
> = {
  regulations: {
    icon: Scale,
    badge: 'bg-sky-500/12 text-sky-700 dark:text-sky-300',
  },
  vehicles: {
    icon: Car,
    badge: 'bg-rose-500/12 text-rose-700 dark:text-rose-300',
  },
  systems: {
    icon: MonitorSmartphone,
    badge: 'bg-indigo-500/12 text-indigo-700 dark:text-indigo-300',
  },
  documentation: {
    icon: FileText,
    badge: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  },
  shipping: {
    icon: Plane,
    badge: 'bg-teal-500/12 text-teal-700 dark:text-teal-300',
  },
  calculation: {
    icon: Calculator,
    badge: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  },
};
