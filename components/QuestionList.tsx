import type { Question } from "@/lib/types";
import QuestionCard from "./QuestionCard";

/** Divided list of question rows. `numbered` renders an ordered list with visible positions. */
export default function QuestionList({
  questions,
  showCategory = false,
  numbered = false,
}: {
  questions: Question[];
  showCategory?: boolean;
  numbered?: boolean;
}) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className="divide-y divide-ink-800 border-y border-ink-800">
      {questions.map((q, i) => (
        <li key={q.slug} className={numbered ? "flex items-start gap-3" : undefined}>
          {numbered && (
            <span aria-hidden="true" className="w-6 shrink-0 pt-[15px] text-right font-mono text-xs text-gold-400/80">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <QuestionCard q={q} showCategory={showCategory} />
          </div>
        </li>
      ))}
    </List>
  );
}
