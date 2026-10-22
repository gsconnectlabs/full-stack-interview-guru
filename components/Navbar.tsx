import Image from "next/image";
import Link from "next/link";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/50 bg-ink-950">
      <nav aria-label="Primary" className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" title="Full Stack Interview Guru" className="group flex shrink-0 items-center gap-2.5">
          <Image
            src="/icon.png"
            alt=""
            width={512}
            height={512}
            priority
            className="h-9 w-9 shrink-0"
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

        <NavMenu />
      </nav>
    </header>
  );
}
