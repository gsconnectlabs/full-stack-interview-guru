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
  /** ⌨ Hands-on Keyboard */
  handsOn?: { code: string; lang: string; output?: string };
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
