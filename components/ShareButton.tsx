"use client";

import { useTemporaryFlag } from "@/hooks/useTemporaryFlag";

/**
 * Share control for a question page. Uses the native Web Share API (mobile / supported
 * browsers) to open the OS share sheet; on browsers without it (typical desktop) it
 * gracefully falls back to copying the link to the clipboard.
 *
 * No dependencies. Accessible: real <button>; the decorative icon is aria-hidden so the
 * accessible name is just "Share" (→ "Link copied" on the fallback), announced via aria-live.
 */
export default function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, markCopied] = useTemporaryFlag();

  async function share() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user dismissed the sheet, or share failed — nothing more to do */
      }
      return;
    }
    // No native share (typical desktop) → copy the link as a graceful fallback.
    try {
      await navigator.clipboard.writeText(url);
      markCopied();
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button type="button" onClick={share} aria-live="polite" className="btn-pill">
      {copied ? (
        <>
          <span aria-hidden="true">✓ </span>Link copied
        </>
      ) : (
        <>
          <span aria-hidden="true">↗ </span>Share
        </>
      )}
    </button>
  );
}
