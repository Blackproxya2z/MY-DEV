import { NextRequest, NextResponse } from 'next/server';
import {
  getAllowedAdminEmail,
  getAdminBootstrapPasscode,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  getAuthenticatedAdmin,
} from '@/lib/auth';
import { mutateDbState } from '@/lib/db';
import {
  extractTrustedClientIp,
  hashClientIp,
  timingSafeStringCompare,
  verifyCloudflareTurnstile,
} from '@/lib/security';

const loginAttempts = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'login';

    if (action === 'logout') {
      clearAdminSessionCookie();
      return NextResponse.json({ success: true });
    }

    if (action === 'reset-password-request') {
      const email = String(body.email || '').trim().toLowerCase();
      if (!timingSafeStringCompare(email, getAllowedAdminEmail())) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email does not match the allowlisted owner account.',
          },
          { status: 403 }
        );
      }
      return NextResponse.json({
        success: true,
        message:
          'Password recovery instructions prepared for allowlisted owner account.',
      });
    }

    // Rate limit login attempts by Cloudflare / Vercel verified client IP
    const rawIp = extractTrustedClientIp(request);
    const clientIpKey = hashClientIp(rawIp);
    const now = Date.now();
    const recent = (loginAttempts.get(clientIpKey) || []).filter(
      (t) => now - t < 60_000
    );
    if (recent.length >= 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many sign-in attempts. Please wait one minute before retrying.',
        },
        { status: 429 }
      );
    }
    recent.push(now);
    loginAttempts.set(clientIpKey, recent);

    // Optional Cloudflare Turnstile check on login if configured
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

    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    const allowedEmail = getAllowedAdminEmail();
    const expectedPasscode = getAdminBootstrapPasscode();

    const emailMatches = timingSafeStringCompare(email, allowedEmail);
    const passMatches = timingSafeStringCompare(password, expectedPasscode);

    if (!emailMatches || !passMatches) {
      await mutateDbState((state) => {
        state.activity_logs.unshift({
          id: `log-auth-fail-${Date.now()}`,
          actor_id: 'anonymous',
          actor_email: email || 'unknown',
          action: 'ADMIN_LOGIN_DENIED',
          entity_type: 'admin_security',
          entity_id: 'auth',
          entity_label: `Rejected login attempt for ${email || 'unknown'}`,
          metadata_jsonb: { ip_hash: clientIpKey },
          created_at: new Date().toISOString(),
        });
      });

      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid credentials or email is not in the allowlisted admin_profiles table.',
        },
        { status: 401 }
      );
    }

    const session = setAdminSessionCookie(email, 'owner');

    await mutateDbState((state) => {
      if (state.admin_profiles[0]) {
        state.admin_profiles[0].last_login_at = new Date().toISOString();
      }
      state.activity_logs.unshift({
        id: `log-auth-ok-${Date.now()}`,
        actor_id: 'owner-uid-001',
        actor_email: email,
        action: 'ADMIN_LOGIN_SUCCESS',
        entity_type: 'admin_security',
        entity_id: 'auth',
        entity_label: 'Owner signed in to Admin CMS',
        metadata_jsonb: { ip_hash: clientIpKey },
        created_at: new Date().toISOString(),
      });
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication request failed.' },
      { status: 400 }
    );
  }
}

export async function GET() {
  const session = await getAuthenticatedAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, session });
}
