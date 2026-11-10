import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';
import { getPublicServiceBySlug, getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata } from '@/lib/seo';
import { formatWhatsAppUrl } from '@/lib/utils';
import { DynamicLucideIcon } from '@/components/ui/LucideIcon';
import { ContactFormIsland } from '@/components/portfolio/ContactFormIsland';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getPublicServiceBySlug(params.slug);
  if (!service) {
    return buildRouteMetadata(`/services/${params.slug}`, {
      title: 'Service Not Found | Jahin Azmain',
      description: 'Requested service record was not found.',
      noindex: true,
    });
  }

  return buildRouteMetadata(`/services/${service.slug}`, {
    title: `${service.title} — Services | Jahin Azmain`,
    description: service.teaser,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [service, siteData] = await Promise.all([
    getPublicServiceBySlug(params.slug),
    getPublicSiteData(),
  ]);

  if (!service) {
    notFound();
  }

  const waUrl = formatWhatsAppUrl(
    siteData.profile.whatsapp_normalized,
    `${service.whatsapp_template} (${service.title})`
  );

  return (
    <div className="py-14 md:py-24 space-y-20">
      <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>Back to All Services</span>
        </Link>

        {/* Service Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md border border-border bg-raised text-xs font-mono text-accent">
                DISCIPLINE {service.number_label} // {service.category}
              </span>
              {service.show_price && service.price_label ? (
                <span className="px-3 py-1 rounded-md border border-border bg-raised text-xs font-mono text-highlight">
                  {service.price_label}
                </span>
              ) : null}
            </div>

            <h1 className="chapter-heading font-display font-semibold text-fg">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              {service.description}
            </p>

            {service.cover_url ? (
              <div className="rounded-card overflow-hidden border border-border aspect-[16/9] max-w-2xl">
                <img
                  src={service.cover_url}
                  alt={service.cover_alt || service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#service-inquiry"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-canvas font-semibold text-sm"
              >
                <span>Request a Custom Scope</span>
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-raised text-fg text-sm font-medium hover:border-highlight transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-highlight" aria-hidden="true" />
                <span>Discuss on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Deliverables Card */}
          <div className="lg:col-span-4 rounded-card border border-border bg-raised p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono uppercase tracking-wider text-accent">
                Included Capabilities
              </h2>
              <DynamicLucideIcon name={service.icon_name} className="w-5 h-5 text-highlight" />
            </div>

            <ul className="space-y-3 pt-2">
              {service.deliverables_jsonb.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-fg">
                  <CheckCircle2
                    className="w-4 h-4 text-accent shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process Workflow */}
        {service.process_jsonb && service.process_jsonb.length > 0 ? (
          <section className="pt-8 border-t border-border/60 space-y-6">
            <h2 className="text-2xl font-display font-semibold text-fg">
              How This Discipline Unfolds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.process_jsonb.map((step) => (
                <div
                  key={step.step}
                  className="rounded-card border border-border bg-raised/80 p-6 space-y-3"
                >
                  <span className="text-xs font-mono text-accent">STEP {step.step}</span>
                  <h3 className="text-lg font-semibold text-fg">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Service FAQs */}
        {service.faqs_jsonb && service.faqs_jsonb.length > 0 ? (
          <section className="pt-8 border-t border-border/60 space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-highlight" aria-hidden="true" />
              <h2 className="text-2xl font-display font-semibold text-fg">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.faqs_jsonb.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-card border border-border bg-raised/70 p-6 space-y-2.5"
                >
                  <h3 className="text-base font-semibold text-fg">{faq.question}</h3>
                  <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Direct Inquiry Section */}
        <section id="service-inquiry" className="pt-8 border-t border-border/60 space-y-6">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-highlight">
              START THIS DISCIPLINE
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-fg">
              Inquire About {service.title}
            </h2>
          </div>
          <ContactFormIsland
            services={siteData.services}
            defaultService={service.title}
            showServiceField={true}
            showBudgetField={siteData.settings.show_project_budget_field}
          />
        </section>
      </div>
    </div>
  );
}

