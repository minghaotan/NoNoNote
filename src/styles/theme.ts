/**
 * Design tokens and theme configuration for the application.
 * Centralizes all styling constants for easy maintenance and consistency.
 */

export const colors = {
  paper: '#f2f0e9',
  ink: '#1a1a1a',
  inkLight: '#4a4a4a',
  accent: '#ff5252',
  accentDark: '#e64545',
  white: '#ffffff',
  transparent: 'transparent',
} as const;

export const fonts = {
  mono: '"Courier Prime", Courier, monospace',
} as const;

export const shadows = {
  retro: '4px 4px 0px 0px rgba(26, 26, 26, 1)',
  retroSm: '2px 2px 0px 0px rgba(26, 26, 26, 1)',
  retroActive: '2px 2px 0px 0px rgba(26, 26, 26, 1)',
  retroLight: '2px 2px 0px 0px rgba(26, 26, 26, 0.3)',
  accentGlow: '2px 2px 0px 0px rgba(255, 82, 82, 1)',
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  xxl: '3rem', // 48px
} as const;

export const fontSize = {
  xs: '0.625rem', // 10px
  sm: '0.75rem', // 12px
  base: '0.875rem', // 14px
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px
  xxl: '1.5rem', // 24px
} as const;

export const borderWidth = {
  default: '2px',
} as const;

export const transitions = {
  fast: 'all 100ms ease',
  default: 'all 150ms ease',
  slow: 'all 200ms ease',
  colors: 'color 150ms ease, background-color 150ms ease',
} as const;

export const zIndex = {
  header: 20,
  stickyButton: 30,
  calendar: 40,
  overlay: 50,
  modal: 60,
} as const;

// Common style mixins
export const mixins = {
  /** Paper texture background using SVG noise */
  paperTexture: `
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
  `,

  /** Text styling for uppercase labels */
  uppercase: `
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
  `,

  /** Retro border style */
  retroBorder: `
    border: ${borderWidth.default} solid ${colors.ink};
  `,

  /** Focus visible outline for accessibility */
  focusVisible: `
    &:focus-visible {
      outline: 2px solid ${colors.accent};
      outline-offset: 2px;
    }
  `,

  /** Line clamp utility */
  lineClamp: (lines: number) => `
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,
} as const;

// Animation keyframes
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideInFromBottom: `
    @keyframes slideInFromBottom {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
} as const;

export const theme = {
  colors,
  fonts,
  shadows,
  spacing,
  fontSize,
  borderWidth,
  transitions,
  zIndex,
  mixins,
  keyframes,
} as const;

export type Theme = typeof theme;
