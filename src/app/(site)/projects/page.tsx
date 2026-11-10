import React, { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import { getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata } from '@/lib/seo';
import { PortfolioFilterGrid } from '@/components/portfolio/PortfolioFilterGrid';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildRouteMetadata('/projects', {
    title: "Worlds I've Built — Portfolio & Case Studies | Jahin Azmain",
    description:
      'Explore branding, web design, and digital setup case studies including Safe Shop, Glossy Beauty Parlour, OTT HOUSE HOLDER, Bikwe Gadget, Hungers Restaurant Design, and Royal Hajj BD.',
  });
}

export default async function ProjectsPage() {
  const { projects } = await getPublicSiteData();

  return (
    <div className="py-16 md:py-24 space-y-14">
      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>WORLDS I&apos;VE BUILT // PORTFOLIO INDEX</span>
        </span>

        <h1 className="chapter-heading font-display font-semibold text-fg max-w-3xl">
          Ideas Turned Into Experiences.
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          Selected brand identity systems, responsive websites, social media campaigns, and
          digital business storefronts.
        </p>
      </section>

      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-sm font-mono text-muted">Loading portfolio...</div>}>
          <PortfolioFilterGrid projects={projects} />
        </Suspense>
      </section>
    </div>
  );
}

