import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  GraduationCap,
  Briefcase,
  Quote,
} from 'lucide-react';
import {
  PageSection,
  Profile,
  SiteSettings,
  Service,
  Project,
  ProjectImage,
  Post,
  Skill,
  Experience,
  Education,
  Testimonial,
} from '@/lib/schemas';
import { formatWhatsAppUrl, formatDateReadable } from '@/lib/utils';
import { CinematicScrollHero } from '@/components/story/CinematicScrollHero';
import { InteractiveScopeBuilder } from '@/components/story/InteractiveScopeBuilder';
import { HorizontalProjectRail } from '@/components/story/HorizontalProjectRail';
import { ContactFormIsland } from '@/components/portfolio/ContactFormIsland';
import { DynamicLucideIcon } from '@/components/ui/LucideIcon';
import { CustomCodeAndPythonBlock } from '@/components/story/CustomCodeAndPythonBlock';

export interface SectionRendererProps {
  sections: PageSection[];
  profile: Profile;
  settings: SiteSettings;
  services: Service[];
  projects: (Project & { images?: ProjectImage[] })[];
  posts: Post[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  isPreviewMode?: boolean;
}

export function SectionRenderer({
  sections,
  profile,
  settings,
  services,
  projects,
  posts,
  skills,
  experiences,
  education,
  testimonials,
  isPreviewMode = false,
}: SectionRendererProps) {
  const whatsappUrl = formatWhatsAppUrl(
    profile.whatsapp_normalized,
    `Hi ${profile.full_name}, I visited The Creative Odyssey and would like to discuss a project.`
  );

  const totalChapters = String(sections.length).padStart(2, '0');

  return (
    <div className="divide-y divide-border/50">
      {sections.map((section, idx) => {
        const chapterIdx = `${String(idx + 1).padStart(2, '0')} / ${totalChapters}`;

        if (section.type === 'hero') {
          const content = section.content_jsonb || {};
          const primaryCtaLabel =
            (content.primary_cta_label as string) || 'Explore My Work';
          const primaryCtaHref =
            (content.primary_cta_href as string) || '#chapter-worlds';
          const secondaryCtaLabel =
            (content.secondary_cta_label as string) || "Let's Work Together";
          const secondaryCtaHref =
            (content.secondary_cta_href as string) || '/contact';
          const tertiaryCtaLabel =
            (content.tertiary_cta_label as string) || 'Download Resume';
          const sparkCaption =
            (content.spark_caption as string) || 'IDEA SPARK // PAPER TO PIXEL';
          const nextAnchor =
            ((section.settings_jsonb?.scroll_target as string) ||
              (sections[idx + 1] ? `#${sections[idx + 1].section_key}` : '#chapter-story'));

          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="relative cosmic-grid-backdrop overflow-x-clip"
            >
              <CinematicScrollHero
                chapterIdx={chapterIdx}
                eyebrow={
                  section.eyebrow ||
                  `${profile.full_name.toUpperCase()} / ${profile.role_title.toUpperCase()}`
                }
                heading={section.heading}
                subheading={section.subheading || profile.subheadline}
                availabilityText={profile.availability_text}
                isAvailable={profile.is_available}
                categories={profile.categories_list || []}
                primaryCtaLabel={primaryCtaLabel}
                primaryCtaHref={primaryCtaHref}
                secondaryCtaLabel={secondaryCtaLabel}
                secondaryCtaHref={secondaryCtaHref}
                tertiaryCtaLabel={tertiaryCtaLabel}
                resumeUrl={profile.resume_url}
                sparkCaption={sparkCaption}
                portraitUrl={
                  (section.content_jsonb?.image_url as string) ||
                  profile.hero_image_url ||
                  profile.avatar_url
                }
                heroVideoUrl={(section.content_jsonb?.hero_video_url as string) || null}
                ownerName={profile.full_name}
                ownerRole={profile.role_title}
                enable3D={settings.enable_3d_hero}
                nextAnchor={nextAnchor}
                isPreviewMode={isPreviewMode}
              >
                <CustomCodeAndPythonBlock
                  sectionId={section.id}
                  customHtml={section.content_jsonb?.custom_html as string}
                  customCss={section.content_jsonb?.custom_css as string}
                  pythonCode={section.content_jsonb?.python_code as string}
                  pythonTitle={section.content_jsonb?.python_title as string}
                />
              </CinematicScrollHero>
            </section>
          );
        }

        if (section.type === 'editorial-intro') {
          const paragraphs = Array.isArray(section.content_jsonb?.narrative_paragraphs)
            ? (section.content_jsonb.narrative_paragraphs as string[])
            : [profile.full_bio];
          const ctaLabel =
            (section.content_jsonb?.cta_label as string) || 'Read Full Story & Philosophy';
          const ctaHref = (section.content_jsonb?.cta_href as string) || '/about';

          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="py-20 md:py-28 bg-canvas"
            >
              <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  {/* Left Chapter Header & Paper-to-Pixel Diagram */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                      <span>{chapterIdx}</span>
                      <span>—</span>
                      <span>{section.label}</span>
                    </div>

                    <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                      {section.eyebrow}
                    </p>

                    <h2 className="chapter-heading font-display font-semibold text-fg">
                      {section.heading}
                    </h2>

                    {/* Paper-to-Pixel Architectural Card */}
                    <div className="rounded-card border border-border bg-raised/80 p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-muted">
                        <span>CORE BRAND PROMISE</span>
                        <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
                      </div>
                      <blockquote className="text-base sm:text-lg font-medium text-fg leading-relaxed border-l-2 border-accent pl-4">
                        &ldquo;{profile.brand_statement}&rdquo;
                      </blockquote>
                      <p className="text-xs font-mono text-muted">
                        — {profile.full_name}, {profile.role_title}
                      </p>
                    </div>
                  </div>

                  {/* Right Narrative Paragraphs & Capability Pillars */}
                  <div className="lg:col-span-7 space-y-6 lg:pl-6">
                    <div className="space-y-5">
                      {paragraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-base sm:text-lg text-muted leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div className="p-5 rounded-2xl border border-border bg-raised/50 space-y-2">
                        <span className="text-xs font-mono text-accent">01 // VISUAL STORY</span>
                        <h3 className="text-base font-semibold text-fg">
                          Brand Identity &amp; Graphic Systems
                        </h3>
                        <p className="text-sm text-muted">
                          Logos, social media systems, covers, and presentations designed with
                          editorial restraint and purpose.
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl border border-border bg-raised/50 space-y-2">
                        <span className="text-xs font-mono text-highlight">
                          02 // DIGITAL EXPERIENCE
                        </span>
                        <h3 className="text-base font-semibold text-fg">
                          Websites &amp; Business Setup
                        </h3>
                        <p className="text-sm text-muted">
                          Responsive websites, Shopify setups, optimized business pages, and LinkedIn
                          authority profiles.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={ctaHref}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-raised text-sm font-medium text-fg hover:border-accent transition-colors"
                      >
                        <span>{ctaLabel}</span>
                        <ArrowUpRight className="w-4 h-4 text-accent" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'services-grid') {
          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="py-20 md:py-28 bg-raised/30"
            >
              <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                      <span>{chapterIdx}</span>
                      <span>—</span>
                      <span>{section.label}</span>
                    </div>
                    <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                      {section.eyebrow}
                    </p>
                    <h2 className="chapter-heading font-display font-semibold text-fg">
                      {section.heading}
                    </h2>
                    <p className="text-base text-muted leading-relaxed">
                      {section.subheading}
                    </p>
                  </div>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-raised text-sm font-medium text-fg hover:border-accent transition-colors shrink-0"
                  >
                    <span>All Services &amp; FAQs</span>
                    <ArrowUpRight className="w-4 h-4 text-accent" aria-hidden="true" />
                  </Link>
                </div>

                {/* 6 Editable Service Portals */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <article
                      key={service.id}
                      className="group cinema-bento-card rounded-card border border-border bg-raised/90 p-7 flex flex-col justify-between space-y-6 hover:border-accent/70 transition-all duration-300"
                    >
                      <div className="space-y-4">
                        {service.cover_url ? (
                          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border bg-canvas mb-2">
                            <img
                              src={service.cover_url}
                              alt={service.cover_alt || service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-mono px-2.5 py-1 rounded-md border border-border bg-canvas text-accent font-semibold">
                            {service.number_label} // {service.category}
                          </span>
                          <div className="w-10 h-10 rounded-xl border border-border bg-canvas flex items-center justify-center text-highlight group-hover:text-accent transition-colors">
                            <DynamicLucideIcon name={service.icon_name} className="w-5 h-5" />
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-fg group-hover:text-accent transition-colors">
                          <Link href={`/services/${service.slug}`}>{service.title}</Link>
                        </h3>

                        <p className="text-sm text-muted leading-relaxed">
                          {service.teaser}
                        </p>

                        {service.deliverables_jsonb && service.deliverables_jsonb.length > 0 ? (
                          <ul className="space-y-2 pt-2 border-t border-border/60">
                            {service.deliverables_jsonb.slice(0, 4).map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-xs text-muted"
                              >
                                <CheckCircle2
                                  className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-accent transition-colors"
                        >
                          <span>Service Details</span>
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <Link
                          href={`/contact?service=${encodeURIComponent(service.title)}`}
                          className="text-xs font-mono text-highlight hover:underline"
                        >
                          Request Quote →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Mid-Journey 10K Interactive Moment: Scope Architect */}
                <InteractiveScopeBuilder
                  services={services}
                  ownerName={profile.full_name}
                  whatsappNormalized={profile.whatsapp_normalized}
                />
              </div>
            </section>
          );
        }

        if (section.type === 'projects-gallery') {
          const featuredProjects =
            projects.filter((p) => p.featured).length > 0
              ? projects.filter((p) => p.featured)
              : projects;

          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="py-20 md:py-28 bg-canvas"
            >
              <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                      <span>{chapterIdx}</span>
                      <span>—</span>
                      <span>{section.label}</span>
                    </div>
                    <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                      {section.eyebrow}
                    </p>
                    <h2 className="chapter-heading font-display font-semibold text-fg">
                      {section.heading}
                    </h2>
                    <p className="text-base text-muted leading-relaxed">
                      {section.subheading}
                    </p>
                  </div>

                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-raised text-sm font-medium text-fg hover:border-accent transition-colors shrink-0"
                  >
                    <span>Filter &amp; Search All Work</span>
                    <ArrowUpRight className="w-4 h-4 text-accent" aria-hidden="true" />
                  </Link>
                </div>

                <HorizontalProjectRail
                  projects={featuredProjects}
                  enableDesktopRail={Boolean(
                    section.settings_jsonb?.enable_desktop_rail ?? true
                  )}
                />
              </div>
            </section>
          );
        }

        if (section.type === 'skills-grid') {
          const groups = [
            {
              key: 'graphic-design',
              code: '01 // VISUAL CRAFT',
              title: 'Graphic Design & Branding',
            },
            {
              key: 'web-development',
              code: '02 // WEB ARCHITECTURE',
              title: 'Website Design & Development',
            },
            {
              key: 'digital-setup',
              code: '03 // PLATFORM PRESENCE',
              title: 'Digital Business & Social Setup',
            },
            {
              key: 'content-support',
              code: '04 // STRUCTURED OPERATIONS',
              title: 'Data Entry & Content Support',
            },
          ];

          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="py-20 md:py-28 bg-raised/30"
            >
              <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                    <span>{chapterIdx}</span>
                    <span>—</span>
                    <span>{section.label}</span>
                  </div>
                  <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                    {section.eyebrow}
                  </p>
                  <h2 className="chapter-heading font-display font-semibold text-fg">
                    {section.heading}
                  </h2>
                  <p className="text-base text-muted leading-relaxed">
                    {section.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groups.map((grp) => {
                    const groupSkills = skills.filter((s) => s.category === grp.key);
                    return (
                      <div
                        key={grp.key}
                        className="rounded-card border border-border bg-raised/85 p-7 space-y-5"
                      >
                        <div className="flex items-center justify-between border-b border-border/70 pb-4">
                          <div>
                            <span className="text-xs font-mono text-accent">{grp.code}</span>
                            <h3 className="text-lg font-semibold text-fg mt-1">{grp.title}</h3>
                          </div>
                          <Sparkles className="w-4 h-4 text-highlight" aria-hidden="true" />
                        </div>

                        <div className="space-y-4">
                          {groupSkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="p-4 rounded-xl border border-border/70 bg-canvas/70 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-semibold text-fg">{skill.name}</h4>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-raised border border-border text-muted">
                                  {skill.tool_metaphor}
                                </span>
                              </div>
                              <p className="text-xs text-muted leading-relaxed">
                                {skill.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'timeline') {
          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="py-20 md:py-28 bg-canvas"
            >
              <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                      <span>{chapterIdx}</span>
                      <span>—</span>
                      <span>{section.label}</span>
                    </div>
                    <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                      {section.eyebrow}
                    </p>
                    <h2 className="chapter-heading font-display font-semibold text-fg">
                      {section.heading}
                    </h2>
                    <p className="text-base text-muted leading-relaxed">
                      {section.subheading}
                    </p>
                  </div>

                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-raised text-sm font-medium text-fg hover:border-accent transition-colors shrink-0"
                  >
                    <span>Full Resume &amp; Credentials</span>
                    <ArrowUpRight className="w-4 h-4 text-accent" aria-hidden="true" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Professional Practice Column */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 text-sm font-mono uppercase tracking-wider text-accent">
                      <Briefcase className="w-4 h-4" aria-hidden="true" />
                      <span>Professional Practice</span>
                    </div>

                    <div className="relative pl-6 border-l border-border space-y-6">
                      {experiences.map((exp) => (
                        <div
                          key={exp.id}
                          className="relative rounded-card border border-border bg-raised/85 p-6 space-y-3"
                        >
                          <span className="absolute -left-[31px] top-7 w-3.5 h-3.5 rounded-full bg-accent border-2 border-canvas" />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono text-highlight">
                              {exp.period_label}
                            </span>
                            {exp.is_current ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                Active Practice
                              </span>
                            ) : null}
                          </div>
                          <h3 className="text-lg font-semibold text-fg">{exp.role_title}</h3>
                          <p className="text-xs font-mono text-muted">{exp.organization}</p>
                          <p className="text-sm text-muted leading-relaxed">{exp.summary}</p>
                          {exp.highlights_jsonb && exp.highlights_jsonb.length > 0 ? (
                            <ul className="space-y-1.5 pt-2">
                              {exp.highlights_jsonb.map((hl) => (
                                <li
                                  key={hl}
                                  className="text-xs text-muted flex items-start gap-2"
                                >
                                  <span className="text-accent mt-0.5">•</span>
                                  <span>{hl}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Academic Foundation Column (Truth-in-Marketing: Never labeled completed until confirmed) */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 text-sm font-mono uppercase tracking-wider text-highlight">
                      <GraduationCap className="w-4 h-4" aria-hidden="true" />
                      <span>Academic Foundation</span>
                    </div>

                    <div className="relative pl-6 border-l border-border space-y-6">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="relative rounded-card border border-border bg-raised/85 p-6 space-y-3"
                        >
                          <span className="absolute -left-[31px] top-7 w-3.5 h-3.5 rounded-full bg-highlight border-2 border-canvas" />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono text-highlight">
                              {edu.period_label}
                            </span>
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              {edu.completion_status === 'completed'
                                ? 'Verified Completed'
                                : edu.completion_status === 'in_progress'
                                ? 'In Progress'
                                : '2022–2026 · Status Pending Confirmation'}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-fg">{edu.degree}</h3>
                          <p className="text-xs font-mono text-muted">{edu.institution}</p>
                          <p className="text-sm text-muted leading-relaxed">{edu.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'journal-preview' || section.type === 'testimonials') {
          const latestPosts = posts.slice(0, 3);
          const verifiedTestimonials = testimonials.filter(
            (t) => t.is_verified && t.status === 'published' && t.is_visible
          );

          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="py-20 md:py-28 bg-raised/30"
            >
              <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                      <span>{chapterIdx}</span>
                      <span>—</span>
                      <span>{section.label}</span>
                    </div>
                    <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                      {section.eyebrow}
                    </p>
                    <h2 className="chapter-heading font-display font-semibold text-fg">
                      {section.heading}
                    </h2>
                    <p className="text-base text-muted leading-relaxed">
                      {section.subheading}
                    </p>
                  </div>

                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-raised text-sm font-medium text-fg hover:border-accent transition-colors shrink-0"
                  >
                    <span>Explore All Journal Articles</span>
                    <ArrowUpRight className="w-4 h-4 text-accent" aria-hidden="true" />
                  </Link>
                </div>

                {/* Journal Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {latestPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group cinema-bento-card rounded-card border border-border bg-raised/90 p-6 flex flex-col justify-between space-y-5 hover:border-accent/70 transition-colors"
                    >
                      <div className="space-y-3">
                        {post.cover_url ? (
                          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border bg-canvas mb-2">
                            <img
                              src={post.cover_url}
                              alt={post.cover_alt || post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="flex items-center justify-between gap-2 text-xs font-mono text-muted">
                          <span className="text-accent">{post.category_name}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{post.reading_time_minutes} min read</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-fg group-hover:text-accent transition-colors leading-snug">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-sm text-muted leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted">
                        <span>{formatDateReadable(post.published_at)}</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-fg hover:text-accent inline-flex items-center gap-1 font-sans font-medium"
                        >
                          <span>Read Article</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Conditional Testimonials Block: ONLY rendered when verified records exist (PRD Section 4) */}
                {verifiedTestimonials.length > 0 ? (
                  <div className="pt-8 border-t border-border/60 space-y-6">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-highlight">
                      <Quote className="w-4 h-4 text-accent" aria-hidden="true" />
                      <span>Verified Client Perspectives</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {verifiedTestimonials.map((item) => (
                        <blockquote
                          key={item.id}
                          className="rounded-card border border-border bg-raised p-6 space-y-4"
                        >
                          <p className="text-sm sm:text-base text-fg italic leading-relaxed">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                          <footer className="flex items-center justify-between text-xs font-mono text-muted">
                            <div>
                              <strong className="text-fg font-sans font-semibold block">
                                {item.author_name}
                              </strong>
                              <span>
                                {[item.author_role, item.company].filter(Boolean).join(' · ')}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Verified
                            </span>
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          );
        }

        if (section.type === 'contact') {
          return (
            <section
              key={section.id}
              id={section.section_key}
              data-chapter-code={chapterIdx}
              className="py-20 md:py-28 bg-canvas cosmic-grid-backdrop"
            >
              <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  {/* Left Narrative Closure & Direct Channels */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                      <span>{chapterIdx}</span>
                      <span>—</span>
                      <span>{section.label}</span>
                    </div>

                    <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                      {section.eyebrow}
                    </p>

                    <h2 className="chapter-heading font-display font-semibold text-fg">
                      {section.heading}
                    </h2>

                    <p className="text-base text-muted leading-relaxed">
                      {section.subheading}
                    </p>

                    {/* Three Direct CTAs (PRD Section 4 Epilogue) */}
                    <div className="space-y-3 pt-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl border border-border bg-raised hover:border-highlight text-fg text-sm font-medium transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-highlight" aria-hidden="true" />
                          <span>WhatsApp Jahin ({profile.whatsapp_raw})</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted" aria-hidden="true" />
                      </a>

                      <a
                        href={`mailto:${profile.email}`}
                        className="w-full sm:w-auto inline-flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl border border-border bg-raised hover:border-accent text-fg text-sm font-medium transition-colors sm:ml-3"
                      >
                        <span className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-accent" aria-hidden="true" />
                          <span>Email Jahin ({profile.email})</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted" aria-hidden="true" />
                      </a>
                    </div>

                    <div className="p-5 rounded-2xl border border-border/80 bg-raised/60 space-y-2">
                      <p className="text-xs font-mono uppercase tracking-wider text-accent">
                        DIRECT-TO-CREATOR COLLABORATION
                      </p>
                      <p className="text-xs text-muted leading-relaxed">
                        Every inquiry goes directly to {profile.full_name}. Share your goals,
                        timeline, or questions below.
                      </p>
                    </div>
                  </div>

                  {/* Right Inline Inquiry Form */}
                  <div className="lg:col-span-7">
                    <ContactFormIsland
                      services={services}
                      showServiceField={settings.show_service_inquiry_field}
                      showBudgetField={settings.show_project_budget_field}
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // Generic Modular / Custom Code / Python / Text-Image Section
        return (
          <section
            key={section.id}
            id={section.section_key}
            data-chapter-code={chapterIdx}
            className="py-16 md:py-24 bg-canvas"
          >
            <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                  <span>{chapterIdx}</span>
                  <span>—</span>
                  <span>{section.label}</span>
                </div>
                {section.eyebrow ? (
                  <p className="text-xs font-mono uppercase tracking-widest text-highlight">
                    {section.eyebrow}
                  </p>
                ) : null}
                <h2 className="chapter-heading font-display font-semibold text-fg">
                  {section.heading}
                </h2>
                {section.subheading ? (
                  <p className="text-base text-muted max-w-3xl leading-relaxed">
                    {section.subheading}
                  </p>
                ) : null}
              </div>

              <CustomCodeAndPythonBlock
                sectionId={section.id}
                imageUrl={section.content_jsonb?.image_url as string}
                imageAlt={(section.content_jsonb?.image_alt as string) || section.heading}
                customHtml={section.content_jsonb?.custom_html as string}
                customCss={section.content_jsonb?.custom_css as string}
                pythonCode={section.content_jsonb?.python_code as string}
                pythonTitle={
                  (section.content_jsonb?.python_title as string) || section.label
                }
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}

