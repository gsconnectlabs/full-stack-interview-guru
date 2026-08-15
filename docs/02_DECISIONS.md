# DECISIONS.md

# FullStackInterviewGuru (FIG)
## Product & Engineering Decisions

This document records the important architectural, product, branding, and engineering decisions made for the FullStackInterviewGuru (FIG) project.

It exists to ensure consistency across future development.

Unless explicitly changed, these decisions should be treated as approved project standards.

---

# Decision #001

## Title

Trust Before Revenue

### Status

✅ Approved

### Reason

Users trust platforms that prioritize learning over monetization.

Long-term trust creates long-term growth.

### Implementation

- No aggressive advertisements.
- No intrusive popups.
- No misleading clickbait.
- No forced registration.
- Majority of interview content remains free.

---

# Decision #002

## Title

Content First

### Status

✅ Approved

### Reason

Traffic comes from excellent content.

Not from fancy UI.

### Implementation

Priority order

1. High-quality interview questions
2. Topic clusters
3. Internal linking
4. SEO improvements
5. UI polish

---

# Decision #003

## Title

Brand Identity

### Status

✅ Approved

Official Brand

FullStackInterviewGuru

Public Brand

FIG

### Reason

FIG is short, memorable and suitable for browser tabs, favicon and branding.

The full name provides strong SEO value.

### Usage

Navigation

FIG

Browser Titles

FIG – Java Interview Questions

SEO

FullStackInterviewGuru

---

# Decision #004

## Title

Design Philosophy

### Status

✅ Approved

The website should feel

- Professional
- Minimal
- Calm
- Modern
- Premium

Avoid

- Visual clutter
- Flashy animations
- Heavy gradients
- Distracting effects

---

# Decision #005

## Title

Color System

### Status

✅ Approved

Primary Color

Teal

Secondary Color

Gold / Kaavi

Light Theme

White

Dark Theme

Deep Charcoal

Maintain consistent branding everywhere.

---

# Decision #006

## Title

Theme Behaviour

### Status

✅ Approved

Default Theme

Light

Dark Theme

Automatically follow

prefers-color-scheme

Do not ask users to switch themes manually.

---

# Decision #007

## Title

Question Page Standard

### Status

✅ Approved

Every interview page should contain

- Question
- Short Answer
- Detailed Explanation
- Real-world Example
- Interviewer's Expectation
- Common Mistakes
- Follow-up Questions
- Related Questions
- Difficulty
- Estimated Reading Time
- Last Updated
- Report Issue
- Share
- Copy Link

---

# Decision #008

## Title

AI Learning Section

### Status

✅ Approved

Every question page should include

Continue Learning with AI

Generate optimized prompts for

- ChatGPT
- Gemini
- Claude

Prompt Levels

- Beginner
- Intermediate
- Senior Engineer
- Architect

Include

Copy Prompt

---

# Decision #009

## Title

Learning Path

### Status

✅ Approved

Every page should connect to

- Previous Topic
- Next Topic
- Related Questions
- Topic Roadmap

Avoid orphan pages.

---

# Decision #010

## Title

Roadmaps

### Status

✅ Approved

Create visual learning roadmaps for

- Java
- Spring Boot
- REST API
- AWS
- SQL
- System Design
- JavaScript
- React
- Docker
- Kubernetes

---

# Decision #011

## Title

SEO Protection

### Status

✅ Approved

Never

- Change URLs unnecessarily
- Remove structured data
- Break indexing
- Remove internal links

Always maintain

- Meta tags
- Canonical URLs
- Breadcrumbs
- Q&A Schema
- Open Graph
- Sitemap

SEO must never be sacrificed for UI improvements.

---

# Decision #012

## Title

Performance

### Status

✅ Approved

Target

Lighthouse

95+

Goals

- Fast loading
- Minimal JavaScript
- Optimized fonts
- Optimized images
- Lazy loading

---

# Decision #013

## Title

Accessibility

### Status

✅ Approved

Support

- Keyboard navigation
- Screen readers
- ARIA labels
- Proper contrast
- Focus indicators
- Responsive layouts

Accessibility is mandatory.

---

# Decision #014

## Title

Browser Branding

### Status

✅ Approved

Implement

- favicon.ico
- SVG favicon
- Apple Touch Icon
- Android Icons
- Manifest
- Theme Color

Browser title examples

FIG – Java Interview Questions

FIG – REST API Interview Questions

FIG – Spring Boot Interview Questions

---

# Decision #015

## Title

Animation Policy

### Status

✅ Approved

Animations should be

- Fast
- Minimal
- Purposeful

Avoid

- Large motion
- Slow transitions
- Decorative animations

---

# Decision #016

## Title

Content Philosophy

### Status

✅ Approved

Content must teach concepts.

Never encourage memorization.

Focus on

Understanding

Reasoning

Real-world usage

Interview confidence

---

# Decision #017

## Title

Content Quality

### Status

✅ Approved

Every explanation should answer

- What?
- Why?
- How?
- When?
- Advantages
- Disadvantages
- Real-world usage
- Interview tips

---

# Decision #018

## Title

Current Content Priority

### Status

🚀 Active

Priority 1

- Java Collections
- Java Concurrency
- JVM
- REST API

Priority 2

