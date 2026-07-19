import type { Question } from "@/lib/types";

/**
 * "Continue Learning with AI" (ROADMAP H2 / DECISIONS #008).
 *
 * Pure, dependency-free module. `buildAiPrompts` runs at build time inside the
 * server-rendered question page, so the four prompt strings are prerendered and the
 * client island (`AISection`) ships no prompt-building logic — only the tiny provider
 * config below. Prompts are derived solely from the question's own public content
 * (topic + question text) — no PII, no external calls.
 */

export type AiLevelId = "beginner" | "intermediate" | "senior" | "architect";

export interface AiPrompt {
  id: AiLevelId;
  /** Short label for the level selector. */
  label: string;
  /** One-line description of what this depth gives the learner. */
  hint: string;
  /** The ready-to-paste prompt. */
  prompt: string;
}

/** An AI assistant the learner can open the prompt in. */
export interface AiProvider {
  id: "chatgpt" | "gemini" | "claude";
  name: string;
  /** Decorative label glyph (aria-hidden at the call site). */
  emoji: string;
  /**
   * Deep link for the provider. When `prefill` is true the prompt is passed via a
   * query param so it lands in the composer; otherwise the app opens blank and the
   * learner pastes the copied prompt.
   */
  buildUrl: (prompt: string) => string;
  prefill: boolean;
}

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    emoji: "💬",
    buildUrl: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`,
    prefill: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    emoji: "✨",
    buildUrl: () => "https://gemini.google.com/app",
    prefill: false,
  },
  {
    id: "claude",
    name: "Claude",
    emoji: "🟣",
    buildUrl: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}`,
    prefill: true,
  },
];

/** Collapse the question into a clean, single-line subject for the prompt header. */
function subject(q: Question, categoryLabel: string): string {
  return `Topic: ${q.topic} (${categoryLabel})\nInterview question: "${q.question.trim()}"`;
}

/**
 * Build the four depth-graded prompts for a question. Author-controlled content only;
 * safe to render as text (never used as HTML).
 */
export function buildAiPrompts(q: Question, categoryLabel?: string): AiPrompt[] {
  const head = subject(q, categoryLabel ?? q.topic);

  return [
    {
      id: "beginner",
      label: "Beginner",
      hint: "Plain-language foundations",
      prompt: `I'm preparing for a software engineering interview and want to understand this from scratch, as a beginner.

${head}

Please:
1. Explain the core idea in simple, plain language, using an everyday analogy.
2. Define any technical terms you use.
3. Walk through one small, concrete example.
4. Finish with a single sentence I can easily remember.

Keep the tone friendly and assume I'm new to this topic.`,
    },
    {
      id: "intermediate",
      label: "Intermediate",
      hint: "How it works + trade-offs",
      prompt: `I'm preparing for a software engineering interview and already know the basics. Help me build a solid, practical understanding.

${head}

Please:
1. Explain how this actually works under the hood.
2. Show a realistic code or design example and walk through it step by step.
3. Compare it with one or two common alternatives and their trade-offs.
4. List the mistakes candidates most often make here.
5. Give me two likely follow-up questions with brief model answers.`,
    },
    {
      id: "senior",
      label: "Senior Engineer",
      hint: "Production depth + mock interview",
      prompt: `Act as a senior engineer interviewing me for a senior software role.

${head}

Please:
1. Give a precise, production-grade explanation.
2. Discuss performance, scalability, failure modes, and important edge cases.
3. Show idiomatic, production-quality code or configuration where relevant.
4. Explain how I should justify the design choices and trade-offs out loud in an interview.
5. Then ask me three progressively harder follow-up questions — one at a time — and critique each of my answers before moving on.`,
    },
    {
      id: "architect",
      label: "Architect",
      hint: "Systems-level reasoning",
      prompt: `Act as a principal engineer / software architect. I want to reason about this at a systems level.

${head}

Please:
1. Frame where this fits within a larger system architecture.
2. Analyse the trade-offs across scalability, reliability, cost, security, and maintainability.
3. Compare competing approaches and when each is appropriate at scale.
4. Describe realistic failure scenarios and how to design against them.
5. Pose one open-ended, system-design-style scenario based on this topic, then evaluate my reasoning as I work through it.`,
    },
  ];
}
