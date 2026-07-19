import Link from "next/link";
import type { Category } from "@/lib/types";

/**
 * Category ("topic") card linking to a category page. Consolidates the identical markup
 * previously duplicated on the homepage and the candidate index. Server component — no client JS.
 *
 * `headingLevel` preserves each page's heading hierarchy (h2 on the candidate index; h3 under
 * the homepage "Explore Topics" section). `maxTopics` limits the topic pills (the homepage
 * showed the first 4; the index shows all) — both preserve prior behavior exactly.
 */
export default function TopicCard({
  category,
  headingLevel = "h2",
  maxTopics,
}: {
  category: Category;
  headingLevel?: "h2" | "h3";
  maxTopics?: number;
}) {
  const Heading = headingLevel;
  const topics = maxTopics ? category.topics.slice(0, maxTopics) : category.topics;

  return (
    <Link href={`/candidate/${category.id}`} className="card card-hover group p-5">
      <div className="flex items-start justify-between">
        <span
          className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${category.accent} text-xl`}
        >
          {category.icon}
        </span>
        <span className="chip">{category.count} Qs</span>
      </div>
      <Heading className="mt-3 font-bold text-slate-100 group-hover:text-brand-200">{category.name}</Heading>
      <p className="mt-1 text-sm text-slate-400">{category.blurb}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {topics.map((t) => (
          <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
