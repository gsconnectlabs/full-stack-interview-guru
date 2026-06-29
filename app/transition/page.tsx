"use client";

import { useState } from "react";
import Link from "next/link";
import { transitionPaths } from "@/lib/transitions";
import { getCategory } from "@/lib/categories";

export default function TransitionPage() {
  const [activeId, setActiveId] = useState(transitionPaths[0].id);
  const active = transitionPaths.find((p) => p.id === activeId)!;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">🔀 Transition Hub</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">From Legacy to Modern Full Stack</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          You don&apos;t start from zero. Pick where you&apos;re coming from and get a focused roadmap that builds
          on what you already know.
        </p>
      </div>

      {/* Background picker */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {transitionPaths.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeId === p.id
                ? "bg-brand-600 text-white"
                : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
            }`}
          >
            <span className="mr-1.5">{p.icon}</span>
            {p.background}
          </button>
        ))}
      </div>

      {/* Active path */}
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="card bg-gradient-to-br from-brand-500/10 to-sky-500/[0.04] p-6">
          <span className="text-4xl">{active.icon}</span>
          <h2 className="mt-3 text-xl font-bold text-white">{active.background}</h2>
          <p className="mt-2 text-slate-300">{active.pitch}</p>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
            You already bring
          </h3>
          <ul className="mt-2 space-y-1.5">
            {active.strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-emerald-200">
                <span>✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Roadmap */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Your roadmap</h3>
          <ol className="mt-4 space-y-3">
            {active.roadmap.map((catId, i) => {
              const cat = getCategory(catId);
              if (!cat) return null;
              return (
                <li key={catId}>
                  <Link
                    href={`/candidate/${cat.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-brand-500/40 hover:bg-white/[0.05]"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-300">
                      {i + 1}
                    </span>
                    <span className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${cat.accent} text-lg`}>
                      {cat.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-100 group-hover:text-brand-200">
                        {cat.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">{cat.blurb}</span>
                    </span>
                    <span className="ml-auto text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <Link href="/candidate" className="btn-primary mt-6 w-full">
            Start the roadmap →
          </Link>
        </div>
      </div>
    </div>
  );
}
