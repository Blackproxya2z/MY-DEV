import React from 'react';
import { getPublicSiteData } from '@/lib/db';
import { buildRouteMetadata, generatePersonAndWebsiteSchema } from '@/lib/seo';
import { ChapterProgressIndicator } from '@/components/story/ChapterProgressIndicator';
import { SectionRenderer } from '@/components/story/SectionRenderer';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildRouteMetadata('/', {
    title: 'Jahin Azmain — The Creative Odyssey | Creative Developer & Digital Designer',
    description:
      "I'm Jahin Azmain, a Graphic Designer and Web Developer creating thoughtful designs and modern digital solutions for individuals and businesses.",
  });
}

export default async function HomePage() {
  const [siteData, jsonLd] = await Promise.all([
    getPublicSiteData(),
    generatePersonAndWebsiteSchema(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChapterProgressIndicator sections={siteData.homeSections} />
      <SectionRenderer
        sections={siteData.homeSections}
        profile={siteData.profile}
        settings={siteData.settings}
        services={siteData.services}
        projects={siteData.projects}
        posts={siteData.posts}
        skills={siteData.skills}
        experiences={siteData.experiences}
        education={siteData.education}
        testimonials={siteData.testimonials}
      />
    </>
  );
}

