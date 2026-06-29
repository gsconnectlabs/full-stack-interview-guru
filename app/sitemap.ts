import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { questions } from "@/lib/questions";
import { siteUrl as BASE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/candidate",
    "/interviewer",
    "/environment",
    "/transition",
    "/real-world",
    "/donate",
    "/feedback",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE}/candidate/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const questionRoutes = questions.map((q) => ({
    url: `${BASE}/q/${q.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...questionRoutes];
}
