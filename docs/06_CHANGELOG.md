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

### Fixed (Floating ebook CTA reappearing after client-side navigation, DECISIONS #043) — 2026-08-21
**Released to production 2026-08-21** (commit `5c98780`, pushed to `main`; Vercel deploy succeeded —
GitHub commit status "Vercel: Deployment has completed"; post-deploy smoke test on
https://fullstackinterviewguru.com/store passed — title, breadcrumb, and hero all show the new "Ebook
Store" branding live). This single commit ships all three of DECISIONS #041/#042/#043 together — the
floating CTA, the Guru's Picks → Ebook Store rebrand, and this navigation bug fix were reviewed and
approved as one unit before commit.

Found during a fresh validation pass: `EbookFloatingCta` is mounted once in the root layout, so its
`visible` state persisted across Next.js client-side route changes. Clicking the CTA wrote
`sessionStorage` and fired `ebook_cta_click` but never reset `visible` — so the card kept showing on
`/store` right after the click, and then resurfaced again (no wait, no fresh impression) on whatever
page the visitor navigated to next. Dismiss was unaffected (`handleDismiss` already reset `visible`).

- **`components/EbookFloatingCta.tsx`** — `handleClick` now calls `setVisible(false)` (mirroring
  `handleDismiss`); render condition also defensively checks `pathname.startsWith("/store")` so the
  card can never render on the destination page regardless of `visible` state.
- Verified via real `Link` clicks (not full-page reloads, which is how earlier passes missed this):
  home → CTA click → `/store` (0 CTA elements, was showing) → `/candidate` (0 CTA elements, was
  resurfacing). `npx tsc --noEmit` clean; `npm run build` green (355 pages, 102 kB shared JS).

### Changed (Guru's Picks → Ebook Store, floating CTA refresh, DECISIONS #042) — 2026-08-21
Repositioned `/store` around the one product it already had — the free ebook — instead of a generic
"Guru's Picks" multi-item framing. Same route (`/store`, no URL/SEO change), same Gumroad download
flow, same single `storeProducts` entry — no product/content removed.

- **`app/store/page.tsx`** — new hero rendered directly from `storeProducts[0]`: the ebook's real
  title as the page's one `<h1>`, real subtitle + audience copy as the value proposition, `🆓 Free` /
  `📘 Ebook Store` chips, and a `GumroadCtaButton` up top. Existing trust-positioning cards, the full
  `StoreProductCard` detail section, and the "More resources are on the way" teaser are all preserved,
  with copy reworded away from "Guru's Picks" phrasing. Metadata title/description/OG updated.
- **`Navbar`, `Footer`, homepage promo card (`app/page.tsx`)** — label changed from "Guru's Picks" to
  "📘 Ebook Store" everywhere it appeared; homepage card copy/CTA updated to match.
- **`EbookFloatingCta`** — desktop copy changed to "Get our FREE Ebook" / "Prepare smarter for your
  next interview →"; now shows the ebook's real cover thumbnail (via `next/image`) instead of a
  generic emoji, with a new one-shot `cta-settle` entrance keyframe (`tailwind.config.ts`,
  `motion-safe:` only, `animation-iteration-count: 1`) — pops in once, then holds static. No GIF added
  (none exists; CSS achieves the same effect with no new asset/layout-shift risk). 10s delay, session
  cap, never-shown-on-`/store`, and mutually-exclusive desktop/mobile variants are unchanged from
  DECISIONS #041.
- `npx tsc --noEmit` clean; `npm run build` green (355 pages, shared First Load JS unchanged at 102 kB).

### Added (Free Ebook floating CTA, DECISIONS #041) — 2026-08-21
Small, dismissible floating CTA inviting visitors to the free ebook on `/store` — primary goal is
`/store` traffic, not aggressive conversion; content always comes first.

- New `components/EbookFloatingCta.tsx` (client island), mounted once in `app/layout.tsx`. Appears
  10s after page load, bottom-right, on every page except `/store` itself. Desktop/tablet: compact
  chat-style card ("Preparing for your next interview? Get our FREE Ebook →"). Mobile: smaller
  single-line pill ("📘 Free Ebook →") — the two variants are mutually exclusive via `sm:` breakpoints,
  never shown together. Links to the existing `/store` route; no duplicate ebook page/flow created.
- Session-scoped frequency cap via `sessionStorage` (`fig-ebook-cta-status`): dismissing or clicking
  suppresses it for the rest of the session. No backend, no new dependency.
- Reuses the existing `.card-premium` gold-accent style and `animate-fade-up` entrance keyframe
  (skipped under `prefers-reduced-motion` via `motion-safe:`); no pulsing, sound, backdrop, or modal
  semantics — page stays fully scrollable/readable underneath it.
- Three new GA4 events (`ebook_cta_impression`, `ebook_cta_click`, `ebook_cta_dismiss`) via the
  established `sendGAEvent` pattern — see [14_ANALYTICS.md](./14_ANALYTICS.md).
- No existing routes, content, or SEO URLs changed. `npx tsc --noEmit` clean; `npm run build` green
  (355 pages, shared First Load JS unchanged at 102 kB).

### Fixed (QAPage structured-data enrichment, DECISIONS #040) — 2026-08-16
Owner-directed fix for Search Console's Q&A "Improve item appearance" report (all optional
enhancement rows, not errors — every page stayed valid/indexable throughout).

- **`app/q/[slug]/page.tsx`** — `dateModified` now emits a full ISO-8601 datetime with an explicit
  UTC offset (`${date}T00:00:00.000Z`) instead of a bare `YYYY-MM-DD` string, fixing the "missing
  timezone" / "invalid datetime value" rows (5 items each). Added `mainEntity.text` (mirrors `name`,
  per Google's `Question` guidance), `mainEntity.author` and `acceptedAnswer.author` (both
  `Organization` — no per-question byline exists), and `acceptedAnswer.url` (same canonical page URL).
  New optional `datePublished` on both nodes, sourced from the new `Question.published` field —
  emitted only when a question actually sets it (no backfilled/guessed dates).
- **`lib/types.ts`** — added `published?: string` (ISO `YYYY-MM-DD`, same shape as `updated`).
  Intentionally left unset on existing questions; backfill real dates over time rather than guess.
- **Deliberately not added: `acceptedAnswer.upvoteCount`.** No server-side aggregate vote count
  exists — `HelpfulVote.tsx` only writes to `localStorage` client-side. Fabricating an engagement
  number would misrepresent real data and conflicts with the project's trust-first stance
  (`01_PROJECT_CONTEXT.md`). This GSC row stays flagged; it's optional, not an error.
- **Verified:** `npx tsc --noEmit` clean; dev-server JSON-LD spot-checked on a question without
  `updated` (dates correctly omitted) and one with `updated` set (`dateModified` renders as
  `2026-08-15T00:00:00.000Z`).
- **Files:** `app/q/[slug]/page.tsx`, `lib/types.ts`, docs (`02_DECISIONS.md`, `06_CHANGELOG.md`).

