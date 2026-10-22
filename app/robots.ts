import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /feedback has no search value and every question page links to it with a distinct
    // ?context= query string, so compliant crawlers shouldn't spend requests on those variants.
    // A prefix match covers /feedback?context=... too. This is a crawler hint, not a security boundary.
    rules: { userAgent: "*", allow: "/", disallow: "/feedback" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
