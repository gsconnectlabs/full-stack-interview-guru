# DECISIONS.md

# FullStackInterviewGuru (FIG)
## Product & Engineering Decisions

This document records the important architectural, product, branding, and engineering decisions made for the FullStackInterviewGuru (FIG) project.

It exists to ensure consistency across future development.

Unless explicitly changed, these decisions should be treated as approved project standards.

---

# Decision #001

## Title

Trust Before Revenue

### Status

✅ Approved

### Reason

Users trust platforms that prioritize learning over monetization.

Long-term trust creates long-term growth.

### Implementation

- No aggressive advertisements.
- No intrusive popups.
- No misleading clickbait.
- No forced registration.
- Majority of interview content remains free.

---

# Decision #002

## Title

Content First

### Status

✅ Approved

### Reason

Traffic comes from excellent content.

Not from fancy UI.

### Implementation

Priority order

1. High-quality interview questions
2. Topic clusters
3. Internal linking
4. SEO improvements
5. UI polish

---

# Decision #003

## Title

Brand Identity

### Status

✅ Approved

Official Brand

FullStackInterviewGuru

Public Brand

FIG

### Reason

FIG is short, memorable and suitable for browser tabs, favicon and branding.

The full name provides strong SEO value.

### Usage

Navigation

FIG

Browser Titles

FIG – Java Interview Questions

SEO

FullStackInterviewGuru

---

# Decision #004

## Title

Design Philosophy

### Status

✅ Approved

The website should feel

- Professional
- Minimal
- Calm
- Modern
- Premium

Avoid

- Visual clutter
- Flashy animations
- Heavy gradients
- Distracting effects

---

# Decision #005

## Title

Color System

### Status

✅ Approved

Primary Color

Teal

Secondary Color

Gold / Kaavi

Light Theme

White

Dark Theme

Deep Charcoal

Maintain consistent branding everywhere.

---

# Decision #006

## Title

Theme Behaviour

### Status

✅ Approved

Default Theme

Light

Dark Theme

Automatically follow

prefers-color-scheme

Do not ask users to switch themes manually.

---

# Decision #007

## Title

Question Page Standard

### Status

✅ Approved

Every interview page should contain

- Question
- Short Answer
- Detailed Explanation
- Real-world Example
- Interviewer's Expectation
- Common Mistakes
- Follow-up Questions
- Related Questions
- Difficulty
- Estimated Reading Time
- Last Updated
- Report Issue
- Share
- Copy Link

---

# Decision #008

## Title

AI Learning Section

### Status

✅ Approved

Every question page should include

Continue Learning with AI

Generate optimized prompts for

- ChatGPT
- Gemini
- Claude

Prompt Levels

- Beginner
- Intermediate
- Senior Engineer
- Architect

Include

Copy Prompt

---

# Decision #009

## Title

Learning Path

### Status

✅ Approved

Every page should connect to

- Previous Topic
- Next Topic
- Related Questions
- Topic Roadmap

Avoid orphan pages.

---

# Decision #010

## Title

Roadmaps

### Status

✅ Approved

Create visual learning roadmaps for

- Java
- Spring Boot
- REST API
- AWS
- SQL
- System Design
- JavaScript
- React
- Docker
- Kubernetes

---

# Decision #011

## Title

SEO Protection

### Status

✅ Approved

Never

- Change URLs unnecessarily
- Remove structured data
- Break indexing
- Remove internal links

Always maintain

- Meta tags
- Canonical URLs
- Breadcrumbs
- Q&A Schema
- Open Graph
- Sitemap

SEO must never be sacrificed for UI improvements.

---

# Decision #012

## Title

Performance

### Status

✅ Approved

Target

Lighthouse

95+

Goals

- Fast loading
- Minimal JavaScript
- Optimized fonts
- Optimized images
- Lazy loading

---

# Decision #013

## Title

Accessibility

### Status

✅ Approved

Support

- Keyboard navigation
- Screen readers
- ARIA labels
- Proper contrast
- Focus indicators
- Responsive layouts

Accessibility is mandatory.

---

# Decision #014

## Title

Browser Branding

### Status

✅ Approved

Implement

