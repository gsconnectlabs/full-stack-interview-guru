# ARCHITECTURE.md

# FullStackInterviewGuru (FIG) — Technical Architecture

This document describes the **current, as-built** architecture of FIG. It is factual
(what exists today), and notes where the implementation diverges from the vision in
[01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md) and [02_DECISIONS.md](./02_DECISIONS.md). Divergences
are tracked as work items in [05_ROADMAP.md](./05_ROADMAP.md).

---

## Tech Stack (as built)

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS v3 (utility-first, design tokens in `tailwind.config.ts`) |
| Rendering | Fully static (SSG) — all routes prerendered |
| Hosting target | Vercel |
| Analytics/Ads | Google Analytics + AdSense (env-gated, off until IDs set) |

Rendering is **100% static** — no backend, no database, no auth (by design).

---

## Folder Structure (current)

```
app/                         Routes (App Router)
  layout.tsx                 Root layout, metadata, JSON-LD (WebSite+Organization)
  page.tsx                   Homepage
  candidate/                 Candidate mode (topic browsing)
    page.tsx                 Category index
    [category]/page.tsx      Category detail (SSG per category)
  q/[slug]/page.tsx          Question detail (SSG per question) — QAPage JSON-LD
  interviewer/               Interviewer mode (client) + layout.tsx (metadata)
  transition/                Transition Hub (client) + layout.tsx (metadata)
  environment/               "Know Your Environment"
  real-world/                "Real World vs Interview World"
  donate/                    Donate (UPI QR generated at build time)
  feedback/                  Feedback form (dynamic — reads ?context=)
  not-found.tsx              404
  sitemap.ts, robots.ts      SEO routes (driven by lib data + NEXT_PUBLIC_SITE_URL)
  icon.svg, apple-icon.tsx   Browser branding — FIG monogram (Teal + Gold)
  manifest.ts                Web app manifest (auto-linked at /manifest.webmanifest)
  globals.css                Tailwind layers + design tokens/components

components/                  Reusable UI (21 components)
  Navbar, Footer, SearchBar, QuestionCard, TopicCard (server; category card reused by
  homepage + candidate index), DifficultyBadge,
  PrevNextNav (server; sequential prev/next + "Question N of M" + "View all"),
  CodeBlock (server; delegates copy to CopyButton),
  CopyButton (client; clipboard write + "Copied" feedback),
  ShareButton (client; Web Share API with copy-link fallback),
  AISection (client island; "Continue Learning with AI" — level selector, copy, open-in),
  HelpfulVote, FeaturedProducts, AmazonProductCard, AdvertisementPlaceholder,
  AdSlot, Analytics, FeedbackForm, UpiQrCard,
  Breadcrumb (visible trail + BreadcrumbList JSON-LD), JsonLd (schema.org emitter)

hooks/                       Client hooks
  useTemporaryFlag            transient on→auto-reset(1500ms) flag; shared by CopyButton/ShareButton

lib/                         Data + utilities (types live in lib/types.ts; /constants not needed yet — see DECISIONS #028)
  types.ts                   Question, Category, AnswerBlock types
  categories.ts              Category catalog (19 categories)
  questions.ts               Base question bank (32) + merges questions-extra; getQuestion,
                             questionsByCategory, getQuestionNav (category position + prev/next)
  questions-extra/           Flagship expansion (180 questions, 9 files + index)
  search.ts                  Prebuilt client-side search index
  reading-time.ts            Pure build-time reading-time estimate (core Q&A content only)
  ai-prompts.ts              "Continue Learning with AI": buildAiPrompts (4 levels, build-time) + AI_PROVIDERS (ChatGPT/Gemini/Claude)
  site.ts                    siteUrl, contact/donate config, UPI helper
  environment.ts, transitions.ts, interviewer.ts, products.ts   Feature data

public/                      Currently minimal (donate/README.md only)
```

Business logic lives in `lib/`, not in pages — pages compose data + components.

---

## Content Model

- **Single source of content:** `lib/categories.ts` + `lib/questions.ts` (which merges
  `lib/questions-extra/*`). Everything downstream — category pages, question pages,
  search index, sitemap, structured data — derives from this data automatically.
- **Question schema** (`lib/types.ts`): `slug`, `categoryId`, `topic`, `question`,
  `mindMap`, `handsOn?` (with `time?`/`space?`), `whatIf?`, `realWorld?`,
  `interviewerExpectation?`, `shortAnswer?`, `tags?`, `followUps?`, `commonMistakes?`,
  `bestPractices?`, `relatedTech?`, `references?`, `updated?` (ISO `YYYY-MM-DD` — drives the
  "Updated" freshness chip + `QAPage.dateModified`), `difficulty`, `experience`, `askedIn`,
  `related?`.
- **Adding content** = append typed objects to a `lib/questions-extra/*` file. No UI or
  route changes required.

---

## Routing & URLs (SEO-critical — do not change without approval)

| Pattern | Purpose |
|---|---|
| `/` | Homepage |
| `/candidate` | Topic index |
| `/candidate/{category}` | Category detail |
| `/q/{slug}` | Question detail |
| `/interviewer`, `/transition`, `/environment`, `/real-world`, `/donate`, `/feedback` | Feature pages |

Canonical URLs, Open Graph, and the sitemap all resolve from `NEXT_PUBLIC_SITE_URL`
(default `https://fullstackinterviewguru.com`) via `lib/site.ts`.

