import { products } from "@/lib/products";
import AffiliateProductLink from "./AffiliateProductLink";

/**
 * Amazon affiliate equipment section, driven by lib/products.ts. Shown on the home page and after
 * the answer on question pages. Name + neutral category + link only (no listing copy, images, prices,
 * ratings or availability). The Amazon Associates disclosure sits directly above the links.
 * Mobile: three compact rows (name left, link right). md+: three columns.
 */
export default function FeaturedProducts() {
  return (
    <section aria-labelledby="featured-products-title">
      <h2 id="featured-products-title" className="text-2xl font-bold text-white">
        Tools for Your Developer Workspace
      </h2>
      <p className="mt-1 text-sm text-slate-400">Equipment for a comfortable, productive setup.</p>
      <p className="mt-3 text-sm font-medium text-slate-200">
        As an Amazon Associate I earn from qualifying purchases.
      </p>

      <ul className="mt-3 grid gap-2 md:grid-cols-3 md:gap-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="card card-hover flex items-center justify-between gap-3 p-3 md:flex-col md:items-stretch md:gap-4 md:p-5"
          >
            <div className="min-w-0">
              <span className="chip">{p.categoryLabel}</span>
              <h3 className="mt-1.5 text-sm font-semibold leading-snug text-slate-100 md:mt-3 md:text-base">
                {p.name}
              </h3>
            </div>
            <AffiliateProductLink product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
