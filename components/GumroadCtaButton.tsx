"use client";

import { sendGAEvent } from "@next/third-parties/google";

/**
 * Store purchase/download CTA. Fires the `gumroad_cta_click` GA4 event (no-ops
 * safely when GA isn't initialized, e.g. local dev) before handing off to Gumroad.
 */
export default function GumroadCtaButton({
  href,
  product,
  className = "btn-primary",
  children,
}: {
  href: string;
  product: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => sendGAEvent("event", "gumroad_cta_click", { product, destination: "gumroad" })}
      className={className}
    >
      {children}
      <span className="sr-only">, opens in a new tab</span>
    </a>
  );
}
