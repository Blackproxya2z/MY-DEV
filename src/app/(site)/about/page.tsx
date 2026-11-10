import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, GraduationCap, Briefcase, Mail, MessageSquare } from 'lucide-react';
import { getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata } from '@/lib/seo';
import { formatWhatsAppUrl } from '@/lib/utils';
import { HeroSparkMotif } from '@/components/story/HeroSparkMotif';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildRouteMetadata('/about', {
    title: 'About Jahin Azmain | Story, Philosophy & Capabilities',
    description:
      'Learn about Jahin Azmain, a creative professional combining graphic design, web development, and digital business setup.',
  });
}

export default async function AboutPage() {
  const { profile, skills, experiences, education } = await getPublicSiteData();
  const whatsappUrl = formatWhatsAppUrl(
    profile.whatsapp_normalized,
    `Hi ${profile.full_name}, I read your About page and would like to connect.`
  );

  return (
    <div className="py-16 md:py-24 space-y-24">
      {/* Hero Story Header */}
      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>THE STORY BEHIND THE SCREEN</span>
            </span>

            <h1 className="chapter-heading font-display font-semibold text-fg">
              Every Great Idea Begins Somewhere.
            </h1>

            <p className="text-lg text-fg font-medium leading-relaxed border-l-2 border-accent pl-4">
              {profile.brand_statement}
            </p>

            <p className="text-base text-muted leading-relaxed">{profile.full_bio}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.categories_list.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 rounded-lg border border-border bg-raised text-xs font-mono text-fg"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-canvas font-semibold text-sm"
              >
                <span>Start a Project Together</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-raised text-fg text-sm font-medium hover:border-highlight transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-highlight" aria-hidden="true" />
                <span>WhatsApp Direct</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-raised text-fg text-sm font-medium hover:border-accent transition-colors"
              >
                <Mail className="w-4 h-4 text-accent" aria-hidden="true" />
                <span>{profile.email}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroSparkMotif
              caption="IDENTITY // DESIGN & WEB ARCHITECTURE"
              portraitUrl={profile.avatar_url}
              ownerName={profile.full_name}
            />
          </div>
        </div>
      </section>

      {/* Capabilities Matrix */}
      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-highlight">
            MULTIDISCIPLINARY CRAFT
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-fg">
            Core Disciplines &amp; Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="rounded-card border border-border bg-raised/85 p-6 space-y-3"
            >
              <span className="text-[11px] font-mono text-accent uppercase tracking-wider">
                {skill.group_label}
              </span>
              <h3 className="text-base font-semibold text-fg">{skill.name}</h3>
              <p className="text-xs text-muted leading-relaxed">{skill.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience & Academic Timeline */}
      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent">
              <Briefcase className="w-4 h-4" aria-hidden="true" />
              <span>Professional Practice</span>
            </div>
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="rounded-card border border-border bg-raised/90 p-7 space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-mono text-highlight">
                  <span>{exp.period_label}</span>
                  <span>{exp.organization}</span>
                </div>
                <h3 className="text-xl font-semibold text-fg">{exp.role_title}</h3>
                <p className="text-sm text-muted leading-relaxed">{exp.summary}</p>
                {exp.highlights_jsonb && exp.highlights_jsonb.length > 0 ? (
                  <ul className="space-y-2 pt-2 border-t border-border/60">
                    {exp.highlights_jsonb.map((item) => (
                      <li key={item} className="text-xs text-muted flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-highlight">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              <span>Academic Background</span>
            </div>
            {education.map((edu) => (
              <div
                key={edu.id}
                className="rounded-card border border-border bg-raised/90 p-7 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-highlight">{edu.period_label}</span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {edu.completion_status === 'completed'
                      ? 'Verified Completed'
                      : '2022–2026 · Status Pending Confirmation'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-fg">{edu.degree}</h3>
                <p className="text-xs font-mono text-muted">{edu.institution}</p>
                <p className="text-sm text-muted leading-relaxed">{edu.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

