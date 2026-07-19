import Link from "next/link";
import { categories } from "@/lib/categories";

/**
 * Footer link columns. Every href resolves to a real route (verified against the
 * App Router tree) — no placeholder or dead links. "Topics" is served by the
 * Browse Topics grid below, so it isn't duplicated as a single link here.
 */
const LINK_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/candidate", label: "Interview Questions" },
      { href: "/interviewer", label: "Interviewer Mode" },
      { href: "/real-world", label: "Real World vs Interview" },
      { href: "/environment", label: "Know Your Environment" },
      { href: "/transition", label: "Transition Hub" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/feedback", label: "Feedback" },
      { href: "/donate", label: "❤️ Donate" },
    ],
  },
];

export default function Footer() {
  const topics = categories.slice(0, 12);
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

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {group.title}
                </h4>
                <ul className="mt-4 space-y-2">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm font-medium text-slate-300 transition-colors hover:text-brand-300"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Browse Topics</h4>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
            {topics.map((c) => (
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

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Full Stack Interview Guru. Made for the night-before crammers.</p>
          <p>Java • Python • AWS • REST • SQL • AI</p>
        </div>
      </div>
    </footer>
  );
}
