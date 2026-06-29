"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { feedbackEndpoint } from "@/lib/site";

/**
 * Lightweight per-question content signal. Records the vote in localStorage so the
 * user isn't asked twice, and (if a form endpoint is configured) fires a fire-and-forget
 * POST so the owner can see which answers underperform. No backend required.
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
    if (feedbackEndpoint) {
      // best-effort; never blocks the UI
      fetch(feedbackEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ type: "vote", slug, value, at: new Date().toISOString() }),
      }).catch(() => {});
    }
  }

  return (
    <div className="card mt-12 flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
      {voted ? (
        <p className="text-sm text-slate-300">
          {voted === "up" ? "🙌 Glad it helped!" : "🙏 Thanks — noted."}{" "}
          <Link href={`/feedback?context=${encodeURIComponent("/q/" + slug)}`} className="text-brand-300 underline">
            {voted === "up" ? "Suggest an addition" : "Tell us what was missing"}
          </Link>
        </p>
      ) : (
        <p className="text-sm font-medium text-slate-200">Was this answer helpful?</p>
      )}

      {!voted && (
        <div className="flex gap-2">
          <button
            onClick={() => vote("up")}
            className="btn-secondary px-4 py-2 text-sm"
            aria-label="Yes, helpful"
          >
            👍 Yes
          </button>
          <button
            onClick={() => vote("down")}
            className="btn-secondary px-4 py-2 text-sm"
            aria-label="No, not helpful"
          >
            👎 Not really
          </button>
        </div>
      )}
    </div>
  );
}
