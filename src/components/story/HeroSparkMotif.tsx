'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useOdysseyExperience } from '@/lib/motion';

const LazyDimensionalSpark = dynamic(
  () => import('@/components/story/LazyDimensionalSpark'),
  { ssr: false }
);

export function HeroSparkMotif({
  caption = 'IDEA SPARK // PAPER TO PIXEL',
  portraitUrl,
  ownerName = 'Jahin Azmain',
  enable3D = true,
}: {
  caption?: string;
  portraitUrl?: string | null;
  ownerName?: string;
  enable3D?: boolean;
}) {
  const { effectiveMotion } = useOdysseyExperience();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [canRenderDimensional, setCanRenderDimensional] = useState(false);

  useEffect(() => {
    if (effectiveMotion === 'off') {
      setPointerOffset({ x: 0, y: 0 });
      setCanRenderDimensional(false);
      return;
    }

    const isFinePointer =
      typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
    setCanRenderDimensional(Boolean(enable3D && isFinePointer));

    if (!isFinePointer) return;

    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
      setPointerOffset({ x: normX * 14, y: normY * 14 });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [effectiveMotion, enable3D]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[460px] aspect-square mx-auto flex items-center justify-center select-none overflow-hidden"
      aria-label="Luminous Idea Spark and paper-to-pixel architectural illustration"
    >
      {/* Subtle Ambient Core Glow */}
      <div
        className="absolute inset-8 rounded-full pointer-events-none transition-transform duration-500 ease-out"
        style={{
          background:
            'radial-gradient(circle, var(--spark-glow) 0%, var(--warm-glow) 42%, transparent 72%)',
          transform: `translate3d(${pointerOffset.x * 0.6}px, ${pointerOffset.y * 0.6}px, 0)`,
        }}
      />

      {/* Progressive Enhancement: Lazy-Loaded 3D Polyhedron Constellation */}
      {canRenderDimensional ? <LazyDimensionalSpark /> : null}

      {/* Deterministic CSS/SVG Architectural Constellation (Always present as base & fallback) */}
      <svg
        viewBox="0 0 440 440"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sparkTrailGrad" x1="60" y1="60" x2="380" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.85" />
            <stop offset="55%" stopColor="var(--warm-highlight)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="sparkCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="var(--warm-highlight)" stopOpacity="0.95" />
            <stop offset="75%" stopColor="var(--brand-accent)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Celestial Editorial Ring */}
        <circle
          cx="220"
          cy="220"
          r="192"
          stroke="var(--border-subtle)"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0.7"
        />

        {/* Middle Precision Ring */}
        <circle
          cx="220"
          cy="220"
          r="142"
          stroke="url(#sparkTrailGrad)"
          strokeWidth="1.2"
          opacity="0.55"
        />

        {/* Inner Isometric Paper-to-Pixel Frame */}
        <g
          style={{
            transform: `translate3d(${pointerOffset.x * 0.45}px, ${pointerOffset.y * 0.45}px, 0)`,
            transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Paper Sheet Plane */}
          <polygon
            points="220,86 334,152 220,218 106,152"
            stroke="var(--warm-highlight)"
            strokeWidth="1.25"
            fill="rgba(232, 201, 152, 0.04)"
          />
          {/* Digital Interface Plane */}
          <polygon
            points="220,148 334,214 220,280 106,214"
            stroke="var(--brand-accent)"
            strokeWidth="1.35"
            fill="rgba(155, 140, 255, 0.06)"
          />
          {/* Structural Grid Plane */}
          <polygon
            points="220,210 334,276 220,342 106,276"
            stroke="var(--border-subtle)"
            strokeWidth="1.1"
            strokeDasharray="3 5"
            fill="transparent"
          />

          {/* Vertical Light Thread Connecting Planes */}
          <line
            x1="220"
            y1="52"
            x2="220"
            y2="388"
            stroke="url(#sparkTrailGrad)"
            strokeWidth="1.5"
          />
          <line
            x1="76"
            y1="214"
            x2="364"
            y2="214"
            stroke="var(--border-subtle)"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>

        {/* The Luminous Spark Star */}
        <g
          style={{
            transform: `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0)`,
            transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <circle cx="220" cy="148" r="28" fill="url(#sparkCoreGrad)" />
          <path
            d="M220 112 C222 136, 224 146, 256 148 C224 150, 222 160, 220 184 C218 160, 216 150, 184 148 C216 146, 218 136, 220 112 Z"
            fill="var(--text-primary)"
          />
          <circle cx="334" cy="214" r="4.5" fill="var(--brand-accent)" />
          <circle cx="106" cy="152" r="4" fill="var(--warm-highlight)" />
          <circle cx="220" cy="342" r="3.5" fill="var(--brand-accent)" />
        </g>
      </svg>

      {/* Owner Portrait Frame when uploaded via Admin CMS */}
      {portraitUrl ? (
        <div className="absolute inset-12 sm:inset-14 z-20 rounded-3xl overflow-hidden border-2 border-accent/70 bg-raised/90 shadow-2xl flex items-center justify-center group">
          <img
            src={portraitUrl}
            alt={`${ownerName} portrait`}
            data-testid="hero-portrait-img"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 via-canvas/40 to-transparent p-3 text-center">
            <span className="text-xs font-mono text-fg font-semibold tracking-wider">
              {ownerName}
            </span>
          </div>
        </div>
      ) : null}

      {/* Technical Monospace Coordinate Label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full border border-border bg-raised/85 backdrop-blur-md text-[11px] font-mono tracking-widest uppercase text-muted max-w-[92%] truncate">
        {caption}
      </div>
    </div>
  );
}
