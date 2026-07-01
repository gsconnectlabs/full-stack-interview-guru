import { questions } from "./questions";
import { categories } from "./categories";

export interface SearchDoc {
  slug: string;
  title: string;
  category: string;
  categoryId: string;
  topic: string;
  difficulty: string;
  haystack: string;
}

/** Flat, pre-lowercased index built once at module load — search is pure client filtering. */
export const searchIndex: SearchDoc[] = questions.map((q) => {
  const cat = categories.find((c) => c.id === q.categoryId);
  const extra = [
    q.topic,
    cat?.name ?? "",
    q.askedIn.join(" "),
    (q.tags ?? []).join(" "),
    q.shortAnswer ?? "",
    ...q.mindMap.flatMap((b) => [b.content ?? "", ...(b.rows?.map((r) => `${r.k} ${r.v}`) ?? [])]),
    q.whatIf?.q ?? "",
  ].join(" ");
  return {
    slug: q.slug,
    title: q.question,
    category: cat?.name ?? q.categoryId,
    categoryId: q.categoryId,
    topic: q.topic,
    difficulty: q.difficulty,
    haystack: `${q.question} ${extra}`.toLowerCase(),
  };
});

export function searchQuestions(query: string, limit = 8): SearchDoc[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of searchIndex) {
    let score = 0;
    for (const term of terms) {
      const idx = doc.haystack.indexOf(term);
      if (idx === -1) {
        score = -1;
        break;
      }
      // boost title matches
      score += doc.title.toLowerCase().includes(term) ? 5 : 1;
    }
    if (score > 0) scored.push({ doc, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.doc);
}
