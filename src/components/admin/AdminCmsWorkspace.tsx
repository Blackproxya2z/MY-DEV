'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  UserCheck,
  Briefcase,
  FolderKanban,
  FileText,
  Sparkles,
  Clock,
  GraduationCap,
  Quote,
  Image as ImageIcon,
  Inbox,
  Compass,
  Search,
  Palette,
  Share2,
  PanelBottom,
  ShieldCheck,
  Activity,
  Settings,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Monitor,
  Save,
} from 'lucide-react';
import {
  OdysseyDatabaseState,
  PageSection,
  Service,
  Project,
  Post,
  Skill,
  Experience,
  Education,
  Testimonial,
} from '@/lib/schemas';
import { useOdysseyExperience } from '@/lib/motion';
import { formatDateReadable, slugify } from '@/lib/utils';
import { SectionRenderer } from '@/components/story/SectionRenderer';
import { TiptapArticleEditor } from '@/components/admin/TiptapArticleEditor';
import {
  MediaImageField,
  compressImageFileToJpgDataUrl,
} from '@/components/admin/MediaImageField';

export type AdminModuleKey =
  | 'overview'
  | 'site-editor'
  | 'profile'
  | 'services'
  | 'projects'
  | 'blog'
  | 'skills'
  | 'experience'
  | 'education'
  | 'testimonials'
  | 'media'
  | 'messages'
  | 'navigation'
  | 'seo'
  | 'theme'
  | 'social'
  | 'footer'
  | 'security'
  | 'activity'
  | 'settings';

const SIDEBAR_MODULES: {
  key: AdminModuleKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'site-editor', label: 'Site Editor', icon: Layers },
  { key: 'profile', label: 'Profile', icon: UserCheck },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'blog', label: 'Blog / Journal', icon: FileText },
  { key: 'skills', label: 'Skills & Craft', icon: Sparkles },
  { key: 'experience', label: 'Experience', icon: Clock },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'testimonials', label: 'Testimonials', icon: Quote },
  { key: 'media', label: 'Media Library', icon: ImageIcon },
  { key: 'messages', label: 'Messages Inbox', icon: Inbox },
  { key: 'navigation', label: 'Navigation', icon: Compass },
  { key: 'seo', label: 'SEO Manager', icon: Search },
  { key: 'theme', label: 'Theme & Appearance', icon: Palette },
  { key: 'social', label: 'Social Links', icon: Share2 },
  { key: 'footer', label: 'Footer', icon: PanelBottom },
  { key: 'security', label: 'Admin Security', icon: ShieldCheck },
  { key: 'activity', label: 'Activity Log', icon: Activity },
  { key: 'settings', label: 'General Settings', icon: Settings },
];

