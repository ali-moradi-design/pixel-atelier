import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

const languages = { en: absolute("/"), fa: absolute("/fa/") };

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: absolute(path),
    changeFrequency: "monthly",
    priority,
  });
  return [
    { ...page("/", 1), alternates: { languages } },
    { ...page("/fa/", 0.6), alternates: { languages } },
    page("/docs/", 0.9),
    page("/docs/tokens/", 0.7),
    ...catalog.map((c) => page(`/docs/${c.slug}/`, 0.8)),
  ];
}
