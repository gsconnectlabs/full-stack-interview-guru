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
    <figure className="overflow-hidden rounded-lg border border-ink-700/70 bg-[#07100e]">
      <figcaption className="flex items-center justify-between border-b border-ink-800 bg-ink-900/60 py-1.5 pl-4 pr-2">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">{lang ?? "code"}</span>
        <CopyButton
          value={code}
          label="Copy code"
          className="min-h-[36px] rounded-md px-3 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70"
        />
      </figcaption>
      {/* Scrolls horizontally inside the block; focusable so keyboard users can scroll it too. */}
      <pre tabIndex={0} className="overflow-x-auto p-4 text-[13.5px] leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400/60 sm:text-sm">
        <code className="font-mono text-slate-200">{code}</code>
      </pre>
      {output !== undefined && (
        <div className="border-t border-ink-800 bg-emerald-500/[0.04] px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80">Output</span>
          <pre tabIndex={0} className="mt-1 overflow-x-auto font-mono text-sm text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60">
            {output}
          </pre>
        </div>
      )}
    </figure>
  );
}