- Spring Boot
- System Design
- AWS
- SQL

Priority 3

- JavaScript
- React
- Docker
- Kubernetes

---

# Decision #019

## Title

Community Features

### Status

Future Phase

Features

- Login
- Progress Tracking
- Bookmarks
- Practice History
- Daily Challenges
- Community Discussions
- Achievement Badges

Reason

Community comes after trust.

---

# Decision #020

## Title

Premium Features

### Status

Future Phase

Features

- AI Mock Interviews
- Resume Review
- Company Interview Packs
- Personalized Learning Paths
- Premium Analytics
- Offline Downloads

Reason

Revenue should never reduce the quality of the free learning experience.

---

# Decision #021

## Title

Revenue Strategy

### Status

Approved

Priority

1. Premium Membership
2. AI Services
3. Resume Review
4. Affiliate Recommendations
5. Recruiter Services
6. Limited Advertisements

No intrusive ads.

---

# Decision #022

## Title

Engineering Philosophy

### Status

Approved

Prefer

- Simplicity
- Readability
- Reusability
- Maintainability

Avoid

- Overengineering
- Duplicate code
- Premature optimization

---

# Decision #023

## Title

Long-Term Vision

### Status

Approved

Build a platform comparable in professionalism to the world's leading learning platforms while maintaining

- Better readability
- Cleaner UI
- Fewer distractions
- Higher trust
- Better learning experience

---

# Decision #024

## Title

Definition of Success

### Status

Approved

Success is NOT

- More pages
- More traffic
- More ads

Success IS

- Better interview preparation
- Returning users
- User recommendations
- Higher trust
- Better learning outcomes

---

# Decision #025

## Title

Project Motto

### Status

Approved

> Learn Deeply.
>
> Interview Confidently.
>
> Grow Continuously.

---

# Decision #026

## Title

Monetization Strategy Retained

### Status

✅ Approved (Owner-confirmed 2026-07-18)

### Reason

The Amazon Featured Products, Donate section, and AdSense placeholders are intentional and non-intrusive. They align with FIG's long-term monetization strategy.

### Implementation

