/**
 * Featured products — Amazon URLs only.
 * To add a product later, paste its Amazon URL. Everything else (ASIN, link, preview
 * attempt, fallback card) is derived automatically by <AmazonProductCard />.
 * `title` and `badge` are optional cosmetic overrides.
 */
export interface AmazonProduct {
  url: string;
  title?: string;
  badge?: string;
}

export const products: AmazonProduct[] = [
  { url: "https://www.amazon.in/dp/B0GKH81Z5D" },
  { url: "https://www.amazon.in/dp/B0GRRLR44T" },
  { url: "https://www.amazon.in/dp/B0GQ7DYDBF" },
];
