/**
 * Amazon affiliate products shown by <FeaturedProducts />.
 *
 * `url` is the exact Amazon Associates link supplied by the owner. It is rendered verbatim —
 * never parsed, rebuilt, shortened or tagged — so tracking is preserved.
 * Deliberately only a name and a neutral category: no listing descriptions/specs, warranty or
 * promotional claims, prices, ratings, availability or images. Amazon restricts displaying product
 * content (titles/descriptions/images/prices) outside its Product Advertising API, and nothing here
 * can be kept current by hand.
 * `id`/`name`/`category` also feed the `affiliate_product_click` GA4 event.
 */
export interface AffiliateProduct {
  id: string;
  name: string;
  category: "monitor" | "laptop" | "office-chair";
  categoryLabel: string;
  url: string;
}

export const products: AffiliateProduct[] = [
  {
    id: "benq-ew2790u",
    name: "BenQ EW2790U 27-inch Monitor",
    category: "monitor",
    categoryLabel: "Monitor",
    url: "https://link.amazon/B0hT94ZpO",
  },
  {
    id: "acer-aspire-one-a114-43",
    name: "Acer Aspire One Laptop",
    category: "laptop",
    categoryLabel: "Laptop",
    url: "https://link.amazon/B0ciR338Q",
  },
  {
    id: "wakefit-gravita-chair",
    name: "Wakefit Gravita Ergonomic Office Chair",
    category: "office-chair",
    categoryLabel: "Office Chair",
    url: "https://link.amazon/B05JYxwYa",
  },
];
