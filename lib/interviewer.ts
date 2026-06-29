import type { Experience } from "./types";

export interface Rubric {
  Knowledge: number;
  Coding: number;
  "Problem Solving": number;
  Communication: number;
}

export interface InterviewKit {
  warmup: string[];
  scenario: string[];
  coding: string[];
  followUp: string[];
  keywords: string[];
  redFlags: string[];
  rubric: Rubric;
}

/** technology id -> experience -> kit */
export const interviewKits: Record<string, Partial<Record<Experience, InterviewKit>>> = {
  "core-java": {
    "0-2 years": {
      warmup: [
        "What is the difference between == and .equals()?",
        "Explain the four pillars of OOP with a one-line example each.",
        "What is the difference between an ArrayList and a LinkedList?",
      ],
      scenario: [
        "A loop over a HashMap throws ConcurrentModificationException. Why, and how do you fix it?",
        "You need to count word frequency in a sentence. Which collection do you reach for?",
      ],
      coding: [
        "Reverse a string without using StringBuilder.reverse().",
        "Find the first non-repeating character in a string.",
      ],
      followUp: [
        "Why is String immutable in Java?",
        "What happens if you forget to override hashCode()?",
      ],
      keywords: ["heap vs stack", "immutability", "hashCode/equals contract", "O(1) lookup", "autoboxing"],
      redFlags: [
        "Confuses == with .equals() for objects",
        "Cannot explain why String is immutable",
        "Uses a List where a Set or Map is the obvious fit",
      ],
      rubric: { Knowledge: 3, Coding: 3, "Problem Solving": 3, Communication: 4 },
    },
    "3-5 years": {
      warmup: [
        "How does HashMap work internally? Walk me through put().",
        "fail-fast vs fail-safe iterators — give an example of each.",
        "When would you choose ConcurrentHashMap over a synchronized map?",
      ],
      scenario: [
        "A service slows down under load; profiling shows heavy GC. How do you investigate?",
        "Two threads update a shared counter and you see lost updates. Walk me through the fix.",
      ],
      coding: [
        "Implement an LRU cache using LinkedHashMap.",
        "Group a list of employees by department using Streams.",
      ],
      followUp: [
        "What changed in HashMap in Java 8 (treeification)?",
        "Explain the volatile keyword and the happens-before relationship.",
      ],
      keywords: ["treeify threshold (8)", "load factor", "happens-before", "CAS", "generational GC"],
      redFlags: [
        "Thinks HashMap is thread-safe",
        "Cannot explain volatile vs synchronized",
        "No awareness of GC or memory tuning",
      ],
      rubric: { Knowledge: 4, Coding: 4, "Problem Solving": 4, Communication: 4 },
    },
    "8-15 years": {
      warmup: [
        "How would you design a thread-safe, bounded, in-memory cache from scratch?",
        "Walk me through the Java Memory Model and why it matters.",
        "When does it make sense to NOT use the JVM's default GC?",
      ],
      scenario: [
        "A production service has intermittent latency spikes every few minutes. Diagnose it end to end.",
        "You inherit a 500k-line monolith with no tests. How do you make it changeable?",
      ],
      coding: [
        "Design and implement a rate limiter (token bucket).",
        "Implement a producer-consumer pipeline with backpressure.",
      ],
      followUp: [
        "Trade-offs between G1, ZGC, and Shenandoah?",
        "How do you decide between virtual threads and a thread pool?",
      ],
      keywords: ["backpressure", "ZGC/G1 trade-offs", "virtual threads", "lock-free", "observability"],
      redFlags: [
        "Reaches for premature optimization without measuring",
        "Cannot articulate architectural trade-offs",
        "No strategy for legacy code or testing",
      ],
      rubric: { Knowledge: 5, Coding: 4, "Problem Solving": 5, Communication: 5 },
    },
  },
  python: {
    "3-5 years": {
      warmup: [
        "Explain the GIL and how it affects multithreaded Python.",
        "What is the difference between a list comprehension and a generator expression?",
        "How do *args and **kwargs work?",
      ],
      scenario: [
        "A data script is too slow and CPU-bound. Threads do not help — why, and what do you use?",
        "You see mutable default argument bugs. Explain the pitfall and the fix.",
      ],
      coding: [
        "Write a decorator that retries a function 3 times on exception.",
        "Flatten a nested list of arbitrary depth.",
      ],
      followUp: ["When would you use multiprocessing over asyncio?", "What does functools.lru_cache do?"],
      keywords: ["GIL", "multiprocessing", "generators/lazy eval", "context managers", "duck typing"],
      redFlags: [
        "Unaware of the GIL",
        "Falls into the mutable default argument trap",
        "Confuses concurrency with parallelism",
      ],
      rubric: { Knowledge: 4, Coding: 4, "Problem Solving": 4, Communication: 4 },
    },
  },
  aws: {
    "3-5 years": {
      warmup: [
        "When would you choose Lambda over an EC2 instance?",
        "Explain the difference between an IAM role and an IAM user.",
        "S3 vs EBS vs EFS — when do you use each?",
      ],
      scenario: [
        "Your Lambda behind API Gateway has high p99 latency. How do you investigate cold starts?",
        "An S3 bucket was accidentally made public. How do you detect and prevent this org-wide?",
      ],
      coding: [
        "Write a Lambda handler that reads an object from S3 and writes a thumbnail back.",
        "Sketch an IAM policy that grants read-only access to a single bucket.",
      ],
      followUp: ["How does VPC networking affect Lambda cold starts?", "What is the well-architected framework?"],
      keywords: ["least privilege", "cold start", "provisioned concurrency", "S3 versioning", "CloudWatch"],
      redFlags: [
        "Hardcodes credentials instead of using roles",
        "No concept of least privilege",
        "Cannot pick the right storage service",
      ],
      rubric: { Knowledge: 4, Coding: 3, "Problem Solving": 4, Communication: 4 },
    },
  },
  "system-design": {
    "8-15 years": {
      warmup: [
        "Walk me through how you would approach a system design problem in an interview.",
        "What is the CAP theorem and how does it guide your database choice?",
        "When do you introduce a cache, and what are the invalidation strategies?",
      ],
      scenario: [
        "Design a URL shortener that serves 10k redirects/sec. Talk through reads vs writes.",
        "Design a news feed. How do you handle fan-out for a user with 10M followers?",
      ],
      coding: [
        "Design the API and data model for a rate limiter shared across many servers.",
        "Sketch the schema and sharding strategy for a chat application.",
      ],
      followUp: ["Push vs pull for feeds — trade-offs?", "How do you keep a cache and DB consistent?"],
      keywords: ["horizontal scaling", "consistency vs availability", "sharding", "idempotency", "back-of-envelope"],
      redFlags: [
        "Jumps to a solution without clarifying requirements",
        "No estimation of scale or capacity",
        "Ignores failure modes and bottlenecks",
      ],
      rubric: { Knowledge: 5, Coding: 4, "Problem Solving": 5, Communication: 5 },
    },
  },
};

/** Build a sensible default kit for any technology that lacks a hand-written one. */
export function getKit(techId: string, exp: Experience): InterviewKit {
  const forTech = interviewKits[techId];
  if (forTech?.[exp]) return forTech[exp]!;
  // fall back to any defined experience for this tech
  const anyExp = forTech && (Object.values(forTech)[0] as InterviewKit | undefined);
  if (anyExp) return anyExp;
  // generic skeleton
  return {
    warmup: [
      "Start with fundamentals: ask the candidate to define the core concept in their own words.",
      "Ask for a real example of when they used this technology in a project.",
    ],
    scenario: [
      "Present a realistic production problem in this area and ask how they would debug it.",
      "Ask them to weigh two approaches and justify a choice.",
    ],
    coding: [
      "Give a small, focused task that exercises the core skill.",
      "Ask them to extend the solution to handle an edge case.",
    ],
    followUp: ["Why did you make that choice?", "What would you do differently at scale?"],
    keywords: ["fundamentals", "trade-offs", "real-world experience", "edge cases"],
    redFlags: ["Memorized definitions with no practical grounding", "Cannot reason about trade-offs"],
    rubric: { Knowledge: 4, Coding: 3, "Problem Solving": 4, Communication: 4 },
  };
}
