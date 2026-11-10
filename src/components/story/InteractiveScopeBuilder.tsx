'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowUpRight, MessageSquare, Layers } from 'lucide-react';
import { Service } from '@/lib/schemas';
import { formatWhatsAppUrl } from '@/lib/utils';

export function InteractiveScopeBuilder({
  services,
  whatsappNormalized,
  ownerName,
}: {
  services: Service[];
  whatsappNormalized: string;
  ownerName: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    services.slice(0, 2).map((s) => s.id)
  );

  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeServices = services.filter((s) => selectedIds.includes(s.id));
  const combinedDeliverables = Array.from(
    new Set(activeServices.flatMap((s) => s.deliverables_jsonb || []))
  ).slice(0, 8);

  const scopeTitles = activeServices.map((s) => s.title).join(' + ');
  const estimatedWeeks =
    activeServices.length === 0
      ? 'Select at least 1 discipline'
      : activeServices.length === 1
      ? '1 – 2 Weeks'
      : activeServices.length <= 3
      ? '2 – 4 Weeks'
      : '4 – 6 Weeks (Full Brand & Digital Ecosystem)';

  const whatsappUrl = formatWhatsAppUrl(
    whatsappNormalized,
    `Hi ${ownerName}, I configured a custom project scope on your website: [${
      scopeTitles || 'General Creative Inquiry'
    }]. Let's discuss next steps.`
  );

  return (
    <div
      data-testid="interactive-scope-builder"
      className="rounded-card border border-accent/40 bg-gradient-to-br from-raised/95 via-canvas/95 to-raised/90 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-highlight">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>INTERACTIVE PROJECT ARCHITECT // CONFIGURE YOUR BUILD</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-fg">
            Assemble Your Custom Creative &amp; Digital Scope
          </h3>
          <p className="text-xs sm:text-sm text-muted">
            Click the capabilities you need below to preview deliverables and launch a tailored
            brief in one click.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl border border-border bg-canvas/90 text-right shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
            ESTIMATED CADENCE
          </span>
          <strong className="text-sm font-mono text-accent">{estimatedWeeks}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Toggle Pills */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((srv) => {
            const isSelected = selectedIds.includes(srv.id);
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => toggleService(srv.id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-[0_0_25px_rgba(155,140,255,0.14)]'
                    : 'border-border bg-canvas/70 hover:border-border/90 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-highlight block">
                    {srv.number_label} // {srv.category}
                  </span>
                  <strong className="text-sm font-semibold text-fg block truncate">
                    {srv.title}
                  </strong>
                  <span className="text-xs text-muted line-clamp-1 block">{srv.teaser}</span>
                </div>

                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-accent border-accent text-canvas'
                      : 'border-border bg-raised text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Live Deliverables Blueprint & Instant Launch */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-canvas/90 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>INCLUDED DELIVERABLES ({combinedDeliverables.length})</span>
            </span>
            <span className="text-xs font-mono text-muted">
              {activeServices.length} selected
            </span>
          </div>

          {combinedDeliverables.length === 0 ? (
            <p className="text-xs text-muted py-4">
              Select one or more capabilities on the left to see your custom deliverables list.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {combinedDeliverables.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg border border-border/80 bg-raised text-xs font-mono text-fg"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/contact?service=${encodeURIComponent(
                scopeTitles || 'Custom Project Scope'
              )}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-canvas font-semibold text-xs hover:opacity-95 transition-opacity"
            >
              <span>Send This Scope</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-raised hover:border-highlight text-fg font-mono text-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-highlight" />
              <span>WhatsApp Scope</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

