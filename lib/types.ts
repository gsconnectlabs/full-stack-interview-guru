export type Difficulty = "Easy" | "Medium" | "Hard";
export type Experience = "0-2 years" | "3-5 years" | "8-15 years";

export interface AnswerBlock {
  type: "text" | "code" | "kv";
  /** for text: paragraph; for code: source; for kv: not used */
  content?: string;
  /** code language */
  lang?: string;
  /** key/value rows for mind-map style */
  rows?: { k: string; v: string }[];
}

export interface Question {
  slug: string;
  categoryId: string;
  topic: string;
  /** ☕ Coffee Chat Question */
  question: string;
  /** 🧠 Mind Map Answer */
  mindMap: AnswerBlock[];
  /** ⌨ Hands-on Keyboard — optional time/space complexity for coding questions */
  handsOn?: { code: string; lang: string; output?: string; time?: string; space?: string };
  /** 🔥 What If? */
  whatIf?: { q: string; a: string };
  /** 😂 Real World — how developers actually use this on the job */
  realWorld?: string;
  /** 🎯 Interviewer's Expectation — keywords the interviewer is listening for */
  interviewerExpectation?: string[];
  difficulty: Difficulty;
  experience: Experience[];
  askedIn: string[];
  related?: string[]; // slugs

  // --- Extended (optional) fields used by the expanded question bank ---
  /** ⚡ TL;DR one-or-two line answer */
  shortAnswer?: string;
  /** Search/SEO tags */
  tags?: string[];
  /** 🔁 Follow-up questions an interviewer is likely to ask next */
  followUps?: string[];
  /** ⚠️ Common mistakes candidates make */
  commonMistakes?: string[];
  /** ✅ Best practices */
  bestPractices?: string[];
  /** 🧩 Related technologies / concepts */
  relatedTech?: string[];
  /** 📚 External references */
  references?: { label: string; url: string }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  count: number;
  topics: string[];
  accent: string; // tailwind gradient classes
}
