'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MotionPreset, ThemeMode, AccentPreset } from '@/lib/schemas';

interface OdysseyExperienceContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  accentPreset: AccentPreset;
  motionPreset: MotionPreset;
  effectiveMotion: MotionPreset;
  prefersReducedMotion: boolean;
  visitorReducedOverride: boolean;
  setVisitorReducedOverride: (reduced: boolean) => void;
}

const OdysseyExperienceContext = createContext<OdysseyExperienceContextValue>({
  themeMode: 'dark',
  setThemeMode: () => {},
  accentPreset: 'cosmic-violet',
  motionPreset: 'cinematic',
  effectiveMotion: 'cinematic',
  prefersReducedMotion: false,
  visitorReducedOverride: false,
  setVisitorReducedOverride: () => {},
});

export function OdysseyExperienceProvider({
  initialTheme = 'dark',
  initialAccent = 'cosmic-violet',
  initialMotion = 'cinematic',
  children,
}: {
  initialTheme?: ThemeMode;
  initialAccent?: AccentPreset;
  initialMotion?: MotionPreset;
  children: React.ReactNode;
}) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);
  const [accentPreset, setAccentPreset] = useState<AccentPreset>(initialAccent);
  const [motionPreset, setMotionPreset] = useState<MotionPreset>(initialMotion);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [visitorReducedOverride, setVisitorReducedOverride] = useState(false);

  useEffect(() => {
    setThemeMode(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    setAccentPreset(initialAccent);
  }, [initialAccent]);

  useEffect(() => {
    setMotionPreset(initialMotion);
  }, [initialMotion]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveMotion: MotionPreset =
    prefersReducedMotion || visitorReducedOverride ? 'off' : motionPreset;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    root.setAttribute('data-accent', accentPreset);
    root.setAttribute('data-motion', effectiveMotion);
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode, accentPreset, effectiveMotion]);

  return (
    <OdysseyExperienceContext.Provider
      value={{
        themeMode,
        setThemeMode,
        accentPreset,
        motionPreset,
        effectiveMotion,
        prefersReducedMotion,
        visitorReducedOverride,
        setVisitorReducedOverride,
      }}
    >
      {children}
    </OdysseyExperienceContext.Provider>
  );
}

export function useOdysseyExperience() {
  return useContext(OdysseyExperienceContext);
}

