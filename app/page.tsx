import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import QuestionCard from "@/components/QuestionCard";
import TopicCard from "@/components/TopicCard";
import FeaturedProducts from "@/components/FeaturedProducts";
import AdvertisementPlaceholder from "@/components/AdvertisementPlaceholder";
import { categories, totalQuestions } from "@/lib/categories";
import { questionMap } from "@/lib/questions";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const POPULAR = ["what-is-hashmap", "java-stream-api", "what-is-jwt", "two-sum", "rest-idempotency", "aws-lambda"];

const REVISION = [
  {
    title: "24-Hour Revision Mode",
    emoji: "⏱️",
    blurb: "The absolute essentials. High-frequency questions only — the ones you cannot walk in without.",
    accent: "from-rose-500/20 to-orange-500/10",
  },
  {
    title: "48-Hour Revision Mode",
    emoji: "📅",
    blurb: "Core + the common follow-ups. Enough depth to handle a 'why' or two without panicking.",
    accent: "from-amber-500/20 to-yellow-500/10",
  },
  {
    title: "Weekend Deep Dive",
    emoji: "🧗",
    blurb: "Go beyond answers — internals, trade-offs, and system design. For when you actually have time.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
];

const TOP_LISTS = [
  { label: "Top 25 Java Questions", href: "/candidate/core-java", emoji: "☕" },
  { label: "Top 25 AWS Questions", href: "/candidate/aws", emoji: "☁️" },
  { label: "Top 25 REST Questions", href: "/candidate/rest-apis", emoji: "🔗" },
  { label: "Top 25 Python Questions", href: "/candidate/python", emoji: "🐍" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* HERO */}
      <section className="relative pb-10 pt-14 text-center sm:pt-20">
        <div className="mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-300">
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-emerald-400" />
          No Login • No Noise • Just Interviews
        </div>

        <h1 className="mt-6 animate-fade-up text-4xl font-black tracking-tight text-white sm:text-6xl">
          Full Stack{" "}
          <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-sky-300 bg-clip-text text-transparent">
            Interview Guru
          </span>
        </h1>
        <p className="mt-4 animate-fade-up text-lg font-semibold text-slate-300 sm:text-2xl">
          Interview Tomorrow? Start Here.
        </p>

        <p className="mx-auto mt-4 max-w-xl animate-fade-up text-sm text-slate-400 sm:text-base">
          Java • Python • AWS • REST APIs • SQL • AI — a distraction-free way to prep, whether you are
          taking the interview or giving it.
        </p>

        {/* MODE BUTTONS */}
        <div className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/candidate" className="btn-primary w-full sm:w-auto">
            🎯 Candidate Mode
          </Link>
          <Link href="/interviewer" className="btn-secondary w-full sm:w-auto">
            🧑‍⚖️ Interviewer Mode
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mx-auto mt-10 max-w-2xl animate-fade-up">
          <SearchBar />
        </div>

        <p className="mt-6 text-xs text-slate-500">Dark mode · Mobile-first · SEO optimized · Free forever</p>
      </section>

      {/* METRICS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { value: `${totalQuestions.toLocaleString()}+`, label: "Questions" },
          { value: `${categories.length}`, label: "Topics" },
          { value: "24h", label: "Revision Mode" },
          { value: "Zero", label: "Login Required" },
        ].map((m) => (
          <div key={m.label} className="card p-5 text-center">
            <div className="bg-gradient-to-r from-brand-300 to-sky-300 bg-clip-text text-2xl font-black text-transparent sm:text-3xl">
              {m.value}
            </div>
            <div className="mt-1 text-xs font-medium text-slate-400">{m.label}</div>
          </div>
        ))}
      </section>

      {/* TOP LISTS */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TOP_LISTS.map((t) => (
          <Link key={t.label} href={t.href} className="card card-hover flex items-center gap-3 p-4">
            <span className="text-2xl">{t.emoji}</span>
            <span className="text-sm font-semibold text-slate-200">{t.label}</span>
          </Link>
        ))}
      </section>

      {/* POPULAR QUESTIONS */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">🔥 Popular Questions</h2>
            <p className="mt-1 text-sm text-slate-400">The ones that come up again and again.</p>
          </div>
          <Link href="/candidate" className="text-sm font-medium text-brand-400 hover:text-brand-300">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map((slug) => {
            const q = questionMap.get(slug);
            return q ? <QuestionCard key={slug} q={q} /> : null;
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <div className="mt-16">
        <FeaturedProducts />
        <div className="mt-6">
          <AdvertisementPlaceholder />
        </div>
      </div>

      {/* FEATURED / REVISION MODES */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">⚡ Interview Tomorrow?</h2>
        <p className="mt-1 text-sm text-slate-400">Pick your runway and we will pace your prep.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {REVISION.map((r) => (
            <Link
              key={r.title}
              href="/candidate"
              className={`card card-hover relative overflow-hidden bg-gradient-to-br ${r.accent} p-6`}
            >
              <span className="text-3xl">{r.emoji}</span>
              <h3 className="mt-3 text-lg font-bold text-white">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{r.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-300">Start →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BEYOND THE QUESTIONS */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">🧭 Beyond the Questions</h2>
        <p className="mt-1 text-sm text-slate-400">Prep the whole picture — your machine, your path, your reality.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/environment" className="card card-hover group p-6">
            <span className="text-3xl">🧭</span>
            <h3 className="mt-3 text-lg font-bold text-white group-hover:text-brand-200">Know Your Environment</h3>
            <p className="mt-2 text-sm text-slate-400">
              Don&apos;t guess your Java, Maven, or Docker version — verify it. Commands + config guides.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-300">Verify setup →</span>
          </Link>
          <Link href="/transition" className="card card-hover group p-6">
            <span className="text-3xl">🔀</span>
            <h3 className="mt-3 text-lg font-bold text-white group-hover:text-brand-200">Transition Hub</h3>
            <p className="mt-2 text-sm text-slate-400">
              IVR, middleware, tester, .NET, mainframe? Get a roadmap from legacy to modern full stack.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-300">Find your path →</span>
          </Link>
          <Link href="/real-world" className="card card-hover group p-6">
            <span className="text-3xl">🌍</span>
            <h3 className="mt-3 text-lg font-bold text-white group-hover:text-brand-200">Real World vs Interview</h3>
            <p className="mt-2 text-sm text-slate-400">
              The honest gap between textbook answers and how developers actually work day to day.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-300">Get real →</span>
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mt-16 scroll-mt-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">📚 Explore Topics</h2>
            <p className="mt-1 text-sm text-slate-400">Every category, with topics and counts.</p>
          </div>
          {/* Difficulty legend */}
          <div className="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Easy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Medium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Hard
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <TopicCard key={c.id} category={c} headingLevel="h3" maxTopics={4} />
          ))}
        </div>
      </section>

      {/* SUPPORT + FEEDBACK CTA */}
      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <div className="card relative overflow-hidden bg-gradient-to-br from-rose-500/15 to-orange-500/[0.06] p-6">
          <span className="text-3xl">❤️</span>
          <h3 className="mt-3 text-lg font-bold text-white">Keep it free &amp; ad-light</h3>
          <p className="mt-2 text-sm text-slate-300">
            No login, no paywall, barely any ads — on purpose. A small tip keeps it that way and funds new
            content. A Pro tier is coming in Phase 2.
          </p>
          <Link href="/donate" className="btn-primary mt-4">
            Support the Guru →
          </Link>
        </div>
        <div className="card relative overflow-hidden bg-gradient-to-br from-brand-500/15 to-sky-500/[0.06] p-6">
          <span className="text-3xl">💬</span>
          <h3 className="mt-3 text-lg font-bold text-white">Spotted something off?</h3>
          <p className="mt-2 text-sm text-slate-300">
            Wrong answer, a typo, or a topic we&apos;re missing? Thirty seconds of feedback makes the site better
            for the next person walking into an interview.
          </p>
          <Link href="/feedback" className="btn-secondary mt-4">
            Share feedback →
          </Link>
        </div>
      </section>
    </div>
  );
}
