'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Film,
  Layers,
  Sparkles,
  Compass,
  Cpu,
} from 'lucide-react';
import { useOdysseyExperience } from '@/lib/motion';

export interface CinematicScrollHeroProps {
  chapterIdx: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  availabilityText?: string;
  isAvailable?: boolean;
  categories?: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  tertiaryCtaLabel: string;
  resumeUrl?: string | null;
  sparkCaption: string;
  portraitUrl?: string | null;
  heroVideoUrl?: string | null;
  ownerName: string;
  ownerRole: string;
  enable3D?: boolean;
  nextAnchor: string;
  isPreviewMode?: boolean;
  children?: React.ReactNode;
}

interface CinemaAct {
  id: string;
  code: string;
  range: [number, number];
  title: string;
  caption: string;
  metric: string;
}

const CINEMA_ACTS: CinemaAct[] = [
  {
    id: 'act-1',
    code: 'ACT I // 00:00.00',
    range: [0, 0.25],
    title: 'THE IDEA SPARK',
    caption:
      'Every iconic brand and digital product begins as an intentional spark of geometry and narrative focus.',
    metric: 'FOCAL LENGTH 35MM · APERTURE F/1.4',
  },
  {
    id: 'act-2',
    code: 'ACT II // 00:01.80',
    range: [0.25, 0.55],
    title: 'PAPER TO PIXEL ARCHITECTURE',
    caption:
      'Editorial typography, grid proportions, and brand identity systems lock into a unified visual language.',
    metric: 'GRID RATIO 12-COL · GOLDEN PROPORTION',
  },
  {
    id: 'act-3',
    code: 'ACT III // 00:03.60',
    range: [0.55, 0.82],
    title: 'INTERACTIVE DIGITAL WORLDS',
    caption:
      'Full-stack web engineering, responsive motion, and conversion-focused platforms come alive at 60fps.',
    metric: 'RENDER PIPELINE 60FPS · LERP 0.12',
  },
  {
    id: 'act-4',
    code: 'ACT IV // 00:05.10',
    range: [0.82, 1.01],
    title: 'COMPOSED HORIZON SETTLE',
    caption:
      'Design clarity and technical craft converge into a lasting digital presence built for growth.',
    metric: 'SETTLE FRAME LOCKED · READY FOR LAUNCH',
  },
];

function formatTimecode(progress: number): string {
  const totalSeconds = Math.max(0, Math.min(6, progress * 6));
  const secs = Math.floor(totalSeconds);
  const frames = Math.floor((totalSeconds - secs) * 60);
  return `00:0${secs}.${String(frames).padStart(2, '0')}`;
}

