/**
 * "Continue reading" history, kept only in this browser's localStorage — never sent anywhere,
 * no login. Values are re-validated on read because storage is user-editable.
 */

export interface RecentQuestion {
  slug: string;
  title: string;
  category?: string;
}

const STORAGE_KEY = "fig-recently-viewed";
const MAX_ITEMS = 5;
const SLUG_RE = /^[a-z0-9-]{1,120}$/;

function isRecent(value: unknown): value is RecentQuestion {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === "string" &&
    SLUG_RE.test(v.slug) &&
    typeof v.title === "string" &&
    v.title.length > 0 &&
    v.title.length <= 300 &&
    (v.category === undefined || (typeof v.category === "string" && v.category.length <= 80))
  );
}

export function readRecent(): RecentQuestion[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isRecent).slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

export function recordRecent(item: RecentQuestion): void {
  try {
    const next = [item, ...readRecent().filter((r) => r.slug !== item.slug)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage unavailable (private mode, blocked storage) — history is optional */
  }
}

export function clearRecent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
