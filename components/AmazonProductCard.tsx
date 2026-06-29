"use client";

import { useEffect, useState } from "react";

/**
 * Renders a product purely from its Amazon URL — no local images, no data entry.
 *
 * Strategy:
 *  1. Parse the ASIN + host directly from the URL.
 *  2. Hosts known to block framing (Amazon sends X-Frame-Options: SAMEORIGIN) skip the
 *     doomed iframe and render the elegant branded fallback instantly.
 *  3. Any other URL gets a genuine live-preview attempt: an iframe behind a shimmer that
 *     is only revealed once it actually loads, and falls back on timeout.
 *
 * The user never sees a blank/broken iframe or a browser framing error.
 *
 *   <AmazonProductCard url="https://www.amazon.in/dp/B0GKH81Z5D" />
 */

type Status = "attempting" | "preview" | "fallback";

const NON_EMBEDDABLE_HOSTS = [/amazon\./i, /amzn\./i, /amazon-adsystem\./i];

const ASIN_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})/i,
  /\/gp\/product\/([A-Z0-9]{10})/i,
  /\/product\/([A-Z0-9]{10})/i,
  /[?&]asin=([A-Z0-9]{10})/i,
];

function parse(url: string): { host: string; asin: string | null } {
  let host = "amazon.in";
  let asin: string | null = null;
  try {
    const u = new URL(url);
    host = u.hostname.replace(/^www\./, "");
    const hay = u.pathname + u.search;
    for (const p of ASIN_PATTERNS) {
      const m = hay.match(p);
      if (m) {
        asin = m[1].toUpperCase();
        break;
      }
    }
  } catch {
    /* not a parseable URL — fall through to the loose match below */
  }
  if (!asin) {
    const m = url.match(/\b([A-Z0-9]{10})\b/);
    asin = m ? m[1].toUpperCase() : null;
  }
  return { host, asin };
}

function AmazonLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`} aria-hidden="true">
      <span className="text-3xl font-bold lowercase leading-none tracking-tight text-white">amazon</span>
      <svg viewBox="0 0 120 22" className="mt-0.5 h-3.5 w-[78px]" fill="none">
        <path
          d="M4 7 C 35 22, 85 22, 112 8"
          stroke="#FF9900"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M112 8 l-9 -1 l5 8 z" fill="#FF9900" />
      </svg>
    </span>
  );
}

function AmazonMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.49.124.1.17.05.32-.15.46-.27.19-.62.41-1.05.66-1.32.77-2.79 1.36-4.42 1.78-1.63.42-3.21.63-4.76.63-2.42 0-4.7-.42-6.84-1.27-2.14-.85-4.04-2.05-5.7-3.6-.094-.084-.14-.16-.14-.23 0-.04.012-.07.035-.1zm6.59-5.94c0-.95.234-1.76.7-2.43.466-.67 1.1-1.18 1.9-1.51.733-.31 1.62-.53 2.66-.66.354-.04.93-.1 1.73-.165v-.33c0-.83-.09-1.39-.27-1.68-.27-.4-.7-.6-1.29-.6h-.16c-.43.04-.8.18-1.11.4-.31.23-.51.54-.59.95-.05.26-.18.41-.39.45l-2.24-.28c-.22-.05-.33-.16-.33-.36 0-.04 0-.09.02-.14.21-1.1.74-1.92 1.57-2.45.83-.53 1.81-.85 2.92-.95h.47c1.42 0 2.53.37 3.33 1.1.12.12.23.25.33.38.1.14.18.26.24.36.06.11.11.26.16.46.05.2.08.34.1.43.02.09.04.27.05.55.01.28.02.45.02.5v4.76c0 .34.05.65.15.93.1.28.2.48.29.6.09.12.24.31.45.57.07.1.11.19.11.27 0 .09-.04.17-.13.24-.9.76-1.39 1.17-1.46 1.24-.12.09-.27.1-.44.03-.14-.12-.27-.23-.37-.34l-.22-.25c-.07-.08-.15-.2-.25-.36-.41.45-.81.74-1.21.86-.25.08-.61.12-1.06.12-.69 0-1.26-.21-1.7-.64-.44-.43-.66-1.03-.66-1.82zm3.21-.37c0 .39.1.7.28.94.19.24.45.36.78.36.03 0 .07 0 .12-.01.05-.01.09-.01.11-.01.42-.11.74-.38.98-.8.11-.19.2-.39.25-.61.05-.22.08-.4.09-.54.01-.14.01-.36.01-.67v-.36c-.76 0-1.34.05-1.73.16-.65.18-.97.6-.97 1.25z" />
    </svg>
  );
}

export default function AmazonProductCard({
  url,
  title,
  badge,
  className = "",
}: {
  url: string;
  title?: string;
  badge?: string;
  className?: string;
}) {
  const { host, asin } = parse(url);
  const cleanUrl = asin ? `https://www.${host}/dp/${asin}` : url;
  const displayUrl = `${host}${asin ? `/dp/${asin}` : ""}`;

  // Optional affiliate tag, appended at the edge so the source data stays just a URL.
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG;
  const outUrl = (() => {
    try {
      const u = new URL(cleanUrl);
      if (tag) u.searchParams.set("tag", tag);
      return u.toString();
    } catch {
      return cleanUrl;
    }
  })();

  const embeddable = !NON_EMBEDDABLE_HOSTS.some((r) => r.test(host));
  const [status, setStatus] = useState<Status>(embeddable ? "attempting" : "fallback");

  useEffect(() => {
    if (status !== "attempting") return;
    const t = setTimeout(() => setStatus("fallback"), 2500);
    return () => clearTimeout(t);
  }, [status]);

  const ariaLabel = `View ${title ?? "product"} on Amazon (${displayUrl}) — opens in a new tab`;

  // --- Live preview path (only for non-blocked hosts, hidden behind a shimmer) ---
  if (embeddable && status !== "fallback") {
    return (
      <div
        className={`group relative flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/70 ${className}`}
      >
        <div className="relative flex-1">
          <iframe
            src={cleanUrl}
            title={title ?? "Product preview"}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups"
            onLoad={() => setStatus("preview")}
            className="h-full min-h-[16rem] w-full bg-white"
          />
          {status === "attempting" && (
            <div className="absolute inset-0 animate-pulse bg-ink-850">
              <div className="space-y-3 p-6">
                <div className="h-24 w-full rounded-lg bg-white/[0.04]" />
                <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
                <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
              </div>
            </div>
          )}
        </div>
        <a
          href={outUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={ariaLabel}
          className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-4 py-3 text-sm font-semibold text-amber-200 transition-colors hover:bg-amber-400/10"
        >
          <span className="inline-flex items-center gap-2">
            <AmazonMark className="h-4 w-4" /> View on Amazon
          </span>
          <span className="font-mono text-xs text-slate-500">{displayUrl}</span>
        </a>
      </div>
    );
  }

  // --- Elegant fallback card (the reliable experience for Amazon URLs) ---
  return (
    <a
      href={outUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={ariaLabel}
      className={`group relative flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-900/40 hover:ring-1 hover:ring-brand-500/40 ${className}`}
    >
      {/* Branded visual panel */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-ink-850 to-ink-900 p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ background: "radial-gradient(circle at 30% 25%, #FF9900, transparent 55%)" }}
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 text-[11px] font-semibold text-brand-200 backdrop-blur-sm">
            {badge}
          </span>
        )}
        <AmazonLogo className="transition-transform duration-300 group-hover:scale-105" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 border-t border-white/[0.06] p-5">
        {title && (
          <h3 className="font-semibold leading-snug text-slate-100 group-hover:text-brand-100">{title}</h3>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-slate-400">{asin ?? "AMZN"}</span>
          <span className="truncate font-mono">{displayUrl}</span>
        </div>
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-200 transition-colors group-hover:border-amber-400/60 group-hover:bg-amber-400/20">
          <AmazonMark className="h-4 w-4" />
          View Product on Amazon
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">↗</span>
        </span>
      </div>
    </a>
  );
}
