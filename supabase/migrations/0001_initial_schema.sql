-- ============================================================================
-- JAHIN AZMAIN — THE CREATIVE ODYSSEY
-- Migration 0001: Complete Core Relational Schema (24 Core Tables + Indexes)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper function to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 1. admin_profiles (Allowlisted Owner/Admin Identity)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. media_assets (Declared before foreign key references in profiles/projects/posts/services)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'public-media' CHECK (bucket IN ('public-media', 'private-assets')),
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0 AND size_bytes <= 15728640),
  width INT,
  height INT,
  alt_text TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. profiles (Public Brand & Owner Profile)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL DEFAULT 'Jahin Azmain',
  name_verification_note TEXT NOT NULL DEFAULT 'Verify spelling against Jain Azmain before public launch.',
  role_title TEXT NOT NULL DEFAULT 'Creative Developer & Digital Designer',
  headline TEXT NOT NULL DEFAULT 'Designing Visual Stories. Building Digital Experiences.',
  subheadline TEXT NOT NULL DEFAULT 'I''m Jahin Azmain, a Graphic Designer and Web Developer creating thoughtful designs and modern digital solutions for individuals and businesses.',
  brand_statement TEXT NOT NULL DEFAULT 'I design meaningful visual identities and build modern digital experiences that help individuals and businesses establish a stronger online presence.',
  short_bio TEXT NOT NULL,
  full_bio TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT 'azmain56@gmail.com',
  whatsapp_raw TEXT NOT NULL DEFAULT '01647236359',
  whatsapp_normalized TEXT NOT NULL DEFAULT '8801647236359',
  location TEXT NOT NULL DEFAULT 'Bangladesh (Remote Worldwide)',
  availability_text TEXT NOT NULL DEFAULT 'Available for select creative & digital projects',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  avatar_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  resume_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  categories_list JSONB NOT NULL DEFAULT '["Graphic Designer", "Web Developer", "Data Entry Specialist", "Social Media Management Specialist", "Digital Business Setup Specialist"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. site_settings (Global Theme, Motion, Typography, Form & Operational Flags)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Jahin Azmain — The Creative Odyssey',
  tagline TEXT NOT NULL DEFAULT 'Designing Visual Stories. Building Digital Experiences.',
  theme_mode TEXT NOT NULL DEFAULT 'dark' CHECK (theme_mode IN ('dark', 'light')),
  accent_preset TEXT NOT NULL DEFAULT 'cosmic-violet' CHECK (accent_preset IN ('cosmic-violet', 'classic-blue', 'editorial-gold')),
  motion_preset TEXT NOT NULL DEFAULT 'cinematic' CHECK (motion_preset IN ('off', 'subtle', 'cinematic')),
  font_preset TEXT NOT NULL DEFAULT 'geist-editorial' CHECK (font_preset IN ('geist-editorial', 'inter-clean')),
  enable_3d_hero BOOLEAN NOT NULL DEFAULT TRUE,
  show_project_budget_field BOOLEAN NOT NULL DEFAULT FALSE,
  show_service_inquiry_field BOOLEAN NOT NULL DEFAULT TRUE,
  footer_heading TEXT NOT NULL DEFAULT 'Have a Project in Mind? Let''s Create Something Great.',
  footer_subtext TEXT NOT NULL DEFAULT 'One Creative Mind. Multiple Ways to Build.',
  copyright_name TEXT NOT NULL DEFAULT 'Jahin Azmain',
  analytics_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. navigation_items (Header, Chapter Anchors, and Footer Links)
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL DEFAULT 'header' CHECK (location IN ('header', 'footer_primary', 'footer_resources', 'chapter_rail')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  chapter_id TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  is_external BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. page_sections (Schema-Driven Modular Page & Chapter Sections)
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL DEFAULT 'home',
  section_key TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'hero',
    'editorial-intro',
    'text-image',
    'services-grid',
    'projects-gallery',
    'skills-grid',
    'timeline',
    'journal-preview',
    'testimonials',
    'stats',
    'media-gallery',
    'cta',
    'contact',
    'spacer'
  )),
  chapter_code TEXT,
  label TEXT NOT NULL,
  eyebrow TEXT NOT NULL DEFAULT '',
  heading TEXT NOT NULL,
  subheading TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  layout_preset TEXT NOT NULL DEFAULT 'default',
  theme_preset TEXT NOT NULL DEFAULT 'inherit',
  animation_preset TEXT NOT NULL DEFAULT 'reveal-soft',
  settings_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (page_key, section_key)
);

