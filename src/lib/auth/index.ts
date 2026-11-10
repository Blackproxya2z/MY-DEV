import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

const SESSION_COOKIE_NAME = 'odyssey_admin_session';

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'odyssey-local-server-hmac-secret-2026-jahin';
}

export function getAllowedAdminEmail(): string {
  return (process.env.ADMIN_ALLOWED_EMAIL || 'azmain56@gmail.com').trim().toLowerCase();
}

export function getAdminBootstrapPasscode(): string {
  return process.env.ADMIN_BOOTSTRAP_PASSCODE || 'OdysseyAdmin2026!';
}

export interface AdminSessionPayload {
  email: string;
  role: 'owner' | 'admin';
  issuedAt: number;
  expiresAt: number;
}

export function signAdminToken(payload: AdminSessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

export function verifyAdminToken(token?: string | null): AdminSessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(data)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as AdminSessionPayload;
    if (Date.now() > parsed.expiresAt) return null;
    if (parsed.email.toLowerCase() !== getAllowedAdminEmail()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin(): Promise<AdminSessionPayload | null> {
  // 1. Check signed HttpOnly server session cookie
  try {
    const cookieStore = cookies();
    const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const verified = verifyAdminToken(rawCookie);
    if (verified) return verified;
  } catch {
    // Outside request context
  }

  // 2. If Supabase is configured, also check Supabase Auth session + admin_profiles allowlist
  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseServerClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email && user.email.toLowerCase() === getAllowedAdminEmail()) {
          const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('email, role, is_active')
            .eq('email', user.email.toLowerCase())
            .eq('is_active', true)
            .maybeSingle();

          if (adminProfile) {
            return {
              email: adminProfile.email,
              role: (adminProfile.role as 'owner' | 'admin') || 'owner',
              issuedAt: Date.now(),
              expiresAt: Date.now() + 1000 * 60 * 60 * 12,
            };
          }
        }
      }
    } catch {
      // Fall through to null
    }
  }

  return null;
}

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await getAuthenticatedAdmin();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

export async function assertAdminApiAuthorized(): Promise<AdminSessionPayload> {
  const session = await getAuthenticatedAdmin();
  if (!session) {
    throw new Error('UNAUTHORIZED_ADMIN_ACCESS');
  }
  return session;
}

export function setAdminSessionCookie(email: string, role: 'owner' | 'admin' = 'owner') {
  const payload: AdminSessionPayload = {
    email: email.toLowerCase(),
    role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  };
  const token = signAdminToken(payload);
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return payload;
}

export function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

