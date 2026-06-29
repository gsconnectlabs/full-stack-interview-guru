import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { categories, totalQuestions } from "@/lib/categories";

export const metadata: Metadata = {
  alternates: { canonical: "/candidate" },
  title: "Candidate Mode — Browse Interview Questions",
  description:
    "Browse interview questions by topic: Core Java, Java 8+, Python, REST APIs, SQL, AWS, Docker, Kubernetes, AI and more.",
};

export default function CandidatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">🎯 Candidate Mode</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Browse by Topic</h1>
        <p className="mx-auto mt-3 max-w-lg text-slate-400">
          {totalQuestions.toLocaleString()}+ questions across {categories.length} categories. Pick a topic, or
          search to jump straight to an answer.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <SearchBar />
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.id} href={`/candidate/${c.id}`} className="card card-hover group p-5">
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.accent} text-xl`}>
                {c.icon}
              </span>
              <span className="chip">{c.count} Qs</span>
            </div>
            <h2 className="mt-3 font-bold text-slate-100 group-hover:text-brand-200">{c.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{c.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.topics.map((t) => (
                <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
