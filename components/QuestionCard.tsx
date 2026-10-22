import Link from "next/link";
import type { Question } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import DifficultyBadge from "./DifficultyBadge";

/**
 * One question as a compact, scannable row (title, sub-topic, difficulty). Designed to sit in a
 * divided list (see `QuestionList`) rather than a grid of boxes, so long lists read like an index.
 */
export default function QuestionCard({ q, showCategory = false }: { q: Question; showCategory?: boolean }) {
  const category = showCategory ? getCategory(q.categoryId)?.name : undefined;
  return (
    <Link
      href={`/q/${q.slug}`}
      className="group -mx-3 flex items-start gap-4 rounded-md px-3 py-3.5 transition-colors hover:bg-white/[0.03]"
    >
      <span className="min-w-0 flex-1">
        <h3 className="text-[15px] font-medium leading-snug text-slate-100 group-hover:text-brand-200">
          {q.question}
        </h3>
        <span className="mt-1 block text-xs text-slate-500">
          {category ? `${category} · ${q.topic}` : q.topic}
        </span>
      </span>
      <span className="shrink-0 pt-0.5">
        <DifficultyBadge level={q.difficulty} compact />
      </span>
    </Link>
  );
}
