import { useEffect, useRef } from "react";
import {
  absoluteUrl,
  pageTitle,
  SEO_DEFAULTS,
  SITE,
  type SeoConfig,
} from "../lib/seo";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"][data-seo-managed]`,
  );

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    el.setAttribute("data-seo-managed", "true");
    document.head.appendChild(el);
  }

  el.content = content;
  return el;
}

function upsertLink(rel: string, href: string): HTMLLinkElement {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-seo-managed]`);

  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    el.setAttribute("data-seo-managed", "true");
    document.head.appendChild(el);
  }

  el.href = href;
  return el;
}

function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null;

  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    el.setAttribute("data-seo-managed", "true");
    document.head.appendChild(el);
  }

  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

export function useSeo({
  title,
  description = SEO_DEFAULTS.description,
  path = "/",
  noindex = false,
  ogType = "website",
  ogImage = SEO_DEFAULTS.ogImage,
  jsonLd,
}: SeoConfig) {
  const jsonLdRef = useRef(jsonLd);

  useEffect(() => {
    jsonLdRef.current = jsonLd;
  }, [jsonLd]);

  useEffect(() => {
    const fullTitle = pageTitle(title);
    const canonical = absoluteUrl(path);
    const image = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);
    const robots = noindex ? "noindex, nofollow" : "index, follow";

    document.title = fullTitle;
    document.documentElement.lang = SITE.language;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", SEO_DEFAULTS.keywords.join(", "));
    upsertMeta("name", "author", SITE.author);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "googlebot", robots);
    upsertMeta("name", "application-name", SITE.name);

    upsertMeta("property", "og:site_name", SITE.name);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:locale", SITE.locale);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", SEO_DEFAULTS.ogImageAlt);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", SEO_DEFAULTS.ogImageAlt);

    upsertLink("canonical", canonical);

    if (jsonLdRef.current) {
      upsertJsonLd("seo-jsonld", jsonLdRef.current);
    } else {
      removeJsonLd("seo-jsonld");
    }

    return () => {
      removeJsonLd("seo-jsonld");
    };
  }, [title, description, path, noindex, ogType, ogImage, jsonLd]);
}
