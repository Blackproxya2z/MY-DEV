import React from 'react';
import { getPublicSiteData } from '@/lib/db';
import { SiteNavbar } from '@/components/story/SiteNavbar';
import { SiteFooter } from '@/components/story/SiteFooter';
import { AmbientEnvironmentLayer } from '@/components/story/AmbientEnvironmentLayer';

export const dynamic = 'force-dynamic';

export default async function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, settings, navigation, socialLinks } = await getPublicSiteData();

  return (
    <div className="relative min-h-svh flex flex-col bg-canvas text-fg">
      <AmbientEnvironmentLayer />
      <SiteNavbar navigation={navigation} profile={profile} />
      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>
      <div className="relative z-10">
        <SiteFooter
          profile={profile}
          settings={settings}
          navigation={navigation}
          socialLinks={socialLinks}
        />
      </div>
    </div>
  );
}

