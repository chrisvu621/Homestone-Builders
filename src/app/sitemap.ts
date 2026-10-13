import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const paths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.8 },
    ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.9 })),
    { path: "/gallery", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
  ];
  return paths.map(({ path, priority }) => ({ url: `${base}${path}`, priority }));
}
