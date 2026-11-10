'use client';

import React, { useEffect, useState } from 'react';
import { PageSection } from '@/lib/schemas';

export function ChapterProgressIndicator({ sections }: { sections: PageSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || sections.length === 0) return;

    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, currentScroll / docHeight)) : 0;
      setScrollRatio(ratio);

      const viewportMid = window.innerHeight * 0.42;
      let matchedIdx = 0;
      sections.forEach((sec, idx) => {
        const el = document.getElementById(sec.section_key);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportMid) {
            matchedIdx = idx;
          }
        }
      });
      setActiveIndex(matchedIdx);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  if (sections.length === 0) return null;

  const currentSection = sections[activeIndex] || sections[0];
  const chapterNumber = String(activeIndex + 1).padStart(2, '0');
  const totalNumber = String(sections.length).padStart(2, '0');

  return (
    <div
      className="sticky top-16 md:top-20 z-40 w-full bg-canvas/80 backdrop-blur-md border-b border-border/60"
      role="region"
      aria-label="Story chapter progress"
    >
      {/* Thin Top Progress Bar */}
      <div className="w-full h-[2px] bg-raised overflow-hidden">
        <div
          className="h-full bg-accent transition-transform duration-150 origin-left"
          style={{ transform: `scaleX(${scrollRatio})` }}
        />
      </div>

      <div className="max-w-odyssey mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2.5 text-xs font-mono shrink-0">
          <span className="px-2 py-0.5 rounded bg-raised border border-border text-accent font-semibold">
            {chapterNumber} / {totalNumber}
          </span>
          <span className="text-fg font-medium truncate max-w-[230px] sm:max-w-none">
            {currentSection.label}
          </span>
        </div>

        {/* Accessible Chapter Anchor Pills */}
        <nav aria-label="Chapter anchors" className="hidden lg:flex items-center gap-1.5">
          {sections.map((sec, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <a
                key={sec.id}
                href={`#${sec.section_key}`}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  isCurrent
                    ? 'bg-accent/15 text-accent border border-accent/40 font-semibold'
                    : 'text-muted hover:text-fg hover:bg-raised'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

