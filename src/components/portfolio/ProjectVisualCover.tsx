import React from 'react';

const BACKDROP_PALETTES: Record<
  string,
  { primary: string; secondary: string; gridLabel: string }
> = {
  'cosmic-indigo': {
    primary: '#9B8CFF',
    secondary: '#E8C998',
    gridLabel: 'STOREFRONT & IDENTITY ARCHITECTURE',
  },
  'warm-amber': {
    primary: '#E8C998',
    secondary: '#D48C70',
    gridLabel: 'EDITORIAL BEAUTY & SOCIAL SYSTEM',
  },
  'violet-nebula': {
    primary: '#8B74FF',
    secondary: '#5CE1E6',
    gridLabel: 'DARK-MODE MEDIA & MESSAGING SYSTEM',
  },
  'emerald-grid': {
    primary: '#6EE7B7',
    secondary: '#9B8CFF',
    gridLabel: 'TECH PRODUCT CATALOG ARCHITECTURE',
  },
  'crimson-copper': {
    primary: '#F4A261',
    secondary: '#E76F51',
    gridLabel: 'HOSPITALITY & CAMPAIGN VISUAL SYSTEM',
  },
  'royal-gold': {
    primary: '#E8C998',
    secondary: '#9B8CFF',
    gridLabel: 'ORGANIZATIONAL IDENTITY & GUIDANCE HUB',
  },
};

export function ProjectVisualCover({
  title,
  category,
  coverUrl,
  coverAlt,
  themeBackdrop = 'cosmic-indigo',
  indexNumber = 1,
  className = '',
}: {
  title: string;
  category: string;
  coverUrl?: string | null;
  coverAlt?: string;
  themeBackdrop?: string;
  indexNumber?: number;
  className?: string;
}) {
  const palette = BACKDROP_PALETTES[themeBackdrop] || BACKDROP_PALETTES['cosmic-indigo'];
  const gradientId = `proj-grad-${indexNumber}-${themeBackdrop}`;

  if (coverUrl && coverUrl.trim().length > 0) {
    return (
      <div className={`relative overflow-hidden bg-raised ${className}`}>
        <img
          src={coverUrl}
          alt={coverAlt || `${title} project visual`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-raised select-none ${className}`}
      role="img"
      aria-label={coverAlt || `${title} — Architectural Case Study Blueprint`}
    >
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`${gradientId}-a`} cx="70%" cy="35%" r="65%">
            <stop offset="0%" stopColor={palette.primary} stopOpacity="0.34" />
            <stop offset="55%" stopColor={palette.secondary} stopOpacity="0.12" />
            <stop offset="100%" stopColor="#090B12" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gradientId}-b`} cx="25%" cy="75%" r="55%">
            <stop offset="0%" stopColor={palette.secondary} stopOpacity="0.26" />
            <stop offset="100%" stopColor="#090B12" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="500" fill="var(--bg-raised)" />
        <rect width="800" height="500" fill={`url(#${gradientId}-a)`} />
        <rect width="800" height="500" fill={`url(#${gradientId}-b)`} />

        {/* Perspective Cinema Horizon Grid */}
        <g stroke="var(--border-subtle)" strokeWidth="1" opacity="0.5">
          <line x1="0" y1="90" x2="800" y2="90" />
          <line x1="0" y1="250" x2="800" y2="250" />
          <line x1="0" y1="410" x2="800" y2="410" />
          <line x1="140" y1="0" x2="140" y2="500" />
          <line x1="400" y1="0" x2="400" y2="500" />
          <line x1="660" y1="0" x2="660" y2="500" />
        </g>

        {/* Orbital Ring Motif */}
        <ellipse
          cx="490"
          cy="245"
          rx="230"
          ry="95"
          transform="rotate(-14 490 245)"
          stroke={palette.primary}
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <ellipse
          cx="490"
          cy="245"
          rx="165"
          ry="68"
          transform="rotate(18 490 245)"
          stroke={palette.secondary}
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />

        {/* Back Floating Glass Window */}
        <rect
          x="235"
          y="88"
          width="430"
          height="260"
          rx="20"
          stroke={palette.secondary}
          strokeOpacity="0.45"
          strokeWidth="1.2"
          fill="var(--bg-canvas)"
          fillOpacity="0.55"
        />

        {/* Primary Foreground Flagship Window */}
        <rect
          x="145"
          y="122"
          width="460"
          height="278"
          rx="20"
          stroke={palette.primary}
          strokeWidth="1.8"
          fill="var(--bg-canvas)"
          fillOpacity="0.88"
        />
        <line
          x1="145"
          y1="164"
          x2="605"
          y2="164"
          stroke="var(--border-subtle)"
          strokeWidth="1"
        />
        <circle cx="172" cy="143" r="5" fill={palette.primary} />
        <circle cx="190" cy="143" r="5" fill={palette.secondary} />
        <circle cx="208" cy="143" r="5" fill="var(--border-subtle)" />

        {/* Architectural Brand Layout Inside Window */}
        <rect
          x="180"
          y="192"
          width="145"
          height="12"
          rx="6"
          fill={palette.primary}
          fillOpacity="0.65"
        />
        <rect
          x="180"
          y="216"
          width="290"
          height="26"
          rx="6"
          fill="var(--text-primary)"
          fillOpacity="0.22"
        />
        <rect
          x="180"
          y="258"
          width="124"
          height="104"
          rx="12"
          stroke={palette.secondary}
          strokeWidth="1.4"
          fill={palette.secondary}
          fillOpacity="0.14"
        />
        <rect
          x="316"
          y="258"
          width="124"
          height="104"
          rx="12"
          stroke={palette.primary}
          strokeWidth="1.4"
          fill={palette.primary}
          fillOpacity="0.12"
        />
        <rect
          x="452"
          y="258"
          width="118"
          height="104"
          rx="12"
          stroke="var(--border-subtle)"
          strokeWidth="1.2"
          fill="var(--bg-raised)"
        />
      </svg>

      {/* Top Left Index & Category Pill */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-canvas/85 backdrop-blur-md border border-border text-fg font-semibold">
          {String(indexNumber).padStart(2, '0')} // {category}
        </span>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-canvas/80 backdrop-blur-md border border-border text-highlight">
          Case Study
        </span>
      </div>

      {/* Bottom Right Discipline Caption */}
      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-muted pointer-events-none">
        <span className="truncate text-fg font-semibold">{title}</span>
        <span className="text-[10px] uppercase tracking-widest text-accent">
          {palette.gridLabel}
        </span>
      </div>
    </div>
  );
}
