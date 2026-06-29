import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interviewer Mode — Question Kits & Rubrics",
  description:
    "Generate warm-up, scenario, coding and follow-up questions, plus expected keywords, red flags and an evaluation rubric — tailored by technology and experience level.",
  alternates: { canonical: "/interviewer" },
};

export default function InterviewerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
