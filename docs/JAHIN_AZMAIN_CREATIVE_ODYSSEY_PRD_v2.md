# PRODUCT REQUIREMENTS DOCUMENT (PRD) — VERSION 2.0
# JAHIN AZMAIN — THE CREATIVE ODYSSEY
## Cinematic, Fantasy-Inspired Storytelling Portfolio + Full Content Management System

**Owner:** Jahin Azmain  
**Prepared:** 10 November 2026  
**Build environment:** Google Antigravity  
**Product class:** Production-grade full-stack portfolio, lead-generation website and private CMS  
**Language:** Public website and admin UI initially in English; architecture ready for future localization  
**Visual character:** Premium editorial design × restrained creative fantasy × sophisticated motion  
**Prior baseline:** “JAHIN AZMAIN — PREMIUM CREATIVE DEVELOPER PORTFOLIO” PRD v1.0. This document retains the baseline business features and introduces a much stronger cinematic experience.  
**Document status:** Complete implementation specification; factual items listed as “verification required” must not be asserted publicly before confirmation.

---

## 0. THE NON-NEGOTIABLE PRODUCT PROMISE

Build **two integrated products**:

1. **Public experience:** an exceptional, art-directed personal portfolio that tells Jahin's professional story through scroll-driven chapters, compelling project work, and genuine calls to action.
2. **Private admin experience:** a secure, genuinely functional content management system (CMS) controlling public text, images, pages, navigation, service records, projects, case studies, articles, theme, animation preferences, SEO, media, messages, and publication states without source-code edits.

**Never stop at a beautiful static demo.** Content edits must persist in the actual database and display on the live site. Every visible interactive element must work. All backend actions need authorization, validation, actionable feedback, and tests.

**Experience principle:** “Make scrolling feel like turning the pages of a living creative story, while keeping the actual website as clear and credible as a professional portfolio.”

**Brand line:** “Designing Visual Stories. Building Digital Experiences.”

### What “fantasy” means here

A modern metaphorical fantasy, **not** a medieval RPG, cartoon castle, game interface, or unrelated AI-art collage. The story imagery uses an *idea spark*, *floating architectural shapes*, *paper-to-pixel transformation*, *light trails*, *depth*, and *reveal*. Movement leads naturally from Jahin's identity to actual work; visuals must never obscure the services, contact channels, or project information.

### Success measures

- Lead conversion: qualified contact-form submissions, WhatsApp clicks, email clicks, and portfolio inquiries; use privacy-respecting event measurement when configured.
- Credibility: discoverable real case studies, verified testimonials when supplied, readable resume and experience.
- Publishing independence: owner can create/publish/archive/edit without developer involvement.
- Experience: smooth cinematic scrolling on capable devices; accessible readable fallback everywhere.
- Engineering quality: reliable access control, Core Web Vitals targets, mobile-first, SEO, maintainability.

---

## 1. BUILD DECISIONS: LANGUAGES, FRAMEWORKS, AI MODELS AND HOSTING

### 1.1 Languages and framework

- **TypeScript** (strict mode): all app, component, server-route, and admin logic.
- **TSX + React + Next.js App Router**: framework, routing, metadata, server rendering and optimized data fetching.
- **HTML5 semantic markup** via React components.
- **CSS / Tailwind CSS**: utility layer and custom styles for the visual system; CSS variables for theme tokens.
- **SQL / PostgreSQL**: Supabase migrations, constraints, indexes, row-level-security (RLS) policies, and database functions.
- **JSON/JSONB**: only for validated modular section configurations and rich editor documents, not as a substitute for relational entities.

Use mutually compatible **current stable versions at implementation time**, lock the working dependency versions, and document versions in the README. Do not introduce a second frontend framework.

### 1.2 Main libraries

| Responsibility | Required technology | Implementation rule |
|---|---|---|
| Design system | Tailwind CSS, shadcn/ui, Radix primitives, Lucide | Extend for an original design, not a default template |
| Scroll-driven cinematics | GSAP + ScrollTrigger | Hero/chapter timelines, pinned storytelling moments and optional desktop project rail only |
| UI motion | Motion for React | Menus, cards, page transitions, layout transitions, modals |
| Smooth scrolling | Native CSS scroll behavior first | Optional Lenis only if tested with ScrollTrigger, anchors, accessibility and focus; no hijacking |
| Optional dimensional visuals | Three.js + React Three Fiber + Drei | Lazy-load strictly as progressive enhancement, with CSS/SVG still-image fallback |
| CMS rich text | Tiptap | Sanitize and allowlist rendered content, support structured persisted JSON |
| Validation/forms | Zod + React Hook Form | Validate server-side again |
| Backend | Supabase (PostgreSQL, Auth, Storage) | Public reads limited to published data; admin writes protected |
| Testing | Vitest, Testing Library, Playwright, axe where practical | Unit, integration and browser smoke tests |
| Deployment | Commercially eligible hosting; Vercel Pro is an option | Keep hosting portable and document environment setup |

**Do not use all animation libraries to animate the same element.** Own timeline-heavy effects with GSAP; UI microinteractions with Motion. Abstract animation settings behind a shared motion system.

### 1.3 Google Antigravity agent model guidance

- **Preferred architecture/debugging model when available:** Gemini 4 Argon with High thinking.
- **Practical free-access fallback:** Gemini 3.8 Flash for routine implementation and iterative tasks.
- **Optional advanced alternative:** Claude Sonnet 5.5 (thinking) if permitted by the user's plan.
- Antigravity's currently visible model list and plan permissions may change; the owner selects from the actual model picker.
- The *coding agent model* is **not** a website runtime model. This portfolio must require **no paid AI API** to run.

