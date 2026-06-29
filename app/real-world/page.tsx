import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  alternates: { canonical: "/real-world" },
  title: "Real World vs Interview World",
  description:
    "The honest gap between textbook answers and how developers actually work — plus the commands and configs developers Google every single day.",
};

const CONTRASTS = [
  {
    q: "Which Java version are you using?",
    interview: "Quotes the spec: “Java 17 LTS, sealed classes, records, pattern matching…”",
    real: "Opens a terminal and runs `java -version`. Nobody memorizes it — they verify it.",
  },
  {
    q: "What Eclipse version do you have?",
    interview: "“2024-03, with the latest Spring tooling.”",
    real: "Most devs upgrade only when a plugin breaks. Help → About tells the truth.",
  },
  {
    q: "What Axis version is the project on?",
    interview: "Recites Axis2 1.8.x feature differences confidently.",
    real: "Usually remembered the hard way — during a SOAP compatibility bug at 5pm Friday.",
  },
  {
    q: "How do you reverse a linked list?",
    interview: "Whiteboards three pointers from memory, flawlessly.",
    real: "Calls Collections.reverse() or a library — and that's the correct production answer.",
  },
  {
    q: "What's your code coverage target?",
    interview: "“80%+, with meaningful assertions across all branches.”",
    real: "Covers the risky paths well, skips trivial getters, and argues about the number in standup.",
  },
];

const GOOGLED = [
  "java -version",
  "mvn -v",
  "git --version",
  "docker --version",
  "python --version",
  "node -v",
  "How to set JAVA_HOME",
  "How to upgrade Eclipse",
  "Maven settings.xml proxy",
  "Axis2 compatibility matrix",
  "Spring Boot 2 to 3 migration",
  "Java 8 to Java 17 changes",
  "git undo last commit",
  "kill process on port 8080",
];

export default function RealWorldPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">🌍 Reality Check</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Real World vs Interview World</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Interviews test what you can recite. Jobs test what you can ship. Here&apos;s the honest gap — and the
          realistic answers that show you&apos;ve actually done the work.
        </p>
      </div>

      {/* Contrast table */}
      <div className="mt-10 space-y-4">
        {CONTRASTS.map((c) => (
          <div key={c.q} className="card overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-3">
              <p className="font-semibold text-slate-100">{c.q}</p>
            </div>
            <div className="grid sm:grid-cols-2">
              <div className="border-b border-white/[0.06] p-5 sm:border-b-0 sm:border-r">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">📚 Interview World</p>
                <p className="mt-2 text-sm text-slate-300">{c.interview}</p>
              </div>
              <div className="bg-emerald-500/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">🛠️ Real World</p>
                <p className="mt-2 text-sm text-slate-300">{c.real}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Things developers Google */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">🔎 Things Developers Google Every Day</h2>
        <p className="mt-1 text-sm text-slate-400">
          No shame here — knowing <em>what</em> to look up is half the skill. Bookmark the ones you keep forgetting.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {GOOGLED.map((g) => (
            <span key={g} className="chip font-mono">
              {g}
            </span>
          ))}
        </div>
        <Link href="/environment" className="btn-secondary mt-6">
          🧭 Verify your environment →
        </Link>
      </section>

      <div className="mt-14">
        <AdSlot />
      </div>
    </div>
  );
}
