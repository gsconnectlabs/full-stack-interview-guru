"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchQuestions } from "@/lib/search";

const EXAMPLES = ["hashmap", "stream api", "optional", "jwt", "docker", "lambda", "json", "python list"];

export default function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchQuestions(query, 8), [query]);
  const showResults = open && query.trim() !== "" && results.length > 0;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setActive(0), [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/q/${results[active].slug}`);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        >
          🔍
        </span>
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search anything…"
          aria-label="Search interview questions"
          role="combobox"
          aria-expanded={showResults}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            showResults && results[active] ? `search-opt-${results[active].slug}` : undefined
          }
          className="w-full rounded-2xl border border-white/10 bg-ink-900/80 py-4 pl-12 pr-4 text-base text-slate-100 shadow-xl shadow-black/20 outline-none ring-brand-500/0 transition placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10"
        />
      </div>

      {open && query.trim() !== "" && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/50">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              No matches for “{query}”. Try <span className="text-brand-300">hashmap</span> or{" "}
              <span className="text-brand-300">jwt</span>.
            </p>
          ) : (
            <ul id="search-results" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto py-2">
              {results.map((r, i) => (
                <li key={r.slug} role="presentation">
                  <Link
                    id={`search-opt-${r.slug}`}
                    role="option"
                    aria-selected={i === active}
                    href={`/q/${r.slug}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 ${
                      i === active ? "bg-brand-500/10" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-100">{r.title}</span>
                      <span className="text-xs text-slate-500">
                        {r.category} • {r.topic}
                      </span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-xs text-slate-600">↵</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex);
                setOpen(true);
              }}
              className="chip transition-colors hover:border-brand-500/40 hover:text-brand-200"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
