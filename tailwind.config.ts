import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        raised: 'var(--bg-raised)',
        elevated: 'var(--bg-elevated)',
        fg: 'var(--text-primary)',
        muted: 'var(--text-secondary)',
        border: 'var(--border-subtle)',
        accent: 'var(--brand-accent)',
        highlight: 'var(--warm-highlight)',
        focus: 'var(--focus-ring)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        odyssey: '1340px',
      },
      borderRadius: {
        card: 'var(--radius-card, 22px)',
      },
    },
  },
  plugins: [],
};

export default config;