- favicon.ico
- SVG favicon
- Apple Touch Icon
- Android Icons
- Manifest
- Theme Color

Browser title examples

FIG – Java Interview Questions

FIG – REST API Interview Questions

FIG – Spring Boot Interview Questions

---

# Decision #015

## Title

Animation Policy

### Status

✅ Approved

Animations should be

- Fast
- Minimal
- Purposeful

Avoid

- Large motion
- Slow transitions
- Decorative animations

---

# Decision #016

## Title

Content Philosophy

### Status

✅ Approved

Content must teach concepts.

Never encourage memorization.

Focus on

Understanding

Reasoning

Real-world usage

Interview confidence

---

# Decision #017

## Title

Content Quality

### Status

✅ Approved

Every explanation should answer

- What?
- Why?
- How?
- When?
- Advantages
- Disadvantages
- Real-world usage
- Interview tips

---

# Decision #018

## Title

Current Content Priority

### Status

🚀 Active

Priority 1

- Java Collections
- Java Concurrency
- JVM
- REST API

Priority 2

- Spring Boot
- System Design
- AWS
- SQL

Priority 3

- JavaScript
- React
- Docker
- Kubernetes

---

# Decision #019

## Title

Community Features

### Status

Future Phase

Features

- Login
- Progress Tracking
- Bookmarks
- Practice History
- Daily Challenges
- Community Discussions
- Achievement Badges

Reason

Community comes after trust.

---

# Decision #020

## Title

Premium Features

### Status

Future Phase

Features

- AI Mock Interviews
- Resume Review
- Company Interview Packs
- Personalized Learning Paths
- Premium Analytics
- Offline Downloads

Reason

Revenue should never reduce the quality of the free learning experience.

---

# Decision #021

## Title

Revenue Strategy

### Status

Approved

Priority

1. Premium Membership
2. AI Services
3. Resume Review
4. Affiliate Recommendations
5. Recruiter Services
6. Limited Advertisements

No intrusive ads.

---

# Decision #022

## Title

Engineering Philosophy

### Status

Approved

Prefer

- Simplicity
- Readability
- Reusability
- Maintainability

Avoid

- Overengineering
- Duplicate code
- Premature optimization

---

# Decision #023

## Title

Long-Term Vision

### Status

Approved

Build a platform comparable in professionalism to the world's leading learning platforms while maintaining

- Better readability
- Cleaner UI
- Fewer distractions
- Higher trust
- Better learning experience

---

# Decision #024

## Title

Definition of Success

### Status

Approved

Success is NOT

- More pages
- More traffic
- More ads

Success IS

- Better interview preparation
- Returning users
- User recommendations
- Higher trust
- Better learning outcomes

---

# Decision #025

## Title

Project Motto

### Status

Approved

> Learn Deeply.
>
> Interview Confidently.
>
> Grow Continuously.

---

# Decision #026

## Title

Monetization Strategy Retained

### Status

✅ Approved (Owner-confirmed 2026-07-18)

### Reason

The Amazon Featured Products, Donate section, and AdSense placeholders are intentional and non-intrusive. They align with FIG's long-term monetization strategy.

### Implementation

