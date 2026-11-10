-- ============================================================================
-- JAHIN AZMAIN — THE CREATIVE ODYSSEY
-- Idempotent Seed Script (supabase/seed/seed.sql)
-- Strictly adheres to PRD Section 2 (Verified Brand Data & Truth-in-Marketing)
-- ============================================================================

-- 1. Seed Profile
INSERT INTO public.profiles (
  id,
  full_name,
  name_verification_note,
  role_title,
  headline,
  subheadline,
  brand_statement,
  short_bio,
  full_bio,
  email,
  whatsapp_raw,
  whatsapp_normalized,
  location,
  availability_text,
  is_available
) VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Jahin Azmain',
  'Verify preferred public spelling against "Jain Azmain" before final launch.',
  'Creative Developer & Digital Designer',
  'Designing Visual Stories. Building Digital Experiences.',
  'I''m Jahin Azmain, a Graphic Designer and Web Developer creating thoughtful designs and modern digital solutions for individuals and businesses.',
  'I design meaningful visual identities and build modern digital experiences that help individuals and businesses establish a stronger online presence.',
  'Creative professional passionate about graphic design, web development, and digital business setup.',
  'Hi, I''m Jahin Azmain, a creative professional passionate about graphic design, web development, and digital solutions. I combine creativity and technical skills to transform ideas into visually engaging designs and functional digital experiences. From brand identities and social media graphics to modern websites and business page optimization, I focus on delivering professional solutions that help individuals and businesses grow online.',
  'azmain56@gmail.com',
  '01647236359',
  '8801647236359',
  'Bangladesh · Available Worldwide',
  'Available for select creative & digital projects',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- 2. Seed Site Settings
