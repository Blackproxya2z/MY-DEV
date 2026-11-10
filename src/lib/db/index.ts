import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { createInitialSeedState } from '@/lib/db/seed-data';
import {
  isFirebaseConfigured,
  readFirebaseState,
  writeFirebaseState,
} from '@/lib/firebase';
import {
  OdysseyDatabaseState,
  Profile,
  SiteSettings,
  NavigationItem,
  PageSection,
  Service,
  Project,
  ProjectImage,
  Post,
  Skill,
  Experience,
  Education,
  Testimonial,
  SocialLink,
  ContactMessage,
  MediaAsset,
  SeoMetadata,
  ContentRevision,
  ActivityLog,
  ContactSubmissionInputSchema,
  ContactSubmissionInput,
} from '@/lib/schemas';
import { sanitizeRichHtml, estimateReadingTime, slugify } from '@/lib/utils';

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'odyssey-data')
  : path.join(process.cwd(), '.data');
const DB_FILE_PATH = path.join(DATA_DIR, 'odyssey-db.json');

let writeLock: Promise<void> = Promise.resolve();

async function ensureDbFile(): Promise<OdysseyDatabaseState> {
  // 1. Primary Cloud Persistence: Firebase (Firestore / Realtime Database)
  if (isFirebaseConfigured()) {
    const remoteState = await readFirebaseState();
    if (remoteState) {
      return remoteState;
    }
    const seed = createInitialSeedState();
    await writeFirebaseState(seed);
    return seed;
  }

  // 2. Local / Serverless Temp File Persistence
  try {
    const raw = await fs.readFile(DB_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as OdysseyDatabaseState;
    if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
      return parsed;
    }
  } catch {
    // Initialize seed database file
  }

  const seed = createInitialSeedState();
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE_PATH, JSON.stringify(seed, null, 2), 'utf8');
  return seed;
}

export function getActiveDatabaseProvider(): 'firebase' | 'supabase' | 'local' {
  if (isFirebaseConfigured()) return 'firebase';
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return 'supabase';
  }
  return 'local';
}

export async function readFullDbState(): Promise<OdysseyDatabaseState> {
  return ensureDbFile();
}

export async function mutateDbState<T>(
  mutator: (state: OdysseyDatabaseState) => Promise<T> | T
): Promise<T> {
  let release!: () => void;
  const nextLock = new Promise<void>((resolve) => {
    release = resolve;
  });
  const previousLock = writeLock;
  writeLock = previousLock.then(() => nextLock);

  await previousLock;
  try {
    const state = await ensureDbFile();
    const result = await mutator(state);

    if (isFirebaseConfigured()) {
      await writeFirebaseState(state);
    } else {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DB_FILE_PATH, JSON.stringify(state, null, 2), 'utf8');
    }
    return result;
  } finally {
    release();
  }
}

export async function resetDbToSeed(): Promise<OdysseyDatabaseState> {
  const seed = createInitialSeedState();
  if (isFirebaseConfigured()) {
    await writeFirebaseState(seed);
  } else {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(seed, null, 2), 'utf8');
  }
  return seed;
}

function appendAuditLog(
  state: OdysseyDatabaseState,
  params: {
    actorEmail?: string;
    action: string;
    entityType: string;
    entityId: string;
    entityLabel: string;
    metadata?: Record<string, unknown>;
  }
): ActivityLog {
  const entry: ActivityLog = {
    id: `log-${crypto.randomUUID().slice(0, 8)}-${Date.now()}`,
    actor_id: 'owner-uid-001',
    actor_email: params.actorEmail || 'azmain56@gmail.com',
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    entity_label: params.entityLabel,
    metadata_jsonb: params.metadata || {},
    created_at: new Date().toISOString(),
  };
  state.activity_logs.unshift(entry);
  return entry;
}

function appendContentRevision(
  state: OdysseyDatabaseState,
  params: {
    entityType: string;
    entityId: string;
    snapshot: Record<string, unknown>;
    summary: string;
    actorEmail?: string;
  }
): ContentRevision {
  const existingVersions = state.content_revisions.filter(
    (r) => r.entity_type === params.entityType && r.entity_id === params.entityId
  );
  const nextVersion =
    existingVersions.length > 0
      ? Math.max(...existingVersions.map((v) => v.version_number)) + 1
      : 1;

  const revision: ContentRevision = {
    id: `rev-${crypto.randomUUID().slice(0, 8)}-${Date.now()}`,
    entity_type: params.entityType,
    entity_id: params.entityId,
    version_number: nextVersion,
    snapshot_jsonb: JSON.parse(JSON.stringify(params.snapshot)),
    change_summary: params.summary,
    created_by: params.actorEmail || 'azmain56@gmail.com',
    created_at: new Date().toISOString(),
  };
  state.content_revisions.unshift(revision);
  return revision;
}

// ============================================================================
// PUBLIC READ QUERIES (Enforces Strict RLS Equivalent Rules)
// ============================================================================

