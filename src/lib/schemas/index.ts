import { z } from 'zod';

export const PublishStatusSchema = z.enum(['draft', 'scheduled', 'published', 'archived']);
export type PublishStatus = z.infer<typeof PublishStatusSchema>;

export const ThemeModeSchema = z.enum(['dark', 'light']);
export type ThemeMode = z.infer<typeof ThemeModeSchema>;

export const AccentPresetSchema = z.enum(['cosmic-violet', 'classic-blue', 'editorial-gold']);
export type AccentPreset = z.infer<typeof AccentPresetSchema>;

export const MotionPresetSchema = z.enum(['off', 'subtle', 'cinematic']);
export type MotionPreset = z.infer<typeof MotionPresetSchema>;

export const AnimationPresetNameSchema = z.enum([
  'reveal-soft',
  'reveal-type',
  'parallax-depth',
  'scene-transition',
  'card-lift',
  'magnetic-cta',
  'project-rail',
  'timeline-draw',
  'story-progress',
  'page-enter',
]);
export type AnimationPresetName = z.infer<typeof AnimationPresetNameSchema>;

export const SectionTypeSchema = z.enum([
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
  'spacer',
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

// 1. AdminProfile
export const AdminProfileSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable().optional(),
  email: z.string().email(),
  role: z.enum(['owner', 'admin']).default('owner'),
  is_active: z.boolean().default(true),
  last_login_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type AdminProfile = z.infer<typeof AdminProfileSchema>;

// 2. Profile
export const ProfileSchema = z.object({
  id: z.string(),
  full_name: z.string().min(2, 'Name is required'),
  name_verification_note: z.string().default(''),
  role_title: z.string().min(2, 'Role title is required'),
  headline: z.string().min(5, 'Headline is required'),
  subheadline: z.string().min(10, 'Subheadline is required'),
  brand_statement: z.string().min(10, 'Brand statement is required'),
  short_bio: z.string().min(10, 'Short bio is required'),
  full_bio: z.string().min(20, 'Full bio is required'),
  email: z.string().email('Valid email is required'),
  whatsapp_raw: z.string().min(6, 'WhatsApp number is required'),
  whatsapp_normalized: z.string().min(8, 'Normalized WhatsApp is required'),
  location: z.string().default('Bangladesh · Remote Worldwide'),
  availability_text: z.string().default('Available for select creative & digital projects'),
  is_available: z.boolean().default(true),
  avatar_media_id: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  resume_media_id: z.string().nullable().optional(),
  resume_url: z.string().nullable().optional(),
  categories_list: z.array(z.string()).default([]),
  updated_at: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;

// 3. SiteSettings
export const SiteSettingsSchema = z.object({
  id: z.string(),
  site_name: z.string().min(2),
  tagline: z.string().min(2),
  theme_mode: ThemeModeSchema.default('dark'),
  accent_preset: AccentPresetSchema.default('cosmic-violet'),
  motion_preset: MotionPresetSchema.default('cinematic'),
  font_preset: z.enum(['geist-editorial', 'inter-clean']).default('geist-editorial'),
  enable_3d_hero: z.boolean().default(true),
  show_project_budget_field: z.boolean().default(false),
  show_service_inquiry_field: z.boolean().default(true),
  footer_heading: z.string().default("Have a Project in Mind? Let's Create Something Great."),
  footer_subtext: z.string().default('One Creative Mind. Multiple Ways to Build.'),
  copyright_name: z.string().default('Jahin Azmain'),
  analytics_enabled: z.boolean().default(false),
  updated_at: z.string(),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

// 4. NavigationItem
export const NavigationItemSchema = z.object({
  id: z.string(),
  location: z.enum(['header', 'footer_primary', 'footer_resources', 'chapter_rail']).default('header'),
  label: z.string().min(1),
  href: z.string().min(1),
  chapter_id: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
  is_external: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});
export type NavigationItem = z.infer<typeof NavigationItemSchema>;

// 5. PageSection
export const PageSectionSchema = z.object({
  id: z.string(),
  page_key: z.string().default('home'),
  section_key: z.string().min(1),
  type: SectionTypeSchema,
  chapter_code: z.string().default('01 / 08'),
  label: z.string().min(1),
  eyebrow: z.string().default(''),
  heading: z.string().min(1),
  subheading: z.string().default(''),
  sort_order: z.number().int().default(0),
  is_enabled: z.boolean().default(true),
  status: PublishStatusSchema.default('published'),
  layout_preset: z.string().default('default'),
  theme_preset: z.string().default('inherit'),
  animation_preset: AnimationPresetNameSchema.default('reveal-soft'),
  settings_jsonb: z.record(z.unknown()).default({}),
  content_jsonb: z.record(z.unknown()).default({}),
  published_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type PageSection = z.infer<typeof PageSectionSchema>;

// 6. Service
export const ServiceFaqItemSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
});
export type ServiceFaqItem = z.infer<typeof ServiceFaqItemSchema>;

export const ServiceProcessStepSchema = z.object({
  step: z.string(),
  title: z.string(),
  description: z.string(),
});
export type ServiceProcessStep = z.infer<typeof ServiceProcessStepSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  slug: z.string().min(2),
  number_label: z.string().default('01'),
  title: z.string().min(2),
  category: z.string().min(2),
  teaser: z.string().min(5),
  description: z.string().min(10),
  icon_name: z.string().default('Sparkles'),
  deliverables_jsonb: z.array(z.string()).default([]),
  sub_services_jsonb: z.array(z.string()).default([]),
  process_jsonb: z.array(ServiceProcessStepSchema).default([]),
  faqs_jsonb: z.array(ServiceFaqItemSchema).default([]),
  cover_media_id: z.string().nullable().optional(),
  price_label: z.string().nullable().optional(),
  show_price: z.boolean().default(false),
  whatsapp_template: z.string().default('Hi Jahin, I would like to discuss a project regarding:'),
  status: PublishStatusSchema.default('published'),
  is_visible: z.boolean().default(true),
  featured: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  published_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Service = z.infer<typeof ServiceSchema>;

// 7 & 8. Project & ProjectImage
export const ProjectImageSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  media_id: z.string().nullable().optional(),
  url: z.string().min(1),
  alt_text: z.string().min(1, 'Alt text is required for accessibility'),
  caption: z.string().default(''),
  sort_order: z.number().int().default(0),
  created_at: z.string(),
});
export type ProjectImage = z.infer<typeof ProjectImageSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(2),
  title: z.string().min(2),
  category: z.string().min(2),
  subcategory: z.string().default(''),
  summary: z.string().min(5),
  client_name: z.string().nullable().optional(),
  client_verified: z.boolean().default(false),
  timeline_label: z.string().default('Selected Case Study'),
  role_title: z.string().default('Creative Developer & Designer'),
  challenge: z.string().default(''),
  approach: z.string().default(''),
  solution: z.string().default(''),
  outcome: z.string().default(''),
  deliverables_jsonb: z.array(z.string()).default([]),
  technologies_list: z.array(z.string()).default([]),
  live_url: z.string().nullable().optional(),
  live_url_verified: z.boolean().default(false),
  cover_media_id: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  cover_alt: z.string().default(''),
  theme_backdrop: z.string().default('cosmic-indigo'),
  status: PublishStatusSchema.default('draft'),
  is_visible: z.boolean().default(true),
  featured: z.boolean().default(false),
  verification_note: z.string().default(''),
  sort_order: z.number().int().default(0),
  published_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Project = z.infer<typeof ProjectSchema>;

// 9 & 10. Technology & ProjectTechnology
export const TechnologySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().default('general'),
  icon_name: z.string().default('Code2'),
  is_verified: z.boolean().default(true),
  created_at: z.string(),
});
export type Technology = z.infer<typeof TechnologySchema>;

export const ProjectTechnologySchema = z.object({
  project_id: z.string(),
  technology_id: z.string(),
  sort_order: z.number().int().default(0),
});
export type ProjectTechnology = z.infer<typeof ProjectTechnologySchema>;

// 11, 12, 13, 14. Post, Category, Tag, PostTag
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  scope: z.enum(['blog', 'project', 'service']).default('blog'),
  description: z.string().default(''),
  sort_order: z.number().int().default(0),
  created_at: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const TagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  created_at: z.string(),
});
export type Tag = z.infer<typeof TagSchema>;

