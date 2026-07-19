# ACCESSIBILITY_CHECKLIST.md

# FIG — Accessibility Validation Checklist

**Accessibility is mandatory** (DECISIONS #013). Run this for every change that adds or alters
interactive controls, content structure, or color.

---

## Semantics & structure
- [ ] Correct semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`, `<ul>/<ol>`, `<button>`,
      `<a>`).
- [ ] One `<h1>` per page; heading levels are hierarchical (no skipped levels).
- [ ] Landmarks present; lists used for grouped items.

## Keyboard
- [ ] All interactive elements reachable and operable by keyboard (Tab/Shift-Tab/Enter/Space).
- [ ] Logical focus order; no keyboard traps.
- [ ] **Visible focus** states on every control (`focus-visible` rings present).

## Names, roles, states (ARIA — only where needed)
- [ ] Interactive controls have accessible names (visible text or `aria-label`).
- [ ] Decorative emoji/icons are `aria-hidden="true"` so they don't pollute the accessible name.
- [ ] Toggle/selected states expose `aria-pressed` / `aria-current` as appropriate.
- [ ] Async/status changes announced via `aria-live` (e.g. "Link copied").
- [ ] Sections that need labelling use `aria-labelledby`/`aria-label`.

## Forms (feedback / report issue)
- [ ] Every field has an associated `<label>`.
- [ ] Validation messages are clear and programmatically associated.
- [ ] Attached context (e.g. reported question) is visible to the user.

## Color & contrast
- [ ] Text/background contrast meets **WCAG AA** (4.5:1 body, 3:1 large text).
- [ ] Information is not conveyed by color alone.
- [ ] Re-verify contrast in **both** themes after the light/dark migration (H3/H4).

## Media & motion
- [ ] Images have meaningful `alt` (or empty `alt` if decorative).
- [ ] Animations are subtle; respect reduced-motion where applicable.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 11:15 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
