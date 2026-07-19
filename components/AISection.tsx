"use client";

import { useId, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { AI_PROVIDERS, type AiPrompt } from "@/lib/ai-prompts";

/**
 * "Continue Learning with AI" (ROADMAP H2 / DECISIONS #008).
 *
 * A single client island rendered below the server-rendered answer. The four prompts are
 * precomputed at build time (`buildAiPrompts` in the question page) and passed in as plain
 * strings, so this component ships no prompt-building logic — only level selection, copy
 * (reusing the shared `CopyButton`), and "open in" deep links.
 *
 * Accessibility: the level selector is a labelled button group with `aria-pressed`; the
 * prompt region is `aria-live="polite"` so the change is announced on switch. Decorative
 * emoji are `aria-hidden`. Opening a provider also copies the prompt (so assistants without
 * a prefill deep link, e.g. Gemini, can be pasted into immediately).
 */
export default function AISection({ prompts }: { prompts: AiPrompt[] }) {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const current = prompts[active] ?? prompts[0];
  if (!current) return null;

  return (
    <section className="mt-12" aria-labelledby={`${panelId}-heading`}>
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/[0.06] bg-brand-500/[0.06] px-5 py-4">
          <h2
            id={`${panelId}-heading`}
            className="flex items-center gap-2 text-lg font-bold text-white"
          >
            <span aria-hidden="true" className="text-xl">🤖</span>
            Continue Learning with AI
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Take this question deeper with your favourite AI assistant. Pick a depth, copy the
            prompt, or open it directly — AI is your learning companion, not a shortcut.
          </p>
        </div>

        <div className="p-5">
          {/* Level selector */}
          <div
            role="group"
            aria-label="Choose a learning depth"
            className="flex flex-wrap gap-2"
          >
            {prompts.map((p, i) => {
              const selected = i === active;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "rounded-full border border-brand-500/50 bg-brand-500/15 px-3.5 py-1.5 text-xs font-semibold text-brand-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                      : "rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-brand-500/40 hover:bg-white/[0.07] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                  }
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-xs text-slate-500">{current.hint}</p>

          {/* Prompt preview */}
          <div
            id={panelId}
            aria-live="polite"
            className="mt-3 max-h-72 overflow-auto rounded-xl border border-white/10 bg-ink-950/60 p-4"
          >
            <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-slate-200">
              {current.prompt}
            </pre>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CopyButton
              value={current.prompt}
              className="btn-pill"
              ariaLabel={`Copy prompt (${current.label} level)`}
              label={
                <>
                  <span aria-hidden="true">📋 </span>Copy prompt
                </>
              }
              copiedLabel={
                <>
                  <span aria-hidden="true">✓ </span>Prompt copied
                </>
              }
            />

            <span className="ml-1 text-xs font-medium text-slate-500">Open in</span>
            {AI_PROVIDERS.map((provider) => (
              <a
                key={provider.id}
                href={provider.buildUrl(current.prompt)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Also copy so assistants without a prefill deep link can be pasted into.
                  navigator.clipboard?.writeText(current.prompt).catch(() => {});
                }}
                className="btn-pill"
              >
                <span aria-hidden="true">{provider.emoji} </span>
                {provider.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
