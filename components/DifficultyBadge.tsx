import type { Difficulty } from "@/lib/types";

const styles: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const dot: Record<Difficulty, string> = {
  Easy: "bg-emerald-400",
  Medium: "bg-amber-400",
  Hard: "bg-rose-400",
};

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[level]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[level]}`} />
      {level}
    </span>
  );
}
