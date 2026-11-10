import type { MetadataRoute } from 'next';
import { getPublicSiteData } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jazmain.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, projects, posts } = await getPublicSiteData();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/services',
    '/projects',
    '/blog',
    '/resume',
    '/contact',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((srv) => ({
    url: `${BASE_URL}/services/${srv.slug}`,
    lastModified: new Date(srv.updated_at || now),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((proj) => ({
    url: `${BASE_URL}/projects/${proj.slug}`,
    lastModified: new Date(proj.updated_at || now),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || now),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...postRoutes];
}

