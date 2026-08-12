# 07_SESSION_HANDOVER.md

# Session Summary

- **Session Name:** CE4 — Modern Java / Concurrency / Production Engineering question bank (25
  questions), implementation + review-driven correction pass
- **Date:** 2026-08-12
- **Overall Progress:** Owner requested the next batch of 25 Java interview questions, supplying an
  initial 25-topic pool and requiring Phase 1–4 analysis (repo inspection, existing-content inventory,
  duplicate detection, current-trend validation) before any content was written. Inventory of the full
  117-question Java corpus found nearly every proposed topic already had a canonical page, several at
  two depth levels. The batch was re-scoped to genuinely uncovered, current (Java 17–21+) senior/
  production topics and **presented to the owner with full rationale for approval before
  implementation** (per `CLAUDE.md`'s golden rule) — approved as proposed. Mid-implementation, the owner
  also required version-accurate handling of JEP 491 (`synchronized` virtual-thread pinning),
  `StructuredTaskScope`'s preview status, and `ConcurrentHashMap.size()` vs `mappingCount()` — all
  incorporated before writing the affected questions.

  After implementation, the owner asked for a full review-only summary of all 25 questions plus a
  critical pass (technical accuracy, version accuracy, duplicate/overlap, weak questions, answers to
  strengthen). Producing that review — which required reading full CE3 question text directly rather
  than relying on the original title-level duplicate check — surfaced two real overlaps and one
  version-accuracy gap that the original drafting had missed. The owner then directed a **scoped
  six-item correction pass**, executed the same day: two questions replaced/reframed, two corrected for
  accuracy, one deepened, and one **surgical** (not full-rewrite) correction to an already-live CE3
  question whose claim had become outdated relative to the new content.
- **Release Status:** ✅ Implemented, reviewed, corrected, and re-validated. **Not committed or
  pushed** — left for owner review per `CLAUDE.md` ("do not push unless explicitly asked").

---

# Implementation Summary

**New file:** `lib/questions-extra/java-8.ts` (`java8Extra`, 8 questions) — parallelStream production
pitfalls, Stream vs Collection semantics, Stream laziness/short-circuiting, pipeline-vs-loop cost,
`Collectors.toMap()` merge conflicts, `Optional` use/anti-pattern boundaries, method-reference vs lambda
performance, custom functional-interface design.

**Appended (existing files, append-only):**
- `java-collections.ts` (+3): Java 21 Sequenced Collections; `ConcurrentHashMap.size()` vs
  `mappingCount()`; `ConcurrentHashMap` atomic compound operations.
- `multithreading.ts` (+7): `StampedLock` optimistic reads; thread-pool exhaustion / bulkhead pattern;
  `thenApply` vs `thenApplyAsync` thread semantics; ThreadLocal caching under the virtual-thread mental
  model; `StructuredTaskScope` structured concurrency; `synchronized` virtual-thread pinning
  (JEP 491/Java 24); `CompletableFuture.orTimeout()` cancellation semantics.
- `jvm.ts` (+5): CDS/AppCDS cold-start; GraalVM Native Image trade-offs; JMH micro-benchmarking
  pitfalls; diagnosing high CPU via async-profiler/JFR; lambda/Stream closure memory leaks.
- `core-java.ts` (+2): primitive-stream (`IntStream`) object-creation cost; Records vs Lombok `@Value`.

**Wiring:** `lib/questions-extra/index.ts` — imported `java8Extra`, spread into `extraQuestions`,
updated header comment. No new schema fields — "Green Flags"/"Red Flags"/"Strong Candidate Answer" map
onto the existing `interviewerExpectation`/`commonMistakes`/`guruTake` fields.

**Category effect:** `java-8` goes **2 → 10 live**, crossing `MIN_LIVE_TO_LIST` (10) — flips to listed +
indexed + in the sitemap (same mechanism as CE1/CE2/CE3).

---

# Correction Pass Summary (same day, owner-directed, scoped to 6 items)

A review-only summary of all 25 questions, requested after implementation, required reading CE3's actual
question text rather than relying on the original Explore-agent title-level inventory. That direct
comparison — not present in the original Phase 2 duplicate check — surfaced the issues below.

1. **Q15 replaced.** `virtual-thread-executor-vs-pooled` restated CE3's `virtual-threads-pinning-structured`
   Semaphore/downstream-capacity guidance almost exactly. Replaced with **`threadlocal-caching-virtual-threads`**:
   virtual threads preserve ThreadLocal's per-request *correctness* (isolated storage per virtual thread)
   but silently defeat ThreadLocal-as-reuse-*cache* patterns (`ThreadLocal<SimpleDateFormat>`, scratch
   buffers), because a virtual-thread-per-task executor never reuses the same thread. No Semaphore/pooling
   content — genuinely distinct facet. Net zero change to question totals or `java-8`'s live count.
2. **Q18 reframed.** `completablefuture-timeout-ortimeout` kept its slug but now asks "What actually
   happens to the underlying work when `CompletableFuture.orTimeout()` fires?" — `orTimeout()` only flips
   the future's own completion state; the underlying computation keeps running on its executor, and
   `CompletableFuture.cancel()`'s `mayInterruptIfRunning` is documented to have **no effect** (unlike a raw
   `ExecutorService` `Future`). Difficulty raised Medium → Hard.