---

## SEO Implementation (current)

- `metadataBase` + per-route `alternates.canonical` (unique per page).
- **Title format (DECISIONS #014):** root `title.template` = `"FIG – %s"` (branded prefix); child
  pages supply the descriptive text → e.g. "FIG – Core Java Interview Questions". Homepage `default`
  keeps the full name for SEO. `openGraph.title` is set independently (template does not apply to it).
- Open Graph + Twitter card metadata (root defaults; per-page title/description).
- **Structured data:** `WebSite` + `Organization` (root layout), `QAPage` per question,
  and `BreadcrumbList` on question + category pages (via reusable `Breadcrumb` + `JsonLd`).
- `sitemap.ts` (all static + category + question routes) and `robots.ts`.
- **Browser branding:** SVG favicon, Apple Touch Icon (generated via `next/og`), and web
  app manifest — FIG monogram in Teal + Gold. (Emoji-only favicon gap closed.)

---

## Performance (verified — M6)

- **Lighthouse 12 (desktop, production build):** Homepage **100 / 100 / 100 / 100**
  (Perf / A11y / BP / SEO); Question page **100 / 96 / 100 / 100** (the 96 is the DECISIONS #029
  tertiary-contrast item, deferred to H3/H4). CWV: FCP 0.3–0.4 s, LCP 0.5–0.7 s, **CLS 0**, **TBT 0 ms**.
- **Fonts:** system-font stack — no `next/font`, no web fonts (DECISIONS #030). **Images:** none
  (emoji + inline SVG). Client JS minimal (shared 102 kB; small islands only).

## Accessibility (current)

- **Landmarks:** `<header>` + `<nav aria-label="Primary">`, `<main id="main" tabIndex={-1}>`,
  `<footer>` + `<nav aria-label="Footer">`. A **skip-to-content** link (`.skip-link`) targets `#main`.
- **Keyboard focus:** global `:focus-visible` outline (brand-400) in `globals.css` for elements
  without their own ring; ring-based controls set `outline-none` (no double outline).
- **Interactive controls:** accessible names on icon-only controls (e.g. Donate `aria-label`);
  the search field is an ARIA **combobox** (`listbox`/`option`/`aria-activedescendant`); decorative
  emoji are `aria-hidden`.
- **Contrast:** primary/secondary text passes WCAG AA; tertiary `slate-500` labels are deferred to
  the H3/H4 token migration (DECISIONS #029).

## Theme & Styling (current vs vision)

- **Current:** dark-only. Root layout hardcodes `<html className="dark">`; there is no
  light theme and no `prefers-color-scheme` handling.
- **Palette (current):** Indigo/Blue (`brand.*` = indigo) + amber accents.
- **Vision (PROJECT_CONTEXT / DECISIONS #005–#006):** **Light default**, dark via
  `prefers-color-scheme` (no manual toggle); **Teal primary + Gold/Kaavi secondary**.
- This is the largest architectural divergence — tracked in [05_ROADMAP.md](./05_ROADMAP.md).

---

## Known Divergences from Vision (summary)

1. Theme model (dark-only) vs light-default + `prefers-color-scheme`.
2. Palette (Indigo/Blue) vs Teal + Gold/Kaavi.
3. ~~Brand shown in nav as "Full Stack Interview Guru" vs "FIG" in-interface.~~ — ✅ **Resolved**
   (ROADMAP QW1): navbar shows **FIG**; full name kept as `sr-only`/`title` + in footer & metadata.
4. ~~No real favicon/manifest/app icons~~ — ✅ **Resolved** (ROADMAP H1): SVG favicon, Apple
   Touch Icon, and manifest added (FIG monogram, Teal + Gold). Optional 192/512 PNGs → future.
5. ~~No "Continue Learning with AI" section~~ — ✅ **Resolved** (ROADMAP H2): client island
   `components/AISection.tsx` + pure `lib/ai-prompts.ts` on `/q/[slug]`; four depth prompts
   (Beginner/Intermediate/Senior/Architect), copy + open-in ChatGPT/Gemini/Claude. Static-first
   (no API/backend/auth/deps); prompts precomputed at build time; SEO/structured data untouched.
6. ~~Question page missing: last updated, report issue (#007).~~ — ✅ **Resolved** (ROADMAP M1):
   optional `updated?` → build-time "Updated" chip + `QAPage.dateModified`; "Report issue" links
   to the existing `/feedback?context=…` flow. ~~reading time~~ — ✅ **Resolved** (ROADMAP QW3):
   build-time "min read" chip. ~~share, copy link~~ — ✅ **Resolved** (ROADMAP QW2): Copy link +
   Share (Web Share API w/ copy fallback). The question-page standard (#007) is now complete.
7. ~~No prev/next topic navigation~~ — ✅ **Resolved** (ROADMAP M2): `PrevNextNav` + `getQuestionNav`
   add Previous/Next, "Question N of M", and a "View all {category}" link on question pages. Visual
   learning **roadmaps** (#010) remain a backlog idea.
8. ~~No `BreadcrumbList` structured data~~ — ✅ **Resolved** (ROADMAP QW4).

Resolved so far: #3, #4, **#6 (fully)**, **#7 (prev/next)**, #8 and #5. Remaining divergences are
**incremental, non-breaking**; none require URL changes.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 22:00 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
