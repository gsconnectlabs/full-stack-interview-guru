# 07_SESSION_HANDOVER.md

# Session Summary

- **Session Name:** SEO — AdSense "Low value content" remediation (category visibility / live counts)
- **Date:** 2026-08-01
- **Overall Progress:** AdSense rejected the site with **"Low value content."** Root cause: the
  `count` field in `lib/categories.ts` is an **aspirational catalog target**, not the live question
  total, and it was displayed verbatim everywhere — so the site advertised **1,970 questions across 23
  categories** while only **262** existed, with **12 categories under 10 live questions** (Azure/GCP had
  **0**, Coding Challenges advertised **200** with **1**), and clicking those cards led to empty /
  "under construction" pages. Fixed by making the public browse surface reflect **live** content: a new
  `lib/category-visibility.ts` drives home, candidate index, footer, and sitemap to show **real live
  counts** and list **only the 11 categories with ≥10 live questions**; empty categories now **404** and
  below-threshold non-empty ones render **`noindex`**. **No question URLs/slugs changed; append-only,
  non-destructive** (DECISIONS **#034**).
- **Release Status:** ✅ **Released to production 2026-08-01.** Owner approved; commit `2c0794e`
  fast-forward merged into `main` (`636435b..2c0794e`) + pushed; Vercel production deploy **succeeded**
  (`Vercel → success`). Post-deployment smoke test passed on **https://fullstackinterviewguru.com** —
  `/candidate` shows "262+ questions across 11 categories" with real per-card counts, Azure/GCP now
  **404**, Docker/Git/Behavioral render **`noindex,follow`**, AWS `index,follow`, sitemap lists exactly
  **11** categories, question pages unchanged (200). **Next: the AdSense re-review is an owner action,
  after Google re-crawls (a few days) — don't spam re-requests.**

---

# Implementation Summary

- **New `lib/category-visibility.ts`** — single source of truth: `MIN_LIVE_TO_LIST = 10`,
  `liveCount(id)`, `isListed(id)`, `listedCategories` (catalog order preserved), `totalLiveQuestions`.
  Live counts derive from `questionsByCategory`, so they self-update as content grows — no manual
  bookkeeping. The aspirational `count` field is left untouched as data (just no longer shown as live).
- **Browse surface → live counts + only listed (≥10) categories (11 of 23):**
  - `app/page.tsx` — hero metrics (`totalLiveQuestions` → "262+", `listedCategories.length` → "11") and
    the "Explore Topics" grid.
  - `app/candidate/page.tsx` — header count + grid; metadata description reworded to real categories.
  - `components/TopicCard.tsx` — chip shows `liveCount(category.id)` instead of `category.count`.
  - `components/Footer.tsx` — topic links use `listedCategories`.
- **`app/sitemap.ts`** — category URLs limited to `listedCategories` (11); all 262 question routes kept.
- **`app/candidate/[category]/page.tsx`** — `generateStaticParams` emits only categories with **≥1 live
  question**, and `export const dynamicParams = false` → **empty** categories (Azure/GCP) **404**.
  `generateMetadata` adds `robots: { index:false, follow:true }` when `!isListed` and uses the live count;
  the header chip shows `{qs.length} question(s)`. The "being written" empty state is now unreachable
  (kept only as a defensive fallback).
- **`app/q/[slug]/page.tsx`** — "More {category}" sidebar card shows the live count (pluralized).

### Why below-threshold categories render (not 404) but empty ones 404

Categories like Docker/Git/Behavioral have **1–3 live, genuinely valuable question pages** whose
breadcrumb + sidebar link to `/candidate/{id}`. 404-ing those would create broken links, so they still
render but are `noindex` and hidden from browse/sitemap. Azure/GCP have **0** questions → nothing links
to them → safe to 404 (removes the empty placeholder entirely).

---

# Files Created

- `lib/category-visibility.ts` — live-count / visibility helpers.

# Files Modified

- `app/page.tsx` — metrics + Explore Topics use `listedCategories` / `totalLiveQuestions`; copy tweak.
- `app/candidate/page.tsx` — listed categories + live total; metadata description updated.
- `app/candidate/[category]/page.tsx` — non-empty-only `generateStaticParams`, `dynamicParams=false`,
  `noindex` for below-threshold, live count in header + metadata.
- `app/sitemap.ts` — category URLs from `listedCategories`.
- `app/q/[slug]/page.tsx` — sidebar "More {category}" live count (pluralized).
- `components/TopicCard.tsx` — chip shows live count.
- `components/Footer.tsx` — topic links from `listedCategories`.
- `docs/02_DECISIONS.md` (**#034**), `docs/04_ARCHITECTURE.md` (lib map + Content Model),
  `docs/06_CHANGELOG.md` (Changed entry at top of Unreleased), `docs/07_SESSION_HANDOVER.md` (this file).

---

# Documentation Updated

- **`02_DECISIONS.md`** — Decision **#034** (advertise only ≥10-live categories; live counts; noindex thin).
- **`06_CHANGELOG.md`** — "Changed (SEO — advertise only substantial categories …)" at top of Unreleased.
- **`04_ARCHITECTURE.md`** — added `category-visibility.ts` to the `lib/` map + a Content Model bullet.
- **`07_SESSION_HANDOVER.md`** — this file.
- **Timestamps** refreshed to **2026-08-01**. **Not changed:** `README.md`, `05_ROADMAP.md` (no roadmap
  item — this is SEO/quality remediation tracked via CHANGELOG + DECISIONS #034), `14_ANALYTICS.md`,
  `lib/categories.ts` (catalog data retained).

---

# Verification Summary

- ✅ **TypeScript:** clean (`npx tsc --noEmit`).
- ✅ **Production build:** green — **304 pages** (was 306; **−2** = the two 0-question category routes,
  Azure/GCP, no longer generated). No First-Load-JS change.
- ✅ **In-browser (dev):** home + `/candidate` show **"262+ questions across 11 categories"** with real
  per-card counts (Core Java 27, Python 27, JSON 26, REST 24, AWS/SQL 22, System Design 21,
  Collections/MT/JVM/Microservices 20). Delisted categories (Azure, GCP, Docker, Coding Challenges,
  Java 8+, Behavioral, …) **absent** from the browse grid and footer.
- ✅ **Indexing signals:** `/candidate/aws` → `robots: index,follow`; `/candidate/docker` renders (200)
  with `robots: noindex,follow`; **sitemap lists exactly 11** category URLs (Azure/GCP/Docker excluded,
  AWS/JSON included). All 262 question routes remain in the sitemap.
- ✅ **No broken links / no URL change:** every question slug unchanged; breadcrumbs from questions in
  below-threshold categories still resolve (those category pages still render).

---

# Current Architecture Status

- **Stack:** Next.js 15.5.19 (App Router) · TypeScript (strict) · React 19 · Tailwind v3 · SSG. No
  backend/DB/auth.
- **Content:** 262 live questions across 23 catalog categories; **11 advertised** (≥10 live). Browse /
  sitemap driven by `lib/category-visibility.ts`.
- **SEO:** per-page canonicals/OG/Twitter, `WebSite`+`Organization`+`QAPage`+`BreadcrumbList` JSON-LD;
  per-page `seoTitle`/`seoDescription`/`heading` overrides (#033); category listings now honest +
  thin-category `noindex` (#034).
- **Analytics/Ads:** GA4 via `@next/third-parties` (env-gated); AdSense loader env-gated — **AdSense
  approval pending** (this change is the remediation).
- **Theme:** still dark-only (H3/H4 open).

---

# Current Roadmap Status

- **Phase 2:** QW1–QW5, H1, H2, M1–M6 complete.
- **Post-Phase-2:** AR1 ✅ · AR2 ✅ · SEO CTR pass ✅ (#033) · **AdSense low-value remediation ✅ (this
  session, #034)** · CE1 (Python) ✅ · CE2 (JSON) ✅ · core-java dangling-ref maintenance fix ✅ (released).
- **Remaining (committed):** H3 + H4 (theme + palette); L1 (homepage tone).

---

# Current Project Health

- ✅ TypeScript clean · ✅ Build green (**304 pages**) · ✅ 0 broken `related` refs (262 unique slugs) ·
  ✅ Browse surface honest (11 real categories, live counts) · ✅ No question URL/schema change · ✅ Docs
  synchronized + timestamped.

---

# Known Limitations / Follow-ups

- **AdSense re-review is an owner action, done *after* deploy + re-crawl.** Don't tick "I confirm I have
  fixed the issues" / Request Review until this is live and Google has re-crawled (a few days). Avoid
  repeated empty re-requests.
- **Depth, not just honesty:** hiding thin categories fixes the *misleading/thin* signal, but reviewers
  also weigh overall uniqueness/volume. Consider (separately, owner-approved) adding original long-form
  content and re-populating delisted categories to ≥10 so they re-list automatically.
- **`count` field retained but now display-unused** for the browse surface; kept as the catalog target.
  If it drifts confusingly from reality later, consider repurposing or removing it (separate cleanup).
- **Released to production 2026-08-01** — `2c0794e` merged to `main`, pushed, Vercel deploy succeeded,
  smoke test passed (Azure/GCP 404, thin categories noindex, sitemap = 11, home/candidate honest counts).
  Don't `npm run build` while a dev/preview server is live.

---

# Important Decisions (that must never change)

- **Never change URLs** without approval. **Never break SEO.** **Never remove existing features.**
- **Advertise only substantial categories (#034):** browse/sitemap driven by `category-visibility.ts`;
  `count` is a catalog target, not a live number. Filling a category past `MIN_LIVE_TO_LIST` re-lists it.
- **`"FIG – %s"` default title template**; `seoTitle` is a per-page opt-out (#033).
- **No fake functionality / no dead links** (#026). **Append-only content model** (#028).
- **GA IDs never committed**; AdSense publisher ID in `lib/site.ts` (#031/#032).
- **Accessibility mandatory (#013). Trust before revenue (#001).**
- **Workflow:** one change at a time → verify (TS + build + a11y + SEO) → **stop for approval**.
- **Docs convention:** `NN_NAME.md`; ideas → `99_IDEAS_BACKLOG.md`; roadmap = committed work only.

---

# Recommended First Task For The Next Session

Owner-selected: **(a)** after deploy + re-crawl, **request the AdSense re-review** (owner action); **(b)**
content depth — re-populate delisted categories (Docker, Kubernetes, Git, Linux, Behavioral, …) to ≥10
live so they re-list, following the CE2 pattern; or **(c)** resume the committed roadmap (H3 + H4, then
L1). **All require explicit owner approval before implementation.**

---

# Notes For Future Developers / AI Assistants

- **Read `CLAUDE.md` first**, then `/docs`. **Category visibility lives in
  `lib/category-visibility.ts`** — never re-introduce `category.count` into the browse UI; use
  `liveCount` / `listedCategories`. Empty categories 404 (`dynamicParams=false`); below-threshold ones
  are `noindex` but still render for breadcrumb safety.
- **Adding a content batch (CE pattern):** new `lib/questions-extra/<cat>.ts` → import + spread in
  `index.ts`. Once a category crosses `MIN_LIVE_TO_LIST` it re-lists automatically (no UI change).
- **Versions:** project `package.json` = **1.0.0**; docs = **1.0.0**.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-08-01 (SEO — AdSense low-value remediation / category visibility; released to production; DECISIONS #034)
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
