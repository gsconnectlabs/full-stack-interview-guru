export interface TocItem {
  id: string;
  label: string;
}

/**
 * In-page section links for long answers. Plain anchors (no client JS); targets clear the sticky
 * header via the global `[id] { scroll-margin-top }` rule. The caller supplies the landmark.
 */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <ol className="space-y-0.5 border-l border-ink-700/70">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="-ml-px block border-l border-transparent py-1.5 pl-3 text-sm leading-snug text-slate-400 transition-colors hover:border-brand-400 hover:text-white"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
