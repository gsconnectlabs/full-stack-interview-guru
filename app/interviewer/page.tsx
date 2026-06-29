"use client";

import { useMemo, useState } from "react";
import { categories } from "@/lib/categories";
import { getKit } from "@/lib/interviewer";
import type { Experience } from "@/lib/types";

const EXPERIENCES: Experience[] = ["0-2 years", "3-5 years", "8-15 years"];

const RUBRIC_KEYS = ["Knowledge", "Coding", "Problem Solving", "Communication"] as const;

function Stars({ value }: { value: number }) {
  return (
    <span className="text-base tracking-tight" aria-label={`${value} out of 5`}>
      <span className="text-amber-400">{"★".repeat(value)}</span>
      <span className="text-ink-600">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function Panel({
  emoji,
  title,
  items,
  tone = "default",
}: {
  emoji: string;
  title: string;
  items: string[];
  tone?: "default" | "danger" | "good";
}) {
  const ring =
    tone === "danger"
      ? "border-l-rose-500/60"
      : tone === "good"
        ? "border-l-emerald-500/60"
        : "border-l-brand-500/60";
  return (
    <div className={`card border-l-2 ${ring} p-5`}>
      <h3 className="flex items-center gap-2 font-bold text-white">
        <span>{emoji}</span>
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-300">
            <span className="select-none text-slate-600">{tone === "danger" ? "⚠" : "›"}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InterviewerPage() {
  const [techId, setTechId] = useState(categories[0].id);
  const [exp, setExp] = useState<Experience>("3-5 years");

  const tech = categories.find((c) => c.id === techId)!;
  const kit = useMemo(() => getKit(techId, exp), [techId, exp]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">🧑‍⚖️ Interviewer Mode</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Prepare Questions For Your Candidate</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Pick a technology and experience level. Get warmups, scenarios, coding tasks, follow-ups, what to
          listen for, red flags, and a scoring rubric.
        </p>
      </div>

      {/* Controls */}
      <div className="card mt-10 p-5 sm:p-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Technology</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setTechId(c.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                techId === c.id
                  ? "bg-brand-600 text-white"
                  : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              <span className="mr-1">{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Experience
        </label>
        <div className="mt-2 inline-flex rounded-xl border border-white/10 bg-ink-900 p-1">
          {EXPERIENCES.map((e) => (
            <button
              key={e}
              onClick={() => setExp(e)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                exp === e ? "bg-brand-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Header for selection */}
      <div className="mt-8 flex items-center gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${tech.accent} text-2xl`}>
          {tech.icon}
        </span>
        <div>
          <h2 className="text-xl font-bold text-white">
            {tech.name} · <span className="text-brand-300">{exp}</span>
          </h2>
          <p className="text-sm text-slate-500">Interview kit</p>
        </div>
      </div>

      {/* Kit */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel emoji="👋" title="Warmup Questions" items={kit.warmup} />
        <Panel emoji="🎬" title="Scenario Questions" items={kit.scenario} />
        <Panel emoji="⌨️" title="Coding Questions" items={kit.coding} />
        <Panel emoji="🔁" title="Follow-up Questions" items={kit.followUp} />
        <Panel emoji="✅" title="Expected Answer Keywords" items={kit.keywords} tone="good" />
        <Panel emoji="🚩" title="Red Flags" items={kit.redFlags} tone="danger" />
      </div>

      {/* Rubric */}
      <div className="card mt-5 p-6">
        <h3 className="flex items-center gap-2 font-bold text-white">
          <span>📊</span> Evaluation Rubric
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {RUBRIC_KEYS.map((k) => (
            <div
              key={k}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-200">{k}</span>
              <Stars value={kit.rubric[k]} />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Stars indicate the expected bar for this level — score the candidate against it, not in absolute terms.
        </p>
      </div>
    </div>
  );
}
