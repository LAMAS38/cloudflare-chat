export const BRAND = "PulseChat";

const DEFAULT_SITE_URL = "https://pulsechat.hamidinelatifa.workers.dev";

export const SITE = {
  name: BRAND,
  tagline: "Salons de clavardage temps réel",
  pitch:
    "Créez un salon, partagez le lien et discutez instantanément avec vos proches, votre équipe ou votre communauté.",
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ?? DEFAULT_SITE_URL,
  locale: "fr_FR",
  language: "fr",
  twitterHandle: "@PulseChat",
  author: BRAND,
} as const;

export const SEO_DEFAULTS = {
  title: `${BRAND} · Salons de clavardage temps réel`,
  description:
    `Créez ou rejoignez un salon en une seconde avec ${BRAND}. Messages instantanés, membres en ligne et conversations qui restent accessibles.`,
  keywords: [
    "chat temps réel",
    "messagerie instantanée",
    "salon de discussion",
    "chat en ligne",
    "discussion de groupe",
    BRAND,
  ],
  ogImage: "/og-image.svg",
  ogImageAlt: `${BRAND}, clavardage temps réel`,
} as const;

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}

export function pageTitle(title: string): string {
  if (title.includes(SITE.name)) return title;
  return `${title} | ${SITE.name}`;
}

export interface SeoConfig {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  ogType?: "website" | "article";
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function homeJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SEO_DEFAULTS.description,
        inLanguage: SITE.language,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/favicon.svg"),
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE.url}/#app`,
        name: SITE.name,
        url: SITE.url,
        applicationCategory: "CommunicationApplication",
        operatingSystem: "Web",
        browserRequirements: "Nécessite un navigateur récent avec JavaScript activé",
        description: SEO_DEFAULTS.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
        featureList: [
          "Salons accessibles par lien",
          "Messages instantanés",
          "Historique des conversations",
          "Indicateur de frappe et présence en ligne",
        ],
      },
    ],
  };
}

export function roomJsonLd(slug: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `#${slug} · ${SITE.name}`,
    url: absoluteUrl(`/r/${slug}`),
    isPartOf: { "@id": `${SITE.url}/#website` },
    inLanguage: SITE.language,
  };
}