### Improved (SEO on-page cycle, 9 pages, DECISIONS #039) — 2026-08-15
Owner-directed cycle targeting specific Search Console queries across 9 pages, using
`/q/rest-idempotency` (DECISIONS #038) as a **content-quality benchmark, not a template** — each
page's existing type (question, category, utility, homepage) was preserved. Branch
`seo/onpage-improvements`, PR-based (see PR link in `07_SESSION_HANDOVER.md`). **No new routes, no
FAQPage schema, no design changes.**

- **`/q/hashmap-resize-load-factor`** (`lib/questions-extra/java-collections.ts`) — added
  `seoTitle`/`seoDescription`/`heading`/`tags` (had none); new capacity/threshold `table` block; new
  rehashing explainer; `followUps` expanded 3 → 7 to cover the brief's suggested queries; reciprocal
  `related` link to `two-sum`.
- **`/q/dynamodb-partition-key`** (`lib/questions-extra/aws.ts`) — added
  `seoTitle`/`seoDescription`/`heading` (had none); new partition-key-vs-sort-key `table`; new
  "how DynamoDB distributes data" explainer; `followUps` expanded 3 → 6.
- **`/q/dynamodb-single-table`** (`lib/questions-extra/aws.ts`) — `seoTitle`/`heading` retargeted from
  generic "Amazon DynamoDB Interview Questions" to explicitly name single-table design (the actual
  target query); new PK/SK worked-example `table` + explainer.
- **`/q/two-sum`** (`lib/questions.ts`) — title/description **intentionally left unchanged** (already
  keyword-leading and indexed — avoiding SEO-sensitive churn per `05_ROADMAP.md`); added `tags`,
  `handsOn.time`/`.space`, a "why indices not values" explainer, `followUps`/`commonMistakes`/
  `bestPractices`/`relatedTech` (previously absent), reciprocal `related` link to
  `hashmap-resize-load-factor`.
- **`/q/dynamic-proxy`** (`lib/questions-extra/advanced-java.ts`) — already near benchmark depth; title
  **unchanged** (already indexed, already keyword-leading); tightened `seoDescription` (~200 → ~175
  chars) to naturally include "dynamic proxy pattern" (secondary target); 2 more `followUps`.
- **`/q/what-is-json`** — reviewed, **left unchanged**; already at benchmark depth (CE2 batch, full
  schema + SEO overrides already present).
- **`/candidate/json`** (`lib/categories.ts`) — the category route's title/description come from a
  **shared template** used by all 19 categories (not special-cased); only the `json` category's
  `blurb` was rewritten (same terse style as every sibling category) to cover
  syntax/data-types/parsing/serialization/schema/JSON-vs-XML, flowing automatically into the page's
  meta description. Zero code change.
- **`/environment`** — reviewed against its actual existing purpose (dev-environment version-check
  utility, not an interview page); title/description already precisely matched that intent —
  **left unchanged**, no interview-page framing forced onto it.
- **`/` (homepage)** (`app/page.tsx`) — added an explicit `title: { absolute: ... }` override
  ("Full Stack Interview Guru — Interview Tomorrow? Start Here.") so the rendered title leads with the
  brand phrase instead of the root layout's "FIG – " template prefix — same absolute-title technique
  as DECISIONS #033's `Question.seoTitle`, reusing copy already approved as the page's OG title.
  Description, layout, and conversion structure untouched.
- **Verified:** `npx tsc --noEmit` clean (`next lint` confirmed not configured, per `CLAUDE.md`);
  `npm run build` green — **355 pages** (unchanged), shared First Load JS **102 kB unchanged**.
  In-browser (dev): all 9 pages return 200 with intended title/H1/description; all 3 new `table`
  blocks render; `QAPage`+`BreadcrumbList` JSON-LD valid; cross-linked slugs resolve 200; no
  console/hydration errors.
- **Files:** `lib/questions-extra/java-collections.ts`, `lib/questions-extra/aws.ts`,
  `lib/questions.ts`, `lib/questions-extra/advanced-java.ts`, `lib/categories.ts`, `app/page.tsx`,
  docs (`02_DECISIONS.md`, `06_CHANGELOG.md`, `07_SESSION_HANDOVER.md`).
- **Merged and deployed** (PR [#1](https://github.com/gsconnectlabs/full-stack-interview-guru/pull/1),
  `210a3bb`, GitHub → Vercel). Re-verified live on production: all 9 pages return correct
  title/H1/description; the DynamoDB partition-key table renders; `QAPage`+`BreadcrumbList` JSON-LD
  valid; no console errors.

### Improved (REST Idempotency content/SEO/interview-depth pass, DECISIONS #038) — 2026-08-15
Owner-directed depth pass on `/q/rest-idempotency` (~106 impressions / 0 clicks / avg. position ~48.6
in Search Console) — content was short and didn't fully cover the "which HTTP methods are idempotent"
search intent. **Same slug/URL, no route change.**

- **SEO:** `seoTitle` → "Idempotent HTTP Methods in REST: Which Methods Are Idempotent? (2026) | Full
  Stack Interview Guru"; `seoDescription` rewritten and tightened (~180 chars, was ~245); `heading`
  (H1) → "Idempotent HTTP Methods in REST – Complete Interview Guide", deliberately distinct from the
  SEO title per the existing DECISIONS #033 convention. `tags` added for on-site search.
- **Content — new schema capability:** `AnswerBlock` (`lib/types.ts`) gains a `"table"` variant
  (`headers`/`tableRows`), and the previously-declared-but-never-rendered `"code"` block type is now
  wired into `MindMapBlock` (`app/q/[slug]/page.tsx`) via the existing `CodeBlock` component. See
  DECISIONS #038 for the full rationale (including why `FAQPage` schema was explicitly **not** added —
  still an unapproved Idea in `99_IDEAS_BACKLOG.md`).
- **Content — this question only:** precise `shortAnswer` (Quick Answer) avoiding the "POST, PATCH =
  Not Idempotent" oversimplification; a 4-column HTTP Method Comparison table (Method/Idempotent?/
  Safe?/Explanation); a Safe-vs-Idempotent explainer; PUT and POST examples; a production
  "why retries happen" narrative with a timeout/retry ASCII flow; an `Idempotency-Key` header example
  + 6-step server flow (generate → check → process → store → replay) + lookup flowchart; a thermostat
  vs "add ₹500" analogy; `whatIf` repurposed for the DELETE+404 "still idempotent?" interviewer trap;
  `realWorld` repurposed for the banking/payment retry scenario; refreshed
  `interviewerExpectation`/`commonMistakes`/`bestPractices`; `followUps` refreshed to the 10 questions
  from the brief (questions-only, matching the sitewide convention — answers live in the sections
  above); `related` recurated to 6 verified-existing slugs (`idempotency-keys`, `put-vs-patch`,
  `rest-status-codes`, `consumer-idempotency`, `saga-pattern`, `design-payment-system`); one external
  reference (RFC 9110 §9.2.2); `updated: "2026-08-15"` (drives the freshness chip + `QAPage.dateModified`).
- **Verified:** `npx tsc --noEmit` clean; `npm run build` green — **355 pages** (unchanged), shared
  First Load JS **102 kB unchanged**. In-browser (dev): title/meta/canonical/H1 correct, table + all
  5 code blocks render, `QAPage`+`BreadcrumbList` JSON-LD valid (no `FAQPage` added), all 6 `related`
  links resolve 200, no console/hydration errors.
