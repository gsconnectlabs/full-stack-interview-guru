import type { Question } from "@/lib/types";

/** Average adult reading speed for technical prose. */
const WORDS_PER_MINUTE = 200;

/** Count whitespace-delimited words, stripping light markdown so it doesn't inflate the total. */
function countWords(text: string): number {
  const cleaned = text.replace(/[*`>#_~]/g, " ").trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}

/**
 * Assemble the readable "question + answer" text for a question — the content a learner
 * actually reads on the page. Deliberately EXCLUDES metadata (tags, asked-in, difficulty,
 * experience), related questions, related-tech chips, external references, and any future
 * AI prompts — so the estimate reflects the core learning content only.
 */
function readableText(q: Question): string {
  const parts: string[] = [q.question];

  if (q.shortAnswer) parts.push(q.shortAnswer);

  for (const block of q.mindMap) {
    if (block.type === "text" && block.content) parts.push(block.content);
    if (block.type === "kv" && block.rows) parts.push(block.rows.map((r) => `${r.k} ${r.v}`).join(" "));
  }

  if (q.handsOn?.code) parts.push(q.handsOn.code);
  if (q.whatIf) parts.push(q.whatIf.q, q.whatIf.a);
  if (q.realWorld) parts.push(q.realWorld);
  if (q.interviewerExpectation) parts.push(...q.interviewerExpectation);
  if (q.commonMistakes) parts.push(...q.commonMistakes);
  if (q.bestPractices) parts.push(...q.bestPractices);
  if (q.followUps) parts.push(...q.followUps);

  return parts.join(" ");
}

/**
 * Estimated reading time for a question, in whole minutes (minimum 1). Pure and computed
 * at build time — no client-side JavaScript.
 */
export function readingTimeMinutes(q: Question): number {
  const words = countWords(readableText(q));
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
