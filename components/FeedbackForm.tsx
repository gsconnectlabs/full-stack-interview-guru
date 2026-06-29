"use client";

import { useState } from "react";
import { contactEmail, feedbackEndpoint } from "@/lib/site";

const TYPES = [
  { id: "content", label: "📝 Content fix", hint: "Wrong, outdated, or unclear answer" },
  { id: "idea", label: "💡 Idea", hint: "A topic or question we should add" },
  { id: "bug", label: "🐞 Bug", hint: "Something broken on the site" },
  { id: "praise", label: "🙌 Praise", hint: "Tell us what you love" },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function FeedbackForm({ context }: { context?: string }) {
  const [type, setType] = useState("content");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const canSend = message.trim().length >= 3 && status !== "sending";

  function mailtoFallback() {
    const to = contactEmail || "";
    const subject = encodeURIComponent(`[Interview Guru] ${type} feedback`);
    const body = encodeURIComponent(
      `Type: ${type}\n${context ? `Page: ${context}\n` : ""}From: ${email || "anonymous"}\n\n${message}`,
    );
    // If no contact email is configured, still surface the content so it isn't lost.
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setStatus("sending");

    const payload = { type, message, email, context: context || "", at: new Date().toISOString() };

    if (!feedbackEndpoint) {
      mailtoFallback();
      setStatus("sent");
      return;
    }

    try {
      const res = await fetch(feedbackEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <span className="text-4xl">🙏</span>
        <h3 className="mt-3 text-lg font-bold text-white">Thank you!</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
          Your feedback goes straight into our content backlog. Fixes ship fast — no account, no spam, ever.
        </p>
        <button
          onClick={() => {
            setMessage("");
            setEmail("");
            setStatus("idle");
          }}
          className="btn-secondary mt-6"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">What kind of feedback?</label>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            title={t.hint}
            className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              type === t.id
                ? "bg-brand-600 text-white"
                : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label htmlFor="fb-message" className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Your message
      </label>
      <textarea
        id="fb-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="Tell us what to improve. Be as specific as you like — link a question, point out a typo, suggest a topic…"
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-ink-900/80 p-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10"
      />

      <label htmlFor="fb-email" className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Email <span className="font-normal normal-case text-slate-600">(optional — only if you want a reply)</span>
      </label>
      <input
        id="fb-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 p-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10"
      />

      {context && <p className="mt-3 text-xs text-slate-500">Attached context: {context}</p>}

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          Couldn&apos;t send right now.{" "}
          <button type="button" onClick={mailtoFallback} className="underline">
            Email it instead
          </button>
          .
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">No login. We read every message.</p>
        <button type="submit" disabled={!canSend} className="btn-primary disabled:opacity-50">
          {status === "sending" ? "Sending…" : "Send feedback"}
        </button>
      </div>
    </form>
  );
}
