import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Eye, ArrowUpRight } from 'lucide-react';
import { getPublicPostBySlug, getPublicSiteData } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { buildRouteMetadata } from '@/lib/seo';
import { formatDateReadable, sanitizeRichHtml } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { preview?: string };
}) {
  const isAdmin = Boolean(await getAuthenticatedAdmin());
  const allowDraft = Boolean(searchParams?.preview === '1' && isAdmin);
  const post = await getPublicPostBySlug(params.slug, allowDraft);

  if (!post) {
    return buildRouteMetadata(`/blog/${params.slug}`, {
      title: 'Article Not Found | Jahin Azmain',
      description: 'Requested journal article was not found.',
      noindex: true,
    });
  }

  return buildRouteMetadata(`/blog/${post.slug}`, {
    title: post.seo_title || `${post.title} | Jahin Azmain`,
    description: post.seo_description || post.excerpt,
    noindex: post.status !== 'published',
    ogImage: post.cover_url,
  });
}

export default async function BlogDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { preview?: string };
}) {
  const isAdmin = Boolean(await getAuthenticatedAdmin());
  const allowDraft = Boolean(searchParams?.preview === '1' && isAdmin);

  const [post, siteData] = await Promise.all([
    getPublicPostBySlug(params.slug, allowDraft),
    getPublicSiteData(),
  ]);

  if (!post) {
    notFound();
  }

  const safeHtml = sanitizeRichHtml(post.content_html);
  const relatedPosts = siteData.posts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: siteData.profile.full_name,
    },
  };

  return (
    <article className="py-14 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {post.status !== 'published' ? (
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs font-mono flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>
                PRIVATE ADMIN PREVIEW — Status: {post.status.toUpperCase()} (Invisible to public
                visitors)
              </span>
            </span>
            <Link href="/admin/blog" className="underline hover:text-white">
              Return to Blog Manager
            </Link>
          </div>
        ) : null}

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>Back to Field Notes</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-6 pb-8 border-b border-border/70">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted">
            <span className="px-3 py-1 rounded-md border border-border bg-raised text-accent">
              {post.category_name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-highlight" aria-hidden="true" />
              <span>{formatDateReadable(post.published_at)}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span>{post.reading_time_minutes} min read</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-fg leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-xl border border-border bg-raised flex items-center justify-center font-mono text-xs font-bold text-accent">
              JA
            </div>
            <div className="text-xs">
              <strong className="text-fg block">{siteData.profile.full_name}</strong>
              <span className="text-muted font-mono">{siteData.profile.role_title}</span>
            </div>
          </div>
        </header>

        {/* Cover Image if present */}
        {post.cover_url ? (
          <div className="rounded-card overflow-hidden border border-border aspect-[16/9]">
            <img
              src={post.cover_url}
              alt={post.cover_alt || post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Sanitized Rich-Text Article Body */}
        <div
          className="odyssey-prose"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />

        {/* Tags */}
        {post.tags_list && post.tags_list.length > 0 ? (
          <div className="pt-8 border-t border-border/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted mr-2">TOPICS:</span>
            {post.tags_list.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg border border-border bg-raised text-xs font-mono text-fg"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {/* Related Articles */}
        {relatedPosts.length > 0 ? (
          <section className="pt-10 border-t border-border/70 space-y-6">
            <h2 className="text-xl font-display font-semibold text-fg">
              Related Field Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-card border border-border bg-raised/80 p-6 flex items-center justify-between gap-4 hover:border-accent transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-accent">{rel.category_name}</span>
                    <h3 className="text-base font-semibold text-fg group-hover:text-accent transition-colors">
                      {rel.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

