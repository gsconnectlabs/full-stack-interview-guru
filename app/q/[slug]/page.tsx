import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { questions, getQuestion } from "@/lib/questions";
import { getCategory } from "@/lib/categories";
import DifficultyBadge from "@/components/DifficultyBadge";
import CodeBlock from "@/components/CodeBlock";
import QuestionCard from "@/components/QuestionCard";
import AdSlot from "@/components/AdSlot";
import HelpfulVote from "@/components/HelpfulVote";
import FeaturedProducts from "@/components/FeaturedProducts";
import AdvertisementPlaceholder from "@/components/AdvertisementPlaceholder";
import { absoluteUrl } from "@/lib/site";
import type { AnswerBlock } from "@/lib/types";

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
  return {
    title: q.question,
    description: plain.slice(0, 155),
    alternates: { canonical: `/q/${q.slug}` },
    openGraph: {
      type: "article",
      url: `/q/${q.slug}`,
      title: q.question,
      description: plain.slice(0, 155),
    },
  };
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

function Section({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-white">
        <span className="text-xl">{emoji}</span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function MindMapBlock({ block }: { block: AnswerBlock }) {
  if (block.type === "text") {
    return (
      <p
        className="mb-3 leading-relaxed text-slate-300 [&_code]:rounded-md [&_code]:bg-ink-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-brand-200"
        dangerouslySetInnerHTML={{ __html: inlineCode(block.content ?? "") }}
      />
    );
  }
  if (block.type === "kv" && block.rows) {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-white/10">
        {block.rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 last:border-0"
          >
            <span className="w-40 shrink-0 font-mono text-sm font-semibold text-brand-300">{row.k}</span>
            <span className="text-slate-400">→</span>
            <span className="text-sm text-slate-200">{row.v}</span>
          </div>
        ))}
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
  const related = (q.related ?? []).map(getQuestion).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: q.question,
      url: absoluteUrl(`/q/${q.slug}`),
      answerCount: 1,
      acceptedAnswer: { "@type": "Answer", text: plainAnswer(q) },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/candidate" className="hover:text-brand-300">
          Candidate
        </Link>
        <span>/</span>
        {cat && (
          <>
            <Link href={`/candidate/${cat.id}`} className="hover:text-brand-300">
              {cat.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-300">{q.topic}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main */}
        <article>
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge level={q.difficulty} />
            {q.experience.map((e) => (
              <span key={e} className="chip">
                👤 {e}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">{q.question}</h1>

          {/* Asked In */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Asked in</span>
            {q.askedIn.map((co) => (
              <span key={co} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-xs text-slate-300">
                {co}
              </span>
            ))}
          </div>

          {/* Tags */}
          {q.tags && q.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {q.tags.map((t) => (
                <span key={t} className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-300">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* ⚡ TL;DR / Short Answer */}
          {q.shortAnswer && (
            <div className="mt-6 rounded-2xl border border-brand-500/30 bg-brand-500/[0.06] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">⚡ Short Answer</p>
              <p className="mt-2 leading-relaxed text-slate-200">{q.shortAnswer}</p>
            </div>
          )}

          {/* ☕ Coffee Chat */}
          <Section emoji="☕" title="Coffee Chat Question">
            <div className="card border-l-2 border-l-brand-500/60 p-4">
              <p className="text-slate-200">“{q.question}”</p>
            </div>
          </Section>

          {/* 🧠 Mind Map */}
          <Section emoji="🧠" title="Mind Map Answer">
            <div className="card p-5">
              {q.mindMap.map((b, i) => (
                <MindMapBlock key={i} block={b} />
              ))}
            </div>
          </Section>

          {/* ⌨ Hands-on Keyboard */}
          {q.handsOn && (
            <Section emoji="⌨️" title="Hands-on Keyboard">
              <CodeBlock code={q.handsOn.code} lang={q.handsOn.lang} output={q.handsOn.output} />
              {(q.handsOn.time || q.handsOn.space) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.handsOn.time && (
                    <span className="chip">⏱️ Time: <span className="font-mono text-slate-200">{q.handsOn.time}</span></span>
                  )}
                  {q.handsOn.space && (
                    <span className="chip">💾 Space: <span className="font-mono text-slate-200">{q.handsOn.space}</span></span>
                  )}
                </div>
              )}
            </Section>
          )}

          {/* 🔥 What If */}
          {q.whatIf && (
            <Section emoji="🔥" title="What If?">
              <div className="card overflow-hidden">
                <div className="border-b border-white/[0.06] bg-rose-500/[0.06] px-5 py-3">
                  <p className="font-semibold text-rose-200">{q.whatIf.q}</p>
                </div>
                <p className="px-5 py-4 leading-relaxed text-slate-300">{q.whatIf.a}</p>
              </div>
            </Section>
          )}

          {/* 😂 Real World */}
          {q.realWorld && (
            <Section emoji="😂" title="Real World">
              <div className="card border-l-2 border-l-amber-500/60 p-5">
                <p className="leading-relaxed text-slate-300">{q.realWorld}</p>
              </div>
            </Section>
          )}

          {/* 🎯 Interviewer's Expectation */}
          {q.interviewerExpectation && q.interviewerExpectation.length > 0 && (
            <Section emoji="🎯" title="Interviewer's Expectation">
              <div className="card p-5">
                <p className="mb-3 text-sm text-slate-400">Keywords they're listening for:</p>
                <div className="flex flex-wrap gap-2">
                  {q.interviewerExpectation.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* ⚠️ Common Mistakes */}
          {q.commonMistakes && q.commonMistakes.length > 0 && (
            <Section emoji="⚠️" title="Common Mistakes">
              <ul className="card space-y-2 p-5">
                {q.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="select-none text-rose-400">✗</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* ✅ Best Practices */}
          {q.bestPractices && q.bestPractices.length > 0 && (
            <Section emoji="✅" title="Best Practices">
              <ul className="card space-y-2 p-5">
                {q.bestPractices.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="select-none text-emerald-400">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* 🔁 Follow-up Questions */}
          {q.followUps && q.followUps.length > 0 && (
            <Section emoji="🔁" title="Follow-up Questions">
              <ul className="card space-y-2.5 p-5">
                {q.followUps.map((f, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-[11px] font-bold text-brand-300">
                      {i + 1}
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* 🧩 Related Technologies */}
          {q.relatedTech && q.relatedTech.length > 0 && (
            <Section emoji="🧩" title="Related Technologies">
              <div className="flex flex-wrap gap-2">
                {q.relatedTech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* 📚 References */}
          {q.references && q.references.length > 0 && (
            <Section emoji="📚" title="References">
              <ul className="card space-y-2 p-5">
                {q.references.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-300 underline underline-offset-2 hover:text-brand-200"
                    >
                      {r.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Was this helpful? — real-time content signal */}
          <HelpfulVote slug={q.slug} />

          {/* Featured products — after the answer, before related questions */}
          <div className="mt-12">
            <FeaturedProducts />
            <div className="mt-6">
              <AdvertisementPlaceholder />
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-bold text-white">Related Questions</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => r && <QuestionCard key={r.slug} q={r} />)}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white">On this page</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>☕ Coffee Chat Question</li>
              <li>🧠 Mind Map Answer</li>
              {q.handsOn && <li>⌨️ Hands-on Keyboard</li>}
              {q.whatIf && <li>🔥 What If?</li>}
              {q.realWorld && <li>😂 Real World</li>}
              {q.interviewerExpectation && <li>🎯 Interviewer&apos;s Expectation</li>}
            </ul>
          </div>

          {cat && (
            <Link href={`/candidate/${cat.id}`} className="card card-hover block p-5">
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${cat.accent} text-lg`}>
                {cat.icon}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">More {cat.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{cat.count} questions in this topic →</p>
            </Link>
          )}

          <AdSlot variant="sidebar" />
        </aside>
      </div>
    </div>
  );
}
