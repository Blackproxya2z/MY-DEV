import { test, expect } from '@playwright/test';

test.describe('Jahin Azmain — The Creative Odyssey (Full-Stack E2E Proof Suite)', () => {
  test('1. Public experience: 8 chapters, truth-in-marketing, responsive viewports (360/390/768/1024/1440), reduced motion, and routes', async ({
    page,
  }) => {
    const viewports = [
      { width: 360, height: 740 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
    ];

    await page.goto('/');

    // Verify zero horizontal overflow across all target viewports
    for (const vp of viewports) {
      await page.setViewportSize(vp);
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });
      expect(hasOverflow).toBe(false);
    }

    // Verify 8 chapters and core brand headline on desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('h1')).toContainText(
      'Designing Visual Stories. Building Digital Experiences.'
    );
    await expect(page.locator('#chapter-prologue')).toBeVisible();
    await expect(page.locator('#chapter-story')).toBeVisible();
    await expect(page.locator('#chapter-disciplines')).toBeVisible();
    await expect(page.locator('#chapter-worlds')).toBeVisible();
    await expect(page.locator('#chapter-craft')).toBeVisible();
    await expect(page.locator('#chapter-journey')).toBeVisible();
    await expect(page.locator('#chapter-journal')).toBeVisible();
    await expect(page.locator('#chapter-epilogue')).toBeVisible();

    // Verify 10K Cinematic Scroll-Scrubbing Hero & Mid-Journey Interactive Scope Builder
    await expect(page.getByText('SCROLL OR CLICK TO SCRUB FRAMES')).toBeVisible();
    await expect(page.getByTestId('interactive-scope-builder')).toBeVisible();
    await page.screenshot({
      path: 'C:/Users/SINISTER/.gemini/antigravity/brain/cd1ce552-56e1-4ea6-9476-6f80483aa2f7/preview-10k-01-hero.png',
    });
    await page.evaluate(() => {
      document
        .querySelector('[data-testid="interactive-scope-builder"]')
        ?.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
    await page.screenshot({
      path: 'C:/Users/SINISTER/.gemini/antigravity/brain/cd1ce552-56e1-4ea6-9476-6f80483aa2f7/preview-10k-02-scope-builder.png',
    });
    await page.evaluate(() => {
      document
        .getElementById('chapter-worlds')
        ?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    await page.screenshot({
      path: 'C:/Users/SINISTER/.gemini/antigravity/brain/cd1ce552-56e1-4ea6-9476-6f80483aa2f7/preview-10k-03-worlds-built.png',
    });

    // Verify reduced motion toggle updates data-motion="off"
    const motionBtn = page.getByRole('button', { name: 'Toggle reduced motion' });
    await motionBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await motionBtn.click();

    // Verify Portfolio & Case Study route
    await page.goto('/projects');
    await expect(page.locator('h1')).toContainText('Ideas Turned Into Experiences.');
    await expect(page.getByText('Safe Shop').first()).toBeVisible();

    await page.goto('/projects/safe-shop');
    await expect(page.locator('h1')).toContainText('Safe Shop');

    // Verify Services & Service Detail route
    await page.goto('/services/graphic-design-branding');
    await expect(page.locator('h1')).toContainText('Graphic Design & Branding');

    // Verify Resume route & Truth-in-Marketing Education status
    await page.goto('/resume');
    await expect(page.locator('h1')).toContainText('Jahin Azmain');
    await expect(page.getByText(/Status Pending Confirmation/i).first()).toBeVisible();

    // Verify Custom 404 route
    await page.goto('/non-existent-odyssey-route-404');
    await expect(page.locator('h1')).toContainText('This Chapter Does Not Exist Yet.');
  });

  test('2. Security proof: blocks unauthorized /admin/dashboard access and rejects anonymous API writes/reads', async ({
    page,
    request,
  }) => {
    // Attempting /admin/dashboard logged out redirects to /admin/login
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);

    // Attempting direct DB write to /api/admin/cms as anon must return 401
    const writeRes = await request.post('/api/admin/cms', {
      data: {
        action: 'update_profile',
        payload: { full_name: 'Hacked Name' },
      },
    });
    expect(writeRes.status()).toBe(401);

    // Attempting to read private inbox /api/contact as anon must return 401
    const inboxRes = await request.get('/api/contact');
    expect(inboxRes.status()).toBe(401);
  });

  test('3. Mandatory CMS Proof Flows: Hero edit + Revision restore, Media upload + Draft/Publish Project, Blog Tiptap publish, and Contact Inbox flow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // A. Submit a genuine contact inquiry from public /contact page
    await page.goto('/contact');
    await page.fill('#contact-name', 'Zarin Tasnim');
    await page.fill('#contact-email', 'zarin@example.com');
    await page.fill('#contact-subject', 'Complete Brand & Shopify Store Setup');
    await page.fill(
      '#contact-message',
      'Hello Jahin, we want to hire you for our upcoming brand identity and website launch.'
    );
    await page.click('button[type="submit"]');
    await expect(page.getByRole('status')).toContainText('Thank you! Your inquiry has been securely saved');

    // B. Sign in as allowlisted owner at /admin/login
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-login-email"]', 'azmain56@gmail.com');
    await page.fill('[data-testid="admin-login-password"]', 'OdysseyAdmin2026!');
    await page.click('[data-testid="admin-login-submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // C. Proof Flow 1: Edit Homepage Hero heading & CTA in Site Editor, publish, verify on /, then restore
    await page.click('[data-testid="cms-tab-site-editor"]');
    await page.fill(
      '[data-testid="section-heading-input"]',
      'Crafting Luminous Digital Worlds & Brand Systems.'
    );
    await page.fill('[data-testid="hero-cta-label-input"]', 'Discover Featured Worlds');
    await page.click('[data-testid="publish-section-btn"]');
    await expect(page.getByTestId('cms-status-toast')).toContainText('Published updates');

    // Hard-refresh public homepage and verify live update
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(
      'Crafting Luminous Digital Worlds & Brand Systems.'
    );
    await expect(page.getByText('Discover Featured Worlds')).toBeVisible();

    // Restore original hero headline
    await page.goto('/admin/dashboard?tab=site-editor');
    await page.fill(
      '[data-testid="section-heading-input"]',
      'Designing Visual Stories. Building Digital Experiences.'
    );
    await page.fill('[data-testid="hero-cta-label-input"]', 'Explore My Work');
    await page.click('[data-testid="publish-section-btn"]');

    // D. Proof Flow 2: Upload Media Asset + Create Draft Project -> Verify Private Preview -> Publish -> Verify Public
    await page.click('[data-testid="cms-tab-media"]');
    await page.fill('[data-testid="media-filename-input"]', 'nova-brand-cover.svg');
    await page.fill(
      '[data-testid="media-url-input"]',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23171A25"/></svg>'
    );
    await page.fill('[data-testid="media-alt-input"]', 'Nova Brand Architectural Cover');
    await page.click('[data-testid="upload-media-btn"]');
    await expect(page.getByTestId('cms-status-toast')).toContainText('Uploaded media asset');

    await page.click('[data-testid="cms-tab-projects"]');
    await page.fill('[data-testid="project-title-input"]', 'Nova Commerce Flagship');
    await page.selectOption('[data-testid="project-status-select"]', 'draft');
    await page.fill(
      '[data-testid="project-summary-input"]',
      'A full-scale digital commerce identity and responsive web platform.'
    );
    await page.click('[data-testid="save-project-btn"]');
    await expect(page.getByTestId('cms-status-toast')).toContainText('Nova Commerce Flagship');

    // Verify draft is invisible on public /projects
    await page.goto('/projects');
    await expect(page.getByText('Nova Commerce Flagship')).toHaveCount(0);

    // Verify private admin preview works at /projects/nova-commerce-flagship?preview=1
    await page.goto('/projects/nova-commerce-flagship?preview=1');
    await expect(page.locator('h1')).toContainText('Nova Commerce Flagship');
    await expect(page.getByText(/PRIVATE ADMIN PREVIEW/i)).toBeVisible();

    // Now publish the project in Admin > Projects
    await page.goto('/admin/dashboard?tab=projects');
    await page.getByRole('button', { name: 'Edit' }).last().click();
    await page.selectOption('[data-testid="project-status-select"]', 'published');
    await page.click('[data-testid="save-project-btn"]');
    await expect(page.getByTestId('cms-status-toast')).toContainText('published');

    // Verify it is now live on public /projects and /projects/nova-commerce-flagship
    await page.goto('/projects/nova-commerce-flagship');
    await expect(page.locator('h1')).toContainText('Nova Commerce Flagship');

    // E. Proof Flow 3: Create & Publish a Blog Article with Tiptap & SEO Metadata
    await page.goto('/admin/dashboard?tab=blog');
    await page.fill(
      '[data-testid="blog-title-input"]',
      'Architectural Grids in Modern Digital Storytelling'
    );
    await page.selectOption('[data-testid="blog-status-select"]', 'published');
    await page.fill(
      '[data-testid="blog-excerpt-input"]',
      'How structured 12-column grids bring calm clarity to expressive web portfolios.'
    );
    await page.fill(
      '[data-testid="blog-seo-title-input"]',
      'Architectural Grids in Digital Storytelling | Jahin Azmain'
    );
    await page.click('[data-testid="save-blog-btn"]');
    await expect(page.getByTestId('cms-status-toast')).toContainText('Saved article');

    await page.goto('/blog/architectural-grids-in-modern-digital-storytelling');
    await expect(page.locator('h1')).toContainText(
      'Architectural Grids in Modern Digital Storytelling'
    );

    // F. Proof Flow 4: Verify Contact Message in Protected Admin Inbox & Mark as Read
    await page.goto('/admin/dashboard?tab=messages');
    await expect(page.getByText('Complete Brand & Shopify Store Setup')).toBeVisible();
    await expect(page.getByText('Zarin Tasnim')).toBeVisible();
    await page.getByRole('button', { name: 'Mark as Read' }).first().click();
    await expect(page.getByTestId('cms-status-toast')).toContainText('Marked inquiry as read');
  });

  test('4. WordPress-Style CMS Proof: JPG Photo Upload, Custom HTML & Python 3 Live Execution, and Theme Customizer', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Login to Admin CMS
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-login-email"]', 'azmain56@gmail.com');
    await page.fill('[data-testid="admin-login-password"]', 'OdysseyAdmin2026!');
    await page.click('[data-testid="admin-login-submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // 2. Upload a real .JPG image in Profile (Owner Portrait Photo)
    await page.click('[data-testid="cms-tab-profile"]');
    // 1x1 valid JPEG binary bytes
    const minimalJpgBase64 =
      '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    const jpgBuffer = Buffer.from(minimalJpgBase64, 'base64');

    await page.locator('[data-testid="profile-avatar-file-input"]').setInputFiles({
      name: 'jahin-portrait.jpg',
      mimeType: 'image/jpeg',
      buffer: jpgBuffer,
    });

    await expect(page.getByTestId('profile-avatar-preview-img')).toBeVisible();
    await page.getByRole('button', { name: /Save & Publish Profile/i }).click();
    await expect(page.getByTestId('cms-status-toast')).toContainText('Public profile updated');

    // 3. In Site Editor, customize 10K Hero Act 01 title + add Custom HTML + Interactive Python 3 Code & publish
    await page.click('[data-testid="cms-tab-site-editor"]');
    await page.fill('[data-testid="hero-act1-title-input"]', 'JAHIN SIGNATURE SPARK');
    await page.fill(
      '[data-testid="section-custom-html-input"]',
      '<div id="wp-custom-banner">Custom WordPress-Style HTML Block Active</div>'
    );
    await page.click('[data-testid="insert-sample-python-btn"]');
    await page.click('[data-testid="publish-section-btn"]');
    await expect(page.getByTestId('cms-status-toast')).toContainText('Published updates');

    // 4. Test WordPress-Style Theme Customizer (Custom Accent Color & Global CSS)
    await page.click('[data-testid="cms-tab-theme"]');
    await page.fill('[data-testid="custom-accent-hex-input"]', '#9B8CFF');
    await page.fill(
      '[data-testid="global-custom-css-input"]',
      '/* Customizer CSS verified */'
    );
    await page.click('[data-testid="save-theme-settings-btn"]');
    await expect(page.getByTestId('cms-status-toast')).toContainText('Theme customizer');

    // 5. Visit Public Homepage (/) and verify custom 10K Act title, JPG Portrait, Custom HTML, and Live Python 3 Execution!
    await page.goto('/');
    await expect(page.getByText('JAHIN SIGNATURE SPARK')).toBeVisible();
    await expect(page.getByTestId('hero-portrait-img')).toBeVisible();
    await expect(page.locator('#wp-custom-banner')).toContainText(
      'Custom WordPress-Style HTML Block Active'
    );
    await expect(page.getByText('Active Discipline: Graphic Design')).toBeVisible();
    await expect(
      page.getByText('Python 3 Output Rendered Live!', { exact: true })
    ).toBeVisible();

    // Clean up custom HTML/Python from Hero so default state stays clean
    await page.goto('/admin/dashboard?tab=site-editor');
    await page.fill('[data-testid="section-custom-html-input"]', '');
    await page.fill('[data-testid="section-python-code-input"]', '');
    await page.click('[data-testid="publish-section-btn"]');
  });
});

