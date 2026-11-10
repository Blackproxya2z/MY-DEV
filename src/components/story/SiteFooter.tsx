import React from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import { NavigationItem, Profile, SiteSettings, SocialLink } from '@/lib/schemas';
import { formatWhatsAppUrl } from '@/lib/utils';
import { DynamicLucideIcon } from '@/components/ui/LucideIcon';

export function SiteFooter({
  profile,
  settings,
  navigation,
  socialLinks,
}: {
  profile: Profile;
  settings: SiteSettings;
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
}) {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = formatWhatsAppUrl(
    profile.whatsapp_normalized,
    `Hi ${profile.full_name}, I visited your website and would like to discuss a project.`
  );

  // Only render verified social links with non-empty URLs (PRD Section 2.1 & 2.3)
  const verifiedSocials = socialLinks.filter(
    (s) => s.is_verified && s.is_visible && s.url.trim().length > 0
  );

  return (
    <footer className="border-t border-border bg-raised/50 text-fg">
      <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/70">
          {/* Column 1: Brand Identity & Statement */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl border border-border bg-canvas flex items-center justify-center font-mono text-xs font-bold text-accent">
                JA
              </span>
              <div>
                <p className="font-semibold text-base tracking-tight flex items-center gap-1.5">
                  {profile.full_name}
                  <Sparkles className="w-3.5 h-3.5 text-highlight" aria-hidden="true" />
                </p>
                <p className="text-xs font-mono text-muted">{profile.role_title}</p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-md">
              {profile.brand_statement}
            </p>
            {profile.is_available ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-canvas text-xs font-mono text-fg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{profile.availability_text}</span>
              </div>
            ) : null}
          </div>

          {/* Column 2: Sitemap Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted">
              Story &amp; Pages
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted hover:text-fg transition-colors">
                  Home Odyssey
                </Link>
              </li>
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-muted hover:text-fg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Human Channels */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted">
              Direct Channels
            </h2>
            <div className="space-y-2.5 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2.5 text-muted hover:text-fg transition-colors"
              >
                <Mail className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span>{profile.email}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-muted hover:text-fg transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-highlight shrink-0" aria-hidden="true" />
                <span>WhatsApp: {profile.whatsapp_raw}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>

            {verifiedSocials.length > 0 ? (
              <div className="pt-2">
                <p className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Verified Profiles
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {verifiedSocials.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-muted hover:text-fg hover:border-accent transition-colors"
                    >
                      <DynamicLucideIcon name={soc.icon_name} className="w-3.5 h-3.5" />
                      <span>{soc.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted font-mono">
          <p>
            &copy; {currentYear} {settings.copyright_name}. All rights reserved. Designing Visual
            Stories. Building Digital Experiences.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-muted hover:text-fg transition-colors"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Owner CMS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

