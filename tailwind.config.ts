import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        surface: 'var(--color-surface)',
        hairline: 'var(--color-hairline)',
        mute: 'var(--color-mute)',
        fog: 'var(--color-fog)',
        peru: 'var(--color-peru)',
        ethiopia: 'var(--color-ethiopia)',
        colombia: 'var(--color-colombia)',
        brazil: 'var(--color-brazil)',
        live: 'var(--color-live)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['96px', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-l': ['64px', { lineHeight: '0.95', letterSpacing: '-0.030em' }],
        'display-m': ['46px', { lineHeight: '1.00', letterSpacing: '-0.025em' }],
        'h1': ['40px', { lineHeight: '1.05', letterSpacing: '-0.030em' }],
        'h2': ['30px', { lineHeight: '1.10', letterSpacing: '-0.025em' }],
        'h3': ['22px', { lineHeight: '1.20', letterSpacing: '-0.015em' }],
        'lead': ['18px', { lineHeight: '1.55', letterSpacing: '0' }],
        'body': ['16px', { lineHeight: '1.65', letterSpacing: '0' }],
        'caption': ['13px', { lineHeight: '1.45', letterSpacing: '0.02em' }],
        'eyebrow': ['10px', { lineHeight: '1.20', letterSpacing: '0.22em' }],
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
        10: 'var(--space-10)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'scrub': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
      backgroundImage: {
        holo: 'var(--gradient-holo)',
        'holo-active': 'var(--gradient-holo-active)',
      },
    },
  },
  plugins: [],
};

export default config;
