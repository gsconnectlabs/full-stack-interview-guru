import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { questions, getQuestion, getQuestionNav, questionsByCategory } from "@/lib/questions";
import { getCategory } from "@/lib/categories";
import PrevNextNav from "@/components/PrevNextNav";
import DifficultyBadge from "@/components/DifficultyBadge";
import CodeBlock from "@/components/CodeBlock";
import CopyButton from "@/components/CopyButton";
import ShareButton from "@/components/ShareButton";
import { readingTimeMinutes } from "@/lib/reading-time";
import QuestionList from "@/components/QuestionList";
import AdSlot from "@/components/AdSlot";
import HelpfulVote from "@/components/HelpfulVote";
import FeaturedProducts from "@/components/FeaturedProducts";
import AdvertisementPlaceholder from "@/components/AdvertisementPlaceholder";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import RecordVisit from "@/components/RecordVisit";
import { absoluteUrl, siteName, siteUrl, authorPerson, founderName } from "@/lib/site";
import Breadcrumb from "@/components/Breadcrumb";
import AISection from "@/components/AISection";
import { buildAiPrompts } from "@/lib/ai-prompts";
import type { AnswerBlock, Question } from "@/lib/types";

export function generateStaticParams() {
  return questions.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) return { title: "Not found" };
  const plain = (q.shortAnswer ?? q.mindMap.find((b) => b.type === "text")?.content ?? q.question)
    .replace(/[*`]/g, "")
    .trim();
  const description = q.seoDescription ?? plain.slice(0, 155);
  return {
    title: q.seoTitle ? { absolute: q.seoTitle } : q.question,
    description,
    alternates: { canonical: `/q/${q.slug}` },
    openGraph: {
      type: "article",
      url: `/q/${q.slug}`,
      title: q.seoTitle ?? q.question,
      description,
    },
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Format an ISO `YYYY-MM-DD` string as "Jul 19, 2026". Deterministic (no locale /
 *  timezone dependence — parsed by regex, formatted from a fixed month table).
 *  Returns null for malformed input so the chip is simply omitted. */
function formatUpdated(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const [, year, month, day] = m;
  const mi = Number(month) - 1;
  if (mi < 0 || mi > 11) return null;
  return `${MONTHS[mi]} ${Number(day)}, ${year}`;
}

/** Plain-text answer assembled from the mind-map + what-if, for QAPage structured data. */
function plainAnswer(q: NonNullable<ReturnType<typeof getQuestion>>): string {
  const parts: string[] = [];
  if (q.shortAnswer) parts.push(q.shortAnswer);
  for (const b of q.mindMap) {
    if (b.type === "text" && b.content) parts.push(b.content);
    if (b.type === "kv" && b.rows) parts.push(b.rows.map((r) => `${r.k}: ${r.v}`).join("; "));
  }
  if (q.whatIf) parts.push(`${q.whatIf.q} ${q.whatIf.a}`);
  return parts.join(" ").replace(/[*`]/g, "").trim();
}

/** Long-form body copy: comfortable size and line height for sustained reading. */
const PROSE = "text-base leading-[1.75] text-slate-300 sm:text-[1.0625rem]";
const INLINE_CODE =
  "[&_code]:rounded [&_code]:bg-ink-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-brand-200";

