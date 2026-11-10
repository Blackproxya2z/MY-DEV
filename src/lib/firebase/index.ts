import crypto from 'crypto';
import { OdysseyDatabaseState } from '@/lib/schemas';

/**
 * Production Firebase Persistence Adapter (Supports Cloud Firestore & Firebase Realtime Database)
 * Uses native Node.js RSA-SHA256 JWT signing for Google OAuth2 Service Account authentication,
 * keeping cold-start bundle size tiny on Vercel Serverless Functions.
 */

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let cachedServiceToken: CachedToken | null = null;

export function isFirebaseConfigured(): boolean {
  const hasRealtimeUrl = Boolean(
    process.env.FIREBASE_DATABASE_URL &&
      process.env.FIREBASE_DATABASE_URL.startsWith('https://')
  );
  const hasServiceAccount = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
  return hasRealtimeUrl || hasServiceAccount;
}

export function getActiveDatabaseProvider(): 'firebase' | 'supabase' | 'local-file' {
  if (isFirebaseConfigured()) return 'firebase';
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return 'supabase';
  }
  return 'local-file';
}

function formatPrivateKey(rawKey: string): string {
  return rawKey.replace(/\\n/g, '\n').trim();
}

async function getFirebaseGoogleAccessToken(): Promise<string | null> {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) return null;

  if (cachedServiceToken && Date.now() < cachedServiceToken.expiresAt - 60_000) {
    return cachedServiceToken.accessToken;
  }

  try {
    const nowSec = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      iat: nowSec,
      exp: nowSec + 3600,
      scope: [
        'https://www.googleapis.com/auth/datastore',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/firebase.database',
      ].join(' '),
    };

    const encodeB64Url = (obj: unknown) =>
      Buffer.from(JSON.stringify(obj), 'utf8').toString('base64url');

    const unsignedJwt = `${encodeB64Url(header)}.${encodeB64Url(claimSet)}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedJwt);
    const signature = signer.sign(formatPrivateKey(privateKeyRaw), 'base64url');
    const assertion = `${unsignedJwt}.${signature}`;

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }).toString(),
      cache: 'no-store',
    });

    if (!response.ok) return null;
    const tokenData = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
    };

    if (!tokenData.access_token) return null;
    cachedServiceToken = {
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + (tokenData.expires_in || 3600) * 1000,
    };
    return cachedServiceToken.accessToken;
  } catch {
    return null;
  }
}

export async function readFirebaseState(): Promise<OdysseyDatabaseState | null> {
  if (!isFirebaseConfigured()) return null;

  // 1. Try Firebase Realtime Database if FIREBASE_DATABASE_URL is configured
  const dbUrl = process.env.FIREBASE_DATABASE_URL?.replace(/\/$/, '');
  if (dbUrl) {
    try {
      const secret = process.env.FIREBASE_DATABASE_SECRET;
      const accessToken = !secret ? await getFirebaseGoogleAccessToken() : null;
      const url = new URL(`${dbUrl}/odyssey_cms/state.json`);
      if (secret) url.searchParams.set('auth', secret);
      else if (accessToken) url.searchParams.set('access_token', accessToken);

      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as OdysseyDatabaseState | null;
        if (data && Array.isArray(data.profiles) && data.profiles.length > 0) {
          return data;
        }
      }
    } catch {
      // Fall through to Firestore
    }
  }

  // 2. Try Cloud Firestore REST API using Service Account OAuth2 Token
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (projectId) {
    try {
      const token = await getFirebaseGoogleAccessToken();
      if (!token) return null;

      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/odyssey_cms/production_state`;
      const res = await fetch(firestoreUrl, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const doc = (await res.json()) as {
          fields?: { payload_json?: { stringValue?: string } };
        };
        const rawJson = doc.fields?.payload_json?.stringValue;
        if (rawJson) {
          const parsed = JSON.parse(rawJson) as OdysseyDatabaseState;
          if (parsed && Array.isArray(parsed.profiles)) {
            return parsed;
          }
        }
      }
    } catch {
      return null;
    }
  }

  return null;
}

export async function writeFirebaseState(state: OdysseyDatabaseState): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;

  // 1. Firebase Realtime Database write
  const dbUrl = process.env.FIREBASE_DATABASE_URL?.replace(/\/$/, '');
  if (dbUrl) {
    try {
      const secret = process.env.FIREBASE_DATABASE_SECRET;
      const accessToken = !secret ? await getFirebaseGoogleAccessToken() : null;
      const url = new URL(`${dbUrl}/odyssey_cms/state.json`);
      if (secret) url.searchParams.set('auth', secret);
      else if (accessToken) url.searchParams.set('access_token', accessToken);

      const res = await fetch(url.toString(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
        cache: 'no-store',
      });
      if (res.ok) return true;
    } catch {
      // Fall through to Firestore
    }
  }

  // 2. Cloud Firestore document write
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (projectId) {
    try {
      const token = await getFirebaseGoogleAccessToken();
      if (!token) return false;

      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/odyssey_cms/production_state`;
      const res = await fetch(firestoreUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            payload_json: { stringValue: JSON.stringify(state) },
            updated_at: { timestampValue: new Date().toISOString() },
          },
        }),
        cache: 'no-store',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  return false;
}

