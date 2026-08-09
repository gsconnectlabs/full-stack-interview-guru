# CLAUDE.md

Authoritative guidance for Claude Code (and any AI assistant / contributor) working on
**FullStackInterviewGuru (FIG)**. Read this first, then defer to **`/docs`** — the single source of
truth — for depth. This file summarizes and links; where it and a `/docs` file overlap, `/docs` wins
and this file should be updated to match.

**Golden rule:** Analyze first, propose, and **wait for explicit owner approval before implementing**.
One feature at a time. Never change URLs or break SEO. Never remove existing features. Keep changes
minimal and production-ready. (Full workflow: [docs/13_CONTRIBUTING.md](docs/13_CONTRIBUTING.md).)

---

## Project Overview

- **Purpose:** A fast, distraction-free interview-prep platform for **candidates** and **interviewers**
  — high-quality Q&A across Java, Python, AWS, REST, SQL, Docker, Kubernetes, System Design, and more.
  No login, no popups, no dark patterns. Mission: become one of the world's most trusted interview-prep
  platforms — **trust before revenue**. (See [docs/01_PROJECT_CONTEXT.md](docs/01_PROJECT_CONTEXT.md).)
- **High-level architecture:** 100% **static (SSG)** Next.js App Router site. **No backend, no database,
  no auth.** All pages (home, candidate/category, `/q/[slug]`, interviewer, feature + legal pages) are
  prerendered from typed data in `lib/`. Deployed on **Vercel**. (See
  [docs/04_ARCHITECTURE.md](docs/04_ARCHITECTURE.md).)
