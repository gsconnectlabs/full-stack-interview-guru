import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import QuestionList from "@/components/QuestionList";
import TopicIndex from "@/components/TopicIndex";
import RecentlyViewed from "@/components/RecentlyViewed";
import FeaturedProducts from "@/components/FeaturedProducts";
import AdvertisementPlaceholder from "@/components/AdvertisementPlaceholder";
import { listedCategories, totalLiveQuestions } from "@/lib/category-visibility";
import { questionMap } from "@/lib/questions";
import type { Question } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "Full Stack Interview Guru — Interview Tomorrow? Start Here." },
  alternates: { canonical: "/" },
};

const POPULAR = ["what-is-hashmap", "java-stream-api", "what-is-jwt", "two-sum", "rest-idempotency", "aws-lambda", "dynamodb-partition-key"];

const BEYOND = [
  {
    href: "/environment",
    title: "Know Your Environment",
    blurb: "Don't guess your Java, Maven, or Docker version — verify it. Commands + config guides.",
    cta: "Verify setup",
  },
  {
    href: "/transition",
    title: "Transition Hub",
    blurb: "IVR, middleware, tester, .NET, mainframe? Get a roadmap from legacy to modern full stack.",
    cta: "Find your path",
  },
  {
    href: "/real-world",
    title: "Real World vs Interview",
    blurb: "The honest gap between textbook answers and how developers actually work day to day.",
    cta: "Get real",
  },
];

export default function Home() {
  const popular = POPULAR.map((slug) => questionMap.get(slug)).filter((q): q is Question => Boolean(q));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* HERO — value proposition + search, with a quick way back in for returning readers */}
      <section className="grid gap-12 pb-14 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <p className="eyebrow">Interview preparation for full-stack developers</p>
          <h1 className="mt-4 font-serif text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Full Stack <span className="text-gold-300">Interview Guru</span>
          </h1>
          <p className="mt-4 font-serif text-xl text-slate-200 sm:text-2xl">Interview Tomorrow? Start Here.</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400">
            {totalLiveQuestions.toLocaleString()} interview questions across {listedCategories.length} topics, from Core
            Java and the JVM to REST APIs, SQL, AWS and system design. Answers are written for the interview room: a
            short answer you can say out loud, the reasoning behind it, code where it helps, and the follow-ups that
            usually come next.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar align="start" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/candidate" className="btn-primary">
              Browse questions by topic
            </Link>
            <Link href="/interviewer" className="btn-secondary">
              Interviewer Mode
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">Free to read · No login required</p>
        </div>

        <div className="lg:border-l lg:border-ink-700/60 lg:pl-10">
          <RecentlyViewed />
          <section aria-labelledby="popular-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="popular-title" className="eyebrow">
                Popular questions
              </h2>
              <Link href="/candidate" className="text-xs font-medium text-brand-300 hover:text-brand-200">
                View all →
              </Link>
            </div>
            <div className="mt-2">
              <QuestionList questions={popular} showCategory numbered />
            </div>
          </section>
        </div>
      </section>

      {/* LEARNING PATHS — every listed topic, ordered so each builds on the last */}
      <section id="categories" aria-labelledby="paths-title" className="border-t border-ink-700/60 pt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="paths-title" className="section-title">
              Learning paths
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Every topic, arranged so each one builds on the last. Follow a track from its first question, or jump
              straight to the topic your interview is about.
            </p>
          </div>
          <Link href="/candidate" className="shrink-0 text-sm font-medium text-brand-300 hover:text-brand-200">
            All topics with details →
          </Link>
        </div>
        <div className="mt-6">
          <TopicIndex headingLevel="h3" />
        </div>
      </section>

      {/* BEYOND THE QUESTIONS */}
      <section aria-labelledby="beyond-title" className="mt-16">
        <h2 id="beyond-title" className="section-title">
          Beyond the questions
        </h2>
        <p className="mt-2 text-sm text-slate-400">Prep the whole picture — your machine, your path, your reality.</p>
        <ul className="mt-6 grid gap-x-8 md:grid-cols-3">
          {BEYOND.map((b) => (
            <li key={b.href} className="border-t border-ink-700/60">
              <Link href={b.href} className="group block py-5">
                <h3 className="font-semibold text-white group-hover:text-brand-200">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{b.blurb}</p>
                <span className="mt-3 inline-block text-sm font-medium text-brand-300">
                  {b.cta} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* EBOOK STORE + FEEDBACK */}
      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <Link href="/store" className="card-premium card-hover group block p-6">
          <p className="eyebrow text-gold-400/90">From the author</p>
          <h2 className="mt-2 font-serif text-xl font-bold text-white">Ebook Store</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            A free, downloadable Java interview question bank — 16 years of banking-domain interviews, distilled into a
            guide worth your time.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-gold-300">Get the Free Ebook →</span>
        </Link>
        <div className="card p-6">
          <p className="eyebrow">Help improve FIG</p>
          <h2 className="mt-2 font-serif text-xl font-bold text-white">Spotted something off?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Wrong answer, a typo, or a topic we&apos;re missing? Thirty seconds of feedback makes the site better for the
            next person walking into an interview.
          </p>
          <Link href="/feedback" className="btn-secondary mt-4">
            Share feedback →
          </Link>
        </div>
      </section>

      {/* Affiliate + advertising — kept after the learning content */}
      <div className="mt-20 border-t border-ink-700/60 pt-10">
        <FeaturedProducts />
        <div className="mt-6">
          <AdvertisementPlaceholder />
        </div>
      </div>
    </div>
  );
}
