# 99_IDEAS_BACKLOG.md

# FullStackInterviewGuru (FIG) — Ideas Backlog

**This document is NOT part of the roadmap.** It is FIG's permanent **Innovation Parking Lot**.

Any idea that is discussed but **not yet approved for implementation** is recorded here — never
in the roadmap. The roadmap (`05_ROADMAP.md`) contains **committed work only**. When an idea is
officially approved and scheduled, **move it into the roadmap** and update its Status here to
**Moved to Roadmap** (preserving its history) — do not delete it.

**Status values:** `Idea` · `Under Discussion` · `Approved` · `Rejected` · `Moved to Roadmap`

**Every entry uses:** Title · Description · Why it is valuable · Status · Date Added.

---

# Product Ideas

### Visual learning roadmaps
- **Description:** Dedicated roadmap pages / `RoadmapCard` for Java, Spring Boot, REST API, AWS, SQL, System Design, JavaScript, React, Docker, Kubernetes (guided learning journeys).
- **Why it is valuable:** Structured journeys, strong internal linking, and return visits; aligns with DECISIONS #010.
- **Status:** Idea *(migrated from ROADMAP "Future" F1 at session closure 2026-07-18)*
- **Date Added:** 2026-07-18

### Expand content to next-tier categories
- **Description:** Add flagship-quality question banks for Spring, Spring Boot, Design Patterns, JavaScript, TypeScript, React, Node.js, Docker, Kubernetes, Linux, Git, Jenkins, HR/Behavioral, and telephony (Amazon Connect, IVR, Cisco CVP, Avaya OD).
- **Why it is valuable:** Broadens SEO surface and learner coverage beyond the current 19 categories / 212 questions; content-first growth (DECISIONS #002).
- **Status:** Idea *(previously discussed during the flagship expansion; not yet committed)*
- **Date Added:** 2026-07-18

---

# UX Improvements

### Prev/Next question keyboard shortcuts
- **Description:** Once Prev/Next topic navigation (roadmap M2) lands, add optional keyboard shortcuts (e.g. `←`/`→`) to move between questions in a category.
- **Why it is valuable:** Faster study flow for power users; complements internal linking.
- **Status:** Idea
- **Date Added:** 2026-07-18

---

# UI Improvements

### Collapsible question sections
- **Description:** Allow long question sections (Mind Map, Hands-on, etc.) to collapse/expand for quicker scanning on mobile.
- **Why it is valuable:** Improves scannability without removing content; must stay accessible and not harm SEO (content must remain in the DOM).
- **Status:** Idea
- **Date Added:** 2026-07-18

---

# AI Feature Ideas

### "Explain like I failed this interview" prompt mode
- **Description:** An additional AI prompt preset that frames the topic as a post-mortem — what a candidate likely got wrong and how to recover.
- **Why it is valuable:** Extends the H2 "Continue Learning with AI" value with a distinctive, high-engagement angle; still static-first (a new template in `lib/ai-prompts.ts`).
- **Status:** Idea
- **Date Added:** 2026-07-18

### AI mock interviews (premium)
- **Description:** Interactive, AI-driven mock interview sessions (premium tier), per DECISIONS #020/#021 — only after trust is established.
- **Why it is valuable:** Monetization aligned with the trust-first model; natural extension of the AI-companion strategy.
- **Status:** Idea *(migrated from ROADMAP "Future" F3 at session closure 2026-07-18)*
- **Date Added:** 2026-07-18

---

# SEO Improvements

### FAQ / HowTo structured data where appropriate
- **Description:** Emit additional schema.org types (e.g. `FAQPage` for follow-up Q&A blocks) where content genuinely matches the type.
- **Why it is valuable:** Richer SERP results and CTR; extends the existing QAPage/BreadcrumbList coverage. Must be valid and non-spammy.
- **Status:** Idea
- **Date Added:** 2026-07-18

---

# Accessibility Improvements

### Full WCAG AA audit after the theme migration
- **Description:** Re-run a complete contrast + keyboard + screen-reader audit once light/dark tokens (H3/H4) land, since color changes ripple through every component.
- **Why it is valuable:** Accessibility is mandatory (#013); the theme migration is the highest-risk moment for contrast regressions.
- **Status:** Idea *(depends on roadmap H3/H4; the audit itself overlaps roadmap M5)*
- **Date Added:** 2026-07-18

---

# Performance Optimizations

### Self-hosted optimized fonts via `next/font`
- **Description:** Move to `next/font` with subsetting to trim font payload and eliminate layout shift.
- **Why it is valuable:** Better Core Web Vitals toward the Lighthouse 95+ target (#012). Overlaps roadmap M6; kept here as an idea until M6 is scoped.
- **Status:** Idea
- **Date Added:** 2026-07-18

---

# Monetization Ideas

### `ads.txt` for AdSense seller authorization
- **Description:** Serve an `ads.txt` (e.g. `public/ads.txt` or an env-driven route) declaring
  `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` once the AdSense publisher ID is issued.
- **Why it is valuable:** Google recommends `ads.txt` to authorize sellers and protect ad revenue; needed
  for serving (not strictly for approval). Deferred from the AR1 release since it needs the real pub ID and
  wasn't in the AR1 scope list.
- **Status:** Idea *(surfaced during AR1 — AdSense readiness, 2026-07-19)*
- **Date Added:** 2026-07-19

### Real contact/feedback backend (Formspree / Resend / route handler)
- **Description:** Replace the current mailto/`NEXT_PUBLIC_FEEDBACK_ENDPOINT` fallback with a hosted form
  backend so Contact and Feedback submissions are captured server-side (with spam protection).
- **Why it is valuable:** More reliable than mailto; enables analytics on inbound messages. Must stay
  privacy-respecting and not introduce auth/DB churn against the static-first model.
- **Status:** Idea *(surfaced during AR1, 2026-07-19)*
- **Date Added:** 2026-07-19

### Cookie-consent / CMP for AdSense (EEA/UK)
- **Description:** Add a Google-certified consent management platform (or IAB TCF CMP) to gate advertising
  cookies for EEA/UK visitors once ads actually serve.
- **Why it is valuable:** Required for compliant personalized ads in the EEA/UK; the current Privacy Policy
  documents cookie usage but there is no consent gate yet (none needed until live ads run).
- **Status:** Idea *(surfaced during AR1, 2026-07-19)*
- **Date Added:** 2026-07-19

### `/blog` section
- **Description:** A real blog/articles section; would let the footer "Blog" link (intentionally omitted in
  AR1 to avoid a dead link) become live.
- **Why it is valuable:** Fresh, indexable content for SEO and return visits (DECISIONS #002). Out of scope
  for AR1; needs its own content model + approval.
- **Status:** Idea *(surfaced during AR1, 2026-07-19)*
- **Date Added:** 2026-07-19

### Razorpay / Ko-fi donation options
- **Description:** Add Razorpay and/or Ko-fi alongside the current UPI-QR donation method.
- **Why it is valuable:** More donation channels. **Blocked:** both need GST + a business account the owner doesn't yet have; Razorpay also hides the raw VPA behind checkout. Revisit when the business account exists.
- **Status:** Under Discussion *(deferred; documented in project history)*
- **Date Added:** 2026-07-18

### Premium membership tier ("Guru Pro")
- **Description:** Paid tier with AI mock interviews, resume review, company packs, personalized paths, premium analytics, offline downloads (DECISIONS #020/#021).
- **Why it is valuable:** Primary long-term revenue, introduced only after trust is established.
- **Status:** Idea
- **Date Added:** 2026-07-18

---

# Future Research

### Community features (accounts, progress, bookmarks)
- **Description:** Login, progress tracking, bookmarks, practice history, daily challenges, discussions, badges (DECISIONS #019).
- **Why it is valuable:** Retention and personalization — but introduces backend/auth (a stack change), so it needs deliberate research first.
- **Status:** Idea *(migrated from ROADMAP "Future" F2 at session closure 2026-07-18)*
- **Date Added:** 2026-07-18

---

# Nice-to-Have Ideas

### PWA / offline support
- **Description:** Build on H1's manifest to make FIG installable and offline-capable; add dedicated 192/512 maskable PNG icons.
- **Why it is valuable:** Installable app feel and offline study; also closes the remaining browser-icon polish gap.
- **Status:** Idea *(migrated from ROADMAP "Future" F4 at session closure 2026-07-18)*
- **Date Added:** 2026-07-18

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 23:45 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
