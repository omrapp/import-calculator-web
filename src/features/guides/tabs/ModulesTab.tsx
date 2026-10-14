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
    <Accordion type="single" collapsible className="rounded-lg border px-4">
      {modules.map(module => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger className="text-start">
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