### 1.4 Hosting and cost note

- Use Supabase for persistence and Auth. Free plans have limits and may pause during inactivity; provide backups and monitoring steps.
- A freelancer's lead-generating website is commercial in nature; **do not assume Vercel Hobby is eligible**. Select Vercel Pro or verify another hosting option's commercial terms.
- All domain, Supabase, OAuth/SMTP/anti-spam, and deployment credentials must be provided by the owner via secure environment configuration. Never invent keys or expose secrets in code.
- Do not promise permanently free operation, unlimited storage or scheduled publishing on unsupported free tiers.

---

## 2. VERIFIED BRAND DATA AND CONTENT GOVERNANCE

### 2.1 Brand profile

- **Public name:** Jahin Azmain (verify spelling against “Jain Azmain” before launch).
- **Role:** Creative Developer & Digital Designer.
- **Categories:** Graphic Designer, Web Developer, Data Entry Specialist, Social Media Management Specialist, Digital Business Setup Specialist.
- **Core brand statement:** “I design meaningful visual identities and build modern digital experiences that help individuals and businesses establish a stronger online presence.”
- **Homepage hero:** “Designing Visual Stories. Building Digital Experiences.”
- **Homepage subheading:** “I'm Jahin Azmain, a Graphic Designer and Web Developer creating thoughtful designs and modern digital solutions for individuals and businesses.”
- **Editable full introduction:** “Hi, I'm Jahin Azmain, a creative professional passionate about graphic design, web development, and digital solutions. I combine creativity and technical skills to transform ideas into visually engaging designs and functional digital experiences. From brand identities and social media graphics to modern websites and business page optimization, I focus on delivering professional solutions that help individuals and businesses grow online.”
- **WhatsApp:** 01647236359, normalized to `8801647236359` for WhatsApp deep links after confirming the number.
- **Email:** azmain56@gmail.com.
- **Education:** BSc in Computer Science and Engineering, 2022–2026; **completion status unconfirmed**, do not label as completed.
- **Experience:** more than one year mentioned, but exact starting date and present duration must remain configurable. Do not show an unverified year counter.
- **Social profiles:** Facebook, LinkedIn, Freelancer, Upwork, Fiverr; URLs are supplied later in admin. Do not fabricate any profile links or show empty dead links.
- **Profile photo, resume, actual project screenshots:** admin-uploaded assets; no fabricated portraits or false samples.

### 2.2 Initial project inventory

1. Safe Shop
2. Glossy Beauty Parlour
3. OTT HOUSE HOLDER
4. Bikwe Gadget
5. Hungers Restaurant Design
6. Royal Hajj BD

**Data rule:** Project names are provisional until spelling is verified. One Safe Shop entry unless the owner confirms multiple unique projects. Descriptions, client identities, deliverables, technologies, performance numbers, dates, live URLs, and images must come from owner-supplied records. Publish only complete approved items; incomplete items remain drafts. Use tasteful *designed empty states*, not fictional showcases.

### 2.3 Truth-in-marketing rules

- Only real verified testimonials may be published.
- Do not invent companies, success metrics, client feedback, awards, certifications, social-profile URLs or education status.
- Do not claim unlimited revisions, 24/7 availability, payment only after completion, or guaranteed satisfaction without explicit verification.
- Do not present “600K Facebook watch time in four days” as a guaranteed service; omit such claims pending verification and platform compliance.
- Maintain `draft / published / archived` visibility and optional owner verification flags.

---

## 3. DESIGN ART DIRECTION: “THE CREATIVE ODYSSEY”

### 3.1 Visual story

A visitor enters a quiet, dramatic canvas. A single bright point of light begins the journey. As they scroll, a constellation of creative disciplines appears: typography, a digital grid, subtle paper planes, interface fragments and abstract 3D forms. These elements resolve into **real work** — project case studies, service offerings and professional biography. The final scene resolves into a clear human invitation to collaborate.

**Emotional sequence:** Curiosity → Recognition → Immersion → Proof → Trust → Contact.

**Design references expressed as principles only:** editorial art direction; Apple-level legibility and restraint; sophisticated studio/agency motion; tactile objects; layered spatial depth. No copied layouts, brand assets, animations, copyrighted illustrations, or logos.

### 3.2 Visual rules

- Main canvas is calm, clean and readable even without JavaScript-driven motion.
- Large editorial typography, precise lines, negative space, strong grid.
- Fantastical motifs are graphical metaphors, not decorative noise.
- Prefer bespoke vector/SVG accents and owner-supplied project images. Any generated abstract artwork must not imply real client work.
- Use 1–2 dominant moving elements per scene; leave still areas for readability.
- No generic gradient blobs, infinite particle storms, gratuitous glow, irrelevant random floating cards, or long-loading intros.
- No mandatory splash screen or forced “loading 0–100%” fiction.

### 3.3 Theme palette

**Recommended dramatic launch experience: Dark Cosmic Editorial**

| Token | Dark | Light |
|---|---|---|
| Canvas | `#0B0D14` | `#F5F5F7` |
| Raised canvas | `#171A25` | `#FFFFFF` |
| Primary text | `#F6F3EB` | `#1D1D1F` |
| Secondary text | `#A7ACBD` | `#686B76` |
| Borders | `#343747` | `#E5E5EA` |
| Brand accent | `#9B8CFF` | `#6754D9` |
| Warm highlight | `#E8C998` | `#B77E45` |
| Focus outline | `#C6BDFF` | `#5F43E6` |