INSERT INTO public.site_settings (
  id,
  site_name,
  tagline,
  theme_mode,
  accent_preset,
  motion_preset,
  font_preset,
  enable_3d_hero,
  show_project_budget_field,
  show_service_inquiry_field
) VALUES (
  '00000000-0000-4000-8000-000000000002',
  'Jahin Azmain — The Creative Odyssey',
  'Designing Visual Stories. Building Digital Experiences.',
  'dark',
  'cosmic-violet',
  'cinematic',
  'geist-editorial',
  TRUE,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- 3. Seed Education (Status explicitly pending confirmation per PRD Section 2.1)
INSERT INTO public.education (
  id,
  degree,
  institution,
  field_of_study,
  period_label,
  start_year,
  end_year,
  completion_status,
  verification_note,
  summary,
  status,
  is_visible,
  sort_order
) VALUES (
  '00000000-0000-4000-8000-000000000010',
  'BSc in Computer Science and Engineering',
  'University Program (CSE)',
  'Computer Science & Engineering',
  '2022 – 2026 (Completion Status Pending Confirmation)',
  2022,
  2026,
  'pending_verification',
  'PRD Rule: Do not label as completed until explicitly confirmed by owner.',
  'Academic foundation in software engineering, algorithms, web architecture, structured data systems, and human-computer interaction.',
  'published',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;

-- 4. Seed Provisional Projects (All 6 PRD projects seeded; incomplete items remain transparent/editable)
INSERT INTO public.projects (
  slug, title, category, subcategory, summary, timeline_label, role_title, challenge, approach, solution, outcome, status, is_visible, featured, verification_note, sort_order
) VALUES
  (
    'safe-shop',
    'Safe Shop',
    'E-Commerce & Brand Identity',
    'Digital Storefront & Visual System',
    'Retail and digital commerce visual identity, storefront structure, and trust-focused customer journey design.',
    'Selected Portfolio Case Study',
    'Graphic Designer & Web Developer',
    'Establishing a cohesive, trustworthy digital storefront identity and clear product presentation for online shoppers.',
    'Combined clean editorial product grids, recognizable brand iconography, and conversion-ready social & web touchpoints.',
    'Delivered a unified brand system, responsive storefront layout architecture, and promotional campaign assets.',
    'Created a structured retail presence ready for customer discovery across web and social channels.',
    'published',
    TRUE,
    TRUE,
    'Verify final client screenshots and live URL before enabling external link.',
    1
  ),
  (
    'glossy-beauty-parlour',
    'Glossy Beauty Parlour',
    'Brand Identity & Social Presence',
    'Beauty & Lifestyle Branding',
    'Refined visual identity, service menu presentation, and social media page optimization for a modern beauty studio.',
    'Selected Portfolio Case Study',
    'Brand & Digital Setup Specialist',
    'Communicating elegance, service clarity, and booking accessibility across digital and social platforms.',
    'Crafted warm editorial typography, cohesive social post templates, cover systems, and direct WhatsApp inquiry flows.',
    'Delivered complete brand visuals, optimized business page structure, and client-ready promotional graphics.',
    'Elevated visual consistency and streamlined client appointment inquiries.',
    'published',
    TRUE,
    TRUE,
    'Verify approved gallery images in Admin > Projects.',
    2
  ),
  (
    'ott-house-holder',
    'OTT HOUSE HOLDER',
    'Digital Brand & Media',
    'Social Media & Digital Setup',
    'High-contrast entertainment brand identity, social media visual system, and automated customer inquiry setup.',
    'Selected Portfolio Case Study',
    'Graphic Designer & Social Media Specialist',
    'Standing out in a crowded digital media space while guiding subscribers through clear service options.',
    'Developed bold dark-mode graphic templates, structured product post series, and instant messaging response flows.',
    'Produced logo suite, cover graphics, social post series, and business page configuration.',
    'Established a recognizable digital media identity with streamlined customer messaging.',
    'published',
    TRUE,
    TRUE,
    'Provisional project title — confirm final spelling and screenshots in Admin.',
    3
  ),
  (
    'bikwe-gadget',
    'Bikwe Gadget',
    'Tech Retail & Web Presence',
    'Product Showcase & Branding',
    'Modern consumer technology branding, product launch graphics, and digital catalog presentation.',
    'Selected Portfolio Case Study',
    'Creative Designer & Web Specialist',
    'Presenting technical product specifications and gadget collections in a clean, scannable visual format.',
    'Designed modular product highlight cards, consistent brand badges, and mobile-first catalog layouts.',
    'Delivered brand visual kit, product showcase templates, and digital page optimization.',
    'Improved visual clarity across product launches and social catalog posts.',
    'published',
    TRUE,
    TRUE,
    'Provisional spelling ("Bikwe Gadget") — verify exact client spelling in Admin.',
    4
  ),
  (
    'hungers-restaurant-design',
    'Hungers Restaurant Design',
    'Hospitality & Visual Design',
    'Menu, Social & Brand Identity',
    'Appetite-driven visual identity, promotional campaign graphics, and social presence for a modern food brand.',
    'Selected Portfolio Case Study',
    'Graphic Designer',
    'Translating culinary warmth and menu variety into cohesive digital and print-ready visual storytelling.',
    'Used rich editorial color hierarchy, structured typography for menu items, and engaging social promotional series.',
    'Delivered brand identity assets, social media campaign graphics, and digital page branding.',
    'Provided a cohesive visual system for promotional campaigns and daily customer engagement.',
    'published',
    TRUE,
    TRUE,
    'Provisional title — attach final high-resolution artwork via Media Library.',
    5
  ),
  (
    'royal-hajj-bd',
    'Royal Hajj BD',
    'Service Organization & Web',
    'Corporate Identity & Digital Presence',
    'Dignified organizational branding, informational clarity, and trustworthy digital presence for pilgrimage services.',
    'Selected Portfolio Case Study',
    'Graphic Designer & Digital Setup Specialist',
    'Designing a respectful, clear, and accessible information architecture for families and pilgrims seeking guidance.',
    'Prioritized high-legibility typography, warm gold-and-slate heritage accents, and clear package communication.',
    'Delivered organizational branding, informational banners, and structured business page setup with direct WhatsApp contact.',
    'Built a credible, easy-to-navigate digital presence for pilgrim inquiries.',
    'published',
    TRUE,
    TRUE,
    'Verify optional live URL and approved imagery in Admin.',
    6
  )
ON CONFLICT (slug) DO NOTHING;

