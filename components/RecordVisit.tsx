"use client";

import { useEffect } from "react";
import { recordRecent, type RecentQuestion } from "@/lib/recently-viewed";

/** Remembers this question in the local "Continue reading" list. Renders nothing. */
export default function RecordVisit({ slug, title, category }: RecentQuestion) {
  useEffect(() => {
    recordRecent({ slug, title, category });
  }, [slug, title, category]);
  return null;
}
