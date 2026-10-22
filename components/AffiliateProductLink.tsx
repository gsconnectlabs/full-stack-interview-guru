"use client";

import { sendGAEvent } from "@next/third-parties/google";
import type { AffiliateProduct } from "@/lib/products";

/**
 * Outbound Amazon affiliate link. The href is the supplied Associates URL, untouched. Fires one
 * `affiliate_product_click` GA4 event per click (no-ops safely when GA isn't initialized, e.g. local
 * dev) and never intercepts or delays navigation. Params are product metadata only — nothing about
 * the visitor. The only client JS in the products section; the rest renders on the server.
 */
export default function AffiliateProductLink({ product }: { product: AffiliateProduct }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() =>
        sendGAEvent("event", "affiliate_product_click", {
          product_id: product.id,
          product_name: product.name,
          product_category: product.category,
        })
      }
      className="btn-secondary min-h-[44px] shrink-0 whitespace-nowrap px-3 py-2.5 md:w-full md:px-5"
    >
      View on Amazon <span aria-hidden="true">↗</span>
      <span className="sr-only">
        : {product.name} (opens in a new tab)
      </span>
    </a>
  );
}