-- 6. services (Disciplines & Service Offerings)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  number_label TEXT NOT NULL DEFAULT '01',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  teaser TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Sparkles',
  deliverables_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
  sub_services_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
  process_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  price_label TEXT,
  show_price BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_template TEXT NOT NULL DEFAULT 'Hi Jahin, I would like to inquire about your service:',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. projects (Portfolio Case Studies)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL,
  client_name TEXT,
  client_verified BOOLEAN NOT NULL DEFAULT FALSE,
  timeline_label TEXT NOT NULL DEFAULT 'Provisional Portfolio Entry',
  role_title TEXT NOT NULL DEFAULT 'Creative Developer & Designer',
  challenge TEXT NOT NULL DEFAULT '',
  approach TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  outcome TEXT NOT NULL DEFAULT '',
  deliverables_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
  live_url TEXT,
  live_url_verified BOOLEAN NOT NULL DEFAULT FALSE,
  cover_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  cover_url TEXT,
  cover_alt TEXT NOT NULL DEFAULT '',
  theme_backdrop TEXT NOT NULL DEFAULT 'cosmic-indigo',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  verification_note TEXT NOT NULL DEFAULT 'Provisional project title — verify spelling, deliverables, and visual assets before publishing.',
  sort_order INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. project_images (Ordered Case-Study Media Gallery)
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. technologies (Tools, Stack & Platforms)
CREATE TABLE IF NOT EXISTS public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'general',
  icon_name TEXT NOT NULL DEFAULT 'Code2',
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. project_technologies (Project <-> Technology Junction)
CREATE TABLE IF NOT EXISTS public.project_technologies (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES public.technologies(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, technology_id)
);

-- 12. categories (Journal & Portfolio Categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  scope TEXT NOT NULL DEFAULT 'blog' CHECK (scope IN ('blog', 'project', 'service')),
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. posts (Journal / Field Notes Articles)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_html TEXT NOT NULL DEFAULT '',
  cover_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  cover_url TEXT,
  cover_alt TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL DEFAULT 'Design & Systems',
  reading_time_minutes INT NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  scheduled_for TIMESTAMPTZ,
  timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. tags (Content Tags)
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. post_tags (Post <-> Tag Junction)
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 15. skills (The Craft — Capabilities without fabricated percentages)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('graphic-design', 'web-development', 'digital-setup', 'content-support')),
  group_label TEXT NOT NULL,
  description TEXT NOT NULL,
  tool_metaphor TEXT NOT NULL DEFAULT 'Vector & Grid',
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. experiences (Professional Timeline)
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_title TEXT NOT NULL,
  organization TEXT NOT NULL,
  period_label TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  summary TEXT NOT NULL,
  highlights_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. education (Academic Timeline with Strict Completion Verification Flag)
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  period_label TEXT NOT NULL DEFAULT '2022 – 2026',
  start_year INT NOT NULL DEFAULT 2022,
  end_year INT DEFAULT 2026,
  completion_status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (completion_status IN ('in_progress', 'pending_verification', 'completed')),
  verification_note TEXT NOT NULL DEFAULT 'Completion status unconfirmed — do not label as completed until explicitly confirmed by owner.',
  summary TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. testimonials (Strict Verified-Only Client Feedback)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_source TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_visible BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. social_links (Verified Outbound Profiles Only)
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'Globe',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. contact_messages (Private Lead Inbox)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  service_interest TEXT,
  budget_range TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_spam BOOLEAN NOT NULL DEFAULT FALSE,
  ip_hash TEXT,
  user_agent TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. seo_metadata (Per-Route & Per-Entity SEO Overrides)
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_key TEXT NOT NULL UNIQUE,
  entity_type TEXT NOT NULL DEFAULT 'page',
  entity_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  noindex BOOLEAN NOT NULL DEFAULT FALSE,
  schema_type TEXT NOT NULL DEFAULT 'WebPage',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. content_revisions (Snapshot History & Undo/Restore)
CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  version_number INT NOT NULL DEFAULT 1,
  snapshot_jsonb JSONB NOT NULL,
  change_summary TEXT NOT NULL DEFAULT 'Content revision saved',
  created_by TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. activity_logs (Immutable Security & CMS Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL DEFAULT 'owner',
  actor_email TEXT NOT NULL DEFAULT 'azmain56@gmail.com',
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_label TEXT NOT NULL DEFAULT '',
  metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_page_sections_page_order ON public.page_sections (page_key, is_enabled, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_status_order ON public.services (status, is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_status_order ON public.projects (status, is_visible, featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_posts_status_pub ON public.posts (status, is_visible, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_cat_order ON public.skills (category, is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON public.testimonials (status, is_visible, is_verified, sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (is_read, is_spam, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revisions_entity ON public.content_revisions (entity_type, entity_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs (created_at DESC);

