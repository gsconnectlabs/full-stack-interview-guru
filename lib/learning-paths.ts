import { listedCategories } from "./category-visibility";
import { questionsByCategory } from "./questions";
import type { Category, Difficulty, Question } from "./types";

/**
 * Learning paths: the listed categories arranged into ordered tracks (foundations first), plus
 * difficulty helpers for topic pages. Everything is derived from live question data at build
 * time — a track only shows categories that are currently listed, and a track with no listed
 * categories is dropped, so a path can never point at an empty or thin page.
 */

export interface TrackDefinition {
  id: string;
  title: string;
  description: string;
  /** Category ids in suggested study order. */
  categoryIds: string[];
}

export interface Track extends Omit<TrackDefinition, "categoryIds"> {
  categories: Category[];
  /** First Easy question of the track's first category (falls back to its first question). */
  startHere?: Question;
}

const TRACKS: TrackDefinition[] = [
  {
    id: "java",
    title: "Java & the JVM",
    description:
      "Language fundamentals and collections first, then modern Java, concurrency, and what happens inside the JVM.",
    categoryIds: ["core-java", "java-collections", "java-8", "multithreading", "jvm", "advanced-java"],
  },
  {
    id: "services",
    title: "APIs & distributed systems",
    description:
      "How services talk to each other: HTTP semantics and payloads, then service boundaries, and finally designing for scale.",
    categoryIds: ["rest-apis", "json", "microservices", "system-design"],
  },
  {
    id: "data-cloud",
    title: "Data & cloud",
    description: "Relational data and query performance, then the core AWS building blocks.",
    categoryIds: ["sql", "aws"],
  },
  {
    id: "python",
    title: "Python",
    description: "Core data types and idioms, then functions, OOP, generators, and the GIL.",
    categoryIds: ["python"],
  },
];

export const DIFFICULTY_ORDER: Difficulty[] = ["Easy", "Medium", "Hard"];

/** Reader-facing stage names for each difficulty level (topic-page groupings). */
export const STAGE_LABEL: Record<Difficulty, string> = {
  Easy: "Foundations",
  Medium: "Core concepts",
  Hard: "Advanced",
};

function startingQuestion(categoryId: string): Question | undefined {
  const qs = questionsByCategory(categoryId);
  return qs.find((q) => q.difficulty === "Easy") ?? qs[0];
}

function buildTracks(): Track[] {
  const listed = new Map(listedCategories.map((c) => [c.id, c]));
  const placed = new Set<string>();

  const tracks: Track[] = TRACKS.map(({ categoryIds, ...rest }) => {
    const cats = categoryIds.flatMap((id) => {
      const c = listed.get(id);
      return c ? [c] : [];
    });
    cats.forEach((c) => placed.add(c.id));
    return { ...rest, categories: cats, startHere: cats[0] ? startingQuestion(cats[0].id) : undefined };
  }).filter((t) => t.categories.length > 0);

  // Newly listed categories that no track mentions yet still get surfaced.
  const unplaced = listedCategories.filter((c) => !placed.has(c.id));
  if (unplaced.length > 0) {
    tracks.push({
      id: "more",
      title: "More topics",
      description: "Further topics with enough published questions to study on their own.",
      categories: unplaced,
      startHere: startingQuestion(unplaced[0].id),
    });
  }
  return tracks;
}

export const tracks: Track[] = buildTracks();

/** The track a category belongs to, if it is listed. */
export function trackForCategory(categoryId: string): Track | undefined {
  return tracks.find((t) => t.categories.some((c) => c.id === categoryId));
}

export type DifficultySpread = Record<Difficulty, number>;

export function difficultySpread(qs: Question[]): DifficultySpread {
  const spread: DifficultySpread = { Easy: 0, Medium: 0, Hard: 0 };
  for (const q of qs) spread[q.difficulty]++;
  return spread;
}

/** Questions grouped by difficulty (original order kept within a group); empty groups omitted. */
export function groupByDifficulty(qs: Question[]): { difficulty: Difficulty; questions: Question[] }[] {
  return DIFFICULTY_ORDER.map((difficulty) => ({
    difficulty,
    questions: qs.filter((q) => q.difficulty === difficulty),
  })).filter((g) => g.questions.length > 0);
}

/** Distinct sub-topics that actually have published questions, most-covered first. */
export function topicsCovered(qs: Question[]): { topic: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const q of qs) counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}
