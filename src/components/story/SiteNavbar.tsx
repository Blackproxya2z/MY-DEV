'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Sparkles, ArrowUpRight, EyeOff, Eye } from 'lucide-react';
import { NavigationItem, Profile } from '@/lib/schemas';
import { useOdysseyExperience } from '@/lib/motion';

export function SiteNavbar({
  navigation,
  profile,
}: {
  navigation: NavigationItem[];
  profile: Profile;
}) {
  const pathname = usePathname();
  const {
    themeMode,
    setThemeMode,
    effectiveMotion,
    visitorReducedOverride,
    setVisitorReducedOverride,
  } = useOdysseyExperience();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-canvas/85 backdrop-blur-xl">
      {/* Keyboard Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-canvas focus:font-medium"
      >
        Skip to main content
      </a>

      <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Brand Monogram & Identity */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:rounded-lg"
          aria-label={`${profile.full_name} — Home`}
        >
          {profile.logo_url || profile.avatar_url ? (
            <span className="w-10 h-10 rounded-xl border border-border bg-raised overflow-hidden flex items-center justify-center group-hover:border-accent transition-colors">
              <img
                src={(profile.logo_url || profile.avatar_url)!}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            </span>
          ) : (
            <span className="w-10 h-10 rounded-xl border border-border bg-raised flex items-center justify-center font-mono text-sm font-semibold tracking-wider text-fg group-hover:border-accent transition-colors">
              JA
            </span>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-fg flex items-center gap-1.5">
              {profile.full_name}
              <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            </span>
            <span className="text-[11px] font-mono text-muted hidden sm:inline">
              THE CREATIVE ODYSSEY
            </span>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
          {navigation.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.id}
                href={item.href}
                target={item.is_external ? '_blank' : undefined}
                rel={item.is_external ? 'noopener noreferrer' : undefined}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-fg bg-raised border border-border/80'
                    : 'text-muted hover:text-fg hover:bg-raised/60'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls: Reduced-Motion Toggle, Theme Toggle, Contact CTA, Mobile Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVisitorReducedOverride(!visitorReducedOverride)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-border bg-raised/70 text-xs font-mono text-muted hover:text-fg transition-colors min-h-[40px]"
            title={
              effectiveMotion === 'off'
                ? 'Reduced motion is active. Click to enable standard motion.'
                : 'Click to reduce motion effects.'
            }
            aria-pressed={visitorReducedOverride}
            aria-label="Toggle reduced motion"
          >
            {effectiveMotion === 'off' ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-highlight" aria-hidden="true" />
                <span>Motion: Off</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                <span>Motion: On</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-raised/80 text-fg hover:border-accent transition-colors"
            aria-label={
              themeMode === 'dark' ? 'Switch to light editorial theme' : 'Switch to dark cosmic theme'
            }
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-highlight" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-accent" aria-hidden="true" />
            )}
          </button>

          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-canvas font-medium text-sm hover:opacity-95 transition-opacity min-h-[40px]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border bg-raised text-fg"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen ? (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-border bg-canvas px-4 pt-3 pb-6 space-y-3"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-3 rounded-xl text-base font-medium text-fg hover:bg-raised flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-muted" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setVisitorReducedOverride(!visitorReducedOverride)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-border bg-raised text-xs font-mono text-left flex items-center justify-between text-muted"
            >
              <span>Motion Accessibility Mode</span>
              <span className="text-fg font-semibold">
                {effectiveMotion === 'off' ? 'Reduced (Off)' : 'Standard (On)'}
              </span>
            </button>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-accent text-canvas font-semibold text-sm text-center flex items-center justify-center gap-2"
            >
              <span>Let&apos;s Work Together</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

