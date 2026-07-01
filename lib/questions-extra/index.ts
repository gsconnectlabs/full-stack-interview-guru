import type { Question } from "../types";
import { coreJavaExtra } from "./core-java";
import { javaCollectionsExtra } from "./java-collections";
import { multithreadingExtra } from "./multithreading";
import { jvmExtra } from "./jvm";
import { sqlExtra } from "./sql";
import { restApisExtra } from "./rest-apis";
import { microservicesExtra } from "./microservices";
import { awsExtra } from "./aws";
import { systemDesignExtra } from "./system-design";

/**
 * Aggregated expansion batches. Each flagship category adds its own file here and
 * spreads it into `extraQuestions`. The main `lib/questions.ts` merges this into the
 * exported `questions` array, so search, sitemap, structured data and category pages
 * all pick up new content automatically — no other wiring required.
 *
 * Completed batches (all 9 flagship categories, 180 questions):
 * Core Java, Java Collections, Multithreading, JVM, SQL, REST API, Microservices,
 * AWS, System Design — 20 each.
 */
export const extraQuestions: Question[] = [
  ...coreJavaExtra,
  ...javaCollectionsExtra,
  ...multithreadingExtra,
  ...jvmExtra,
  ...sqlExtra,
  ...restApisExtra,
  ...microservicesExtra,
  ...awsExtra,
  ...systemDesignExtra,
];
