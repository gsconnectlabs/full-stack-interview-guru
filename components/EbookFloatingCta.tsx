"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { storeProducts } from "@/lib/store";

const SHOW_DELAY_MS = 10_000;
const STORAGE_KEY = "fig-ebook-cta-status";
const ebook = storeProducts[0];

type Status = "dismissed" | "clicked";

function readStatus(): Status | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return value === "dismissed" || value === "clicked" ? value : null;
  } catch {
    return null;
  }
}

function writeStatus(status: Status) {
  try {
    sessionStorage.setItem(STORAGE_KEY, status);
  } catch {
    /* sessionStorage unavailable (private mode, etc.) — non-fatal, just won't persist */
  }
}

/**
 * Small, dismissible floating invitation to the free ebook on `/store` (Ebook Store). Appears
 * once per session, `SHOW_DELAY_MS` after mount, and never on `/store` itself (the destination).
 * Session status (dismissed/clicked) lives in sessionStorage so it doesn't re-interrupt the
 * same visit — no backend, no new dependency (mirrors the localStorage pattern in HelpfulVote,
 * sessionStorage here because the frequency cap is per-session by design).
 */
export default function EbookFloatingCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/store") || readStatus()) return;
    const timer = setTimeout(() => {
      setVisible(true);
      sendGAEvent("event", "ebook_cta_impression", { location: pathname });
    }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Also re-checked at render time (not just before starting the timer): the component is
  // mounted once in the root layout and persists across client-side route changes, so a
  // click that soft-navigates to /store must hide the card immediately rather than leaving
  // stale `visible` state showing on the destination page.
  if (!visible || pathname.startsWith("/store")) return null;

  function handleClick() {
    writeStatus("clicked");
    setVisible(false);
    sendGAEvent("event", "ebook_cta_click", { location: pathname, destination: "/store" });
  }

  function handleDismiss() {
    writeStatus("dismissed");
    setVisible(false);
    sendGAEvent("event", "ebook_cta_dismiss", { location: pathname });
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-40 motion-safe:animate-fade-up sm:bottom-6 sm:right-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Mobile: compact pill, not the desktop chat-style card */}
      <div className="flex items-center gap-1 rounded-full border border-gold-500/30 bg-ink-900/95 py-2 pl-4 pr-2 shadow-lg shadow-black/30 sm:hidden">
        <Link href="/store" onClick={handleClick} className="flex items-center gap-1.5 text-sm font-semibold text-white">
          <span aria-hidden="true">📘</span> Free Ebook <span className="text-gold-300" aria-hidden="true">→</span>
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss free ebook offer"
          className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      {/* Desktop/tablet: compact chat-style card */}
      <div className="card-premium relative hidden max-w-[280px] items-start gap-3 p-4 pr-9 shadow-lg shadow-black/20 sm:flex">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss free ebook offer"
          className="absolute right-2 top-2 rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <Image
          src={ebook.coverImage}
          alt=""
          width={44}
          height={44}
          className="shrink-0 rounded-md border border-white/10 object-cover motion-safe:animate-cta-settle"
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Get our FREE Ebook</p>
          <Link
            href="/store"
            onClick={handleClick}
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-300 hover:text-brand-200"
          >
            Prepare smarter for your next interview <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
