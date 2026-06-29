import { products } from "@/lib/products";
import AmazonProductCard from "./AmazonProductCard";

/**
 * Reusable "Featured Products" section, driven entirely by Amazon URLs in
 * lib/products.ts — add a product by pasting its URL, no images or data required.
 *
 * Layout: 3-up responsive grid on desktop, swipeable snap carousel on mobile.
 */
export default function FeaturedProducts() {
  return (
    <section aria-labelledby="featured-products-title">
      <div className="flex flex-col gap-1">
        <h2 id="featured-products-title" className="text-2xl font-bold text-white">
          ⭐ Featured Products
        </h2>
        <p className="text-sm text-slate-400">Support our platform by exploring our recommended products.</p>
      </div>

      {/* Mobile: horizontal snap carousel · sm+: 3-up grid */}
      <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.url} className="flex min-w-[82%] snap-start sm:min-w-0">
            <AmazonProductCard url={p.url} title={p.title} badge={p.badge} className="w-full" />
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-slate-600 sm:text-left">
        As an Amazon affiliate, purchases through these links may earn us a small commission — at no extra cost
        to you. It helps keep Full Stack Interview Guru free.
      </p>
    </section>
  );
}
