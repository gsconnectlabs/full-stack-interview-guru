"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  /** Inline from md, or only from lg; below that breakpoint the link lives in the disclosure menu. */
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
 * Primary navigation links: inline from md (all of them from lg); below lg a disclosure menu lists
 * whatever is not inline — everything below md, the lg-only links from md to lg. The only client JS in the
 * header: it needs the pathname for `aria-current` and state for the mobile menu. The menu closes
 * on route change, on Escape (returning focus to the toggle), and on outside click.
 */
export default function NavMenu() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const overflowActive = ITEMS.some((item) => item.from === "lg" && isActive(pathname, item.href));
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
    <div ref={wrapRef} className="flex items-center gap-2">
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
        className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/10 px-3 text-sm font-medium text-slate-200 transition-colors hover:border-brand-500/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 lg:hidden"
      >
        <span aria-hidden="true" className="flex w-4 flex-col gap-[3px]">
          <span className={`h-0.5 rounded bg-current transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
          <span className={`h-0.5 rounded bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 rounded bg-current transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
        </span>
        Menu
        {/* md–lg: the current page is one of the links tucked into this menu */}
        {overflowActive && (
          <span aria-hidden="true" className="hidden h-1.5 w-1.5 rounded-full bg-gold-400 md:inline-block" />
        )}
      </button>

      <div
        id={menuId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-ink-700/60 bg-ink-950 shadow-lg shadow-black/40 lg:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className={item.from === "md" ? "md:hidden" : undefined}>
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
