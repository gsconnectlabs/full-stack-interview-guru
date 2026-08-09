/**
 * FIG Store — product catalog. Add a future product by appending a `StoreProduct`
 * entry; the store page and card are entirely data-driven, no page changes required.
 */
export interface StoreProduct {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  /** Zero means free — rendered as a "Free" badge, never a struck-through price. */
  price: { amount: number; currency: string };
  format: string;
  pageCount: number;
  benefits: string[];
  whatsInside: string[];
  audience: string;
  /** Purchase/download destination — the only place this URL lives. */
  gumroadUrl: string;
}

export const storeProducts: StoreProduct[] = [
  {
    slug: "top-50-java-interview-qa",
    title: "Top 50 Java Interview Questions & Answers — Free Edition",
    subtitle: "Quick Revision Guide for Java Interviews",
    description:
      "A structured revision guide covering 50 of the most frequently asked core Java interview questions — grouped from fundamentals to modern Java 8+ features, in the same short-answer, explanation, and runnable-code-example format used across FIG's free content.",
    coverImage: "/store/top-50-java-interview-qa-cover.png",
    coverAlt:
      "Cover of the FIG ebook 'Top 50 Java Interview Questions & Answers — Free Edition', a quick revision guide for Java interviews",
    price: { amount: 0, currency: "INR" },
    format: "PDF",
    pageCount: 61,
    benefits: [
      "Questions that are actually asked in interviews, not obscure trivia",
      "Explanations that connect the \"what\" to the \"why\"",
      "A runnable code example for every question",
      "Interview tips: common mistakes, likely follow-ups, and what interviewers listen for",
    ],
    whatsInside: [
      "Java Fundamentals & the JVM",
      "Object-Oriented Programming Principles",
      "Classes, Objects & Constructors",
      "static, final, Abstract Classes & Interfaces",
      "Strings in Java",
      "==, equals() & hashCode()",
      "The Collections Framework",
      "Comparable & Comparator",
      "Exception Handling",
      "Multithreading & Synchronization",
      "The Executor Framework",
      "Java Memory Model & Garbage Collection",
      "Serialization",
      "Java 8+ Modern Features (Lambdas, Streams, Optional, Records, sealed classes)",
    ],
    audience:
      "Candidates preparing for Java interviews who want a focused revision pass — built for review, not first-time learning, and pairs naturally with FIG's free Java interview question bank.",
    gumroadUrl: "https://interviewmaster1.gumroad.com/l/top-50-java-interview-questions",
  },
];