- Featured Products, Donate/UPI, and AdSense placeholders remain unchanged.
- They must stay non-intrusive and never interrupt reading (per Decision #001 / #021).
- Resolves ROADMAP item L3 — no changes to monetization placement at this time.

---

# Decision #027

## Title

Learning Section Names Retained + Professional Subtitles

### Status

✅ Approved (Owner-confirmed 2026-07-18)

### Reason

The labels "☕ Coffee Chat", "🧠 Mind Map", "⌨ Hands-on", and "🔥 What If" are part of FIG's unique learning experience and branding.

### Implementation

- Do NOT rename or replace these section labels.
- Improvement (presentation only): add professional subtitles / short descriptions beneath the labels where appropriate. Content is unchanged.
- Updates/replaces ROADMAP item L2 (no renaming; subtitle enhancement approved).

---

# Decision #028

## Title

Maintainability Scope — Consolidate Real Duplication, Don't Add Empty Structure

### Status

✅ Approved (Owner-approved M4, 2026-07-19)

### Reason

CLAUDE_INSTRUCTIONS documents a `/hooks`, `/types`, `/constants` folder structure, and ROADMAP M4
called to "introduce them **where they add value**." Engineering philosophy (DECISIONS #022)
forbids over-engineering. Creating empty/token folders to match a template adds complexity without
benefit; consolidating genuine duplication does.

### Implementation

- **Did:** extracted the duplicated category card into a reusable **`TopicCard`** (server component)
  used by the homepage + candidate index; introduced the **`/hooks`** folder with a real hook,
  **`useTemporaryFlag`**, extracted from the identical "copied" pattern in `CopyButton`/`ShareButton`.
- **Deferred (intentionally):**
  - **`/types`** — `lib/types.ts` already serves as the shared types module; relocating it is churn
    across its import sites with no behavior or maintainability gain. Revisit only if types grow
    enough to warrant a dedicated top-level folder.
  - **`/constants`** — no genuine cross-file constant exists today; an empty folder would be
    over-engineering. Introduce it when a real shared constant appears.
  - **`SearchBar` → `SearchBox` rename** — the component is already internally consistent; a rename
    is pure churn. The CLAUDE_INSTRUCTIONS example list is illustrative, not binding on the name.
- **Rule going forward:** add a shared folder/abstraction **when there is real content for it**, not
  to satisfy a template. Any such refactor must be behavior-preserving (verified by TS + build).

---

# Decision #029

## Title

Tertiary-Text Contrast (slate-500) Deferred to the H3/H4 Theme-Token Migration

### Status

✅ Approved (M5 accessibility audit, 2026-07-19)

### Reason

The M5 audit measured contrast across the (dark-only) UI. **Primary and secondary text passes WCAG
AA comfortably** (slate-300 ≈ 13:1, slate-400 ≈ 7.3–7.7:1). **Tertiary muted `slate-500` labels**
(taglines, copyright, small meta labels) are ≈ **4.1:1** — below AA 4.5:1 for normal text, though
above 3:1 (AA for large text). These are supplementary, not essential content.

ROADMAP M5 explicitly calls for AA contrast "**especially after the theme work**," and the Ideas
Backlog already carries a "Full WCAG AA audit after the theme migration." A site-wide `slate-500`
recolor now would be a broad visual change (the muted tone is part of the current aesthetic) and
would preempt the token-based **H3/H4** migration, where the whole palette is re-tokenized and must
be AA-verified in both light and dark.

### Implementation

- **Now (M5):** shipped the structural/ARIA/focus fixes; primary/secondary contrast already passes AA.
- **Deferred to H3/H4:** raise `slate-500`-class tertiary text to meet AA 4.5:1 as part of the CSS
  design-token migration, verified in both themes. Do **not** do an ad-hoc global recolor before then.
- This is a scope decision, not a dismissal — the item is tracked and must be resolved in H3/H4.

---

# Decision #030

## Title

System-Font Stack Retained — `next/font` Intentionally Not Introduced

### Status

✅ Approved (M6 Lighthouse verification, 2026-07-19)

### Reason

ROADMAP M6 lists "optimize fonts (`next/font`)" as a candidate task. The audit found the app already
uses a **system-font stack** (`--font-sans: ui-sans-serif, system-ui, …` in `globals.css`) with **no
web fonts, no Google Fonts, and no `@font-face`**. System fonts are already optimal for Core Web
Vitals: **zero font download, zero render-blocking, zero layout shift** from font swap. Lighthouse
Performance is **100** with **CLS 0** / **TBT 0 ms**.

Introducing `next/font` (even self-hosted) would **add** a font file to download and parse — a net
regression for performance and CWV — for a purely stylistic change the design does not call for.

### Implementation

- Keep the system-font stack; do **not** add `next/font` or any web font.
- If a brand web font is ever desired, treat it as a deliberate design decision (with its own
  approval) and load it via `next/font` with subsetting + `display: swap`, then re-verify CWV.
- This supersedes the "optimize fonts via `next/font`" suggestion in ROADMAP M6.

---

# End of Document

This document should be updated whenever a major architectural or product decision is approved.

All AI assistants and future contributors should follow these decisions unless explicitly instructed otherwise.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-19 22:00 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M