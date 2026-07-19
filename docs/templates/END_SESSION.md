# END_SESSION.md

# FullStackInterviewGuru (FIG) — End-of-Session Workflow

A living template for **ending every development session**. Keep it in sync whenever the agreed
workflow evolves. The goal: leave the project green, documented, and ready for the next session.

---

## Step 1 — Project health verification

Confirm the project is in a healthy, shippable state:

- ✓ TypeScript passes (`npx tsc --noEmit`)
- ✓ Production build succeeds (`npm run build`) — record page count + First Load JS
- ✓ No console errors/warnings
- ✓ Accessibility, responsiveness, dark mode, SEO, and structured data intact
- ✓ First Load JS delta and bundle impact recorded

Use the [IMPLEMENTATION_CHECKLIST](../checklists/IMPLEMENTATION_CHECKLIST.md),
[SEO_CHECKLIST](../checklists/SEO_CHECKLIST.md), and
[ACCESSIBILITY_CHECKLIST](../checklists/ACCESSIBILITY_CHECKLIST.md).

---

## Step 2 — Documentation synchronization

Ensure the docs reflect reality (docs are the long-term memory):

- `05_ROADMAP.md` — move the completed item to done; keep committed-work-only.
- `06_CHANGELOG.md` — add an entry (what changed, why, verification results, JS/bundle impact).
- `04_ARCHITECTURE.md` — update only if the architecture actually changed.
- `02_DECISIONS.md` — add a numbered decision only if a new engineering decision was made.
- `99_IDEAS_BACKLOG.md` — record any new ideas discussed but not approved.

---

## Step 3 — Session handover (`07_SESSION_HANDOVER.md`)

Rewrite the handover with this session's reality. Include:

- **Session Name**
- **Date**
- **Features Completed**
- **Files Created**
- **Files Modified**
- **Documentation Updated**
- **Verification Results**
- **Current Architecture Status**
- **Current Roadmap Status**
- **Current Project Health**
- **Known Limitations**
- **Important Decisions** (that must never change)
- **Recommended First Task For The Next Session**
- **Notes For Future Developers / AI Assistants**

---

## Step 4 — Timestamp refresh

Refresh the **Last Updated** field in the Version Information block of **every** modified
document. Keep the numeric-prefix (`NN_NAME.md`) convention for any new doc.

---

## Step 5 — Final project summary

Provide a closing summary:

- Implementation summary
- Files created / modified
- Documentation updated
- Verification summary
- Performance impact / bundle impact
- Remaining roadmap
- Recommended next roadmap item

Then **stop** — do not start new work without explicit approval.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 11:15 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