export function CinematicScrollHero({
  chapterIdx,
  eyebrow,
  heading,
  subheading,
  availabilityText,
  isAvailable,
  categories = [],
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  tertiaryCtaLabel,
  resumeUrl,
  sparkCaption,
  portraitUrl,
  heroVideoUrl,
  ownerName,
  ownerRole,
  enable3D = true,
  nextAnchor,
  isPreviewMode = false,
  children,
}: CinematicScrollHeroProps) {
  const { effectiveMotion, themeMode } = useOdysseyExperience();
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const targetProgressRef = useRef<number>(0.22);
  const displayedProgressRef = useRef<number>(0.22);
  const manualOverrideRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [uiProgress, setUiProgress] = useState<number>(0.22);
  const [isDesktopScrubEnabled, setIsDesktopScrubEnabled] = useState<boolean>(false);

  // Gate 1 & Gate 2 of 10k-websites: Check desktop viewport & motion preference
  useEffect(() => {
    const checkCapabilities = () => {
      const isDesktop = window.innerWidth >= 1024;
      const motionAllowed = effectiveMotion !== 'off';
      setIsDesktopScrubEnabled(isDesktop && motionAllowed && enable3D);
    };
    checkCapabilities();
    window.addEventListener('resize', checkCapabilities, { passive: true });
    return () => window.removeEventListener('resize', checkCapabilities);
  }, [effectiveMotion, enable3D]);

  // Scroll listener updating targetProgressRef
  useEffect(() => {
    if (!isDesktopScrubEnabled) {
      targetProgressRef.current = 0.35;
      displayedProgressRef.current = 0.35;
      setUiProgress(0.35);
      return;
    }

    const handleScroll = () => {
      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const scrolled = -rect.top;
      const clamped = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      if (manualOverrideRef.current !== null && Math.abs(scrolled) > 15) {
        manualOverrideRef.current = null;
      }
      if (manualOverrideRef.current === null) {
        targetProgressRef.current = clamped;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktopScrubEnabled]);

  // 60fps requestAnimationFrame lerp + FULL-BLEED 3D cinema canvas renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let clock = 0;
    let lastUiSync = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const renderFrame = (timestamp: number) => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : 1280;
      const h = parent ? parent.clientHeight : 760;

      // Smooth lerp toward target scroll progress (10k-websites specification: 0.12)
      const target =
        manualOverrideRef.current !== null
          ? manualOverrideRef.current
          : targetProgressRef.current;
      displayedProgressRef.current += (target - displayedProgressRef.current) * 0.12;
      const p = displayedProgressRef.current;

      if (timestamp - lastUiSync > 70) {
        setUiProgress(p);
        lastUiSync = timestamp;
      }

      // Sync optional HTML5 video currentTime if provided
      if (
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        Number.isFinite(videoRef.current.duration) &&
        videoRef.current.duration > 0
      ) {
        const desiredTime = p * videoRef.current.duration;
        if (Math.abs(videoRef.current.currentTime - desiredTime) > 0.04) {
          videoRef.current.currentTime = desiredTime;
        }
      }

      if (effectiveMotion !== 'off') {
        clock += 0.012;
      }

      ctx.clearRect(0, 0, w, h);

      const isLight = themeMode === 'light';
      const primaryRgb = isLight ? '79, 82, 224' : '139, 124, 255';
      const goldRgb = isLight ? '184, 132, 40' : '242, 200, 121';
      const cyanRgb = isLight ? '14, 165, 233' : '72, 202, 228';

      // Position focal 3D monolith in the upper-right stage on desktop so left headline & bottom dock stay completely clear
      const isWide = w >= 1024;
      const cx = (isWide ? w * 0.73 : w * 0.5) + pointerRef.current.x * 20;
      const cy = (isWide ? h * 0.36 : h * 0.44) + pointerRef.current.y * 14 - Math.sin(p * Math.PI) * 14;

      // 1. Full-Bleed Volumetric Cinema Aura
      const bgGlow = ctx.createRadialGradient(
        cx,
        cy,
        18,
        cx,
        cy,
        Math.max(w, h) * (0.45 + p * 0.18)
      );
      bgGlow.addColorStop(0, `rgba(${primaryRgb}, ${isLight ? 0.22 : 0.34})`);
      bgGlow.addColorStop(0.38, `rgba(${goldRgb}, ${isLight ? 0.11 : 0.16})`);
      bgGlow.addColorStop(0.72, `rgba(${cyanRgb}, ${isLight ? 0.04 : 0.06})`);
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      // 2. Full-Viewport Perspective Horizon Grid (scrub-driven camera travel)
      const horizonY = h * (0.72 - p * 0.07);
      ctx.save();
      ctx.lineWidth = 1;

      const gridCols = 16;
      for (let i = -gridCols; i <= gridCols; i++) {
        const spreadTop = i * (36 + p * 22);
        const spreadBottom = i * (145 + p * 85);
        ctx.strokeStyle = `rgba(${primaryRgb}, ${isLight ? 0.1 : 0.14})`;
        ctx.beginPath();
        ctx.moveTo(cx + spreadTop, horizonY);
        ctx.lineTo(cx + spreadBottom, h);
        ctx.stroke();
      }

      for (let row = 0; row < 7; row++) {
        const rowProgress = (row / 7 + p * 1.5) % 1;
        const yPos = horizonY + Math.pow(rowProgress, 1.75) * (h - horizonY);
        ctx.strokeStyle = `rgba(${goldRgb}, ${(1 - rowProgress) * 0.22})`;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(w, yPos);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Large Orbital Gyroscope Rings Sweeping Across the Stage
      const baseRadius = Math.min(w, h) * (isWide ? 0.22 + p * 0.05 : 0.2);
      const ringConfigs = [
        {
          rx: baseRadius * 1.32,
          ry: baseRadius * (0.42 + p * 0.22),
          rot: p * Math.PI * 1.4 + clock * 0.32,
          color: `rgba(${primaryRgb}, 0.48)`,
          dash: [10, 7],
        },
        {
          rx: baseRadius * (0.98 + p * 0.25),
          ry: baseRadius * 0.58,
          rot: -p * Math.PI * 1.15 - clock * 0.24,
          color: `rgba(${goldRgb}, 0.55)`,
          dash: [],
        },
        {
          rx: baseRadius * (0.72 + p * 0.38),
          ry: baseRadius * 0.32,
          rot: p * Math.PI * 2.0 + clock * 0.45,
          color: `rgba(${cyanRgb}, 0.38)`,
          dash: [4, 9],
        },
      ];

      ringConfigs.forEach((ring, rIdx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring.rot);
        ctx.setLineDash(ring.dash);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting luminous satellite on each ring
        const nodeAngle = p * Math.PI * 4 + clock * (1.2 + rIdx * 0.3);
        const nx = Math.cos(nodeAngle) * ring.rx;
        const ny = Math.sin(nodeAngle) * ring.ry;
        ctx.fillStyle = `rgba(${goldRgb}, 0.98)`;
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 4. Floating Holographic Blueprint Portals Around the Monolith
      const portalCards = [
        {
          offsetX: -baseRadius * (0.95 + p * 0.18),
          offsetY: -baseRadius * 0.48,
          width: 136,
          height: 82,
          label: 'BRAND ARCHITECTURE // 01',
          accent: goldRgb,
        },
        {
          offsetX: baseRadius * (0.82 + p * 0.16),
          offsetY: -baseRadius * 0.36,
          width: 142,
          height: 82,
          label: 'FULL-STACK WEB // 02',
          accent: primaryRgb,
        },
        {
          offsetX: -baseRadius * 0.78,
          offsetY: baseRadius * 0.56,
          width: 138,
          height: 76,
          label: '60FPS MOTION // 03',
          accent: cyanRgb,
        },
      ];

      portalCards.forEach((card, idx) => {
        const floatY = Math.sin(clock * 1.6 + idx * 1.8 + p * 5) * 8;
        const x = cx + card.offsetX - card.width / 2;
        const y = cy + card.offsetY + floatY - card.height / 2;

        ctx.save();
        ctx.globalAlpha = isWide ? 0.92 : 0.45;

        // Filament tether line to core
        ctx.strokeStyle = `rgba(${card.accent}, 0.4)`;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x + card.width / 2, y + card.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glassmorphic portal frame
        ctx.fillStyle = isLight
          ? 'rgba(255, 255, 255, 0.86)'
          : 'rgba(13, 17, 28, 0.84)';
        ctx.strokeStyle = `rgba(${card.accent}, 0.72)`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.roundRect(x, y, card.width, card.height, 12);
        ctx.fill();
        ctx.stroke();

        // Internal blueprint bars
        ctx.fillStyle = `rgba(${card.accent}, 0.9)`;
        ctx.fillRect(x + 12, y + 14, 42, 4);
        ctx.fillStyle = isLight
          ? 'rgba(24, 24, 27, 0.35)'
          : 'rgba(244, 245, 248, 0.35)';
        ctx.fillRect(x + 12, y + 26, card.width - 28, 3.5);
        ctx.fillRect(x + 12, y + 36, (card.width - 28) * (0.55 + p * 0.35), 3.5);

        ctx.font = '600 8.5px monospace';
        ctx.fillStyle = `rgba(${card.accent}, 0.98)`;
        ctx.fillText(card.label, x + 12, y + card.height - 12);

        ctx.restore();
      });

      // 5. Central Rotating 3D Crystalline Monolith
      const polyScale = baseRadius * (0.54 + Math.sin(p * Math.PI) * 0.16);
      const rotY = p * Math.PI * 2.6 + clock * 0.68;
      const rotX = 0.38 + p * 0.55;

      const rawVertices = [
        [0, -1.3, 0],
        [1, 0, 0],
        [0, 0, 1],
        [-1, 0, 0],
        [0, 0, -1],
        [0, 1.3, 0],
      ];

      const projected = rawVertices.map(([vx, vy, vz]) => {
        const x1 = vx * Math.cos(rotY) - vz * Math.sin(rotY);
        const z1 = vx * Math.sin(rotY) + vz * Math.cos(rotY);
        const y2 = vy * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = vy * Math.sin(rotX) + z1 * Math.cos(rotX);
        const perspective = 3.2 / (3.2 - z2 * 0.45);
        return {
          x: cx + x1 * polyScale * perspective,
          y: cy + y2 * polyScale * perspective,
        };
      });

      const edges = [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 1],
      ];

      ctx.save();
      ctx.strokeStyle = `rgba(${goldRgb}, 0.92)`;
      ctx.lineWidth = 1.85;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].x, projected[a].y);
        ctx.lineTo(projected[b].x, projected[b].y);
        ctx.stroke();
      });

      projected.forEach((pt, idx) => {
        ctx.fillStyle =
          idx === 0 || idx === 5 ? `rgba(${goldRgb}, 1)` : `rgba(${primaryRgb}, 1)`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, idx === 0 || idx === 5 ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 6. Central Luminous Spark Core
      const coreGlow = ctx.createRadialGradient(cx, cy, 3, cx, cy, 58);
      coreGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
      coreGlow.addColorStop(0.32, `rgba(${goldRgb}, 0.9)`);
      coreGlow.addColorStop(0.7, `rgba(${primaryRgb}, 0.4)`);
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.fill();

      if (effectiveMotion !== 'off') {
        animationFrameId = window.requestAnimationFrame(renderFrame);
      }
    };

    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [effectiveMotion, themeMode]);

  const activeAct =
    CINEMA_ACTS.find(
      (act) => uiProgress >= act.range[0] && uiProgress <= act.range[1]
    ) || CINEMA_ACTS[0];

  const handleSelectAct = (act: CinemaAct) => {
    const midProgress = (act.range[0] + Math.min(1, act.range[1])) / 2;
    manualOverrideRef.current = midProgress;
    targetProgressRef.current = midProgress;
    setUiProgress(midProgress);
  };

  return (
    <div
      ref={runwayRef}
      className={
        isDesktopScrubEnabled
          ? 'relative min-h-[215svh] w-full'
          : 'relative min-h-[calc(100svh-5rem)] w-full'
      }
    >
      <div
        className={
          isDesktopScrubEnabled
            ? 'sticky top-16 md:top-20 min-h-[calc(100svh-5rem)] flex flex-col justify-between py-8 lg:py-10 overflow-hidden'
            : 'relative min-h-[calc(100svh-5rem)] flex flex-col justify-between py-12 md:py-20 overflow-hidden'
        }
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          pointerRef.current = { x: nx, y: ny };
        }}
        onPointerLeave={() => {
          pointerRef.current = { x: 0, y: 0 };
        }}
      >
        {/* FULL-BLEED 100SVH BACKGROUND VIDEO & 60FPS 3D CINEMA STAGE */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {heroVideoUrl ? (
            <video
              ref={videoRef}
              src={heroVideoUrl}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          ) : null}

          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full"
          />

          {/* Soft Radial & Linear Cinema Scrim (10k-websites negative-space law) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/80 to-transparent lg:w-[68%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-canvas to-transparent"
          />
        </div>

        {/* Top Cinema Telemetry Ribbon */}
        <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full border border-accent/40 bg-accent/15 backdrop-blur-md text-[11px] font-mono text-accent tracking-wider uppercase font-semibold">
                {chapterIdx} // PROLOGUE
              </span>
              {isAvailable ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-raised/85 backdrop-blur-md text-[11px] font-mono text-fg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{availabilityText}</span>
                </span>
              ) : null}
            </div>

            {/* Live Scroll Scrub Timecode Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/80 bg-raised/80 backdrop-blur-xl px-3.5 py-1 text-[11px] font-mono shadow-sm">
              <Film className="w-3.5 h-3.5 text-highlight" aria-hidden="true" />
              <span className="text-accent font-semibold">
                {activeAct.code.split('//')[0]}
              </span>
              <span className="text-border">|</span>
              <span className="text-fg tabular-nums">
                {formatTimecode(uiProgress)} / 00:06.00
              </span>
              <span className="text-border hidden lg:inline">|</span>
              <span className="text-muted hidden lg:inline">{activeAct.metric}</span>
            </div>
          </div>
        </div>

        {/* Main 12-Column Split Over Full-Bleed Cinema World */}
        <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-3 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
            {/* Left Negative-Space Editorial Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-highlight flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
                  <span>
                    {eyebrow || `${ownerName.toUpperCase()} / ${ownerRole.toUpperCase()}`}
                  </span>
                </p>

                <h1 className="hero-display-title font-display font-bold text-fg tracking-tight max-w-2xl drop-shadow-sm">
                  {heading}
                </h1>

                <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                  {subheading}
                </p>
              </div>

              {/* Discipline Tags */}
              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3.5 py-1 rounded-full border border-border/90 bg-raised/70 backdrop-blur-md text-xs font-mono text-fg/90"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Three Working CTAs (PRD Section 4) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href={primaryCtaHref}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-canvas font-semibold text-sm hover:opacity-95 transition-all shadow-xl shadow-accent/25 min-h-[48px]"
                >
                  <span>{primaryCtaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-raised/85 backdrop-blur-xl text-fg font-semibold text-sm hover:border-accent transition-colors min-h-[48px]"
                >
                  <span>{secondaryCtaLabel}</span>
                </Link>

                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    download
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border/80 bg-canvas/75 backdrop-blur-xl text-muted hover:text-fg text-sm font-mono transition-colors min-h-[48px]"
                  >
                    <Download className="w-4 h-4 text-highlight" aria-hidden="true" />
                    <span>{tertiaryCtaLabel}</span>
                  </a>
                ) : (
                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border/80 bg-canvas/75 backdrop-blur-xl text-muted hover:text-fg text-sm font-mono transition-colors min-h-[48px]"
                  >
                    <span>View Interactive Resume</span>
                    <ArrowUpRight className="w-4 h-4 text-highlight" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Floating Glassmorphic Story Scrubber Dock & Portrait Overlay */}
            <div className="lg:col-span-5 flex flex-col items-stretch lg:items-end justify-end space-y-4">
              {/* Owner Portrait Card Overlay when uploaded from CMS (.JPG) */}
              {portraitUrl ? (
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-accent/80 shadow-2xl bg-canvas/90 group self-start lg:self-end">
                  <img
                    src={portraitUrl}
                    alt={ownerName}
                    data-testid="hero-portrait-img"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 py-2">
                    <p className="text-[11px] font-mono text-white font-semibold truncate">
                      {ownerName}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Floating Cinema Story Beat & Interactive Scrubber Dock */}
              <div className="w-full max-w-md rounded-2xl border border-border/90 bg-raised/75 backdrop-blur-2xl p-5 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1.5 text-highlight">
                    <Compass className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                    <span>{sparkCaption}</span>
                  </span>
                  <span className="text-accent font-semibold flex items-center gap-1">
                    <Cpu className="w-3 h-3" aria-hidden="true" />
                    <span>60FPS SCRUB</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
                  <span className="px-2.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 text-xs font-mono font-semibold">
                    {activeAct.title}
                  </span>
                  <div className="flex items-center gap-1">
                    {CINEMA_ACTS.map((act, index) => {
                      const isCurrent = act.id === activeAct.id;
                      return (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => handleSelectAct(act)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                            isCurrent
                              ? 'bg-accent text-canvas font-semibold'
                              : 'bg-canvas/70 text-muted hover:text-fg border border-border/60'
                          }`}
                          title={`Scrub to ${act.title}`}
                        >
                          0{index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-fg/90 leading-relaxed">
                  {activeAct.caption}
                </p>

                {/* Interactive Scrub Progress Bar */}
                <div className="space-y-1.5">
                  <div
                    role="slider"
                    tabIndex={0}
                    aria-label="Cinematic hero timeline scrubber"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(uiProgress * 100)}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const next = Math.max(
                        0,
                        Math.min(1, (e.clientX - rect.left) / rect.width)
                      );
                      manualOverrideRef.current = next;
                      targetProgressRef.current = next;
                      setUiProgress(next);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        const next = Math.min(1, uiProgress + 0.1);
                        manualOverrideRef.current = next;
                        targetProgressRef.current = next;
                        setUiProgress(next);
                      } else if (e.key === 'ArrowLeft') {
                        const next = Math.max(0, uiProgress - 0.1);
                        manualOverrideRef.current = next;
                        targetProgressRef.current = next;
                        setUiProgress(next);
                      }
                    }}
                    className="h-1.5 w-full rounded-full bg-canvas border border-border/80 overflow-hidden cursor-pointer relative"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-accent via-highlight to-accent transition-all duration-75"
                      style={{ width: `${Math.max(8, Math.round(uiProgress * 100))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>SCROLL OR CLICK TO SCRUB FRAMES</span>
                    <span>{Math.round(uiProgress * 100)}% SEQUENCE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {children}
        </div>

        {/* Bottom Scroll-to-Explore Horizon Bar */}
        <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
          <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted">
            <a
              href={nextAnchor}
              className="inline-flex items-center gap-2 text-muted hover:text-fg transition-colors py-1"
            >
              <ArrowDown className="w-4 h-4 text-accent animate-bounce" aria-hidden="true" />
              <span>Scroll to scrub sequence &amp; enter Chapter 02</span>
            </a>
            <span className="hidden sm:inline-flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-highlight" aria-hidden="true" />
              <span>
                {isPreviewMode
                  ? 'LIVE SITE EDITOR PREVIEW'
                  : '10K CINEMATIC SCROLL ARCHITECTURE'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
