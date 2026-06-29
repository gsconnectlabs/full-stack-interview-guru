import type { Metadata } from "next";
import { versionChecks, configGuides } from "@/lib/environment";
import CodeBlock from "@/components/CodeBlock";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  alternates: { canonical: "/environment" },
  title: "Know Your Environment — Don't Guess. Verify.",
  description:
    "Identify your dev environment before an interview. Quick commands to check Java, Maven, Git, Python, Node, Docker versions — plus how to set JAVA_HOME, PATH and upgrade the JDK.",
};

export default function EnvironmentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">🧭 Know Your Environment</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Don&apos;t Guess. Verify.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Half of interview nerves come from not knowing your own setup. Before you prep the answers, prep the
          machine — run these and know exactly what you&apos;re working with.
        </p>
      </div>

      {/* Version checks */}
      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-slate-500">
        ⌨ Check your versions
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {versionChecks.map((v) => (
          <div key={v.tool} className="card p-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{v.icon}</span>
              <h3 className="font-bold text-slate-100">{v.tool}</h3>
            </div>
            <div className="mt-3">
              <CodeBlock code={v.command} lang="bash" output={v.sample} />
            </div>
            <p className="mt-3 text-sm text-slate-400">{v.where}</p>
          </div>
        ))}
      </div>

      {/* Config guides */}
      <h2 className="mt-14 text-sm font-semibold uppercase tracking-wider text-slate-500">
        ⚙️ Configure &amp; upgrade
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {configGuides.map((g) => (
          <div key={g.title} className="card p-5">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <span className="text-xl">{g.icon}</span>
              {g.title}
            </h3>
            <ol className="mt-3 space-y-2">
              {g.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-[11px] font-bold text-brand-300">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <AdSlot />
      </div>
    </div>
  );
}
