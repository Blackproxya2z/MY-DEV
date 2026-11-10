# COPY INTO GOOGLE ANTIGRAVITY — MASTER BUILD PROMPT

You are a **principal full-stack engineer, creative director, motion designer, accessibility specialist, database architect and QA lead**. Build a real production-grade website for **Jahin Azmain** named **THE CREATIVE ODYSSEY**.

**FIRST, read every section of the attached `JAHIN_AZMAIN_CREATIVE_ODYSSEY_PRD_v2.md`. That PRD is authoritative.** Do not silently drop any features or replace its requirements with a simple portfolio template.

## PRIMARY MISSION

Create a premium, visually distinctive **fantasy-inspired storytelling portfolio** that unfolds through **vertical scrolling** and a secure, complete **Supabase-backed admin CMS** that lets the owner control all meaningful public content without editing code.

The public website should feel like an elegant interactive creative world: a small luminous **idea spark**, refined typography, paper-to-pixel metaphors, sophisticated layers, editorial service reveals, cinematic case-study transitions and a final contact scene. Aim for artistry and restraint; **avoid gaming UI, clichéd fantasy castles, generic gradient blobs, endless particles, and fake work examples**.

The business and personal data (brand, contact, provisional projects, services, education status and truth-in-marketing rules) in the PRD are mandatory. Do not fabricate client testimonials, stats, technologies, portfolios, URLs or academic status.

## USE THIS STACK

- Google Antigravity coding environment.
- TypeScript (strict), Next.js App Router, React, semantic HTML, Tailwind CSS, design tokens.
- shadcn/ui, accessible Radix primitives, Lucide.
- **GSAP + ScrollTrigger** for scroll-scrubbed narrative sequences and one bounded desktop project rail.
- **Motion for React** for entry/exit, hover and microinteraction states.
- Optional lazy-loaded Three.js + React Three Fiber for a performance-safe hero motif; **CSS/SVG fallback is required**.
- Supabase PostgreSQL, Auth, Storage, SSR integration, SQL migrations, RLS.
- Tiptap rich-text editing, Zod, React Hook Form.
- Vitest/Testing Library and Playwright browser tests.
- Compatible stable package versions; avoid unnecessary dependencies. No paid runtime AI API.

## DESIGN DETAILS

Use the PRD's art direction: **Dark Cosmic Editorial** with `#0B0D14` main background, warm-ivory typography `#F6F3EB`, violet `#9B8CFF` accent and warm-gold `#E8C998` highlights, plus a fully working bright editorial theme selectable by the owner. Geist/Inter/Geist Mono typography, 12-column grid, whitespace, strong visual hierarchy and 360px-to-desktop responsiveness.

The home page chapter order is:

1. **Prologue — The Spark**: full-height statement, subtle luminous motif, three working CTAs.
2. **The Story Behind the Screen**: narrative about Jahin with line-reveal text and biography.
3. **The Disciplines**: six editable services in premium animated editorial cards.
4. **Worlds I've Built**: real project case studies, optional desktop pinned horizontal gallery; normal vertical mobile fallback.
5. **The Craft**: skills and disciplines, without fabricated experience percentages.
6. **The Journey**: editable professional/education timeline; do not say the BSc has been completed until confirmed.
7. **Field Notes & Trust**: real published blog posts, verified testimonials only.
8. **Epilogue — The Next Chapter Is Yours**: compelling contact CTA and forms.

Include a working navbar, chapter progress indicator, accessible anchors, theme toggle, mobile menu, portfolio filters and real project detail pages.

**Motion must be high-quality, not heavy.** Use transforms and opacity, `prefers-reduced-motion`, reduced motion override in the CMS, keyboard accessibility, no scroll hijacking, mobile fallbacks and no forced preload. Reserve pinned/scrubbed scenes for moments with storytelling value. Validate animation cleanup on route changes.

## FULL PUBLIC FEATURE SET

Implement all PRD routes: `/`, `/about`, `/services`, `/services/[slug]`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/resume`, `/contact`, 404. Projects must have real category filters/search, ordered media galleries and case studies. Blog must support article pages, SEO, rich text and draft/publish lifecycle. Contact form must validate, block basic spam, securely persist to Supabase and display in admin inbox. WhatsApp/email CTAs must work.

## FULL ADMIN FEATURE SET — NON-OPTIONAL

Implement `/admin/login` and authorized `/admin/dashboard`. Build true CRUD + persistent storage for: Overview, Site Editor, Profile, Services, Projects, Blog, Skills, Experience, Education, Testimonials, Media Library, Messages Inbox, Navigation, SEO, Theme & Appearance, Social Links, Footer, Admin Security, Activity Log, General Settings.

**Mandatory proof flows:**

- Edit homepage hero copy/image, reorder/hide sections, preview, publish, hard-refresh and verify public update.
- Upload an image and create a project draft; preview privately; publish; see it in portfolio and its unique detail route.
- Create/publish a blog article with Tiptap and SEO metadata.
- Add/edit services and FAQs; update theme tokens and motion preset.
- Submit a genuine contact form message; see it as unread in protected admin inbox.
- Attempt unauthorized admin access and direct DB write; must be blocked by server-side guards and RLS.

No UI-only forms, no localStorage pseudo-CMS, no decorative buttons or hard-coded content arrays after data integration. Use one schema-driven page-section renderer for both published pages and admin previews. Build real revision history where specified.

## SECURITY AND DATA

Implement all database tables and relationships in the PRD, secure Supabase Auth, allowlisted admin profile, RLS on every exposed table, sanitized editor output, file type/size restrictions, server-side validation, reliable rate limiting where configured, private inbox and logs. Public reads see published approved content only. Never expose service-role or secret environment variables in the browser. Supply numbered SQL migrations, idempotent seed script and `.env.example` without secrets. No public admin registration.

## HOW TO EXECUTE

1. **Inspect the repository and assets**, read the PRD and write a concise architectural plan, route map, DB outline, component tree, storyboard and implementation checklist.
2. **Build the original design-system and a polished vertical slice** (hero, one narrative section, one work card). Validate mobile and visual quality, then continue.
3. Implement complete public routes and chapter animation with accessible fallbacks.
4. Build Supabase schema/Auth/RLS/Storage and replace mock props with real persistent queries.
5. Build all admin modules and publication workflows; connect CMS changes to real frontend rendering and cache revalidation.
6. Write tests, run them, fix errors, audit performance/accessibility/security, and document deployment.

Do not stop after planning or a frontend demo. Keep implementing all feasible work. If external keys, database project or hosting credentials are missing, **do not invent or commit them**; implement the integration and provide a precise one-time setup checklist while explicitly reporting which runtime tests require those credentials. Do not claim untested or unconfigured features work.

## QUALITY GATES

- Run `typecheck`, lint, production build, meaningful unit tests and Playwright smoke tests (or document exact execution blockers).
- Verify 360/390/768/1024/1440px screens, touch behavior, keyboard navigation, Safari-compatible fallback, and reduced-motion.
- Target LCP <=2.5s, INP <=200ms, CLS <=0.1 and document measurements instead of promising results.
- Provide a final project tree, setup instructions, schema/migrations, test outcomes, demo instructions, any remaining limitations, and deployment steps for commercially appropriate hosting.
- Never say "done" until all acceptance criteria in the PRD are tested, or clearly label unfinished items.

**START NOW: Read the PRD, inspect the codebase, create the task plan and implement the complete project.**