- Featured Products, Donate/UPI, and AdSense placeholders remain unchanged.
- They must stay non-intrusive and never interrupt reading (per Decision #001 / #021).
- Resolves ROADMAP item L3 — no changes to monetization placement at this time.

---

# Decision #027

## Title

Learning Section Names Retained + Professional Subtitles

### Status

✅ Approved (Owner-confirmed 2026-07-18)

### Reason

The labels "☕ Coffee Chat", "🧠 Mind Map", "⌨ Hands-on", and "🔥 What If" are part of FIG's unique learning experience and branding.

### Implementation

- Do NOT rename or replace these section labels.
- Improvement (presentation only): add professional subtitles / short descriptions beneath the labels where appropriate. Content is unchanged.
- Updates/replaces ROADMAP item L2 (no renaming; subtitle enhancement approved).

---

# Decision #028

## Title

Maintainability Scope — Consolidate Real Duplication, Don't Add Empty Structure

### Status

✅ Approved (Owner-approved M4, 2026-07-19)

### Reason

CLAUDE_INSTRUCTIONS documents a `/hooks`, `/types`, `/constants` folder structure, and ROADMAP M4
called to "introduce them **where they add value**." Engineering philosophy (DECISIONS #022)
forbids over-engineering. Creating empty/token folders to match a template adds complexity without
benefit; consolidating genuine duplication does.

### Implementation

- **Did:** extracted the duplicated category card into a reusable **`TopicCard`** (server component)
  used by the homepage + candidate index; introduced the **`/hooks`** folder with a real hook,
  **`useTemporaryFlag`**, extracted from the identical "copied" pattern in `CopyButton`/`ShareButton`.
- **Deferred (intentionally):**
  - **`/types`** — `lib/types.ts` already serves as the shared types module; relocating it is churn
    across its import sites with no behavior or maintainability gain. Revisit only if types grow
    enough to warrant a dedicated top-level folder.
  - **`/constants`** — no genuine cross-file constant exists today; an empty folder would be
    over-engineering. Introduce it when a real shared constant appears.
  - **`SearchBar` → `SearchBox` rename** — the component is already internally consistent; a rename
    is pure churn. The CLAUDE_INSTRUCTIONS example list is illustrative, not binding on the name.
- **Rule going forward:** add a shared folder/abstraction **when there is real content for it**, not
  to satisfy a template. Any such refactor must be behavior-preserving (verified by TS + build).

---

# Decision #029

## Title

Tertiary-Text Contrast (slate-500) Deferred to the H3/H4 Theme-Token Migration

### Status

✅ Approved (M5 accessibility audit, 2026-07-19)

### Reason

The M5 audit measured contrast across the (dark-only) UI. **Primary and secondary text passes WCAG
AA comfortably** (slate-300 ≈ 13:1, slate-400 ≈ 7.3–7.7:1). **Tertiary muted `slate-500` labels**
(taglines, copyright, small meta labels) are ≈ **4.1:1** — below AA 4.5:1 for normal text, though
above 3:1 (AA for large text). These are supplementary, not essential content.

ROADMAP M5 explicitly calls for AA contrast "**especially after the theme work**," and the Ideas
Backlog already carries a "Full WCAG AA audit after the theme migration." A site-wide `slate-500`
recolor now would be a broad visual change (the muted tone is part of the current aesthetic) and
would preempt the token-based **H3/H4** migration, where the whole palette is re-tokenized and must
be AA-verified in both light and dark.

### Implementation

- **Now (M5):** shipped the structural/ARIA/focus fixes; primary/secondary contrast already passes AA.
- **Deferred to H3/H4:** raise `slate-500`-class tertiary text to meet AA 4.5:1 as part of the CSS
  design-token migration, verified in both themes. Do **not** do an ad-hoc global recolor before then.
- This is a scope decision, not a dismissal — the item is tracked and must be resolved in H3/H4.

---

# Decision #030

## Title

System-Font Stack Retained — `next/font` Intentionally Not Introduced

### Status

✅ Approved (M6 Lighthouse verification, 2026-07-19)

### Reason

ROADMAP M6 lists "optimize fonts (`next/font`)" as a candidate task. The audit found the app already
uses a **system-font stack** (`--font-sans: ui-sans-serif, system-ui, …` in `globals.css`) with **no
web fonts, no Google Fonts, and no `@font-face`**. System fonts are already optimal for Core Web
Vitals: **zero font download, zero render-blocking, zero layout shift** from font swap. Lighthouse
Performance is **100** with **CLS 0** / **TBT 0 ms**.

Introducing `next/font` (even self-hosted) would **add** a font file to download and parse — a net
regression for performance and CWV — for a purely stylistic change the design does not call for.

### Implementation

- Keep the system-font stack; do **not** add `next/font` or any web font.
- If a brand web font is ever desired, treat it as a deliberate design decision (with its own
  approval) and load it via `next/font` with subsetting + `display: swap`, then re-verify CWV.
- This supersedes the "optimize fonts via `next/font`" suggestion in ROADMAP M6.

---

# Decision #031

## Title

AdSense Readiness — Env-Driven Client ID, Legal Pages, and Honest Links (No Fake Functionality)

### Status

✅ Approved (Post-Phase-2 Compliance & AdSense Readiness release, 2026-07-19)

### Reason

Preparing for Google AdSense approval requires legal/company pages, discoverable footer navigation, and
the AdSense script present site-wide. These must be added **as a production maintenance release** without
redesigning the UI, changing existing UX, or breaking SEO/performance (Trust Before Revenue, #001).

### Implementation

- **AdSense publisher ID is config, defined once in `lib/site.ts`** (`adsenseClientId`). The **production
  account `ca-pub-8326504635108554`** is the committed default, with `NEXT_PUBLIC_ADSENSE_ID` as a per-env
  override. A publisher ID is **not a secret** — it renders in the page source of every AdSense site — so
  committing it (like `siteUrl`/`upiId` already are) guarantees the snippet is present on every page for
  approval, independent of any dashboard setting. Owner-supplied on 2026-07-19. The existing
  `components/Analytics.tsx` loader (once, on every page via the root layout, `async`/`afterInteractive`,
  `crossOrigin="anonymous"`, non-blocking) plus a distinct `google-adsense-account` verification `<meta>`
  in `app/layout.tsx` (no duplication) both read this single value. **Do not commit GA IDs, secrets, or
  API keys the same way** — only public identifiers.
- **Legal pages are required and permanent:** `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer` —
  static SSG, single `<h1>`, full metadata + `BreadcrumbList`. The **Privacy Policy must describe Google
  AdSense cookie/DoubleClick usage and opt-outs**; these sections must not be removed.
- **No fake functionality / no broken links:** the contact form has no dedicated backend — it POSTs to
  `NEXT_PUBLIC_FEEDBACK_ENDPOINT` when set, else falls back to `mailto:` (same pattern as `FeedbackForm`).
  The requested footer **"Blog"** link was **omitted** because no blog route exists and building one is
  out of scope — adding a dead link would violate the "every link works" rule. "Topics" is served by the
  retained Browse Topics grid.
- **Governing law (Terms):** set to **India** (owner is India-based — UPI/INR/IST). Revisit if the
  operating jurisdiction differs.
- **Ad placement is preparation-only:** future ad slots are marked with developer comments (after H1/intro,
  below content); **no live display ads** are inserted, preserving **CLS = 0** and the reading experience
  (#001 / #021 / #026).

---

# Decision #032

## Title

Google Analytics 4 via the Official `@next/third-parties` Integration — GA ID Stays Env-Driven

### Status

✅ Approved (GA4 integration & project-standards release, 2026-07-30)

### Reason

GA4 was already scaffolded as a **manual gtag loader** in `components/Analytics.tsx` (env-gated,
inactive with no ID set). Next.js 15 ships the **official `@next/third-parties/google` integration**,
which is the recommended way to load Google Analytics on the App Router: it injects `gtag.js` once,
tracks client-side route changes as `page_view` events, and removes hand-maintained inline script.
Adopting it reduces custom code and aligns with the framework's supported path, at the cost of a single
first-party dependency (`@next/third-parties`, versioned in lockstep with `next`).

The GA **measurement ID** (`G-…`) is public (it renders in page source), but per **DECISIONS #031**
GA IDs are **not committed** as defaults the way the AdSense publisher ID is. This release preserves
that rule: the ID is supplied per-environment via `NEXT_PUBLIC_GA_ID` (Vercel / `.env.local`), so GA
stays **off until an ID is set**. #031 is unchanged, not superseded.

### Implementation

- **Dependency:** `@next/third-parties@15.5.19` (matches `next`), added to `package.json`.
- **Loader:** `components/Analytics.tsx` renders `<GoogleAnalytics gaId={gaId} />` (from
  `@next/third-parties/google`) **only when `gaId` is set** — replacing the manual `gtag.js` +
  `gtag('config', …)` `<Script>` block. The manual block is fully removed, so there is **no duplicate
  GA initialization**. GA4 anonymizes IP by default, so the old explicit `anonymize_ip` flag is dropped
  (no behavior change).
- **Config:** new `gaId` export in `lib/site.ts` = `process.env.NEXT_PUBLIC_GA_ID || ""` — **no committed
  default** (contrast `adsenseClientId`, which does have one). Centralizes config next to `adsenseClientId`.
- **AdSense unchanged:** the `adsbygoogle.js` loader in the same component and the `google-adsense-account`
  meta in `app/layout.tsx` are untouched — GA and AdSense remain distinct and non-duplicating.
- **Events:** **no custom GA4 events** are implemented in this release. Planned events (question views,
  search, category selection, feedback, donation/affiliate/outbound clicks, scroll depth, engagement)
  are catalogued in `docs/14_ANALYTICS.md` and `CLAUDE.md`, pending separate owner approval.
- **Verified in-browser** (dev, `NEXT_PUBLIC_GA_ID` set): exactly **one** `gtag/js?id=G-…` script, `gtag`
  is a function, `dataLayer` populated, **zero GTM tags**, AdSense loader still present; no hydration
  warnings, no console errors.

### Owner follow-up

- Set `NEXT_PUBLIC_GA_ID=G-Q6XEJD7V69` in Vercel (Production/Preview) to activate GA on the live site.

---

# Decision #033

## Title

Per-Page SEO Overrides (`seoTitle` / `seoDescription` / `heading`) for High-Impression Pages

### Status

✅ Approved (Owner-directed 2026-07-31 — GSC CTR optimization)

### Reason

Google Search Console shows a handful of question pages earning high impressions but low CTR. The
default title (`FIG – {question}`), the derived meta description, and the conversational `<h1>` are
tuned for the on-site learning experience, not for search-result CTR. Owner supplied hand-written,
keyword-led title / description / H1 copy for the top three pages (REST Idempotency, Two Sum, Amazon
DynamoDB). We needed a way to apply that copy **without changing URLs, layouts, or structured data**,
and without regressing the 278 pages that should keep the branded template.

### Implementation

- **Three optional fields on `Question` (`lib/types.ts`):** `seoTitle`, `seoDescription`, `heading` —
  all optional, so every existing page is unaffected (append-only content model, per DECISIONS #028).
- **`app/q/[slug]/page.tsx`:**
  - `generateMetadata` emits `title: { absolute: q.seoTitle }` when `seoTitle` is set — this **bypasses
    the root `"FIG – %s"` template** (the supplied titles carry their own branding), otherwise it falls
    back to `q.question` (template still applies). `seoDescription` overrides the derived description;
    both `openGraph.title`/`description` follow the same fallbacks.
  - The visible `<h1>` renders `q.heading ?? q.question`.
- **Structured data unchanged:** the `QAPage` JSON-LD `name`, the ☕ Coffee Chat block, and the Report-
  issue context all keep using the real conversational `question`. `heading` is presentation-only.
- **Relationship to the branded-title convention (ARCHITECTURE "SEO Implementation"):** the `"FIG – %s"`
  template remains the **default** for all pages; `seoTitle` is a deliberate, per-page opt-out for
  SEO-critical pages only. Not a blanket change.
- **Internal links:** added via the existing `related` slug mechanism (renders as Related Questions
  cards) — only to pages that already exist. Requested targets with **no existing page** (Spring Boot
  REST, Time Complexity, Amazon CloudWatch) were intentionally **not** linked, to avoid dead links
  (No-dead-links rule, #026). Candidates for future content — logged in `99_IDEAS_BACKLOG.md`.

### Scope

Applied to exactly three pages this session: `/q/rest-idempotency`, `/q/two-sum`,
`/q/dynamodb-single-table`. Further pages require separate owner approval before the same fields are
added.

---

# Decision #034

## Title

Advertise Only Substantial Categories — Live Counts, Not Aspirational Catalog Counts

### Status

✅ Approved (Owner-directed 2026-08-01 — AdSense "Low value content" remediation)

### Reason

AdSense rejected the site with **"Low value content."** Root cause: the `count` field in
`lib/categories.ts` is an **aspirational catalog target**, not the number of published questions, and it
was shown verbatim across the browse surface. The site advertised **1,970 questions across 23
categories** while only **262** existed, and **12 of 23 categories had fewer than 10 live questions**
(Azure/GCP had **0**, Coding Challenges advertised **200** with **1** live). Clicking such a card led to
an empty or near-empty page — and the category page even rendered an explicit "questions are being
written" placeholder. To reviewers (and search engines) this reads as thin / misleading / "under
construction" content. We needed the public surface to reflect **real, live content** without deleting
data or breaking any existing URL, breadcrumb, or the individual (genuinely valuable) question pages
that happen to live in otherwise-thin categories.

### Implementation

- **New `lib/category-visibility.ts`** — single source of truth for visibility:
  `MIN_LIVE_TO_LIST = 10`, `liveCount(id)`, `isListed(id)`, `listedCategories` (catalog order preserved),
  `totalLiveQuestions`. Live counts derive from `questionsByCategory`, so they stay correct automatically
  as content grows (no manual bookkeeping; the aspirational `count` field is left untouched as data).
- **Browse surface shows live counts and only listed (≥10) categories:** home metrics + Explore Topics
  grid (`app/page.tsx`), candidate index (`app/candidate/page.tsx`), `TopicCard` chips, and the footer
  topic links now use `listedCategories` / `liveCount` — **11 categories**, real per-card counts.
- **Sitemap (`app/sitemap.ts`):** category URLs limited to `listedCategories`; all question routes stay.
- **Category route (`app/candidate/[category]/page.tsx`):** `generateStaticParams` generates only
  categories with **≥1 live question** and `dynamicParams = false`, so **empty** categories (Azure/GCP)
  return **404** instead of a placeholder. Below-threshold-but-non-empty categories still render (so
  breadcrumbs from their live question(s) resolve) but are **`noindex, follow`**, and their header shows
  the real live count. The "questions are being written" empty state is now unreachable (kept only as a
  defensive fallback).
- **Question page sidebar (`app/q/[slug]/page.tsx`):** "More {category}" card shows the live count
  (pluralized), not `count`.
- **Not changed:** `lib/categories.ts` (the `count`/`topics` data is retained as the catalog target),
  Interviewer mode's tech picker (it generates kits, not crawlable content pages), and all question
  slugs/URLs. Append-only, non-destructive (per #028); no URL changes (#SEO rules).

### Scope

Public browse/index surface only. Re-populating the delisted categories (Docker, Kubernetes, Git, Linux,
AI Basics, Prompt Engineering, Behavioral, Coding Challenges, Java 8+, Advanced Java, Azure, GCP) past
the threshold will re-list them automatically — no code change needed. Threshold (`MIN_LIVE_TO_LIST`) is
a single tunable constant. Requesting the AdSense re-review is an owner action **after** this deploys and
Google re-crawls.

---

# Decision #035

## Title

FIG Store — New `/store` Section, First Product (Free Java Ebook), First Custom GA4 Event

### Status

✅ Approved (Owner-directed 2026-08-09)

### Reason

FIG needed an optional, trust-first surface for structured deeper resources without weakening the
"free, no dark patterns" core. The first real resource — **"Top 50 Java Interview Questions & Answers —
Free Edition"** (a free PDF ebook distributed via Gumroad, based on FIG's free Java Q&A content) — needed
a home that feels native to FIG, not a bolted-on storefront.

### Implementation

- **New route `/store`** (`app/store/page.tsx`) — static, server-rendered, added to `sitemap.ts`/`robots.ts`
  automatically (no exclusions). Added to `Navbar` (always-visible, matching `Candidate`/`Interviewer`) and
  `Footer` (Resources group).
- **Data-driven catalog:** `lib/store.ts` exports `StoreProduct[]` — appending a future product requires
  no page/component changes (mirrors the `lib/products.ts` pattern, DECISIONS precedent). The Gumroad URL
  lives in exactly one place: the product's `gumroadUrl` field.
- **New components:** `StoreProductCard` (server) renders the product; `GumroadCtaButton` (client island)
  is the only client code — it fires the GA event and opens the real Gumroad URL in a new tab.
- **First custom GA4 event:** `gumroad_cta_click` (`{ product, destination }`), fired via
  `sendGAEvent` from `@next/third-parties/google` (the same package already loading GA). This is the first
  event to graduate from the "planned" list in [14_ANALYTICS.md](./14_ANALYTICS.md) — approved explicitly
  for this feature, not a blanket approval for the rest of the planned list.
- **Product is free (₹0):** priced and labeled as **Free**, never as a discount or paid item. No price,
  reviews, ratings, sales numbers, or testimonials are shown — none exist yet, and none are invented.
  Cover image sourced from the real ebook asset, copied to `public/store/`.
- **Future scalability:** the Store page lists planned resource categories (Java, Microservices, SQL,
  System Design, AWS, Interview Preparation) as text chips only — explicitly not fake/placeholder products.
- **Not changed:** existing routes, question content, SEO URLs, or the "off until `NEXT_PUBLIC_GA_ID` is
  set" analytics behavior (DECISIONS #031/#032) — `gumroad_cta_click` inherits the same off-by-default gate.

---

# Decision #036

## Title

FIG Teal + Gold Visual Identity — Token-Level Recolor + Editorial Serif Headings

### Status

✅ Approved (Owner-directed 2026-08-09)

### Reason

Realize the long-planned Teal + Gold palette (PROJECT_CONTEXT, DECISIONS #005) as a distinctive,
editorial developer-brand identity anchored on the real FIG logo — replacing the generic
indigo/glassmorphism "AI SaaS" look (colored glow shadows, heavy backdrop-blur, rainbow per-category
gradients, cool slate neutrals) without a functional redesign. Brand colors were **pixel-sampled from
the actual logo asset** (`public/FIG-logo-transparent.png`) rather than guessed: disc ≈ `#00424e`,
lettering ≈ `#eec353`.

### Implementation

- **Token-level recolor (`tailwind.config.ts`)** — three existing color keys re-hued in place so every
  existing `brand-*`/`ink-*`/`slate-*` utility class site-wide inherited the new palette with **no
  per-component renaming**: `brand` indigo → deep teal; `ink` navy-black → teal-tinted dark neutrals;
  `slate` cool gray → warm neutral (stone-based), improving long-form readability per the editorial goal.
  New `gold` scale added, used only as a restrained signature accent (Navbar wordmark "I", one hero
  gradient) — explicitly **not** applied to the Store "Free" badge or any large surface/body text.
- **Editorial typography** — system serif stack (`--font-serif`: Georgia/Iowan Old Style/Palatino
  fallback chain, **no webfont/next-font dependency**) applied only to question-page H1s, question
  section headings (☕🧠⌨️🔥…), and the home/Store H1s. Navigation, buttons, chips, and technical UI
  stay sans-serif.
- **Reduced "generic SaaS" signatures:** removed `backdrop-blur` from `.card` and `AmazonProductCard`
  (kept only on the sticky Navbar — functionally justified); removed colored glow shadows
  (`shadow-brand-900/50` etc.) from `.card-hover`, `.btn-primary`, `AmazonProductCard`; `rounded-2xl` →
  `rounded-xl` across cards/search/product-card; body background reduced from a dual indigo+sky ambient
  glow to a single, low-opacity teal wash.
- **Category accents (`lib/categories.ts`):** all 22 per-category icon gradients (previously a rainbow
  of unrelated hues — orange, violet, sky, pink, indigo…) remapped to a small rotating set of
  teal-family combinations (2 of 22 use the gold accent, deliberately sparse).
- **Preserved unchanged (by design):** `DifficultyBadge` (emerald/amber/rose semantics), `CodeBlock`
  (developer/terminal character), the Store "Free" badge (stays emerald, never gold), all routes,
  content, analytics, and SEO metadata.
- Verified: TypeScript clean; production build green (**330 pages**, shared First Load JS **102 kB
  unchanged**); contrast re-checked programmatically (body/secondary/tertiary text **7–15:1** on the new
  background; the one pre-existing borderline tertiary-label gap, DECISIONS #029, is unchanged — not
  worsened, still deferred to a future pass).

### Scope note

This is the dark-only palette half of ROADMAP **H4**; **H3** (light-default + `prefers-color-scheme`)
remains a separate, unstarted item — light-mode token values are not authored here.

---

# Decision #037

## Title

Donate Removed From Primary Navigation (Page Retained), "Store" Renamed to "Guru's Picks", New Optional Per-Question "Real Talk from Guru" Field

### Status

✅ Approved (Owner-directed 2026-08-09)

### Reason

The owner wanted the Donate CTA out of the primary navigation surfaces (Navbar, Footer, homepage) without
losing the underlying page or any donate configuration/code — a reversible de-emphasis, not a removal.
Separately, "Store" was judged too generic for a section meant to carry Guru's personal, 16-years-of-
banking-domain-interviews credibility — it needed a distinct, non-generic identity without a URL change.
Finally, question pages needed a place for Guru's own commentary, distinct from the existing "😂 Real
World" (how developers use it on the job) and "🔥 What If?" (probing follow-up) sections.

This **updates the navigation implementation of DECISIONS #026** (Donate is no longer promoted in
Navbar/Footer/homepage, though the monetization strategy itself — Donate as a channel — is unchanged and
the page/config are fully intact) and **renames the public label introduced in DECISIONS #035** (the
`/store` route, its data model, and its product catalog are unchanged — only the display name changes).

### Implementation

- **Donate:** unlinked from `Navbar.tsx`, `Footer.tsx`'s Support group, the homepage CTA card (now a
  "Guru's Picks" teaser instead of an empty gap), and `/contact`'s quick-links row (grid narrowed from 3
  to 2 columns, now Feedback + About only). `app/donate/page.tsx`, `components/UpiQrCard.tsx`, and every
  donate-related export in `lib/site.ts` (`donateOptions`, `hasDonateOptions`, `upiId`, `upiPayUri`, the
  `NEXT_PUBLIC_*` donate env fallbacks) are **unchanged and still functional** — the route still resolves
  and is still in `sitemap.ts`. Nothing was deleted.
- **"Store" → "Guru's Picks":** display-label-only rename across `Navbar.tsx`, `Footer.tsx`, and
  `app/store/page.tsx` (breadcrumb, chip, `<h1>`, metadata title/description/OG title). The **route stays
  `/store`** — no redirect, canonical, or sitemap change (per the "no item requires a URL change" rule).
  A short personal-framing line ("16 years in banking-domain interviews…") was added under the H1 via a
  single editable constant (`GURU_INTRO`), not inlined in JSX. A restrained premium visual treatment —
  new `.card-premium` utility (`globals.css`), built from the existing `gold` token per DECISIONS #036's
  "signature accent only" rule (no new colors) — was applied to the featured product card and the new
  homepage teaser card only; the Store "Free" badge stays emerald, unchanged (per #036). `lib/store.ts`
  (`storeProducts`, pricing, `gumroadUrl`) is untouched.
- **New `Question.guruTake?: string`** (`lib/types.ts`) renders as an optional "🗣️ Real Talk from Guru"
  section on `/q/[slug]`, shown only when set (no placeholder copy), positioned after the unmodified
  "😂 Real World" section. This session adds the field and rendering only; no existing question object
  was populated — content authoring is a deliberately separate future pass (tracked in
  `99_IDEAS_BACKLOG.md`).
- **Not changed:** all URLs, canonicals, `QAPage`/`BreadcrumbList` structured data, `sitemap.ts`/
  `robots.ts` output (aside from the label text now emitted for the `/store` breadcrumb's `name`, which
  is expected — labels are explicitly in scope), and every existing question's content fields.

---

# Decision #038

## Title

Additive `table` Mind Map Block Type + Wired-Up `code` Block Rendering (REST Idempotency Content Depth Pass)

### Status

✅ Approved (Owner-directed 2026-08-15 — content/SEO/interview-depth improvement for `/q/rest-idempotency`)

### Reason

`/q/rest-idempotency` was earning ~106 impressions / 0 clicks / avg. position ~48.6 in Search Console —
thin content, incomplete search-intent coverage. The owner requested a full depth pass: an HTTP-method
comparison (Method / Idempotent? / Safe? / Explanation — 4 columns), a Safe-vs-Idempotent explainer, a
DELETE+404 interviewer trap, and a production Idempotency-Key section with multiple HTTP/ASCII examples.
`AnswerBlock` (`lib/types.ts`) only supported `"text"` and `"kv"` (2-column key→value) inside `mindMap` —
no way to render a genuine multi-column table, and only one code sample per question via `handsOn`.
Separately, `AnswerBlock.type` has declared `"code"` in its union since the Phase 1 schema, but
`MindMapBlock` (`app/q/[slug]/page.tsx`) never actually rendered that case — a dead branch, not a design
choice. FAQPage schema was considered (the owner's brief mentioned an "FAQ" section) but
`99_IDEAS_BACKLOG.md` already logs `FAQPage` structured data as an unapproved **Idea** — per the
project's existing-decisions-first process and the brief's own "don't add schema for its own sake" rule,
it was **not** added here; `QAPage` is unchanged.

### Implementation

- **`lib/types.ts` — `AnswerBlock`:** `type` union extended to `"text" | "code" | "kv" | "table"`; added
  optional `headers?: string[]` and `tableRows?: string[][]` for the table variant. Purely additive — the
  existing `rows: {k,v}[]` (`kv`) shape is untouched, and every other question's `mindMap` array (still
  `text`/`kv` only) is unaffected.
- **`app/q/[slug]/page.tsx` — `MindMapBlock`:** added a `type === "table"` case rendering an accessible
  `<table>` (`scope="col"` headers) wrapped in `overflow-x-auto` (matches the no-horizontal-page-scroll
  pattern `CodeBlock` already uses for its `<pre>`) and styled with the existing `card`/border-token
  system — no new design language. Added the `type === "code"` case, rendering the already-imported
  `CodeBlock` component — this fixes the dead branch rather than introducing new UI, and lets a question
  carry multiple code/ASCII examples inside the Mind Map section instead of only the single `handsOn`
  slot.
- **`lib/questions.ts` — `rest-idempotency` (only this slug touched):** full content rewrite in place —
  `seoTitle`/`seoDescription`/`heading` refreshed (same mechanism as DECISIONS #033, same slug/URL),
  `shortAnswer` now states the precise definition (avoids the "POST, PATCH = Not Idempotent"
  oversimplification the brief explicitly flagged as wrong), one `table` block (the 4-column method
  comparison), five `code` blocks (PUT/POST examples, the timeout-retry ASCII flow, the
  `Idempotency-Key` header example, the key-lookup flowchart), a `kv` block for the 6-step
  Idempotency-Key server flow, `whatIf` repurposed for the DELETE+404 "still idempotent?" interviewer
  trap, `realWorld` repurposed for the banking/payment retry scenario, refreshed
  `interviewerExpectation`/`commonMistakes`/`bestPractices`/`followUps` (10 questions, unanswered —
  matches the sitewide `followUps` convention; answers live in the sections above instead of a new
  paired Q&A structure), `tags` added for search, `updated: "2026-08-15"`, and `related` recurated to
  verified-existing slugs (`idempotency-keys`, `put-vs-patch`, `rest-status-codes`,
  `consumer-idempotency`, `saga-pattern`, `design-payment-system`).
- **Not changed:** the question's `slug` (URL unchanged), the conversational `question` text (`QAPage`
  `name` + ☕ Coffee Chat block), `difficulty`/`experience`/`askedIn`, and every other question in the
  bank.

### Verified

`npx tsc --noEmit` clean; `npm run build` green — **355 pages** (unchanged, no route added/removed),
shared First Load JS **102 kB unchanged**. In-browser (dev): title/meta description/canonical/H1 correct,
table and all five code blocks render, `QAPage` + `BreadcrumbList` JSON-LD valid (no `FAQPage` added), all
6 `related` links resolve 200, no console/hydration errors.

---

# Decision #039

## Title

SEO On-Page Improvement Cycle — 9 Pages, Using REST Idempotency as a Quality Benchmark (Not a Template)

### Status

✅ Approved (Owner-directed 2026-08-15 — Search Console opportunity pages)

### Reason

Owner supplied 9 target pages with specific Search Console queries (`/q/hashmap-resize-load-factor`,
`/q/dynamodb-partition-key`, `/q/dynamodb-single-table`, `/q/two-sum`, `/q/dynamic-proxy`, `/environment`,
`/q/what-is-json`, `/candidate/json`, `/`), instructing that the already-improved `/q/rest-idempotency`
(DECISIONS #038) be used as a **content-quality benchmark** — not copied structurally onto pages of a
different type. Each page's existing page type (interview question, category collection, developer
utility, homepage) had to be identified and preserved before any change.

### Implementation

- **Question pages** (`hashmap-resize-load-factor`, `dynamodb-partition-key`, `dynamodb-single-table`,
  `two-sum`, `dynamic-proxy`) — content-only edits within the existing `Question` schema, no new fields.
  Reused the `table` block type from DECISIONS #038 exactly three times, only where a genuine multi-column
  comparison helps (HashMap capacity/threshold progression; DynamoDB partition-key-vs-sort-key roles;
  a single-table-design PK/SK worked example) — not added to the other pages, since a table wasn't the
  right fit there. `seoTitle`/`seoDescription`/`heading` added or refreshed on `hashmap-resize-load-factor`
  and `dynamodb-partition-key` (had none before) and retargeted on `dynamodb-single-table` (its old title,
  "Amazon DynamoDB Interview Questions & Answers (2026)", didn't mention single-table design at all,
  the actual target query). **`two-sum` and `dynamic-proxy` kept their existing, already-indexed titles
  unchanged** — both already led with the target keyword and already ranked; per `05_ROADMAP.md`'s title-
  change caution ("SEO-sensitive... avoid churn, preserve primary keywords"), only their content
  (`followUps`/`commonMistakes`/`bestPractices`/`tags`, missing on `two-sum`; two extra `followUps` on
  `dynamic-proxy`) was deepened. `what-is-json` was reviewed and left unchanged — already at benchmark
  depth from the CE2 JSON batch (DECISIONS #033-style overrides, full FIG schema already present).
- **`/candidate/json` (category collection page, not a `Question`):** the category listing route
  (`app/candidate/[category]/page.tsx`) generates its title/description from a **shared template**
  (`${cat.name} Interview Questions` / `${cat.name} interview questions and answers — ${cat.blurb}
  ${live} curated questions.`) used by all 19 categories — deliberately **not** special-cased for one
  category. Instead, `lib/categories.ts`'s `json` category `blurb` was rewritten (still matching every
  sibling category's terse-noun-phrase style) to cover syntax/data-types/parsing/serialization/schema/
  JSON-vs-XML, which flows into the description automatically. Zero code/architecture change.
- **`/environment` (developer utility page, not an interview page):** reviewed against its actual
  existing purpose (version-check commands + config guides) — title and description already precisely
  match that utility intent. **Left unchanged** — forcing interview-page framing or invented keywords
  onto it would misrepresent the page, which the brief explicitly warned against.
- **Homepage `/`:** `app/page.tsx`'s `metadata` previously had no `title` (inherited the root layout's
  `"FIG – %s"` templated default, so the rendered title led with "FIG –" rather than the brand phrase).
  Added an explicit `title: { absolute: "Full Stack Interview Guru — Interview Tomorrow? Start Here." }`
  — the exact same absolute-title bypass technique DECISIONS #033 established for `Question.seoTitle`,
  applied here at the route-metadata level since the homepage isn't a `Question`. Reuses copy already
  approved for the homepage's own Open Graph title (no new claims). Description left inherited (already
  brand-appropriate); no interview content, no keyword stuffing, no UX/conversion structure touched.
- **Internal linking:** added a reciprocal `related` link between `hashmap-resize-load-factor` and
  `two-sum` (both already existed; genuinely related via the HashMap-for-lookup pattern). DynamoDB
  partition-key ↔ single-table and the JSON question cluster were already bidirectionally linked —
  no change needed there. No placeholder/dead links introduced.
- **Not added:** `FAQPage` or any new structured-data type — none of these 9 pages' architecture
  supports it today (same `99_IDEAS_BACKLOG.md` status as DECISIONS #038); the existing `QAPage` /
  category-page metadata / homepage `WebSite`+`Organization` schema is unchanged.

### Verified

`npx tsc --noEmit` clean; `npm run build` green — **355 pages** (unchanged, no route added/removed),
shared First Load JS **102 kB unchanged** (homepage `/` +2 kB from the extra title metadata object,
immaterial). In-browser (dev): all 9 pages return 200 with the intended title/H1/description; all 3
new `table` blocks render (headers verified); `QAPage`+`BreadcrumbList` JSON-LD valid on question
pages; all cross-linked slugs resolve 200; no console/hydration errors.

---

# End of Document

This document should be updated whenever a major architectural or product decision is approved.

All AI assistants and future contributors should follow these decisions unless explicitly instructed otherwise.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-08-15 (Decision #039 — SEO on-page improvement cycle, 9 pages)
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M