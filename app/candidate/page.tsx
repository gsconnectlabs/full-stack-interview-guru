import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import TopicIndex from "@/components/TopicIndex";
import { listedCategories, totalLiveQuestions } from "@/lib/category-visibility";

export const metadata: Metadata = {
  alternates: { canonical: "/candidate" },
  title: "Candidate Mode — Browse Interview Questions",
  description:
    "Browse interview questions by topic: Core Java, Java Collections, Multithreading, JVM, Python, REST APIs, Microservices, JSON, SQL, AWS and System Design.",
};

export default function CandidatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
        <div>
          <p className="eyebrow">Candidate Mode</p>
          <h1 className="mt-3 font-serif text-3xl font-black tracking-tight text-white sm:text-4xl">Browse by Topic</h1>
          <p className="mt-3 max-w-xl leading-relaxed text-slate-400">
            {totalLiveQuestions.toLocaleString()}+ questions across {listedCategories.length} categories. Topics are
            grouped into tracks and ordered so each builds on the last — pick a topic, or search to jump straight to an
            answer.
          </p>
        </div>
        <SearchBar align="start" />
      </div>

      <div className="mt-10">
        <TopicIndex detailed />
      </div>
    </div>
  );
}
