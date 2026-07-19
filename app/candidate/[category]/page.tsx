import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategory } from "@/lib/categories";
import { questionsByCategory } from "@/lib/questions";
import QuestionCard from "@/components/QuestionCard";
import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Not found" };
  return {
    title: `${cat.name} Interview Questions`,
    description: `${cat.name} interview questions and answers — ${cat.blurb} ${cat.count}+ curated questions.`,
    alternates: { canonical: `/candidate/${cat.id}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const qs = questionsByCategory(cat.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { name: "Candidate", href: "/candidate" },
          { name: cat.name },
        ]}
      />

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${cat.accent} text-3xl`}>
          {cat.icon}
        </span>
        <div>
          <h1 className="text-3xl font-black text-white">{cat.name}</h1>
          <p className="mt-1 text-slate-400">{cat.blurb}</p>
        </div>
        <span className="chip sm:ml-auto">{cat.count} questions</span>
      </div>

      {/* Topic pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {cat.topics.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      {/* Questions */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Sample Questions {qs.length > 0 && `(${qs.length} live)`}
        </h2>
        {qs.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qs.map((q) => (
              <QuestionCard key={q.slug} q={q} />
            ))}
          </div>
        ) : (
          <div className="card mt-4 p-8 text-center">
            <p className="text-slate-300">More {cat.name} questions are being written.</p>
            <p className="mt-1 text-sm text-slate-500">
              In the meantime, explore a topic with live samples below.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {categories
                .filter((c) => questionsByCategory(c.id).length > 0)
                .slice(0, 6)
                .map((c) => (
                  <Link key={c.id} href={`/candidate/${c.id}`} className="btn-secondary px-4 py-2 text-xs">
                    {c.icon} {c.name}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Ad below content only */}
      <div className="mt-12">
        <AdSlot />
      </div>
    </div>
  );
}
