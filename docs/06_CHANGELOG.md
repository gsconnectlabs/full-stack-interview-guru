# CHANGELOG.md

# FullStackInterviewGuru (FIG) — Changelog

All notable changes to this project are documented here.
Format is loosely based on [Keep a Changelog](https://keepachangelog.com/).
This project uses semantic-ish versioning; see [02_DECISIONS.md](./02_DECISIONS.md).

---

## [1.0.0] — 2026-07-18 (Phase 1 baseline)

The state of the project at the start of Phase 2. Phase 1 delivered a fast, static,
SEO-optimized MVP and a large curated question bank.

### Added
- Next.js 15 (App Router) + TypeScript + Tailwind CSS static site (SSG).
- Routes: home, candidate mode (+ per-category pages), question pages (`/q/{slug}`),
  interviewer mode, Transition Hub, Know Your Environment, Real World vs Interview,
  Donate, Feedback, plus `sitemap.ts` / `robots.ts` / `not-found`.
- Content model: 19 categories; **212 questions** total (32 base + 180 flagship
  expansion across Core Java, Java Collections, Multithreading, JVM, SQL, REST API,
  Microservices, AWS, System Design — 20 each).
- Rich question schema: short answer, tags, mind-map, hands-on code (+ time/space
  complexity), what-if, real-world, interviewer expectation, common mistakes,
  best practices, follow-ups, related tech, references, related questions.
- SEO: per-page canonicals, Open Graph/Twitter, `WebSite`+`Organization` JSON-LD,
  `QAPage` JSON-LD per question, sitemap, robots — all driven by `NEXT_PUBLIC_SITE_URL`.
- Instant client-side search (prebuilt index).
- Per-question "Was this helpful?" signal; feedback form (endpoint or mailto fallback).
- Donate page with build-time-generated UPI QR; Amazon "Featured Products" cards;
  env-gated Google Analytics + AdSense placeholders.

### Documentation
- Established `/docs` as the single source of truth: `PROJECT_CONTEXT.md`,
  `DECISIONS.md`, `CLAUDE_INSTRUCTIONS.md` (moved from root), plus new
  `ROADMAP.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, and this `CHANGELOG.md`.

### Known divergences from vision (to be addressed in Phase 2)
- Dark-only theme (vision: light default + `prefers-color-scheme`).
- Indigo/Blue palette (vision: Teal + Gold/Kaavi).
- No AI learning section, full browser branding, breadcrumb schema, reading time,
  last-updated, share/report actions, or prev/next topic navigation yet.
  See [05_ROADMAP.md](./05_ROADMAP.md).

---

## Unreleased

Phase 2 work is logged here as it is approved and implemented, one feature at a time,
per the workflow in [13_CONTRIBUTING.md](./13_CONTRIBUTING.md).

### Changed (AR1 addendum — AdSense publisher ID wired) — 2026-07-19
Owner supplied the production AdSense account **`ca-pub-8326504635108554`**. Added `adsenseClientId` to
`lib/site.ts` (this ID as the committed default; `NEXT_PUBLIC_ADSENSE_ID` still overrides) and pointed
both `components/Analytics.tsx` (the `adsbygoogle.js` loader) and `app/layout.tsx` (the
`google-adsense-account` meta) at it. **Verified in-browser:** the `<script … adsbygoogle.js?client=ca-pub-8326504635108554 … crossorigin="anonymous">`
snippet **and** the verification meta now render in the server HTML of **every page type** (home,
`/q/[slug]`, `/candidate/[category]`, legal, contact). Build green (**256 pages**), shared JS **102 kB
unchanged**, no console errors. Publisher IDs are public (not secrets), so committing it is safe — see
DECISIONS #031 (updated).

### Added (Post-Phase-2 — Compliance & AdSense Readiness release, AR1) — 2026-07-19 — SEO-sensitive
Prepared the site for Google AdSense approval as a **production maintenance release** — legal/company
pages, footer navigation, and AdSense wiring. **No redesign, no existing UX changed, no URL removed.**

- **AdSense integration (#1):** the async `adsbygoogle.js` loader **already existed** in
  `components/Analytics.tsx` (env-gated by `NEXT_PUBLIC_ADSENSE_ID`, rendered once via the root layout
  on every page, `afterInteractive`, `crossOrigin="anonymous"`, non-render-blocking) — **preserved as-is**.
  Added an **env-gated `google-adsense-account` verification `<meta>`** in `app/layout.tsx`
  (`metadata.other`, emitted only when the ID is set; distinct from the script → no duplication). **No
  client ID hardcoded** — it stays env-driven per the project's config architecture (DECISIONS #031).
- **New legal/company pages (all static SSG, single `<h1>`, breadcrumb + `BreadcrumbList` JSON-LD):**
  `app/about/page.tsx` (mission, vision, philosophy, why FIG exists, content standards, audience,
  commitment), `app/contact/page.tsx` (contact form + plain-language "how it works" note),
  `app/privacy/page.tsx` (cookies, Google Analytics, **Google AdSense cookie/DoubleClick usage + opt-outs**,
  third-party services, user privacy, data security, external links, children, policy updates, contact),
  `app/terms/page.tsx` (educational purpose, IP, acceptable use, no interview/employment guarantee,
  limitation of liability, external links, advertising, **governing law — India**), `app/disclaimer/page.tsx`
  (educational content, questions vary, accuracy, company trademarks belong to owners, no employment
  guarantee, external links/ads, consent).
- **New reusable components:** `components/LegalPage.tsx` (shared shell: chip + H1 + last-updated stamp +
  breadcrumb + `.prose-legal` body — used by privacy/terms/disclaimer, DRY per DECISIONS #022) and
  `components/ContactForm.tsx` (`"use client"`; Name/Email/Subject/Message with labeled, `required`
  fields + client validation; POSTs to `NEXT_PUBLIC_FEEDBACK_ENDPOINT` when set, else **mailto fallback**
  — same no-backend pattern as `FeedbackForm`, **no fake functionality**).
- **New `.prose-legal` component class** in `app/globals.css` (h2/h3/p/ul/li/a/strong long-form
  typography; body text slate-300 ≈ 13:1, AA-passing).
- **Footer (#3) — restructured, not redesigned** (`components/Footer.tsx`): added **Company** (About Us,
  Contact Us), **Resources** (Interview Questions, Interviewer Mode, Real World, Know Your Environment,
  Transition Hub), **Legal** (Privacy Policy, Terms & Conditions, Disclaimer), **Support** (Feedback,
  Donate) link columns; **kept** the brand block and the Browse Topics grid. **"Blog" omitted** — no
  blog route exists and building one is out of scope (avoids a broken link; "Topics" is served by the
  retained Browse Topics grid). All existing footer destinations preserved.
- **SEO (#9):** every new page has a branded `<title>` (`FIG – …`), meta description (≤~155 chars),
  absolute `alternates.canonical`, Open Graph (title/description/url/type) + inherited Twitter card,
  and semantic heading hierarchy. `app/sitemap.ts` now includes `/about`, `/contact`, `/privacy`,
  `/terms`, `/disclaimer`.
- **Ad placement (#15) — preparation only:** developer comments mark recommended future ad slots
  (after the H1/intro, below content) in `LegalPage` and the contact page. **No live display ads
  inserted;** CLS preserved.
- **Verified:** TypeScript clean; production build green — **256 pages** (was 251; +5 static routes,
  all `○`). New legal/About pages ship **zero client JS** (route JS **172 B**, First Load **106 kB**);
  `/contact` route JS **2.36 kB** / First Load **108 kB** (the only new client island, `ContactForm`);
  **shared First Load JS unchanged at 102 kB**. Verified in-browser: all 5 pages HTTP 200, **exactly
  one `<h1>`** each, canonical/OG/Twitter/`BreadcrumbList` present; **all 24 footer links resolve
  (200)** — no broken links; AdSense meta correctly **absent** when the env ID is unset; contact form
  has 4 labeled/`required` fields with submit disabled until valid; **no console errors**; mobile 375px
  has **no horizontal overflow**. Existing `WebSite`/`Organization`/`QAPage`/`BreadcrumbList` schema
  and all existing routes untouched.
- **Owner follow-ups to go live:** set `NEXT_PUBLIC_ADSENSE_ID` (activates the loader + verification
  meta) and optionally `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_FEEDBACK_ENDPOINT`; confirm the Terms
  **governing-law jurisdiction (currently India)**.

### Verified + Changed (ROADMAP M6 — Lighthouse & performance verification) — 2026-07-19
Ran **Lighthouse 12 (desktop preset)** against the **production build** (`next start`).

- **Scores — Homepage `/`:** Performance **100** · Accessibility **100** · Best Practices **100** · SEO **100**.
- **Scores — Question `/q/[slug]`:** Performance **100** · Accessibility **96** · Best Practices **100** · SEO **100**.
- **Core Web Vitals** (both): FCP 0.3–0.4 s · LCP 0.5–0.7 s · **CLS 0** · **TBT 0 ms** · Speed Index 0.3–0.4 s.
- **Fonts** — confirmed the app uses a **system-font stack** (no `next/font`, no Google Fonts, no
  `@font-face`), which is already optimal. `next/font` was **not** added (it would introduce a font
  download and hurt CWV) — recorded as **DECISIONS #030**.
- **Images** — none (emoji + inline SVG only); nothing to optimize; no image-driven CLS.
- **Client JS** — minimal and unchanged (shared 102 kB; small islands only).

**Safe fixes (WCAG 2.5.3 "Label in Name", flagged by Lighthouse on `/q/[slug]`):** aligned each
`aria-label` to contain its visible text so voice-control users can activate controls by their
visible name — no visual or behavioral change:
- `app/q/[slug]/page.tsx` — Report link `aria-label` "Report an issue with this question" →
  **"Report issue with this question"**.
- `components/AISection.tsx` — Copy button `ariaLabel` "Copy the {level} prompt" →
  **"Copy prompt ({level} level)"**.
- `components/HelpfulVote.tsx` — down-vote `aria-label` "No, not helpful" →
  **"Not really, this wasn't helpful"**.
- `components/PrevNextNav.tsx` — removed the paraphrasing `aria-label` so the accessible name equals
  the visible "Previous/Next + question" text.
- `components/AmazonProductCard.tsx` — removed the paraphrasing `aria-label` on both link paths
  (accessible name now derives from the visible product text) + added an `sr-only` "opens in a new
  tab" hint; removed the now-unused label constant.

**Deferred:** the only remaining sub-100 audit is `color-contrast` on two tertiary labels
(slate-500 ≈ 4.06:1; emerald-500/70 ≈ 4.17:1) — the **DECISIONS #029** item, deferred to the H3/H4
token migration. The roadmap's **95+ target is met/exceeded** across every category and page.

- **Verified:** TypeScript clean; production build green (**251 pages**); First Load JS **unchanged**
  (`/q/[slug]` 111 kB, route JS 5.29 → **5.28 kB**; `/candidate` 245 kB; shared **102 kB**);
  **canonical + Open Graph + `QAPage`/`BreadcrumbList`/`WebSite`/`Organization` intact** (SEO 100);
  **no console errors** (Best Practices "no browser errors" audit passed); no URL/layout/UI change.
- *(Tooling note: Lighthouse's Chrome-launcher throws a harmless `EPERM` on temp-dir cleanup in this
  sandbox **after** the JSON report is written, so the reports were parsed directly from disk.)*

### Changed (ROADMAP M5 — Accessibility audit pass) — 2026-07-19
Comprehensive audit; repaired only what was necessary (no redesign, no behavior/URL/SEO change):
- **Skip-to-content link** — `app/layout.tsx` renders `<a href="#main" class="skip-link">Skip to
  main content</a>` as the first focusable element; `<main>` is now `id="main" tabIndex={-1}
  focus:outline-none` so the link moves focus to the content. New `.skip-link` class in
  `globals.css` (off-screen via a raw `top` toggle; slides in on `:focus`; stays in the a11y tree).
- **Global keyboard-focus indicator** — new `:focus-visible { outline: 2px solid brand-400;
  outline-offset: 2px }` base rule in `globals.css`. Links, cards, and chips that previously relied
  on the browser default now show a consistent brand outline **for keyboard/programmatic focus
  only** (mouse clicks unaffected). Ring-based controls (`.btn`/`.btn-pill`, AISection, PrevNextNav)
  keep their existing ring — they set `outline-none`, and the utilities/components layers win over
  the base rule, so there is **no double outline**.
- **Landmark labels** — `components/Navbar.tsx` `<nav aria-label="Primary">`; `components/Footer.tsx`
  wraps its link groups in `<nav aria-label="Footer">` (semantic only; no visual change).
- **Icon-only control name** — `components/Navbar.tsx` Donate link now has `aria-label="Donate"`
  (its label text is hidden on mobile, so it was previously heart-emoji-only); the ❤️ is `aria-hidden`.
- **Search combobox semantics** — `components/SearchBar.tsx`: input gains `role="combobox"`,
  `aria-expanded`, `aria-controls="search-results"`, `aria-autocomplete="list"`, and
  `aria-activedescendant` (tracks the active option); the results `<ul>` is `role="listbox"`
  (`aria-label="Search results"`); each option is `role="option"` + `aria-selected`; decorative
  🔍 and ↵ are `aria-hidden`. No change to the existing keyboard behavior.
- **Contrast (WCAG AA)** — measured in-browser: primary/secondary text passes AA comfortably
  (slate-300 ≈ 13:1; slate-400 ≈ 7.3–7.7:1; nav links ≈ 13:1). Tertiary muted **slate-500** labels
  are ≈ 4.1:1 (below AA 4.5 for normal text; passes AA for large text). Per this roadmap item's
  "especially after the theme work" note and the existing backlog audit item, the slate-500 tone is
  **intentionally deferred to the H3/H4 CSS-token migration** (where the palette is re-tokenized and
  AA-verified in both light + dark), rather than doing a risky site-wide recolor now — **DECISIONS #029**.
- **Verified:** TypeScript clean; production build green (**251 pages**); skip link renders/pins on
  focus (visual confirmed) and combobox ARIA verified live (`aria-expanded` → true, 8 `role="option"`,
  first `aria-selected`, `aria-activedescendant` matches); no console errors; **First Load JS
  unchanged** (`/q/[slug]` 111 kB, `/candidate` 245 kB, shared 102 kB) — ARIA is markup, the CSS is
  not JS; **canonicals / `QAPage` / `BreadcrumbList` / `WebSite`+`Organization` untouched**; no URL
  or layout change.
- *(Preview note: the automation tab reports `document.hasFocus() === false`, so `:focus`/
  `:focus-visible` CSS can't be triggered programmatically there; the skip-link + focus rules were
  verified via the CSSOM + a forced-state screenshot, and behave normally for real keyboard users.)*

### Changed (ROADMAP M4 — Maintainability pass; behavior-preserving) — 2026-07-19
- **New `components/TopicCard.tsx` (server component):** consolidates the category-card markup that
  was **duplicated** in `app/page.tsx` and `app/candidate/page.tsx`. Props:
  - `headingLevel?: "h2" | "h3"` — preserves each page's heading hierarchy (candidate index **h2**,
    homepage "Explore Topics" **h3**).
  - `maxTopics?: number` — homepage shows the first **4** topic pills; the index shows **all**.
  - Rendered output is **byte-for-byte equivalent** to the previous inline cards; **no client JS**.
  - `app/candidate/page.tsx` and `app/page.tsx` now render `<TopicCard …>` (candidate page's now-
    unused `next/link` import removed).
- **New `hooks/useTemporaryFlag.ts` (introduces the `/hooks` folder):** extracts the identical
  `useState(false)` + `setTimeout(() => …, 1500)` "copied" feedback pattern that was duplicated in
  `CopyButton` and `ShareButton`. Both components now call `const [copied, markCopied] =
  useTemporaryFlag()` — behavior identical (on → auto-reset after 1500 ms).
- **Scope decisions (DECISIONS #028):** did **not** move `lib/types.ts` to `/types` (it already is
  the shared types module; relocating is churn across 7 import sites with no behavior benefit), did
  **not** create an empty `/constants` folder (no genuine cross-file constant today), and kept the
  `SearchBar` name (already internally consistent) — avoiding over-engineering (DECISIONS #022).
- **No new features, no UI redesign, no URL/layout/metadata/SEO/structured-data change.**
- **Verified:** TypeScript clean (`tsc --noEmit`); production build green (**251 pages**); category
  cards render identically (candidate index card = H2 + all 7 topics for Core Java; homepage card =
  H3 + 4 topics); the Copy-link control swaps to "✓ Link copied" and **auto-resets after 1500 ms**
  (confirming the extracted hook); no console errors; desktop + mobile intact; dark mode intact;
  canonicals + `QAPage`/`BreadcrumbList` untouched. **First Load JS:** `/q/[slug]` route JS 5.22 →
  **5.29 kB** (+0.07 kB from the shared hook module), **First Load unchanged at 111 kB**;
  `/candidate`, `/candidate/[category]`, and shared chunks (102 kB) **unchanged** (TopicCard is
  server-rendered).

### Changed (ROADMAP M3 — SEO title format alignment "FIG – …") — 2026-07-19 — SEO-sensitive
- **`app/layout.tsx` (only file changed):** aligned the `<title>` format to DECISIONS #014.
  - `title.template`: `"%s · Full Stack Interview Guru"` → **`"FIG – %s"`** (branded prefix,
    en-dash). Descriptive keywords are preserved — child pages already supply them, so titles now
    read **"FIG – Core Java Interview Questions"**, **"FIG – What is a HashMap?"**,
    **"FIG – Feedback — Help shape the content"**, etc.
  - `title.default` (homepage): → **"FIG – Full Stack Interview Guru | Interview Tomorrow? Start
    Here."** — adds the FIG brand while **retaining the full name** (DECISIONS #003, SEO signal).
- **DRY / minimal:** the category and question `generateMetadata` were **not** modified — they
  already emit the descriptive title text, so the template does the branding once (prepending
  "FIG –" per-page would have double-prefixed). No new file, no new dependency, no client JS.
- **Open Graph preserved:** the title template does **not** apply to explicitly-set `openGraph.title`
  values — verified the question `og:title` stays **"What is a HashMap?"** and the root OG title is
  unchanged. Twitter titles unchanged.
- **Verified:** TypeScript clean; production build green (**251 pages**); rendered `<title>` branded
  on home / category / question / feature pages; **canonicals intact** (e.g.
  `…/candidate/core-java`, `…/q/what-is-hashmap`); **structured data intact**
  (`QAPage` + `BreadcrumbList` + `WebSite` + `Organization`); First Load JS **unchanged** (`/q/[slug]`
  111 kB, `/candidate/[category]` 106 kB, shared 102 kB) — **zero delta / zero bundle impact**
  (metadata-only); no console errors; **no URL, layout, or UI change**; no client JS. Executes
  DECISIONS #014 while preserving DECISIONS #003.

### Added (ROADMAP M2 — Prev/Next topic navigation + position + "View all") — 2026-07-19
- **`lib/questions.ts`:** new pure helper `getQuestionNav(slug)` returning `{ index, total, prev?,
  next? }` — the question's **1-based position within its category** and its neighbours. Order is
  **document order** (same as `questionsByCategory`, i.e. what the category page renders), so
  "Question N of M" and Prev/Next stay consistent with the rest of the site. New exported
  `QuestionNav` interface. No content changed.
- **`components/PrevNextNav.tsx`** (new, **server component — no `"use client"`, zero client JS**):
  - **Previous / Next** links within the category; the neighbour's **question text is the anchor
    text** (stronger internal linking) and each link carries `rel="prev"/"next"` (sequential-page
    hint) plus a descriptive `aria-label` (e.g. "Next question: …").
  - **"Question N of M"** position indicator.
  - **"View all {category} →"** link to the category page (the Topic Roadmap / View All Questions
    entry point requested for M2).
  - First/last questions **omit the missing side** (placeholder keeps the 3-column desktop grid
    aligned); reuses existing `.card`/`.card-hover` styles and brand tokens.
- **`app/q/[slug]/page.tsx`:** computes `nav = getQuestionNav(q.slug)` at build time and renders
  `<PrevNextNav nav={nav} category={cat} />` at the end of the `<article>` (after Related
  Questions), only when a neighbour exists.
- **Static-first / reuse:** no new dependency, no client JS, no new data structure — extended the
  existing question data + reused card styles and Next `Link`. No URL/SEO change.
- **Verified:** TypeScript clean (`tsc --noEmit`); production build green (**251 pages**);
  `/q/[slug]` First Load JS **unchanged at 111 kB** (route JS 5.22 kB) / shared 102 kB — **zero
  delta** (server-rendered); position + neighbours correct (e.g. `hashmap-vs-hashtable` → "Question
  2 of 27", prev `what-is-hashmap`, next `java-equals-hashcode`); first question correctly shows
  **no** `rel="prev"`; accessibility (`<nav aria-label="Question navigation">`, descriptive
  `aria-label`s, decorative arrows `aria-hidden`, focus-visible rings); desktop + mobile (no
  horizontal overflow — verified at a true 320px column); dark mode intact; **no console errors**;
  **SEO/structured data untouched** (nav **not** in JSON-LD; `QAPage`/`BreadcrumbList`/canonical/OG
  intact). Satisfies DECISIONS #009 (learning path, avoid orphan pages).

### Added (ROADMAP M1 — Last Updated + Report Issue; completes the question-page standard) — 2026-07-19
- **`lib/types.ts`:** new optional `updated?: string` field on `Question` (ISO `YYYY-MM-DD`).
  Backward-compatible — the existing 212 questions are untouched and render exactly as before.
- **`app/q/[slug]/page.tsx`:**
  - **"🗓️ Updated <date>" chip** in the meta row, shown **only when** a question has `updated`.
    Formatted at **build time** by a small deterministic `formatUpdated` helper (regex-parsed, a
    fixed month table — no locale/timezone dependence; malformed dates are safely omitted). Reuses
    the existing `.chip` style; the emoji is `aria-hidden` (accessible name = "Updated Jul 19, 2026").
  - **`dateModified`** added to the `QAPage` and its `mainEntity` `Question` JSON-LD **only when**
    a valid `updated` date is present (SEO freshness signal). The `acceptedAnswer` still contains
    the real answer only — prompts/UI are not in JSON-LD.
  - **"🚩 Report issue"** control added to the existing actions row (next to Copy link / Share) as a
    **server-rendered `<Link>`** to `/feedback?context=Question: "…" (/q/<slug>)` — reusing the
    existing `FeedbackForm` flow (which already reads `?context=`). No new client component; the
    reported question is attached as context. Styled with the existing `.btn-pill`; descriptive
    `aria-label`, emoji `aria-hidden`.
- **Static-first / no new deps / no client JS added:** both additions are server-rendered; the date
  is formatted at build time. **First Load JS unchanged** (`/q/[slug]` stays **111 kB**; shared 102 kB).
- **Reuse honored:** no duplicate components — extended the page, reused `.chip`/`.btn-pill`,
  `FeedbackForm`, and the `absoluteUrl`/site config. Learning-section names + monetization untouched.
- **Verified:** TypeScript clean (`tsc --noEmit`); production build green (**251 pages**); the chip +
  `dateModified` render for a dated question and are **absent** for undated ones (backward-compat
  confirmed via a temporary seed that was reverted); Report Issue lands on `/feedback` with the
  question context attached; desktop + mobile (no horizontal overflow — verified at a true 320px
  column, both new rows `scrollWidth == clientWidth`); dark mode intact; **no console errors**;
  **no SEO/URL/canonical changes** (`QAPage`/`BreadcrumbList`/OG intact). Completes DECISIONS #007.

### Documentation (Session 2026-07-19 — workflow templates + quality checklists)
- **New `docs/templates/`:** `START_NEW_SESSION.md` and `END_SESSION.md` — living templates
  codifying the start/end-of-session workflow (read docs → analyze → recommend → approval gate →
  implement one item → verify → update docs → handover → stop).
- **New `docs/checklists/`:** `IMPLEMENTATION_CHECKLIST.md`, `SEO_CHECKLIST.md`,
  `ACCESSIBILITY_CHECKLIST.md`, `RELEASE_CHECKLIST.md` — standard verification gates referenced by
  the templates. No code/behavior changes.

### Documentation (Session Closure 2026-07-18 — docs re-numbering + Ideas Backlog)
- **Numeric-prefix convention adopted** for `/docs`: `PROJECT_CONTEXT`→`01_`, `DECISIONS`→`02_`,
  `CLAUDE_INSTRUCTIONS`→`03_`, `ARCHITECTURE`→`04_`, `ROADMAP`→`05_`, `CHANGELOG`→`06_`,
  `SESSION_HANDOVER`→`07_`, `CONTRIBUTING`→`13_`. All internal cross-links updated to the new
  targets; navigation verified (no stale links). Slots `08_DEPLOYMENT`–`12_OWNER_MANUAL` reserved.
- **New `99_IDEAS_BACKLOG.md`** — the permanent "Innovation Parking Lot" for uncommitted ideas;
  the roadmap now holds committed work only. The former ROADMAP "Future" items (F1–F4) were moved
  into the backlog with history preserved; `05_ROADMAP.md` points to it.
- `13_CONTRIBUTING.md` documents the numbering convention and the ideas-vs-roadmap rule.
- "Last Updated" refreshed to 2026-07-18 23:30 IST across all docs. No code/behavior changes.

### Decisions recorded
- **#026 Monetization Strategy Retained** — Featured Products / Donate / AdSense kept as-is
  (owner-confirmed). Resolves ROADMAP L3.
- **#027 Learning Section Names Retained + Subtitles** — keep "Coffee Chat / Mind Map /
  Hands-on / What If"; add professional subtitles later (presentation only). Updates ROADMAP L2.

### Added (ROADMAP H2 — "Continue Learning with AI" section) — the core differentiator
- New pure module `lib/ai-prompts.ts`:
  - `buildAiPrompts(question, categoryLabel)` returns four depth-graded, ready-to-paste prompts
    — **Beginner / Intermediate / Senior Engineer / Architect** (DECISIONS #008) — built only
    from the question's own public content (topic + question text; no PII, no external calls).
  - `AI_PROVIDERS` config for **ChatGPT / Gemini / Claude** with per-provider deep links
    (ChatGPT + Claude prefill the prompt via a query param; Gemini opens the app).
- New client island `components/AISection.tsx` (`"use client"`): a single island rendered below
  the server-rendered answer on `/q/[slug]`. Level selector (button group) + prompt preview +
  **Copy prompt** (reuses the shared `CopyButton`) + **Open in ChatGPT / Gemini / Claude**
  (opening a provider also copies the prompt, so assistants without a prefill link can be pasted).
- Wired into `app/q/[slug]/page.tsx`: the four prompts are **precomputed at build time** in the
  server component and passed to the island as plain strings, so no prompt-building logic ships to
  the client. Added a "🤖 Continue Learning with AI" entry to the "On this page" sidebar.
- **Static-first / no dependencies:** no API calls, no backend, no auth, no new packages.
- Accessibility: `<section aria-labelledby>`; level selector is a labelled `role="group"` of
  real `<button>`s with `aria-pressed`; the prompt region is `aria-live="polite"` (switch is
  announced); decorative emoji are `aria-hidden`; the copy control carries a descriptive
  `aria-label`; all controls have `focus-visible` rings.
- Verified: TypeScript clean (`tsc --noEmit`); production build green (**251 pages**); level
  switching updates the prompt + `aria-pressed` + provider deep links; desktop + mobile (no
  horizontal overflow — prompt `<pre>` uses `whitespace-pre-wrap break-words`); dark mode matches
  the existing design language; **no console errors/warnings**. **SEO/structured data untouched:**
  `QAPage` `acceptedAnswer` still contains only the real answer (prompts are **not** in JSON-LD),
  `BreadcrumbList`, canonical, and Open Graph all intact; the section is below the server-rendered
  answer and does not affect crawlable content. **First Load JS delta:** `/q/[slug]` 4.36 kB →
  **5.22 kB** route JS (110 kB → **111 kB** First Load), shared chunks unchanged (102 kB) — ≈ +1 kB.

### Changed (ROADMAP QW1 — Navigation branding "FIG")
- The navbar wordmark now shows the short brand **FIG** (per DECISIONS #003, "FIG is used
  throughout the interface") instead of the full "Full Stack Interview Guru". The 🧭 logo mark,
  tagline, sizes, spacing, and nav links are unchanged — no redesign, layout height stable (64px).
- **SEO + accessibility preserved:** the full name is retained in the header as `sr-only`
  text (crawlable, read by screen readers) plus a hover `title`. The full "Full Stack Interview
  Guru" also remains in the homepage H1, footer, `<title>`, Open Graph, and `WebSite`/
  `Organization` JSON-LD — so no brand/SEO signal is lost.
- Verified: TypeScript clean; production build green (251 pages, shared JS unchanged — Navbar
  is a server component); FIG renders on desktop + mobile (tagline still hidden on mobile);
  no horizontal overflow; dark mode intact; no console errors; canonicals/structured data untouched.

### Added (ROADMAP QW3 — Estimated Reading Time on question pages)
- New pure util `lib/reading-time.ts` (`readingTimeMinutes`) computing whole-minute reading
  time (200 wpm, min 1) **at build time — no client JavaScript**.
- Question pages (`/q/[slug]`) show a subtle "⏱️ N min read" chip in the top meta row
  (reusing the existing `.chip` style), alongside difficulty and experience.
- Scope: counts the **core question + answer content only** (question, short answer, mind-map
  text/kv, hands-on code, what-if, real-world, interviewer expectation, common mistakes, best
  practices, follow-ups). Deliberately **excludes** metadata (tags/asked-in/difficulty),
  related questions, related-tech chips, external references, and any future AI prompts.
- Accessibility: the clock emoji is `aria-hidden`, so the accessible name is just "N min read".
- Verified: TypeScript clean; production build green (251 pages) with **no First Load JS change**
  (server-computed); value validated against rendered content (~195-word answer → 1 min);
  desktop + mobile (no horizontal overflow); dark mode intact; no console errors; **no SEO/URL
  or structured-data changes** (JSON-LD/canonical untouched).

### Added (ROADMAP QW2 — Copy Link + Share on question pages)
- New `components/ShareButton.tsx` (`"use client"`, no dependencies): uses the native
  **Web Share API** when available (mobile) to open the OS share sheet, and **gracefully
  falls back to copying the link** on browsers without it (typical desktop).
- Question pages (`/q/[slug]`) now show a small actions row under the title/tags:
  **🔗 Copy link** (reusing `CopyButton`, copying the canonical absolute URL) + **↗ Share**.
- New reusable `.btn-pill` component class in `app/globals.css` (consistent with existing
  `.chip`/`.btn-secondary`) so both controls share one style with proper `focus-visible`
  rings — keyboard-accessible.
- Accessibility: decorative icons are `aria-hidden` (clean accessible names "Copy link" /
  "Share"); state changes ("Link copied") announced via `aria-live="polite"`.
- Satisfies the Share + Copy Link items of the question-page standard (DECISIONS #007).
- Verified: TypeScript clean; production build green (251 pages); both controls render and
  are usable on desktop + mobile (no horizontal overflow); Share fallback copies the link
  without throwing; dark mode intact; no console errors; **no SEO/URL changes** (server-
  rendered answer + canonical/QAPage/BreadcrumbList untouched; copied URL equals the canonical).

### Added (ROADMAP QW5 — Reusable CopyButton component)
- New reusable `components/CopyButton.tsx` (`"use client"`) that owns the
  copy-to-clipboard write and the transient "✓ Copied" feedback. Flexible props
  (`value`, `label`, `copiedLabel`, `className`, `ariaLabel`) so future actions
  (e.g. QW2 "Copy link") reuse one implementation instead of re-writing clipboard logic.
- `components/CodeBlock.tsx` now uses `CopyButton` (removing its duplicated inline copy
  state). As a result CodeBlock no longer needs client state and reverts to a **server
  component** — a small reduction in client JS. Rendered markup/output is unchanged.
- Accessibility: the button announces its label change via `aria-live="polite"`; the
  visible "Copy"/"✓ Copied" text remains its accessible name (behavior-preserving).
- Verified: TypeScript clean; production build green (251 pages); question page renders
  the code-block Copy button identically (desktop + mobile, no horizontal overflow); dark
  mode intact; no hydration/console errors; no SEO/URL changes (server-rendered output
  unchanged).

### Changed (DECISIONS #027 — Learning-section subtitles)
- Added concise professional subtitles beneath the four learning-section headings on
  question pages (`/q/[slug]`), via an optional `subtitle` prop on the existing `Section`
  component (reused, not a new component). Names unchanged, unreordered, not removed:
  - ☕ Coffee Chat Question → "Concept Made Simple"
  - 🧠 Mind Map Answer → "Remember It Faster"
  - ⌨ Hands-on Keyboard → "Learn by Doing"
  - 🔥 What If? → "Think Beyond the Expected"
- Styling: `text-sm` slate-400 (matches existing secondary typography), tight `mt-1`
  spacing; no other sections affected; no redesign.
- Verified: TypeScript + build (251 pages); subtitles render on desktop + mobile; dark
  mode intact; SEO unchanged (canonical + WebSite/Organization/QAPage/BreadcrumbList all
  intact); no console errors; no horizontal overflow from the change.

### Added (ROADMAP QW4 — BreadcrumbList structured data)
- New reusable `components/JsonLd.tsx` (generic schema.org `<script>` emitter) and
  `components/Breadcrumb.tsx` (single-source accessible breadcrumb + `BreadcrumbList`
  JSON-LD with absolute URLs).
- Question pages (`/q/[slug]`) and category pages (`/candidate/[category]`) now emit
  `BreadcrumbList` structured data and use the reusable component (replacing inline markup).
- Accessibility upgrade: semantic `<nav aria-label="Breadcrumb"><ol>` with `aria-current="page"`.
- Verified: visible trail unchanged; existing `WebSite`/`Organization`/`QAPage` schema intact;
  canonicals intact; no URL changes; TypeScript + build (251 pages); no console errors;
  no horizontal scroll.

### Added (ROADMAP H1 — Browser branding)
- FIG monogram **SVG favicon** (`app/icon.svg`), **Apple Touch Icon** (`app/apple-icon.tsx`,
  180×180 PNG generated via `next/og`), and **web app manifest** (`app/manifest.ts`,
  name/short_name "FIG", theme-color, icons). Auto-linked by Next.js.
- Brand colors: Teal + Gold (per DECISIONS #005). Pure additions — no existing code changed.
- Verified: TypeScript + production build (251 pages), assets resolve (svg/png/manifest),
  head links present, no console errors, no SEO/URL regression.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 23:45 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
