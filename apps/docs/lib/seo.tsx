import type { Metadata } from "next";
import { absolute, site } from "./site";

const image = {
  url: "/social-preview.png",
  width: 1280,
  height: 640,
  alt: `${site.name}: ${site.tagline}`,
};

/**
 * Full metadata for one page. Child pages replace (not merge) openGraph and
 * twitter, so every page sets them completely here: title, description,
 * canonical URL, language alternates and the share image.
 */
export function pageMetadata({
  title,
  description = site.description,
  path,
  locale = "en_US",
  type = "website",
}: {
  title?: string;
  description?: string;
  path: string;
  locale?: "en_US" | "fa_IR";
  type?: "website" | "article";
}): Metadata {
  const fullTitle = title
    ? `${title} · ${site.name}`
    : `${site.name}: React UI kit with pixel effects`;
  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: {
      canonical: path,
      languages: { en: "/", fa: "/fa/", "x-default": "/" },
    },
    openGraph: {
      type,
      siteName: site.name,
      title: fullTitle,
      description,
      url: path,
      locale,
      alternateLocale: locale === "en_US" ? ["fa_IR"] : ["en_US"],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}

/** Structured data (schema.org) for search engines, rendered as JSON-LD. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // React writes <script> text as is; "<" is escaped so no tag can end it early.
  return (
    <script type="application/ld+json">
      {JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
        /</g,
        "\\u003c",
      )}
    </script>
  );
}

export const websiteLd = {
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: ["en", "fa"],
  author: { "@type": "Person", name: site.author.name, url: site.author.url },
};

export const softwareLd = {
  "@type": "SoftwareSourceCode",
  name: site.name,
  description: site.description,
  url: site.url,
  codeRepository: site.repo,
  programmingLanguage: ["TypeScript", "React", "CSS"],
  license: "https://opensource.org/licenses/MIT",
  author: { "@type": "Person", name: site.author.name, url: site.author.url },
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}