- **Files:** `lib/types.ts`, `app/q/[slug]/page.tsx`, `lib/questions.ts` (single entry), docs
  (`02_DECISIONS.md`, `04_ARCHITECTURE.md`, `06_CHANGELOG.md`, `07_SESSION_HANDOVER.md`).
- **Pushed and deployed** (`72a4b72`, GitHub → Vercel). Re-verified live on
  `https://fullstackinterviewguru.com/q/rest-idempotency`: title/meta/canonical/H1 correct, table +
  all 6 code blocks render, `QAPage`+`BreadcrumbList` JSON-LD valid, all 6 `related` links resolve
  200, no console errors.

### Added (ROADMAP CE4 — Modern Java / Concurrency / Production Engineering question bank, 25 questions) — 2026-08-12
Content expansion — **no route, UI, layout, or schema change**. Owner supplied an initial 25-question
topic pool (HashMap/JMM/volatile/ExecutorService/CompletableFuture/Streams/GC fundamentals); Phase
1–4 analysis (repo inspection, full 117-question inventory, overlap detection) found nearly every
proposed topic already had a canonical page — several with two depth levels (flagship base + CE3
"advanced-java" facet) — so the batch was re-scoped to genuinely uncovered, current (Java 17–21+)
senior/production topics instead, split across categories by natural topical fit, following the CE2/CE3
non-duplication pattern (distinct deeper facet + `related` cross-link) wherever a topic sits near
existing coverage. Proposal presented to the owner with full duplicate-analysis rationale before any
content was written; **explicitly approved before implementation** (golden rule, `CLAUDE.md`).

- **New `lib/questions-extra/java-8.ts`** exporting `java8Extra: Question[]` — **8** questions
  (`parallel-stream-production-pitfalls`, `stream-vs-collection-semantics`,
  `stream-laziness-short-circuit`, `stream-pipeline-vs-loop-hot-path`,
  `collectors-groupingby-tomap-pitfalls`, `optional-when-to-use-and-avoid`,
  `method-reference-vs-lambda-performance`, `custom-functional-interface-design`). **Category state
  change:** `java-8` had only **2** live base questions (`java-stream-api`, `java-optional`) — below
  `MIN_LIVE_TO_LIST` (10), `noindex` and unlisted since DECISIONS #034. This batch takes it to **10
  live**, crossing the threshold — `java-8` flips to listed + indexed + in the sitemap, the same
  category-unlock outcome CE1/CE2/CE3 achieved for Python/JSON/Advanced Java. Verified in-browser:
  `/candidate/java-8` now shows "10 LIVE".
- **Appended to existing category files** (not new files — each category already has a dedicated
  `lib/questions-extra/*.ts`, so content was added to the existing exported array, matching the
  "append typed objects" content model): **3** to `java-collections.ts` (`sequenced-collections-java21`
  — Java 21 `SequencedCollection`/`SequencedMap`; `concurrenthashmap-size-vs-mappingcount` —
  correctly attributes the Javadoc "estimate" language to `mappingCount()`, not `size()`;
  `concurrenthashmap-compound-operations` — `computeIfAbsent`/`merge` atomicity vs a racy get-then-put,
  using **specification-safe wording**: no specific exception/deadlock is guaranteed for a mapping
  function that modifies its own map — the JDK simply documents it as an unsupported pattern).
  **7** to `multithreading.ts` (`stampedlock-optimistic-reads`; `thread-pool-exhaustion-cascading-failure`
  — bulkhead pattern; `completablefuture-callback-thread-semantics` — thenApply vs thenApplyAsync thread
  semantics; `threadlocal-caching-virtual-threads` — the "one thread per request" mental model still
  holds for correctness under virtual threads, but ThreadLocal-based *reuse-caching* patterns silently
  stop working because virtual threads are never reused across tasks; `structured-concurrency-deep-dive`
  — documented as a **preview API**, current as of **JDK 25 (JEP 505, fifth preview)**: constructors
  replaced by a `StructuredTaskScope.open()` factory + `Joiner` interface, still previewing in JDK 26
  (JEP 525), no finalized version; `virtual-thread-synchronized-pinning` — version-accurate: Java 21–23
  pins the carrier thread on blocking `synchronized`, **JEP 491 (Java 24) removed that pinning** for the
  common case, both stated explicitly rather than presenting either as a blanket, version-agnostic rule;
  `completablefuture-timeout-ortimeout` — reframed around what `orTimeout()` does *not* do: it flips the
  future's own completion state but never cancels or interrupts the underlying computation, and
  `CompletableFuture.cancel()`'s `mayInterruptIfRunning` is documented to have no effect). **5** to
  `jvm.ts` (`jvm-cds-appcds-startup`; `graalvm-native-image-tradeoffs`; `jmh-microbenchmarking-pitfalls`;
  `diagnosing-high-cpu-production-jvm` — async-profiler/JFR flame graphs; `lambda-stream-closure-memory-leak`).
  **2** to `core-java.ts` (`object-creation-cost-primitive-streams`; `records-vs-lombok-dto`).
- **No duplicate content — verified, then corrected.** An owner-directed review pass (same day) compared
  the batch directly against full CE3 question text rather than titles alone, and found two real
  overlaps the initial title-level duplicate check had missed: the original `virtual-thread-executor-vs-pooled`
  restated CE3's `virtual-threads-pinning-structured` Semaphore/downstream-capacity guidance, and the
  original `completablefuture-timeout-ortimeout` restated the `orTimeout()`/`completeOnTimeout()` point
  already made in CE3's `completablefuture-error-handling`. The review also surfaced that CE3's existing
  `virtual-threads-pinning-structured` stated pre-JEP-491 `synchronized` pinning as an unqualified,
  version-agnostic fact, and that `structured-concurrency-deep-dive`'s original code example used the
  JDK 21–24 constructor API superseded by JDK 25's `open()`/`Joiner` shape (confirmed via live JEP/Javadoc
  lookup, not training-data recall). All four were corrected — see the "Fixed" entry immediately below.
  Every remaining question that sits near existing coverage (ConcurrentHashMap, ExecutorService,
  CompletableFuture, object-creation cost) takes a distinct, deeper facet than the existing canonical
  page and cross-links to it via `related`. Full FIG schema per question (`shortAnswer`, `mindMap`,
  `handsOn`, `whatIf`, `realWorld`, `guruTake`, `interviewerExpectation`, `followUps`, `commonMistakes`,
  `bestPractices`, `relatedTech`, `tags`, `experience`, `askedIn`, `related`) plus SEO overrides
  (`seoTitle`, `seoDescription`, `heading`, DECISIONS #033). No new schema fields added — "Green
  flags"/"Red flags"/"Strong candidate answer" map onto the existing
  `interviewerExpectation`/`commonMistakes`/`guruTake` fields rather than extending `lib/types.ts`.
- **`lib/questions-extra/index.ts`:** imported `java8Extra` and spread it into `extraQuestions`; updated
  the header comment describing the batch split. The 4 existing category files needed no import changes
  (already wired) — only their arrays grew.
- **Question totals:** **287 → 312** (32 base + **280** flagship/expansion), unchanged by the correction
  pass (one slug replaced, net zero). Extra files: 12 → **13**.
- **Verified (post-correction):** TypeScript clean (`tsc --noEmit`); production build green — **355
  pages** (was 330, +25 `/q/[slug]`); **312 unique slugs, no duplicates**; all `related` refs resolve
  **bank-wide** (312 questions, not just the new batch); grepped for lingering references to the removed
  `virtual-thread-executor-vs-pooled` slug — none found. In-browser (dev): `/candidate/java-8` shows
  **"10 LIVE"** and is listed; `threadlocal-caching-virtual-threads`, `structured-concurrency-deep-dive`,
  `completablefuture-timeout-ortimeout`, and the corrected `virtual-threads-pinning-structured` all
  render every FIG section with the `seoTitle` in the tab title, no console errors. **No regression:**
  shared First Load JS **102 kB unchanged**, `/q/[slug]` **111 kB unchanged**; no URL/UI/schema change.
- **Files:** new `lib/questions-extra/java-8.ts`; modified `lib/questions-extra/{core-java,
  java-collections, multithreading, jvm, advanced-java}.ts` (append-only plus the CE3 surgical
  correction below) and `lib/questions-extra/index.ts` (import + spread); docs (`04_ARCHITECTURE.md`,
  `05_ROADMAP.md`, `06_CHANGELOG.md`, `07_SESSION_HANDOVER.md`), root `CLAUDE.md` (testing-checklist page
  count → 355).
- **Not pushed.** Left for owner review per `CLAUDE.md` — no commit created, no branch pushed, no deploy.

### Fixed (CE4 review-driven corrections — overlap, wording, and version accuracy) — 2026-08-12
Same-day, owner-directed correction pass on the CE4 batch above, scoped to exactly six items raised in
review. **No unrelated content or code touched; no route/schema/UI change.**

- **Q15 replaced:** `virtual-thread-executor-vs-pooled` (overlapped CE3's Semaphore/downstream-capacity
  guidance) → **`threadlocal-caching-virtual-threads`**, a genuinely distinct facet — the "one thread per
  request" mental model's correctness survives virtual threads (each VT still gets isolated ThreadLocal
  storage) but ThreadLocal-as-reuse-cache patterns (`ThreadLocal<SimpleDateFormat>`, scratch buffers)
  silently stop working because virtual threads are never reused across tasks. No net change to question
  totals (one slug out, one in) or to `java-8`'s live count.
