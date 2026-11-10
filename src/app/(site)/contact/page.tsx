import React from 'react';
import { Mail, MessageSquare, Sparkles, ArrowUpRight, MapPin } from 'lucide-react';
import { getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata } from '@/lib/seo';
import { formatWhatsAppUrl } from '@/lib/utils';
import { ContactFormIsland } from '@/components/portfolio/ContactFormIsland';
import { DynamicLucideIcon } from '@/components/ui/LucideIcon';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildRouteMetadata('/contact', {
    title: 'Contact Jahin Azmain | Start a Creative or Web Project',
    description:
      'Get in touch with Jahin Azmain via direct inquiry form, WhatsApp, or email to discuss your next project.',
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: { service?: string };
}) {
  const { profile, settings, services, socialLinks } = await getPublicSiteData();
  const whatsappUrl = formatWhatsAppUrl(
    profile.whatsapp_normalized,
    `Hi ${profile.full_name}, I would like to discuss a project with you.`
  );

  const verifiedSocials = socialLinks.filter(
    (s) => s.is_verified && s.is_visible && s.url.trim().length > 0
  );

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Channels & Context */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised text-xs font-mono text-accent">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>EPILOGUE // COLLABORATION</span>
              </span>

              <h1 className="chapter-heading font-display font-semibold text-fg">
                Have a Project in Mind? Let&apos;s Create Something Great.
              </h1>

              <p className="text-base text-muted leading-relaxed">
                Whether you need a cohesive visual identity, a modern responsive website, or
                complete business page optimization, send a direct message or connect via
                WhatsApp.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-3.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border border-border bg-raised/90 hover:border-highlight flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl border border-border bg-canvas flex items-center justify-center text-highlight">
                    <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-muted block">DIRECT WHATSAPP</span>
                    <strong className="text-base font-semibold text-fg">
                      {profile.whatsapp_raw}
                    </strong>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted" aria-hidden="true" />
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="p-5 rounded-2xl border border-border bg-raised/90 hover:border-accent flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl border border-border bg-canvas flex items-center justify-center text-accent">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-muted block">DIRECT EMAIL</span>
                    <strong className="text-base font-semibold text-fg">{profile.email}</strong>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted" aria-hidden="true" />
              </a>

              <div className="p-5 rounded-2xl border border-border bg-raised/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl border border-border bg-canvas flex items-center justify-center text-muted">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-mono text-muted block">AVAILABILITY</span>
                  <strong className="text-sm font-medium text-fg">
                    {profile.availability_text} · {profile.location}
                  </strong>
                </div>
              </div>
            </div>

            {verifiedSocials.length > 0 ? (
              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted">
                  Verified Profiles
                </h2>
                <div className="flex flex-wrap gap-2">
                  {verifiedSocials.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-raised text-xs font-medium text-fg hover:border-accent"
                    >
                      <DynamicLucideIcon name={soc.icon_name} className="w-4 h-4 text-accent" />
                      <span>{soc.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Validated Form */}
          <div className="lg:col-span-7">
            <ContactFormIsland
              services={services}
              defaultService={searchParams?.service || ''}
              showServiceField={settings.show_service_inquiry_field}
              showBudgetField={settings.show_project_budget_field}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

