import React from 'react';
import Link from 'next/link';
import {
  Download,
  GraduationCap,
  Briefcase,
  Sparkles,
  Mail,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';
import { getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata } from '@/lib/seo';
import { formatWhatsAppUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildRouteMetadata('/resume', {
    title: 'Resume & Curriculum Vitae | Jahin Azmain',
    description:
      'Academic background in Computer Science & Engineering, professional experience, and multidisciplinary skills.',
  });
}

export default async function ResumePage() {
  const { profile, education, experiences, skills, projects } = await getPublicSiteData();
  const whatsappUrl = formatWhatsAppUrl(
    profile.whatsapp_normalized,
    `Hi ${profile.full_name}, I reviewed your Resume page and would like to discuss an opportunity.`
  );

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Resume Top Header Card */}
        <header className="rounded-card border border-border bg-raised/90 p-8 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/70">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-accent">
                CURRICULUM VITAE // INTERACTIVE RESUME
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-semibold text-fg">
                {profile.full_name}
              </h1>
              <p className="text-base font-medium text-highlight">{profile.role_title}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Show Download Resume button ONLY when an uploaded resume file exists (PRD Section 4) */}
              {profile.resume_url ? (
                <a
                  href={profile.resume_url}
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-canvas font-semibold text-sm"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download PDF Resume</span>
                </a>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-canvas text-fg font-medium text-sm hover:border-accent transition-colors"
              >
                <span>Inquire / Hire</span>
                <ArrowUpRight className="w-4 h-4 text-accent" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted leading-relaxed">{profile.full_bio}</p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-muted">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 hover:text-fg transition-colors"
            >
              <Mail className="w-4 h-4 text-accent" aria-hidden="true" />
              <span>{profile.email}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-fg transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-highlight" aria-hidden="true" />
              <span>WhatsApp: {profile.whatsapp_raw}</span>
            </a>
            <span>{profile.location}</span>
          </div>
        </header>

        {/* Education Section (Truth-in-Marketing: Never labeled completed until confirmed) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5 text-sm font-mono uppercase tracking-wider text-highlight">
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
            <span>Education</span>
          </div>

          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="rounded-card border border-border bg-raised/85 p-7 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold text-fg">{edu.degree}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {edu.completion_status === 'completed'
                      ? `${edu.start_year} – ${edu.end_year} · Completed`
                      : edu.period_label}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted">{edu.institution}</p>
                <p className="text-sm text-muted leading-relaxed">{edu.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5 text-sm font-mono uppercase tracking-wider text-accent">
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>Experience &amp; Practice</span>
          </div>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="rounded-card border border-border bg-raised/85 p-7 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-semibold text-fg">{exp.role_title}</h2>
                    <p className="text-xs font-mono text-muted mt-0.5">{exp.organization}</p>
                  </div>
                  <span className="text-xs font-mono text-highlight">{exp.period_label}</span>
                </div>
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
        </section>

        {/* Multidisciplinary Skills (Without fabricated percentages) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5 text-sm font-mono uppercase tracking-wider text-accent">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Capabilities &amp; Craft</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-2xl border border-border bg-raised/80 p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-fg">{skill.name}</h3>
                  <span className="text-[11px] font-mono text-accent">{skill.group_label}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{skill.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Case Studies Index */}
        <section className="space-y-6">
          <h2 className="text-sm font-mono uppercase tracking-wider text-highlight">
            Selected Portfolio Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <Link
                key={proj.id}
                href={`/projects/${proj.slug}`}
                className="p-4 rounded-xl border border-border bg-raised/70 hover:border-accent transition-colors space-y-1"
              >
                <span className="text-[11px] font-mono text-accent block">{proj.category}</span>
                <strong className="text-sm font-semibold text-fg block">{proj.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

