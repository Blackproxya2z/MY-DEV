'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import { Project, ProjectImage } from '@/lib/schemas';
import { ProjectVisualCover } from '@/components/portfolio/ProjectVisualCover';

export function PortfolioFilterGrid({
  projects,
}: {
  projects: (Project & { images?: ProjectImage[] })[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesCat =
        selectedCategory === 'All' || proj.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.summary.toLowerCase().includes(q) ||
        proj.category.toLowerCase().includes(q) ||
        proj.deliverables_jsonb.some((d) => d.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const updateUrlParams = (cat: string, q: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== 'All') params.set('category', cat);
    if (q.trim()) params.set('q', q.trim());
    const qs = params.toString();
    router.replace(qs ? `/projects?${qs}` : '/projects', { scroll: false });
  };

  return (
    <div className="space-y-10">
      {/* Filter Bar */}
      <div className="rounded-card border border-border bg-raised/80 p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-2"
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setSelectedCategory(cat);
                  updateUrlParams(cat, searchQuery);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-colors ${
                  active
                    ? 'bg-accent text-canvas font-semibold'
                    : 'bg-canvas border border-border text-muted hover:text-fg'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px] sm:min-w-[300px]">
          <Search
            className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              updateUrlParams(selectedCategory, val);
            }}
            placeholder="Search case studies, deliverables..."
            aria-label="Search portfolio projects"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg placeholder:text-muted/60 focus:border-accent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-mono text-muted">
        <span>
          SHOWING {filteredProjects.length} OF {projects.length} PUBLISHED CASE STUDIES
        </span>
        {selectedCategory !== 'All' || searchQuery ? (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              router.replace('/projects', { scroll: false });
            }}
            className="text-accent hover:underline"
          >
            Reset Filters
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-card border border-border bg-raised/60 p-12 text-center space-y-3">
          <Sparkles className="w-6 h-6 text-accent mx-auto" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-fg">No Matching Case Studies Found</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Try clearing your search term or selecting a broader discipline category above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project, idx) => (
            <article
              key={project.id}
              className="group rounded-card border border-border bg-raised/90 hover:border-accent/70 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block aspect-[16/10] w-full overflow-hidden border-b border-border/70"
              >
                <ProjectVisualCover
                  title={project.title}
                  category={project.category}
                  coverUrl={project.cover_url}
                  coverAlt={project.cover_alt}
                  themeBackdrop={project.theme_backdrop}
                  indexNumber={idx + 1}
                  className="w-full h-full"
                />
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-muted">
                    <span className="text-accent">{project.category}</span>
                    <span>{project.role_title}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-fg group-hover:text-accent transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h2>

                  <p className="text-sm text-muted leading-relaxed">{project.summary}</p>
                </div>

                <div className="space-y-4 pt-2">
                  {project.deliverables_jsonb && project.deliverables_jsonb.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {project.deliverables_jsonb.slice(0, 3).map((del) => (
                        <span
                          key={del}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-canvas border border-border text-muted"
                        >
                          {del}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-accent transition-colors"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>

                    {project.live_url && project.live_url_verified ? (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-highlight hover:underline"
                      >
                        <span>Visit Live</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

