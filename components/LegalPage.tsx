import type { ReactNode } from "react";
import Breadcrumb from "@/components/Breadcrumb";

/**
 * Shared shell for long-form legal/company pages (Privacy, Terms, Disclaimer).
 * Renders a centered header (chip + single H1 + last-updated stamp), a
 * BreadcrumbList-backed trail, and a `.prose-legal` body for the page content.
 * Keeps every legal page structurally identical so headings stay hierarchical
 * and SEO/a11y behaviour is consistent.
 */
export default function LegalPage({
  badge,
  title,
  updated,
  intro,
  children,
}: {
  /** Short chip label shown above the H1, e.g. "🔒 Privacy". */
  badge: string;
  /** Page H1 (also the breadcrumb's current node). */
  title: string;
  /** ISO date (YYYY-MM-DD) the policy was last reviewed. */
  updated: string;
  /** One-line summary rendered under the header. */
  intro: ReactNode;
  children: ReactNode;
}) {
  const updatedLabel = new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: title }]} />

      <div className="mt-6 text-center">
        <span className="chip mx-auto">{badge}</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">{intro}</p>
        <p className="mt-4 text-xs text-slate-500">
          Last updated: <time dateTime={updated}>{updatedLabel}</time>
        </p>
      </div>

      {/* AD SLOT (future): a single horizontal unit may sit here, AFTER the H1/intro
          and BEFORE the policy body. Never before the H1. Keep reserved height to
          preserve CLS = 0. Do not enable until AdSense is approved. */}

      <article className="prose-legal mt-10">{children}</article>
    </div>
  );
}
