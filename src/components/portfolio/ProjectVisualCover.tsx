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

  if (coverUrl && coverUrl.trim().length > 0) {
    return (
      <div className={`relative overflow-hidden bg-raised ${className}`}>
        <img
          src={coverUrl}
          alt={coverAlt || `${title} project visual`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          loading="lazy"
        />
      </div>
    );
  }

  // Bespoke Architectural Blueprint Vector Cover (PRD Section 3.2 & 4: never fake client screenshots)
  return (
    <div
      className={`relative overflow-hidden bg-raised select-none ${className}`}
      role="img"
      aria-label={coverAlt || `${title} — Architectural Case Study Blueprint`}
    >
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="800" height="500" fill="var(--bg-raised)" />
        {/* Subtle Architectural Grid */}
        <g stroke="var(--border-subtle)" strokeWidth="1" opacity="0.45">
          <line x1="0" y1="100" x2="800" y2="100" />
          <line x1="0" y1="250" x2="800" y2="250" />
          <line x1="0" y1="400" x2="800" y2="400" />
          <line x1="160" y1="0" x2="160" y2="500" />
          <line x1="400" y1="0" x2="400" y2="500" />
          <line x1="640" y1="0" x2="640" y2="500" />
        </g>

        {/* Radial Glow */}
        <circle
          cx="560"
          cy="230"
          r="190"
          fill={palette.primary}
          fillOpacity="0.11"
        />
        <circle
          cx="280"
          cy="290"
          r="140"
          fill={palette.secondary}
          fillOpacity="0.09"
        />

        {/* Isometric Wireframe Planes */}
        <rect
          x="190"
          y="115"
          width="420"
          height="265"
          rx="18"
          stroke={palette.primary}
          strokeWidth="1.5"
          fill="var(--bg-canvas)"
          fillOpacity="0.65"
        />
        <line
          x1="190"
          y1="158"
          x2="610"
          y2="158"
          stroke="var(--border-subtle)"
          strokeWidth="1"
        />
        <circle cx="216" cy="137" r="5" fill={palette.primary} />
        <circle cx="234" cy="137" r="5" fill={palette.secondary} />
        <circle cx="252" cy="137" r="5" fill="var(--border-subtle)" />

        {/* Editorial Typography & Layout Wireframe Inside Blueprint */}
        <rect
          x="224"
          y="188"
          width="170"
          height="14"
          rx="4"
          fill={palette.primary}
          fillOpacity="0.35"
        />
        <rect
          x="224"
          y="214"
          width="260"
          height="24"
          rx="5"
          fill="var(--text-primary)"
          fillOpacity="0.16"
        />
        <rect
          x="224"
          y="256"
          width="110"
          height="84"
          rx="10"
          stroke={palette.secondary}
          strokeWidth="1.2"
          fill={palette.secondary}
          fillOpacity="0.08"
        />
        <rect
          x="348"
          y="256"
          width="110"
          height="84"
          rx="10"
          stroke="var(--border-subtle)"
          strokeWidth="1.2"
          fill="var(--bg-raised)"
        />
        <rect
          x="472"
          y="256"
          width="104"
          height="84"
          rx="10"
          stroke={palette.primary}
          strokeWidth="1.2"
          fill={palette.primary}
          fillOpacity="0.08"
        />
      </svg>

      {/* Top Left Index & Category Pill */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-canvas/85 border border-border text-fg">
          {String(indexNumber).padStart(2, '0')} // {category}
        </span>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-canvas/85 border border-border text-muted">
          Editorial Blueprint
        </span>
      </div>

      {/* Bottom Right Discipline Caption */}
      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-muted pointer-events-none">
        <span className="truncate">{title}</span>
        <span className="text-[10px] uppercase tracking-widest opacity-80">
          {palette.gridLabel}
        </span>
      </div>
    </div>
  );
}

