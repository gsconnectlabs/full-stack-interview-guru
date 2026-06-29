import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <span className="text-6xl">🧭</span>
      <h1 className="mt-6 text-3xl font-black text-white">Lost in the stack?</h1>
      <p className="mt-3 text-slate-400">
        This page isn’t in our prep deck. Let’s get you back to the questions.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          ← Back home
        </Link>
        <Link href="/candidate" className="btn-secondary">
          Browse topics
        </Link>
      </div>
    </div>
  );
}
