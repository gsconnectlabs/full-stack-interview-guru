"use client";

import { useTemporaryFlag } from "@/hooks/useTemporaryFlag";

/**
 * Reusable copy-to-clipboard button. Owns the clipboard write and the transient
 * "copied" feedback so callers (CodeBlock, Copy Link, etc.) don't re-implement it.
 *
 * Accessible: it's a real <button> whose visible label provides its accessible name;
 * pass `ariaLabel` when the visible label alone isn't descriptive (e.g. an icon).
 * The label swap is announced via aria-live so screen-reader users get the confirmation.
 */
export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "✓ Copied",
  className = "rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200",
  ariaLabel,
}: {
  value: string;
  label?: React.ReactNode;
  copiedLabel?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const [copied, markCopied] = useTemporaryFlag();

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      markCopied();
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel}
      aria-live="polite"
      className={className}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
