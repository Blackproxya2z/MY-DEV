'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Layers } from 'lucide-react';
import { Project, ProjectImage } from '@/lib/schemas';
import { useOdysseyExperience } from '@/lib/motion';
import { ProjectVisualCover } from '@/components/portfolio/ProjectVisualCover';

export function HorizontalProjectRail({
  projects,
  enableDesktopRail = true,
}: {
  projects: (Project & { images?: ProjectImage[] })[];
  enableDesktopRail?: boolean;
}) {
  const { effectiveMotion } = useOdysseyExperience();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkViewport = () => {
      setIsDesktopViewport(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Optional GSAP ScrollTrigger subtle horizontal rail scrubbing on wide desktop when Cinematic motion is active
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !enableDesktopRail ||
      !isDesktopViewport ||
      effectiveMotion !== 'cinematic' ||
      projects.length <= 2
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const track = cardsTrackRef.current;
      const container = trackContainerRef.current;
      if (!track || !container) return;

      gsap.fromTo(
        track,
        { y: 18, opacity: 0.92 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, trackContainerRef);

    return () => {
      ctx.revert();
    };
  }, [enableDesktopRail, isDesktopViewport, effectiveMotion, projects.length]);

  const scrollToProject = (index: number) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, index));
    setActiveIndex(clamped);
    if (cardsTrackRef.current) {
      const cardEls = cardsTrackRef.current.querySelectorAll('[data-project-card]');
      const target = cardEls[clamped] as HTMLElement | undefined;
      if (target) {
        target.scrollIntoView({
          behavior: effectiveMotion === 'off' ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    }
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-card border border-border bg-raised/70 p-10 text-center space-y-4">
        <Layers className="w-8 h-8 text-accent mx-auto" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-fg">
          Case Studies Are Being Prepared for Publication
        </h3>
        <p className="text-sm text-muted max-w-lg mx-auto">
          New verified client work and visual systems are currently in editorial review. Explore
          available creative and technical disciplines below.
        </p>
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-canvas font-medium text-sm"
          >
            <span>Browse Services &amp; Capabilities</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={trackContainerRef} className="space-y-6 min-w-0 max-w-full overflow-hidden">
      {/* Desktop Rail Controls & Active World Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-mono text-muted">
          <span className="px-2.5 py-1 rounded-md border border-border bg-raised text-fg">
            WORLD {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <span className="truncate max-w-[260px] sm:max-w-md text-fg font-medium">
            {projects[activeIndex]?.title}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToProject(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-raised text-fg hover:border-accent disabled:opacity-40 transition-colors"
            aria-label="Previous project case study"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToProject(activeIndex + 1)}
            disabled={activeIndex >= projects.length - 1}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-raised text-fg hover:border-accent disabled:opacity-40 transition-colors"
            aria-label="Next project case study"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Responsive Layout: Vertical stack on mobile/tablet/reduced-motion, optional horizontal rail or 2-col editorial grid on desktop */}
      <div
        ref={cardsTrackRef}
        className={
          enableDesktopRail && effectiveMotion !== 'off'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:flex lg:overflow-x-auto lg:snap-x lg:snap-mandatory gap-6 pb-4'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }
      >
        {projects.map((project, idx) => (
          <article
            key={project.id}
            data-project-card
            onMouseEnter={() => setActiveIndex(idx)}
            onFocus={() => setActiveIndex(idx)}
            className={`group rounded-card border border-border bg-raised/85 hover:border-accent/70 transition-all duration-300 flex flex-col overflow-hidden ${
              enableDesktopRail && effectiveMotion !== 'off'
                ? 'lg:min-w-[420px] xl:min-w-[460px] lg:max-w-[460px] lg:snap-start shrink-0'
                : ''
            }`}
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
                  <span>{project.category}</span>
                  <span>{project.timeline_label}</span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>

                <p className="text-sm text-muted leading-relaxed line-clamp-3">
                  {project.summary}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {project.deliverables_jsonb && project.deliverables_jsonb.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {project.deliverables_jsonb.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-canvas border border-border text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
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
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-highlight hover:underline"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