export const PostTagSchema = z.object({
  post_id: z.string(),
  tag_id: z.string(),
});
export type PostTag = z.infer<typeof PostTagSchema>;

export const PostSchema = z.object({
  id: z.string(),
  slug: z.string().min(2),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  content_jsonb: z.record(z.unknown()).default({}),
  content_html: z.string().min(10),
  cover_media_id: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  cover_alt: z.string().default(''),
  category_id: z.string().nullable().optional(),
  category_name: z.string().default('Design & Systems'),
  tags_list: z.array(z.string()).default([]),
  reading_time_minutes: z.number().int().default(4),
  status: PublishStatusSchema.default('draft'),
  is_visible: z.boolean().default(true),
  featured: z.boolean().default(false),
  scheduled_for: z.string().nullable().optional(),
  timezone: z.string().default('Asia/Dhaka'),
  published_at: z.string().nullable().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

// 15. Skill
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  category: z.enum(['graphic-design', 'web-development', 'digital-setup', 'content-support']),
  group_label: z.string().min(2),
  description: z.string().min(5),
  tool_metaphor: z.string().default('Vector & Grid'),
  is_verified: z.boolean().default(true),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Skill = z.infer<typeof SkillSchema>;

// 16. Experience
export const ExperienceSchema = z.object({
  id: z.string(),
  role_title: z.string().min(2),
  organization: z.string().min(2),
  period_label: z.string().min(2),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  is_verified: z.boolean().default(true),
  summary: z.string().min(5),
  highlights_jsonb: z.array(z.string()).default([]),
  status: PublishStatusSchema.default('published'),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Experience = z.infer<typeof ExperienceSchema>;

// 17. Education
export const EducationSchema = z.object({
  id: z.string(),
  degree: z.string().min(2),
  institution: z.string().min(2),
  field_of_study: z.string().min(2),
  period_label: z.string().min(2),
  start_year: z.number().int().default(2022),
  end_year: z.number().int().nullable().optional().default(2026),
  completion_status: z.enum(['in_progress', 'pending_verification', 'completed']).default('pending_verification'),
  verification_note: z.string().default('Completion status unconfirmed — do not label as completed until confirmed.'),
  summary: z.string().min(5),
  status: PublishStatusSchema.default('published'),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Education = z.infer<typeof EducationSchema>;

// 18. Testimonial
export const TestimonialSchema = z.object({
  id: z.string(),
  author_name: z.string().min(2),
  author_role: z.string().default(''),
  company: z.string().default(''),
  quote: z.string().min(10),
  rating: z.number().int().min(1).max(5).default(5),
  project_id: z.string().nullable().optional(),
  is_verified: z.boolean().default(false),
  verification_source: z.string().default(''),
  status: PublishStatusSchema.default('draft'),
  is_visible: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

// 19. SocialLink
export const SocialLinkSchema = z.object({
  id: z.string(),
  platform: z.string().min(2),
  label: z.string().min(2),
  url: z.string().default(''),
  icon_name: z.string().default('Globe'),
  is_verified: z.boolean().default(false),
  is_visible: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});
export type SocialLink = z.infer<typeof SocialLinkSchema>;

// 20. ContactMessage & Public Form Input
export const ContactSubmissionInputSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name (at least 2 characters)').max(120),
  email: z.string().trim().email('Please provide a valid email address').max(160),
  subject: z.string().trim().min(3, 'Please include a clear subject').max(180),
  service_interest: z.string().trim().max(120).optional().default(''),
  budget_range: z.string().trim().max(80).optional().default(''),
  message: z.string().trim().min(12, 'Please share at least a brief overview (12+ characters)').max(4000),
  website_honeypot: z.string().max(200).optional().default(''),
});
export type ContactSubmissionInput = z.infer<typeof ContactSubmissionInputSchema>;

export const ContactMessageSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  service_interest: z.string().nullable().optional(),
  budget_range: z.string().nullable().optional(),
  message: z.string(),
  status: z.enum(['unread', 'read', 'replied', 'archived']).default('unread'),
  is_read: z.boolean().default(false),
  is_spam: z.boolean().default(false),
  ip_hash: z.string().nullable().optional(),
  user_agent: z.string().nullable().optional(),
  replied_at: z.string().nullable().optional(),
  created_at: z.string(),
});
export type ContactMessage = z.infer<typeof ContactMessageSchema>;

// 21. MediaAsset
export const MediaAssetSchema = z.object({
  id: z.string(),
  filename: z.string().min(1),
  storage_path: z.string().min(1),
  public_url: z.string().min(1),
  bucket: z.enum(['public-media', 'private-assets']).default('public-media'),
  mime_type: z.string().min(1),
  size_bytes: z.number().int().min(0).max(15728640),
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
  alt_text: z.string().default(''),
  caption: z.string().default(''),
  uploaded_by: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

// 22. SeoMetadata
export const SeoMetadataSchema = z.object({
  id: z.string(),
  route_key: z.string().min(1),
  entity_type: z.string().default('page'),
  entity_id: z.string().nullable().optional(),
  title: z.string().min(2),
  description: z.string().min(5),
  og_title: z.string().nullable().optional(),
  og_description: z.string().nullable().optional(),
  og_image_url: z.string().nullable().optional(),
  canonical_url: z.string().nullable().optional(),
  noindex: z.boolean().default(false),
  schema_type: z.string().default('WebPage'),
  created_at: z.string(),
  updated_at: z.string(),
});
export type SeoMetadata = z.infer<typeof SeoMetadataSchema>;

// 23. ContentRevision
export const ContentRevisionSchema = z.object({
  id: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  version_number: z.number().int(),
  snapshot_jsonb: z.record(z.unknown()),
  change_summary: z.string(),
  created_by: z.string(),
  created_at: z.string(),
});
export type ContentRevision = z.infer<typeof ContentRevisionSchema>;

// 24. ActivityLog
export const ActivityLogSchema = z.object({
  id: z.string(),
  actor_id: z.string(),
  actor_email: z.string(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  entity_label: z.string(),
  metadata_jsonb: z.record(z.unknown()).default({}),
  created_at: z.string(),
});
export type ActivityLog = z.infer<typeof ActivityLogSchema>;

// Complete Database State Contract (All 24 Core Resources)
export interface OdysseyDatabaseState {
  admin_profiles: AdminProfile[];
  profiles: Profile[];
  site_settings: SiteSettings[];
  navigation_items: NavigationItem[];
  page_sections: PageSection[];
  services: Service[];
  projects: Project[];
  project_images: ProjectImage[];
  technologies: Technology[];
  project_technologies: ProjectTechnology[];
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  post_tags: PostTag[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  social_links: SocialLink[];
  contact_messages: ContactMessage[];
  media_assets: MediaAsset[];
  seo_metadata: SeoMetadata[];
  content_revisions: ContentRevision[];
  activity_logs: ActivityLog[];
}

