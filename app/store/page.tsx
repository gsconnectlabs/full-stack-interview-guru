import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import StoreProductCard from "@/components/StoreProductCard";
import GumroadCtaButton from "@/components/GumroadCtaButton";
import { storeProducts } from "@/lib/store";

export const metadata: Metadata = {
  alternates: { canonical: "/store" },
  title: "Ebook Store — Get the Free Java Interview Ebook",
  description:
    "FIG's Ebook Store: a free, downloadable Java interview question bank you can read on your own time — built from the same content FIG's free site already trusts.",
  openGraph: {
    title: "FIG — Ebook Store",
    description:
      "A free, downloadable Java interview question bank you can read on your own time.",
    url: "/store",
    type: "website",
  },
};

/** Personal framing shown under the hero CTA — edit here, no JSX changes needed. */
const GURU_INTRO =
  "16 years in banking-domain interviews — this is the guide I'd hand a candidate the night before.";

/** The Ebook Store currently has one product: the free ebook. Hero renders from this data
 *  directly so it can never drift from the detailed card below. */
const ebook = storeProducts[0];

const POSITIONING = [
  { icon: "🆓", title: "Free FIG content", body: "Hundreds of interview questions, fully free, no login required — this stays true forever." },
  { icon: "🤝", title: "Build knowledge & trust", body: "The free content is how FIG earns trust — the same standard of accuracy applies everywhere." },
  { icon: "📘", title: "One focused, free ebook", body: "A structured, downloadable guide for focused revision — currently free, more planned." },
];

const FUTURE_CATEGORIES = ["Java", "Microservices", "SQL", "System Design", "AWS", "Interview Preparation"];

export default function StorePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Ebook Store" }]} />

      <div className="mt-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="chip border-brand-500/40 text-brand-200">📘 Ebook Store</span>
          <span className="chip border-emerald-500/40 text-emerald-200">🆓 Free</span>
        </div>
        <h1 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-black text-white sm:text-4xl">
          {ebook.title}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-lg font-medium text-brand-300">{ebook.subtitle}</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">{ebook.audience}</p>

        <div className="mt-6 flex justify-center">
          <GumroadCtaButton href={ebook.gumroadUrl} product={ebook.slug}>
            Get the Free Ebook <span aria-hidden="true">↗</span>
          </GumroadCtaButton>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-xs text-slate-500">
          {GURU_INTRO} FIG stays free — the Ebook Store never restricts or replaces the free content.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {POSITIONING.map((p) => (
          <div key={p.title} className="card p-5">
            <span className="text-2xl" aria-hidden="true">
              {p.icon}
            </span>
            <h2 className="mt-2 font-bold text-slate-100">{p.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{p.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">The Free Ebook</h2>
        <div className="mt-6">
          {storeProducts.map((product) => (
            <StoreProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-white">More resources are on the way</h2>
          <span className="chip border-brand-500/40 text-brand-200">Planned</span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Future structured resources may cover:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FUTURE_CATEGORIES.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
