import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import TopicCard from "@/components/TopicCard";
import { categories, totalQuestions } from "@/lib/categories";

export const metadata: Metadata = {
  alternates: { canonical: "/candidate" },
  title: "Candidate Mode — Browse Interview Questions",
  description:
    "Browse interview questions by topic: Core Java, Java 8+, Python, REST APIs, SQL, AWS, Docker, Kubernetes, AI and more.",
};

export default function CandidatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">🎯 Candidate Mode</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Browse by Topic</h1>
        <p className="mx-auto mt-3 max-w-lg text-slate-400">
          {totalQuestions.toLocaleString()}+ questions across {categories.length} categories. Pick a topic, or
          search to jump straight to an answer.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <SearchBar />
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <TopicCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
