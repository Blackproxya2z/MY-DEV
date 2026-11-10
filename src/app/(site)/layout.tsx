import React from 'react';
import { getPublicSiteData } from '@/lib/db';
import { SiteNavbar } from '@/components/story/SiteNavbar';
import { SiteFooter } from '@/components/story/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, settings, navigation, socialLinks } = await getPublicSiteData();

  return (
    <div className="min-h-svh flex flex-col bg-canvas text-fg">
      <SiteNavbar navigation={navigation} profile={profile} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter
        profile={profile}
        settings={settings}
        navigation={navigation}
        socialLinks={socialLinks}
      />
    </div>
  );
}

