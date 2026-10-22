import type { DifficultySpread as Spread } from "@/lib/learning-paths";
import { DIFFICULTY_ORDER } from "@/lib/learning-paths";
import { difficultyDot } from "./DifficultyBadge";

/** Proportional easy/medium/hard bar with a text summary (the bar itself is decorative). */
export default function DifficultySpread({ spread }: { spread: Spread }) {
  const total = DIFFICULTY_ORDER.reduce((n, d) => n + spread[d], 0);
  if (total === 0) return null;
  const present = DIFFICULTY_ORDER.filter((d) => spread[d] > 0);
  return (
    <span className="flex flex-col gap-1.5">
      <span aria-hidden="true" className="flex h-1 w-full max-w-[10rem] overflow-hidden rounded-full bg-ink-800">
        {present.map((d) => (
          <span key={d} className={difficultyDot[d]} style={{ width: `${(spread[d] / total) * 100}%` }} />
        ))}
      </span>
      <span className="text-[11px] text-slate-400">
        {present.map((d) => `${spread[d]} ${d.toLowerCase()}`).join(" · ")}
      </span>
    </span>
  );
}
