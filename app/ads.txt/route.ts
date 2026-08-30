import { adsenseClientId } from "@/lib/site";

/**
 * ads.txt (IAB spec) — authorizes Google as an authorized seller of this site's ad
 * inventory. Required for AdSense; its absence is a distinct blocker from "Low value
 * content" and shows up as its own "Ads.txt status: Not found" flag in the AdSense
 * dashboard. Served as a route handler (not a static `public/` file, which this project
 * doesn't use) so the publisher id stays derived from the single source of truth in
 * lib/site.ts instead of being duplicated as a hardcoded string.
 */
export const dynamic = "force-static";

export function GET() {
  const pubId = adsenseClientId.replace(/^ca-/, "");
  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
