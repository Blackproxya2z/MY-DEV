import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="min-h-svh flex flex-col items-center justify-center px-4 py-20 cosmic-grid-backdrop text-center"
    >
      <div className="max-w-lg w-full rounded-card border border-border bg-raised/90 p-8 sm:p-12 space-y-6">
        <div className="w-12 h-12 rounded-2xl border border-border bg-canvas flex items-center justify-center mx-auto text-accent">
          <Compass className="w-6 h-6" aria-hidden="true" />
        </div>

        <p className="text-xs font-mono uppercase tracking-widest text-highlight">
          404 // UNCHARTED COORDINATE
        </p>

        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-fg">
          This Chapter Does Not Exist Yet.
        </h1>

        <p className="text-sm sm:text-base text-muted leading-relaxed">
          The page or case study you requested may have been archived, moved, or remains in private
          draft review. Return to the main odyssey below.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-canvas font-semibold text-sm hover:opacity-95 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Return to Home Odyssey</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-canvas text-fg font-medium text-sm hover:border-accent transition-colors"
          >
            <Sparkles className="w-4 h-4 text-highlight" aria-hidden="true" />
            <span>Explore Portfolio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

