"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Lightweight per-question content signal. Records the vote in localStorage so the
 * user isn't asked twice. Deliberately does NOT POST to NEXT_PUBLIC_FEEDBACK_ENDPOINT: that
 * endpoint is a form inbox (feedback + contact), and every 👍/👎 would become an emailed
 * submission that eats the form plan's monthly quota. No backend required.
 */
export default function HelpfulVote({ slug }: { slug: string }) {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const key = `helpful:${slug}`;

  useEffect(() => {
    try {
      const prev = localStorage.getItem(key);
      if (prev === "up" || prev === "down") setVoted(prev);
    } catch {
      /* localStorage unavailable */
    }
  }, [key]);

  function vote(value: "up" | "down") {
    setVoted(value);
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-3 rounded-lg border border-ink-700/60 px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
      {voted ? (
        <p className="text-sm text-slate-300">
          {voted === "up" ? "🙌 Glad it helped!" : "🙏 Thanks — noted."}{" "}
          <Link href={`/feedback?context=${encodeURIComponent("/q/" + slug)}`} rel="nofollow" className="text-brand-300 underline">
            {voted === "up" ? "Suggest an addition" : "Tell us what was missing"}
          </Link>
        </p>
      ) : (
        <p className="text-sm font-medium text-slate-200">Was this answer helpful?</p>
      )}

      {!voted && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => vote("up")}
            className="btn-secondary px-4 py-2 text-sm"
            aria-label="Yes, helpful"
          >
            👍 Yes
          </button>
          <button
            type="button"
            onClick={() => vote("down")}
            className="btn-secondary px-4 py-2 text-sm"
            aria-label="Not really, this wasn't helpful"
          >
            👎 Not really
          </button>
        </div>
      )}
    </div>
  );
}
