"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { contactEmail, feedbackEndpoint } from "@/lib/site";

// "sent" = the configured endpoint confirmed receipt. "email" = a mailto: draft was opened; that is a
// hand-off to the visitor's mail app, NOT a delivery, so it must never be shown as one.
type Status = "idle" | "sending" | "sent" | "error" | "email";

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
  const inFlight = useRef(false);
  const emailOpened = useRef(false);

  const canSend =
    name.trim().length >= 2 &&
    /.+@.+\..+/.test(email) &&
    subject.trim().length >= 2 &&
    message.trim().length >= 10 &&
    status !== "sending";

  const draftText = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;

  function mailtoFallback() {
    // One hand-off per draft, released only by "Back to edit" (see FeedbackForm for the rationale).
    if (emailOpened.current) return;
    emailOpened.current = true;
    const to = contactEmail || "";
    const encodedSubject = encodeURIComponent(`[Contact] ${subject}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${encodedSubject}&body=${body}`;
    setStatus("email");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend || inFlight.current) return;
    inFlight.current = true;
    setStatus("sending");

    // No hosted endpoint configured → hand off to the visitor's email client so nothing is silently
    // lost. That is not a delivery, so it gets its own "nothing has been sent yet" state, and the
    // lock stays held until "Back to edit" so a second submit can't strand the form in "sending".
    if (!feedbackEndpoint) {
      mailtoFallback();
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
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "email") {
    return (
      <div className="card p-6 text-center sm:p-8" role="status">
        <span className="text-4xl" aria-hidden="true">
          ✉️
        </span>
        <h2 className="mt-3 text-lg font-bold text-white">Email draft opened — nothing has been sent yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
          This site can&apos;t receive messages directly right now. Your email app should have opened with your
          message ready — you still need to press <strong>Send</strong> there.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          Nothing opened? Copy your message and email it to{" "}
          {contactEmail ? (
            <a href={`mailto:${contactEmail}`} className="text-brand-300 underline">
              {contactEmail}
            </a>
          ) : (
            <>
              the address you have for us, or use the{" "}
              <Link href="/feedback" className="text-brand-300 underline">
                feedback page
              </Link>
            </>
          )}
          .
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <CopyButton value={draftText} label="Copy my message" copiedLabel="✓ Copied" className="btn-secondary" />
          <button
            type="button"
            onClick={() => {
              emailOpened.current = false;
              inFlight.current = false;
              setStatus("idle");
            }}
            className="btn-secondary"
          >
            Back to edit
          </button>
        </div>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <span className="text-4xl" aria-hidden="true">
          ✅
        </span>
        <h2 className="mt-3 text-lg font-bold text-white">Thanks for reaching out</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
          Your message has been sent. We read every message and reply when a response is needed.
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

      {!feedbackEndpoint && (
        <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Heads up: this form doesn&apos;t send messages from the website. It opens a draft in your email app,
          and the message is only delivered if you press Send there.
        </p>
      )}

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
          {status === "sending" ? "Sending…" : feedbackEndpoint ? "Send message" : "Open email draft"}
        </button>
      </div>
    </form>
  );
}
