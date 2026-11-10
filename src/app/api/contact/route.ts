import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { submitPublicContactMessage, readFullDbState } from '@/lib/db';
import { assertAdminApiAuthorized } from '@/lib/auth';
import {
  extractTrustedClientIp,
  hashClientIp,
  verifyCloudflareTurnstile,
} from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawIp = extractTrustedClientIp(request);
    const ipHash = hashClientIp(rawIp);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Verify Cloudflare Turnstile if TURNSTILE_SECRET_KEY is configured in production
    const turnstileCheck = await verifyCloudflareTurnstile(
      body.turnstile_token,
      rawIp
    );
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { success: false, error: turnstileCheck.error },
        { status: 403 }
      );
    }

    const result = await submitPublicContactMessage(body, { ipHash, userAgent });
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    revalidatePath('/admin/dashboard');
    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request payload.' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await assertAdminApiAuthorized();
    const state = await readFullDbState();
    return NextResponse.json({
      success: true,
      messages: state.contact_messages,
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Private contact inbox requires allowlisted admin authentication.',
        },
      },
      { status: 401 }
    );
  }
}
