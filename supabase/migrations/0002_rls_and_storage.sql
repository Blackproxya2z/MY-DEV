-- ============================================================================
-- JAHIN AZMAIN — THE CREATIVE ODYSSEY
-- Migration 0002: Row Level Security (RLS) Policies & Storage Rules
-- ============================================================================

-- Security-definer helper verifying that the current user is an active allowlisted admin
CREATE OR REPLACE FUNCTION public.is_allowed_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    WHERE ap.user_id = auth.uid()
      AND ap.is_active = TRUE
      AND ap.role IN ('owner', 'admin')
  );
$$;

-- Enable RLS across all 24 tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. PUBLIC READ POLICIES (Published & Approved Content Only)
-- ============================================================================

CREATE POLICY "Public read profiles" ON public.profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read site_settings" ON public.site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read visible navigation_items" ON public.navigation_items
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Public read published enabled page_sections" ON public.page_sections
  FOR SELECT USING (is_enabled = TRUE AND status = 'published');

CREATE POLICY "Public read published visible services" ON public.services
  FOR SELECT USING (status = 'published' AND is_visible = TRUE);

CREATE POLICY "Public read published visible projects" ON public.projects
  FOR SELECT USING (status = 'published' AND is_visible = TRUE);

CREATE POLICY "Public read project_images for published projects" ON public.project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_images.project_id
        AND p.status = 'published'
        AND p.is_visible = TRUE
    )
  );

CREATE POLICY "Public read verified technologies" ON public.technologies
  FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Public read project_technologies" ON public.project_technologies
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read published visible posts" ON public.posts
  FOR SELECT USING (status = 'published' AND is_visible = TRUE);

CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read tags" ON public.tags
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read post_tags" ON public.post_tags
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read visible verified skills" ON public.skills
  FOR SELECT USING (is_visible = TRUE AND is_verified = TRUE);

CREATE POLICY "Public read published visible experiences" ON public.experiences
  FOR SELECT USING (status = 'published' AND is_visible = TRUE AND is_verified = TRUE);

CREATE POLICY "Public read published visible education" ON public.education
  FOR SELECT USING (status = 'published' AND is_visible = TRUE);

-- CRITICAL TRUTH-IN-MARKETING GATE: Public can ONLY read verified published testimonials
CREATE POLICY "Public read verified published testimonials only" ON public.testimonials
  FOR SELECT USING (status = 'published' AND is_visible = TRUE AND is_verified = TRUE);

-- CRITICAL TRUTH-IN-MARKETING GATE: Public can ONLY read verified non-empty social links
CREATE POLICY "Public read verified visible social_links only" ON public.social_links
  FOR SELECT USING (is_visible = TRUE AND is_verified = TRUE AND length(trim(url)) > 0);

CREATE POLICY "Public read public-media bucket assets" ON public.media_assets
  FOR SELECT USING (bucket = 'public-media');

CREATE POLICY "Public read seo_metadata" ON public.seo_metadata
  FOR SELECT USING (TRUE);

-- NOTE: NO public read policies exist for:
-- - admin_profiles
-- - contact_messages
-- - content_revisions
-- - activity_logs
-- Anonymous and non-admin users are completely denied access to those tables.

-- ============================================================================
-- 2. ADMIN FULL CRUD POLICIES (Allowlisted Active Admin Only)
-- ============================================================================

CREATE POLICY "Admin full access admin_profiles" ON public.admin_profiles
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access profiles" ON public.profiles
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access site_settings" ON public.site_settings
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access navigation_items" ON public.navigation_items
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access page_sections" ON public.page_sections
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access services" ON public.services
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access projects" ON public.projects
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access project_images" ON public.project_images
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access technologies" ON public.technologies
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access project_technologies" ON public.project_technologies
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access posts" ON public.posts
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access categories" ON public.categories
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access tags" ON public.tags
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access post_tags" ON public.post_tags
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access skills" ON public.skills
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access experiences" ON public.experiences
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access education" ON public.education
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access testimonials" ON public.testimonials
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access social_links" ON public.social_links
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access contact_messages" ON public.contact_messages
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access media_assets" ON public.media_assets
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access seo_metadata" ON public.seo_metadata
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access content_revisions" ON public.content_revisions
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

CREATE POLICY "Admin full access activity_logs" ON public.activity_logs
  FOR ALL USING (public.is_allowed_admin()) WITH CHECK (public.is_allowed_admin());

