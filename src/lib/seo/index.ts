import type { Metadata } from 'next';
import { getPublicSeoForRoute, getPublicSiteData } from '@/lib/db';

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function buildRouteMetadata(
  routeKey: string,
  fallback: {
    title: string;
    description: string;
    noindex?: boolean;
    ogImage?: string | null;
  }
): Promise<Metadata> {
  const seo = await getPublicSeoForRoute(routeKey);
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const noindex = seo?.noindex ?? fallback.noindex ?? false;
  const canonicalPath = seo?.canonical_url || routeKey;
  const canonicalUrl = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${SITE_BASE}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: canonicalUrl,
      siteName: 'Jahin Azmain — The Creative Odyssey',
      type: 'website',
      ...(seo?.og_image_url || fallback.ogImage
        ? { images: [{ url: (seo?.og_image_url || fallback.ogImage)! }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.og_title || title,
      description: seo?.og_description || description,
    },
  };
}

export async function generatePersonAndWebsiteSchema() {
  const { profile, settings, socialLinks } = await getPublicSiteData();
  const verifiedUrls = socialLinks.map((s) => s.url).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_BASE}/#person`,
        name: profile.full_name,
        jobTitle: profile.role_title,
        description: profile.brand_statement,
        email: `mailto:${profile.email}`,
        url: SITE_BASE,
        ...(verifiedUrls.length > 0 ? { sameAs: verifiedUrls } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_BASE}/#website`,
        url: SITE_BASE,
        name: settings.site_name,
        description: settings.tagline,
        publisher: {
          '@id': `${SITE_BASE}/#person`,
        },
      },
    ],
  };
}

