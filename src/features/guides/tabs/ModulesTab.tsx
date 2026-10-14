import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/features/i18n';

import { learningModules } from '../data/learning-modules';
import { RichText } from '../RichText';
import { searchModules } from '../search';
import { EmptyState } from './EmptyState';

export function ModulesTab({ query }: { query: string }) {
  const { language } = useLanguage();
  const modules = searchModules(learningModules, query, language);
  if (modules.length === 0) return <EmptyState />;

  return (
    <Accordion type="single" collapsible className="flex flex-col gap-2">
      {modules.map(module => (
        <AccordionItem
          key={module.id}
          value={module.id}
          className="rounded-2xl border bg-card px-5 shadow-xs transition-shadow duration-150 last:border-b data-[state=open]:shadow-md"
        >
          <AccordionTrigger className="text-start text-base font-semibold hover:no-underline">
            {module.title[language]}
          </AccordionTrigger>
          <AccordionContent>
            <RichText text={module.content[language]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
