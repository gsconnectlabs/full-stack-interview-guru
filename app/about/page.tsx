import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { founderName, founderTitle } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Us — Who builds Full Stack Interview Guru",
  description:
    "Full Stack Interview Guru is a free, distraction-free interview preparation platform for candidates and interviewers. Learn our mission, our content standards, and why FIG exists.",
  openGraph: {
    title: "About Full Stack Interview Guru",
    description:
      "A free, distraction-free interview prep platform built on trust, clarity and real understanding — for candidates and interviewers alike.",
    url: "/about",
    type: "website",
  },
};

/**
 * Real author identity (name/title come from lib/site.ts — the single source of truth
 * reused in schema.org authorship on question pages, so it's never duplicated by hand).
 * Bio is intentionally factual and minimal: no invented years of experience, employers,
 * interview counts, certifications, or degrees. Add real ones here only when true and
 * verifiable — do not embellish for effect.
 */
const FOUNDER = {
  name: founderName,
  title: founderTitle,
  photoUrl: "", // TODO(owner): set to a real photo path (e.g. "/images/founder.jpg") when available — shows an initials avatar until then
  bio: "Full Stack Interview Guru is independently built and maintained by Gurusankar M., with a focus on practical, production-oriented software engineering interview preparation.",
  credentials: [] as string[], // Intentionally empty — add only real, verifiable facts (no fabricated claims)
  linkedinUrl: "", // TODO(owner): personal LinkedIn URL, if you want one linked here (FIG's own LinkedIn Page is already linked in the footer + Organization schema)
  githubUrl: "", // TODO(owner): personal GitHub URL, if desired
};

const VALUES = [
  {
    icon: "🎯",
    title: "Our Mission",
    body: "Help every candidate walk into an interview understanding the concept — not just reciting an answer — and help every interviewer ask sharper, fairer questions.",
  },
  {
    icon: "🔭",
    title: "Our Vision",
    body: "Become one of the most trusted, calm and genuinely useful interview preparation platforms on the web, where learning always comes before monetization.",
  },
  {
    icon: "🧭",
    title: "Our Philosophy",
    body: "No login walls, no popups, no dark patterns, no clickbait. Content first, trust first, performance first. Simple beats clever; clarity beats noise.",
  },
];

const STANDARDS = [
  "Every explanation answers what, why, how, and when — not just a definition to memorize.",
  "Real-world context sits beside the interview answer, so you know how a concept is actually used.",
  "Content is written and reviewed by practitioners, kept current, and dated when it changes.",
  "We favour understanding and reasoning over rote memorization.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About Us" }]} />

      <div className="mt-6 text-center">
        <span className="chip mx-auto">🧭 About FIG</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
          About Full Stack Interview Guru
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Full Stack Interview Guru (FIG) is a free, distraction-free platform that helps candidates
          prepare for technical interviews and helps interviewers run better ones — across Java, Python,
          AWS, REST APIs, SQL, Docker, Kubernetes, System Design and more.
        </p>
      </div>

      {/* Who's behind FIG — real author identity (trust/E-E-A-T signal) */}
      <section className="card mt-12 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {FOUNDER.photoUrl ? (
            <img
              src={FOUNDER.photoUrl}
              alt={FOUNDER.name}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-300/20 text-2xl font-black text-brand-300"
              aria-hidden="true"
            >
              {FOUNDER.name
                .replace(/[[\]]/g, "")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div className="text-center sm:text-left">
            <span className="chip">✍️ Who writes this</span>
            <h2 className="mt-2 text-xl font-bold text-white">{FOUNDER.name}</h2>
            {FOUNDER.title && <p className="text-sm text-brand-300">{FOUNDER.title}</p>}
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{FOUNDER.bio}</p>

            {FOUNDER.credentials.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-left text-sm text-slate-300">
                {FOUNDER.credentials.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-300" aria-hidden="true">
                      ✓
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}

            {(FOUNDER.linkedinUrl || FOUNDER.githubUrl) && (
              <div className="mt-4 flex justify-center gap-3 sm:justify-start">
                {FOUNDER.linkedinUrl && (
                  <a
                    href={FOUNDER.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    LinkedIn
                  </a>
                )}
                {FOUNDER.githubUrl && (
                  <a
                    href={FOUNDER.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Philosophy */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="card p-5">
            <span className="text-2xl" aria-hidden="true">
              {v.icon}
            </span>
            <h2 className="mt-2 text-lg font-bold text-slate-100">{v.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{v.body}</p>
          </div>
        ))}
      </div>

      {/* Why FIG exists */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">Why FIG exists</h2>
        <div className="prose-legal mt-4">
          <p>
            Most interview resources optimize for traffic, not for learning — endless popups, gated
            downloads, and answers you&apos;re expected to memorize the night before. That approach helps
            you pass a quiz, not understand your craft.
          </p>
          <p>
            FIG was built to be the opposite: a calm, fast, honest place to prepare. We explain the
            reasoning behind each answer, show how it plays out in real work, and connect related topics
            so you build a mental model instead of a flashcard deck. The core content is, and will stay,
            free.
          </p>
        </div>
      </section>

      {/* Content quality standards */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">Content quality standards</h2>
        <ul className="mt-4 space-y-3">
          {STANDARDS.map((s) => (
            <li key={s} className="card flex items-start gap-3 p-4">
              <span className="mt-0.5 text-brand-300" aria-hidden="true">
                ✓
              </span>
              <span className="text-sm leading-relaxed text-slate-300">{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Audience + commitment */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-lg font-bold text-slate-100">Who it&apos;s for</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Students and new graduates, working developers preparing for their next role, career switchers,
            and interviewers who want structured question kits and rubrics. If you build or evaluate
            software, FIG is for you.
          </p>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-bold text-slate-100">Our commitment</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Keep the core free, keep the experience calm and accessible, keep the content accurate and
            current, and never let advertising or monetization interrupt your reading.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="card mt-12 flex flex-col items-center justify-between gap-3 p-6 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-slate-300">
          Have feedback, a correction, or a topic we should cover? We read every message.
        </p>
        <div className="flex gap-3">
          <Link href="/contact" className="btn-secondary">
            Contact us
          </Link>
          <Link href="/candidate" className="btn-primary">
            Start preparing →
          </Link>
        </div>
      </div>
    </div>
  );
}