3. **Q16 version-corrected.** `structured-concurrency-deep-dive` updated to the *current, live-verified*
   status: the API shape changed in **JDK 25 (JEP 505, fifth preview)** — `open()` factory + `Joiner`
   interface replace the JDK 21–24 constructors (`ShutdownOnFailure`/`ShutdownOnSuccess`, now removed);
   still preview, previewing again in JDK 26 (JEP 525), **no finalized version**. Verified via WebSearch/
   JEP lookup this session, not recalled from training data — the original example used the now-superseded
   pre-25 API shape.
4. **Q7 deepened.** `method-reference-vs-lambda-performance` gained the capturing-vs-non-capturing
   distinction (a capturing lambda *or* a bound method reference allocates a new instance per evaluation;
   non-capturing forms of either syntax are effectively reusable after the first bootstrap), softened
   "identical performance" from unconditional to conditional, and added a JMH recommendation.
5. **Q11 wording fixed.** `concurrenthashmap-compound-operations`'s `whatIf` answer no longer claims a
   self-modifying mapping function "can throw `IllegalStateException` or deadlock" — reworded to
   specification-safe language: not a supported pattern, JDK doesn't guarantee the failure mode.
6. **CE3 correction (surgical, not a rewrite).** `advanced-java.ts`'s existing `virtual-threads-pinning-structured`
   stated pre-JEP-491 `synchronized` pinning as an unqualified, version-agnostic fact — now inconsistent
   with the new, accurate CE4 content. Added a Java 21–23 vs Java 24+ (JEP 491) qualifier in the four
   spots that needed it (`shortAnswer`, two `mindMap` entries, `whatIf`); added a `related` link to the
   deeper `virtual-thread-synchronized-pinning` page. All other fields on that page untouched.

---

# Verification Summary

- ✅ **TypeScript:** clean (`npx tsc --noEmit`), both after initial implementation and after the
  correction pass.
- ✅ **Production build:** green — **355 pages** (was 330, +25 `/q/[slug]`), shared First Load JS
  **102 kB unchanged**, `/q/[slug]` **111 kB unchanged**. Unaffected by the correction pass (content-only
  edits, no new/removed pages).
- ✅ **Slug integrity:** **312 total slugs, no duplicates** — unchanged after the correction pass (one
  slug removed, one added).
- ✅ **`related` cross-links:** every reference resolves **bank-wide** (312 questions), re-checked after
  the correction pass, including a grep confirming no lingering reference to the removed
  `virtual-thread-executor-vs-pooled` slug anywhere in `lib/`.
- ✅ **In-browser (dev server, `guru-dev`):** `/candidate/java-8` shows "10 LIVE"; the four corrected/
  replaced pages (`threadlocal-caching-virtual-threads`, `structured-concurrency-deep-dive`,
  `completablefuture-timeout-ortimeout`) plus the corrected CE3 page
  (`virtual-threads-pinning-structured`) all render every FIG section correctly, `seoTitle` in the tab
  title where set, no console errors.
- ⏸️ **Not pushed / not deployed** — awaiting owner review, commit, and explicit push instruction.

---

# Current Architecture Status

- **Stack:** Next.js 15.5.19 (App Router) · TypeScript (strict) · React 19 · Tailwind v3 · SSG.
- Unchanged by this session — content-only, no route/schema/architecture change.
- **Question bank:** 312 total (32 base + 280 flagship/expansion). Extra files: 13.
- **Live category counts (relevant to this session):** `java-8` 10 (was 2), `java-collections` 23 (was
  20), `multithreading` 27 (was 20), `jvm` 25 (was 20), `core-java` 29 (was 27). `advanced-java`
  unchanged at 28 (one existing question corrected in place, no count change).

---

# Current Roadmap Status

- **CE4** (this session) — ✅ completed and corrected locally, **not yet released**. See
  [05_ROADMAP.md](./05_ROADMAP.md) "Content Expansion (Phase 2)" and [06_CHANGELOG.md](./06_CHANGELOG.md)
  "Unreleased" (both the original "Added" entry and the "Fixed" correction entry) for full detail.
- Next action is owner's: review the final 25 questions (and the one corrected CE3 page), then explicitly
  request commit + push if satisfied. No further Java content batch is planned until then.
- **Open item carried forward (not part of this session's scope):** `concurrenthashmap-size-vs-mappingcount`'s
  Javadoc quote was flagged in the original review as recalled-from-training-data rather than
  live-verified; it wasn't in the owner's six-item fix list, so it remains as-is pending a future
  spot-check.
