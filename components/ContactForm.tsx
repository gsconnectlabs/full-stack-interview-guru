"use client";

import { useState } from "react";
import { contactEmail, feedbackEndpoint } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact form (Name, Email, Subject, Message). No backend of its own — it POSTs
 * to NEXT_PUBLIC_FEEDBACK_ENDPOINT when configured, otherwise falls back to the
 * visitor's own email client via mailto. Never pretends to send when it can't.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const canSend =
    name.trim().length >= 2 &&
    /.+@.+\..+/.test(email) &&
    subject.trim().length >= 2 &&
    message.trim().length >= 10 &&
    status !== "sending";

  function mailtoFallback() {
    const to = contactEmail || "";
    const encodedSubject = encodeURIComponent(`[Contact] ${subject}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${encodedSubject}&body=${body}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setStatus("sending");

    // No hosted endpoint configured → hand off to the visitor's email client so
    // nothing is silently lost (matches the site-wide feedback behaviour).
    if (!feedbackEndpoint) {
      mailtoFallback();
      setStatus("sent");
      return;
    }

    const payload = {
      channel: "contact",
      name,
      email,
      subject,
      message,
      at: new Date().toISOString(),
    };

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
        <span className="text-4xl" aria-hidden="true">
          ✅
        </span>
        <h2 className="mt-3 text-lg font-bold text-white">Thanks for reaching out</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
          {feedbackEndpoint
            ? "Your message has been sent. We read every message and reply when a response is needed."
            : "Your email client should have opened with the message ready to send. If it didn't, email us directly using the address above."}
        </p>
        <button
          onClick={() => {
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setStatus("idle");
          }}
          className="btn-secondary mt-6"
        >
          Send another
        </button>
      </div>
    );
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 p-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500";

  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className={labelClass}>
            Name
          </label>
          <input
            id="ct-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="ct-email" className={labelClass}>
            Email
          </label>
          <input
            id="ct-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <label htmlFor="ct-subject" className={`mt-4 ${labelClass}`}>
        Subject
      </label>
      <input
        id="ct-subject"
        type="text"
        required
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="What's this about?"
        className={fieldClass}
      />

      <label htmlFor="ct-message" className={`mt-4 ${labelClass}`}>
        Message
      </label>
      <textarea
        id="ct-message"
        required
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us how we can help. The more detail, the better."
        className={`${fieldClass} resize-y`}
      />

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          Couldn&apos;t send right now.{" "}
          <button type="button" onClick={mailtoFallback} className="underline">
            Email it instead
          </button>
          .
        </p>
      )}

      <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-slate-500">No account needed. We never share your email.</p>
        <button type="submit" disabled={!canSend} className="btn-primary disabled:opacity-50">
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
