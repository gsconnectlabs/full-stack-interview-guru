"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearRecent, readRecent, type RecentQuestion } from "@/lib/recently-viewed";

/**
 * "Continue reading" for returning visitors, read from localStorage after mount (so server and
 * first client render match). Renders nothing for first-time visitors. Includes a clear control
 * because the history is the visitor's own data.
 */
export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentQuestion[]>([]);

  useEffect(() => setItems(readRecent()), []);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-title" className="mb-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="recently-viewed-title" className="eyebrow text-gold-400/90">
          Continue reading
        </h2>
        <button
          type="button"
          onClick={() => {
            clearRecent();
            setItems([]);
          }}
          className="rounded text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
        >
          Clear history
        </button>
      </div>
      <ul className="mt-2 space-y-0.5">
        {items.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/q/${r.slug}`}
              className="group -mx-2 block rounded-md px-2 py-2 transition-colors hover:bg-white/[0.03]"
            >
              <span className="block text-sm font-medium leading-snug text-slate-200 group-hover:text-brand-200">
                {r.title}
              </span>
              {r.category && <span className="text-xs text-slate-400">{r.category}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