export interface PublicSiteBundle {
  profile: Profile;
  settings: SiteSettings;
  navigation: NavigationItem[];
  homeSections: PageSection[];
  services: Service[];
  projects: (Project & { images: ProjectImage[] })[];
  posts: Post[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
}

export async function getPublicSiteData(): Promise<PublicSiteBundle> {
  const state = await readFullDbState();

  const profile = state.profiles[0];
  const settings = state.site_settings[0];

  const navigation = state.navigation_items
    .filter((n) => n.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  const homeSections = state.page_sections
    .filter((s) => s.page_key === 'home' && s.is_enabled && s.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

  const services = state.services
    .filter((s) => s.status === 'published' && s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  const projects = state.projects
    .filter((p) => p.status === 'published' && p.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => ({
      ...p,
      images: state.project_images
        .filter((img) => img.project_id === p.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));

  const posts = state.posts
    .filter((post) => post.status === 'published' && post.is_visible)
    .sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });

  const skills = state.skills
    .filter((sk) => sk.is_visible && sk.is_verified)
    .sort((a, b) => a.sort_order - b.sort_order);

  const experiences = state.experiences
    .filter((e) => e.status === 'published' && e.is_visible && e.is_verified)
    .sort((a, b) => a.sort_order - b.sort_order);

  const education = state.education
    .filter((ed) => ed.status === 'published' && ed.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Strict Truth-in-Marketing: Public testimonials MUST be published, visible, AND verified
  const testimonials = state.testimonials
    .filter((t) => t.status === 'published' && t.is_visible && t.is_verified)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Strict Truth-in-Marketing: Public social links MUST be visible, verified, AND have non-empty URL
  const socialLinks = state.social_links
    .filter((s) => s.is_visible && s.is_verified && s.url.trim().length > 0)
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    profile,
    settings,
    navigation,
    homeSections,
    services,
    projects,
    posts,
    skills,
    experiences,
    education,
    testimonials,
    socialLinks,
  };
}

export async function getPublicServiceBySlug(slug: string): Promise<Service | null> {
  const state = await readFullDbState();
  return (
    state.services.find(
      (s) => s.slug === slug && s.status === 'published' && s.is_visible
    ) || null
  );
}

export async function getPublicProjectBySlug(
  slug: string,
  allowDraftPreview = false
): Promise<(Project & { images: ProjectImage[] }) | null> {
  const state = await readFullDbState();
  const project = state.projects.find((p) => {
    if (p.slug !== slug) return false;
    if (allowDraftPreview) return true;
    return p.status === 'published' && p.is_visible;
  });

  if (!project) return null;

  const images = state.project_images
    .filter((img) => img.project_id === project.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return { ...project, images };
}

export async function getPublicPostBySlug(
  slug: string,
  allowDraftPreview = false
): Promise<Post | null> {
  const state = await readFullDbState();
  return (
    state.posts.find((p) => {
      if (p.slug !== slug) return false;
      if (allowDraftPreview) return true;
      return p.status === 'published' && p.is_visible;
    }) || null
  );
}

export async function getPublicSeoForRoute(routeKey: string): Promise<SeoMetadata | null> {
  const state = await readFullDbState();
  return state.seo_metadata.find((s) => s.route_key === routeKey) || null;
}

// ============================================================================
// PUBLIC CONTACT SUBMISSION (Validated, Sanitized, Honeypot-Protected)
// ============================================================================

const ipSubmissionLog = new Map<string, number[]>();

export async function submitPublicContactMessage(
  rawInput: ContactSubmissionInput,
  meta?: { ipHash?: string; userAgent?: string }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const parsed = ContactSubmissionInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid form input.',
    };
  }

  const data = parsed.data;

  // Rate limit check per IP hash (max 6 submissions per 5 minutes)
  const ipKey = meta?.ipHash || 'local-client';
  const nowMs = Date.now();
  const recent = (ipSubmissionLog.get(ipKey) || []).filter((t) => nowMs - t < 5 * 60 * 1000);
  if (recent.length >= 6) {
    return {
      success: false,
      error: 'Too many messages sent recently. Please wait a few minutes or reach out via WhatsApp.',
    };
  }
  recent.push(nowMs);
  ipSubmissionLog.set(ipKey, recent);

  const isSpam = Boolean(data.website_honeypot && data.website_honeypot.trim().length > 0);

  return mutateDbState((state) => {
    const newMsg: ContactMessage = {
      id: `msg-${crypto.randomUUID().slice(0, 8)}-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject,
      service_interest: data.service_interest || null,
      budget_range: data.budget_range || null,
      message: data.message,
      status: 'unread',
      is_read: false,
      is_spam: isSpam,
      ip_hash: meta?.ipHash || null,
      user_agent: meta?.userAgent || null,
      replied_at: null,
      created_at: new Date().toISOString(),
    };

    state.contact_messages.unshift(newMsg);
    return { success: true, messageId: newMsg.id };
  });
}

// ============================================================================
// PROTECTED ADMIN MUTATIONS (With Revisions & Audit Logs)
// ============================================================================

export async function updateAdminProfileData(
  patch: Partial<Profile>,
  actorEmail = 'azmain56@gmail.com'
): Promise<Profile> {
  return mutateDbState((state) => {
    const current = state.profiles[0];
    const updated: Profile = {
      ...current,
      ...patch,
      id: current.id,
      updated_at: new Date().toISOString(),
    };
    state.profiles[0] = updated;

    appendContentRevision(state, {
      entityType: 'profile',
      entityId: updated.id,
      snapshot: updated as unknown as Record<string, unknown>,
      summary: 'Updated public brand profile',
      actorEmail,
    });

    appendAuditLog(state, {
      actorEmail,
      action: 'PROFILE_UPDATED',
      entityType: 'profile',
      entityId: updated.id,
      entityLabel: updated.full_name,
    });

    return updated;
  });
}

export async function updateAdminSiteSettings(
  patch: Partial<SiteSettings>,
  actorEmail = 'azmain56@gmail.com'
): Promise<SiteSettings> {
  return mutateDbState((state) => {
    const current = state.site_settings[0];
    const updated: SiteSettings = {
      ...current,
      ...patch,
      id: current.id,
      updated_at: new Date().toISOString(),
    };
    state.site_settings[0] = updated;

    appendContentRevision(state, {
      entityType: 'site_settings',
      entityId: updated.id,
      snapshot: updated as unknown as Record<string, unknown>,
      summary: `Updated site settings (theme: ${updated.theme_mode}, motion: ${updated.motion_preset})`,
      actorEmail,
    });

    appendAuditLog(state, {
      actorEmail,
      action: 'SITE_SETTINGS_UPDATED',
      entityType: 'site_settings',
      entityId: updated.id,
      entityLabel: `${updated.theme_mode} / ${updated.accent_preset} / ${updated.motion_preset}`,
    });

    return updated;
  });
}

export async function upsertAdminPageSection(
  sectionInput: Partial<PageSection> & { id: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<PageSection> {
  return mutateDbState((state) => {
    const index = state.page_sections.findIndex((s) => s.id === sectionInput.id);
    const now = new Date().toISOString();

    if (index >= 0) {
      const existing = state.page_sections[index];
      const updated: PageSection = {
        ...existing,
        ...sectionInput,
        id: existing.id,
        updated_at: now,
      };
      state.page_sections[index] = updated;

      appendContentRevision(state, {
        entityType: 'page_section',
        entityId: updated.id,
        snapshot: updated as unknown as Record<string, unknown>,
        summary: `Updated section "${updated.label}"`,
        actorEmail,
      });

      appendAuditLog(state, {
        actorEmail,
        action: 'SECTION_UPDATED',
        entityType: 'page_section',
        entityId: updated.id,
        entityLabel: updated.label,
      });

      return updated;
    } else {
      const created: PageSection = {
        id: sectionInput.id || `sec-${Date.now()}`,
        page_key: sectionInput.page_key || 'home',
        section_key: sectionInput.section_key || `chapter-${Date.now()}`,
        type: sectionInput.type || 'text-image',
        chapter_code: sectionInput.chapter_code || '09 / 09',
        label: sectionInput.label || 'New Chapter Section',
        eyebrow: sectionInput.eyebrow || '',
        heading: sectionInput.heading || 'New Section Heading',
        subheading: sectionInput.subheading || '',
        sort_order: sectionInput.sort_order ?? state.page_sections.length + 1,
        is_enabled: sectionInput.is_enabled ?? true,
        status: sectionInput.status || 'published',
        layout_preset: sectionInput.layout_preset || 'default',
        theme_preset: sectionInput.theme_preset || 'inherit',
        animation_preset: sectionInput.animation_preset || 'reveal-soft',
        settings_jsonb: sectionInput.settings_jsonb || {},
        content_jsonb: sectionInput.content_jsonb || {},
        published_at: now,
        created_at: now,
        updated_at: now,
      };
      state.page_sections.push(created);

      appendAuditLog(state, {
        actorEmail,
        action: 'SECTION_CREATED',
        entityType: 'page_section',
        entityId: created.id,
        entityLabel: created.label,
      });

      return created;
    }
  });
}

export async function deleteAdminPageSection(
  sectionId: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<void> {
  return mutateDbState((state) => {
    const target = state.page_sections.find((s) => s.id === sectionId);
    state.page_sections = state.page_sections.filter((s) => s.id !== sectionId);
    state.page_sections.forEach((sec, idx) => {
      sec.sort_order = idx + 1;
    });
    if (target) {
      appendAuditLog(state, {
        actorEmail,
        action: 'SECTION_DELETED',
        entityType: 'page_section',
        entityId: sectionId,
        entityLabel: target.label,
      });
    }
  });
}

export async function addAdminProjectImage(
  input: {
    project_id: string;
    url: string;
    alt_text: string;
    caption?: string;
    media_id?: string | null;
  },
  actorEmail = 'azmain56@gmail.com'
): Promise<ProjectImage> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const existingForProject = state.project_images.filter(
      (img) => img.project_id === input.project_id
    );
    const created: ProjectImage = {
      id: `pimg-${crypto.randomUUID().slice(0, 8)}`,
      project_id: input.project_id,
      media_id: input.media_id || null,
      url: input.url,
      alt_text: input.alt_text || 'Project gallery image',
      caption: input.caption || '',
      sort_order: existingForProject.length + 1,
      created_at: now,
    };
    state.project_images.push(created);
    appendAuditLog(state, {
      actorEmail,
      action: 'PROJECT_IMAGE_ADDED',
      entityType: 'project_image',
      entityId: created.id,
      entityLabel: created.alt_text,
    });
    return created;
  });
}

export async function deleteAdminProjectImage(
  id: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<void> {
  return mutateDbState((state) => {
    state.project_images = state.project_images.filter((img) => img.id !== id);
    appendAuditLog(state, {
      actorEmail,
      action: 'PROJECT_IMAGE_DELETED',
      entityType: 'project_image',
      entityId: id,
      entityLabel: id,
    });
  });
}

export async function reorderAdminPageSections(
  orderedIds: string[],
  actorEmail = 'azmain56@gmail.com'
): Promise<PageSection[]> {
  return mutateDbState((state) => {
    orderedIds.forEach((id, idx) => {
      const sec = state.page_sections.find((s) => s.id === id);
      if (sec) {
        sec.sort_order = idx + 1;
        sec.updated_at = new Date().toISOString();
      }
    });
    state.page_sections.sort((a, b) => a.sort_order - b.sort_order);

    appendAuditLog(state, {
      actorEmail,
      action: 'SECTIONS_REORDERED',
      entityType: 'page_section',
      entityId: 'home',
      entityLabel: 'Homepage Chapters Reordered',
    });

    return state.page_sections;
  });
}

export async function restoreAdminContentRevision(
  revisionId: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<{ restored: boolean; entityType: string; entityId: string }> {
  return mutateDbState((state) => {
    const rev = state.content_revisions.find((r) => r.id === revisionId);
    if (!rev) {
      throw new Error('Revision not found');
    }

    const snap = rev.snapshot_jsonb;
    const now = new Date().toISOString();

    if (rev.entity_type === 'page_section') {
      const idx = state.page_sections.findIndex((s) => s.id === rev.entity_id);
      if (idx >= 0) {
        state.page_sections[idx] = {
          ...state.page_sections[idx],
          ...(snap as Partial<PageSection>),
          id: state.page_sections[idx].id,
          updated_at: now,
        };
      }
    } else if (rev.entity_type === 'profile') {
      state.profiles[0] = {
        ...state.profiles[0],
        ...(snap as Partial<Profile>),
        id: state.profiles[0].id,
        updated_at: now,
      };
    } else if (rev.entity_type === 'project') {
      const idx = state.projects.findIndex((p) => p.id === rev.entity_id);
      if (idx >= 0) {
        state.projects[idx] = {
          ...state.projects[idx],
          ...(snap as Partial<Project>),
          id: state.projects[idx].id,
          updated_at: now,
        };
      }
    } else if (rev.entity_type === 'post') {
      const idx = state.posts.findIndex((p) => p.id === rev.entity_id);
      if (idx >= 0) {
        state.posts[idx] = {
          ...state.posts[idx],
          ...(snap as Partial<Post>),
          id: state.posts[idx].id,
          updated_at: now,
        };
      }
    }

    appendAuditLog(state, {
      actorEmail,
      action: 'REVISION_RESTORED',
      entityType: rev.entity_type,
      entityId: rev.entity_id,
      entityLabel: `Restored v${rev.version_number}`,
    });

    return { restored: true, entityType: rev.entity_type, entityId: rev.entity_id };
  });
}

export async function upsertAdminService(
  input: Partial<Service> & { title: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<Service> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const existingIndex = input.id
      ? state.services.findIndex((s) => s.id === input.id)
      : -1;

    const cleanSlug = slugify(input.slug || input.title);

    if (existingIndex >= 0) {
      const existing = state.services[existingIndex];
      const updated: Service = {
        ...existing,
        ...input,
        slug: cleanSlug || existing.slug,
        updated_at: now,
        published_at:
          input.status === 'published' && !existing.published_at ? now : existing.published_at,
      };
      state.services[existingIndex] = updated;

      appendAuditLog(state, {
        actorEmail,
        action: 'SERVICE_UPDATED',
        entityType: 'service',
        entityId: updated.id,
        entityLabel: updated.title,
      });
      return updated;
    } else {
      const created: Service = {
        id: input.id || `srv-${crypto.randomUUID().slice(0, 8)}`,
        slug: cleanSlug || `service-${Date.now()}`,
        number_label: input.number_label || String(state.services.length + 1).padStart(2, '0'),
        title: input.title,
        category: input.category || 'Creative Service',
        teaser: input.teaser || input.title,
        description: input.description || input.teaser || input.title,
        icon_name: input.icon_name || 'Sparkles',
        deliverables_jsonb: input.deliverables_jsonb || [],
        sub_services_jsonb: input.sub_services_jsonb || [],
        process_jsonb: input.process_jsonb || [],
        faqs_jsonb: input.faqs_jsonb || [],
        cover_media_id: input.cover_media_id || null,
        price_label: input.price_label || 'Custom Quote',
        show_price: input.show_price ?? false,
        whatsapp_template:
          input.whatsapp_template || `Hi Jahin, I would like to inquire about ${input.title}.`,
        status: input.status || 'published',
        is_visible: input.is_visible ?? true,
        featured: input.featured ?? true,
        sort_order: input.sort_order ?? state.services.length + 1,
        published_at: input.status === 'published' ? now : null,
        created_at: now,
        updated_at: now,
      };
      state.services.push(created);

      appendAuditLog(state, {
        actorEmail,
        action: 'SERVICE_CREATED',
        entityType: 'service',
        entityId: created.id,
        entityLabel: created.title,
      });
      return created;
    }
  });
}

export async function deleteAdminService(
  id: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<void> {
  return mutateDbState((state) => {
    const target = state.services.find((s) => s.id === id);
    state.services = state.services.filter((s) => s.id !== id);
    if (target) {
      appendAuditLog(state, {
        actorEmail,
        action: 'SERVICE_DELETED',
        entityType: 'service',
        entityId: id,
        entityLabel: target.title,
      });
    }
  });
}

export async function upsertAdminProject(
  input: Partial<Project> & { title: string; galleryImages?: { url: string; alt_text: string; caption?: string }[] },
  actorEmail = 'azmain56@gmail.com'
): Promise<Project> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const existingIndex = input.id
      ? state.projects.findIndex((p) => p.id === input.id)
      : -1;

    const cleanSlug = slugify(input.slug || input.title);

    let savedProject: Project;

    if (existingIndex >= 0) {
      const existing = state.projects[existingIndex];
      savedProject = {
        ...existing,
        ...input,
        slug: cleanSlug || existing.slug,
        updated_at: now,
        published_at:
          input.status === 'published' && !existing.published_at ? now : existing.published_at,
      };
      state.projects[existingIndex] = savedProject;

      appendContentRevision(state, {
        entityType: 'project',
        entityId: savedProject.id,
        snapshot: savedProject as unknown as Record<string, unknown>,
        summary: `Updated project "${savedProject.title}" (${savedProject.status})`,
        actorEmail,
      });

      appendAuditLog(state, {
        actorEmail,
        action: `PROJECT_${savedProject.status.toUpperCase()}`,
        entityType: 'project',
        entityId: savedProject.id,
        entityLabel: savedProject.title,
      });
    } else {
      savedProject = {
        id: input.id || `proj-${crypto.randomUUID().slice(0, 8)}`,
        slug: cleanSlug || `project-${Date.now()}`,
        title: input.title,
        category: input.category || 'Brand & Web Case Study',
        subcategory: input.subcategory || 'Digital Experience',
        summary: input.summary || input.title,
        client_name: input.client_name || input.title,
        client_verified: input.client_verified ?? false,
        timeline_label: input.timeline_label || 'Selected Case Study',
        role_title: input.role_title || 'Creative Developer & Designer',
        challenge: input.challenge || '',
        approach: input.approach || '',
        solution: input.solution || '',
        outcome: input.outcome || '',
        deliverables_jsonb: input.deliverables_jsonb || [],
        technologies_list: input.technologies_list || [],
        live_url: input.live_url || null,
        live_url_verified: input.live_url_verified ?? false,
        cover_media_id: input.cover_media_id || null,
        cover_url: input.cover_url || null,
        cover_alt: input.cover_alt || `${input.title} cover visual`,
        theme_backdrop: input.theme_backdrop || 'cosmic-indigo',
        status: input.status || 'draft',
        is_visible: input.is_visible ?? true,
        featured: input.featured ?? false,
        verification_note: input.verification_note || '',
        sort_order: input.sort_order ?? state.projects.length + 1,
        published_at: input.status === 'published' ? now : null,
        created_at: now,
        updated_at: now,
      };
      state.projects.push(savedProject);

      appendContentRevision(state, {
        entityType: 'project',
        entityId: savedProject.id,
        snapshot: savedProject as unknown as Record<string, unknown>,
        summary: `Created project "${savedProject.title}" (${savedProject.status})`,
        actorEmail,
      });

      appendAuditLog(state, {
        actorEmail,
        action: 'PROJECT_CREATED',
        entityType: 'project',
        entityId: savedProject.id,
        entityLabel: savedProject.title,
      });
    }

    if (Array.isArray(input.galleryImages)) {
      state.project_images = state.project_images.filter(
        (img) => img.project_id !== savedProject.id
      );
      input.galleryImages.forEach((img, idx) => {
        if (img.url && img.url.trim()) {
          state.project_images.push({
            id: `pimg-${crypto.randomUUID().slice(0, 8)}-${idx}`,
            project_id: savedProject.id,
            media_id: null,
            url: img.url.trim(),
            alt_text: img.alt_text?.trim() || `${savedProject.title} gallery image ${idx + 1}`,
            caption: img.caption?.trim() || '',
            sort_order: idx + 1,
            created_at: now,
          });
        }
      });
    }

    return savedProject;
  });
}

export async function deleteAdminProject(
  id: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<void> {
  return mutateDbState((state) => {
    const target = state.projects.find((p) => p.id === id);
    state.projects = state.projects.filter((p) => p.id !== id);
    state.project_images = state.project_images.filter((img) => img.project_id !== id);
    if (target) {
      appendAuditLog(state, {
        actorEmail,
        action: 'PROJECT_DELETED',
        entityType: 'project',
        entityId: id,
        entityLabel: target.title,
      });
    }
  });
}

export async function upsertAdminPost(
  input: Partial<Post> & { title: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<Post> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const existingIndex = input.id
      ? state.posts.findIndex((p) => p.id === input.id)
      : -1;

    const cleanSlug = slugify(input.slug || input.title);
    const sanitizedHtml = sanitizeRichHtml(input.content_html || `<p>${input.excerpt || input.title}</p>`);
    const readingTime = estimateReadingTime(sanitizedHtml);

    if (existingIndex >= 0) {
      const existing = state.posts[existingIndex];
      const updated: Post = {
        ...existing,
        ...input,
        slug: cleanSlug || existing.slug,
        content_html: sanitizedHtml,
        reading_time_minutes: readingTime,
        updated_at: now,
        published_at:
          input.status === 'published' && !existing.published_at ? now : existing.published_at,
      };
      state.posts[existingIndex] = updated;

      appendContentRevision(state, {
        entityType: 'post',
        entityId: updated.id,
        snapshot: updated as unknown as Record<string, unknown>,
        summary: `Updated article "${updated.title}" (${updated.status})`,
        actorEmail,
      });

      appendAuditLog(state, {
        actorEmail,
        action: `POST_${updated.status.toUpperCase()}`,
        entityType: 'post',
        entityId: updated.id,
        entityLabel: updated.title,
      });
      return updated;
    } else {
      const created: Post = {
        id: input.id || `post-${crypto.randomUUID().slice(0, 8)}`,
        slug: cleanSlug || `article-${Date.now()}`,
        title: input.title,
        excerpt: input.excerpt || input.title,
        content_jsonb: input.content_jsonb || {},
        content_html: sanitizedHtml,
        cover_media_id: input.cover_media_id || null,
        cover_url: input.cover_url || null,
        cover_alt: input.cover_alt || input.title,
        category_id: input.category_id || 'cat-01',
        category_name: input.category_name || 'Design & Brand Systems',
        tags_list: input.tags_list || ['Design', 'Digital Presence'],
        reading_time_minutes: readingTime,
        status: input.status || 'draft',
        is_visible: input.is_visible ?? true,
        featured: input.featured ?? false,
        scheduled_for: input.scheduled_for || null,
        timezone: input.timezone || 'Asia/Dhaka',
        published_at: input.status === 'published' ? now : null,
        seo_title: input.seo_title || `${input.title} | Jahin Azmain`,
        seo_description: input.seo_description || input.excerpt || input.title,
        created_at: now,
        updated_at: now,
      };
      state.posts.unshift(created);

      appendContentRevision(state, {
        entityType: 'post',
        entityId: created.id,
        snapshot: created as unknown as Record<string, unknown>,
        summary: `Created article "${created.title}" (${created.status})`,
        actorEmail,
      });

      appendAuditLog(state, {
        actorEmail,
        action: 'POST_CREATED',
        entityType: 'post',
        entityId: created.id,
        entityLabel: created.title,
      });
      return created;
    }
  });
}

export async function deleteAdminPost(
  id: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<void> {
  return mutateDbState((state) => {
    const target = state.posts.find((p) => p.id === id);
    state.posts = state.posts.filter((p) => p.id !== id);
    if (target) {
      appendAuditLog(state, {
        actorEmail,
        action: 'POST_DELETED',
        entityType: 'post',
        entityId: id,
        entityLabel: target.title,
      });
    }
  });
}

export async function upsertAdminSkill(
  input: Partial<Skill> & { name: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<Skill> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const idx = input.id ? state.skills.findIndex((s) => s.id === input.id) : -1;
    if (idx >= 0) {
      const updated: Skill = {
        ...state.skills[idx],
        ...input,
        updated_at: now,
      };
      state.skills[idx] = updated;
      appendAuditLog(state, {
        actorEmail,
        action: 'SKILL_UPDATED',
        entityType: 'skill',
        entityId: updated.id,
        entityLabel: updated.name,
      });
      return updated;
    } else {
      const created: Skill = {
        id: input.id || `sk-${crypto.randomUUID().slice(0, 8)}`,
        name: input.name,
        category: input.category || 'graphic-design',
        group_label: input.group_label || 'Graphic Design & Branding',
        description: input.description || input.name,
        tool_metaphor: input.tool_metaphor || 'Craft & System',
        is_verified: input.is_verified ?? true,
        is_visible: input.is_visible ?? true,
        sort_order: input.sort_order ?? state.skills.length + 1,
        created_at: now,
        updated_at: now,
      };
      state.skills.push(created);
      appendAuditLog(state, {
        actorEmail,
        action: 'SKILL_CREATED',
        entityType: 'skill',
        entityId: created.id,
        entityLabel: created.name,
      });
      return created;
    }
  });
}

export async function deleteAdminSkill(id: string, actorEmail = 'azmain56@gmail.com'): Promise<void> {
  return mutateDbState((state) => {
    const target = state.skills.find((s) => s.id === id);
    state.skills = state.skills.filter((s) => s.id !== id);
    if (target) {
      appendAuditLog(state, {
        actorEmail,
        action: 'SKILL_DELETED',
        entityType: 'skill',
        entityId: id,
        entityLabel: target.name,
      });
    }
  });
}

export async function upsertAdminExperience(
  input: Partial<Experience> & { role_title: string; organization: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<Experience> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const idx = input.id ? state.experiences.findIndex((e) => e.id === input.id) : -1;
    if (idx >= 0) {
      const updated: Experience = {
        ...state.experiences[idx],
        ...input,
        updated_at: now,
      };
      state.experiences[idx] = updated;
      appendAuditLog(state, {
        actorEmail,
        action: 'EXPERIENCE_UPDATED',
        entityType: 'experience',
        entityId: updated.id,
        entityLabel: `${updated.role_title} @ ${updated.organization}`,
      });
      return updated;
    } else {
      const created: Experience = {
        id: input.id || `exp-${crypto.randomUUID().slice(0, 8)}`,
        role_title: input.role_title,
        organization: input.organization,
        period_label: input.period_label || 'Configurable Period',
        start_date: input.start_date || null,
        end_date: input.end_date || null,
        is_current: input.is_current ?? false,
        is_verified: input.is_verified ?? true,
        summary: input.summary || '',
        highlights_jsonb: input.highlights_jsonb || [],
        status: input.status || 'published',
        is_visible: input.is_visible ?? true,
        sort_order: input.sort_order ?? state.experiences.length + 1,
        created_at: now,
        updated_at: now,
      };
      state.experiences.push(created);
      appendAuditLog(state, {
        actorEmail,
        action: 'EXPERIENCE_CREATED',
        entityType: 'experience',
        entityId: created.id,
        entityLabel: `${created.role_title} @ ${created.organization}`,
      });
      return created;
    }
  });
}

export async function deleteAdminExperience(id: string, actorEmail = 'azmain56@gmail.com'): Promise<void> {
  return mutateDbState((state) => {
    state.experiences = state.experiences.filter((e) => e.id !== id);
    appendAuditLog(state, {
      actorEmail,
      action: 'EXPERIENCE_DELETED',
      entityType: 'experience',
      entityId: id,
      entityLabel: id,
    });
  });
}

export async function upsertAdminEducation(
  input: Partial<Education> & { degree: string; institution: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<Education> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const idx = input.id ? state.education.findIndex((e) => e.id === input.id) : -1;
    if (idx >= 0) {
      const updated: Education = {
        ...state.education[idx],
        ...input,
        updated_at: now,
      };
      state.education[idx] = updated;
      appendAuditLog(state, {
        actorEmail,
        action: 'EDUCATION_UPDATED',
        entityType: 'education',
        entityId: updated.id,
        entityLabel: updated.degree,
      });
      return updated;
    } else {
      const created: Education = {
        id: input.id || `edu-${crypto.randomUUID().slice(0, 8)}`,
        degree: input.degree,
        institution: input.institution,
        field_of_study: input.field_of_study || input.degree,
        period_label: input.period_label || '2022 – 2026 (Status Pending Confirmation)',
        start_year: input.start_year ?? 2022,
        end_year: input.end_year ?? 2026,
        completion_status: input.completion_status || 'pending_verification',
        verification_note:
          input.verification_note ||
          'Completion status unconfirmed — do not label as completed until explicitly confirmed.',
        summary: input.summary || '',
        status: input.status || 'published',
        is_visible: input.is_visible ?? true,
        sort_order: input.sort_order ?? state.education.length + 1,
        created_at: now,
        updated_at: now,
      };
      state.education.push(created);
      appendAuditLog(state, {
        actorEmail,
        action: 'EDUCATION_CREATED',
        entityType: 'education',
        entityId: created.id,
        entityLabel: created.degree,
      });
      return created;
    }
  });
}

export async function deleteAdminEducation(id: string, actorEmail = 'azmain56@gmail.com'): Promise<void> {
  return mutateDbState((state) => {
    state.education = state.education.filter((e) => e.id !== id);
    appendAuditLog(state, {
      actorEmail,
      action: 'EDUCATION_DELETED',
      entityType: 'education',
      entityId: id,
      entityLabel: id,
    });
  });
}

export async function upsertAdminTestimonial(
  input: Partial<Testimonial> & { author_name: string; quote: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<Testimonial> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const idx = input.id ? state.testimonials.findIndex((t) => t.id === input.id) : -1;
    if (idx >= 0) {
      const updated: Testimonial = {
        ...state.testimonials[idx],
        ...input,
        updated_at: now,
      };
      state.testimonials[idx] = updated;
      appendAuditLog(state, {
        actorEmail,
        action: 'TESTIMONIAL_UPDATED',
        entityType: 'testimonial',
        entityId: updated.id,
        entityLabel: updated.author_name,
      });
      return updated;
    } else {
      const created: Testimonial = {
        id: input.id || `test-${crypto.randomUUID().slice(0, 8)}`,
        author_name: input.author_name,
        author_role: input.author_role || '',
        company: input.company || '',
        quote: input.quote,
        rating: input.rating ?? 5,
        project_id: input.project_id || null,
        is_verified: input.is_verified ?? false,
        verification_source: input.verification_source || '',
        status: input.status || 'draft',
        is_visible: input.is_visible ?? false,
        sort_order: input.sort_order ?? state.testimonials.length + 1,
        created_at: now,
        updated_at: now,
      };
      state.testimonials.push(created);
      appendAuditLog(state, {
        actorEmail,
        action: 'TESTIMONIAL_CREATED',
        entityType: 'testimonial',
        entityId: created.id,
        entityLabel: created.author_name,
      });
      return created;
    }
  });
}

export async function deleteAdminTestimonial(id: string, actorEmail = 'azmain56@gmail.com'): Promise<void> {
  return mutateDbState((state) => {
    state.testimonials = state.testimonials.filter((t) => t.id !== id);
    appendAuditLog(state, {
      actorEmail,
      action: 'TESTIMONIAL_DELETED',
      entityType: 'testimonial',
      entityId: id,
      entityLabel: id,
    });
  });
}

export async function upsertAdminSocialLink(
  input: Partial<SocialLink> & { platform: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<SocialLink> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const idx = state.social_links.findIndex(
      (s) => s.id === input.id || s.platform.toLowerCase() === input.platform.toLowerCase()
    );
    if (idx >= 0) {
      const updated: SocialLink = {
        ...state.social_links[idx],
        ...input,
        updated_at: now,
      };
      state.social_links[idx] = updated;
      appendAuditLog(state, {
        actorEmail,
        action: 'SOCIAL_LINK_UPDATED',
        entityType: 'social_link',
        entityId: updated.id,
        entityLabel: updated.platform,
      });
      return updated;
    } else {
      const created: SocialLink = {
        id: input.id || `soc-${crypto.randomUUID().slice(0, 8)}`,
        platform: input.platform,
        label: input.label || input.platform,
        url: input.url || '',
        icon_name: input.icon_name || 'Globe',
        is_verified: input.is_verified ?? false,
        is_visible: input.is_visible ?? false,
        sort_order: input.sort_order ?? state.social_links.length + 1,
        created_at: now,
        updated_at: now,
      };
      state.social_links.push(created);
      appendAuditLog(state, {
        actorEmail,
        action: 'SOCIAL_LINK_CREATED',
        entityType: 'social_link',
        entityId: created.id,
        entityLabel: created.platform,
      });
      return created;
    }
  });
}

export async function upsertAdminNavigationItem(
  input: Partial<NavigationItem> & { label: string; href: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<NavigationItem> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const idx = input.id ? state.navigation_items.findIndex((n) => n.id === input.id) : -1;
    if (idx >= 0) {
      const updated: NavigationItem = {
        ...state.navigation_items[idx],
        ...input,
        updated_at: now,
      };
      state.navigation_items[idx] = updated;
      appendAuditLog(state, {
        actorEmail,
        action: 'NAV_ITEM_UPDATED',
        entityType: 'navigation_item',
        entityId: updated.id,
        entityLabel: updated.label,
      });
      return updated;
    } else {
      const created: NavigationItem = {
        id: input.id || `nav-${crypto.randomUUID().slice(0, 8)}`,
        location: input.location || 'header',
        label: input.label,
        href: input.href,
        chapter_id: input.chapter_id || null,
        sort_order: input.sort_order ?? state.navigation_items.length + 1,
        is_visible: input.is_visible ?? true,
        is_external: input.is_external ?? false,
        created_at: now,
        updated_at: now,
      };
      state.navigation_items.push(created);
      appendAuditLog(state, {
        actorEmail,
        action: 'NAV_ITEM_CREATED',
        entityType: 'navigation_item',
        entityId: created.id,
        entityLabel: created.label,
      });
      return created;
    }
  });
}

export async function deleteAdminNavigationItem(id: string, actorEmail = 'azmain56@gmail.com'): Promise<void> {
  return mutateDbState((state) => {
    state.navigation_items = state.navigation_items.filter((n) => n.id !== id);
    appendAuditLog(state, {
      actorEmail,
      action: 'NAV_ITEM_DELETED',
      entityType: 'navigation_item',
      entityId: id,
      entityLabel: id,
    });
  });
}

export async function upsertAdminSeoMetadata(
  input: Partial<SeoMetadata> & { route_key: string; title: string; description: string },
  actorEmail = 'azmain56@gmail.com'
): Promise<SeoMetadata> {
  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const idx = state.seo_metadata.findIndex(
      (s) => s.id === input.id || s.route_key === input.route_key
    );
    if (idx >= 0) {
      const updated: SeoMetadata = {
        ...state.seo_metadata[idx],
        ...input,
        updated_at: now,
      };
      state.seo_metadata[idx] = updated;
      appendAuditLog(state, {
        actorEmail,
        action: 'SEO_METADATA_UPDATED',
        entityType: 'seo_metadata',
        entityId: updated.id,
        entityLabel: updated.route_key,
      });
      return updated;
    } else {
      const created: SeoMetadata = {
        id: input.id || `seo-${crypto.randomUUID().slice(0, 8)}`,
        route_key: input.route_key,
        entity_type: input.entity_type || 'page',
        entity_id: input.entity_id || null,
        title: input.title,
        description: input.description,
        og_title: input.og_title || input.title,
        og_description: input.og_description || input.description,
        og_image_url: input.og_image_url || null,
        canonical_url: input.canonical_url || input.route_key,
        noindex: input.noindex ?? false,
        schema_type: input.schema_type || 'WebPage',
        created_at: now,
        updated_at: now,
      };
      state.seo_metadata.push(created);
      appendAuditLog(state, {
        actorEmail,
        action: 'SEO_METADATA_CREATED',
        entityType: 'seo_metadata',
        entityId: created.id,
        entityLabel: created.route_key,
      });
      return created;
    }
  });
}

export async function createAdminMediaAsset(
  input: {
    filename: string;
    public_url: string;
    mime_type: string;
    size_bytes: number;
    alt_text: string;
    caption?: string;
    bucket?: 'public-media' | 'private-assets';
  },
  actorEmail = 'azmain56@gmail.com'
): Promise<MediaAsset> {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'application/pdf',
  ];
  if (!allowedMimes.includes(input.mime_type)) {
    throw new Error(`Unsupported file type: ${input.mime_type}. Allowed: JPG, PNG, WebP, AVIF, SVG, PDF.`);
  }
  if (input.size_bytes > 15 * 1024 * 1024) {
    throw new Error('File exceeds maximum allowed size of 15MB.');
  }

  return mutateDbState((state) => {
    const now = new Date().toISOString();
    const id = `media-${crypto.randomUUID().slice(0, 8)}`;
    const asset: MediaAsset = {
      id,
      filename: input.filename,
      storage_path: `${input.bucket || 'public-media'}/${Date.now()}-${input.filename}`,
      public_url: input.public_url,
      bucket: input.bucket || 'public-media',
      mime_type: input.mime_type,
      size_bytes: input.size_bytes,
      width: null,
      height: null,
      alt_text: input.alt_text || input.filename,
      caption: input.caption || '',
      uploaded_by: actorEmail,
      created_at: now,
      updated_at: now,
    };
    state.media_assets.unshift(asset);

    appendAuditLog(state, {
      actorEmail,
      action: 'MEDIA_UPLOADED',
      entityType: 'media_asset',
      entityId: asset.id,
      entityLabel: asset.filename,
    });
    return asset;
  });
}

export async function deleteAdminMediaAsset(
  id: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<void> {
  return mutateDbState((state) => {
    const asset = state.media_assets.find((m) => m.id === id);
    if (!asset) return;

    // Check if any published project, post, or profile references this media asset
    const refProject = state.projects.find(
      (p) =>
        p.status === 'published' &&
        (p.cover_media_id === id || p.cover_url === asset.public_url)
    );
    if (refProject) {
      throw new Error(
        `Cannot delete media "${asset.filename}" because it is referenced by published project "${refProject.title}".`
      );
    }

    const refGallery = state.project_images.find((img) => {
      const parent = state.projects.find((p) => p.id === img.project_id);
      return (
        parent?.status === 'published' &&
        (img.media_id === id || img.url === asset.public_url)
      );
    });
    if (refGallery) {
      throw new Error(
        `Cannot delete media "${asset.filename}" because it is used in a published project gallery.`
      );
    }

    const refPost = state.posts.find(
      (post) =>
        post.status === 'published' &&
        (post.cover_media_id === id || post.cover_url === asset.public_url)
    );
    if (refPost) {
      throw new Error(
        `Cannot delete media "${asset.filename}" because it is referenced by published article "${refPost.title}".`
      );
    }

    state.media_assets = state.media_assets.filter((m) => m.id !== id);
    appendAuditLog(state, {
      actorEmail,
      action: 'MEDIA_DELETED',
      entityType: 'media_asset',
      entityId: id,
      entityLabel: asset.filename,
    });
  });
}

export async function updateAdminContactMessage(
  id: string,
  patch: Partial<Pick<ContactMessage, 'is_read' | 'status' | 'is_spam' | 'replied_at'>>,
  actorEmail = 'azmain56@gmail.com'
): Promise<ContactMessage> {
  return mutateDbState((state) => {
    const idx = state.contact_messages.findIndex((m) => m.id === id);
    if (idx < 0) throw new Error('Message not found');
    const updated: ContactMessage = {
      ...state.contact_messages[idx],
      ...patch,
    };
    state.contact_messages[idx] = updated;
    appendAuditLog(state, {
      actorEmail,
      action: 'MESSAGE_STATUS_UPDATED',
      entityType: 'contact_message',
      entityId: id,
      entityLabel: updated.subject,
    });
    return updated;
  });
}

export async function deleteAdminContactMessage(
  id: string,
  actorEmail = 'azmain56@gmail.com'
): Promise<void> {
  return mutateDbState((state) => {
    const target = state.contact_messages.find((m) => m.id === id);
    state.contact_messages = state.contact_messages.filter((m) => m.id !== id);
    if (target) {
      appendAuditLog(state, {
        actorEmail,
        action: 'MESSAGE_DELETED',
        entityType: 'contact_message',
        entityId: id,
        entityLabel: target.subject,
      });
    }
  });
}

