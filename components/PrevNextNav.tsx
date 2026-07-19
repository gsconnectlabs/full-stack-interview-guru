import Link from "next/link";
import type { Question, Category } from "@/lib/types";
import type { QuestionNav } from "@/lib/questions";

/**
 * Sequential Previous / Next navigation within a category, with the current
 * position ("Question N of M") and a "View all" link to the topic (Topic Roadmap).
 * Server-rendered — no client JavaScript. `rel="prev"/"next"` give search engines
 * a sequential-page hint; anchor text carries the neighbour's question for stronger
 * internal linking.
 */
export default function PrevNextNav({
  nav,
  category,
}: {
  nav: QuestionNav;
  category?: Category;
}) {
  const { prev, next, index, total } = nav;

  return (
    <nav aria-label="Question navigation" className="mt-12 border-t border-white/10 pt-6">
      <div className="grid items-stretch gap-3 sm:grid-cols-3">
        {/* Previous */}
        {prev ? (
          <NavLink question={prev} direction="prev" />
        ) : (
          <span className="hidden sm:block" aria-hidden="true" />
        )}

        {/* Position + View all */}
        <div className="flex flex-col items-center justify-center gap-1 text-center sm:order-none">
          <p className="text-sm font-semibold text-slate-300">
            Question {index} of {total}
          </p>
          {category && (
            <Link
              href={`/candidate/${category.id}`}
              className="text-xs font-medium text-brand-300 underline-offset-2 hover:text-brand-200 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
              View all {category.name} →
            </Link>
          )}
        </div>

        {/* Next */}
        {next ? (
          <NavLink question={next} direction="next" />
        ) : (
          <span className="hidden sm:block" aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}

function NavLink({ question, direction }: { question: Question; direction: "prev" | "next" }) {
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/q/${question.slug}`}
      rel={isPrev ? "prev" : "next"}
      className={`card card-hover flex flex-col gap-1 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
        isPrev ? "sm:text-left" : "sm:items-end sm:text-right"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span aria-hidden="true">{isPrev ? "← " : ""}</span>
        {isPrev ? "Previous" : "Next"}
        <span aria-hidden="true">{isPrev ? "" : " →"}</span>
      </span>
      <span className="line-clamp-2 text-sm font-medium text-slate-200">{question.question}</span>
    </Link>
  );
}
