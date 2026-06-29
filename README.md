# Full Stack Interview Guru

> Interview Tomorrow? Start Here.

A distraction-free interview prep platform for **candidates** and **interviewers**.
No login, no popups, no cookie banners, no dark patterns — just interviews.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **TailwindCSS** (dark mode by default)
- Static, content-driven pages — **no backend, no database, no auth**
- Deploys to **Vercel** out of the box
- Google Analytics + AdSense are wired up but **off until you set IDs**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
```

## Project structure

```
app/
  page.tsx                  Home — hero, search, popular, revision modes, categories
  candidate/page.tsx        Candidate Mode — all topics
  candidate/[category]/     Topic detail with sample questions
  q/[slug]/                 Question page (Coffee Chat / Mind Map / Hands-on / What If)
  interviewer/page.tsx      Interviewer Mode — kits + rubric per tech & experience
  sitemap.ts, robots.ts     SEO
components/                 Navbar, Footer, SearchBar, CodeBlock, QuestionCard, AdSlot, Analytics
lib/
  categories.ts             18 categories with counts & topics
  questions.ts              Question content (typed) — add more here
  interviewer.ts            Interviewer kits per technology & experience
  search.ts                 Instant client-side search index
```

## Adding a question

Append a typed object to `lib/questions.ts`. Each question carries its four
sections (`mindMap`, `handsOn`, `whatIf`), difficulty, experience, "asked in"
companies, and related slugs. New questions are automatically indexed for search,
listed under their category, and added to the sitemap.

> Content is stored as typed data for speed and type-safety. Swapping in Markdown
> files later only changes the data layer — pages stay the same.

## Analytics & ads

Set in `.env.local` or Vercel env vars:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

Ads only render **below articles** and **in the sidebar** — never inside content.

## Donate & feedback (no backend)

Both features are fully static and provider-agnostic — see `.env.example`.

**Donate** (`/donate`): set any of these and the matching button appears; leave all
blank for a graceful "coming soon" state. A **Phase 2: Guru Pro** teaser advertises the
planned premium tier.

```
NEXT_PUBLIC_BMC_URL=          # Buy Me a Coffee
NEXT_PUBLIC_KOFI_URL=         # Ko-fi
NEXT_PUBLIC_GITHUB_SPONSORS=  # GitHub Sponsors
NEXT_PUBLIC_PAYPAL_URL=       # PayPal
NEXT_PUBLIC_UPI_ID=           # India UPI id
```

**Feedback** (`/feedback` + a "Was this helpful?" widget on every question):

```
NEXT_PUBLIC_CONTACT_EMAIL=         # used for the mailto fallback
NEXT_PUBLIC_FEEDBACK_ENDPOINT=     # optional Formspree/Formspark/Basin URL
```

If `NEXT_PUBLIC_FEEDBACK_ENDPOINT` is set, the form (and per-question 👍/👎 votes) POST
JSON there. If it's blank, the form falls back to opening the user's email client — so it
works with zero setup. All config is `NEXT_PUBLIC_*` (public by nature, no secrets).

## Deploy

Push to GitHub and import into Vercel — zero config. Or:

```bash
npm i -g vercel && vercel
```

## Roadmap (not implemented)

Bookmarks · Login · Premium · PDF export · Mock interviews · AI interviewer ·
Resume analyzer · Voice interview.
