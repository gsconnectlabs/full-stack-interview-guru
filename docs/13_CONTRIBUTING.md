# CONTRIBUTING.md

# FullStackInterviewGuru (FIG) — Contribution & Workflow Guide

This is the operational guide for making changes to FIG. It summarizes and points to the
binding standards in [03_CLAUDE_INSTRUCTIONS.md](./03_CLAUDE_INSTRUCTIONS.md),
[02_DECISIONS.md](./02_DECISIONS.md), and [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md).

**The `/docs` directory is the single source of truth.** Read the relevant document
before implementing any feature.

---

## Golden Rules (non-negotiable)

- Never change URLs without approval. Never break SEO. Never remove existing features.
- Never redesign because something "looks better." Improvements must be measurable.
- Prefer incremental improvements over rewrites. Reuse existing components.
- Prefer the solution that is simpler, more maintainable, faster, more accessible,
  better for SEO, and more scalable.
- No unnecessary complexity. No unrelated refactors. No duplicated functionality.

A change is only worth making if it improves at least one of: **Learning Experience,
UX, Performance, Accessibility, SEO, Maintainability, Scalability.**

---

## Implementation Workflow (strict)

1. **Analyze first — do not modify code immediately.**
2. Propose the plan and wait for explicit approval.
3. Implement **one feature at a time**. For each approved feature:
   - Explain the implementation plan and list files that will change.
   - Write production-ready code (reuse components; keep them small and typed).
   - Preserve existing functionality, SEO, accessibility, and responsiveness.
   - Verify TypeScript and a successful production build.
4. **Stop and wait for approval before starting the next feature.**

### Build/verify note (project-specific)
- Do **not** run `npm run build` while the dev/preview server is running — both write to
  `.next` and a production build corrupts the dev server (`Cannot find module './124.js'`).
  Stop the dev server first, or verify via the running dev server.

---

## Definition of Done (per feature)

Confirm all before considering work complete:

- ✓ Mobile, tablet, desktop layouts intact (no horizontal scroll)
- ✓ Dark theme supported (and light, once the theme system lands)
- ✓ Accessibility: keyboard, focus states, ARIA, contrast, semantic HTML
- ✓ Performance maintained (minimal JS, no unnecessary client components)
- ✓ SEO intact: canonicals, titles/descriptions, structured data, sitemap, no dead links
- ✓ No duplicated code; reusable implementation
- ✓ TypeScript passes; production build succeeds

---

## Adding Content (questions/categories)

- Append typed `Question` objects to a `lib/questions-extra/*` file; a new category goes
  in `lib/categories.ts`. Search, sitemap, and structured data update automatically.
- Keep slugs unique (validate before building). Follow the content standard in
  DECISIONS #007 and #017 (What/Why/How/When, real-world usage, interview tips).
- Ordered easy → hard within a batch. Never modify existing questions when adding new ones.

---

## Changing a Documented Decision

Do **not** silently change an approved decision, architecture, or standard. Propose the
change, wait for approval, then update the relevant `/docs` file (and `06_CHANGELOG.md`)
**before or alongside** the code change.

---

## Documentation Convention

- **Numeric-prefix filenames.** All docs in `/docs` use `NN_NAME.md` so they sort into a logical
  reading order. Current set:
  `01_PROJECT_CONTEXT` · `02_DECISIONS` · `03_CLAUDE_INSTRUCTIONS` · `04_ARCHITECTURE` ·
  `05_ROADMAP` · `06_CHANGELOG` · `07_SESSION_HANDOVER` · `13_CONTRIBUTING` · `99_IDEAS_BACKLOG`.
  Reserved (create with these exact names when needed): `08_DEPLOYMENT`, `09_TECH_STACK`,
  `10_ENVIRONMENT`, `11_BUSINESS_VISION`, `12_OWNER_MANUAL`. **Any new doc must follow this
  convention**, and internal cross-links must use the numbered filename.
- **Every doc ends with a Version Information block** (Version, Last Updated, Project, Status,
  Owner). Refresh **Last Updated** whenever you modify a doc.

## Ideas vs. Roadmap

- **`05_ROADMAP.md` holds committed work only.** Any idea that is discussed but **not yet
  approved** goes into **`99_IDEAS_BACKLOG.md`** (the Innovation Parking Lot) — never straight
  into the roadmap.
- Each backlog entry records: Title, Description, Why it is valuable, Status
  (`Idea` / `Under Discussion` / `Approved` / `Rejected` / `Moved to Roadmap`), and Date Added.
- When an idea is approved and scheduled, **move it into the roadmap** and set its backlog Status
  to **Moved to Roadmap** (preserve the entry — do not delete history).

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-18 23:30 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
