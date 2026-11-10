import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Eye,
} from 'lucide-react';
import { getPublicProjectBySlug, getPublicSiteData } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { buildRouteMetadata } from '@/lib/seo';
import { ProjectVisualCover } from '@/components/portfolio/ProjectVisualCover';

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
  const project = await getPublicProjectBySlug(params.slug, allowDraft);

  if (!project) {
    return buildRouteMetadata(`/projects/${params.slug}`, {
      title: 'Case Study Not Found | Jahin Azmain',
      description: 'Requested project case study was not found.',
      noindex: true,
    });
  }

  return buildRouteMetadata(`/projects/${project.slug}`, {
    title: `${project.title} — Case Study | Jahin Azmain`,
    description: project.summary,
    noindex: project.status !== 'published',
    ogImage: project.cover_url,
  });
}

export default async function ProjectCaseStudyPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { preview?: string };
}) {
  const isAdmin = Boolean(await getAuthenticatedAdmin());
  const allowDraft = Boolean(searchParams?.preview === '1' && isAdmin);

  const [project, siteData] = await Promise.all([
    getPublicProjectBySlug(params.slug, allowDraft),
    getPublicSiteData(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = siteData.projects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 2);

  return (
    <article className="py-14 md:py-24 space-y-20">
      <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Private Draft Preview Banner if viewed by Admin */}
        {project.status !== 'published' ? (
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs font-mono flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>
                PRIVATE ADMIN PREVIEW — Status: {project.status.toUpperCase()} (Invisible to public
                visitors)
              </span>
            </span>
            <Link href="/admin/projects" className="underline hover:text-white">
              Return to Projects Manager
            </Link>
          </div>
        ) : null}

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>Back to Portfolio Index</span>
        </Link>

        {/* Case Study Header */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="px-3 py-1 rounded-md border border-border bg-raised text-accent">
                {project.category}
              </span>
              {project.subcategory ? (
                <span className="px-3 py-1 rounded-md border border-border bg-canvas text-muted">
                  {project.subcategory}
                </span>
              ) : null}
            </div>

            <h1 className="chapter-heading font-display font-semibold text-fg">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Metadata Spec Box */}
          <div className="lg:col-span-4 rounded-card border border-border bg-raised p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono text-muted block">ROLE</span>
                <strong className="text-fg font-medium mt-1 block">{project.role_title}</strong>
              </div>
              <div>
                <span className="font-mono text-muted block">CLASSIFICATION</span>
                <strong className="text-fg font-medium mt-1 block">
                  {project.timeline_label}
                </strong>
              </div>
            </div>

            {project.technologies_list && project.technologies_list.length > 0 ? (
              <div className="pt-3 border-t border-border/60 space-y-2">
                <span className="text-xs font-mono text-muted block">DISCIPLINES &amp; STACK</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies_list.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-canvas border border-border text-fg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {project.live_url && project.live_url_verified ? (
              <div className="pt-3 border-t border-border/60">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-canvas font-semibold text-xs"
                >
                  <span>Visit Verified Live Project</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            ) : null}
          </div>
        </header>

        {/* Primary Showcase Cover */}
        <div className="rounded-card overflow-hidden border border-border aspect-[16/9] max-h-[540px] w-full">
          <ProjectVisualCover
            title={project.title}
            category={project.category}
            coverUrl={project.cover_url}
            coverAlt={project.cover_alt}
            themeBackdrop={project.theme_backdrop}
            indexNumber={project.sort_order || 1}
            className="w-full h-full"
          />
        </div>

        {/* Case Study Narrative Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          <div className="lg:col-span-8 space-y-10">
            {project.challenge ? (
              <section className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent">
                  01 // THE CHALLENGE &amp; CONTEXT
                </h2>
                <p className="text-base sm:text-lg text-fg leading-relaxed">
                  {project.challenge}
                </p>
              </section>
            ) : null}

            {project.approach ? (
              <section className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-highlight">
                  02 // CREATIVE &amp; TECHNICAL APPROACH
                </h2>
                <p className="text-base text-muted leading-relaxed">{project.approach}</p>
              </section>
            ) : null}

            {project.solution ? (
              <section className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent">
                  03 // THE SOLUTION DELIVERED
                </h2>
                <p className="text-base text-muted leading-relaxed">{project.solution}</p>
              </section>
            ) : null}

            {project.outcome ? (
              <section className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-highlight">
                  04 // OUTCOME &amp; IMPACT
                </h2>
                <p className="text-base text-muted leading-relaxed">{project.outcome}</p>
              </section>
            ) : null}
          </div>

          {/* Deliverables Checklist Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-card border border-border bg-raised/85 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Scope &amp; Deliverables</span>
              </div>
              {project.deliverables_jsonb && project.deliverables_jsonb.length > 0 ? (
                <ul className="space-y-2.5">
                  {project.deliverables_jsonb.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-fg">
                      <CheckCircle2
                        className="w-4 h-4 text-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted">
                  Custom brand and digital deliverables tailored to project scope.
                </p>
              )}

              <div className="pt-4 border-t border-border/60">
                <Link
                  href={`/contact?service=${encodeURIComponent(project.category)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-canvas font-semibold text-sm"
                >
                  <span>Start a Similar Project</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Ordered Media Gallery (If gallery images uploaded) */}
        {project.images && project.images.length > 0 ? (
          <section className="pt-10 border-t border-border/60 space-y-6">
            <h2 className="text-2xl font-display font-semibold text-fg">
              Project Gallery &amp; Visual Artifacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((img) => (
                <figure
                  key={img.id}
                  className="rounded-card border border-border bg-raised overflow-hidden space-y-3"
                >
                  <div className="aspect-[16/10] w-full bg-canvas overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt_text}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {img.caption ? (
                    <figcaption className="px-5 pb-4 text-xs font-mono text-muted">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* Related Projects */}
        {relatedProjects.length > 0 ? (
          <section className="pt-12 border-t border-border/60 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-semibold text-fg">
                Continue Exploring Worlds
              </h2>
              <Link href="/projects" className="text-xs font-mono text-accent hover:underline">
                All Projects →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/projects/${rel.slug}`}
                  className="group rounded-card border border-border bg-raised/80 p-6 flex items-center justify-between gap-4 hover:border-accent transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-accent">{rel.category}</span>
                    <h3 className="text-lg font-semibold text-fg group-hover:text-accent transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-muted line-clamp-1">{rel.summary}</p>
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

