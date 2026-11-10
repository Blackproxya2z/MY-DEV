import React from 'react';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { getPublicSiteData } from '@/lib/db';
import { OdysseyExperienceProvider } from '@/lib/motion';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: 'Jahin Azmain — The Creative Odyssey | Creative Developer & Digital Designer',
    template: '%s',
  },
  description:
    "I'm Jahin Azmain, a Graphic Designer and Web Developer creating thoughtful designs and modern digital solutions for individuals and businesses.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getPublicSiteData();

  const customThemeVars: React.CSSProperties = {
    ...(settings.custom_accent_color ? ({ '--brand-accent': settings.custom_accent_color } as React.CSSProperties) : {}),
    ...(settings.custom_bg_color ? ({ '--bg-canvas': settings.custom_bg_color } as React.CSSProperties) : {}),
    ...(settings.custom_text_color ? ({ '--text-primary': settings.custom_text_color } as React.CSSProperties) : {}),
    ...(typeof settings.card_radius_px === 'number'
      ? ({ '--radius-card': `${settings.card_radius_px}px` } as React.CSSProperties)
      : {}),
  };

  return (
    <html
      lang="en"
      data-theme={settings.theme_mode}
      data-accent={settings.accent_preset}
      data-motion={settings.motion_preset}
      style={customThemeVars}
      className={`${inter.variable} ${jetbrainsMono.variable} ${
        settings.theme_mode === 'dark' ? 'dark' : ''
      }`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-canvas text-fg antialiased selection:bg-accent selection:text-canvas">
        {settings.custom_css ? (
          <style
            id="odyssey-customizer-css"
            dangerouslySetInnerHTML={{ __html: settings.custom_css }}
          />
        ) : null}

        {settings.custom_head_html ? (
          <div
            id="odyssey-customizer-head-banner"
            dangerouslySetInnerHTML={{ __html: settings.custom_head_html }}
          />
        ) : null}

        <OdysseyExperienceProvider
          initialTheme={settings.theme_mode}
          initialAccent={settings.accent_preset}
          initialMotion={settings.motion_preset}
        >
          {children}
        </OdysseyExperienceProvider>

        {settings.custom_footer_html ? (
          <div
            id="odyssey-customizer-footer-html"
            dangerouslySetInnerHTML={{ __html: settings.custom_footer_html }}
          />
        ) : null}
      </body>
    </html>
  );
}
