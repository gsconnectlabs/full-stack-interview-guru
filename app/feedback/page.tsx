import type { Metadata } from "next";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata: Metadata = {
  alternates: { canonical: "/feedback" },
  title: "Feedback — Help shape the content",
  description:
    "Spotted a wrong answer, a typo, or a topic we're missing? Send quick feedback — no login, no spam. We read every message and ship fixes fast.",
};

const PROMISES = [
  { icon: "👀", text: "We read every single message." },
  { icon: "⚡", text: "Content fixes usually ship within days." },
  { icon: "🔒", text: "No login, no account, no spam — email is optional." },
  { icon: "🧭", text: "Your input directly sets our content roadmap." },
];

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ context?: string }>;
}) {
  const { context } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">💬 Feedback</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Help shape the content</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          This site gets better because real users tell us what&apos;s confusing, wrong, or missing. Thirty
          seconds of your time improves it for the next person walking into an interview.
        </p>
      </div>

      <div className="mt-10">
        <FeedbackForm context={context} />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {PROMISES.map((p) => (
          <div key={p.text} className="card flex items-center gap-3 p-4">
            <span className="text-xl">{p.icon}</span>
            <span className="text-sm text-slate-300">{p.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
