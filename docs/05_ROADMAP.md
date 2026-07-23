# ROADMAP.md

# FullStackInterviewGuru (FIG) — Phase 2 Roadmap

This roadmap aligns the **current implementation** (see [04_ARCHITECTURE.md](./04_ARCHITECTURE.md))
with the **vision** in [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md) and the approved
[02_DECISIONS.md](./02_DECISIONS.md). Every item is incremental and non-breaking. No item requires
a URL change. Nothing here is implemented until the owner approves it, one feature at a time.

**Legend — SEO impact:** `None` · `Positive` · `Neutral` · `Sensitive` (needs care).
**Complexity:** `S` (small) · `M` (medium) · `L` (large).

---

## ⚡ Quick Wins (low effort · high value · low risk)

### QW1 — Show "FIG" brand in the interface (keep full name for SEO)
- **Status:** ✅ **Completed 2026-07-18** — navbar wordmark is now **FIG** (accent on the "I");
  full name kept as header `sr-only` + hover `title`, and unchanged in the homepage H1, footer,
  `<title>`, OG, and JSON-LD. No redesign; nav height stable (64px). Verified: TS + build (251
  pages, shared JS unchanged), desktop/mobile (no overflow), a11y, dark mode, no SEO/URL change.
- **Description:** Navbar/logo displays **FIG** (per PROJECT_CONTEXT "FIG is used throughout
  the interface"); the full "FullStackInterviewGuru" stays in the footer, `<title>`, OG, and
  structured data for SEO.
- **Reason:** DECISIONS #003 and the brand section mandate FIG in-interface.
- **Benefits:** Brand consistency; cleaner nav; matches documented identity.
- **Complexity:** S
- **Possible Risks:** Minor — users mid-session see a shorter brand; mitigated by keeping the
  full name adjacent/on hover.
- **Files:** `components/Navbar.tsx` (and possibly `components/Footer.tsx`).
- **SEO affected:** None (metadata/titles unchanged).

### QW2 — Copy Link + Share on question pages
- **Status:** ✅ **Completed 2026-07-18** — actions row on `/q/[slug]`: **Copy link** (reuses
  `CopyButton`, canonical absolute URL) + new `components/ShareButton.tsx` (Web Share API with
  copy fallback, no deps). Added reusable `.btn-pill` class; icons `aria-hidden`, state via
  `aria-live`. Verified: TS + build (251 pages), desktop/mobile (no overflow), dark mode, no
  SEO/URL change.
- **Description:** Add a small "Copy link" and native "Share" (Web Share API with copy
  fallback) control to each question page. Reuse a new `CopyButton` (the copy logic already
  exists inside `CodeBlock`).
- **Reason:** DECISIONS #007 requires Share and Copy Link.
- **Benefits:** Easier sharing → organic reach; satisfies the question-page standard.
- **Complexity:** S
- **Possible Risks:** Web Share API is mobile-centric; fallback to clipboard covers desktop.
- **Files:** new `components/CopyButton.tsx`, `components/ShareButton.tsx`; `app/q/[slug]/page.tsx`.
- **SEO affected:** None.

### QW3 — Estimated Reading Time on question pages
- **Status:** ✅ **Completed 2026-07-18** — pure `lib/reading-time.ts` (200 wpm, min 1),
  computed at build time (no client JS); "⏱️ N min read" chip in the meta row. Counts core
  Q&A content only (excludes metadata, related questions, related-tech, references, future AI
  prompts). Emoji `aria-hidden`. Verified: TS + build (251 pages, no First Load JS change),
  desktop/mobile, dark mode, no SEO/structured-data change.
- **Description:** Compute reading time from the question's text content (words ÷ ~200 wpm)
  in a small pure util; display in the meta row.
- **Reason:** DECISIONS #007 lists Estimated Reading Time.
- **Benefits:** Sets learner expectations; zero runtime cost (computed at build).
- **Complexity:** S
- **Possible Risks:** None material.
- **Files:** new `lib/reading-time.ts`; `app/q/[slug]/page.tsx`.
- **SEO affected:** None.

### QW4 — BreadcrumbList structured data
- **Status:** ✅ **Completed 2026-07-18** (reusable `JsonLd` + `Breadcrumb` components; schema on `/q/[slug]` and `/candidate/[category]`; a11y `<nav><ol>` + `aria-current`; no SEO/URL regression).
- **Description:** Emit `BreadcrumbList` JSON-LD on category and question pages (breadcrumbs
  already render visually). Extract a reusable `Breadcrumb` component that renders both the
  UI and the schema.
- **Reason:** DECISIONS #011 requires breadcrumb schema; currently only visual.
- **Benefits:** Rich-result breadcrumb trails in search → better CTR; dedupes inline markup.
- **Complexity:** S
- **Possible Risks:** Invalid JSON-LD if paths are wrong — validate with Rich Results Test.
- **Files:** new `components/Breadcrumb.tsx`; `app/q/[slug]/page.tsx`,
  `app/candidate/[category]/page.tsx`.
- **SEO affected:** Positive.

### QW5 — Extract reusable Breadcrumb / RelatedQuestions / CopyButton
- **Status:** ✅ **Completed 2026-07-18** — reusable `components/CopyButton.tsx` extracted from
  `CodeBlock` (now behavior-preserving; CodeBlock reverts to a server component). `Breadcrumb`
  was already extracted in QW4. `RelatedQuestions` extraction intentionally deferred (not
  required now; avoids an unrelated refactor) and can be revisited during M4. Verified: TS +
  build (251 pages), visual parity, a11y (`aria-live`), no SEO/URL change.
- **Description:** Factor currently-inline breadcrumb, related-questions, and copy logic into
  small reusable components (referenced by CLAUDE_INSTRUCTIONS component list).
- **Reason:** Engineering philosophy (#022): reuse, no duplication.
- **Benefits:** Less duplication; consistent behavior; easier future changes.
- **Complexity:** S–M
- **Possible Risks:** Pure refactor — must be behavior-preserving; verify build + visual parity.
- **Files:** new `components/Breadcrumb.tsx`, `components/RelatedQuestions.tsx`,
  `components/CopyButton.tsx`; `app/q/[slug]/page.tsx` (+ category page).
- **SEO affected:** None (markup preserved).

---

## 🔴 High Priority

### H1 — Complete browser branding (favicon, icons, manifest, theme-color)
- **Status:** ✅ **Completed 2026-07-18** (`app/icon.svg`, `app/apple-icon.tsx`, `app/manifest.ts`; FIG monogram in Teal + Gold; auto-linked; pure additions).
- **Description:** Add a professional **FIG monogram**: `favicon.ico`, SVG favicon,
  Apple Touch Icon, Android/maskable icons, `manifest.webmanifest`, and theme-color — via
  Next.js metadata/file conventions in `app/`. Replace the current emoji favicon.
- **Reason:** DECISIONS #014 / PROJECT_CONTEXT "Browser Branding" mandate this; core to the
  "most professional platform" trust goal.
- **Benefits:** Credible browser-tab/PWA identity; trust; installability groundwork.
- **Complexity:** M
- **Possible Risks:** Icon assets must be crisp at all sizes; test light/dark tab backgrounds.
- **Files:** `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`, `app/manifest.ts`,
  new `public/` icon assets; `app/layout.tsx` (metadata wiring).
- **SEO affected:** Neutral/Positive (no URL change; better brand signals).

### H2 — "Continue Learning with AI" section (core differentiator)
- **Status:** ✅ **Completed 2026-07-18** — reusable client island `components/AISection.tsx`
  on `/q/[slug]` with four depth-graded prompts (**Beginner / Intermediate / Senior Engineer /
  Architect**) built at build time in the new pure module `lib/ai-prompts.ts` (no client
  prompt-building JS). One-click **Copy prompt** (reuses `CopyButton`) + **Open in ChatGPT /
  Gemini / Claude** (ChatGPT/Claude prefill via query param; opening also copies for Gemini).
  Static-first: no API calls, no backend, no auth, no new deps; single client island below the
  server-rendered answer. Verified: TS + build (251 pages), a11y (`role="group"` + `aria-pressed`,
  `aria-live` prompt, `aria-labelledby`, focus rings), desktop/mobile (no overflow), dark mode,
  **SEO/structured data untouched** (QAPage/BreadcrumbList/canonical/OG intact; prompts not in
  JSON-LD), First Load JS delta ≈ **+1 kB** (110→111 kB; shared unchanged).
- **Description:** A reusable `AISection` on every question page that generates optimized
  prompts (Beginner / Intermediate / Senior Engineer / Architect) with one-click copy and
  open-in ChatGPT / Gemini / Claude. Prompts are built client-side from the question's data.
- **Reason:** PROJECT_CONTEXT "AI Strategy" + DECISIONS #008 make this a required, defining
  feature ("Does this help someone perform better in an interview?" — yes).
- **Benefits:** Unique learning value; deeper engagement; on-brand ("AI as companion").
- **Complexity:** M
- **Possible Risks:** Small client component (keep JS minimal, lazy where possible); ensure
  prompts are high quality and safe (no PII, no misleading content).
- **Files:** new `components/AISection.tsx`, `lib/ai-prompts.ts`; `app/q/[slug]/page.tsx`.
- **SEO affected:** None (client-side, below main content; keep server-rendered answer intact).

### H3 — Light/Dark theme system (light default + `prefers-color-scheme`, no toggle)
- **Description:** Introduce a CSS design-token layer (CSS variables) so all colors derive
  from tokens. Default to **light**; switch to dark automatically via `prefers-color-scheme`.
  No manual toggle (per decision). Remove the hardcoded `<html className="dark">`.
- **Reason:** DECISIONS #006 (default light, follow system) — the current dark-only build is
  the single largest divergence from the approved design.
- **Benefits:** Matches approved UX; better daytime readability/accessibility; broader appeal.
- **Complexity:** L
- **Possible Risks:** Touches the whole color system; risk of contrast regressions and a
  washed-out light mode. **Mitigation:** token migration in one pass, verify WCAG AA contrast
  in both themes, preserve the "premium" dark feel, no markup/URL changes. Pairs with H4.
- **Files:** `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`; light touches across
  components where colors are hardcoded rather than tokenized.
- **SEO affected:** None (visual only; no markup/URL change).

### H4 — Teal + Gold/Kaavi palette (align to approved color system)
- **Description:** Re-map the design tokens from Indigo/Blue to **Teal (primary) + Gold/Kaavi
  (secondary)** as defined in DECISIONS #005 — done as part of the H3 token migration so both
  themes share one source of truth.
- **Reason:** DECISIONS #005 / PROJECT_CONTEXT color palette.
- **Benefits:** On-brand identity; distinct, premium look; consistency across the app.
- **Complexity:** M (if bundled with H3); L standalone.
- **Possible Risks:** Accent changes ripple through many components; verify contrast + focus
  visibility. Not a redesign — a token re-map; layout/markup unchanged.
- **Files:** `tailwind.config.ts`, `app/globals.css` (+ any hardcoded color utilities).
- **SEO affected:** None.

---

## 🟡 Medium Priority

### M1 — Complete the question-page standard (Last Updated, Report Issue)
- **Status:** ✅ **Completed 2026-07-19** — optional `updated?: string` (ISO `YYYY-MM-DD`) added
  to `Question` (backward-compatible; existing 212 questions untouched). Question pages show a
  build-time **"🗓️ Updated <date>"** chip (deterministic locale/timezone-free formatter) **only
  when a date is set**, and emit **`dateModified`** on the `QAPage` + `Question` JSON-LD when
  present. **"🚩 Report issue"** added to the actions row as a server-rendered `<Link>` to the
  existing `/feedback?context=…` flow (no new client component; question passed as context).
  Verified: TS + build (**251 pages**), `/q/[slug]` First Load JS **unchanged (111 kB)** / shared
  102 kB, dark mode, mobile (no overflow at a true 320px column), no console errors, **SEO/
  canonical/URLs untouched**. This completes DECISIONS #007.
- **Description:** Add "Last Updated" (per-question date) and "Report Issue" (reuse the
  existing feedback flow with the question as context) to finish DECISIONS #007. (Reading
  time, share, copy link are covered by Quick Wins.)
- **Reason:** DECISIONS #007 / CLAUDE_INSTRUCTIONS question-page standard.
- **Benefits:** Freshness signal (trust) + a feedback loop for content quality.
- **Complexity:** S–M (needs an optional `updated?` field on `Question`).
- **Possible Risks:** Adding a data field — keep optional and backward-compatible.
- **Files:** `lib/types.ts`, `app/q/[slug]/page.tsx`, reuse `components/FeedbackForm.tsx`.
- **SEO affected:** Positive (a `dateModified` can enrich `QAPage`).

### M2 — Prev/Next topic navigation + "Topic Roadmap" links (no orphan pages)
- **Status:** ✅ **Completed 2026-07-19** — new pure helper `getQuestionNav(slug)` in
  `lib/questions.ts` (deterministic **document-order** position within the category, matching the
  category page) + new **server component** `components/PrevNextNav.tsx`: Previous / Next links
  (with the neighbour's question as anchor text + `rel="prev"/"next"`), a **"Question N of M"**
  position indicator, and a **"View all {category} →"** link (Topic Roadmap / View All). Rendered
  at the end of the question `<article>`. First/last questions correctly omit the missing side.
  Verified: TS + build (**251 pages**), `/q/[slug]` First Load JS **unchanged (111 kB)** — server
  component, **zero client JS**; a11y (`<nav aria-label>`, descriptive link `aria-label`s,
  focus-visible rings); mobile (no overflow at a true 320px column); dark mode; no console errors;
  **SEO/structured data untouched** (nav not in JSON-LD; `QAPage`/`BreadcrumbList`/canonical
  intact; no URL change). Satisfies DECISIONS #009 (learning path, no orphan pages).
- **Description:** On question pages, add Previous/Next within the category and a link back to
  the category ("Topic Roadmap"); ensure strong internal linking.
- **Reason:** DECISIONS #009 (learning path, avoid orphan pages) + internal-linking goals.
- **Benefits:** Better learning flow; stronger internal linking → SEO + engagement.
- **Complexity:** M
- **Possible Risks:** Ordering logic must be deterministic; keep it data-driven.
- **Files:** new `components/PrevNextNav.tsx`, small helper in `lib/questions.ts`;
  `app/q/[slug]/page.tsx`.
- **SEO affected:** Positive (internal linking).

### M3 — SEO title format alignment ("FIG – … Interview Questions")
- **Status:** ✅ **Completed 2026-07-19** — single, DRY change in `app/layout.tsx`: the title
  `template` changed from the suffix form `"%s · Full Stack Interview Guru"` to the DECISIONS #014
  prefix form **`"FIG – %s"`**, and the homepage `default` now leads with **FIG** while retaining
  the full name for SEO (`"FIG – Full Stack Interview Guru | Interview Tomorrow? Start Here."`).
  The category/question `generateMetadata` were **not edited** — they already provide the
  descriptive `%s` text, so the template yields exactly **"FIG – Core Java Interview Questions"** and
  **"FIG – What is a HashMap?"** (prepending "FIG –" per-page would have double-prefixed). Verified:
  `<title>` branded on home/category/question/feature pages; **`og:title` unchanged** (template does
  not apply to explicitly-set Open Graph titles — question OG stays "What is a HashMap?");
  canonicals intact; `QAPage`/`BreadcrumbList`/`WebSite`/`Organization` intact; TS + build
  (**251 pages**), First Load JS **unchanged** (metadata-only, **zero delta**); no console errors;
  no URL/layout change; no client JS. Satisfies DECISIONS #014 while preserving DECISIONS #003
  (full name retained for SEO in homepage title, OG, JSON-LD, footer).
- **Description:** Align `<title>` templates to the DECISIONS #014 examples while keeping
  descriptive keywords (e.g. "FIG – Core Java Interview Questions").
- **Reason:** DECISIONS #014 title examples; consistent branded titles.
- **Benefits:** Branded, consistent SERP titles.
- **Complexity:** S
- **Possible Risks:** **SEO-sensitive** — title changes affect ranking/CTR; do it deliberately,
  preserve primary keywords, avoid churn. Owner approval required per SEO rules.
- **Files:** `app/layout.tsx` (title template), category/question `generateMetadata`.
- **SEO affected:** Sensitive.

### M4 — Component & folder maintainability pass
- **Status:** ✅ **Completed 2026-07-19** — behavior-preserving refactor (see DECISIONS #028):
  - **`components/TopicCard.tsx`** (new, **server component**) consolidates the category-card markup
    that was **duplicated** in `app/page.tsx` and `app/candidate/page.tsx`. Props `headingLevel`
    (`h2` index / `h3` homepage) + `maxTopics` (homepage caps at 4; index shows all) preserve each
    page's prior output **exactly**. Zero client JS.
  - **`hooks/useTemporaryFlag.ts`** (new — introduces the `/hooks` folder) extracts the identical
    `useState(false)` + `setTimeout(…,1500)` "copied" feedback pattern shared by `CopyButton` and
    `ShareButton`; both now consume the hook (behavior identical).
  - **Deliberately deferred (avoiding over-engineering per DECISIONS #022):** did **not** relocate
    `lib/types.ts` to `/types` (it already is the shared types module; a move is pure churn across 7
    import sites with no behavior gain), did **not** create an empty `/constants` folder (no genuine
    cross-file constant today), and kept the `SearchBar` name (already internally consistent). See
    DECISIONS #028.
  - Verified: TS + build (**251 pages**); category cards render identically (candidate index H2 +
    all topics; homepage H3 + 4 topics); Copy/Share "copied" swap + 1500 ms auto-reset confirmed;
    First Load JS **unchanged** (`/q/[slug]` 111 kB; +0.07 kB route JS from the shared hook module;
    shared 102 kB unchanged; home/candidate gained no client JS); no console errors; **no UI/URL/
    behavior/SEO/structured-data change**.
- **Description:** Introduce `/hooks`, `/types`, `/constants` (per CLAUDE_INSTRUCTIONS folder
  structure) where they add value; consolidate near-duplicate UI (e.g. category cards →
  `TopicCard`; align `SearchBar`↔`SearchBox` naming) **without changing behavior**.
- **Reason:** Maintainability (#022) + documented folder structure.
- **Benefits:** Cleaner structure; easier onboarding; less duplication.
- **Complexity:** M
- **Possible Risks:** Refactor-only — must be behavior/markup preserving; verify build.
- **Files:** new `hooks/`, `types/`, `constants/` (as needed); selected components.
- **SEO affected:** None.

### M5 — Accessibility audit pass
- **Status:** ✅ **Completed 2026-07-19** — audited every page/interactive surface; repaired only
  what was necessary (no redesign, no behavior change):
  - **Skip-to-content link** in `app/layout.tsx` (`.skip-link` in `globals.css`) targeting a new
    focusable `<main id="main" tabIndex={-1}>` landmark.
  - **Global keyboard-focus indicator** — `:focus-visible { outline: 2px brand-400 }` in
    `globals.css` so links/cards/chips that lacked their own ring now show a visible focus outline
    (keyboard-only; mouse users unaffected; ring-based controls keep their ring via `outline-none`).
  - **Landmark labels** — `<nav aria-label="Primary">` (navbar), `<nav aria-label="Footer">` (footer).
  - **Icon-only control name** — the mobile Donate link now has `aria-label="Donate"` (was heart-only).
  - **Search combobox semantics** — input `role="combobox"` + `aria-expanded`/`aria-controls`/
    `aria-autocomplete`/`aria-activedescendant`; results `role="listbox"`; items `role="option"` +
    `aria-selected`; decorative 🔍/↵ marked `aria-hidden`.
  - **Contrast** — primary/secondary body text passes WCAG AA (slate-300 ≈ 13:1, slate-400 ≈
    7.3–7.7:1). Tertiary muted `slate-500` labels (~4.1:1) are **deliberately deferred to the H3/H4
    theme-token migration** (per this item's "especially after the theme work" note + backlog) —
    see DECISIONS #029.
  - Verified: TS + build (**251 pages**); skip link + combobox ARIA confirmed in-browser; First Load
    JS **unchanged** (`/q/[slug]` 111 kB, `/candidate` 245 kB, shared 102 kB); no console errors;
    **no URL/SEO/structured-data/layout change**.
- **Description:** Verify/repair visible focus states, ARIA labels on interactive controls, a
  "skip to content" link, semantic landmarks, and WCAG AA contrast (especially after the theme
  work).
- **Reason:** DECISIONS #013 / PROJECT_CONTEXT accessibility ("mandatory").
- **Benefits:** Inclusive UX; better Lighthouse a11y; legal/quality baseline.
- **Complexity:** M
- **Possible Risks:** Low; primarily additive.
- **Files:** `app/layout.tsx` (skip link/landmarks), interactive components, `globals.css`.
- **SEO affected:** Neutral/Positive (accessibility overlaps SEO signals).

### M6 — Performance / Lighthouse verification (target 95+)
- **Status:** ✅ **Completed 2026-07-19** — ran real Lighthouse 12 (desktop preset) against the
  **production build**:
  - **Homepage `/`:** Performance **100** · Accessibility **100** · Best Practices **100** · SEO **100**.
  - **Question `/q/[slug]`:** Performance **100** · Accessibility **96** · Best Practices **100** · SEO **100**.
  - **Core Web Vitals** (both pages): FCP 0.3–0.4 s, LCP 0.5–0.7 s, **CLS 0**, **TBT 0 ms**, SI 0.3–0.4 s.
  - **Fonts:** the app uses a **system-font stack** (no `next/font`, no web fonts, no `@font-face`) —
    already optimal (zero download, zero render-block, zero CLS). Adding `next/font` would *add* a
    download, so it was intentionally **not** introduced — see DECISIONS #030.
  - **Images:** none (emoji + inline SVG only) — no image optimization needed; no image CLS.
  - **Safe fixes made:** resolved the 7 `label-content-name-mismatch` (WCAG 2.5.3) items Lighthouse
    flagged on the question page by aligning each `aria-label` with its visible text (Report issue,
    AISection Copy prompt, HelpfulVote, PrevNextNav, AmazonProductCard). No visual/behavior change.
  - **Deferred:** the only remaining sub-100 audit is `color-contrast` on two tertiary labels
    (slate-500 ≈ 4.06:1, emerald-500/70 ≈ 4.17:1) — the **DECISIONS #029** item deferred to the
    H3/H4 token migration. The **95+ target is met/exceeded** on every category and page.
  - Verified: TS + build (**251 pages**); First Load JS **unchanged** (`/q/[slug]` 111 kB, route JS
    5.29 → 5.28 kB; `/candidate` 245 kB; shared 102 kB); canonical/OG/`QAPage`/`BreadcrumbList`
    intact (SEO 100); no console errors (Best Practices 100); no URL/layout change.
- **Description:** Optimize fonts (`next/font`), confirm minimal client JS, audit any images,
  and measure Core Web Vitals to confirm the 95+ target.
- **Reason:** DECISIONS #012 / performance goals.
- **Benefits:** Faster loads; better rankings and UX.
- **Complexity:** S–M
- **Possible Risks:** Low; measure before/after.
- **Files:** `app/layout.tsx` (fonts), config as needed.
- **SEO affected:** Positive (Core Web Vitals).

---

## 🟢 Low Priority

### L1 — Homepage & tone alignment ("calm, minimal, professional")
- **Description:** Where the homepage conflicts with "no visual clutter / no unnecessary
  animations / calm & premium" (DECISIONS #004, #015), gently reduce decorative motion and
  tighten hierarchy. Optionally surface the motto ("Learn Deeply. Interview Confidently.
  Grow Continuously.").
- **Reason:** Design philosophy (#004) + animation policy (#015).
- **Benefits:** More premium, focused first impression.
- **Complexity:** S–M
- **Possible Risks:** Must NOT be a redesign-for-looks; change only what conflicts with the
  documented tone. Owner approval required.
- **Files:** `app/page.tsx`, `app/globals.css` (animation utilities).
- **SEO affected:** None.

### L2 — Question section-label alignment (optional)
- **Status:** ✅ **Completed 2026-07-18 (via DECISIONS #027)** — names kept exactly as-is; professional **subtitles** added beneath the four learning headings instead of renaming. Reused the existing `Section` component.
- **Description:** The playful section labels (☕ Coffee Chat, 🧠 Mind Map, ⌨ Hands-on, 🔥
  What If) differ from the professional section names in DECISIONS #007 (Short Answer,
  Detailed Explanation, …). Consider aligning labels **without removing any content**.
- **Reason:** DECISIONS #004 (professional) / #007 (section standard).
- **Benefits:** More professional, "world-class platform" tone.
- **Complexity:** S
- **Possible Risks:** Alters an established, recognizable UX; may reduce personality. **Explicit
  owner decision required** — this is a judgment call, not an obvious improvement.
- **Files:** `app/q/[slug]/page.tsx` (labels only; data untouched).
- **SEO affected:** None.

### L3 — Monetization vs "Trust-First" alignment review (discussion, not removal)
- **Status:** ✅ **Resolved by DECISIONS #026** — monetization kept unchanged (owner-confirmed non-intrusive).
- **Description:** The current build includes Amazon "Featured Products", Donate/UPI, and
  AdSense placeholders. PROJECT_CONTEXT + DECISIONS #001/#021 say revenue comes **after** trust
  and ads must be limited/non-intrusive. **Recommendation:** review placement/prominence with
  the owner. **No feature will be removed without explicit instruction.**
- **Reason:** DECISIONS #001 (Trust Before Revenue), #021 (limited ads), Revenue Philosophy.
- **Benefits:** Aligns monetization with the trust-first principle.
- **Complexity:** S (config/placement) — decision-driven.
- **Possible Risks:** None technical; this is a product decision for the owner.
- **Files:** TBD based on decision (`app/page.tsx`, `app/q/[slug]/page.tsx`).
- **SEO affected:** None.

---

## 🟣 Post-Phase-2 Releases (production maintenance)

### AR1 — Compliance & AdSense Readiness
- **Status:** ✅ **Completed 2026-07-19** — production maintenance release preparing the site for Google
  AdSense approval (see CHANGELOG "AR1" and **DECISIONS #031**). **No redesign, no UX change, no URL removed.**
  - **AdSense:** preserved the env-gated `adsbygoogle.js` loader (once, site-wide, async, non-blocking);
    added an env-gated `google-adsense-account` verification `<meta>`. Client ID stays env-driven
    (`NEXT_PUBLIC_ADSENSE_ID`) — **never hardcoded**.
  - **New static pages:** `/about`, `/contact`, `/privacy` (cookies · GA · **AdSense cookies/opt-outs** ·
    third-party · security · external links · updates · contact), `/terms` (governing law: India),
    `/disclaimer`. Each: single `<h1>`, full metadata (title/description/canonical/OG/Twitter), and
    `BreadcrumbList` JSON-LD.
  - **New reusable components:** `LegalPage` (shared legal shell) + `ContactForm` (endpoint POST or mailto
    fallback — no fake backend). New `.prose-legal` class in `globals.css`.
  - **Footer:** added Company / Resources / Legal / Support columns (kept brand block + Browse Topics grid).
    **"Blog" omitted** — no route exists; adding a dead link would break the "every link works" rule.
  - **SEO:** `sitemap.ts` now lists the 5 new routes.
  - **Verified:** TS + build green (**256 pages**, +5 static); legal/About pages **zero client JS**
    (172 B route / 106 kB First Load); `/contact` 2.36 kB / 108 kB (only new island); **shared 102 kB
    unchanged**; all 5 pages 200 + single H1 + canonical/OG/breadcrumb; **all 24 footer links 200**;
    AdSense meta absent until ID set; mobile 375px no overflow; no console errors; existing
    `WebSite`/`Organization`/`QAPage`/`BreadcrumbList` + all existing routes untouched.
- **Owner follow-ups:** set `NEXT_PUBLIC_ADSENSE_ID` (+ optional `NEXT_PUBLIC_CONTACT_EMAIL` /
  `NEXT_PUBLIC_FEEDBACK_ENDPOINT`); confirm the Terms governing-law jurisdiction.
- **SEO affected:** Positive (more indexable pages, trust signals) — no URL/schema regression.

---

## 📚 Content Expansion (Phase 2)

Incremental, additive question-bank growth. **No route, UI, SEO, or schema change** — new
questions are typed objects appended to `lib/questions-extra/*` and merged automatically by
`lib/questions.ts` (search, sitemap, category pages, prev/next, AI prompts, structured data all
pick them up with zero extra wiring — see [04_ARCHITECTURE.md](./04_ARCHITECTURE.md) "Content Model").

### CE1 — Python question bank (25 questions)
- **Status:** ✅ **Completed 2026-07-23** — added **25** beginner→intermediate Python interview
  questions in the new `lib/questions-extra/python.ts` (`pythonExtra`), wired into
  `lib/questions-extra/index.ts`. Coverage: data types & mutability, `is`/`==`, lists
  (append/extend, slicing/reverse), tuples (packing/namedtuple), dicts (get/setdefault/Counter),
  sets, strings, functions (default-mutable-arg trap, `*args`/`**kwargs`), lambda, list
  comprehension, generators/`yield`, iterators vs iterables, exceptions, file handling, OOP
  (`__init__`/`self`, inheritance/`super()`, polymorphism/duck typing, encapsulation), modules,
  virtual environments, the GIL, and multithreading vs multiprocessing. Full FIG schema per
  question (short answer, mind-map, hands-on code, what-if, real-world, interviewer expectation,
  key points, follow-ups, common mistakes, best practices, related tech, tags, related questions);
  the four "Continue Learning with AI" prompts are auto-generated. **No duplicate** of the two
  existing base Python questions (`python-list-vs-tuple`, `python-decorators`). Python category now
  shows **27 live** (2 base + 25). Verified: TypeScript clean; production build green
  (**281 pages**, +25 `/q/[slug]`, was 256); **no duplicate slugs**; all 52 `related` refs resolve;
  category page "27 LIVE"; prev/next "Question N of 27"; search returns new questions; shared JS
  **102 kB unchanged**, `/q/[slug]` First Load **111 kB unchanged**; canonical/`QAPage`/
  `BreadcrumbList`/titles intact — **no SEO/URL/UI regression**.
- **Reason:** Phase 2 content growth; Python is a flagship category (topic pills + homepage
  "Top 25 Python Questions" already existed with only 2 live questions).
- **Benefits:** More indexable long-tail question pages; a genuinely useful Python track.
- **Complexity:** M (content authoring; no code/architecture change).
- **Files:** new `lib/questions-extra/python.ts`; `lib/questions-extra/index.ts` (import + spread).
- **SEO affected:** Positive (more content) — no URL/schema change.

---

## 🔮 Future Improvements

> **Moved to the Ideas Backlog (2026-07-18).** This roadmap now contains **committed work only**.
> Exploratory / uncommitted ideas — including the former **F1** (visual learning roadmaps),
> **F2** (community features / accounts), **F3** (premium / AI mock interviews / resume review),
> and **F4** (PWA / offline) — now live in [99_IDEAS_BACKLOG.md](./99_IDEAS_BACKLOG.md) with their
> history preserved. When an idea there is approved and scheduled, move it back into this roadmap
> and mark it "Moved to Roadmap" in the backlog.

---

## Recommended Sequencing (for approval)

A low-risk order that front-loads trust + value and defers the large theme migration until
its scope is explicitly approved:

1. **Quick Wins:** QW5 → QW4 → QW1 → QW3 → QW2 (reuse/refactor first, then features).
2. **H1** (browser branding) — high trust, isolated, low risk.
3. **H2** (AI learning section) — the defining feature.
4. **M1, M2, M6, M5** (question-page completeness, internal linking, perf, a11y).
5. **H3 + H4** (theme + palette) — the largest change; do together, contrast-verified.
6. **M3, M4** (SEO titles, maintainability) → then Low Priority / Future items.

> Each item is implemented **one at a time**, verified (TypeScript + build + a11y + SEO), then
> paused for approval before the next — per [13_CONTRIBUTING.md](./13_CONTRIBUTING.md).

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-23 (CE1 — Python content expansion)
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
