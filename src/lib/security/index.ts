import crypto from 'crypto';
import type { NextRequest } from 'next/server';

/**
 * Cloudflare, Vercel & Production Security Utilities
 * - Extracts verified client IP via Cloudflare `cf-connecting-ip` or Vercel `x-real-ip`
 * - Hashes IPs with a server secret salt (GDPR-safe rate limiting)
 * - Verifies Cloudflare Turnstile anti-bot tokens when TURNSTILE_SECRET_KEY is configured
 * - Constant-time string comparison to prevent timing side-channel attacks
 */

export function extractTrustedClientIp(request: NextRequest | Request): string {
  const headers = request.headers;
  // 1. Cloudflare's verified connecting IP
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim()) return cfIp.trim();

  // 2. Vercel's verified edge IP
  const vercelIp = headers.get('x-real-ip');
  if (vercelIp && vercelIp.trim()) return vercelIp.trim();

  // 3. Standard proxy forwarded IP (first hop)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  return '127.0.0.1';
}

export function hashClientIp(rawIp: string): string {
  const salt = process.env.ADMIN_SESSION_SECRET || 'odyssey-ip-privacy-salt-2026';
  return crypto
    .createHmac('sha256', salt)
    .update(rawIp)
    .digest('hex')
    .slice(0, 20);
}

export function timingSafeStringCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB) && a.length === b.length;
}

export async function verifyCloudflareTurnstile(
  token?: string | null,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
  // If Turnstile secret is not configured yet, pass through and rely on honeypot + rate limit
  if (!secretKey) {
    return { success: true };
  }

  if (!token || !token.trim()) {
    return {
      success: false,
      error: 'Security verification (Cloudflare Turnstile) is required.',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.set('secret', secretKey);
    formData.set('response', token.trim());
    if (remoteIp) formData.set('remoteip', remoteIp);

    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return {
        success: false,
        error: 'Unable to validate Cloudflare Turnstile challenge.',
      };
    }

    const outcome = (await res.json()) as { success?: boolean };
    if (!outcome.success) {
      return {
        success: false,
        error: 'Cloudflare security challenge failed. Please refresh and try again.',
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: 'Error communicating with Cloudflare Turnstile verification service.',
    };
  }
}

