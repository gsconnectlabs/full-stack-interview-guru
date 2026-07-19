"use client";

import { useState } from "react";

/**
 * A boolean flag that turns on when `trigger()` is called and resets to `false`
 * after `ms` (default 1500). Extracted from the identical "copied" feedback pattern
 * in CopyButton and ShareButton so the transient-confirmation logic lives in one place.
 *
 * Behavior-preserving: same state + timeout as the previous inline implementations.
 */
export function useTemporaryFlag(ms = 1500): [boolean, () => void] {
  const [on, setOn] = useState(false);

  function trigger() {
    setOn(true);
    setTimeout(() => setOn(false), ms);
  }

  return [on, trigger];
}
