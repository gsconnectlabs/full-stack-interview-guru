# 07_SESSION_HANDOVER.md

# Session Summary

- **Session Name:** Ebook Store + floating CTA — full validation pass, found + fixed an SPA-navigation
  bug (DECISIONS #043, on top of #041/#042)
- **Date:** 2026-08-21
- **Overall Progress:** Owner re-issued the "Ebook Store + Free Ebook CTA" brief in more detail,
  asking for a fresh, thorough validation (exact 10s trigger, both viewports, screenshots, click/dismiss
  persistence, analytics). The "Guru's Picks" → "Ebook Store" rebrand and floating-CTA visual refresh
  from the prior two sessions (#041, #042) were already implemented and matched this brief closely, so
  this session's work was almost entirely **re-verification** — which paid off: testing the click path
  via an actual `Link` click (rather than a full-page reload, which is how earlier passes had checked
  it) surfaced a real bug, described below, that was fixed and re-verified.
- **Release Status:** ✅ Implemented, bug found and fixed, and re-verified locally (TypeScript clean,
  production build green, exercised at both required viewports). **Not committed/pushed yet** —
  awaiting owner review; all three sessions' work (#041, #042, #043) sits together in one uncommitted
  working tree.

---

# Bug Found + Fixed This Session

**Symptom:** `EbookFloatingCta` is mounted once in the root layout (`app/layout.tsx`), so — standard
Next.js App Router behavior — it is never remounted on client-side route changes; its React state
persists across navigation. `handleClick` wrote `sessionStorage` and fired `ebook_cta_click` but never
reset the component's `visible` state. Result:
1. Clicking the CTA soft-navigates to `/store`, but the card kept rendering **on `/store` itself**
   right after the click (directly violating "never show the CTA on the destination page").
2. Navigating away from `/store` to any other page afterward made the stale `visible=true` state
   resurface the card immediately — no 10s wait, no fresh impression — on whatever page came next.

Dismiss was unaffected (`handleDismiss` already called `setVisible(false)`).

**Fix (`components/EbookFloatingCta.tsx`):**
- `handleClick` now calls `setVisible(false)`, mirroring `handleDismiss`.
- Render guard changed from `if (!visible) return null;` to
  `if (!visible || pathname.startsWith("/store")) return null;` as a defensive second layer.

**Re-verified** via real `Link` clicks dispatched through React's event system (not `navigate()`
reloads): home → wait 10s → click CTA → `/store` (0 CTA elements in DOM, was rendering before the fix)
→ click through to `/candidate` (0 CTA elements, was resurfacing before the fix). Same result for the
dismiss path → `/interviewer` (0 elements, no regression — this path was already correct). Full
desktop/mobile 10s-trigger and positioning checks re-run after the fix, all still pass.

---

# Implementation Summary (recap — mostly already in place from prior sessions)

- **`app/store/page.tsx`** — Ebook Store hero rendered from `storeProducts[0]` (real title/subtitle/
  audience, `🆓 Free` + `📘 Ebook Store` chips, `GumroadCtaButton`); existing trust cards, detailed
  `StoreProductCard`, and "More resources are on the way" teaser preserved, copy reworded off "Guru's
  Picks". Same `/store` URL, same Gumroad flow.
- **`Navbar`, `Footer`, `app/page.tsx` homepage card** — "Guru's Picks" → "📘 Ebook Store" everywhere.
- **`components/EbookFloatingCta.tsx`** — 10s-delayed, `sessionStorage`-capped floating CTA; desktop
  card shows the real ebook cover thumbnail with a one-shot `cta-settle` entrance animation
  (`tailwind.config.ts`, `animation-iteration-count: 1`, `motion-safe:` only — no GIF, none exists and
  CSS achieves the same "attract then settle" effect); mobile pill unchanged; three GA4 events
  (`ebook_cta_impression`/`_click`/`_dismiss`) preserved from #041, plus this session's `visible`-reset
  fix.

---

# Verification Summary

- ✅ **TypeScript:** clean (`npx tsc --noEmit`), re-run after the fix.
- ✅ **Production build:** green — 355 pages, shared First Load JS unchanged at 102 kB. Re-run after
  the fix.
- ⚠️ **ESLint:** not configured in this project (`npm run lint` opens `next lint`'s interactive
  first-time setup wizard rather than running a check) — matches `CLAUDE.md`'s documented standing
  gates (`tsc` + `build` only). Did not scaffold a new config; out of scope for this feature.
- ✅ **In-browser (dev server, `guru-dev`), desktop 1280×720:**
  - CTA appears at exactly 10s; card measures 280×98px, right edge at x=1246 / bottom at y=704 (fully
    inside the 1280×720 viewport), top at y=606 (header bottom is y=65 — no overlap).
  - Shows the real ebook cover thumbnail (`/_next/image?url=...top-50-java-interview-qa-cover.png...`)
    with `animation-name: cta-settle`, `animation-iteration-count: 1` (one-shot, confirmed not
    looping).
  - Copy: "Get our FREE Ebook" heading, "Prepare smarter for your next interview →" link.
  - Dismiss removes it from the DOM entirely; click navigates to `/store` and — after the fix — leaves
    **zero** CTA elements in the DOM on the destination page and on the next page visited after that.
- ✅ **In-browser, mobile 375×812:**
  - Pill appears at 10s, 169×54px, bottom-right, fully inside viewport (bottom y=804 < 812); desktop
    card's computed `display` is `none` at this width — variants confirmed mutually exclusive.
  - Click → `/store`, 0 CTA elements remaining; dismiss verified working same as desktop.
- ✅ **`/store` (Ebook Store):** breadcrumb reads "Home / Ebook Store"; hero shows the real ebook
  title/subtitle/audience and a working Gumroad CTA; `Navbar`/`Footer` show "📘 Ebook Store"; CTA never
  appears here even after waiting 10s+ on the page directly.
- ✅ **No console errors or hydration warnings** observed in any of the above.
- ⚠️ **Screenshots not captured** — this session's Browser pane could not composite frames
  (`screenshot`/`zoom` both time out with "the Browser pane is not displayed"), an environment/session
  limitation, not a code issue. Substituted precise `getBoundingClientRect`/`getComputedStyle` DOM
  verification at both required viewports instead (see above) — every number the owner asked to see
  visually was captured numerically.
- ⏳ **Not yet done:** live GA4 event verification (`sendGAEvent` no-ops locally without
  `NEXT_PUBLIC_GA_ID`, by design) — belongs after the commit/push decision.

---

# Current Architecture Status

- **Stack:** Next.js 15.5.19 (App Router) · TypeScript (strict) · React 19 · Tailwind v3 · SSG.
- **No new routes, no backend, no new dependency.** This session only edited
  `components/EbookFloatingCta.tsx` (two small logic changes) and this doc set — no other source files
  touched.

---

# Current Roadmap Status

- **This session** — ✅ bug found, fixed, and verified; **pending owner review + commit/push**, stacked
  on the still-uncommitted #041/#042 work. See [06_CHANGELOG.md](./06_CHANGELOG.md) "Unreleased" →
  "Fixed (Floating ebook CTA reappearing after client-side navigation, DECISIONS #043)".
- **Follow-up (not started, owner's call):** once `NEXT_PUBLIC_GA_ID` is live in production, confirm
  `ebook_cta_*` and `gumroad_cta_click` register correctly in GA4; if real visual screenshots are
  needed for review, they'll need to be captured outside this session's Browser pane (e.g. locally, or
  in a session where the pane can display).
