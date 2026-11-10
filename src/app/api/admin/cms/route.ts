import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { assertAdminApiAuthorized } from '@/lib/auth';
import {
  readFullDbState,
  updateAdminProfileData,
  updateAdminSiteSettings,
  upsertAdminPageSection,
  reorderAdminPageSections,
  restoreAdminContentRevision,
  upsertAdminService,
  deleteAdminService,
  upsertAdminProject,
  deleteAdminProject,
  upsertAdminPost,
  deleteAdminPost,
  upsertAdminSkill,
  deleteAdminSkill,
  upsertAdminExperience,
  deleteAdminExperience,
  upsertAdminEducation,
  deleteAdminEducation,
  upsertAdminTestimonial,
  deleteAdminTestimonial,
  upsertAdminSocialLink,
  upsertAdminNavigationItem,
  deleteAdminNavigationItem,
  upsertAdminSeoMetadata,
  createAdminMediaAsset,
  deleteAdminMediaAsset,
  updateAdminContactMessage,
  deleteAdminContactMessage,
} from '@/lib/db';

function revalidateAllSiteRoutes() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/services');
    revalidatePath('/projects');
    revalidatePath('/blog');
    revalidatePath('/resume');
    revalidatePath('/contact');
    revalidatePath('/admin/dashboard');
  } catch {
    // Ignore outside request context
  }
}

export async function GET() {
  try {
    await assertAdminApiAuthorized();
    const state = await readFullDbState();
    return NextResponse.json({
      success: true,
      state,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'UNAUTHORIZED: Admin authentication required to read CMS state.',
      },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  let adminSession;
  try {
    adminSession = await assertAdminApiAuthorized();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'UNAUTHORIZED: Direct write blocked by server role guard & RLS policy.',
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, payload } = body;
    const actor = adminSession.email;

    switch (action) {
      case 'update_profile': {
        const record = await updateAdminProfileData(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'update_settings': {
        const record = await updateAdminSiteSettings(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'upsert_section': {
        const record = await upsertAdminPageSection(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'reorder_sections': {
        const records = await reorderAdminPageSections(payload.orderedIds, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, records });
      }
      case 'restore_revision': {
        const result = await restoreAdminContentRevision(payload.revisionId, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, result });
      }
      case 'upsert_service': {
        const record = await upsertAdminService(payload, actor);
        revalidateAllSiteRoutes();
        revalidatePath(`/services/${record.slug}`);
        return NextResponse.json({ success: true, record });
      }
      case 'delete_service': {
        await deleteAdminService(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_project': {
        const record = await upsertAdminProject(payload, actor);
        revalidateAllSiteRoutes();
        revalidatePath(`/projects/${record.slug}`);
        return NextResponse.json({ success: true, record });
      }
      case 'delete_project': {
        await deleteAdminProject(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_post': {
        const record = await upsertAdminPost(payload, actor);
        revalidateAllSiteRoutes();
        revalidatePath(`/blog/${record.slug}`);
        return NextResponse.json({ success: true, record });
      }
      case 'delete_post': {
        await deleteAdminPost(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_skill': {
        const record = await upsertAdminSkill(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'delete_skill': {
        await deleteAdminSkill(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_experience': {
        const record = await upsertAdminExperience(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'delete_experience': {
        await deleteAdminExperience(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_education': {
        const record = await upsertAdminEducation(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'delete_education': {
        await deleteAdminEducation(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_testimonial': {
        const record = await upsertAdminTestimonial(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'delete_testimonial': {
        await deleteAdminTestimonial(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_social': {
        const record = await upsertAdminSocialLink(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'upsert_nav': {
        const record = await upsertAdminNavigationItem(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'delete_nav': {
        await deleteAdminNavigationItem(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'upsert_seo': {
        const record = await upsertAdminSeoMetadata(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'upload_media': {
        const record = await createAdminMediaAsset(payload, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true, record });
      }
      case 'delete_media': {
        await deleteAdminMediaAsset(payload.id, actor);
        revalidateAllSiteRoutes();
        return NextResponse.json({ success: true });
      }
      case 'update_message': {
        const record = await updateAdminContactMessage(payload.id, payload.patch, actor);
        revalidatePath('/admin/dashboard');
        return NextResponse.json({ success: true, record });
      }
      case 'delete_message': {
        await deleteAdminContactMessage(payload.id, actor);
        revalidatePath('/admin/dashboard');
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json(
          { success: false, error: `Unknown CMS action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'CMS operation failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

