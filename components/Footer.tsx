import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  const cols = categories.slice(0, 12);
  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-ink-950/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg">
                🧭
              </span>
              <span className="text-lg font-extrabold text-white">Full Stack Interview Guru</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-300">Prepare. Ask. Evaluate.</p>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              Built for candidates and interviewers. No login, no noise — just interviews.
            </p>
          </div>

          <div>
            <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
              {[
                { href: "/candidate", label: "Candidate Mode" },
                { href: "/interviewer", label: "Interviewer Mode" },
                { href: "/environment", label: "Know Your Environment" },
                { href: "/transition", label: "Transition Hub" },
                { href: "/real-world", label: "Real World vs Interview" },
                { href: "/feedback", label: "Feedback" },
                { href: "/donate", label: "❤️ Donate" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-brand-300"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Browse Topics</h4>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {cols.map((c) => (
                <Link
                  key={c.id}
                  href={`/candidate/${c.id}`}
                  className="text-sm text-slate-400 transition-colors hover:text-brand-300"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Full Stack Interview Guru. Made for the night-before crammers.</p>
          <p>Java • Python • AWS • REST • SQL • AI</p>
        </div>
      </div>
    </footer>
  );
}