- **Q18 reframed:** `completablefuture-timeout-ortimeout` kept its slug but now answers "What actually
  happens to the underlying work when `CompletableFuture.orTimeout()` fires?" — `orTimeout()` only flips
  the future's own completion state; it does not cancel or interrupt the computation still running on its
  executor, and `CompletableFuture.cancel()`'s `mayInterruptIfRunning` is documented to have no effect
  (unlike a raw `ExecutorService` `Future`). Difficulty raised Medium → Hard to match the added depth.
- **Q16 version-corrected:** `structured-concurrency-deep-dive` updated to the *current, live-verified*
  StructuredTaskScope status — API shape changed in **JDK 25 (JEP 505, fifth preview)**: `open()` factory
  + `Joiner` interface replace the JDK 21–24 constructor API (`ShutdownOnFailure`/`ShutdownOnSuccess`,
  now removed); still preview with **no finalized version**, previewing again in JDK 26 (JEP 525). The
  code example was rewritten to the current `open()`/`Joiner` shape, with the superseded constructor
  shape called out explicitly for JDK 21–24 readers. Verified via live WebSearch/JEP lookup, not recalled
  from training data.
- **Q7 deepened:** `method-reference-vs-lambda-performance` — added the capturing-vs-non-capturing
  distinction (a capturing lambda *or* a bound method reference allocates a new instance per evaluation;
  non-capturing forms of either syntax are effectively reusable after the first `LambdaMetafactory`
  bootstrap), softened the "identical performance" claim from unconditional to conditional, and added a
  JMH recommendation for anything performance-sensitive. Cross-links to `jmh-microbenchmarking-pitfalls`.
- **Q11 wording fixed:** `concurrenthashmap-compound-operations`'s `whatIf` answer no longer claims a
  mapping function that modifies its own map "can throw `IllegalStateException` or deadlock" — reworded
  to specification-safe language: this is not a supported pattern and the JDK does not guarantee what
  happens (could be blocked/hung threads, an exception, or other incorrect behavior); the rule is simply
  never to do it.
- **CE3 correction:** `lib/questions-extra/advanced-java.ts`'s existing `virtual-threads-pinning-structured`
  — a **surgical edit, not a rewrite** — gained a Java 21–23 vs Java 24+ (JEP 491) qualifier in exactly
  the four spots (`shortAnswer`, two `mindMap` entries, `whatIf`) that previously stated pinning as an
  unqualified, version-agnostic fact; a `related` link to the new, deeper
  `virtual-thread-synchronized-pinning` was added. All other fields on that page (handsOn code,
  follow-ups, mistakes, best practices, tags, difficulty, `askedIn`) are untouched.
- **Verified:** `tsc --noEmit` clean; `npm run build` green — **355 pages** (unchanged), shared JS
  **102 kB** (unchanged), `/q/[slug]` **111 kB** (unchanged); **312 unique slugs, no duplicates**; every
  `related` link across the full 312-question bank resolves; no lingering reference to the removed
  `virtual-thread-executor-vs-pooled` slug anywhere in `lib/`. Spot-checked in-browser: the four changed
  pages plus the corrected CE3 page all render cleanly, no console errors.
- **Files:** `lib/questions-extra/{multithreading, java-8, java-collections, advanced-java}.ts`
  (content-only edits) — no other files touched this pass.
- **Not pushed.** Same as the batch above — left for owner review, no commit/branch/deploy.

### Changed (Donate nav removal, Store → "Guru's Picks" rename, "Real Talk from Guru" field) — 2026-08-09
Owner-directed session: three scoped, non-breaking changes (see DECISIONS #037). **No URL changes, no
SEO/structured-data regression, no page-count change** (330 pages, unchanged).
- **Donate section unlinked from every user-facing surface:** the "❤️ Donate" link is gone from
  `Navbar.tsx`, the Footer Support group, and `/contact`'s quick-links row (grid tightened from 3 to 2
  columns since only Feedback + About remain); the homepage "❤️ Keep it free & ad-light" card is replaced
  by a "Guru's Picks" teaser card linking to `/store` (the CTA slot is repurposed, not deleted).
  `app/donate/page.tsx`, `components/UpiQrCard.tsx`, and all donate-related `lib/site.ts` config
  (`donateOptions`, `hasDonateOptions`, `upiId`, `upiPayUri`) are **untouched and still live** at
  `/donate` (still in `sitemap.ts`) — nothing was deleted, only unlinked from the surfaces that pointed to
  it. `lib/site.ts` donate env fallbacks were explicitly **not modified** this session, per owner
  instruction.
