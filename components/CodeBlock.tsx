import CopyButton from "@/components/CopyButton";

export default function CodeBlock({
  code,
  lang,
  output,
}: {
  code: string;
  lang?: string;
  output?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0d18]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          {lang && <span className="ml-2 text-xs font-medium text-slate-500">{lang}</span>}
        </div>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-slate-200">{code}</code>
      </pre>
      {output !== undefined && (
        <div className="border-t border-white/[0.06] bg-emerald-500/[0.04] px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500/70">Output</span>
          <pre className="mt-1 overflow-x-auto font-mono text-sm text-emerald-300">{output}</pre>
        </div>
      )}
    </div>
  );
}
