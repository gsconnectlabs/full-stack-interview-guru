import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transition Hub — From Legacy to Modern Full Stack",
  description:
    "Switching from IVR, middleware, support, testing, mainframe, .NET or Python? Get a focused roadmap to modern full-stack interviews, built on the strengths you already have.",
  alternates: { canonical: "/transition" },
};

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
