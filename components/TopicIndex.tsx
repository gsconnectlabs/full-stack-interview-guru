import Link from "next/link";
import { tracks, difficultySpread } from "@/lib/learning-paths";
import { questionsByCategory } from "@/lib/questions";
import DifficultySpread from "./DifficultySpread";

/**
 * Every listed topic, arranged as ordered learning tracks (see `lib/learning-paths`). Used on the
 * homepage (compact: names + counts) and the candidate index (`detailed`: blurbs + difficulty mix).
 * Server component; `headingLevel` keeps each page's heading outline intact.
 */
export default function TopicIndex({
  headingLevel = "h2",
  detailed = false,
}: {
  headingLevel?: "h2" | "h3";
  detailed?: boolean;
}) {
  const TrackHeading = headingLevel;
  const TopicHeading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <div className="divide-y divide-ink-700/60 border-y border-ink-700/60">
      {tracks.map((track) => (
        <section
          key={track.id}
          aria-labelledby={`track-${track.id}`}
          className="grid gap-5 py-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10"
        >
          <div>
            <TrackHeading id={`track-${track.id}`} className="font-serif text-xl font-bold text-white">
              {track.title}
            </TrackHeading>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{track.description}</p>
            {track.startHere && (
              <p className="mt-3 text-sm text-slate-400">
                <span className="eyebrow mr-1.5 text-gold-400/90">Start with</span>
                <Link href={`/q/${track.startHere.slug}`} className="text-link">
                  {track.startHere.question}
                </Link>
              </p>
            )}
          </div>

          <ol className={`grid gap-x-6 ${detailed ? "gap-y-1 md:grid-cols-2" : "gap-y-0 sm:grid-cols-2 xl:grid-cols-3"}`}>
            {track.categories.map((c, i) => {
              const qs = questionsByCategory(c.id);
              return (
                <li key={c.id}>
                  <Link
                    href={`/candidate/${c.id}`}
                    className="group -mx-3 flex h-full items-start gap-3 rounded-md px-3 py-3 transition-colors hover:bg-white/[0.03]"
                  >
                    <span aria-hidden="true" className="w-5 shrink-0 pt-0.5 font-mono text-xs text-gold-400/80">
                      {i + 1}.
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <TopicHeading className="font-semibold text-slate-100 group-hover:text-brand-200">
                          <span aria-hidden="true" className="mr-1.5 text-sm">{c.icon}</span>
                          {c.name}
                        </TopicHeading>
                        <span className="shrink-0 text-xs tabular-nums text-slate-500">
                          {qs.length} <span className="sr-only">questions</span>
                          <span aria-hidden="true">Qs</span>
                        </span>
                      </span>
                      {detailed && (
                        <>
                          <span className="mt-1 block text-sm leading-relaxed text-slate-400">{c.blurb}</span>
                          <span className="mt-2.5 block">
                            <DifficultySpread spread={difficultySpread(qs)} />
                          </span>
                        </>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
