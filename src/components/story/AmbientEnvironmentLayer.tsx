'use client';

import React, { useEffect, useState } from 'react';
import { useOdysseyExperience } from '@/lib/motion';

/**
 * 10K-Websites Standard:
 * - Fixed background environment layer with whisper-level drifting particles
 * - Continuous scroll-driven SVG vector filament that draws itself down the viewport
 */
export function AmbientEnvironmentLayer() {
  const { effectiveMotion } = useOdysseyExperience();
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    if (effectiveMotion === 'off') return;

    let rafId = 0;
    const updateScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const nextRatio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setScrollRatio(nextRatio);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [effectiveMotion]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Whisper-Level Atmospheric Radial Nebulae */}
      <div
        className="absolute -top-36 -left-36 w-[560px] h-[560px] rounded-full opacity-35 blur-3xl transition-transform duration-700"
        style={{
          background: 'radial-gradient(circle, var(--spark-glow) 0%, transparent 70%)',
          transform:
            effectiveMotion === 'off'
              ? 'none'
              : `translate3d(${scrollRatio * 60}px, ${scrollRatio * 90}px, 0)`,
        }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl transition-transform duration-700"
        style={{
          background: 'radial-gradient(circle, var(--warm-glow) 0%, transparent 72%)',
          transform:
            effectiveMotion === 'off'
              ? 'none'
              : `translate3d(-${scrollRatio * 50}px, ${scrollRatio * 70}px, 0)`,
        }}
      />

      {/* Subtle Whisper Dust Motes */}
      <svg
        viewBox="0 0 1440 900"
        className="w-full h-full opacity-35"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="var(--warm-highlight)">
          <circle cx="180" cy="140" r="1.2" opacity="0.5" />
          <circle cx="420" cy="280" r="1.5" opacity="0.35" />
          <circle cx="860" cy="190" r="1.3" opacity="0.45" />
          <circle cx="1190" cy="340" r="1.6" opacity="0.4" />
          <circle cx="310" cy="640" r="1.2" opacity="0.35" />
          <circle cx="980" cy="710" r="1.4" opacity="0.45" />
          <circle cx="1310" cy="620" r="1.1" opacity="0.35" />
        </g>
        <g fill="var(--brand-accent)">
          <circle cx="640" cy="110" r="1.4" opacity="0.4" />
          <circle cx="240" cy="460" r="1.3" opacity="0.35" />
          <circle cx="740" cy="520" r="1.6" opacity="0.3" />
          <circle cx="1120" cy="160" r="1.2" opacity="0.45" />
          <circle cx="540" cy="790" r="1.5" opacity="0.35" />
        </g>
      </svg>

      {/* Self-Drawing Vertical Story Thread on Left Margin (Desktop) */}
      <div className="hidden xl:block absolute left-6 top-24 bottom-12 w-[2px] bg-border/30">
        <div
          className="w-full bg-gradient-to-b from-accent via-highlight to-accent transition-all duration-150"
          style={{ height: `${Math.round(scrollRatio * 100)}%` }}
        />
        <div
          className="w-2.5 h-2.5 -left-[4px] rounded-full bg-highlight shadow-[0_0_12px_var(--warm-highlight)] absolute transition-all duration-150"
          style={{ top: `${Math.round(scrollRatio * 100)}%` }}
        />
      </div>
    </div>
  );
}