- **"Store" renamed to "Guru's Picks"** (display label only — the route stays `/store`, so no redirect/
  canonical/sitemap change was needed): `Navbar.tsx`, `Footer.tsx`, and `app/store/page.tsx` (breadcrumb,
  chip, `<h1>`, `<title>`/`description`/OG title) all updated. Added a short personal framing line under
  the H1, sourced from a single editable constant (`GURU_INTRO` in `app/store/page.tsx`) rather than
  inlined in JSX. Added a restrained premium visual treatment — new `.card-premium` utility in
  `globals.css` (reuses the existing `gold` token, per DECISIONS #036's "signature accent only" rule; no
  new colors) — applied to the featured product card (`StoreProductCard.tsx`, styling-only change, no
  data-rendering logic touched) and the new homepage teaser card. `lib/store.ts` (`storeProducts`,
  pricing, `gumroadUrl`) is **completely untouched**.
- **New optional `Question.guruTake?: string` field** (`lib/types.ts`) renders as a new "🗣️ Real Talk from
  Guru" section on `/q/[slug]` (`app/q/[slug]/page.tsx`), placed after the existing "😂 Real World"
  section (which is unmodified) and before "🎯 Interviewer's Expectation". Renders **only when
  `guruTake` is set** — no placeholder/"coming soon" copy — and is listed in the sidebar "On this page"
  index the same way the other optional sections are. **No existing question object was edited** —
  `guruTake` is not populated anywhere in `lib/questions.ts` or `lib/questions-extra/*.ts` this session;
  content authoring is a deferred follow-up (see `99_IDEAS_BACKLOG.md`).
- **Verified:** `npx tsc --noEmit` clean; `npm run build` green — **330 pages** (unchanged), shared First
  Load JS **102 kB** (unchanged); in-browser console check (production build) on `/`, `/store`, and
  `/q/what-is-hashmap` showed no errors beyond a pre-existing, environment-only AdSense request failure
  (`net::ERR_TUNNEL_CONNECTION_FAILED` reaching `pagead2.googlesyndication.com`) that reproduces
  identically on untouched pages (e.g. `/about`) in this sandboxed network — not caused by this session's
  changes. Re-verified clean after the `/contact` follow-up below.
- **Follow-up (same session):** the Donate quick-link on `/contact` was also removed (grid tightened from
  3 to 2 columns, now Feedback + About only) for consistency with the Navbar/Footer/homepage removal.
- Committed on `claude/great-einstein-0cof5b` and opened as a pull request into `main` for owner review
  (not merged by this session).