- **Tech stack:** Next.js **15.5.19** (App Router) · React **19** · TypeScript **5.7** (strict) ·
  Tailwind CSS **v3** · `@next/third-parties` (GA4). System-font stack (no web fonts, DECISIONS #030).

---

## Architecture

Business logic lives in `lib/`, not in pages — **pages compose data + components**.

### Folder structure

```
app/          Routes (App Router): layout.tsx (root, metadata, JSON-LD), page.tsx (home),
              candidate/ (+ [category]), q/[slug], interviewer/, transition/, environment/,
              real-world/, donate/, feedback/, about/, contact/, privacy/, terms/, disclaimer/,
              not-found.tsx, sitemap.ts, robots.ts, manifest.ts, icon.svg, apple-icon.tsx, globals.css
components/   Reusable UI (server by default; `"use client"` only for interactive islands)
hooks/        Client hooks (e.g. useTemporaryFlag)
lib/          Data + utilities: types.ts, categories.ts, questions.ts (+ questions-extra/*),
              search.ts, reading-time.ts, ai-prompts.ts, site.ts, interviewer.ts, products.ts, …
public/       Static assets (currently minimal)
docs/         Single source of truth (NN_NAME.md); checklists/ and templates/
```

### Routing strategy (SEO-critical — do not change URLs without approval)

`/` · `/candidate` · `/candidate/{category}` · `/q/{slug}` · feature pages · `/about` `/contact`
`/privacy` `/terms` `/disclaimer`. Canonicals, OG, and sitemap all derive from `NEXT_PUBLIC_SITE_URL`
via `lib/site.ts`. Routing details in [docs/04_ARCHITECTURE.md](docs/04_ARCHITECTURE.md).

### Component organization

- **Server components by default.** Add `"use client"` only for genuine interactivity (copy/share,
  search box, AI section, forms). Keep components small, typed, and reusable — prefer composition over
  duplication (DECISIONS #022/#028).
- Reuse existing pieces: `QuestionCard`, `TopicCard`, `Breadcrumb`, `JsonLd`, `CopyButton`,
  `ShareButton`, `AISection`, `PrevNextNav`, `LegalPage`, `ContactForm`, `FeedbackForm`, `Analytics`.

### Shared utilities & configuration files

- **Config/data:** `lib/site.ts` (env-driven `NEXT_PUBLIC_*` config: `siteUrl`, `gaId`,
  `adsenseClientId`, contact/donate), `lib/categories.ts` + `lib/questions.ts` (content model).
- **Build/tooling:** `next.config.mjs`, `tsconfig.json` (strict; `@/*` path alias), `tailwind.config.ts`,
  `postcss.config.mjs`, `.env.example`. Env is `NEXT_PUBLIC_*` only (public by nature, no secrets).

---

## Coding Standards

- **TypeScript:** strict mode; strong typing; no `any` escape hatches. Shared types in `lib/types.ts`.
- **React/Next.js:** Server Components first; minimize client JS and re-renders; memoize only when it
  helps. Never fetch at runtime (site is static) — content is typed data merged at build time.
- **Naming:** components `PascalCase` (`QuestionCard.tsx`); hooks `useX`; utilities/vars `camelCase`;
  route folders/slugs `kebab-case`. Names are meaningful and self-documenting; avoid unnecessary comments.
- **File organization:** one component per file in `components/`; business logic in `lib/`, not pages;
  add a shared folder/abstraction only when there is real content for it (DECISIONS #028) — no empty
  scaffolding.
- **Import ordering:** external packages → internal aliases (`@/components`, `@/lib`, `@/hooks`) →
  relative → styles. Use the `@/*` alias, not deep relative paths.
- **Error handling:** user-friendly messages; never expose stack traces; gracefully handle missing
  content; validate form input and prevent duplicate submissions; escape user input (avoid XSS).

Full engineering standards: [docs/03_CLAUDE_INSTRUCTIONS.md](docs/03_CLAUDE_INSTRUCTIONS.md).

---

## UI Guidelines

- **Design philosophy:** professional, minimal, calm, fast, readable, premium. No visual clutter, no
  flashy animations (subtle/purposeful only), no intrusive ads (DECISIONS #004/#015).
- **Styling:** Tailwind utility classes + design tokens in `tailwind.config.ts` / `globals.css`. Avoid
  inline styles and deeply nested class names. Consistent spacing, rounded cards, subtle shadows.
- **Theme:** currently **dark-only** (root `<html className="dark">`). Vision (not yet built): light
  default via `prefers-color-scheme` + Teal/Gold palette (ROADMAP H3/H4). Don't ad-hoc recolor before
  that token migration (DECISIONS #029).
- **Responsiveness:** mobile-first; support mobile/tablet/desktop/large; no horizontal scroll.
- **Accessibility (mandatory, DECISIONS #013):** semantic HTML, single `<h1>` per page, labeled
  landmarks, skip link, visible `:focus-visible`, ARIA where needed, AA contrast, full keyboard support.
- **SEO (never regress):** per-page canonical/OG/Twitter, branded `"FIG – %s"` titles, `QAPage` +
  `BreadcrumbList` + `WebSite`/`Organization` JSON-LD, sitemap/robots.

---

## Documentation Standards

Whenever code changes, **keep the docs synchronized in the same change**:

- Review and update affected Markdown: `README.md`, `docs/04_ARCHITECTURE.md`, `docs/05_ROADMAP.md`,
  `docs/06_CHANGELOG.md`, `docs/07_SESSION_HANDOVER.md`, and any topic doc (e.g.
  `docs/14_ANALYTICS.md`). Record engineering/product decisions in `docs/02_DECISIONS.md`.
- **Docs convention (`docs/13_CONTRIBUTING.md`):** all `/docs` files use `NN_NAME.md` numeric prefixes;
  cross-links use the numbered filename; **every doc ends with a Version Information block** — refresh
  **Last Updated** whenever you edit a doc. New docs must follow this convention.
- Don't silently change an approved decision/standard — propose it, get approval, then update the
  relevant `/docs` file (and CHANGELOG) alongside the code.
- Ideas that aren't yet approved go in `docs/99_IDEAS_BACKLOG.md`, never straight into the roadmap.

---

## Git Standards

- **Focused commits** — one logical change per commit; no unrelated refactors bundled in.
- **Conventional Commits** recommended: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` with an optional
  scope, e.g. `feat(analytics): integrate GA4 and establish project standards`.
- Keep history clean and readable. Branch off `main` for changes; **do not push unless explicitly
  asked** (the owner controls releases). Never commit secrets or real GA IDs.

---

## Release Process

Follow the project's established workflow — **do not bypass validation, do not push automatically.**

1. Implement one approved feature; keep it minimal and production-ready.
2. Run the **Testing Checklist** below.
3. Update all affected docs (see **Documentation Checklist**), refresh timestamps.
4. Prepare a clean, focused commit. **Stop and wait for approval** before pushing / starting the next item.
5. For milestones/releases, run [docs/checklists/RELEASE_CHECKLIST.md](docs/checklists/RELEASE_CHECKLIST.md)
   and bump `package.json` + docs versions intentionally.

**Build/dev caveat:** never run `npm run build` while a dev/preview server is live (both write `.next`
and a prod build corrupts the running dev server).

---

## Testing Checklist (before every release)

- [ ] **Build** — `npm run build` green (expected page count; currently **330**).
- [ ] **TypeScript** — `npx tsc --noEmit` clean.
- [ ] **ESLint** — *not configured in this project*; `tsc` + `build` are the standing gates. If a lint
      gate is introduced, migrate to the ESLint CLI (`next lint` is deprecated for Next 16).
- [ ] **Production build** — static export succeeds; **shared First Load JS stable (~102 kB)** unless justified.
- [ ] **Runtime functionality** — key routes render (home, candidate, category, question, feedback); no
      console errors/hydration warnings; analytics initializes when `NEXT_PUBLIC_GA_ID` is set
      (see [docs/14_ANALYTICS.md](docs/14_ANALYTICS.md)); AdSense loader present.

---

## Documentation Checklist

- [ ] **README** — reflects any stack/config/behavior change.
- [ ] **CHANGELOG** (`docs/06_CHANGELOG.md`) — entry added under `## Unreleased` (newest first).
- [ ] **RELEASE / handover** (`docs/07_SESSION_HANDOVER.md`) — updated for the session; roadmap
      (`docs/05_ROADMAP.md`) status updated.
- [ ] **docs** — `docs/04_ARCHITECTURE.md`, `docs/02_DECISIONS.md` (if a decision was made), and any
      affected topic doc updated; timestamps refreshed; version blocks consistent.
- [ ] **Analytics documentation** (`docs/14_ANALYTICS.md`) — kept in sync when analytics changes.

---

## Future Analytics Events (planned — DO NOT implement yet)

GA4 is integrated (page views via `@next/third-parties/google`), but **no custom events exist**. The
following are **planned only** and require **separate owner approval** before any code is written.
Full catalogue + implementation guidance: [docs/14_ANALYTICS.md](docs/14_ANALYTICS.md).

- Interview Question Views
- Search
- Category Selection
- Feedback Submission
- Donation Clicks
- External Link Clicks
- Amazon Affiliate Clicks
- Outbound Links
- Scroll Depth
- Session Engagement

---

## General Development Principles

- Keep changes **minimal**; preserve the existing architecture and coding/documentation style.
- **Avoid unnecessary refactoring** and duplicated code; prefer reuse and composition.
- **Explain important decisions** (record them in `docs/02_DECISIONS.md`).
- Maintain **consistency**; prioritize **maintainability**; always prefer **production-ready** solutions.
- Every change must measurably improve at least one of: Learning Experience, UX, Performance,
  Accessibility, SEO, Maintainability, Scalability — otherwise, don't build it.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-08-09 (FIG Store, DECISIONS #035; testing-checklist page count 329 → 330)
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
