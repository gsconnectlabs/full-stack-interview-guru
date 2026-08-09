import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/40 bg-ink-950/80 backdrop-blur-lg">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" title="Full Stack Interview Guru" className="group flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt=""
            width={512}
            height={512}
            priority
            className="h-9 w-9 shrink-0 transition-transform group-hover:scale-105"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-extrabold tracking-tight text-white">
              F<span className="text-gold-400">I</span>G
              {/* Full name kept for SEO + screen readers; interface shows the short brand (DECISIONS #003). */}
              <span className="sr-only"> — Full Stack Interview Guru</span>
            </span>
            <span className="hidden text-[10px] font-medium text-slate-500 sm:block">
              Interview Tomorrow? Start Here.
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/candidate"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Candidate
          </Link>
          <Link
            href="/interviewer"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Interviewer
          </Link>
          <Link
            href="/store"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Store
          </Link>
          <Link
            href="/environment"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white md:block"
          >
            Environment
          </Link>
          <Link
            href="/transition"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white md:block"
          >
            Transition
          </Link>
          <Link
            href="/donate"
            aria-label="Donate"
            className="ml-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/20"
          >
            <span aria-hidden="true">❤️</span> <span className="hidden sm:inline">Donate</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
