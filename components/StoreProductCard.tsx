import Image from "next/image";
import type { StoreProduct } from "@/lib/store";
import GumroadCtaButton from "./GumroadCtaButton";

export default function StoreProductCard({ product }: { product: StoreProduct }) {
  const isFree = product.price.amount === 0;

  return (
    <article className="card-premium grid gap-8 p-6 sm:p-8 lg:grid-cols-[280px_1fr]">
      <div className="mx-auto w-full max-w-xs lg:mx-0">
        <Image
          src={product.coverImage}
          alt={product.coverAlt}
          width={1254}
          height={1254}
          className="w-full rounded-xl border border-white/[0.08]"
          priority
        />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip border-brand-500/40 text-brand-200">📘 {product.format}</span>
          <span className="chip">{product.pageCount} pages</span>
          {isFree && <span className="chip border-emerald-500/40 text-emerald-200">Free</span>}
        </div>

        <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">{product.title}</h3>
        <p className="mt-1 text-sm font-medium text-brand-300">{product.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{product.description}</p>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">Key benefits</h4>
        <ul className="mt-3 space-y-2">
          {product.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
              <span className="mt-0.5 text-brand-300" aria-hidden="true">
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">What&apos;s inside</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.whatsInside.map((topic) => (
            <span key={topic} className="chip">
              {topic}
            </span>
          ))}
        </div>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">Who it&apos;s for</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{product.audience}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <GumroadCtaButton href={product.gumroadUrl} product={product.slug}>
            {isFree ? "Get it Free on Gumroad" : "View on Gumroad"} <span aria-hidden="true">↗</span>
          </GumroadCtaButton>
          <p className="text-xs text-slate-500">
            Digital product ({product.format}) • {isFree ? "Free" : "Paid"} • Instant access via Gumroad
          </p>
        </div>
      </div>
    </article>
  );
}
