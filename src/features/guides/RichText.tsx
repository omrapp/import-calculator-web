import type { ReactNode } from 'react';

/** `**bold**` spans as <strong>; everything else stays plain text. */
function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*.*?\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
}

type Block =
  { kind: 'p'; text: string } | { kind: 'ul' | 'ol'; items: string[] };

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = line.startsWith('•');
    const numbered = /^\d+\.\s/.test(line);
    if (bullet || numbered) {
      const kind = bullet ? 'ul' : 'ol';
      const item = bullet
        ? line.slice(1).trim()
        : line.replace(/^\d+\.\s*/, '');
      const last = blocks.at(-1);
      if (last && last.kind === kind) last.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else {
      blocks.push({ kind: 'p', text: line });
    }
  }
  return blocks;
}

/** Renders the app's guide mini-format: lines, • bullets, 1. numbers, **bold**. */
export function RichText({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2 leading-relaxed">
      {toBlocks(text).map((block, i) => {
        if (block.kind === 'p') return <p key={i}>{inline(block.text)}</p>;
        const List = block.kind;
        return (
          <List
            key={i}
            className={
              List === 'ul'
                ? 'list-disc space-y-1 ps-5'
                : 'list-decimal space-y-1 ps-5'
            }
          >
            {block.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
