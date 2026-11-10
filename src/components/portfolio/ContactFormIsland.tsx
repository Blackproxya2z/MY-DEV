'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import {
  ContactSubmissionInputSchema,
  ContactSubmissionInput,
  Service,
} from '@/lib/schemas';

export function ContactFormIsland({
  services = [],
  showServiceField = true,
  showBudgetField = false,
  defaultService = '',
}: {
  services?: Service[];
  showServiceField?: boolean;
  showBudgetField?: boolean;
  defaultService?: string;
}) {
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSubmissionInput>({
    resolver: zodResolver(ContactSubmissionInputSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      service_interest: defaultService,
      budget_range: '',
      message: '',
      website_honeypot: '',
    },
  });

  const onSubmit = async (values: ContactSubmissionInput) => {
    setServerSuccess(null);
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setServerError(
          payload.error || 'Unable to submit your inquiry right now. Please try again or reach out via WhatsApp.'
        );
        return;
      }

      setServerSuccess(
        'Thank you! Your inquiry has been securely saved to Jahin Azmain’s inbox. Expect a thoughtful response soon.'
      );
      reset();
    } catch {
      setServerError(
        'A network error occurred while sending your message. Please try again or use WhatsApp / Email directly.'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-card border border-border bg-raised/90 p-6 sm:p-8 space-y-5"
      aria-label="Project inquiry form"
    >
      {/* Hidden anti-spam honeypot field */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website_honeypot">Leave this field empty</label>
        <input
          id="website_honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website_honeypot')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-muted">
            Your Name *
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="e.g. Tariq Rahman"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-fg text-sm placeholder:text-muted/60 focus:border-accent transition-colors"
            {...register('name')}
          />
          {errors.name ? (
            <p id="contact-name-error" className="text-xs text-rose-400">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-muted">
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-fg text-sm placeholder:text-muted/60 focus:border-accent transition-colors"
            {...register('email')}
          />
          {errors.email ? (
            <p id="contact-email-error" className="text-xs text-rose-400">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="block text-xs font-mono uppercase tracking-wider text-muted">
            Subject *
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder="Brand Identity & Website Redesign"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-fg text-sm placeholder:text-muted/60 focus:border-accent transition-colors"
            {...register('subject')}
          />
          {errors.subject ? (
            <p id="contact-subject-error" className="text-xs text-rose-400">
              {errors.subject.message}
            </p>
          ) : null}
        </div>

        {showServiceField ? (
          <div className="space-y-1.5">
            <label htmlFor="contact-service" className="block text-xs font-mono uppercase tracking-wider text-muted">
              Discipline / Service (Optional)
            </label>
            <select
              id="contact-service"
              className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-fg text-sm focus:border-accent transition-colors"
              {...register('service_interest')}
            >
              <option value="">Select a discipline...</option>
              {services.map((srv) => (
                <option key={srv.id} value={srv.title}>
                  {srv.title}
                </option>
              ))}
              <option value="Multi-Discipline Collaboration">Multi-Discipline Collaboration</option>
            </select>
          </div>
        ) : null}
      </div>

      {showBudgetField ? (
        <div className="space-y-1.5">
          <label htmlFor="contact-budget" className="block text-xs font-mono uppercase tracking-wider text-muted">
            Estimated Project Scope (Optional)
          </label>
          <input
            id="contact-budget"
            type="text"
            placeholder="Optional budget or timeline notes"
            className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-fg text-sm placeholder:text-muted/60"
            {...register('budget_range')}
          />
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-muted">
          Project Details &amp; Goals *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell Jahin about your brand, goals, timeline, and what you would like to build together..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-fg text-sm placeholder:text-muted/60 focus:border-accent transition-colors"
          {...register('message')}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-xs text-rose-400">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div
          role="alert"
          className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      ) : null}

      {serverSuccess ? (
        <div
          role="status"
          className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-sm flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{serverSuccess}</span>
        </div>
      ) : null}

      <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-canvas font-semibold text-sm hover:opacity-95 disabled:opacity-50 transition-opacity min-h-[48px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Sending Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Send Project Inquiry</span>
            </>
          )}
        </button>
        <p className="text-xs font-mono text-muted">
          Direct, private &amp; validated · No spam
        </p>
      </div>
    </form>
  );
}

