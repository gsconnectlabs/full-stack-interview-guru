import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import JsonLd from "./JsonLd";

export interface Crumb {
  name: string;
  /** Omit href on the current (last) page. */
  href?: string;
}

/**
 * Accessible breadcrumb trail + matching BreadcrumbList structured data, from a
 * single source. Renders a semantic <nav><ol> with aria-current on the current
 * page, and emits schema.org BreadcrumbList JSON-LD (absolute URLs).
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((c, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {c.href && !isLast ? (
                  <Link href={c.href} className="hover:text-brand-300">
                    {c.name}
                  </Link>
                ) : (
                  <span className="text-slate-300" aria-current={isLast ? "page" : undefined}>
                    {c.name}
                  </span>
                )}
                {!isLast && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
