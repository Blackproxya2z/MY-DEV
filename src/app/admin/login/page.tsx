'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetNotice(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication denied.');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Unable to reach authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setResetNotice(null);
    if (!email.trim()) {
      setError('Enter the allowlisted owner email address first to request password recovery.');
      return;
    }

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reset-password-request',
        email,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setError(data.error || 'Password reset denied.');
      return;
    }
    setResetNotice(data.message);
  };

  return (
    <main
      id="main-content"
      className="min-h-svh flex flex-col items-center justify-center px-4 py-16 cosmic-grid-backdrop"
    >
      <div className="w-full max-w-md rounded-card border border-border bg-raised/95 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-fg"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-accent" />
            <span>Public Odyssey</span>
          </Link>
          <span className="px-2.5 py-1 rounded-full border border-border bg-canvas text-[10px] font-mono text-highlight">
            ALLOWLISTED OWNER ACCESS
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-11 h-11 rounded-2xl border border-border bg-canvas flex items-center justify-center text-accent">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-fg flex items-center gap-2 pt-1">
            <span>Odyssey Admin CMS</span>
            <Sparkles className="w-4 h-4 text-highlight" aria-hidden="true" />
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Private content management system for Jahin Azmain. Public sign-up is disabled; only
            the allowlisted owner profile may authenticate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-xs font-mono text-muted">
              Owner Email *
            </label>
            <input
              id="admin-email"
              data-testid="admin-login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="azmain56@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-sm text-fg"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-xs font-mono text-muted">
              Owner Passcode *
            </label>
            <input
              id="admin-password"
              data-testid="admin-login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-sm text-fg"
            />
          </div>

          {error ? (
            <div
              role="alert"
              className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          {resetNotice ? (
            <div
              role="status"
              className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{resetNotice}</span>
            </div>
          ) : null}

          <button
            type="submit"
            data-testid="admin-login-submit"
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-xl bg-accent text-canvas font-semibold text-sm hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Verifying Owner Identity...' : 'Sign In to Admin Dashboard'}
          </button>
        </form>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-muted hover:text-fg underline"
          >
            Reset Owner Passcode
          </button>
          <span className="text-muted">RLS Protected</span>
        </div>
      </div>
    </main>
  );
}