Use the originally specified minimalist light theme as a valid admin-selectable preset, including an optional Classic Blue (`#0071E3`) accent. The fantasy-dramatic theme is the recommended default visual direction but must not remove admin theme controls. Build contrast-safe tokens and test WCAG contrast.

**Color usage:** 75% neutrals / 15% imagery / 10% accent. Accent color indicates interaction and highlights; no rainbow gradients.

### 3.4 Typography

- Display heading: **Geist Sans** or a carefully tested premium editorial display pairing; avoid unreadable novelty fantasy typefaces.
- Body: **Inter** or Geist Sans.
- Data, chapter index, micro-labels: **Geist Mono**.
- Desktop hero text: fluid `clamp(3.5rem, 8vw, 7rem)`, not a fixed size.
- Mobile hero text: `clamp(2.65rem, 12vw, 4.5rem)` and controlled line breaks.
- Body: 16–18px desktop, at least 16px on mobile.
- Use no more than three type families; apply consistent font weights, optical alignment and line-height.

### 3.5 Grid and responsiveness

- Max width: 1280–1360px; 12/8/4-column responsive grid.
- Spacing scale: 4/8/12/16/24/32/48/64/96px.
- Card radii: 18–28px; thin borders, no heavy shadows.
- Layout targets: 360, 390, 768, 1024, 1280, 1440 and 1920px.
- Use safe viewport units (`svh`/`dvh`) as appropriate.
- No clipping, scroll traps, horizontal page overflow or off-screen primary CTAs.

---

## 4. SCROLL-DRIVEN HOME STORYBOARD — THE SIGNATURE FEATURE

**Core requirement:** scrolling down reveals the story in intentional chapters. It must feel cinematic but remain standard browser content, with anchor navigation, natural scrollbar, stable layout and reduced-motion support.

### Persistent storytelling UI

- Floating translucent navbar with JA monogram, Work, Services, About, Journal, Contact, theme toggle and contact CTA.
- Thin vertical or top-mounted **chapter progress indicator** showing current chapter (e.g., `04 / 08 — Worlds I've Built`). It must not obstruct mobile content.
- A short “Scroll to explore” affordance in the hero; it is a real anchor to the next section.
- Navigation highlights active chapter; links to dedicated pages remain accessible.
- Optional tasteful sound-free effects only. **No autoplay music/audio.**

### PROLOGUE — “The Spark” / Hero (0–100vh above the fold)

**Purpose:** Immediate identity, craft and invitation.

**Copy:**
- Eyebrow: `JAHIN AZMAIN / CREATIVE DEVELOPER & DIGITAL DESIGNER`
- Heading: `Designing Visual Stories. Building Digital Experiences.`
- Description: use approved biography/hero subheading.
- CTAs: **Explore My Work**, **Let's Work Together**, **Download Resume** (show resume button only when file exists).
- Availability indicator editable in admin.

**Art direction:** Large typographic composition with an *idea spark* in layered SVG/Canvas or extremely lightweight optional 3D behind/alongside text. Subtle concentric arcs and fine grid; a light-trace journey line. Optional owner portrait blended into a floating editorial cutout only after upload.

**Motion:** On page load, headline enters using masked line reveals (0.65–1.0s); spark glows softly and follows a bounded pointer offset on fine-pointer desktop; CTA fades/slides in. On scroll, spark travels toward the next chapter, hero visual changes scale/depth, text eases out. **Never delay readable text until animations finish.**

**Admin controls:** hero text, editorial composition preset, background, portrait, spark visibility, motion intensity, CTAs, position and section visibility.

### CHAPTER 01 — “The Story Behind the Screen” / About

- Heading: `Every Great Idea Begins Somewhere.`
- Intro: editable professional biography.
- Portrait or abstract paper-to-pixel visual; separate About page CTA.
- Scroll text reveal in groups of whole words/lines (must remain semantically accessible and selectable).
- One gently moving typography plane and animated connection lines; no giant animated paragraphs.
- Include brand statement and professional areas without fabricated life-story claims.

### CHAPTER 02 — “The Disciplines” / Services

- Heading: `One Creative Mind. Multiple Ways to Build.`
- 6 premium service portals/cards arranged in responsive editorial grid.
- Seed categories: Graphic Design & Branding; Website Design & Development; Social Media Management; Business Page Setup; LinkedIn Profile Optimization; Data Entry & Content Support.
- Each card: category number, icon/visual motif, title, summary, deliverables teaser and functional detail/quote CTA.
- Desktop: staggered card reveal, subtle magnetic hover and angle-depth via CSS transforms; scroll pin only if performance and layout justify it.
- Mobile: standard vertical cards, no hover-only required info.
- All items database-managed, drag reorder from admin.

### CHAPTER 03 — “Worlds I've Built” / Featured Work (primary showpiece)

- Heading: `Ideas Turned Into Experiences.`
- Large project showcases with cinematic covers and category/date labels.
- Desktop optional: one *contained pinned horizontal project gallery* whose progress is driven by vertical scroll. Provide visible arrow controls, keyboard access, and meaningful normal-scroll behavior.
- For mobile, touch, reduced-motion or low-end hardware: **vertical stack of project cards**, never force horizontal scroll to access content.
- On transition between projects, change an abstract themed backdrop with restrained crossfades; do not use unrelated fantasy artwork in place of actual project visuals.
- Project hover: image `scale(1.035)` with subtle clip reveal; reduced motion shows static state.
- Buttons: View Case Study / Visit Website (only if URL verified).
- Featured project array comes from CMS, not duplicated static JS data.
- If approved projects do not yet have visual assets, show a professional empty state and a CTA to browse services, not fake projects.

