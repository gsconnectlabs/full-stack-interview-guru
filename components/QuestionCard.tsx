import Link from "next/link";
import type { Question } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";

export default function QuestionCard({ q }: { q: Question }) {
  return (
    <Link href={`/q/${q.slug}`} className="card card-hover group block p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="chip">{q.topic}</span>
        <DifficultyBadge level={q.difficulty} />
      </div>
      <h3 className="mt-3 text-[15px] font-semibold leading-snug text-slate-100 group-hover:text-brand-200">
        {q.question}
      </h3>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {q.askedIn.slice(0, 3).map((co) => (
          <span key={co} className="text-xs text-slate-500">
            {co}
          </span>
        ))}
        <span className="ml-auto text-xs font-medium text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
          Read →
        </span>
      </div>
    </Link>
  );
}