function Section({
  id,
  emoji,
  title,
  subtitle,
  children,
}: {
  id: string;
  emoji: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-12 border-t border-ink-700/60 pt-8">
      {subtitle && <p className="eyebrow">{subtitle}</p>}
      <h2 id={`${id}-title`} className="mt-1.5 flex items-center gap-2.5 font-serif text-xl font-bold text-white sm:text-[1.375rem]">
        <span aria-hidden="true" className="text-lg">{emoji}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function MindMapBlock({ block }: { block: AnswerBlock }) {
  if (block.type === "text") {
    return (
      <p
        className={`mb-5 ${PROSE} ${INLINE_CODE}`}
        dangerouslySetInnerHTML={{ __html: inlineCode(block.content ?? "") }}
      />
    );
  }
  if (block.type === "kv" && block.rows) {
    return (
      <dl className="my-6 divide-y divide-ink-800 border-y border-ink-700/60">
        {block.rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
            <dt className="shrink-0 break-words font-mono text-sm font-semibold text-brand-300 sm:w-44">{row.k}</dt>
            <dd className="min-w-0 text-[15px] leading-relaxed text-slate-200">{row.v}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (block.type === "table" && block.headers && block.tableRows) {
    return (
      <div
        role="region"
        aria-label="Comparison table (scrolls horizontally)"
        tabIndex={0}
        className="my-6 overflow-x-auto rounded-lg border border-ink-700/70"
      >
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink-850">
              {block.headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="border-b border-ink-700/70 px-4 py-2.5 font-semibold text-slate-100"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.tableRows.map((row, i) => (
              <tr key={i} className="border-b border-ink-800 last:border-0 even:bg-white/[0.015]">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={
                      j === 0
                        ? "px-4 py-2.5 align-top font-mono font-semibold text-brand-300"
                        : "px-4 py-2.5 align-top leading-relaxed text-slate-300"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.type === "code" && block.content) {
    return (
      <div className="my-6">
        <CodeBlock code={block.content} lang={block.lang ?? "text"} />
      </div>
    );
  }
  return null;
}

/** Minimal inline markdown (`code` + **bold**). Content is author-controlled, not user input. */
function inlineCode(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) notFound();

  const cat = getCategory(q.categoryId);
  const catCount = cat ? questionsByCategory(cat.id).length : 0;
  const related = (q.related ?? []).map(getQuestion).filter((r): r is Question => Boolean(r));
  const shareUrl = absoluteUrl(`/q/${q.slug}`);
  const readMins = readingTimeMinutes(q);
  const aiPrompts = buildAiPrompts(q, cat?.name);
  const updatedLabel = q.updated ? formatUpdated(q.updated) : null;
  const reportHref = `/feedback?context=${encodeURIComponent(`Question: "${q.question}" (/q/${q.slug})`)}`;
  const nav = getQuestionNav(q.slug);

  // Same sub-topic within the category, excluding anything already linked as related.
  const linked = new Set([q.slug, ...related.map((r) => r.slug)]);
  const sameTopic = cat
    ? questionsByCategory(cat.id)
        .filter((s) => s.topic === q.topic && !linked.has(s.slug))
        .slice(0, 4)
    : [];

  const toc: TocItem[] = [
    ...(q.shortAnswer ? [{ id: "short-answer", label: "Short answer" }] : []),
    { id: "coffee-chat", label: "Coffee Chat Question" },
    { id: "mind-map", label: "Mind Map Answer" },
    ...(q.handsOn ? [{ id: "hands-on", label: "Hands-on Keyboard" }] : []),
    ...(q.whatIf ? [{ id: "what-if", label: "What If?" }] : []),
    ...(q.realWorld ? [{ id: "real-world", label: "Real World" }] : []),
    ...(q.guruTake ? [{ id: "guru-take", label: "Real Talk from Guru" }] : []),
    ...(q.interviewerExpectation?.length ? [{ id: "interviewer-expectation", label: "Interviewer's Expectation" }] : []),
    ...(q.commonMistakes?.length ? [{ id: "common-mistakes", label: "Common Mistakes" }] : []),
    ...(q.bestPractices?.length ? [{ id: "best-practices", label: "Best Practices" }] : []),
    ...(q.followUps?.length ? [{ id: "follow-ups", label: "Follow-up Questions" }] : []),
    ...(q.relatedTech?.length ? [{ id: "related-tech", label: "Related Technologies" }] : []),
    ...(q.references?.length ? [{ id: "references", label: "References" }] : []),
    { id: "continue-with-ai", label: "Continue Learning with AI" },
    ...(related.length || sameTopic.length ? [{ id: "related", label: "Related Questions" }] : []),
  ];

  // Google's structured-data parser expects a full datetime with an explicit timezone
  // offset, not a bare `YYYY-MM-DD` — append midnight UTC once the date has been validated.
  const dateModifiedIso = q.updated && updatedLabel ? `${q.updated}T00:00:00.000Z` : null;
  const datePublishedIso = q.published && formatUpdated(q.published) ? `${q.published}T00:00:00.000Z` : null;
  // Person authors the content; the FIG Organization is the publisher/brand — kept
  // distinct so the site never loses its Organization identity (DECISIONS: E-E-A-T fix).
  const author = authorPerson;
  const publisher = { "@type": "Organization" as const, name: siteName, url: siteUrl };
  const pageUrl = absoluteUrl(`/q/${q.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    ...(dateModifiedIso ? { dateModified: dateModifiedIso } : {}),
    mainEntity: {
      "@type": "Question",
      name: q.question,
      text: q.question,
      url: pageUrl,
      author,
      publisher,
      ...(dateModifiedIso ? { dateModified: dateModifiedIso } : {}),
      ...(datePublishedIso ? { datePublished: datePublishedIso } : {}),
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: plainAnswer(q),
        url: pageUrl,
        author,
        publisher,
        ...(datePublishedIso ? { datePublished: datePublishedIso } : {}),
      },
    },
  };


  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecordVisit slug={q.slug} title={q.question} category={cat?.name} />
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { name: "Candidate", href: "/candidate" },
          ...(cat ? [{ name: cat.name, href: `/candidate/${cat.id}` }] : []),
          { name: q.topic },
        ]}
      />

      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] xl:gap-16">
        {/* Main. `min-w-0`: a grid item defaults to min-width:auto (its widest content), so without it
            wide tables/code stretched this column past the viewport and the page scrolled sideways. */}
        <article className="min-w-0 max-w-[46rem]">
          <header>
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-400">
              <DifficultyBadge level={q.difficulty} />
              <span>
                <span className="sr-only">Experience level: </span>
                {q.experience.join(" · ")}
              </span>
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
              <span>{readMins} min read</span>
            </div>

            <h1 className="mt-4 font-serif text-[1.75rem] font-black leading-tight tracking-tight text-white sm:text-4xl">
              {q.heading ?? q.question}
            </h1>

            {/* Byline — subtle authorship signal, not a card. Date only shown when the
                question actually has an `updated` value; never fabricated. */}
            <p className="mt-3 text-sm text-slate-500">
              Reviewed by{" "}
              <Link href="/about" className="text-slate-300 hover:text-brand-300 hover:underline">
                {founderName}
              </Link>
              {updatedLabel && <> · Updated {updatedLabel}</>}
            </p>

            {/* Asked In + tags */}
            <div className="mt-5 space-y-2.5 border-y border-ink-800 py-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <span className="eyebrow mr-1">Asked in</span>
                {q.askedIn.map((co) => (
                  <span key={co} className="rounded bg-white/[0.04] px-2 py-0.5 text-xs text-slate-300">
                    {co}
                  </span>
                ))}
              </div>
              {q.tags && q.tags.length > 0 && (
                <div className="flex flex-wrap gap-x-2.5 gap-y-1">
                  {q.tags.map((t) => (
                    <span key={t} className="text-xs text-brand-300/90">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Share actions — copy link (Web Share fallback) + native share */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CopyButton
                value={shareUrl}
                className="btn-pill"
                label={
                  <>
                    <span aria-hidden="true">🔗 </span>Copy link
                  </>
                }
                copiedLabel={
                  <>
                    <span aria-hidden="true">✓ </span>Link copied
                  </>
                }
              />
              <ShareButton url={shareUrl} title={q.question} />
              <Link
                href={reportHref}
                rel="nofollow"
                prefetch={false}
                className="btn-pill"
                aria-label="Report issue with this question"
              >
                <span aria-hidden="true">🚩</span> Report issue
              </Link>
            </div>
          </header>

          {/* ⚡ TL;DR / Short Answer */}
          {q.shortAnswer && (
            <section
              id="short-answer"
              aria-labelledby="short-answer-title"
              className="mt-8 border-l-2 border-gold-400 bg-ink-900/60 py-5 pl-5 pr-5 sm:pl-6"
            >
              <h2 id="short-answer-title" className="eyebrow text-gold-300">
                <span aria-hidden="true">⚡ </span>Short Answer
              </h2>
              <p className="mt-2 text-[1.0625rem] leading-relaxed text-slate-100 sm:text-lg">{q.shortAnswer}</p>
            </section>
          )}

          {/* On this page — collapsible on small screens; the desktop copy lives in the sidebar */}
          <details className="group mt-6 rounded-lg border border-ink-700/60 lg:hidden">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-slate-200 [&::-webkit-details-marker]:hidden">
              On this page
              <span aria-hidden="true" className="text-slate-500 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <nav aria-label="On this page" className="border-t border-ink-800 px-4 pb-3 pt-2">
              <TableOfContents items={toc} />
            </nav>
          </details>

          {/* ☕ Coffee Chat */}
          <Section id="coffee-chat" emoji="☕" title="Coffee Chat Question" subtitle="Concept Made Simple">
            <blockquote className="border-l-2 border-brand-500/70 pl-5 font-serif text-lg italic leading-relaxed text-slate-200 sm:text-xl">
              “{q.question}”
            </blockquote>
          </Section>

          {/* 🧠 Mind Map */}
          <Section id="mind-map" emoji="🧠" title="Mind Map Answer" subtitle="Remember It Faster">
            {q.mindMap.map((b, i) => (
              <MindMapBlock key={i} block={b} />
            ))}
          </Section>

          {/* ⌨ Hands-on Keyboard */}
          {q.handsOn && (
            <Section id="hands-on" emoji="⌨️" title="Hands-on Keyboard" subtitle="Learn by Doing">
              <CodeBlock code={q.handsOn.code} lang={q.handsOn.lang} output={q.handsOn.output} />
              {(q.handsOn.time || q.handsOn.space) && (
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-400">
                  {q.handsOn.time && (
                    <div className="flex gap-1.5">
                      <dt>Time:</dt>
                      <dd className="font-mono text-slate-200">{q.handsOn.time}</dd>
                    </div>
                  )}
                  {q.handsOn.space && (
                    <div className="flex gap-1.5">
                      <dt>Space:</dt>
                      <dd className="font-mono text-slate-200">{q.handsOn.space}</dd>
                    </div>
                  )}
                </dl>
              )}
            </Section>
          )}

          {/* 🔥 What If */}
          {q.whatIf && (
            <Section id="what-if" emoji="🔥" title="What If?" subtitle="Think Beyond the Expected">
              <div className="rounded-lg border border-ink-700/70">
                <p className="border-b border-ink-800 bg-rose-500/[0.06] px-5 py-3.5 font-semibold leading-snug text-rose-100">
                  {q.whatIf.q}
                </p>
                <p className={`px-5 py-4 ${PROSE}`}>{q.whatIf.a}</p>
              </div>
            </Section>
          )}

          {/* 😂 Real World */}
          {q.realWorld && (
            <Section id="real-world" emoji="😂" title="Real World">
              <p className={`border-l-2 border-amber-500/60 pl-5 ${PROSE}`}>{q.realWorld}</p>
            </Section>
          )}

          {/* 🗣️ Real Talk from Guru */}
          {q.guruTake && (
            <Section id="guru-take" emoji="🗣️" title="Real Talk from Guru">
              <div className="card-premium p-5">
                <p className={PROSE}>{q.guruTake}</p>
              </div>
            </Section>
          )}

          {/* 🎯 Interviewer's Expectation */}
          {q.interviewerExpectation && q.interviewerExpectation.length > 0 && (
            <Section id="interviewer-expectation" emoji="🎯" title="Interviewer's Expectation">
              <p className="mb-3 text-sm text-slate-400">Keywords they&apos;re listening for:</p>
              <ul className="flex flex-wrap gap-2">
                {q.interviewerExpectation.map((kw) => (
                  <li
                    key={kw}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200"
                  >
                    <span aria-hidden="true">✓ </span>
                    {kw}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* ⚠️ Common Mistakes */}
          {q.commonMistakes && q.commonMistakes.length > 0 && (
            <Section id="common-mistakes" emoji="⚠️" title="Common Mistakes">
              <ul className="space-y-3">
                {q.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-300">
                    <span aria-hidden="true" className="select-none pt-px font-bold text-rose-400">
                      ✗
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* ✅ Best Practices */}
          {q.bestPractices && q.bestPractices.length > 0 && (
            <Section id="best-practices" emoji="✅" title="Best Practices">
              <ul className="space-y-3">
                {q.bestPractices.map((b, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-300">
                    <span aria-hidden="true" className="select-none pt-px font-bold text-emerald-400">
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* 🔁 Follow-up Questions */}
          {q.followUps && q.followUps.length > 0 && (
            <Section id="follow-ups" emoji="🔁" title="Follow-up Questions">
              <ol className="space-y-3">
                {q.followUps.map((f, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-300">
                    <span
                      aria-hidden="true"
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-300"
                    >
                      {i + 1}
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {/* 🧩 Related Technologies */}
          {q.relatedTech && q.relatedTech.length > 0 && (
            <Section id="related-tech" emoji="🧩" title="Related Technologies">
              <ul className="flex flex-wrap gap-2">
                {q.relatedTech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* 📚 References */}
          {q.references && q.references.length > 0 && (
            <Section id="references" emoji="📚" title="References">
              <ul className="space-y-2">
                {q.references.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-link text-sm">
                      {r.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* 🤖 Continue Learning with AI — single client island (prompts precomputed above) */}
          <div id="continue-with-ai">
            <AISection prompts={aiPrompts} />
          </div>

          {/* Was this helpful? — real-time content signal */}
          <HelpfulVote slug={q.slug} />

          {/* Related — curated links first, then other questions on the same sub-topic */}
          {(related.length > 0 || sameTopic.length > 0) && (
            <section id="related" aria-labelledby="related-title" className="mt-14">
              <h2 id="related-title" className="font-serif text-xl font-bold text-white">
                Related Questions
              </h2>
              {related.length > 0 && (
                <div className="mt-4">
                  <QuestionList questions={related} showCategory />
                </div>
              )}
              {sameTopic.length > 0 && (
                <div className="mt-8">
                  <h3 className="eyebrow">More on {q.topic}</h3>
                  <div className="mt-2">
                    <QuestionList questions={sameTopic} />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Previous / Next within the category + position + "View all" */}
          {nav && (nav.prev || nav.next) && <PrevNextNav nav={nav} category={cat} />}

          {/* Affiliate products + sponsor slot — after all learning content and navigation */}
          <div className="mt-16 border-t border-ink-700/60 pt-10">
            <FeaturedProducts />
            <div className="mt-6">
              <AdvertisementPlaceholder />
            </div>
          </div>
        </article>

        {/* Sidebar (desktop): sticky contents + topic link, then the sidebar ad slot */}
        <aside className="hidden flex-col gap-8 lg:flex">
          <div className="flex-1">
            <div className="sticky top-24 space-y-6">
              <nav aria-labelledby="toc-title">
                <h2 id="toc-title" className="eyebrow">
                  On this page
                </h2>
                <div className="mt-3">
                  <TableOfContents items={toc} />
                </div>
              </nav>

              {cat && (
                <Link href={`/candidate/${cat.id}`} className="card card-hover block p-4">
                  <span className="eyebrow">Topic</span>
                  <span className="mt-1.5 flex items-center gap-2 font-semibold text-white">
                    <span aria-hidden="true">{cat.icon}</span>
                    {cat.name}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {catCount} question{catCount === 1 ? "" : "s"} in this topic →
                  </span>
                </Link>
              )}
            </div>
          </div>

          <AdSlot variant="sidebar" />
        </aside>
      </div>
    </div>
  );
}
