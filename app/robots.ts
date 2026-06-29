import type { MetadataRoute } from "next";

const BASE = "https://full-stack-interview-guru.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