### CHAPTER 04 — “The Craft” / Skills & Capabilities

- Heading: `Where Creative Thinking Meets Technical Execution.`
- Segmented graphic-design / development / digital-services layout with visual tool metaphors.
- Skills appear as editable chips, labels and brief explanations; no invented tool proficiency percentages.
- Motion: restrained diagram connections and transform-based object layering tied to scroll progress; accessible list underneath.
- Include optional technologies only if user confirms they are used.

### CHAPTER 05 — “The Journey” / Experience & Education

- Heading: `The Path So Far.`
- Editorial vertical timeline, growing thin line with sequential milestone reveal.
- Education: BSc in CSE 2022–2026 with completion status **pending confirmation**, so use a neutral verified-safe date label or hide until approved.
- Experience: entries from admin only; no fake organizations, year counters or positions.
- Details link to Resume page; CV download only with uploaded file.

### CHAPTER 06 — “Field Notes & Trust” / Journal + Testimonials

- Heading: `Ideas Worth Sharing.` with latest 3 published posts.
- Blog preview cards with category, date, cover image, reading time, title and excerpt.
- Testimonials section is conditionally rendered **only when verified records exist**. Otherwise omit and let journal occupy the space.
- Motion: subtle editorial cards flipping into alignment (not literal spinning card effects); optional reading-progress reveal.

### EPILOGUE — “The Next Chapter Is Yours” / Contact

- Heading: `Have a Project in Mind? Let's Create Something Great.`
- Strong visual return of the prologue spark, now resolving into a clean contact CTA: visual narrative closure.
- CTAs: **Start a Project**, **WhatsApp Jahin**, **Email Jahin**.
- Show valid direct channels and optionally a compact contact form inline; full form on Contact page.
- Small final brand statement, direct-to-human emphasis, admin-controlled availability.
- Footer: dynamic copyright year, actual social links, key navigation, email and WhatsApp.

### Scroll storyboard implementation details

- Use **GSAP ScrollTrigger** only for scrollytelling sections where scroll position must control animation playback (`scrub`) or pin one contained element.
- Prefer native flow + Motion `whileInView`/`useScroll` for simpler reveals.
- Avoid pinning entire homepage. Use at most two substantial pinned scenes on wide desktop and validate sticky offsets.
- Avoid blanket `scroll-snap` or custom wheel interception. Never trap the user on a chapter.
- Avoid animating `width`, `height`, `top`, `left` every frame. Prefer `transform` and `opacity`.
- Any GSAP timeline must clean up on unmount, respect server/client boundaries, and refresh layout calculations after image loading and responsive changes.
- Provide accessible chapter anchor links and a skip-to-main-content control.

---

## 5. DETAILED MOTION DESIGN SYSTEM

### 5.1 Named reusable animation presets (configurable in admin)

| Preset | Desktop behavior | Mobile/reduced-motion behavior |
|---|---|---|
| `reveal-soft` | Opacity 0→1, translateY 24→0px, 0.7s | Fast opacity or instant |
| `reveal-type` | Line/word masked reveal stagger 0.05s | Static full text, optionally fade |
| `parallax-depth` | Foreground 0.7× scroll, backplane 0.2× | Disabled or very subtle |
| `scene-transition` | Image mask/crossfade and 2% scale shift | Crossfade only |
| `card-lift` | translateY −6px, subtle shadow, 0.24s | Focus state, no cursor dependency |
| `magnetic-cta` | Pointer-relative max ±7px, spring | Disabled on touch and reduced-motion |
| `project-rail` | Bounded horizontal movement tied to vertical scroll | Vertical grid |
| `timeline-draw` | Progressively scaleY decorative line | Static line |
| `story-progress` | Thin progress bar/chapter state | Simple static/updated indicator |
| `page-enter` | Mild opacity/translate 0.25–0.4s | Instant or quick fade |

### 5.2 Motion intensity selector

Admin chooses `Off / Subtle / Cinematic` as site default. Visitor OS reduced-motion preference **always overrides** it. On low-resource devices, use performance-based feature fallback rather than rendering an unusable animation.

- **Off:** no autoplay or scroll-linked movement; all content remains visible.
- **Subtle:** appearance/fade, hover state, standard mobile behavior.
- **Cinematic:** full desktop story timelines and select pinned sequences.

### 5.3 Smoothness and interaction rules

- Aim visually for 60fps on capable devices, and prioritize responsiveness over visual complexity.
- Avoid continuous animation while sections are off-screen.
- Avoid expensive blur/filter and large canvas redraws during scroll.
- Do not initialize expensive WebGL on low-power mobile or when reduced-motion is active.
- Buttons must be keyboard focusable, with visible focus state, not dependent on hover.
- Text should never be translated out of the accessibility tree or hidden when JS does not load.
- Page transitions must not delay native navigation, browser back or deep linking.

---

## 6. REQUIRED PUBLIC PAGES AND ROUTES

