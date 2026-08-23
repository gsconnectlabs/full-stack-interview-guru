"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { storeProducts } from "@/lib/store";

const SHOW_DELAY_MS = 10_000;
const STORAGE_KEY = "fig-ebook-cta-status";
const ebook = storeProducts[0];

type Status = "dismissed" | "clicked";

// One-time confetti burst on first appearance only (DECISIONS pending). Subtle, localized
// near the CTA's corner, gold/teal FIG tones, ~0.7s, no loop. Skipped entirely (not just
// visually paused) when the user prefers reduced motion.
type ConfettiPiece = {
  id: number;
  left: number; // % within the CTA wrapper
  top: number;
  tx: number; // px, end x offset
  ty: number; // px, end y offset (negative = up, away from the card body/text)
  rot: number; // deg
  delay: number; // s
  color: string;
  size: number; // px
};

const CONFETTI_COUNT = 10;
const CONFETTI_ANIM_MS = 700;
const CONFETTI_COLORS = ["#e6b84f", "#f0cd7c", "#faedc4", "#6fd0bf", "#ffffff"];

function buildConfetti(): ConfettiPiece[] {
  // Origin is the CTA's top-right corner (near the dismiss ✕, not the headline/link text),
  // and every piece travels upward/outward — away from the card body — before fading.
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    left: 78 + Math.random() * 14,
    top: 4 + Math.random() * 10,
    tx: Math.round((Math.random() * 2 - 1) * 26),
    ty: -Math.round(10 + Math.random() * 26),
    rot: Math.round((Math.random() * 2 - 1) * 220),
    delay: Math.round(Math.random() * 80) / 1000,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 3 + Math.round(Math.random() * 3),
  }));
}

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
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  // The existing impression timer below re-arms on every client-side pathname change (unchanged,
  // pre-existing behavior). This ref is separate: it guards confetti so it only ever plays once
  // for the lifetime of this mounted component, even if the CTA's own timer fires again later.
  const confettiPlayedRef = useRef(false);

  useEffect(() => {
    if (pathname.startsWith("/store") || readStatus()) return;
    let confettiTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setVisible(true);
      sendGAEvent("event", "ebook_cta_impression", { location: pathname });
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reducedMotion && !confettiPlayedRef.current) {
        confettiPlayedRef.current = true;
        setConfetti(buildConfetti());
        confettiTimer = setTimeout(() => setConfetti([]), CONFETTI_ANIM_MS + 200);
      }
    }, SHOW_DELAY_MS);
    return () => {
      clearTimeout(timer);
      if (confettiTimer) clearTimeout(confettiTimer);
    };
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
      {/* Positioning context for the confetti overlay only — does not affect card layout. */}
      <div className="relative">
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

        {/* One-time confetti burst, gated on prefers-reduced-motion in the trigger effect above.
            pointer-events-none + aria-hidden: purely decorative, never intercepts clicks/taps or
            screen-reader focus. Removed from the DOM once the animation completes. */}
        {confetti.length > 0 && (
          <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className="absolute rounded-full motion-safe:animate-confetti-burst"
                style={
                  {
                    left: `${piece.left}%`,
                    top: `${piece.top}%`,
                    width: piece.size,
                    height: piece.size,
                    backgroundColor: piece.color,
                    animationDelay: `${piece.delay}s`,
                    "--tx": `${piece.tx}px`,
                    "--ty": `${piece.ty}px`,
                    "--tr": `${piece.rot}deg`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
