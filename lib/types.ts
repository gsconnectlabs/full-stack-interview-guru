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
  /** 🗓️ Content last-updated date (ISO `YYYY-MM-DD`). Optional; drives the
   *  "Updated …" freshness chip and the QAPage `dateModified` signal. */
  updated?: string;

  // --- SEO overrides (optional) — used to tune high-impression pages for CTR ---
  /** Absolute `<title>` override that bypasses the root `"FIG – %s"` template
   *  (the supplied title carries its own branding). Falls back to `question`. */
  seoTitle?: string;
  /** Meta-description override (hand-written for CTR). Falls back to a derived summary. */
  seoDescription?: string;
  /** Visible `<h1>` override (keyword-led heading). The ☕ Coffee Chat block and the
   *  `QAPage` structured data keep using the conversational `question`. Falls back to `question`. */
  heading?: string;
  /** 🗣️ Guru's personal take — rendered as "Real Talk from Guru". Optional; omit the section entirely when absent. */
  guruTake?: string;
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
