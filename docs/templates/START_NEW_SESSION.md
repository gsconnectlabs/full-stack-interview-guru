# START_NEW_SESSION.md

# FullStackInterviewGuru (FIG) — Start-of-Session Workflow

A living template for **beginning every development session**. Keep it in sync whenever the
agreed workflow evolves. `/docs` is the single source of truth — chat history is temporary.

---

## Step 1 — Read the documentation (in order)

Treat all of the following as the project's long-term memory. Read what exists; skip what
doesn't (reserved slots may be absent).

1. `01_PROJECT_CONTEXT.md`
2. `02_DECISIONS.md`
3. `03_CLAUDE_INSTRUCTIONS.md`
4. `04_ARCHITECTURE.md`
5. `05_ROADMAP.md`
6. `06_CHANGELOG.md`
7. `07_SESSION_HANDOVER.md`
8. `08_DEPLOYMENT.md` *(if available)*
9. `09_TECH_STACK.md` *(if available)*
10. `10_ENVIRONMENT.md` *(if available)*
11. `11_BUSINESS_VISION.md` *(if available)*
12. `12_OWNER_MANUAL.md` *(if available)*
13. `13_CONTRIBUTING.md` *(if available)*

Also review:
- `99_IDEAS_BACKLOG.md` — future ideas intentionally **not** in the roadmap.
- `docs/templates/START_NEW_SESSION.md`, `docs/templates/END_SESSION.md`
- `docs/checklists/` — `IMPLEMENTATION_CHECKLIST.md`, `SEO_CHECKLIST.md`,
  `ACCESSIBILITY_CHECKLIST.md`, `RELEASE_CHECKLIST.md`

---

## Step 2 — Analyze the project

Provide a concise assessment covering:

- Current project status
- Current architecture
- Completed roadmap items
- Remaining roadmap items
- Engineering quality
- Documentation quality
- Project maturity
- Technical debt (if any)
- Important engineering decisions that must never change
- Documentation inconsistencies (if any)

Do **not** implement anything during analysis.

---

## Step 3 — Roadmap review & recommendation

- Recommend **exactly one** roadmap item for the session.
- If a different item should come first, explain why.
- The roadmap holds **committed work only**. Never promote an idea to the roadmap without
  explicit approval — record new ideas in `99_IDEAS_BACKLOG.md` instead.

---

## Step 4 — Approval gate

**Stop and wait for explicit owner approval** before writing any code. Never assume
requirements — if anything is unclear, ask first.

---

## Step 5 — Implementation rules (once approved)

- Implement **only** the one approved roadmap item. Never combine items.
- No unrelated refactoring. No UI redesign unless explicitly requested.
- **Never** change URLs, reduce SEO, reduce accessibility, reduce performance, or remove
  existing functionality.
- Prefer **extending existing components** over creating duplicates.
- Keep the architecture modular, maintainable, and **static-first**.
- Preserve responsiveness and dark-mode behavior.

---

## Step 6 — Verification checklist

Run the full [IMPLEMENTATION_CHECKLIST](../checklists/IMPLEMENTATION_CHECKLIST.md). At minimum:

✓ TypeScript · ✓ Production Build · ✓ Accessibility · ✓ Responsiveness · ✓ Dark Mode ·
✓ SEO · ✓ Structured Data · ✓ Performance · ✓ First Load JS delta · ✓ Bundle impact ·
✓ Console Errors

> **Build note:** never run `npm run build` while the dev/preview server is live — both write
> to `.next` and a production build corrupts the dev server (`Cannot find module './124.js'`).
> Stop the dev server first.

---

## Step 7 — Documentation update workflow

After verification passes, update:

- `05_ROADMAP.md` (mark the item complete)
- `06_CHANGELOG.md` (log the change + verification results)
- `04_ARCHITECTURE.md` *(if architecture changed)*
- `02_DECISIONS.md` *(only if a new engineering decision was made)*
- `07_SESSION_HANDOVER.md` (see [END_SESSION.md](./END_SESSION.md))

Refresh the **Last Updated** timestamp on every modified document.

---

## Step 8 — Stop

Deliver the final summary and **stop**. Do not begin another roadmap item until the owner
explicitly approves it.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 11:15 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
