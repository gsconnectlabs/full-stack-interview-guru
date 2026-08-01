import { categories } from "./categories";
import { questionsByCategory } from "./questions";
import type { Category } from "./types";

/**
 * Category visibility & live-count helpers.
 *
 * The `count` field in `lib/categories.ts` is an aspirational catalog target, NOT the
 * number of published questions. Advertising categories that aren't populated yet creates
 * thin / "under construction" pages, which hurt SEO and ad-network (AdSense) review. So the
 * public browse surface — home, candidate index, footer, and sitemap — is driven by *live*
 * counts instead: only categories with at least `MIN_LIVE_TO_LIST` published questions are
 * listed, and cards/headers show the real live count.
 *
 * Categories below the threshold are not delisted destructively — their detail route still
 * renders (so breadcrumbs from any live question in them resolve), but it is `noindex` and
 * kept out of the browse lists and sitemap until it is filled out.
 */

/** Minimum published questions for a category to be advertised (listed, indexed, in sitemap). */
export const MIN_LIVE_TO_LIST = 10;

/** Number of published (live) questions in a category. */
export function liveCount(categoryId: string): number {
  return questionsByCategory(categoryId).length;
}

/** True when a category has enough live content to be advertised. */
export function isListed(categoryId: string): boolean {
  return liveCount(categoryId) >= MIN_LIVE_TO_LIST;
}

/** Categories substantial enough to advertise, kept in the catalog's curated order. */
export const listedCategories: Category[] = categories.filter((c) => isListed(c.id));

/** Total live questions across all categories (the real sum, not the aspirational catalog total). */
export const totalLiveQuestions: number = categories.reduce((n, c) => n + liveCount(c.id), 0);
