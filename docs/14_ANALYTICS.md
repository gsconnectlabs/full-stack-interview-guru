# 14_ANALYTICS.md

# FullStackInterviewGuru (FIG) — Analytics

This document describes how Google Analytics 4 (GA4) is integrated in FIG, how to configure and
test it, and the events planned for the future. It complements
[04_ARCHITECTURE.md](./04_ARCHITECTURE.md) (Analytics section) and the decision record in
[02_DECISIONS.md](./02_DECISIONS.md) (#031, #032).

---

## Purpose

- Understand **traffic and audience** (page views, sessions, geography, devices) to guide the
  content roadmap (which topics/categories deserve more questions) without compromising the
  distraction-free, trust-first experience (DECISIONS #001).
- Provide a **privacy-respecting** baseline: GA4 anonymizes IP by default; no personal data is
  collected by FIG, no login exists, and the Privacy Policy already discloses Google Analytics and
  AdSense cookie usage (`app/privacy/page.tsx`).
- Stay **off by default in source** — analytics only runs where an ID is configured (production),
  never leaking into local dev or the committed repo (DECISIONS #031/#032).

---

## Integration Approach

FIG uses the **official Next.js integration, `@next/third-parties/google`** — the framework's
recommended way to load Google Analytics on the App Router.

- **Why this approach:** it loads `gtag.js` **once**, automatically tracks App Router client-side
  route changes as `page_view` events, and removes hand-maintained inline `gtag` script. It is the
  supported, minimal-maintenance path on Next.js 15. (It replaced an earlier manual `gtag.js`
  `<Script>` loader — see DECISIONS #032. There is **no duplicate GA initialization**.)
- **Dependency:** `@next/third-parties`, versioned in lockstep with `next` (currently `15.5.19`).
- **IP anonymization:** automatic in GA4 — no explicit flag is set or needed.
- **AdSense is separate:** the `adsbygoogle.js` loader and the `google-adsense-account` meta are
  independent of GA and were not changed by the GA4 migration.

### Data flow

```
NEXT_PUBLIC_GA_ID  ──►  lib/site.ts (gaId)  ──►  components/Analytics.tsx
                                                   └─ <GoogleAnalytics gaId={gaId} />  (only when gaId set)
                                                        └─ loads gtag.js once + page_view on route change
```

---

## Measurement ID Configuration

- **Production measurement ID:** `G-Q6XEJD7V69`.
- The ID is supplied **per-environment** via the `NEXT_PUBLIC_GA_ID` environment variable — it is
  **not committed** to the repo (DECISIONS #031: never commit GA IDs). `lib/site.ts` exposes it as
  `gaId = process.env.NEXT_PUBLIC_GA_ID || ""`, with **no default**, so GA stays **off until the var
  is set**.
- A GA4 measurement ID is technically public (it renders in page source), but FIG keeps it in env
  config so analytics never runs by accident in local dev or forks.

### Where to set it

| Environment | How |
|---|---|
| **Production / Preview (Vercel)** | Project → Settings → Environment Variables → add `NEXT_PUBLIC_GA_ID=G-Q6XEJD7V69`. Redeploy to take effect (`NEXT_PUBLIC_*` inline at build time). |
| **Local (optional)** | Create `.env.local` with `NEXT_PUBLIC_GA_ID=G-Q6XEJD7V69`. `.env.local` is gitignored. Prefer leaving it **unset** locally so dev traffic does not pollute the production GA property (or use a separate GA test property). |

> `NEXT_PUBLIC_*` variables are **build-time inlined** — changing the value requires a rebuild/redeploy.

---

## File Locations

| File | Role |
|---|---|
| `components/Analytics.tsx` | Renders `<GoogleAnalytics gaId={gaId} />` (gated on `gaId`) + the AdSense loader. Mounted once via the root layout. |
| `lib/site.ts` | `gaId` (env `NEXT_PUBLIC_GA_ID`, no default) and `adsenseClientId`. |
| `app/layout.tsx` | Root layout — renders `<Analytics />` once; also holds the `google-adsense-account` meta. |
| `.env.example` | Documents `NEXT_PUBLIC_GA_ID` (and the other public config vars). |
| `app/privacy/page.tsx` | Privacy Policy — discloses Google Analytics + AdSense cookie usage/opt-outs. |

---

## Deployment Notes

1. Set `NEXT_PUBLIC_GA_ID=G-Q6XEJD7V69` in Vercel (Production, and Preview if desired).
2. Redeploy (env vars inline at build time; a redeploy is required to pick up changes).
3. Verify on the live site (see **Testing** below). Realtime hits should appear in GA within seconds.
4. No `ads.txt`/consent changes are part of GA — those relate to AdSense (see the Ideas Backlog /
   AdSense follow-ups). For EEA/UK, evaluate a consent banner/CMP before enabling ads *and* before
   relying on GA advertising features.

---

## Testing Procedure

**Local / build sanity**
- `npx tsc --noEmit` — clean.
- `npm run build` — green; shared First Load JS unchanged (GA adds no bundle when the ID is unset).
  Do **not** run `npm run build` while a dev/preview server is live (corrupts `.next`).

**Runtime (with the ID set)**
1. Set `NEXT_PUBLIC_GA_ID` (Vercel, or a local `.env.local`) and start/deploy the app.
2. Open a page and confirm in DevTools:
   - Exactly **one** `https://www.googletagmanager.com/gtag/js?id=G-Q6XEJD7V69` script (no duplicates).
   - `typeof window.gtag === "function"` and `Array.isArray(window.dataLayer)` is `true`.
   - **No** `googletagmanager.com/gtm.js` request (FIG uses GA, not GTM).
   - The AdSense `adsbygoogle.js` script still loads (unaffected).
   - No hydration warnings / console errors.
3. In GA4 → **Reports → Realtime**, confirm your visit registers and that navigating between routes
   produces additional `page_view` events (SPA route-change tracking).

**Quick console check**

```js
Array.from(document.querySelectorAll('script[src]'))
  .filter(s => s.src.includes('googletagmanager.com/gtag/js')).length; // expect 1
```

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| No `gtag/js` script in the page | `NEXT_PUBLIC_GA_ID` not set for that environment, or not redeployed after setting it. Env vars inline at build time. |
| No data in GA | Wrong measurement ID; ad/tracker blocker active; brand-new property (allow a few minutes); viewing a non-deployed/local build with the ID intentionally unset. |
| Duplicate page views | A second GA loader was added elsewhere. GA must load **only** through `components/Analytics.tsx`; do not add another `<GoogleAnalytics>`/`gtag` snippet. |
| Route changes not counted | Confirm `@next/third-parties/google`'s `<GoogleAnalytics>` is used (it handles App Router route changes) — a plain `gtag.js` script does not. |
| Works locally but not in prod | Env var set only for one Vercel environment; add it to Production (and Preview) and redeploy. |
| AdSense stopped loading | Unrelated to GA — check `adsenseClientId`/`NEXT_PUBLIC_ADSENSE_ID`; the GA migration did not touch the AdSense loader. |

---

## Implemented Custom Events

| Event | Trigger | Params | Since |
|---|---|---|---|
| **`gumroad_cta_click`** | The Store's Gumroad CTA (`components/GumroadCtaButton.tsx`) is clicked on `/store` | `product` (slug), `destination` (`"gumroad"`) | DECISIONS #035, 2026-08-09 |

Implementation: `GumroadCtaButton` calls `sendGAEvent("event", "gumroad_cta_click", { product, destination })`
from `@next/third-parties/google` — the same package already loading GA, no new dependency. `sendGAEvent`
no-ops (with a console warning) when GA hasn't initialized, i.e. whenever `NEXT_PUBLIC_GA_ID` is unset —
consistent with the site-wide "off until an ID is present" behavior (DECISIONS #031/#032). No new
always-on client JS: the event only ships inside the one client island that needed it.

## Future GA4 Events (planned — not yet implemented)

The rest of the candidate events below are **not** implemented and require **separate owner approval**
before any code is written (they must remain lightweight and privacy-respecting, never degrading
performance or the reading experience):

| Event | Trigger | Example params |
|---|---|---|
| **Interview Question View** | A `/q/[slug]` page is viewed | `slug`, `category`, `difficulty` |
| **Search** | A query is run in the client search | `search_term`, `results_count` |
| **Category Selection** | A category/topic card is opened | `category` |
| **Feedback Submission** | Feedback form / "Was this helpful?" vote | `context`, `helpful` |
| **Donation Click** | A Donate option is clicked | `method` (UPI/BMC/Ko-fi/…) |
| **External Link Click** | Any outbound link click | `url`, `location` |
| **Amazon Affiliate Click** | A Featured Product card click | `product`, `tag` |
| **Outbound Link** | Non-affiliate outbound navigation | `url` |
| **Scroll Depth** | 25/50/75/100% of an article read | `percent`, `slug` |
| **Session Engagement** | Engaged-time / return visit signals | GA4 built-ins where possible |

Implementation guidance (for when approved): prefer GA4 recommended event names/params where they
exist; `sendGAEvent` from `@next/third-parties/google` is now the established pattern (see
`gumroad_cta_click` above) rather than a new typed helper; keep event wiring inside existing client
islands (no new always-on client JS); and document each event here as it ships.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-08-09 (first custom event — `gumroad_cta_click` on `/store`; DECISIONS #035)
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M
