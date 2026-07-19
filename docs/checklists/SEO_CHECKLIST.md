# SEO_CHECKLIST.md

# FIG — SEO Preservation Checklist

**SEO must never be sacrificed for a UI change** (DECISIONS #011). Run this for every change
that touches routing, metadata, page structure, or content rendering.

---

## URLs & routing (highest sensitivity)
- [ ] **No URL changed** without explicit owner approval.
- [ ] Page hierarchy preserved: `/`, `/candidate`, `/candidate/{category}`, `/q/{slug}`,
      feature pages.
- [ ] No route removed; no page turned non-indexable unintentionally.

## Metadata
- [ ] Per-page `alternates.canonical` present and correct (absolute via `NEXT_PUBLIC_SITE_URL`).
- [ ] `<title>` meaningful and keyword-preserving; description present (~≤155 chars).
- [ ] Open Graph + Twitter card metadata intact (type, url, title, description).
- [ ] `metadataBase` intact in root layout.

## Structured data (validate with Rich Results Test)
- [ ] `WebSite` + `Organization` (root) intact.
- [ ] `QAPage` per question intact — `acceptedAnswer` contains the **real answer only**
      (no AI prompts, no UI chrome). `dateModified` valid ISO when a question is dated.
- [ ] `BreadcrumbList` on question + category pages intact with absolute URLs.
- [ ] JSON-LD is valid (no trailing commas, correct `@type`, resolvable URLs).

## Crawlability
- [ ] `sitemap.xml` still lists all static + category + question routes.
- [ ] `robots.txt` unchanged (or intentionally + approved).
- [ ] Server-rendered content remains in the HTML (client islands stay **below** and
      **additive** to the crawlable answer).
- [ ] No new dead/broken internal links; internal linking preserved or improved.

## Content signals
- [ ] Headings remain semantic and hierarchical (single `<h1>` per page).
- [ ] New internal links (e.g. Report Issue → `/feedback`) use real `<a>`/`<Link>` and don't
      leak query junk into canonical URLs.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 11:15 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
