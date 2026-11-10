import { describe, it, expect } from 'vitest';
import {
  slugify,
  formatWhatsAppUrl,
  sanitizeRichHtml,
  estimateReadingTime,
} from '@/lib/utils';
import { ContactSubmissionInputSchema } from '@/lib/schemas';
import { timingSafeStringCompare, hashClientIp } from '@/lib/security';
import { getActiveDatabaseProvider } from '@/lib/db';

describe('Utility & Security Helpers', () => {
  it('slugifies titles cleanly into URL-safe slugs', () => {
    expect(slugify('OTT HOUSE HOLDER!')).toBe('ott-house-holder');
    expect(slugify('  Glossy Beauty Parlour & Spa  ')).toBe('glossy-beauty-parlour-spa');
  });

  it('normalizes WhatsApp deep links with prefilled text', () => {
    const url = formatWhatsAppUrl('8801647236359', 'Hello Jahin');
    expect(url).toBe('https://wa.me/8801647236359?text=Hello%20Jahin');
  });

  it('strips malicious script tags, iframes, and inline event handlers from rich HTML', () => {
    const dirty =
      '<h2>Safe Heading</h2><script>alert("xss")</script><p onclick="steal()">Paragraph</p><iframe src="https://evil.test"></iframe>';
    const clean = sanitizeRichHtml(dirty);
    expect(clean).toContain('<h2>Safe Heading</h2>');
    expect(clean).toContain('<p>Paragraph</p>');
    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('<iframe');
  });

  it('estimates reading time accurately', () => {
    const shortHtml = '<p>Short note with ten words for quick reading estimation.</p>';
    expect(estimateReadingTime(shortHtml)).toBe(1);
  });

  it('validates contact submission payloads with Zod', () => {
    const invalid = ContactSubmissionInputSchema.safeParse({
      name: 'A',
      email: 'not-an-email',
      subject: 'Hi',
      message: 'Too short',
    });
    expect(invalid.success).toBe(false);

    const valid = ContactSubmissionInputSchema.safeParse({
      name: 'Nadia Islam',
      email: 'nadia@example.com',
      subject: 'Brand Identity & Website Inquiry',
      service_interest: 'Graphic Design & Branding',
      message: 'We are launching a retail store and need a complete brand identity and website.',
    });
    expect(valid.success).toBe(true);
  });

  it('performs constant-time string comparison and privacy-safe IP hashing', () => {
    expect(timingSafeStringCompare('OdysseyAdmin2026!', 'OdysseyAdmin2026!')).toBe(true);
    expect(timingSafeStringCompare('OdysseyAdmin2026!', 'wrong-passcode')).toBe(false);

    const hashed1 = hashClientIp('203.0.113.42');
    const hashed2 = hashClientIp('203.0.113.42');
    expect(hashed1).toHaveLength(20);
    expect(hashed1).toBe(hashed2);
    expect(hashed1).not.toContain('203.0.113.42');
  });

  it('reports active database provider accurately', () => {
    const provider = getActiveDatabaseProvider();
    expect(['firebase', 'supabase', 'local']).toContain(provider);
  });
});