### Changed (FIG Teal + Gold visual identity — token recolor + editorial serif) — 2026-08-09
Site-wide visual-system change realizing the Teal + Gold palette (DECISIONS #036), anchored on colors
pixel-sampled from the real logo. **Token-level, not a redesign** — no routing, content, or functional
change.
- `tailwind.config.ts`: `brand` re-hued indigo→deep teal, `ink` navy→teal-tinted, `slate` cool-gray→warm
  neutral (all three cascade to every existing utility class site-wide); new `gold` scale added
  (signature accent only — Navbar wordmark + one hero gradient; **not** the Store "Free" badge); new
  `font-serif` system stack (no webfont dependency) for question H1s/section headings + home/Store H1.
- `app/globals.css`: removed `backdrop-blur`/colored glow shadows from `.card`/`.card-hover`/
  `.btn-primary`; `rounded-2xl` → `rounded-xl`; body background reduced from a dual indigo+sky glow to
  one restrained teal wash.
- `lib/categories.ts`: all 22 category icon accents remapped from a rainbow of unrelated hues to a
  cohesive teal-family set (2 use the gold accent, deliberately sparse).
- `components/AmazonProductCard.tsx`, `SearchBar.tsx`: same blur/shadow/radius reduction.
- Preserved unchanged: `DifficultyBadge` (emerald/amber/rose semantics), `CodeBlock` (developer
  character), Store "Free" badge (stays emerald).
- Verified: `tsc --noEmit` clean; `npm run build` green (330 pages, shared First Load JS unchanged at
  102 kB); contrast re-checked programmatically (7–15:1 on body/secondary/tertiary text; the one
  pre-existing tertiary-label gap from DECISIONS #029 is unchanged, not worsened).

### Changed (Logo/favicon refresh — real FIG badge logo) — 2026-08-09
Replaced the emoji-in-gradient-box placeholder mark and the generated monogram favicon with the
owner-supplied transparent FIG badge logo (`public/FIG-logo-transparent.png`, 1024×1024).
- `app/icon.png` (512×512) and `app/apple-icon.png` (180×180) generated from the source asset,
  replacing `app/icon.svg` and the `next/og`-generated `app/apple-icon.tsx` (both removed).
- `Navbar` and `Footer` logo marks now render `/icon.png` via `next/image` (was an emoji span).
- `manifest.ts` icons updated to `/icon.png` (512×512, `any` + `maskable`).
- Text, tagline, layout, colors, and responsive nav behavior unchanged. `npx tsc --noEmit` clean;
  `npm run build` green (330 pages, shared First Load JS unchanged at 102 kB).

### Added (FIG Store — `/store`, first product, first custom GA4 event) — 2026-08-09
New top-level Store section (DECISIONS #035): free, distraction-free platform stays the same; the Store
is an optional surface for structured deeper resources. First (and currently only) product: **"Top 50
Java Interview Questions & Answers — Free Edition"** — a free PDF ebook, distributed via Gumroad, based
on FIG's free Java Q&A content. Not a paid product; no price/discount/testimonial claims are shown.
- New route `app/store/page.tsx`; added to `Navbar` and `Footer` (Resources group).
- New `lib/store.ts` (data-driven `StoreProduct[]` catalog — append-only for future products; the
  Gumroad URL lives in exactly one place per product).
- New components: `StoreProductCard` (server), `GumroadCtaButton` (client island).
- First custom GA4 event, `gumroad_cta_click`, via `sendGAEvent` (`@next/third-parties/google`) — see
  [14_ANALYTICS.md](./14_ANALYTICS.md). Off by default, same as all GA (DECISIONS #031/#032).
- First `next/image` use in the project (Store product cover, `public/store/`).
- No existing routes, content, or SEO URLs changed. `npx tsc --noEmit` clean; `npm run build` green
  (330 pages, up from 329; shared First Load JS unchanged at 102 kB).

### Added (ROADMAP CE3 / Release 10 — Advanced Java question bank, 25 questions) — 2026-08-04
**Released to production 2026-08-04** (commit `b3a2fc2`, fast-forward merged to `main` + pushed; Vercel
deploy succeeded; post-deploy smoke test on https://fullstackinterviewguru.com passed — 25 new `/q`
pages 200, `/candidate/advanced-java` indexable + listed at 28 live, sitemap updated, `seoTitle`/`QAPage`/
canonical correct on sampled pages). Content expansion — **no route, UI, layout, or schema change**.
Follows the CE2 (JSON) pattern:
new batch file + one-line wiring, full FIG schema plus keyword-led `seoTitle` / `seoDescription` /
`heading` overrides (DECISIONS #033). Append-only (#028).

- **New `lib/questions-extra/advanced-java.ts`** exporting `advancedJavaExtra: Question[]` with **25**
  senior-level questions (difficulty mix **10 Medium · 15 Hard** — deliberately no Easy for an advanced
  section), ordered by five sections: JVM & Class Loading → Serialization & Metaprogramming → Object
  Contracts & Generics → Concurrency Framework → Modern Java (17–21). Each uses the full schema
  (`shortAnswer`, `mindMap`, `handsOn`, `whatIf`, `realWorld`, `interviewerExpectation`, `followUps`,
  `commonMistakes`, `bestPractices`, `relatedTech`, `tags`, `experience`, `askedIn`, `related`) plus
  the SEO overrides. The four "Continue Learning with AI" prompts auto-generate via `lib/ai-prompts.ts`.
- **Coverage:** JDK/JRE/JVM execution pipeline, ClassLoader architecture, breaking parent delegation,
  JMM safe publication, stack frames vs StackOverflowError, GC collector trade-offs, reference-type
  caches, **Serialization vs Externalization**, **transient**, **Reflection API**, **Dynamic Proxy**,
  **Java Annotations**, Comparator composition, equals/hashCode under inheritance, deep immutability,
  bounded wildcards (PECS), heap pollution / @SafeVarargs, safe removal during iteration, ExecutorService
  shutdown & rejection, task exception propagation, CompletableFuture error handling, ForkJoin common
  pool, ThreadLocal vs ScopedValue, **Records & Sealed Classes**, and virtual-thread pinning/structured
  concurrency.
- **No duplicate content (DECISIONS — Release 10).** ~20 of the 25 briefed topics already own a canonical
  page under `jvm` / `core-java` / `java-collections` / `multithreading` (e.g. `jvm-jre-jdk`,
  `java-memory-model`, `reference-types`, `comparable-vs-comparator`, `java-equals-hashcode`,
  `immutable-class-design`, `generics-type-erasure`, `fail-fast-vs-fail-safe`,
  `executorservice-thread-pools`, `completablefuture-async`, `forkjoinpool-work-stealing`,
  `threadlocal-memory-leak`, `virtual-threads`). To avoid keyword cannibalisation, **every** new
  question takes a *distinct, deeper advanced facet* and **cross-links** to the existing base question
  via `related` — scaling the same pattern CE2 used for `json-vs-xml-differences` → `json-vs-xml`. The
  five genuinely-missing topics (Externalization, transient, Reflection, Dynamic Proxy, Records/Sealed)
  are covered head-on.
- **Category state change:** `advanced-java` goes **3 → 28 live**, crossing `MIN_LIVE_TO_LIST = 10`
  (DECISIONS #034), so the category flips from `noindex`/unlisted to **listed + indexed + in the
  sitemap** — the browse surface, home metrics, footer, and `sitemap.ts` pick it up automatically.
- **`lib/questions-extra/index.ts`:** imported `advancedJavaExtra` and spread it into `extraQuestions`
  (the only wiring needed). Everything downstream — category page, `/q/{slug}` pages, search index,
  sitemap, `QAPage` / `BreadcrumbList` JSON-LD, prev/next nav, related questions — updates automatically.
- **Question totals:** **262 → 287** (32 base + **255** flagship/expansion). Extra files: 11 → **12**.
- **Verified:** TypeScript clean (`tsc --noEmit`); production build green — **329 pages** (was 304,
  +25 `/q/[slug]`); **287 unique slugs, no duplicates**; all new `related` refs resolve; in-browser:
  `/candidate/advanced-java` shows **"28 LIVE"** and is now listed, a new page (`/q/dynamic-proxy`)
  renders every FIG section with the `seoTitle` in the tab title and the `heading` H1, **no console
  errors / hydration warnings**. **No regression:** shared First Load JS **102 kB unchanged**,
  `/q/[slug]` **111 kB unchanged**; canonical, `QAPage`, `BreadcrumbList`, and branded titles intact —
  **no URL/UI change**.
- **Files:** new `lib/questions-extra/advanced-java.ts`; `lib/questions-extra/index.ts` (import +
  spread); docs (`04_ARCHITECTURE.md`, `05_ROADMAP.md`, `06_CHANGELOG.md`, `07_SESSION_HANDOVER.md`),
  root `CLAUDE.md` (testing-checklist page count → 329).

### Changed (SEO — advertise only substantial categories; honest live counts) — 2026-08-01
AdSense **"Low value content"** remediation (DECISIONS **#034**). The site advertised **1,970 questions
across 23 categories** while only **262** existed (12 categories had <10 live; Azure/GCP had 0), producing
thin / "under construction" pages. The public browse surface now reflects **live** content. **No question
URLs/slugs changed; content is non-destructive (append-only, #028).**

- **New `lib/category-visibility.ts`** — `MIN_LIVE_TO_LIST = 10`, `liveCount`, `isListed`,
  `listedCategories` (catalog order preserved), `totalLiveQuestions`. Live counts derive from
  `questionsByCategory`, so they self-update as content grows.
- **Browse surface → live counts + only ≥10-live categories (11 of 23):** `app/page.tsx` (metrics +
  Explore Topics), `app/candidate/page.tsx`, `components/TopicCard.tsx` (chip), `components/Footer.tsx`.
  Home now reads **"262+ questions" / "11 Topics"** (was 1,970+ / 23) with real per-card counts
  (Core Java 27, Python 27, REST 24, JSON 26, AWS 22, SQL 22, System Design 21, Collections/MT/JVM/
  Microservices 20).
- **`app/sitemap.ts`:** category URLs limited to `listedCategories` (11); all 262 question routes retained.
- **`app/candidate/[category]/page.tsx`:** `generateStaticParams` now only emits categories with **≥1
  live question** and sets `dynamicParams = false`, so **empty** categories (Azure/GCP) return **404**
  instead of the "being written" placeholder; below-threshold-but-non-empty categories still render (so
  breadcrumbs resolve) but are **`noindex, follow`** and show the real live count in the header/metadata.
- **`app/q/[slug]/page.tsx`:** the "More {category}" sidebar card shows the live count (pluralized).
- **`lib/categories.ts` unchanged** — the aspirational `count`/`topics` data is retained as the catalog
  target; it is simply no longer shown as if it were live. Interviewer mode's picker is unchanged
  (it generates kits, not crawlable pages).
- **Verified:** TypeScript clean; production build green — **304 pages** (was 306; −2 = the two
  0-question category routes no longer generated); in-browser: home/candidate show 262+ across 11
  categories with real counts, delisted categories absent from browse + sitemap, `/candidate/aws`
  `index,follow`, `/candidate/docker` renders `noindex,follow`, sitemap lists exactly 11 categories.
  No question URL, structured-data, or First-Load-JS change.

### Fixed (core-java — dangling related reference) — 2026-08-01
Maintenance fix — **data-only, no code/UI/schema/route change**.

- **`lib/questions-extra/core-java.ts` (`generics-type-erasure`):** removed the dangling `related` slug
  `"classcast-generics-legacy"` (`related` is now `["immutable-class-design"]`).
- **Root cause:** the slug was **never defined** as a question — `git log -S 'slug: "classcast-generics-legacy"'`
  returns nothing across all history. It only ever existed as a `related` reference, introduced in the
  same commit that created `generics-type-erasure` (`c19f365`, the 180-question flagship batch). A
  companion "ClassCastException from generics/legacy raw types" question was pre-wired in `related` but
  never authored (not obsolete, renamed, or deleted). It was harmless at runtime — the question page
  resolves `related` via `getQuestion` then `.filter(Boolean)`, so the missing slug silently rendered
  nothing (no broken route) — but it was dead intent. Per the maintenance scope, **no new question was
  created**; the obsolete reference was removed.
- **Verified:** TypeScript clean (`tsc --noEmit`); production build green — **306 pages** (unchanged);
  full bank scan shows **0 broken `related` refs** (was 1) across 600 references, **262 unique slugs**
  (no duplicates), and no new dangling references introduced. Existing functionality unchanged.

### Added (ROADMAP CE2 — JSON question bank, 25 questions) — 2026-08-01
Content expansion — **no route, UI, layout, or schema change**. Unlike CE1 (Python), this batch also
populates the existing optional SEO override fields (`seoTitle` / `seoDescription` / `heading`,
DECISIONS #033) per question — reusing the current metadata system, **not** a new one.

- **New `lib/questions-extra/json.ts`** exporting `jsonExtra: Question[]` with **25** JSON interview
  questions (difficulty mix **14 Easy · 10 Medium · 1 Hard**, ordered by five learning sections:
  Basics → Objects & Arrays → Parsing & Serialization → REST APIs → Advanced). Each uses the **full
  FIG schema** (`shortAnswer`, `mindMap`, `handsOn`, `whatIf`, `realWorld`, `interviewerExpectation`,
  `followUps`, `commonMistakes`, `bestPractices`, `relatedTech`, `tags`, `experience`, `askedIn`,
  `related`) **plus** keyword-led `seoTitle` / `seoDescription` / `heading` overrides. The four
  "Continue Learning with AI" prompts are auto-generated by `lib/ai-prompts.ts` — no per-question wiring.
- **Coverage:** what/why JSON, JSON vs XML (structural), data types, syntax rules, object vs array,
  nested objects, arrays, accessing nested, flattening, parsing, serialization vs deserialization,
  common parsing errors, handling invalid JSON, pretty-printing, JSON in REST APIs, request vs
  response JSON, HTTP status codes with JSON, validation, JSON Schema, large-payload performance,
  security best practices, JSON vs BSON, JWT JSON structure, and common interview scenarios.
- **No duplicate:** the requested "JSON vs XML" topic already existed as base-bank `json-vs-xml`
  ("why JSON replaced XML for APIs"). Rather than duplicate it, a complementary **structural**
  comparison (`json-vs-xml-differences`) was added and **cross-linked** to it. New JWT question
  (`json-jwt-structure`, JSON structure focus) cross-links to the existing `what-is-jwt` (REST/auth
  focus) without overlap.
- **`lib/questions-extra/index.ts`:** imported `jsonExtra` and spread it into `extraQuestions`
  (the only wiring needed). The JSON category now shows **26 live** (1 base + 25 new). Everything
  downstream — category page, `/q/{slug}` pages, search index, sitemap, `QAPage`/`BreadcrumbList`
  JSON-LD, prev/next nav, related questions — updates automatically.
- **Question totals:** **237 → 262** (32 base + **230** flagship/expansion). Extra files: 10 → **11**.
- **Verified:** TypeScript clean (`tsc --noEmit`); production build green — **306 pages** (was 281,
  +25 `/q/[slug]`); **no duplicate slugs** (262 unique); all new `related` refs resolve; in-browser:
  `/candidate/json` shows **"26 LIVE"** with all questions, a new page (`/q/json-schema`) renders every
  FIG section with the `seoTitle` in the tab title and the `heading` H1, and every cross-link target
  (`json-vs-xml`, `what-is-jwt`, `rest-status-codes`, `rest-waiter`) returns **200**. **No regression:**
  shared First Load JS **102 kB unchanged**, `/q/[slug]` **111 kB unchanged**; canonical, `QAPage`,
  `BreadcrumbList`, and branded titles intact — **no URL/UI change**.
- **Files:** new `lib/questions-extra/json.ts`; `lib/questions-extra/index.ts` (import + spread);
  docs (`04_ARCHITECTURE.md`, `05_ROADMAP.md`, `06_CHANGELOG.md`, `07_SESSION_HANDOVER.md`), root
  `CLAUDE.md` (testing-checklist page count 281 → 306).

### Fixed (SEO — Two Sum metadata consistency) — 2026-07-31
Review follow-up to the SEO CTR pass below. The Two Sum page's `seoTitle`/`seoDescription` referenced
**"Java"**, but the page's Hands-on code sample is **Python**. Corrected the metadata to say **Python**
so it accurately reflects the existing content — **page content unchanged; no Java implementation added**.

- **`lib/questions.ts` (`two-sum`):** `seoTitle` "… (Java) …" → "… (Python) …"; `seoDescription`
  "… Java solutions …" → "… Python solutions …". No other fields touched.
- **Docs:** corrected the quoted Two Sum title in the SEO entry below and in `07_SESSION_HANDOVER.md`;
  the previously-noted Java/Python copy discrepancy is now **resolved**.
- **Verified:** `tsc` clean; production build green — **281 static pages** (unchanged), shared First
  Load JS **102 kB** (unchanged); corrected `<title>`/`<meta description>` confirmed in the built HTML;
  overrides remain optional (only 3 pages use them); all internal links resolve.

### Changed (SEO — CTR optimization for high-impression pages) — 2026-07-31
Optimized on-page SEO for the three highest-impression / low-CTR question pages from Google Search
Console — **REST Idempotency, Two Sum, Amazon DynamoDB** — with hand-written, keyword-led titles,
meta descriptions, and H1s, plus relevant internal links. **No URL, route, layout, business-logic, or
structured-data change.** See **DECISIONS #033**.

- **New optional `Question` fields (`lib/types.ts`):** `seoTitle`, `seoDescription`, `heading` — all
  optional, so the other 278 pages are unaffected (append-only content model).
- **`app/q/[slug]/page.tsx`:** `generateMetadata` uses `title: { absolute: seoTitle }` (bypasses the
  `"FIG – %s"` template when set) and `seoDescription` when provided; both fall back to the previous
  behavior. The visible `<h1>` now renders `heading ?? question`. The `QAPage` JSON-LD, ☕ Coffee Chat
  block, and Report-issue context still use the real conversational `question` — **schema unchanged**.
- **Metadata applied** (pages `/q/rest-idempotency`, `/q/two-sum`, `/q/dynamodb-single-table`):
  - **REST Idempotency** — title "REST Idempotency Interview Questions & Answers (2026) | Full Stack
    Interview Guru"; H1 "REST Idempotency Interview Questions".
  - **Two Sum** — title "Two Sum Interview Question (Python) – Optimal Solution with Explanation";
    H1 "Two Sum Interview Question".
  - **Amazon DynamoDB** — title "Amazon DynamoDB Interview Questions & Answers (2026)";
    H1 "Amazon DynamoDB Interview Questions".
- **Internal links** (via the existing `related` slug mechanism → Related Questions cards):
  - REST Idempotency → `rest-waiter`, `idempotency-keys`, `consumer-idempotency` (added; kept existing
    `rest-status-codes`, `what-is-jwt`).
  - Two Sum → `choosing-the-right-collection`, `what-is-arraylist` (added; kept `what-is-hashmap`).
  - Amazon DynamoDB → `aws-lambda`, `api-gateway`, `sqs-sns-eventbridge` (added; kept
    `dynamodb-partition-key`, `rds-vs-dynamodb`).
  - Requested targets with **no existing page** (Spring Boot REST, Time Complexity, Amazon CloudWatch)
    were **not** linked (no dead links) — logged as content ideas in `99_IDEAS_BACKLOG.md`.
- **Verified:** `tsc` clean; production build green — **281 static pages** (unchanged); shared First
  Load JS **102 kB** (unchanged); rendered title/description/H1/canonical/links confirmed in the built
  HTML; canonicals and slugs unchanged.

### Changed (ROADMAP AR2 — GA4 via `@next/third-parties`) + project standards — 2026-07-30
Migrated Google Analytics 4 to the **official Next.js integration** and established a root
`CLAUDE.md`. **No route, UI, SEO, or schema change** — instrumentation + documentation only. See
**DECISIONS #032** (and #031, unchanged).

- **GA4 integration (`@next/third-parties/google`):** `components/Analytics.tsx` previously loaded GA
  with a **hand-rolled `gtag.js` + `gtag('config', …)` `<Script>` block** (env-gated, inactive). Replaced
  it with **`<GoogleAnalytics gaId={gaId} />`** from `@next/third-parties/google` — the framework's
  recommended approach: loads `gtag.js` **once**, tracks App Router route changes as `page_view`, and drops
  the inline script. The manual block is fully removed, so there is **no duplicate GA initialization**. GA4
  anonymizes IP by default, so the old explicit `anonymize_ip` flag was dropped (no behavior change).
- **Config:** new **`gaId`** export in `lib/site.ts` = `process.env.NEXT_PUBLIC_GA_ID || ""` — **no
  committed default** (unlike `adsenseClientId`), so GA stays **off until `NEXT_PUBLIC_GA_ID` is set**,
  honoring DECISIONS #031 (never commit GA IDs). `.env.example` already documents the var.
- **Dependency:** added **`@next/third-parties@15.5.19`** (versioned in lockstep with `next 15.5.19`).
- **AdSense preserved:** the `adsbygoogle.js` loader in the same component and the `google-adsense-account`
  meta in `app/layout.tsx` are **unchanged** — GA and AdSense stay distinct and non-duplicating.
- **No custom GA4 events** in this release. Planned events (question views, search, category selection,
  feedback, donation/affiliate/outbound clicks, scroll depth, engagement) are catalogued in
  `docs/14_ANALYTICS.md` + `CLAUDE.md`, **pending separate owner approval**.
- **Documentation:** new **`docs/14_ANALYTICS.md`** (purpose, integration, ID config, file locations,
  deployment, testing, troubleshooting, future events) and a new root **`CLAUDE.md`** (authoritative
  project guide for future Claude Code sessions). Updated: `02_DECISIONS.md` (#032), `04_ARCHITECTURE.md`
  (Analytics section), `05_ROADMAP.md` (AR2), `07_SESSION_HANDOVER.md`, `README.md`, `.env.example`.
- **Verified:** `tsc --noEmit` clean; production build green — **281 pages** (unchanged); **shared First
  Load JS 102 kB unchanged** (GA env-gated off in the build). In-browser with `NEXT_PUBLIC_GA_ID=G-Q6XEJD7V69`
  set: exactly **one** `googletagmanager.com/gtag/js?id=G-Q6XEJD7V69` script, `gtag` is a function,
  `dataLayer` populated, **0** GTM tags, AdSense loader still present (`ca-pub-8326504635108554`); **no
  hydration warnings, no console errors** (the pre-existing benign AdSense `data-nscript` warning aside).
- **Files:** `package.json` (+`@next/third-parties`), `package-lock.json`, `lib/site.ts` (+`gaId`),
  `components/Analytics.tsx` (GA migrated, AdSense untouched); docs above + new `docs/14_ANALYTICS.md` +
  root `CLAUDE.md`.

### Added (ROADMAP CE1 — Python question bank, 25 questions) — 2026-07-23
Content expansion only — **no route, UI, SEO, or schema change**.

- **New `lib/questions-extra/python.ts`** exporting `pythonExtra: Question[]` with **25**
  beginner→intermediate Python interview questions (difficulty mix **15 Easy · 9 Medium · 1 Hard**,
  ordered easy → hard). Each uses the **full FIG schema**: `shortAnswer`, `mindMap`, `handsOn`
  (code + output), `whatIf`, `realWorld`, `interviewerExpectation`, `followUps`, `commonMistakes`,
  `bestPractices`, `relatedTech`, `tags`, `experience`, `askedIn`, and `related`. The four
  **"Continue Learning with AI"** prompts (Beginner / Intermediate / Senior Engineer / Architect)
  are auto-generated by `lib/ai-prompts.ts` from each question's topic + text — no per-question
  wiring.
- **Coverage:** mutable vs immutable, `is` vs `==`, shallow vs deep copy, list `append`/`extend`,
  slicing & string reverse, tuples (packing/unpacking/`namedtuple`), dict `get`/`setdefault`/
  `Counter`, sets, string immutability & formatting, lambda, list comprehension, `*args`/`**kwargs`,
  mutable-default-argument trap, generators/`yield`, iterators vs iterables, exception handling,
  file handling (`with`), OOP (`__init__`/`self`), inheritance & `super()`, polymorphism/duck
  typing, encapsulation (`_`/`__`/`@property`), modules & imports, virtual environments, the GIL,
  and multithreading vs multiprocessing. **No duplicate** of the two existing base-bank Python
  questions (`python-list-vs-tuple`, `python-decorators`).
- **`lib/questions-extra/index.ts`:** imported `pythonExtra` and spread it into `extraQuestions`
  (the only wiring needed). The Python category now shows **27 live** (2 base + 25 new). Everything
  downstream — category page, `/q/{slug}` pages, client search index, sitemap, `QAPage`/
  `BreadcrumbList` JSON-LD, prev/next nav, related questions — updates automatically.
- **Question totals:** **212 → 237** (32 base + **205** flagship/expansion). Extra files: 9 → **10**.
- **Verified:** TypeScript clean (`tsc --noEmit`); production build green — **281 pages** (was 256;
  +25 `/q/[slug]`); **no duplicate slugs** (237 unique); all **52** Python `related` references
  resolve; in-browser: `/candidate/python` shows **"27 LIVE"** with all questions, a new question
  page (`/q/python-generators-yield`) renders every FIG section + the AI prompts (topic correctly
  "Generators (Python)"), **prev/next shows "Question 21 of 27"** with correct neighbours + "View
  all Python", and search returns the new questions (e.g. `*args`/`**kwargs`). **No regression:**
  shared First Load JS **102 kB unchanged**, `/q/[slug]` **111 kB unchanged**; canonical, `QAPage`,
  `BreadcrumbList`, and `"FIG – …"` titles intact — **no SEO/URL/UI change**.

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
- **Last Updated:** 2026-08-21 (Fixed floating CTA reappearing after client-side navigation — DECISIONS #043)
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
