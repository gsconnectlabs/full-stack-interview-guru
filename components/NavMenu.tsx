"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  /** Inline-nav visibility: always from md, or only from lg (always in the mobile menu). */
  from: "md" | "lg";
}

const ITEMS: NavItem[] = [
  { href: "/candidate", label: "Candidate", from: "md" },
  { href: "/interviewer", label: "Interviewer", from: "md" },
  { href: "/store", label: "Ebook Store", from: "md" },
  { href: "/environment", label: "Environment", from: "lg" },
  { href: "/transition", label: "Transition", from: "lg" },
  { href: "/real-world", label: "Real World", from: "lg" },
];

function isActive(pathname: string, href: string): boolean {
  // Question pages live under /q/ but belong to Candidate mode.
  if (href === "/candidate" && pathname.startsWith("/q/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Primary navigation links (inline on md+, disclosure menu below md). The only client JS in the
 * header: it needs the pathname for `aria-current` and state for the mobile menu. The menu closes
 * on route change, on Escape (returning focus to the toggle), and on outside click.
 */
export default function NavMenu() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="flex items-center">
      <ul className="hidden items-center gap-1 md:flex">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className={item.from === "lg" ? "hidden lg:block" : undefined}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white ${
                  active
                    ? "text-white after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:bg-gold-400"
                    : "text-slate-400"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/10 px-3 text-sm font-medium text-slate-200 transition-colors hover:border-brand-500/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 md:hidden"
      >
        <span aria-hidden="true" className="flex w-4 flex-col gap-[3px]">
          <span className={`h-0.5 rounded bg-current transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
          <span className={`h-0.5 rounded bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 rounded bg-current transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
        </span>
        Menu
      </button>

      <div
        id={menuId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-ink-700/60 bg-ink-950 shadow-lg shadow-black/40 md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-2">
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[48px] items-center border-b border-ink-800 text-base font-medium last:border-0 ${
                    active ? "text-white" : "text-slate-300"
                  }`}
                >
                  {active && <span aria-hidden="true" className="mr-3 h-4 w-0.5 bg-gold-400" />}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
