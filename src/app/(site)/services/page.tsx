import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata } from '@/lib/seo';
import { formatWhatsAppUrl } from '@/lib/utils';
import { DynamicLucideIcon } from '@/components/ui/LucideIcon';
import { InteractiveScopeBuilder } from '@/components/story/InteractiveScopeBuilder';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildRouteMetadata('/services', {
    title: 'Services & Disciplines | Jahin Azmain',
    description:
      'Graphic Design & Branding, Website Design & Development, Social Media Management, Business Page Setup, LinkedIn Optimization, and Data Entry.',
  });
}

export default async function ServicesPage() {
  const { services, profile } = await getPublicSiteData();

  return (
    <div className="py-16 md:py-24 space-y-20">
      {/* Header */}
      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>DISCIPLINES &amp; SERVICE CATALOG</span>
        </span>

        <h1 className="chapter-heading font-display font-semibold text-fg max-w-3xl">
          One Creative Partner. End-to-End Execution.
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          Six connected services designed to take your brand from first concept to a fully running
          online presence.
        </p>
      </section>

      {/* Services Detailed Grid */}
      <section className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const waLink = formatWhatsAppUrl(
              profile.whatsapp_normalized,
              `${service.whatsapp_template} (${service.title})`
            );

            return (
              <article
                key={service.id}
                className="cinema-bento-card rounded-card border border-border bg-raised/90 p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:border-accent/70 transition-colors"
              >
                <div className="space-y-5">
                  {service.cover_url ? (
                    <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border bg-canvas">
                      <img
                        src={service.cover_url}
                        alt={service.cover_alt || service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between gap-4">
                    <span className="px-3 py-1 rounded-md border border-border bg-canvas text-xs font-mono text-accent font-semibold">
                      {service.number_label} // {service.category}
                    </span>
                    <div className="w-11 h-11 rounded-xl border border-border bg-canvas flex items-center justify-center text-highlight">
                      <DynamicLucideIcon name={service.icon_name} className="w-5 h-5" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold text-fg">
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base text-muted leading-relaxed">
                    {service.description}
                  </p>

                  {service.sub_services_jsonb && service.sub_services_jsonb.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-mono uppercase tracking-wider text-highlight">
                        Specialized Offerings
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.sub_services_jsonb.map((sub) => (
                          <span
                            key={sub}
                            className="px-2.5 py-1 rounded-lg border border-border bg-canvas text-xs font-mono text-fg"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {service.deliverables_jsonb && service.deliverables_jsonb.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <p className="text-xs font-mono uppercase tracking-wider text-muted">
                        Key Deliverables
                      </p>
                      <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.deliverables_jsonb.map((del) => (
                          <li
                            key={del}
                            className="list-none flex items-start gap-2 text-xs text-muted"
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="pt-5 border-t border-border/70 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs sm:text-sm"
                  >
                    <span>Explore Service &amp; Process</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs font-mono text-fg hover:border-highlight transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-highlight" aria-hidden="true" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16">
          <InteractiveScopeBuilder
            services={services}
            ownerName={profile.full_name}
            whatsappNormalized={profile.whatsapp_normalized}
          />
        </div>
      </section>
    </div>
  );
}