| Route | Purpose | Main content |
|---|---|---|
| `/` | Cinematic chapter-based homepage | Prologue through epilogue as above |
| `/about` | Credible professional story | Bio, skills, philosophy, verified timeline, profile photo |
| `/services` | Complete service catalog | Filters, categories, value, FAQs, contact CTA |
| `/services/[slug]` | Searchable individual service | Deliverables, process, gallery, optional pricing, FAQ, inquiry |
| `/projects` | Portfolio index | Real case studies, search, categories, tags, pagination |
| `/projects/[slug]` | Full case study | Challenge, role, approach, solution, gallery, tools, results if verified, CTA |
| `/blog` | Journal | Published posts, featured, categories, tags, search |
| `/blog/[slug]` | Journal article | Prose, images, TOC, share links, reading progress, related posts |
| `/resume` | Background | Education, experience, skills, optional verified CV download |
| `/contact` | Lead generation | Validated inquiry form, WhatsApp, email, actual social links |
| `not-found` | Friendly fallback | Custom 404 with working home/back links |
| `/admin/login` | Authorized access only | Secure sign-in and password reset |
| `/admin/dashboard` | CMS home | Real record stats, messages, recent activity, shortcuts |
| `/admin/...` | Protected managers | All editor modules defined below |

**Navigation:** Home, About, Services, Work, Journal, Contact. Admin may change labels, visibility, order and URLs safely.

### 6.1 Services catalog (initial editable entries)

**Graphic Design & Branding:** Logo Design; Company Logo Design; Social Media Covers; Social Media Post Design; General Graphic Design; PowerPoint Presentation Design.

**Website Design & Development:** Personal Portfolio Websites; Business Websites; Blog Websites; Responsive Website Design; Website Customization; E-commerce / Shopify Setup.

**Social Media & Business Setup:** Facebook Business Page Setup; Professional Facebook Page Optimization; Business Profile Setup; Page Branding; Cover Design; Product Post Design; WhatsApp Button Configuration; Auto-message Configuration; Social Media Management.

**LinkedIn Optimization:** Profile Creation; Profile Setup; Professional Summary Writing; SEO Optimization; About Section Writing; LinkedIn Company Page Setup.

**Content & Administrative Support:** Data Entry; Blog Writing; Presentation Preparation; Business Content Writing.

Each service has `slug`, title, category, teaser, rich description, features/deliverables, process, FAQ, optional media, visibility/order, optional approved price and WhatsApp message template.

### 6.2 Project case study requirements

- Unique readable slug; cover and multiple ordered images with captions and alt text.
- Optional live URL, validated; role, technologies, date, optional client only with consent.
- Real challenge, design decisions, deliverables, outcome and measured results only if true.
- Editorial large-image blocks, sticky section navigation on desktop, related projects.
- External links open safely with `rel="noopener noreferrer"` where appropriate.
- Filtering and search update without full document reload; URL parameters allow bookmarking.

### 6.3 Blog requirements

- Full Tiptap: heading levels, paragraph, bold, italic, underline, lists, quotes, links, code blocks, syntax highlighting, images, captions, tables, dividers.
- Draft / Scheduled / Published / Archived states; revision history and real preview.
- Publish time in a specified timezone; scheduled publishing must use a supported cron/job mechanism, and expose disabled scheduling if not configured.
- Metadata, related articles, TOC, reading-time estimate, schema markup and canonical URL.

---

## 7. ADMIN DASHBOARD — FULL CMS, NOT A MOCKUP

### 7.1 Experience design

Build a polished SaaS-like protected admin app: left desktop sidebar, searchable command-style navigation where practical, breadcrumbs, status toasts, skeleton loading, confirm dialogs, real empty states, accessibility, responsive mobile drawer, coherent light/dark theme.

**Sidebar modules (baseline must be supported):** Overview; Site Editor; Profile; Services; Projects; Blog; Skills; Experience; Education; Testimonials; Media Library; Messages Inbox; Navigation; SEO; Theme & Appearance; Social Links; Footer; Admin Security; Activity Log; General Settings.

### 7.2 Specific editability contract

The owner must be able to **create, edit, reorder, preview, show/hide, publish/archive or delete**, as applicable:

- Every homepage chapter's heading, paragraphs, image(s), section order and enabled state.
- Hero layout, image, availability, CTA labels/destinations, background and animation preset.
- Brand name, titles, biography, contact details and uploaded resume.
- Every service record, category, cover, price display state, deliverables, process and FAQs.
- Every portfolio project and case study, media gallery, tags, technologies and featured flag.
- Skills, education, experience, journal content and verified testimonials.
- Menu entries, footer groups, social channels and outbound profile links.
- Page and record metadata, SEO defaults and structured preview images.
- Color/theme/font preset, logo/favicon, button style, radii, appearance and motion intensity.
- Inbox messages read/unread, filters, delete, click-to-reply via external mail client.

### 7.3 Site Editor implementation

Use a **schema-driven modular section registry**. Page rows contain ordered, typed section instances; example section types:

`hero, editorial-intro, text-image, services-grid, projects-gallery, skills-grid, timeline, journal-preview, testimonials, stats, media-gallery, cta, contact, spacer`.

Each section has:

- `id, page_key, type, label, sort_order, is_enabled, status, layout_preset, theme_preset, animation_preset, settings_jsonb, content_jsonb, created_at, updated_at`.
- Type-specific Zod schemas and sanitized field editors.
- Safe image/media references by ID, no arbitrary script, user-injected HTML or unrestricted CSS.
- Preview content on real public components, including mobile/desktop viewport toggle.
- Undo/restore supported through content revisions; autosave to a draft rather than publishing silently.
- Publish operation is transactional and invalidates affected caches only after confirmed success.
- Admin can add only supported block types and approved layouts, not arbitrary code.

**Avoid duplicate sources of truth:** Homepage hero text and profile can be composed from either a shared global field or a section-specific field; document their ownership clearly, do not make the admin edit one place only to find the frontend reading another.

### 7.4 Workflows

**Create project:** login → Projects → New → enter title (generate editable slug) → upload media → category/tags → case study → preview → publish → confirm public URL works → optional feature on homepage.

