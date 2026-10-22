import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategory } from "@/lib/categories";
import { questionsByCategory } from "@/lib/questions";
import { isListed } from "@/lib/category-visibility";
import {
  STAGE_LABEL,
  difficultySpread,
  groupByDifficulty,
  topicsCovered,
  trackForCategory,
} from "@/lib/learning-paths";
import QuestionList from "@/components/QuestionList";
import DifficultySpread from "@/components/DifficultySpread";
import { difficultyDot } from "@/components/DifficultyBadge";
import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import type { Difficulty } from "@/lib/types";

/** Only categories that have at least one live question get a route (so every breadcrumb
 *  from a live question resolves); empty categories 404 instead of showing a placeholder. */
export const dynamicParams = false;

export function generateStaticParams() {
  return categories
    .filter((c) => questionsByCategory(c.id).length > 0)
    .map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Not found" };
  const live = questionsByCategory(cat.id).length;
  return {
    title: `${cat.name} Interview Questions`,
    description: `${cat.name} interview questions and answers — ${cat.blurb} ${live} curated questions.`,
    alternates: { canonical: `/candidate/${cat.id}` },
    // Keep thin (below-threshold) category listings out of the index until they are filled out.
    ...(isListed(cat.id) ? {} : { robots: { index: false, follow: true } }),
  };
}

const STAGE_HINT: Record<Difficulty, string> = {
  Easy: "Definitions and building blocks — start here if the topic is new to you.",
  Medium: "The questions most interviews spend their time on: how it works and when to use it.",
  Hard: "Internals, trade-offs and edge cases — useful for senior rounds and follow-ups.",
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const qs = questionsByCategory(cat.id);
  const groups = groupByDifficulty(qs);
  const covered = topicsCovered(qs);
  const track = trackForCategory(cat.id);
  const position = track ? track.categories.findIndex((c) => c.id === cat.id) : -1;
  const prevTopic = track && position > 0 ? track.categories[position - 1] : undefined;
  const nextTopic = track && position >= 0 ? track.categories[position + 1] : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb
        items={[
          { name: "Candidate", href: "/candidate" },
          { name: cat.name },
        ]}
      />

      {/* Header */}
      <header className="mt-8 grid gap-8 border-b border-ink-700/60 pb-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          {track && (
            <p className="eyebrow">
              {track.title} · topic {position + 1} of {track.categories.length}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl sm:text-3xl">{cat.icon}</span>
            <h1 className="font-serif text-3xl font-black tracking-tight text-white sm:text-4xl">{cat.name}</h1>
          </div>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">{cat.blurb}</p>
          {qs.length > 1 && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Questions below are grouped from foundations to advanced. Work top to bottom if the topic is new to you,
              or jump to a level if you are brushing up.
            </p>
          )}
        </div>

        <dl className="space-y-4 text-sm lg:border-l lg:border-ink-700/60 lg:pl-6">
          <div>
            <dt className="eyebrow">Questions</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-white">{qs.length}</dd>
          </div>
          <div>
            <dt className="eyebrow">Difficulty mix</dt>
            <dd className="mt-2">
              <DifficultySpread spread={difficultySpread(qs)} />
            </dd>
          </div>
        </dl>
      </header>

      {/* Sub-topics that actually have published questions */}
      {covered.length > 1 && (
        <div className="mt-6">
          <h2 className="eyebrow">Topics covered</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {covered.map((t) => (
              <li key={t.topic} className="chip">
                {t.topic}
                <span className="text-slate-400">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
        {/* Level jump links */}
        {groups.length > 1 ? (
          <nav aria-label="Difficulty levels" className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">Jump to</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {groups.map((g) => (
                <li key={g.difficulty}>
                  <a
                    href={`#level-${g.difficulty.toLowerCase()}`}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-slate-300 transition-colors hover:border-brand-500/40 hover:text-white lg:w-full lg:border-transparent lg:px-2"
                  >
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${difficultyDot[g.difficulty]}`} />
                    {STAGE_LABEL[g.difficulty]}
                    <span className="ml-auto pl-2 text-xs tabular-nums text-slate-400">{g.questions.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <div aria-hidden="true" className="hidden lg:block" />
        )}

        <div className="min-w-0 max-w-3xl">
          {groups.length > 0 ? (
            groups.map((g) => (
              <section
                key={g.difficulty}
                id={`level-${g.difficulty.toLowerCase()}`}
                aria-labelledby={`level-${g.difficulty.toLowerCase()}-title`}
                className="mb-12 last:mb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2
                    id={`level-${g.difficulty.toLowerCase()}-title`}
                    className="font-serif text-xl font-bold text-white"
                  >
                    {STAGE_LABEL[g.difficulty]}
                  </h2>
                  <span className="text-xs text-slate-400">
                    {g.difficulty} · {g.questions.length} question{g.questions.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-400">{STAGE_HINT[g.difficulty]}</p>
                <div className="mt-3">
                  <QuestionList questions={g.questions} />
                </div>
              </section>
            ))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-slate-300">More {cat.name} questions are being written.</p>
              <p className="mt-1 text-sm text-slate-400">In the meantime, explore a topic with live samples below.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {categories
                  .filter((c) => questionsByCategory(c.id).length > 0)
                  .slice(0, 6)
                  .map((c) => (
                    <Link key={c.id} href={`/candidate/${c.id}`} className="btn-secondary px-4 py-2 text-xs">
                      {c.icon} {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* Neighbouring topics in the same learning track */}
          {track && (prevTopic || nextTopic) && (
            <nav aria-label={`${track.title} track`} className="mt-14 border-t border-ink-700/60 pt-6">
              <p className="eyebrow">Continue the {track.title} track</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {prevTopic ? (
                  <Link href={`/candidate/${prevTopic.id}`} className="card card-hover block p-4">
                    <span className="text-xs text-slate-400">← Before this</span>
                    <span className="mt-1 block font-semibold text-slate-100">{prevTopic.name}</span>
                  </Link>
                ) : (
                  <span aria-hidden="true" className="hidden sm:block" />
                )}
                {nextTopic && (
                  <Link href={`/candidate/${nextTopic.id}`} className="card card-hover block p-4 sm:text-right">
                    <span className="text-xs text-slate-400">Next topic →</span>
                    <span className="mt-1 block font-semibold text-slate-100">{nextTopic.name}</span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* Ad below content only */}
      <div className="mt-14">
        <AdSlot />
      </div>
    </div>
  );
}
