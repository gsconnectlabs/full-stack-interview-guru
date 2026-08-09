import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import StoreProductCard from "@/components/StoreProductCard";
import { storeProducts } from "@/lib/store";

export const metadata: Metadata = {
  alternates: { canonical: "/store" },
  title: "Store — Interview Resources Beyond the Free Basics",
  description:
    "Optional deeper resources from FullStackInterviewGuru — starting with a free Java interview question bank. Go beyond the free core content with structured, downloadable guides.",
  openGraph: {
    title: "FIG Store",
    description:
      "Optional deeper resources from FullStackInterviewGuru — starting with a free Java interview question bank.",
    url: "/store",
    type: "website",
  },
};

const POSITIONING = [
  { icon: "🆓", title: "Free FIG content", body: "Hundreds of interview questions, fully free, no login required — this stays true forever." },
  { icon: "🤝", title: "Build knowledge & trust", body: "The free content is how FIG earns trust — the same standard of accuracy applies everywhere." },
  { icon: "📘", title: "Optional deeper resources", body: "The Store offers structured, downloadable guides for focused revision — currently free, more planned." },
];

const FUTURE_CATEGORIES = ["Java", "Microservices", "SQL", "System Design", "AWS", "Interview Preparation"];

export default function StorePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Store" }]} />

      <div className="mt-6 text-center">
        <span className="chip mx-auto">🛒 Store</span>
        <h1 className="mt-4 font-serif text-3xl font-black text-white sm:text-4xl">FIG Store</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Premium resources for developers who want to go beyond interview basics.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          FIG is, and stays, a free interview preparation platform. The Store offers optional, structured
          resources for focused revision — it never restricts or replaces the free content.
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
        <h2 className="text-2xl font-bold text-white">Featured resource</h2>
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