**Edit hero:** login → Site Editor → Home → Hero → edit heading/image/CTA/preset → preview at desktop/mobile → save draft → publish → see public update.

**Publish article:** login → Blog → New → Tiptap editor → SEO and image → save draft → preview → publish or schedule if configured → confirm sitemap eligibility.

**Contact message:** visitor submits validated form → secure server processing → DB stores message → dashboard unread count increments → admin opens message, marks read, optional mailto reply.

**Archive:** published content disappears from public queries, but retained history is available privately. Soft-delete by default for reversible content; media deletion checks references.

### 7.5 Admin security and audit

- Initially a **single approved admin**. No public sign-up.
- Supabase Auth email/password; robust recovery flow; optional MFA. Never expose privilege escalation via user-editable roles.
- All `/admin/*` routes protected server-side and each mutation separately authenticated/authorized.
- Verify admin identity against locked `admin_profiles` allowed UUIDs/roles (seed securely from the owner's account), not from a client-supplied value.
- Audit create/update/delete/publish/auth-related actions with `actor_id`, entity, record, timestamp and safe metadata.
- Enforce destructive-action confirmation and clear error states.
- Rate-limit login/contact operations using feasible hosting-backed mechanisms; do not claim in-memory per-process limits are reliable at scale.

---

## 8. DATA MODEL / SUPABASE DESIGN

### 8.1 Required core tables

Preserve the 24 baseline resources:

1. `admin_profiles`
2. `profiles`
3. `site_settings`
4. `navigation_items`
5. `page_sections`
6. `services`
7. `projects`
8. `project_images`
9. `technologies`
10. `project_technologies`
11. `posts`
12. `categories`
13. `tags`
14. `post_tags`
15. `skills`
16. `experiences`
17. `education`
18. `testimonials`
19. `social_links`
20. `contact_messages`
21. `media_assets`
22. `seo_metadata`
23. `content_revisions`
24. `activity_logs`

Add supporting junction tables (such as `service_media`, `service_faqs`, `post_categories` or `project_tags`) only when required by the normalized implementation. Prefer a predictable normalized schema over unbounded opaque JSON.

### 8.2 Key record contract

- Global records: UUID primary keys, timestamps (UTC), actor references where appropriate.
- Publishable content: `status CHECK (draft, scheduled, published, archived)` plus `published_at`, `slug UNIQUE`, `is_visible`, `sort_order` and optional `featured`.
- A project has many ordered images and many technologies; a post has tags and categories.
- Every uploaded media file has mime type, size, path, caption, alt text and ownership metadata; binaries stay in Storage, not Postgres.
- Section content is JSONB conforming to strict versioned schemas; database cannot trust arbitrary client JSON.
- Contact messages are private and separate from public content; do not include message text in public analytics or activity logs.
- Useful indexes: unique slugs, `(status, published_at)`, `(is_visible, sort_order)`, `created_at`, foreign keys and search indexes as needed.
- Timestamps in database UTC, rendered in owner/visitor appropriate timezone; scheduling explicitly specifies timezone.

### 8.3 RLS policy intent

- Public `anon`/ordinary readers may SELECT **published and visible** public records only.
- Public users may NEVER SELECT drafts, private messages, admin profiles, activity logs, raw revision history or private media.
- All admin CRUD requires `auth.uid()` matching an allowlisted active admin profile; use one reusable security-definer helper only after reviewing authorization design and search path.
- Contact form should post to a **validated, rate-limited server endpoint**; message insertion occurs only after secure verification. Do not expose private message read policies or a broad public write permission.
- Files have explicit private/public bucket policy. Public published media may be served via public safe URLs; admin/private uploads require signed/private access where appropriate.
- **Supabase service-role key must exist only in server execution**, never in `NEXT_PUBLIC_*`, logs, frontend code or bundled source.
- Secure default is deny; review RLS policies with negative tests before deployment.

### 8.4 Migrations and seeding

- Numbered SQL migrations committed under `supabase/migrations`.
- Idempotent seed script with brand information, basic service categories, page sections and draft project names; ensure the scripts do not duplicate records.
- Do not seed fabricated testimonial content, fake client results, arbitrary admin credentials or public user registrations.
- Include a secure one-time admin-initialization instruction that refers to the real Supabase Auth UUID.
- Document backups/export, storage management and restore procedures.

---

## 9. FORMS, MEDIA, SEARCH, SEO AND INTEGRATIONS

### 9.1 Contact form

Fields: Name, Email, Subject, Message; optional service type and project budget only if owner enables them. Server validation with Zod, trim and size limits, spam honeypot, rate limiting, optionally CAPTCHA/Turnstile using an explicitly configured account. Success/error states must be actionable; persist message and show it in inbox. WhatsApp deep-link opens a conversation, prefilling a safe optional inquiry message; email CTA uses `mailto:`. No claim of email notifications until email integration is configured.

### 9.2 Media workflow

Multiple image upload for projects, organized Storage paths, PDF/CV upload, type/size validation, image previews, alt-text editor, captions, searchable assets, replace and safe-delete behavior. Generate thumbnails/responsive variants through supported tooling; maintain intrinsic dimensions to avoid layout shifts. If using Next.js Image with remote Supabase URLs, configure trusted remote hosts.

### 9.3 Search

Project index filters category/tag/featured and searches title/summary. Blog searches published titles/excerpts/categories. Debounce UI queries, support pagination and URL parameters. Avoid showing draft results.

### 9.4 SEO

- Server-rendered public content and metadata, dynamic titles, descriptions, OG images, canonical URL, sitemap and robots rules.
- Schema.org `Person`, `WebSite`, `Article` and `BreadcrumbList` as appropriate and grounded in actual data.
- Admin/draft/preview URLs must be `noindex`; exclude private routes from sitemap.
- Accessible heading hierarchy and informative alt text; do not use non-descriptive keyword stuffing.
- Revalidate affected routes/metadata after publishing, archive or settings changes.
- Dynamic favicon, global social-sharing card and page-specific override.

### 9.5 Privacy-respecting analytics (optional)

Track only meaningful event types (project view, CTA click, qualified form success) when privacy terms/consent are appropriate. No fabricated traffic numbers. If analytics integration is unavailable, hide dashboard traffic charts and show actual database-derived content counts only.

---

## 10. PERFORMANCE, ACCESSIBILITY AND CONTENT RESILIENCE

**Core Web Vitals goals (measured on realistic mobile/desktop):** LCP ≤2.5s; INP ≤200ms; CLS ≤0.1. Targets are objectives requiring testing, not guaranteed claims.

- Server Components by default; isolate animated client islands.
- Lazy-load optional 3D and heavyweight gallery libraries; do not block first render.
- Use appropriately compressed WebP/AVIF, thumbnails, responsive `sizes`, preloading only for actual hero image.
- Content must remain readable/visible with JS degraded, reduced motion, and unavailable WebGL.
- Respect `prefers-reduced-motion`, keyboard navigation, `:focus-visible`, skip link, proper modal focus handling, alt text and >=44px touch targets where practical.
- Meet WCAG 2.2 AA as an explicit testing goal, especially contrast, focus, animation control and reading order.
- Disable fancy pointer effects for touchscreen/coarse pointers.
- Use native browser behavior for history, anchors, wheel scrolling and back-to-top.
- When Supabase is unavailable, fail gracefully with a branded non-misleading error or cached public content; never leak database errors.
- Audit Chrome, Safari, Firefox, Edge and iOS/Android browsers.
- Maintain constant section heights only where suitable; no hardcoded devices or scroll distance dependent on one screen.

---

## 11. PAGE STRUCTURE, COMPONENT ARCHITECTURE AND CODE ORGANIZATION

Suggested code organization (adjust to framework version):

```text
src/
  app/
    (site)/
      page.tsx
      about/page.tsx
      services/page.tsx
      services/[slug]/page.tsx
      projects/page.tsx
      projects/[slug]/page.tsx
      blog/page.tsx
      blog/[slug]/page.tsx
      resume/page.tsx
      contact/page.tsx
    admin/
      login/page.tsx
      dashboard/page.tsx
      (protected)/...
    api/contact/route.ts
    sitemap.ts
    robots.ts
    not-found.tsx
  components/
    story/       # StoryChapter, HeroSpark, ChapterProgress, ProjectRail...
    portfolio/   # Cards, galleries, case-study components...
    admin/       # RecordEditor, SectionEditor, MediaPicker, Preview...
    ui/          # Accessible design-system primitives
  lib/
    supabase/    # SSR server/browser adapters
    auth/        # Server role guards
    db/          # Queries and mutations
    schemas/     # Zod schemas for every record/section
    motion/      # Motion presets and reduced-motion policy
    seo/         # Metadata and structured data
    utils/
  styles/
    globals.css
    tokens.css
  tests/
    unit/
    integration/
    e2e/
supabase/
  migrations/
  seed/
public/
  brand/
.env.example
README.md
```

**Implementation rule:** Build a single reusable rendering pathway for each public section that the Site Editor previews using the same component and schema. Public data queries must be robust to empty records; do not embed seed arrays in final production components. Use server actions/routes with explicit authorization and type-safe validation for admin edits.

---

## 12. BUILD PHASES AND HANDOFF GATES

### Phase 0 — Audit & plan

- Read this PRD in full; inspect repository and existing assets.
- Produce architecture diagram, route map, table/relationship plan, motion storyboard, dependency choices and implementation checklist.
- Identify any missing owner-controlled credentials without requesting secrets to be pasted in chat or committed.

**Gate:** plan is internally consistent; public/admin routes, seed boundaries and data ownership documented.

### Phase 1 — Foundation and original design system

- Initialize strict TypeScript Next.js App Router project; install minimal libraries and UI primitives.
- Set up tokens, fonts, component library, global layouts, nav, footer, responsive shells.
- Build an initial rendered visual slice: **hero + one narrative section + one featured project card**.

**Gate:** responsive, accessible visual slice reviewed; no generic boilerplate UI.

### Phase 2 — Public pages and scroll experience

- Build complete home storyboard and secondary pages with database-ready view contracts.
- Add animation presets and carefully bounded ScrollTrigger scenes, mobile/reduced fallbacks, page transitions.
- Implement project index, case study, services, blog, resume, contact and 404.

**Gate:** navigation/anchors/scene order responsive and accessible even when animations are off.

### Phase 3 — Persistence, policies and auth

- Supabase schema, SQL migrations, seed content, Auth, RLS, Storage buckets, server-side guards, tested contact submission.
- Connect every public page to real published content. Leave unverified projects drafts.

**Gate:** unauthorized access denied, public reads only approved records; refresh persists data.

### Phase 4 — Complete CMS

- Build all sidebar modules, editors, media manager, previews, publish/archival/revision workflow, activity logs, message inbox and theme/SEO controls.
- Add manual content updates and immediate route revalidation.

**Gate:** admin can complete every workflow with real records, without code edits.

### Phase 5 — Polish, motion, quality

- Optimize image handling and animation lifecycle; audit Core Web Vitals, transitions and Safari/mobile.
- Empty/error/loading states, form validation, protected access, metadata, accessibility, content verification warnings.

**Gate:** automated tests, manual QA and negative security tests pass.

### Phase 6 — Deploy and handoff

- Configure commercial-appropriate deployment, environment variables, domain, storage, auth redirect URLs, HTTPS, indexing, backup guidance.
- Provide complete setup and operational documentation. Where third-party access is missing, deliver clear instructions and accurately mark deployment as pending, not complete.

**Gate:** tested public deployment, secure working admin, verified forms, documented operations and rollback.

---

## 13. ACCEPTANCE TEST MATRIX (MUST PASS)

### Public experience

- [ ] Homepage follows chapter sequence; anchors navigate properly.
- [ ] Scroll story operates fluidly on desktop; mobile uses natural vertical layout.
- [ ] Reduced-motion setting disables scroll-locked and unnecessary motion.
- [ ] Prologue, chapter indicators, CTA and epilogue render even without WebGL.
- [ ] Navbar, theme toggle, mobile menu, links, project filters and galleries work.
- [ ] All public text/media come from real database records or reviewed settings.
- [ ] Drafts, incomplete/hidden content, unverified social links and testimonials do not appear.
- [ ] Project and blog slugs have working individual pages; URLs/SEO are correct.
- [ ] Contact form stores a valid message and rejects invalid/spam/rate-limited inputs.
- [ ] WhatsApp, email and verified external links work.
- [ ] Responsive at 360, 390, 768, 1024, 1440+; no horizontal overflow.

### Admin dashboard

- [ ] Admin login, logout, password reset and route protection work.
- [ ] Non-admin user cannot access admin mutations or private data.
- [ ] Hero biography, profile, CTAs, sections and ordering are editable.
- [ ] Add/edit/delete/publish/archive service, project and blog records.
- [ ] Project gallery uploads and alt text display publicly after publish.
- [ ] Draft preview works without accidentally publishing.
- [ ] Editor displays the actual public component, not an unrelated mock.
- [ ] Theme/font/accent/motion setting updates persist after hard refresh.
- [ ] Skills, timeline, verified testimonials, social, nav, footer and SEO editing work.
- [ ] Contact inbox state and database-backed overview counts are accurate.
- [ ] Media library gracefully prevents deleting referenced published media.
- [ ] Content revision restoration and destructive-action confirmation work.
- [ ] Audit logs record appropriate admin mutations without leaking secrets.

### Security, quality and deployment

- [ ] RLS denies public draft reads and all unauthorized writes.
- [ ] Private messages and logs cannot be queried by anon or ordinary users.
- [ ] Upload type, size and authorization constraints enforced server-side.
- [ ] Service-role secret not exposed to browser or public source files.
- [ ] No critical console/build/typecheck/lint errors.
- [ ] Accessibility and keyboard smoke tests pass.
- [ ] Performance recorded under realistic conditions; no critical jank.
- [ ] Documentation lists real deployment/configuration steps and any limitations.

**Required end-to-end browser proof:**

1. Sign in as owner.
2. Change hero heading, CTA and theme; publish; verify public page updates.
3. Add project with real image; preview as draft; verify invisible to public; publish; verify case-study URL and homepage featuring.
4. Write and publish blog article; verify index, details and metadata.
5. Send contact inquiry from public form; verify private dashboard inbox; mark it read.
6. Log out; attempt `/admin/dashboard` and direct admin DB write as anon; both denied.
7. Toggle reduced motion and test mobile widths; all content accessible.

---

## 14. IMPORTANT NON-GOALS AND GUARDRAILS

- No fake metrics or testimonials, no invented screenshots or credentials.
- No all-in-one huge component; no UI-only CRUD mockup or localStorage substitute for Supabase persistence.
- No compulsory AI API or paid runtime model.
- No WebGL-only navigation, forced long intro or scroll wheel hijacking.
- No arbitrary HTML/JS/CSS injection in editable sections.
- No desktop-only storytelling that breaks mobile or keyboard navigation.
- No promise of fully free commercial hosting or automatic scheduling without a supported backend job.
- No publication of education completion, professional tenure or marketing guarantees until confirmed.

---

## 15. REQUIRED SOURCE DELIVERY

1. Full maintainable Next.js + TypeScript codebase.
2. Original responsive public site, all routes and cinematic chapter flow.
3. Real authenticated admin dashboard and all CMS modules.
4. Reusable section registry, validated schemas and preview renderer.
5. Supabase migrations, RLS policies, storage bucket rules and idempotent seed data.
6. Sample environment variable file **without** secrets.
7. Admin bootstrap guide and owner content-verification checklist.
8. Unit, integration and end-to-end tests with a repeatable QA procedure.
9. SEO/sitemap, image optimization, accessibility and performance documentation.
10. README, deployment/rollback guide, backup/export steps and limitations.
11. Working content publication and cache revalidation mechanism.
12. Screenshot/video walkthrough of actual build when tool capabilities permit.

---

## 16. FINAL DEFINITION OF DONE

The product is complete **only** when the visitor gets a memorable, coherent, fast, accessible cinematic portfolio **and** Jahin can independently run the website through a secure functioning admin dashboard backed by Supabase. Beautiful visuals are necessary but not sufficient; the website must actually be manageable, searchable, publishable and deployable.

**Final positioning:**

> **JAHIN AZMAIN — THE CREATIVE ODYSSEY**  
> **A Story of Ideas, Design & Digital Experiences**  
> *One Website. One Admin Dashboard. Complete Control Over Your Digital Identity.*

**END — PRD v2.0**
