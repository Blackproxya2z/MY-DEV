import React from 'react';
import { BookOpen } from 'lucide-react';
import { getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata } from '@/lib/seo';
import { JournalFilterGrid } from '@/components/portfolio/JournalFilterGrid';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildRouteMetadata('/blog', {
    title: 'Field Notes & Journal | Jahin Azmain',
    description:
      'Articles and insights on visual identity, responsive web design, and digital business setup.',
  });
}

export default async function BlogIndexPage() {
  const { posts } = await getPublicSiteData();

  return (
    <div className="py-16 md:py-24 space-y-14">
      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>FIELD NOTES // JOURNAL &amp; PERSPECTIVES</span>
        </span>

        <h1 className="chapter-heading font-display font-semibold text-fg max-w-3xl">
          Ideas Worth Sharing.
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          Reflections and practical guides on brand identity systems, responsive web craft, and
          digital business setup.
        </p>
      </section>

      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
        <JournalFilterGrid posts={posts} />
      </section>
    </div>
  );
}

