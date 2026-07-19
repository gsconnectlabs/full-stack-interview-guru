# IMPLEMENTATION_CHECKLIST.md

# FIG — Implementation Verification Checklist

Standard engineering verification to run **before considering any roadmap item complete**.
Pair with [SEO_CHECKLIST](./SEO_CHECKLIST.md) and [ACCESSIBILITY_CHECKLIST](./ACCESSIBILITY_CHECKLIST.md).

---

## Scope discipline
- [ ] Only the **one approved** roadmap item was implemented (no combined items).
- [ ] No unrelated refactoring; no UI redesign unless explicitly requested.
- [ ] Existing components **extended/reused** rather than duplicated.
- [ ] Architecture stayed modular, maintainable, and **static-first** (no new backend/API/auth,
      no new runtime dependency unless approved).
- [ ] No existing functionality removed. No URL changed.

## Code quality
- [ ] Strongly typed; no `any` leaks; optional/new fields are backward-compatible.
- [ ] Self-documenting names; small focused components/functions; no dead code.
- [ ] Build-time computation preferred over client-side work where possible.

## Correctness / build
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` succeeds — record **page count** (expected: 251 unless content added).
- [ ] No console errors or warnings (dev + built output).
- [ ] No hydration mismatches.

## Responsiveness
- [ ] Mobile, tablet, desktop verified; **no horizontal overflow** (DOM `scrollWidth` check).
- [ ] New controls sit in `flex-wrap` rows or otherwise wrap cleanly at narrow widths.

## Dark mode
- [ ] Renders correctly in the current dark theme; colors use existing tokens/utilities.
- [ ] (Once the light theme lands) verified in both light and dark.

## Performance / bundle
- [ ] **First Load JS delta** recorded for affected routes (target: ~0 for server-only changes).
- [ ] No new client component added unless necessary; shared chunks unchanged unless justified.
- [ ] No large assets/fonts introduced without optimization.

## SEO & structured data
- [ ] Run [SEO_CHECKLIST](./SEO_CHECKLIST.md). Canonicals, titles, OG, sitemap intact.
- [ ] Structured data (`QAPage`, `BreadcrumbList`, `WebSite`/`Organization`) valid and intact.

## Accessibility
- [ ] Run [ACCESSIBILITY_CHECKLIST](./ACCESSIBILITY_CHECKLIST.md). Focus states, ARIA, semantics.

## Documentation
- [ ] `05_ROADMAP.md`, `06_CHANGELOG.md`, `07_SESSION_HANDOVER.md` updated.
- [ ] `04_ARCHITECTURE.md` updated if architecture changed; `02_DECISIONS.md` if a new decision.
- [ ] **Last Updated** timestamps refreshed on all modified docs.

> **Build note:** never run `npm run build` while the dev/preview server is running.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 11:15 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