export function AdminCmsWorkspace({
  initialState,
  adminEmail,
  initialTab = 'overview',
}: {
  initialState: OdysseyDatabaseState;
  adminEmail: string;
  initialTab?: AdminModuleKey;
}) {
  const router = useRouter();
  const { setThemeMode } = useOdysseyExperience();

  const [dbState, setDbState] = useState<OdysseyDatabaseState>(initialState);
  const [activeTab, setActiveTab] = useState<AdminModuleKey>(initialTab);
  const [moduleSearch, setModuleSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Site Editor State
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    initialState.page_sections[0]?.id || 'sec-home-01'
  );
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Profile Form State
  const [profileDraft, setProfileDraft] = useState(initialState.profiles[0]);

  // Settings Form State
  const [settingsDraft, setSettingsDraft] = useState(initialState.site_settings[0]);

  // Project Editor State
  const [editingProject, setEditingProject] = useState<
    Partial<Project> & {
      title: string;
      deliverablesText?: string;
      techText?: string;
      galleryUrl?: string;
      galleryAlt?: string;
    }
  >({
    title: '',
    slug: '',
    category: 'E-Commerce & Brand Identity',
    summary: '',
    role_title: 'Creative Developer & Designer',
    challenge: '',
    approach: '',
    solution: '',
    outcome: '',
    cover_url: '',
    cover_alt: '',
    status: 'draft',
    featured: true,
    is_visible: true,
    deliverablesText: 'Brand Identity, Responsive Layout',
    techText: 'Graphic Design, Web Development',
    galleryUrl: '',
    galleryAlt: '',
  });

  // Blog Editor State
  const [editingPost, setEditingPost] = useState<
    Partial<Post> & { title: string; tagsText?: string }
  >({
    title: '',
    slug: '',
    excerpt: '',
    category_name: 'Design & Brand Systems',
    content_html: '<h2>Introduction</h2><p>Write your field note here...</p>',
    content_jsonb: {},
    status: 'draft',
    featured: false,
    is_visible: true,
    seo_title: '',
    seo_description: '',
    tagsText: 'Brand Identity, Web Design',
  });

  // Service Editor State
  const [editingService, setEditingService] = useState<
    Partial<Service> & {
      title: string;
      deliverablesText?: string;
      faqQuestion?: string;
      faqAnswer?: string;
    }
  >({
    title: '',
    slug: '',
    number_label: '07',
    category: 'Creative Service',
    teaser: '',
    description: '',
    status: 'published',
    is_visible: true,
    deliverablesText: '',
    faqQuestion: '',
    faqAnswer: '',
  });

  // Skill Editor State
  const [newSkill, setNewSkill] = useState<Partial<Skill> & { name: string }>({
    name: '',
    category: 'graphic-design',
    group_label: 'Graphic Design & Branding',
    description: '',
    tool_metaphor: 'Vector Craft',
  });

  // Experience Editor State
  const [newExp, setNewExp] = useState<
    Partial<Experience> & { role_title: string; organization: string }
  >({
    role_title: '',
    organization: '',
    period_label: '2025 – Present',
    summary: '',
  });

  // Education Editor State
  const [eduDraft, setEduDraft] = useState<Education>(initialState.education[0]);

  // Testimonial Editor State
  const [newTestimonial, setNewTestimonial] = useState<
    Partial<Testimonial> & { author_name: string; quote: string }
  >({
    author_name: '',
    author_role: '',
    company: '',
    quote: '',
    is_verified: false,
    verification_source: '',
    status: 'draft',
    is_visible: false,
  });

  // Media Upload State
  const [mediaForm, setMediaForm] = useState({
    filename: '',
    public_url: '',
    mime_type: 'image/svg+xml',
    size_bytes: 24500,
    alt_text: '',
    caption: '',
  });

  const notify = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 5000);
  };

  const refreshCmsState = async (triggerAction?: string) => {
    const res = await fetch('/api/admin/cms', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.state) {
        setDbState(data.state);
        if (triggerAction === 'update_profile' || triggerAction === 'restore_revision') {
          setProfileDraft(data.state.profiles[0]);
        }
        if (triggerAction === 'update_settings' || triggerAction === 'restore_revision') {
          setSettingsDraft(data.state.site_settings[0]);
        }
        if (
          (triggerAction === 'upsert_education' || triggerAction === 'restore_revision') &&
          data.state.education[0]
        ) {
          setEduDraft(data.state.education[0]);
        }
      }
    }
  };

  const dispatchCmsMutation = async (
    action: string,
    payload: Record<string, unknown>,
    successMsg: string
  ) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        notify('error', data.error || 'Operation failed');
        return null;
      }
      await refreshCmsState(action);
      notify('success', successMsg);
      return data.record || data.result || true;
    } catch {
      notify('error', 'Network error while saving to CMS');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/admin/login');
    router.refresh();
  };

  const handleFileInputToDataUrl = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const optimized = await compressImageFileToJpgDataUrl(file);
    setMediaForm({
      filename: optimized.filename,
      public_url: optimized.dataUrl,
      mime_type: optimized.mimeType,
      size_bytes: optimized.sizeBytes,
      alt_text: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      caption: 'Uploaded via Admin Media Library',
    });
  };

  const unreadInboxCount = dbState.contact_messages.filter(
    (m) => !m.is_read && !m.is_spam
  ).length;

  const filteredModules = SIDEBAR_MODULES.filter((m) =>
    m.label.toLowerCase().includes(moduleSearch.trim().toLowerCase())
  );

  const selectedSection =
    dbState.page_sections.find((s) => s.id === selectedSectionId) ||
    dbState.page_sections[0];

  return (
    <div className="min-h-svh flex flex-col lg:flex-row bg-canvas text-fg">
      {/* Left Sidebar Navigation (20 Modules) */}
      <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-border bg-raised/90 flex flex-col shrink-0">
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-accent text-canvas font-mono font-bold text-xs flex items-center justify-center">
              JA
            </span>
            <div>
              <h1 className="text-sm font-semibold text-fg">Odyssey CMS</h1>
              <p className="text-[11px] font-mono text-muted truncate max-w-[150px]">
                {adminEmail}
              </p>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-canvas text-xs font-mono text-muted hover:text-fg"
            title="View live public site"
          >
            <span>Live</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Command Filter */}
        <div className="p-3 border-b border-border/60">
          <input
            type="search"
            value={moduleSearch}
            onChange={(e) => setModuleSearch(e.target.value)}
            placeholder="Filter 20 CMS modules..."
            aria-label="Filter CMS modules"
            className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg placeholder:text-muted/60"
          />
        </div>

        {/* 20 Module Buttons */}
        <nav
          aria-label="Admin CMS modules"
          className="flex-1 overflow-y-auto p-3 flex lg:flex-col gap-1 overflow-x-auto"
        >
          {filteredModules.map((mod) => {
            const Icon = mod.icon;
            const active = activeTab === mod.key;
            return (
              <button
                key={mod.key}
                type="button"
                data-testid={`cms-tab-${mod.key}`}
                onClick={() => setActiveTab(mod.key)}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between gap-2.5 shrink-0 transition-colors ${
                  active
                    ? 'bg-accent text-canvas font-semibold'
                    : 'text-muted hover:text-fg hover:bg-canvas/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{mod.label}</span>
                </span>
                {mod.key === 'messages' && unreadInboxCount > 0 ? (
                  <span
                    data-testid="unread-inbox-badge"
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      active ? 'bg-canvas text-accent' : 'bg-accent text-canvas'
                    }`}
                  >
                    {unreadInboxCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            type="button"
            data-testid="admin-logout-button"
            onClick={handleLogout}
            className="w-full py-2.5 px-3.5 rounded-xl border border-border bg-canvas text-xs font-mono text-rose-300 hover:border-rose-400 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of CMS</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Status Bar & Toast */}
        <header className="h-16 border-b border-border bg-raised/50 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted">ADMINISTRATION /</span>
            <span className="text-accent uppercase font-semibold">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            {toast ? (
              <div
                role="status"
                data-testid="cms-status-toast"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 border ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>{toast.text}</span>
              </div>
            ) : null}

            <span className="text-xs font-mono text-muted hidden sm:inline">
              {isSaving ? 'Saving changes...' : 'All changes persisted'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8">
          {/* ================================================================
              1. OVERVIEW MODULE
             ================================================================ */}
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Command Overview
                </h2>
                <p className="text-sm text-muted">
                  Real-time database metrics, unread messages, and content verification governance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-card border border-border bg-raised space-y-1">
                  <span className="text-xs font-mono text-muted">PUBLISHED PROJECTS</span>
                  <p className="text-3xl font-semibold text-fg">
                    {dbState.projects.filter((p) => p.status === 'published').length}
                    <span className="text-xs font-mono text-muted ml-2">
                      / {dbState.projects.length} total
                    </span>
                  </p>
                </div>

                <div className="p-5 rounded-card border border-border bg-raised space-y-1">
                  <span className="text-xs font-mono text-muted">ACTIVE SERVICES</span>
                  <p className="text-3xl font-semibold text-fg">
                    {dbState.services.filter((s) => s.status === 'published').length}
                  </p>
                </div>

                <div className="p-5 rounded-card border border-border bg-raised space-y-1">
                  <span className="text-xs font-mono text-muted">JOURNAL ARTICLES</span>
                  <p className="text-3xl font-semibold text-fg">
                    {dbState.posts.filter((p) => p.status === 'published').length}
                    <span className="text-xs font-mono text-muted ml-2">
                      / {dbState.posts.length} total
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className="p-5 rounded-card border border-border bg-raised text-left space-y-1 hover:border-accent transition-colors"
                >
                  <span className="text-xs font-mono text-highlight">UNREAD INQUIRIES</span>
                  <p className="text-3xl font-semibold text-fg">
                    {unreadInboxCount}
                    <span className="text-xs font-mono text-muted ml-2">
                      / {dbState.contact_messages.length} total
                    </span>
                  </p>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('site-editor')}
                  className="px-4 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                >
                  Edit Homepage Chapters
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className="px-4 py-2.5 rounded-xl border border-border bg-raised text-xs font-medium text-fg hover:border-accent"
                >
                  Create / Manage Projects
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('blog')}
                  className="px-4 py-2.5 rounded-xl border border-border bg-raised text-xs font-medium text-fg hover:border-accent"
                >
                  Write Journal Article
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('theme')}
                  className="px-4 py-2.5 rounded-xl border border-border bg-raised text-xs font-medium text-fg hover:border-accent"
                >
                  Customize Theme &amp; Motion
                </button>
              </div>

              {/* Owner Content Verification Checklist (PRD Section 2 & 15) */}
              <div className="rounded-card border border-border bg-raised/80 p-6 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-highlight">
                  Truth-in-Marketing &amp; Content Verification Status
                </h3>
                <ul className="space-y-2 text-xs text-muted">
                  <li>
                    • <strong>Public Name:</strong> Currently set to{' '}
                    <code className="text-fg">{dbState.profiles[0]?.full_name}</code> (
                    {dbState.profiles[0]?.name_verification_note})
                  </li>
                  <li>
                    • <strong>BSc in CSE (2022–2026):</strong> Currently marked{' '}
                    <code className="text-amber-300">
                      {dbState.education[0]?.completion_status}
                    </code>{' '}
                    — never asserted as completed until confirmed in Education tab.
                  </li>
                  <li>
                    • <strong>Testimonials:</strong>{' '}
                    {
                      dbState.testimonials.filter(
                        (t) => t.is_verified && t.status === 'published'
                      ).length
                    }{' '}
                    verified public testimonials (unverified testimonials are automatically hidden).
                  </li>
                </ul>
              </div>

              {/* Recent Activity Trail */}
              <div className="rounded-card border border-border bg-raised/80 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                    Recent Activity Log
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('activity')}
                    className="text-xs font-mono text-muted hover:text-fg"
                  >
                    View Full Audit Log →
                  </button>
                </div>
                <div className="divide-y divide-border/60 text-xs">
                  {dbState.activity_logs.slice(0, 6).map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-accent mr-2">[{log.action}]</span>
                        <span className="text-fg">{log.entity_label}</span>
                      </div>
                      <span className="font-mono text-muted shrink-0">
                        {formatDateReadable(log.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              2. SITE EDITOR MODULE (Modular Chapters + Live Public Preview + Revisions)
             ================================================================ */}
          {activeTab === 'site-editor' ? (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-fg">
                    Homepage Chapter &amp; Section Editor
                  </h2>
                  <p className="text-sm text-muted">
                    Edit headings, copy, CTAs, order, and visibility. Preview with the actual public
                    SectionRenderer component.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    data-testid="add-custom-section-btn"
                    onClick={async () => {
                      const newId = `sec-custom-${Date.now()}`;
                      const created = await dispatchCmsMutation(
                        'upsert_section',
                        {
                          id: newId,
                          page_key: 'home',
                          section_key: `chapter-custom-${dbState.page_sections.length + 1}`,
                          type: 'custom-code',
                          chapter_code: `${String(dbState.page_sections.length + 1).padStart(2, '0')} / ${String(dbState.page_sections.length + 1).padStart(2, '0')}`,
                          label: 'Custom Studio Block',
                          eyebrow: 'CUSTOM HTML · PYTHON · VISUAL STUDIO',
                          heading: 'Interactive Custom Studio & Visual Showcase',
                          subheading:
                            'Built directly from the Odyssey WordPress-style CMS with custom JPG visuals, HTML/CSS, and live Python 3 execution.',
                          sort_order: dbState.page_sections.length + 1,
                          is_enabled: true,
                          status: 'published',
                          content_jsonb: {
                            image_url: '',
                            image_alt: 'Custom section visual',
                            custom_html:
                              '<div class="p-4 rounded-xl border border-border bg-canvas/80 text-sm"><strong>Custom HTML Block:</strong> Edit this HTML or add Python code in the CMS Inspector!</div>',
                            custom_css: '',
                            python_title: 'Jahin Studio Python 3 App',
                            python_code:
                              'brand = "Jahin Azmain — Creative Odyssey"\nprojects = 6\nservices = 6\nprint(f"Welcome to {brand}")\nprint(f"Active Portfolio Worlds: {projects} | Core Disciplines: {services}")',
                          },
                        },
                        'Created new Custom HTML / Python / Image section'
                      );
                      if (created) {
                        setSelectedSectionId(newId);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs hover:opacity-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Custom HTML / Python / JPG Section</span>
                  </button>

                  <button
                    type="button"
                    data-testid="toggle-live-preview-btn"
                    onClick={() => setShowLivePreview((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-raised text-xs font-mono text-fg hover:border-accent"
                  >
                    <Eye className="w-4 h-4 text-accent" />
                    <span>{showLivePreview ? 'Hide Live Preview' : 'Open Live Public Preview'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Chapter List & Order Controls */}
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
                    Ordered Story Chapters ({dbState.page_sections.length})
                  </h3>

                  {dbState.page_sections
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((sec, idx, arr) => {
                      const isSelected = sec.id === selectedSection?.id;
                      return (
                        <div
                          key={sec.id}
                          className={`p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-accent bg-raised'
                              : 'border-border bg-raised/60 hover:border-border'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedSectionId(sec.id)}
                            className="text-left flex-1 min-w-0"
                          >
                            <span className="text-[11px] font-mono text-accent block">
                              CHAPTER {String(idx + 1).padStart(2, '0')} // {sec.type.toUpperCase()}
                            </span>
                            <strong className="text-sm font-semibold text-fg truncate block">
                              {sec.label}
                            </strong>
                            <span className="text-xs text-muted truncate block">
                              {sec.heading}
                            </span>
                          </button>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const ids = arr.map((s) => s.id);
                                const temp = ids[idx - 1];
                                ids[idx - 1] = ids[idx];
                                ids[idx] = temp;
                                dispatchCmsMutation(
                                  'reorder_sections',
                                  { orderedIds: ids },
                                  'Chapter order updated'
                                );
                              }}
                              className="p-1.5 rounded-lg border border-border bg-canvas text-muted hover:text-fg disabled:opacity-30"
                              title="Move chapter up"
                              aria-label={`Move ${sec.label} up`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={idx === arr.length - 1}
                              onClick={() => {
                                const ids = arr.map((s) => s.id);
                                const temp = ids[idx + 1];
                                ids[idx + 1] = ids[idx];
                                ids[idx] = temp;
                                dispatchCmsMutation(
                                  'reorder_sections',
                                  { orderedIds: ids },
                                  'Chapter order updated'
                                );
                              }}
                              className="p-1.5 rounded-lg border border-border bg-canvas text-muted hover:text-fg disabled:opacity-30"
                              title="Move chapter down"
                              aria-label={`Move ${sec.label} down`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {sec.id.startsWith('sec-custom-') ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete custom section "${sec.label}"?`)) {
                                    dispatchCmsMutation(
                                      'delete_section',
                                      { id: sec.id },
                                      `Deleted section "${sec.label}"`
                                    );
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-border bg-canvas text-rose-400 hover:border-rose-400"
                                title="Delete custom section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Right Selected Chapter Inspector */}
                {selectedSection ? (
                  <SectionInspectorForm
                    key={selectedSection.id}
                    section={selectedSection}
                    mediaAssets={dbState.media_assets}
                    onUploadAsset={(asset) =>
                      dispatchCmsMutation(
                        'upload_media',
                        asset,
                        `Saved JPG "${asset.filename}" to Media Library`
                      )
                    }
                    onSave={(updated) =>
                      dispatchCmsMutation(
                        'upsert_section',
                        updated,
                        `Published updates to "${updated.label}"`
                      )
                    }
                  />
                ) : null}
              </div>

              {/* Live Public Component Preview */}
              {showLivePreview ? (
                <div className="rounded-card border-2 border-accent/60 bg-canvas overflow-hidden space-y-4 p-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-mono text-accent font-semibold">
                      REAL PUBLIC COMPONENT PREVIEW (SectionRenderer)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewViewport('desktop')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 ${
                          previewViewport === 'desktop'
                            ? 'bg-accent text-canvas'
                            : 'bg-raised text-muted'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewViewport('mobile')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 ${
                          previewViewport === 'mobile'
                            ? 'bg-accent text-canvas'
                            : 'bg-raised text-muted'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile (390px)</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className={`mx-auto border border-border rounded-2xl overflow-hidden transition-all ${
                      previewViewport === 'mobile' ? 'max-w-[390px]' : 'w-full'
                    }`}
                  >
                    <SectionRenderer
                      sections={dbState.page_sections.filter((s) => s.is_enabled)}
                      profile={dbState.profiles[0]}
                      settings={dbState.site_settings[0]}
                      services={dbState.services}
                      projects={dbState.projects}
                      posts={dbState.posts}
                      skills={dbState.skills}
                      experiences={dbState.experiences}
                      education={dbState.education}
                      testimonials={dbState.testimonials}
                      isPreviewMode={true}
                    />
                  </div>
                </div>
              ) : null}

              {/* Revision History & Restore */}
              <div className="rounded-card border border-border bg-raised/80 p-6 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-highlight">
                  Content Revision History &amp; One-Click Restore
                </h3>
                <div className="divide-y divide-border/60 text-xs">
                  {dbState.content_revisions.slice(0, 8).map((rev) => (
                    <div
                      key={rev.id}
                      className="py-3 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <span className="font-mono text-accent mr-2">
                          [{rev.entity_type} · v{rev.version_number}]
                        </span>
                        <span className="text-fg">{rev.change_summary}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          dispatchCmsMutation(
                            'restore_revision',
                            { revisionId: rev.id },
                            `Restored revision v${rev.version_number}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-canvas text-fg hover:border-accent font-mono"
                      >
                        <RotateCcw className="w-3 h-3 text-accent" />
                        <span>Restore Snapshot</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              3. PROFILE MODULE
             ================================================================ */}
          {activeTab === 'profile' ? (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Brand Profile &amp; Biography
                </h2>
                <p className="text-sm text-muted">
                  Manage public name, role title, biography, contact channels, and resume URL.
                </p>
              </div>

              <div className="rounded-card border border-border bg-raised p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Public Name</label>
                    <input
                      type="text"
                      value={profileDraft.full_name}
                      onChange={(e) =>
                        setProfileDraft({ ...profileDraft, full_name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Role Title</label>
                    <input
                      type="text"
                      value={profileDraft.role_title}
                      onChange={(e) =>
                        setProfileDraft({ ...profileDraft, role_title: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted">Core Brand Statement</label>
                  <textarea
                    rows={2}
                    value={profileDraft.brand_statement}
                    onChange={(e) =>
                      setProfileDraft({ ...profileDraft, brand_statement: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted">Full Biography</label>
                  <textarea
                    rows={4}
                    value={profileDraft.full_bio}
                    onChange={(e) =>
                      setProfileDraft({ ...profileDraft, full_bio: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Public Email</label>
                    <input
                      type="email"
                      value={profileDraft.email}
                      onChange={(e) =>
                        setProfileDraft({ ...profileDraft, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      WhatsApp (Normalized International)
                    </label>
                    <input
                      type="text"
                      value={profileDraft.whatsapp_normalized}
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          whatsapp_normalized: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Availability Badge Text</label>
                    <input
                      type="text"
                      value={profileDraft.availability_text}
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          availability_text: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Resume PDF URL (Leave blank to hide Download CTA)
                    </label>
                    <input
                      type="text"
                      value={profileDraft.resume_url || ''}
                      placeholder="https://... or /uploads/resume.pdf"
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          resume_url: e.target.value.trim() || null,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                </div>

                {/* WordPress-Style Portrait & Logo JPG Uploaders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <MediaImageField
                    label="Owner Portrait Photo (.JPG / .PNG)"
                    value={profileDraft.avatar_url || ''}
                    altValue={profileDraft.full_name}
                    onChangeUrl={(url) =>
                      setProfileDraft({
                        ...profileDraft,
                        avatar_url: url.trim() || null,
                      })
                    }
                    mediaAssets={dbState.media_assets}
                    onUploadAsset={(asset) =>
                      dispatchCmsMutation(
                        'upload_media',
                        asset,
                        `Uploaded portrait JPG "${asset.filename}"`
                      )
                    }
                    testIdPrefix="profile-avatar"
                    helperText="Displays in Hero & About sections."
                  />

                  <MediaImageField
                    label="Custom Site Logo / Navbar Badge (.JPG / .PNG)"
                    value={profileDraft.logo_url || ''}
                    altValue={`${profileDraft.full_name} Logo`}
                    onChangeUrl={(url) =>
                      setProfileDraft({
                        ...profileDraft,
                        logo_url: url.trim() || null,
                      })
                    }
                    mediaAssets={dbState.media_assets}
                    onUploadAsset={(asset) =>
                      dispatchCmsMutation(
                        'upload_media',
                        asset,
                        `Uploaded logo JPG "${asset.filename}"`
                      )
                    }
                    testIdPrefix="profile-logo"
                    helperText="Replaces the JA monogram in the top navigation bar."
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    dispatchCmsMutation(
                      'update_profile',
                      profileDraft as unknown as Record<string, unknown>,
                      'Public profile updated & published'
                    )
                  }
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-canvas font-semibold text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Publish Profile</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              4. SERVICES MODULE
             ================================================================ */}
          {activeTab === 'services' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Services &amp; Disciplines Manager
                </h2>
                <p className="text-sm text-muted">
                  Create, edit, or reorder service disciplines, deliverables, and FAQs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Existing Services List */}
                <div className="lg:col-span-6 space-y-3">
                  {dbState.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 rounded-xl border border-border bg-raised flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-xs font-mono text-accent">
                          {srv.number_label} // {srv.category} ({srv.status})
                        </span>
                        <h3 className="text-base font-semibold text-fg">{srv.title}</h3>
                        <p className="text-xs text-muted line-clamp-1">{srv.teaser}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingService({
                              ...srv,
                              deliverablesText: srv.deliverables_jsonb.join(', '),
                              faqQuestion: srv.faqs_jsonb[0]?.question || '',
                              faqAnswer: srv.faqs_jsonb[0]?.answer || '',
                            })
                          }
                          className="px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs font-mono text-fg hover:border-accent"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete service "${srv.title}"?`)) {
                              dispatchCmsMutation(
                                'delete_service',
                                { id: srv.id },
                                `Deleted service "${srv.title}"`
                              );
                            }
                          }}
                          className="p-1.5 rounded-lg border border-border bg-canvas text-rose-400 hover:border-rose-400"
                          aria-label={`Delete ${srv.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Editor Form */}
                <div className="lg:col-span-6 rounded-card border border-border bg-raised p-6 space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                    {editingService.id ? `Edit Service: ${editingService.title}` : 'Add New Service'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Service Title *</label>
                      <input
                        type="text"
                        data-testid="service-title-input"
                        value={editingService.title}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            title: e.target.value,
                            slug: slugify(e.target.value),
                          })
                        }
                        placeholder="e.g. Brand Strategy & Identity"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Category</label>
                      <input
                        type="text"
                        value={editingService.category || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, category: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Short Teaser</label>
                    <input
                      type="text"
                      data-testid="service-teaser-input"
                      value={editingService.teaser || ''}
                      onChange={(e) =>
                        setEditingService({ ...editingService, teaser: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Full Description</label>
                    <textarea
                      rows={3}
                      value={editingService.description || ''}
                      onChange={(e) =>
                        setEditingService({ ...editingService, description: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Deliverables (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingService.deliverablesText || ''}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          deliverablesText: e.target.value,
                        })
                      }
                      placeholder="Logo Suite, Brand Guidelines, Social Kit"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">FAQ Question</label>
                      <input
                        type="text"
                        value={editingService.faqQuestion || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, faqQuestion: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">FAQ Answer</label>
                      <input
                        type="text"
                        value={editingService.faqAnswer || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, faqAnswer: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                  </div>

                  <MediaImageField
                    label="Service Cover Image (.JPG / .PNG)"
                    value={editingService.cover_url || ''}
                    altValue={editingService.cover_alt || editingService.title}
                    onChangeUrl={(url) =>
                      setEditingService({ ...editingService, cover_url: url })
                    }
                    onChangeAlt={(alt) =>
                      setEditingService({ ...editingService, cover_alt: alt })
                    }
                    mediaAssets={dbState.media_assets}
                    onUploadAsset={(asset) =>
                      dispatchCmsMutation(
                        'upload_media',
                        asset,
                        `Uploaded service image "${asset.filename}"`
                      )
                    }
                    testIdPrefix="service-cover"
                    helperText="Upload a .JPG photo for this service portal card."
                  />

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      data-testid="save-service-btn"
                      onClick={() => {
                        if (!editingService.title.trim()) {
                          notify('error', 'Service title is required');
                          return;
                        }
                        const deliverables = (editingService.deliverablesText || '')
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        const faqs =
                          editingService.faqQuestion && editingService.faqAnswer
                            ? [
                                {
                                  question: editingService.faqQuestion,
                                  answer: editingService.faqAnswer,
                                },
                              ]
                            : editingService.faqs_jsonb || [];

                        dispatchCmsMutation(
                          'upsert_service',
                          {
                            ...editingService,
                            deliverables_jsonb: deliverables,
                            faqs_jsonb: faqs,
                          },
                          `Saved service "${editingService.title}"`
                        );
                      }}
                      className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                    >
                      Save Service Record
                    </button>
                    {editingService.id ? (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingService({
                            title: '',
                            slug: '',
                            category: 'Creative Service',
                            teaser: '',
                            description: '',
                            status: 'published',
                            is_visible: true,
                            deliverablesText: '',
                            faqQuestion: '',
                            faqAnswer: '',
                          })
                        }
                        className="px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs font-mono text-muted"
                      >
                        Clear / New
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              5. PROJECTS MODULE (Draft Preview, Gallery Upload, Publish)
             ================================================================ */}
          {activeTab === 'projects' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Portfolio Projects &amp; Case Studies
                </h2>
                <p className="text-sm text-muted">
                  Create drafts, attach media, preview privately, and publish to the live portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Existing Projects */}
                <div className="lg:col-span-5 space-y-3">
                  {dbState.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl border border-border bg-raised space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            proj.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {proj.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/projects/${proj.slug}?preview=1`}
                            target="_blank"
                            className="text-xs font-mono text-accent hover:underline"
                          >
                            Preview ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProject({
                                ...proj,
                                deliverablesText: (proj.deliverables_jsonb || []).join(', '),
                                techText: (proj.technologies_list || []).join(', '),
                              })
                            }
                            className="px-2.5 py-1 rounded border border-border bg-canvas text-xs font-mono text-fg"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete project "${proj.title}"?`)) {
                                dispatchCmsMutation(
                                  'delete_project',
                                  { id: proj.id },
                                  `Deleted project "${proj.title}"`
                                );
                              }
                            }}
                            className="p-1 rounded border border-border bg-canvas text-rose-400"
                            aria-label={`Delete ${proj.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-fg">{proj.title}</h3>
                      <p className="text-xs text-muted line-clamp-2">{proj.summary}</p>
                    </div>
                  ))}
                </div>

                {/* Project Create / Edit Form */}
                <div className="lg:col-span-7 rounded-card border border-border bg-raised p-6 space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                    {editingProject.id
                      ? `Editing Project: ${editingProject.title}`
                      : 'Create New Case Study'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Project Title *</label>
                      <input
                        type="text"
                        data-testid="project-title-input"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: e.target.value,
                            slug: slugify(e.target.value),
                          })
                        }
                        placeholder="e.g. Aura Studio Brand System"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Slug</label>
                      <input
                        type="text"
                        data-testid="project-slug-input"
                        value={editingProject.slug || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, slug: slugify(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm font-mono text-fg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Category</label>
                      <input
                        type="text"
                        value={editingProject.category || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, category: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Publication Status</label>
                      <select
                        data-testid="project-status-select"
                        value={editingProject.status || 'draft'}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            status: e.target.value as Project['status'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      >
                        <option value="draft">Draft (Private Preview Only)</option>
                        <option value="published">Published (Live on Site)</option>
                        <option value="archived">Archived (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Executive Summary *</label>
                    <textarea
                      rows={2}
                      data-testid="project-summary-input"
                      value={editingProject.summary || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, summary: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">The Challenge</label>
                      <textarea
                        rows={2}
                        value={editingProject.challenge || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, challenge: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">The Solution</label>
                      <textarea
                        rows={2}
                        value={editingProject.solution || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, solution: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                  </div>

                  {/* Project Cover JPG Upload + Media Library Picker */}
                  <MediaImageField
                    label="Project Case Study Cover Photo (.JPG / .PNG)"
                    value={editingProject.cover_url || ''}
                    altValue={editingProject.cover_alt || editingProject.title}
                    onChangeUrl={(url) =>
                      setEditingProject({ ...editingProject, cover_url: url })
                    }
                    onChangeAlt={(alt) =>
                      setEditingProject({ ...editingProject, cover_alt: alt })
                    }
                    mediaAssets={dbState.media_assets}
                    onUploadAsset={(asset) =>
                      dispatchCmsMutation(
                        'upload_media',
                        asset,
                        `Uploaded project cover JPG "${asset.filename}"`
                      )
                    }
                    testIdPrefix="project-cover"
                    helperText="Upload a real .JPG screenshot or cover photo from your computer."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Cover Image URL</label>
                      <input
                        type="text"
                        data-testid="project-cover-input"
                        value={editingProject.cover_url || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, cover_url: e.target.value })
                        }
                        placeholder="https://... or upload a .JPG above"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Cover Image Alt Text</label>
                      <input
                        type="text"
                        data-testid="project-cover-alt-input"
                        value={editingProject.cover_alt || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, cover_alt: e.target.value })
                        }
                        placeholder="Accessible description of cover visual"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      data-testid="save-project-btn"
                      onClick={() => {
                        if (!editingProject.title.trim()) {
                          notify('error', 'Project title is required');
                          return;
                        }
                        const deliverables = (editingProject.deliverablesText || '')
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        const techs = (editingProject.techText || '')
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);

                        dispatchCmsMutation(
                          'upsert_project',
                          {
                            ...editingProject,
                            deliverables_jsonb: deliverables,
                            technologies_list: techs,
                          },
                          `Saved project "${editingProject.title}" (${editingProject.status})`
                        );
                      }}
                      className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                    >
                      Save Project ({editingProject.status || 'draft'})
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({
                          title: '',
                          slug: '',
                          category: 'Brand & Web Case Study',
                          summary: '',
                          status: 'draft',
                          featured: true,
                          is_visible: true,
                          cover_url: '',
                          cover_alt: '',
                        })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs font-mono text-muted"
                    >
                      New Blank Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              6. BLOG / JOURNAL MODULE (With Tiptap Rich-Text Editor)
             ================================================================ */}
          {activeTab === 'blog' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Journal / Field Notes Manager (Tiptap CMS)
                </h2>
                <p className="text-sm text-muted">
                  Author articles with Tiptap rich text, configure SEO metadata, and control
                  draft/publish lifecycle.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Posts List */}
                <div className="lg:col-span-4 space-y-3">
                  {dbState.posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl border border-border bg-raised space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            post.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {post.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/blog/${post.slug}?preview=1`}
                            target="_blank"
                            className="text-xs font-mono text-accent hover:underline"
                          >
                            View ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingPost({
                                ...post,
                                tagsText: (post.tags_list || []).join(', '),
                              })
                            }
                            className="px-2.5 py-1 rounded border border-border bg-canvas text-xs font-mono text-fg"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete article "${post.title}"?`)) {
                                dispatchCmsMutation(
                                  'delete_post',
                                  { id: post.id },
                                  `Deleted article "${post.title}"`
                                );
                              }
                            }}
                            className="p-1 rounded border border-border bg-canvas text-rose-400"
                            aria-label={`Delete ${post.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-fg">{post.title}</h3>
                    </div>
                  ))}
                </div>

                {/* Tiptap Article Form */}
                <div className="lg:col-span-8 rounded-card border border-border bg-raised p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Article Title *</label>
                      <input
                        type="text"
                        data-testid="blog-title-input"
                        value={editingPost.title}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            title: e.target.value,
                            slug: slugify(e.target.value),
                          })
                        }
                        placeholder="e.g. Designing High-Clarity Brand Systems"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Publication Status</label>
                      <select
                        data-testid="blog-status-select"
                        value={editingPost.status || 'draft'}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            status: e.target.value as Post['status'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Excerpt / Summary *</label>
                    <textarea
                      rows={2}
                      data-testid="blog-excerpt-input"
                      value={editingPost.excerpt || ''}
                      onChange={(e) =>
                        setEditingPost({ ...editingPost, excerpt: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <MediaImageField
                    label="Article Cover Photo (.JPG / .PNG)"
                    value={editingPost.cover_url || ''}
                    altValue={editingPost.cover_alt || editingPost.title}
                    onChangeUrl={(url) =>
                      setEditingPost({ ...editingPost, cover_url: url })
                    }
                    onChangeAlt={(alt) =>
                      setEditingPost({ ...editingPost, cover_alt: alt })
                    }
                    mediaAssets={dbState.media_assets}
                    onUploadAsset={(asset) =>
                      dispatchCmsMutation(
                        'upload_media',
                        asset,
                        `Uploaded article cover JPG "${asset.filename}"`
                      )
                    }
                    testIdPrefix="blog-cover"
                    helperText="Upload a .JPG cover photo for this journal article."
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Rich-Text Article Body (Tiptap Editor)
                    </label>
                    <TiptapArticleEditor
                      valueHtml={editingPost.content_html || ''}
                      onChangeHtml={(html, json) =>
                        setEditingPost({
                          ...editingPost,
                          content_html: html,
                          content_jsonb: json,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">SEO Title Override</label>
                      <input
                        type="text"
                        data-testid="blog-seo-title-input"
                        value={editingPost.seo_title || ''}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, seo_title: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">
                        SEO Meta Description
                      </label>
                      <input
                        type="text"
                        data-testid="blog-seo-desc-input"
                        value={editingPost.seo_description || ''}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, seo_description: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      data-testid="save-blog-btn"
                      onClick={() => {
                        if (!editingPost.title.trim()) {
                          notify('error', 'Article title is required');
                          return;
                        }
                        const tags = (editingPost.tagsText || '')
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);

                        dispatchCmsMutation(
                          'upsert_post',
                          {
                            ...editingPost,
                            tags_list: tags,
                          },
                          `Saved article "${editingPost.title}" (${editingPost.status})`
                        );
                      }}
                      className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                    >
                      Save Journal Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              7. SKILLS MODULE
             ================================================================ */}
          {activeTab === 'skills' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  The Craft — Skills &amp; Capabilities
                </h2>
                <p className="text-sm text-muted">
                  Manage verified capabilities without fabricated experience percentages.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-3">
                  {dbState.skills.map((sk) => (
                    <div
                      key={sk.id}
                      className="p-4 rounded-xl border border-border bg-raised flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-xs font-mono text-accent">{sk.group_label}</span>
                        <h3 className="text-sm font-semibold text-fg">{sk.name}</h3>
                        <p className="text-xs text-muted">{sk.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          dispatchCmsMutation(
                            'delete_skill',
                            { id: sk.id },
                            `Removed skill "${sk.name}"`
                          )
                        }
                        className="p-2 rounded-lg border border-border bg-canvas text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 rounded-card border border-border bg-raised p-6 space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                    Add Capability
                  </h3>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="Skill / Discipline Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <select
                    value={newSkill.category}
                    onChange={(e) =>
                      setNewSkill({
                        ...newSkill,
                        category: e.target.value as Skill['category'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  >
                    <option value="graphic-design">Graphic Design &amp; Branding</option>
                    <option value="web-development">Web Engineering &amp; Storefronts</option>
                    <option value="digital-setup">Digital Business &amp; Social Setup</option>
                    <option value="content-support">Content &amp; Administrative Support</option>
                  </select>
                  <textarea
                    rows={2}
                    value={newSkill.description || ''}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    placeholder="Brief explanation of capability..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSkill.name.trim()) return;
                      dispatchCmsMutation(
                        'upsert_skill',
                        newSkill,
                        `Added skill "${newSkill.name}"`
                      );
                      setNewSkill({ ...newSkill, name: '', description: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              8. EXPERIENCE MODULE
             ================================================================ */}
          {activeTab === 'experience' ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-display font-semibold text-fg">
                Experience Timeline Manager
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-3">
                  {dbState.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-5 rounded-xl border border-border bg-raised flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-mono text-highlight">
                          {exp.period_label}
                        </span>
                        <h3 className="text-base font-semibold text-fg">{exp.role_title}</h3>
                        <p className="text-xs font-mono text-muted">{exp.organization}</p>
                        <p className="text-xs text-muted">{exp.summary}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          dispatchCmsMutation(
                            'delete_experience',
                            { id: exp.id },
                            'Removed experience entry'
                          )
                        }
                        className="p-2 rounded-lg border border-border bg-canvas text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 rounded-card border border-border bg-raised p-6 space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                    Add Experience Milestone
                  </h3>
                  <input
                    type="text"
                    value={newExp.role_title}
                    onChange={(e) => setNewExp({ ...newExp, role_title: e.target.value })}
                    placeholder="Role Title"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <input
                    type="text"
                    value={newExp.organization}
                    onChange={(e) => setNewExp({ ...newExp, organization: e.target.value })}
                    placeholder="Organization / Studio"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <input
                    type="text"
                    value={newExp.period_label || ''}
                    onChange={(e) => setNewExp({ ...newExp, period_label: e.target.value })}
                    placeholder="Period Label (e.g. Ongoing)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <textarea
                    rows={3}
                    value={newExp.summary || ''}
                    onChange={(e) => setNewExp({ ...newExp, summary: e.target.value })}
                    placeholder="Summary of responsibilities..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newExp.role_title.trim()) return;
                      dispatchCmsMutation(
                        'upsert_experience',
                        newExp,
                        `Saved experience "${newExp.role_title}"`
                      );
                    }}
                    className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                  >
                    Save Experience
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              9. EDUCATION MODULE (Strict Completion Verification Control)
             ================================================================ */}
          {activeTab === 'education' ? (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Academic Background &amp; Verification Status
                </h2>
                <p className="text-sm text-muted">
                  Per PRD Section 2.1, BSc in CSE (2022–2026) must not be labeled as completed
                  until explicitly confirmed here.
                </p>
              </div>

              {eduDraft ? (
                <div className="rounded-card border border-border bg-raised p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Degree Title</label>
                    <input
                      type="text"
                      value={eduDraft.degree}
                      onChange={(e) => setEduDraft({ ...eduDraft, degree: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Institution</label>
                    <input
                      type="text"
                      value={eduDraft.institution}
                      onChange={(e) =>
                        setEduDraft({ ...eduDraft, institution: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">Period Label</label>
                      <input
                        type="text"
                        value={eduDraft.period_label}
                        onChange={(e) =>
                          setEduDraft({ ...eduDraft, period_label: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted">
                        Verification / Completion Status
                      </label>
                      <select
                        value={eduDraft.completion_status}
                        onChange={(e) =>
                          setEduDraft({
                            ...eduDraft,
                            completion_status: e.target
                              .value as Education['completion_status'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                      >
                        <option value="pending_verification">
                          Pending Verification (Default Safe)
                        </option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Verified Completed</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      dispatchCmsMutation(
                        'upsert_education',
                        eduDraft as unknown as Record<string, unknown>,
                        'Updated education record'
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                  >
                    Save Education Record
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* ================================================================
              10. TESTIMONIALS MODULE (Verified-Only Public Gate)
             ================================================================ */}
          {activeTab === 'testimonials' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Client Testimonials (Strict Verification Gate)
                </h2>
                <p className="text-sm text-muted">
                  Only testimonials marked both <strong>Published</strong> and{' '}
                  <strong>Verified</strong> will ever render on the public site.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-6 space-y-3">
                  {dbState.testimonials.length === 0 ? (
                    <div className="p-8 rounded-card border border-border bg-raised/60 text-center text-xs font-mono text-muted">
                      No testimonials stored yet. Public homepage automatically hides the
                      testimonials block until verified entries exist.
                    </div>
                  ) : (
                    dbState.testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl border border-border bg-raised space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-sm text-fg">{t.author_name}</strong>
                          <span className="text-xs font-mono text-accent">
                            {t.is_verified ? 'Verified' : 'Unverified (Hidden Publicly)'}
                          </span>
                        </div>
                        <p className="text-xs text-muted italic">&ldquo;{t.quote}&rdquo;</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="lg:col-span-6 rounded-card border border-border bg-raised p-6 space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                    Add Client Testimonial
                  </h3>
                  <input
                    type="text"
                    value={newTestimonial.author_name}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, author_name: e.target.value })
                    }
                    placeholder="Client Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <textarea
                    rows={3}
                    value={newTestimonial.quote}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, quote: e.target.value })
                    }
                    placeholder="Exact verified client feedback..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                  <label className="flex items-center gap-2 text-xs text-fg">
                    <input
                      type="checkbox"
                      checked={Boolean(newTestimonial.is_verified)}
                      onChange={(e) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          is_verified: e.target.checked,
                          is_visible: e.target.checked,
                          status: e.target.checked ? 'published' : 'draft',
                        })
                      }
                    />
                    <span>I confirm this is a real, verified client testimonial</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTestimonial.author_name.trim() || !newTestimonial.quote.trim())
                        return;
                      dispatchCmsMutation(
                        'upsert_testimonial',
                        newTestimonial,
                        'Saved testimonial record'
                      );
                    }}
                    className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                  >
                    Save Testimonial
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              11. MEDIA LIBRARY MODULE (Upload, Alt Text, Reference-Safe Delete)
             ================================================================ */}
          {activeTab === 'media' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Media Library &amp; Asset Governance
                </h2>
                <p className="text-sm text-muted">
                  Upload images or documents (max 15MB), manage accessible alt text, and protect
                  referenced published assets from accidental deletion.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 rounded-card border border-border bg-raised p-6 space-y-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-accent">
                    Upload / Register Media Asset
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Select Local Image/File (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileInputToDataUrl}
                      className="w-full text-xs text-muted"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">Filename *</label>
                    <input
                      type="text"
                      data-testid="media-filename-input"
                      value={mediaForm.filename}
                      onChange={(e) =>
                        setMediaForm({ ...mediaForm, filename: e.target.value })
                      }
                      placeholder="safe-shop-showcase.svg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Asset URL or Data URI *
                    </label>
                    <input
                      type="text"
                      data-testid="media-url-input"
                      value={mediaForm.public_url}
                      onChange={(e) =>
                        setMediaForm({ ...mediaForm, public_url: e.target.value })
                      }
                      placeholder="https://... or data:image/svg+xml..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Accessible Alt Text *
                    </label>
                    <input
                      type="text"
                      data-testid="media-alt-input"
                      value={mediaForm.alt_text}
                      onChange={(e) =>
                        setMediaForm({ ...mediaForm, alt_text: e.target.value })
                      }
                      placeholder="Describe the image for screen readers"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    />
                  </div>

                  <button
                    type="button"
                    data-testid="upload-media-btn"
                    onClick={() => {
                      if (!mediaForm.filename.trim() || !mediaForm.public_url.trim()) {
                        notify('error', 'Filename and asset URL are required');
                        return;
                      }
                      dispatchCmsMutation(
                        'upload_media',
                        mediaForm,
                        `Uploaded media asset "${mediaForm.filename}"`
                      );
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload to Media Library</span>
                  </button>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  {dbState.media_assets.length === 0 ? (
                    <div className="p-8 rounded-card border border-border bg-raised/60 text-center text-xs font-mono text-muted">
                      No uploaded media assets yet. Upload an image on the left to use in projects
                      or articles.
                    </div>
                  ) : (
                    dbState.media_assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-4 rounded-xl border border-border bg-raised flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {asset.mime_type.startsWith('image/') ? (
                            <div className="w-16 h-12 rounded-lg overflow-hidden border border-border bg-canvas shrink-0">
                              <img
                                src={asset.public_url}
                                alt={asset.alt_text}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : null}
                          <div className="space-y-1 min-w-0">
                            <strong className="text-sm font-semibold text-fg block truncate">
                              {asset.filename}
                            </strong>
                            <span className="text-xs font-mono text-muted block truncate">
                              Alt: {asset.alt_text} · {asset.mime_type}
                            </span>
                            <code className="text-[11px] font-mono text-accent block truncate">
                              {asset.public_url.slice(0, 80)}
                            </code>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            dispatchCmsMutation(
                              'delete_media',
                              { id: asset.id },
                              `Deleted media "${asset.filename}"`
                            )
                          }
                          className="p-2 rounded-lg border border-border bg-canvas text-rose-400 hover:border-rose-400 shrink-0"
                          title="Safe delete (blocked if referenced by published content)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              12. MESSAGES INBOX MODULE
             ================================================================ */}
          {activeTab === 'messages' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Private Lead &amp; Messages Inbox
                </h2>
                <p className="text-sm text-muted">
                  Protected by server role guards &amp; RLS. Manage read status and reply directly.
                </p>
              </div>

              {dbState.contact_messages.length === 0 ? (
                <div className="p-10 rounded-card border border-border bg-raised/60 text-center text-xs font-mono text-muted">
                  Your private inbox is currently empty. Inquiries submitted via the public Contact
                  form appear here immediately.
                </div>
              ) : (
                <div className="space-y-4">
                  {dbState.contact_messages.map((msg) => (
                    <div
                      key={msg.id}
                      data-testid={`inbox-message-${msg.id}`}
                      className={`p-6 rounded-card border transition-colors space-y-3 ${
                        msg.is_read
                          ? 'border-border bg-raised/60'
                          : 'border-accent bg-raised'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                              msg.is_read
                                ? 'bg-canvas text-muted border border-border'
                                : 'bg-accent text-canvas font-semibold'
                            }`}
                          >
                            {msg.is_read ? 'Read' : 'Unread'}
                          </span>
                          <strong className="text-base font-semibold text-fg">
                            {msg.subject}
                          </strong>
                        </div>
                        <span className="text-xs font-mono text-muted">
                          {formatDateReadable(msg.created_at)}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-muted flex flex-wrap gap-4">
                        <span>From: {msg.name}</span>
                        <span>Email: {msg.email}</span>
                        {msg.service_interest ? (
                          <span className="text-highlight">
                            Service: {msg.service_interest}
                          </span>
                        ) : null}
                      </div>

                      <p className="text-sm text-fg leading-relaxed bg-canvas/70 p-4 rounded-xl border border-border/60">
                        {msg.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="button"
                          data-testid={`toggle-read-${msg.id}`}
                          onClick={() =>
                            dispatchCmsMutation(
                              'update_message',
                              {
                                id: msg.id,
                                patch: {
                                  is_read: !msg.is_read,
                                  status: !msg.is_read ? 'read' : 'unread',
                                },
                              },
                              `Marked inquiry as ${!msg.is_read ? 'read' : 'unread'}`
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg border border-border bg-canvas text-xs font-mono text-fg hover:border-accent"
                        >
                          {msg.is_read ? 'Mark Unread' : 'Mark as Read'}
                        </button>

                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(
                            `Re: ${msg.subject}`
                          )}`}
                          className="px-3.5 py-1.5 rounded-lg bg-accent text-canvas text-xs font-semibold"
                        >
                          Reply via Email
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete message from ${msg.name}?`)) {
                              dispatchCmsMutation(
                                'delete_message',
                                { id: msg.id },
                                'Deleted message from inbox'
                              );
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs font-mono text-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* ================================================================
              13. NAVIGATION MODULE
             ================================================================ */}
          {activeTab === 'navigation' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-fg">
                Navigation &amp; Menu Manager
              </h2>
              <div className="space-y-3 max-w-2xl">
                {dbState.navigation_items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border bg-raised flex items-center justify-between gap-4"
                  >
                    <div>
                      <strong className="text-sm font-semibold text-fg">{item.label}</strong>
                      <span className="text-xs font-mono text-muted ml-3">{item.href}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        dispatchCmsMutation(
                          'upsert_nav',
                          { ...item, is_visible: !item.is_visible },
                          `Updated visibility for ${item.label}`
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-mono border ${
                        item.is_visible
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-border bg-canvas text-muted'
                      }`}
                    >
                      {item.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* ================================================================
              14. SEO MANAGER MODULE
             ================================================================ */}
          {activeTab === 'seo' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-fg">
                Route SEO &amp; Structured Metadata Manager
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dbState.seo_metadata.map((seo) => (
                  <SeoRouteCard
                    key={seo.id}
                    seo={seo}
                    onSave={(updated) =>
                      dispatchCmsMutation(
                        'upsert_seo',
                        updated,
                        `Updated SEO metadata for ${seo.route_key}`
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* ================================================================
              15. THEME & APPEARANCE MODULE (WordPress-Style Visual Customizer)
             ================================================================ */}
          {activeTab === 'theme' ? (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  WordPress-Style Theme Customizer, Colors &amp; Global Code
                </h2>
                <p className="text-sm text-muted">
                  Customize theme mode, brand color pickers, card border radius, 3D Hero Spark, and
                  global Custom CSS / HTML injection across your entire website.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Preset Theme, Accent, Motion & Geometry */}
                <div className="lg:col-span-6 rounded-card border border-border bg-raised p-6 space-y-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent">
                    1. Core Theme, Presets &amp; Motion
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted">
                      Default Theme Mode
                    </label>
                    <select
                      data-testid="theme-mode-select"
                      value={settingsDraft.theme_mode}
                      onChange={(e) => {
                        const mode = e.target.value as 'dark' | 'light';
                        setSettingsDraft({ ...settingsDraft, theme_mode: mode });
                        setThemeMode(mode);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    >
                      <option value="dark">Dark Cosmic Editorial (#0B0D14)</option>
                      <option value="light">Minimalist Light Editorial (#F5F5F7)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted">
                      Accent Color Token Preset
                    </label>
                    <select
                      data-testid="accent-preset-select"
                      value={settingsDraft.accent_preset}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          accent_preset: e.target.value as typeof settingsDraft.accent_preset,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    >
                      <option value="cosmic-violet">Cosmic Violet (#9B8CFF)</option>
                      <option value="classic-blue">Classic Blue (#0071E3)</option>
                      <option value="editorial-gold">Warm Editorial Gold (#E8C998)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted">
                      Default Motion Intensity (Visitor OS Reduced-Motion Always Overrides)
                    </label>
                    <select
                      data-testid="motion-preset-select"
                      value={settingsDraft.motion_preset}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          motion_preset: e.target.value as typeof settingsDraft.motion_preset,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    >
                      <option value="cinematic">Cinematic (Full Scroll Timelines &amp; Rail)</option>
                      <option value="subtle">Subtle (Gentle Fades &amp; Microinteractions)</option>
                      <option value="off">Off (Zero Scroll-Linked Movement)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted">
                      Card Border Radius Geometry ({settingsDraft.card_radius_px ?? 22}px)
                    </label>
                    <select
                      data-testid="card-radius-select"
                      value={String(settingsDraft.card_radius_px ?? 22)}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          card_radius_px: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                    >
                      <option value="0">0px — Brutalist Sharp Corners</option>
                      <option value="12">12px — Clean Modern Studio</option>
                      <option value="22">22px — Cosmic Editorial Default</option>
                      <option value="32">32px — Soft Sculptural Rounded</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2.5 text-xs font-mono text-fg pt-1">
                    <input
                      type="checkbox"
                      checked={settingsDraft.enable_3d_hero ?? true}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          enable_3d_hero: e.target.checked,
                        })
                      }
                    />
                    <span>Enable Interactive 3D Polyhedron Spark on Hero</span>
                  </label>
                </div>

                {/* Right Column: Custom Color Pickers + WordPress Additional CSS/HTML */}
                <div className="lg:col-span-6 rounded-card border border-border bg-raised p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-highlight">
                      2. Custom Brand Color Pickers &amp; Global Code
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setSettingsDraft({
                          ...settingsDraft,
                          custom_accent_color: null,
                          custom_bg_color: null,
                          custom_text_color: null,
                          card_radius_px: 22,
                        })
                      }
                      className="px-2.5 py-1 rounded border border-border bg-canvas text-[11px] font-mono text-muted hover:text-fg"
                    >
                      Reset Custom Colors
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl border border-border bg-canvas space-y-1.5">
                      <label className="text-[10px] font-mono text-muted block">
                        Custom Accent
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          data-testid="custom-accent-color-picker"
                          value={settingsDraft.custom_accent_color || '#9B8CFF'}
                          onChange={(e) =>
                            setSettingsDraft({
                              ...settingsDraft,
                              custom_accent_color: e.target.value,
                            })
                          }
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          data-testid="custom-accent-hex-input"
                          value={settingsDraft.custom_accent_color || ''}
                          onChange={(e) =>
                            setSettingsDraft({
                              ...settingsDraft,
                              custom_accent_color: e.target.value.trim() || null,
                            })
                          }
                          placeholder="#9B8CFF"
                          className="w-full px-2 py-1 rounded border border-border bg-raised text-xs font-mono text-fg"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-canvas space-y-1.5">
                      <label className="text-[10px] font-mono text-muted block">
                        Custom Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settingsDraft.custom_bg_color || '#0B0D14'}
                          onChange={(e) =>
                            setSettingsDraft({
                              ...settingsDraft,
                              custom_bg_color: e.target.value,
                            })
                          }
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={settingsDraft.custom_bg_color || ''}
                          onChange={(e) =>
                            setSettingsDraft({
                              ...settingsDraft,
                              custom_bg_color: e.target.value.trim() || null,
                            })
                          }
                          placeholder="#0B0D14"
                          className="w-full px-2 py-1 rounded border border-border bg-raised text-xs font-mono text-fg"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-canvas space-y-1.5">
                      <label className="text-[10px] font-mono text-muted block">
                        Custom Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settingsDraft.custom_text_color || '#F6F3EB'}
                          onChange={(e) =>
                            setSettingsDraft({
                              ...settingsDraft,
                              custom_text_color: e.target.value,
                            })
                          }
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={settingsDraft.custom_text_color || ''}
                          onChange={(e) =>
                            setSettingsDraft({
                              ...settingsDraft,
                              custom_text_color: e.target.value.trim() || null,
                            })
                          }
                          placeholder="#F6F3EB"
                          className="w-full px-2 py-1 rounded border border-border bg-raised text-xs font-mono text-fg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Additional Global CSS (WordPress Additional CSS)
                    </label>
                    <textarea
                      rows={3}
                      data-testid="global-custom-css-input"
                      value={settingsDraft.custom_css || ''}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          custom_css: e.target.value,
                        })
                      }
                      placeholder="/* Write any global CSS override here */"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-canvas font-mono text-xs text-fg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Global Top Announcement / Custom Header HTML
                    </label>
                    <textarea
                      rows={2}
                      data-testid="global-head-html-input"
                      value={settingsDraft.custom_head_html || ''}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          custom_head_html: e.target.value,
                        })
                      }
                      placeholder="<div style='text-align:center;padding:8px;background:#9B8CFF;color:#0B0D14;font-size:12px;font-weight:600;'>Announcement Banner</div>"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-canvas font-mono text-xs text-fg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted">
                      Global Custom Footer HTML / Widget
                    </label>
                    <textarea
                      rows={2}
                      data-testid="global-footer-html-input"
                      value={settingsDraft.custom_footer_html || ''}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          custom_footer_html: e.target.value,
                        })
                      }
                      placeholder="<!-- Optional footer HTML widget -->"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-canvas font-mono text-xs text-fg"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                data-testid="save-theme-settings-btn"
                onClick={() =>
                  dispatchCmsMutation(
                    'update_settings',
                    settingsDraft as unknown as Record<string, unknown>,
                    'Theme customizer, colors & global code saved'
                  )
                }
                className="px-6 py-3.5 rounded-xl bg-accent text-canvas font-semibold text-xs inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Theme &amp; Customizer Preferences</span>
              </button>
            </div>
          ) : null}

          {/* ================================================================
              16. SOCIAL LINKS MODULE
             ================================================================ */}
          {activeTab === 'social' ? (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-display font-semibold text-fg">
                  Outbound Social &amp; Freelance Profiles
                </h2>
                <p className="text-sm text-muted">
                  Unverified or empty social URLs remain hidden publicly per PRD Section 2.1.
                </p>
              </div>

              <div className="space-y-4">
                {dbState.social_links.map((soc) => (
                  <SocialLinkEditorRow
                    key={soc.id}
                    social={soc}
                    onSave={(updated) =>
                      dispatchCmsMutation(
                        'upsert_social',
                        updated,
                        `Updated ${soc.platform} profile link`
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* ================================================================
              17. FOOTER MODULE
             ================================================================ */}
          {activeTab === 'footer' ? (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-2xl font-display font-semibold text-fg">
                Footer Content &amp; Attribution
              </h2>
              <div className="rounded-card border border-border bg-raised p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted">Footer Callout Heading</label>
                  <input
                    type="text"
                    value={settingsDraft.footer_heading}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, footer_heading: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted">Copyright Holder Name</label>
                  <input
                    type="text"
                    value={settingsDraft.copyright_name}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, copyright_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    dispatchCmsMutation(
                      'update_settings',
                      settingsDraft as unknown as Record<string, unknown>,
                      'Footer settings saved'
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                >
                  Save Footer Settings
                </button>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              18. ADMIN SECURITY MODULE
             ================================================================ */}
          {activeTab === 'security' ? (
            <div className="max-w-3xl space-y-6">
              <h2 className="text-2xl font-display font-semibold text-fg">
                Admin Security, Cloud Persistence &amp; Edge Hardening
              </h2>
              <div className="rounded-card border border-border bg-raised p-6 space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-fg font-semibold">
                      Single-Owner Allowlist &amp; Edge Security Active
                    </p>
                    <p className="text-muted leading-relaxed mt-1">
                      Public registration is disabled. Only the allowlisted email in{' '}
                      <code>admin_profiles</code> (<strong>{adminEmail}</strong>) can authenticate or
                      execute CMS mutations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(dbState, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `creative-odyssey-db-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      notify('success', 'Full JSON database backup exported.');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs shrink-0"
                  >
                    Export Full JSON Database Backup
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-border bg-canvas font-mono space-y-1.5">
                  <div>Allowlisted Email: {adminEmail}</div>
                  <div>Role: owner (Constant-Time HMAC Verified)</div>
                  <div>Edge Middleware: Strict CSP, HSTS, CSRF Origin Check &amp; X-Robots-Tag noindex</div>
                  <div>Cloudflare Protection: Real-IP Rate Limiting (cf-connecting-ip) + Turnstile Ready</div>
                  <div>Database Engine: Firebase (Firestore / RTDB) + Supabase + Serverless /tmp Safe</div>
                  <div>RLS &amp; Server Guard: Enforced across all 24 CMS collections</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ================================================================
              19. ACTIVITY LOG MODULE
             ================================================================ */}
          {activeTab === 'activity' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-fg">
                Immutable Security &amp; Audit Trail
              </h2>
              <div className="rounded-card border border-border bg-raised divide-y divide-border/60 text-xs">
                {dbState.activity_logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-mono text-accent mr-2">[{log.action}]</span>
                      <strong className="text-fg mr-2">{log.entity_label}</strong>
                      <span className="font-mono text-muted">by {log.actor_email}</span>
                    </div>
                    <span className="font-mono text-muted">{log.created_at}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* ================================================================
              20. GENERAL SETTINGS MODULE
             ================================================================ */}
          {activeTab === 'settings' ? (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-2xl font-display font-semibold text-fg">
                General Website &amp; Lead-Form Settings
              </h2>
              <div className="rounded-card border border-border bg-raised p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted">Site Title</label>
                  <input
                    type="text"
                    value={settingsDraft.site_name}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, site_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
                  />
                </div>
                <label className="flex items-center gap-2.5 text-sm text-fg">
                  <input
                    type="checkbox"
                    checked={settingsDraft.show_service_inquiry_field}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        show_service_inquiry_field: e.target.checked,
                      })
                    }
                  />
                  <span>Show Service Discipline selector on public contact forms</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm text-fg">
                  <input
                    type="checkbox"
                    checked={settingsDraft.show_project_budget_field}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        show_project_budget_field: e.target.checked,
                      })
                    }
                  />
                  <span>Show optional Budget Scope field on public contact forms</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    dispatchCmsMutation(
                      'update_settings',
                      settingsDraft as unknown as Record<string, unknown>,
                      'General settings updated'
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs"
                >
                  Save General Settings
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function SectionInspectorForm({
  section,
  mediaAssets,
  onUploadAsset,
  onSave,
}: {
  section: PageSection;
  mediaAssets: OdysseyDatabaseState['media_assets'];
  onUploadAsset: (asset: {
    filename: string;
    public_url: string;
    mime_type: string;
    size_bytes: number;
    alt_text: string;
    caption: string;
  }) => Promise<unknown>;
  onSave: (updated: Partial<PageSection> & { id: string }) => void;
}) {
  const [label, setLabel] = useState(section.label);
  const [eyebrow, setEyebrow] = useState(section.eyebrow);
  const [heading, setHeading] = useState(section.heading);
  const [subheading, setSubheading] = useState(section.subheading);
  const [isEnabled, setIsEnabled] = useState(section.is_enabled);
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState(
    String(section.content_jsonb?.primary_cta_label || 'Explore My Work')
  );
  const [primaryCtaHref, setPrimaryCtaHref] = useState(
    String(section.content_jsonb?.primary_cta_href || '#chapter-worlds')
  );
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState(
    String(section.content_jsonb?.secondary_cta_label || "Let's Work Together")
  );
  const [secondaryCtaHref, setSecondaryCtaHref] = useState(
    String(section.content_jsonb?.secondary_cta_href || '/contact')
  );
  const [tertiaryCtaLabel, setTertiaryCtaLabel] = useState(
    String(section.content_jsonb?.tertiary_cta_label || 'Download Resume')
  );
  const [sparkCaption, setSparkCaption] = useState(
    String(section.content_jsonb?.spark_caption || 'IDEA SPARK // PAPER TO PIXEL')
  );
  const [heroVideoUrl, setHeroVideoUrl] = useState(
    String(section.content_jsonb?.hero_video_url || '')
  );
  const [bgImageUrl, setBgImageUrl] = useState(
    String(section.content_jsonb?.bg_image_url || '')
  );
  const [act1Title, setAct1Title] = useState(
    String(section.content_jsonb?.act_1_title || 'THE IDEA SPARK')
  );
  const [act1Caption, setAct1Caption] = useState(
    String(
      section.content_jsonb?.act_1_caption ||
        'Every iconic brand and digital product begins as an intentional spark of geometry and narrative focus.'
    )
  );
  const [act2Title, setAct2Title] = useState(
    String(section.content_jsonb?.act_2_title || 'PAPER TO PIXEL ARCHITECTURE')
  );
  const [act2Caption, setAct2Caption] = useState(
    String(
      section.content_jsonb?.act_2_caption ||
        'Editorial typography, grid proportions, and brand identity systems lock into a unified visual language.'
    )
  );
  const [act3Title, setAct3Title] = useState(
    String(section.content_jsonb?.act_3_title || 'INTERACTIVE DIGITAL WORLDS')
  );
  const [act3Caption, setAct3Caption] = useState(
    String(
      section.content_jsonb?.act_3_caption ||
        'Full-stack web engineering, responsive motion, and conversion-focused platforms come alive at 60fps.'
    )
  );
  const [act4Title, setAct4Title] = useState(
    String(section.content_jsonb?.act_4_title || 'COMPOSED HORIZON SETTLE')
  );
  const [act4Caption, setAct4Caption] = useState(
    String(
      section.content_jsonb?.act_4_caption ||
        'Design clarity and technical craft converge into a lasting digital presence built for growth.'
    )
  );

  // Editorial Intro (Chapter 02) custom fields
  const [narrativeText, setNarrativeText] = useState(
    Array.isArray(section.content_jsonb?.narrative_paragraphs)
      ? (section.content_jsonb.narrative_paragraphs as string[]).join('\n\n')
      : ''
  );
  const [pillar1Title, setPillar1Title] = useState(
    String(section.content_jsonb?.pillar_1_title || 'Brand Identity & Graphic Systems')
  );
  const [pillar1Desc, setPillar1Desc] = useState(
    String(
      section.content_jsonb?.pillar_1_desc ||
        'Logos, social media systems, covers, and presentations designed with editorial restraint and purpose.'
    )
  );
  const [pillar2Title, setPillar2Title] = useState(
    String(section.content_jsonb?.pillar_2_title || 'Websites & Business Setup')
  );
  const [pillar2Desc, setPillar2Desc] = useState(
    String(
      section.content_jsonb?.pillar_2_desc ||
        'Responsive websites, Shopify setups, optimized business pages, and LinkedIn authority profiles.'
    )
  );
  const [storyCtaLabel, setStoryCtaLabel] = useState(
    String(section.content_jsonb?.cta_label || 'Read Full Story & Philosophy')
  );
  const [storyCtaHref, setStoryCtaHref] = useState(
    String(section.content_jsonb?.cta_href || '/about')
  );

  // Services Grid (Chapter 03) Interactive Scope Builder fields
  const [showScopeBuilder, setShowScopeBuilder] = useState(
    section.content_jsonb?.show_scope_builder !== false
  );
  const [scopeHeading, setScopeHeading] = useState(
    String(
      section.content_jsonb?.scope_heading ||
        'Assemble Your Custom Creative & Digital Scope'
    )
  );
  const [scopeSubheading, setScopeSubheading] = useState(
    String(
      section.content_jsonb?.scope_subheading ||
        'Click the capabilities you need below to preview deliverables and launch a tailored brief in one click.'
    )
  );

  const [imageUrl, setImageUrl] = useState(
    String(section.content_jsonb?.image_url || '')
  );
  const [imageAlt, setImageAlt] = useState(
    String(section.content_jsonb?.image_alt || section.heading || '')
  );
  const [customHtml, setCustomHtml] = useState(
    String(section.content_jsonb?.custom_html || '')
  );
  const [customCss, setCustomCss] = useState(
    String(section.content_jsonb?.custom_css || '')
  );
  const [pythonTitle, setPythonTitle] = useState(
    String(section.content_jsonb?.python_title || 'Interactive Python 3 Studio')
  );
  const [pythonCode, setPythonCode] = useState(
    String(section.content_jsonb?.python_code || '')
  );

  return (
    <div className="lg:col-span-7 rounded-card border border-border bg-raised p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-accent uppercase">
          INSPECTING: {section.section_key} ({section.type})
        </span>
        <label className="flex items-center gap-2 text-xs font-mono text-fg">
          <input
            type="checkbox"
            data-testid="section-enabled-checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
          />
          <span>Enabled on Public Homepage</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-muted">Chapter Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-muted">Eyebrow Kicker</label>
          <input
            type="text"
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-mono text-muted">Chapter Heading *</label>
        <input
          type="text"
          data-testid="section-heading-input"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-mono text-muted">Subheading / Description</label>
        <textarea
          rows={3}
          data-testid="section-subheading-input"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-fg"
        />
      </div>

      {section.type === 'hero' ? (
        <div className="rounded-xl border border-border bg-canvas/70 p-4 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-accent block">
            10K Cinematic Hero Controls (CTAs, Scroll Video, Background JPG &amp; 4 Story Acts)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Primary Hero CTA Label</label>
              <input
                type="text"
                data-testid="hero-cta-label-input"
                value={primaryCtaLabel}
                onChange={(e) => setPrimaryCtaLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Primary Hero CTA Link</label>
              <input
                type="text"
                value={primaryCtaHref}
                onChange={(e) => setPrimaryCtaHref(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Secondary CTA Label</label>
              <input
                type="text"
                value={secondaryCtaLabel}
                onChange={(e) => setSecondaryCtaLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Secondary CTA Link</label>
              <input
                type="text"
                value={secondaryCtaHref}
                onChange={(e) => setSecondaryCtaHref(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Tertiary CTA Label</label>
              <input
                type="text"
                value={tertiaryCtaLabel}
                onChange={(e) => setTertiaryCtaLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Cinema HUD Caption</label>
              <input
                type="text"
                value={sparkCaption}
                onChange={(e) => setSparkCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-muted">
              Optional Scroll-Scrubbing Hero Video URL (.mp4 / .webm)
            </label>
            <input
              type="text"
              value={heroVideoUrl}
              onChange={(e) => setHeroVideoUrl(e.target.value)}
              placeholder="https://.../hero-scrub.mp4 (Leave empty to use built-in 60fps 3D Cinema Engine)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg font-mono"
            />
          </div>

          <MediaImageField
            label="Full-Bleed Hero Background .JPG Wallpaper (Optional)"
            value={bgImageUrl}
            onChangeUrl={setBgImageUrl}
            mediaAssets={mediaAssets}
            onUploadAsset={onUploadAsset}
            testIdPrefix="hero-bg-image"
            helperText="Upload a full-screen .JPG background behind the 3D Cinema stage."
          />

          <div className="pt-2 border-t border-border/60 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-highlight block">
              4 Choreographed Scroll Story Acts (Scrubber Dock Captions)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-raised/60 space-y-1.5">
                <label className="text-[10px] font-mono text-accent">ACT 01 Title &amp; Caption</label>
                <input
                  type="text"
                  data-testid="hero-act1-title-input"
                  value={act1Title}
                  onChange={(e) => setAct1Title(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg font-mono"
                />
                <textarea
                  rows={2}
                  data-testid="hero-act1-caption-input"
                  value={act1Caption}
                  onChange={(e) => setAct1Caption(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg"
                />
              </div>
              <div className="p-3 rounded-lg border border-border bg-raised/60 space-y-1.5">
                <label className="text-[10px] font-mono text-accent">ACT 02 Title &amp; Caption</label>
                <input
                  type="text"
                  value={act2Title}
                  onChange={(e) => setAct2Title(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg font-mono"
                />
                <textarea
                  rows={2}
                  value={act2Caption}
                  onChange={(e) => setAct2Caption(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg"
                />
              </div>
              <div className="p-3 rounded-lg border border-border bg-raised/60 space-y-1.5">
                <label className="text-[10px] font-mono text-accent">ACT 03 Title &amp; Caption</label>
                <input
                  type="text"
                  value={act3Title}
                  onChange={(e) => setAct3Title(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg font-mono"
                />
                <textarea
                  rows={2}
                  value={act3Caption}
                  onChange={(e) => setAct3Caption(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg"
                />
              </div>
              <div className="p-3 rounded-lg border border-border bg-raised/60 space-y-1.5">
                <label className="text-[10px] font-mono text-accent">ACT 04 Title &amp; Caption</label>
                <input
                  type="text"
                  value={act4Title}
                  onChange={(e) => setAct4Title(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg font-mono"
                />
                <textarea
                  rows={2}
                  value={act4Caption}
                  onChange={(e) => setAct4Caption(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-canvas text-xs text-fg"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {section.type === 'editorial-intro' ? (
        <div className="rounded-xl border border-border bg-canvas/70 p-4 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-accent block">
            Story Narrative &amp; Capability Pillars (Chapter 02 Controls)
          </span>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-muted">
              Narrative Paragraphs (Separate paragraphs with a blank line)
            </label>
            <textarea
              rows={4}
              value={narrativeText}
              onChange={(e) => setNarrativeText(e.target.value)}
              placeholder="Write your main story paragraphs here..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-accent">Pillar 01 Title &amp; Copy</label>
              <input
                type="text"
                value={pillar1Title}
                onChange={(e) => setPillar1Title(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
              <textarea
                rows={2}
                value={pillar1Desc}
                onChange={(e) => setPillar1Desc(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-highlight">Pillar 02 Title &amp; Copy</label>
              <input
                type="text"
                value={pillar2Title}
                onChange={(e) => setPillar2Title(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
              <textarea
                rows={2}
                value={pillar2Desc}
                onChange={(e) => setPillar2Desc(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Story CTA Button Label</label>
              <input
                type="text"
                value={storyCtaLabel}
                onChange={(e) => setStoryCtaLabel(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Story CTA Button Link</label>
              <input
                type="text"
                value={storyCtaHref}
                onChange={(e) => setStoryCtaHref(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg font-mono"
              />
            </div>
          </div>
        </div>
      ) : null}

      {section.type === 'services-grid' ? (
        <div className="rounded-xl border border-border bg-canvas/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-accent">
              Interactive Project Scope Architect (10K Mid-Journey Builder)
            </span>
            <label className="flex items-center gap-2 text-xs font-mono text-fg">
              <input
                type="checkbox"
                checked={showScopeBuilder}
                onChange={(e) => setShowScopeBuilder(e.target.checked)}
              />
              <span>Show Scope Builder</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Scope Builder Heading</label>
              <input
                type="text"
                value={scopeHeading}
                onChange={(e) => setScopeHeading(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">Scope Builder Subheading</label>
              <input
                type="text"
                value={scopeSubheading}
                onChange={(e) => setScopeSubheading(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-canvas text-xs text-fg"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* WordPress-Style Section Image Uploader (JPG/PNG) */}
      <MediaImageField
        label="Section JPG / Visual Image (Optional)"
        value={imageUrl}
        altValue={imageAlt}
        onChangeUrl={setImageUrl}
        onChangeAlt={setImageAlt}
        mediaAssets={mediaAssets}
        onUploadAsset={onUploadAsset}
        testIdPrefix="section-image"
        helperText="Upload a .JPG photo to display inside this homepage section."
      />

      {/* Custom HTML & CSS Builder Block */}
      <div className="rounded-xl border border-border bg-canvas/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-highlight">
            Custom HTML &amp; Scoped CSS Widget (WordPress Custom HTML Block)
          </span>
          <button
            type="button"
            onClick={() =>
              setCustomHtml(
                '<div style="padding:18px;border-radius:16px;border:1px solid var(--border-subtle);background:var(--bg-raised);">\n  <h3 style="font-size:18px;font-weight:600;margin-bottom:6px;">Custom Brand Callout</h3>\n  <p style="font-size:14px;opacity:0.85;">Crafted with custom HTML directly inside the Odyssey CMS.</p>\n</div>'
              )
            }
            className="px-2.5 py-1 rounded bg-raised border border-border text-[11px] font-mono text-accent hover:border-accent"
          >
            Insert Sample HTML Card
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-muted">Custom HTML Code</label>
          <textarea
            rows={4}
            data-testid="section-custom-html-input"
            value={customHtml}
            onChange={(e) => setCustomHtml(e.target.value)}
            placeholder="<div>Write custom HTML widgets, embeds, or cards here...</div>"
            className="w-full px-3 py-2 rounded-lg border border-border bg-canvas font-mono text-xs text-fg"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-muted">Scoped Custom CSS</label>
          <textarea
            rows={2}
            data-testid="section-custom-css-input"
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder=".my-custom-card { border-color: #9B8CFF; }"
            className="w-full px-3 py-2 rounded-lg border border-border bg-canvas font-mono text-xs text-fg"
          />
        </div>
      </div>

      {/* Interactive Python 3 Code Studio Block */}
      <div className="rounded-xl border border-border bg-canvas/70 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-accent">
            Interactive Python 3 Code Studio (Runs Live on Website)
          </span>
          <button
            type="button"
            data-testid="insert-sample-python-btn"
            onClick={() => {
              setPythonTitle('Jahin Azmain — Live Python ROI & Project Estimator');
              setPythonCode(
                'creator = "Jahin Azmain"\ndisciplines = ["Graphic Design", "Web Development", "Digital Marketing"]\nfor item in disciplines:\n  print(f"Active Discipline: {item}")\nrender_html("<div style=\'margin-top:8px;font-weight:600;color:#9B8CFF;\'>Python 3 Output Rendered Live!</div>")'
              );
            }}
            className="px-2.5 py-1 rounded bg-raised border border-border text-[11px] font-mono text-highlight hover:border-highlight"
          >
            Insert Sample Python Script
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-muted">Python Widget Title</label>
          <input
            type="text"
            value={pythonTitle}
            onChange={(e) => setPythonTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-muted">
            Python 3 Script (Supports print(), variables, math, for-loops, f-strings, and render_html())
          </label>
          <textarea
            rows={5}
            data-testid="section-python-code-input"
            value={pythonCode}
            onChange={(e) => setPythonCode(e.target.value)}
            placeholder={'name = "Jahin Azmain"\nprint(f"Created by {name}")'}
            className="w-full px-3 py-2 rounded-lg border border-border bg-canvas font-mono text-xs text-emerald-300"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          data-testid="publish-section-btn"
          onClick={() =>
            onSave({
              id: section.id,
              label,
              eyebrow,
              heading,
              subheading,
              is_enabled: isEnabled,
              content_jsonb: {
                ...section.content_jsonb,
                ...(section.type === 'hero'
                  ? {
                      primary_cta_label: primaryCtaLabel,
                      primary_cta_href: primaryCtaHref,
                      secondary_cta_label: secondaryCtaLabel,
                      secondary_cta_href: secondaryCtaHref,
                      tertiary_cta_label: tertiaryCtaLabel,
                      spark_caption: sparkCaption,
                      hero_video_url: heroVideoUrl.trim(),
                      bg_image_url: bgImageUrl.trim(),
                      act_1_title: act1Title,
                      act_1_caption: act1Caption,
                      act_2_title: act2Title,
                      act_2_caption: act2Caption,
                      act_3_title: act3Title,
                      act_3_caption: act3Caption,
                      act_4_title: act4Title,
                      act_4_caption: act4Caption,
                    }
                  : {}),
                ...(section.type === 'editorial-intro'
                  ? {
                      narrative_paragraphs: narrativeText
                        .split(/\n\s*\n/)
                        .map((p) => p.trim())
                        .filter(Boolean),
                      pillar_1_title: pillar1Title,
                      pillar_1_desc: pillar1Desc,
                      pillar_2_title: pillar2Title,
                      pillar_2_desc: pillar2Desc,
                      cta_label: storyCtaLabel,
                      cta_href: storyCtaHref,
                    }
                  : {}),
                ...(section.type === 'services-grid'
                  ? {
                      show_scope_builder: showScopeBuilder,
                      scope_heading: scopeHeading,
                      scope_subheading: scopeSubheading,
                    }
                  : {}),
                image_url: imageUrl.trim(),
                image_alt: imageAlt.trim(),
                custom_html: customHtml,
                custom_css: customCss,
                python_title: pythonTitle,
                python_code: pythonCode,
              },
            })
          }
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-canvas font-semibold text-xs"
        >
          <Save className="w-4 h-4" />
          <span>Publish Section Changes</span>
        </button>
      </div>
    </div>
  );
}

function SeoRouteCard({
  seo,
  onSave,
}: {
  seo: OdysseyDatabaseState['seo_metadata'][number];
  onSave: (updated: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(seo.title);
  const [description, setDescription] = useState(seo.description);

  return (
    <div className="p-5 rounded-card border border-border bg-raised space-y-3">
      <span className="text-xs font-mono text-accent">ROUTE: {seo.route_key}</span>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
      />
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
      />
      <button
        type="button"
        onClick={() => onSave({ ...seo, title, description })}
        className="px-4 py-2 rounded-lg bg-accent text-canvas font-semibold text-xs"
      >
        Save SEO
      </button>
    </div>
  );
}

function SocialLinkEditorRow({
  social,
  onSave,
}: {
  social: OdysseyDatabaseState['social_links'][number];
  onSave: (updated: Record<string, unknown>) => void;
}) {
  const [url, setUrl] = useState(social.url);
  const [verified, setVerified] = useState(social.is_verified);

  return (
    <div className="p-4 rounded-xl border border-border bg-raised flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <strong className="text-sm text-fg">{social.platform}</strong>
          <label className="flex items-center gap-2 text-xs font-mono text-muted">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            <span>Verified &amp; Public</span>
          </label>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`https://${social.platform.toLowerCase()}.com/...`}
          className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-fg"
        />
      </div>
      <button
        type="button"
        onClick={() =>
          onSave({
            ...social,
            url,
            is_verified: verified && url.trim().length > 0,
            is_visible: verified && url.trim().length > 0,
          })
        }
        className="px-4 py-2 rounded-lg bg-accent text-canvas font-semibold text-xs shrink-0"
      >
        Save
      </button>
    </div>
  );
}

