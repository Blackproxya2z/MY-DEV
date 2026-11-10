import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetDbToSeed,
  getPublicSiteData,
  getPublicProjectBySlug,
  upsertAdminPageSection,
  restoreAdminContentRevision,
  upsertAdminProject,
  upsertAdminPost,
  createAdminMediaAsset,
  deleteAdminMediaAsset,
  submitPublicContactMessage,
  updateAdminContactMessage,
  readFullDbState,
} from '@/lib/db';

describe('Database & CMS Integration Suite (24 Entities + Truth-in-Marketing + RLS Filters)', () => {
  beforeEach(async () => {
    await resetDbToSeed();
  });

  it('seeds all 8 homepage chapters, 6 disciplines, 6 projects, and enforces truth-in-marketing rules', async () => {
    const publicData = await getPublicSiteData();
    expect(publicData.profile.full_name).toBe('Jahin Azmain');
    expect(publicData.profile.whatsapp_normalized).toBe('8801647236359');
    expect(publicData.homeSections).toHaveLength(8);
    expect(publicData.services).toHaveLength(6);
    expect(publicData.projects).toHaveLength(6);

    // Education completion status must NOT be asserted as completed by default
    expect(publicData.education[0].completion_status).toBe('pending_verification');

    // Unverified testimonials and empty social links must be excluded from public queries
    expect(publicData.testimonials).toHaveLength(0);
    expect(publicData.socialLinks).toHaveLength(0);
  });

  it('persists hero section edits, creates revision snapshots, and restores previous revisions', async () => {
    await upsertAdminPageSection({
      id: 'sec-home-01',
      heading: 'Custom Odyssey Hero Headline',
    });

    const updatedPublic = await getPublicSiteData();
    expect(updatedPublic.homeSections[0].heading).toBe('Custom Odyssey Hero Headline');

    // Restore initial revision (rev-init-001)
    await restoreAdminContentRevision('rev-init-001');
    const restoredPublic = await getPublicSiteData();
    expect(restoredPublic.homeSections[0].heading).toBe(
      'Designing Visual Stories. Building Digital Experiences.'
    );
  });

  it('hides draft projects from public reads, allows private preview, and exposes after publish', async () => {
    const draftProj = await upsertAdminProject({
      title: 'Stealth Concept World',
      slug: 'stealth-concept-world',
      category: 'Web Engineering',
      summary: 'A confidential draft case study in progress.',
      status: 'draft',
    });

    // Public read must NOT see the draft
    const publicDuringDraft = await getPublicSiteData();
    expect(
      publicDuringDraft.projects.some((p) => p.slug === 'stealth-concept-world')
    ).toBe(false);
    expect(await getPublicProjectBySlug('stealth-concept-world', false)).toBeNull();

    // Admin private preview MUST see the draft
    const adminPreview = await getPublicProjectBySlug('stealth-concept-world', true);
    expect(adminPreview?.title).toBe('Stealth Concept World');

    // Publish the project
    await upsertAdminProject({
      id: draftProj.id,
      title: 'Stealth Concept World',
      slug: 'stealth-concept-world',
      status: 'published',
    });

    const publicAfterPublish = await getPublicProjectBySlug('stealth-concept-world', false);
    expect(publicAfterPublish?.status).toBe('published');
  });

  it('prevents deleting media assets referenced by a published project', async () => {
    const asset = await createAdminMediaAsset({
      filename: 'protected-cover.svg',
      public_url: 'https://example.com/protected-cover.svg',
      mime_type: 'image/svg+xml',
      size_bytes: 4096,
      alt_text: 'Protected cover',
    });

    await upsertAdminProject({
      title: 'Media Linked Project',
      slug: 'media-linked-project',
      category: 'Branding',
      summary: 'Uses uploaded media cover',
      cover_media_id: asset.id,
      cover_url: asset.public_url,
      status: 'published',
    });

    await expect(deleteAdminMediaAsset(asset.id)).rejects.toThrow(
      /referenced by published project/i
    );
  });

  it('creates and publishes a sanitized blog post and processes contact messages', async () => {
    const post = await upsertAdminPost({
      title: 'New Editorial Field Note',
      excerpt: 'Exploring design systems and typography.',
      content_html: '<h2>Section</h2><script> evil() </script><p>Clean body prose.</p>',
      status: 'published',
    });

    expect(post.content_html).not.toContain('<script>');
    expect(post.status).toBe('published');

    const msgRes = await submitPublicContactMessage({
      name: 'Arif Hossain',
      email: 'arif@example.com',
      subject: 'E-commerce Storefront Project',
      service_interest: 'Website Design & Development',
      budget_range: '',
      message: 'We would love to collaborate with Jahin on our upcoming online store.',
      website_honeypot: '',
    });
    expect(msgRes.success).toBe(true);

    const state = await readFullDbState();
    expect(state.contact_messages).toHaveLength(1);
    expect(state.contact_messages[0].is_read).toBe(false);

    await updateAdminContactMessage(msgRes.messageId!, {
      is_read: true,
      status: 'read',
    });
    const stateAfterRead = await readFullDbState();
    expect(stateAfterRead.contact_messages[0].is_read).toBe(true);
  });
});

