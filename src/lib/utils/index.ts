import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatWhatsAppUrl(phoneNormalized: string, message?: string): string {
  const digits = phoneNormalized.replace(/[^0-9]/g, '') || '8801647236359';
  const baseUrl = `https://wa.me/${digits}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

export function formatDateReadable(isoDate?: string | null): string {
  if (!isoDate) return 'Draft';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export function sanitizeRichHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return '';
  // Strip script, iframe, object, embed, style tags and inline event handlers
  return dirtyHtml
    .replace(/<(script|iframe|object|embed|style|form|input|button)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed|style|form|input|button)[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function estimateReadingTime(textOrHtml: string): number {
  const plain = textOrHtml.replace(/<[^>]+>/g, ' ').trim();
  if (!plain) return 1;
  const words = plain.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

