# RELEASE_CHECKLIST.md

# FIG — Release / Milestone Checklist

Run before considering a **project version or milestone** complete (e.g. cutting a release or
closing a phase). This is broader than per-feature verification.

---

## Code health
- [ ] `npx tsc --noEmit` clean.
- [ ] `npm run build` green; **251 static pages** (or the expected count if content changed).
- [ ] No console errors/warnings across key routes (home, candidate, category, question, feedback).
- [ ] `package.json` version bumped intentionally and matches the docs version.

## Quality gates (per-feature checklists all passed)
- [ ] [IMPLEMENTATION_CHECKLIST](./IMPLEMENTATION_CHECKLIST.md) passed for all shipped items.
- [ ] [SEO_CHECKLIST](./SEO_CHECKLIST.md) passed — canonicals, structured data, sitemap intact.
- [ ] [ACCESSIBILITY_CHECKLIST](./ACCESSIBILITY_CHECKLIST.md) passed.

## Performance
- [ ] First Load JS reviewed; shared chunks stable (~102 kB) unless justified.
- [ ] Lighthouse target **95+** validated (perf, a11y, best-practices, SEO) — record scores.
- [ ] Core Web Vitals acceptable.

## SEO surface
- [ ] `sitemap.xml` + `robots.txt` correct for the target domain (`NEXT_PUBLIC_SITE_URL`).
- [ ] Structured data validated in the Rich Results Test (no errors).
- [ ] Canonical domain and Open Graph URLs resolve on production.

## Branding & PWA
- [ ] Favicon (SVG), Apple Touch Icon, and web manifest resolve; theme-color correct.
- [ ] Browser tab titles follow the branded pattern.

## Config & environment
- [ ] Required env vars documented/set (`NEXT_PUBLIC_SITE_URL`, analytics/AdSense IDs, contact/
      feedback endpoint) — analytics/ads stay off until IDs are set.
- [ ] No secrets committed; no stack traces exposed to users.

## Documentation
- [ ] `05_ROADMAP.md`, `06_CHANGELOG.md`, `07_SESSION_HANDOVER.md`, `04_ARCHITECTURE.md`
      reflect the release.
- [ ] All **Last Updated** timestamps refreshed; version blocks consistent.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 11:15 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
