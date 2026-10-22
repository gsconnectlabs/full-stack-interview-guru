import { products } from "@/lib/products";
import AffiliateProductLink from "./AffiliateProductLink";

/**
 * Amazon affiliate equipment section, driven by lib/products.ts. Shown on the home page and at the
 * end of question pages, after all learning content. Name + neutral category + link only (no listing
 * copy, images, prices, ratings or availability). The Amazon Associates disclosure sits directly
 * above the links, and the "Affiliate links" label keeps it visibly separate from editorial content.
 * Mobile: compact rows (name left, link right). md+: three columns.
 */
export default function FeaturedProducts() {
  return (
    <section aria-labelledby="featured-products-title">
      <p className="eyebrow">Affiliate links</p>
      <h2 id="featured-products-title" className="mt-1.5 text-lg font-semibold text-white">
        Tools for Your Developer Workspace
      </h2>
      <p className="mt-1 text-sm text-slate-400">Equipment for a comfortable, productive setup.</p>
      <p className="mt-3 text-sm font-medium text-slate-200">
        As an Amazon Associate I earn from qualifying purchases.
      </p>

      <ul className="mt-4 grid gap-2 md:grid-cols-3 md:gap-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-ink-700/60 bg-ink-900/40 p-3 md:flex-col md:items-stretch md:gap-4 md:p-4"
          >
            <div className="min-w-0">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{p.categoryLabel}</span>
              <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-100 md:text-[15px]">{p.name}</h3>
            </div>
            <AffiliateProductLink product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
