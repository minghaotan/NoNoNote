import { css } from '@emotion/react';
import { colors, fonts } from './theme';

/**
 * Global styles for the application.
 * Includes font-face declarations, body styles, and custom scrollbar.
 */
export const globalStyles = css`
  /* Courier Prime Font Family - Local Files */
  @font-face {
    font-family: 'Courier Prime';
    src: url('/fonts/CourierPrime-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Courier Prime';
    src: url('/fonts/CourierPrime-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Courier Prime';
    src: url('/fonts/CourierPrime-Italic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Courier Prime';
    src: url('/fonts/CourierPrime-BoldItalic.ttf') format('truetype');
    font-weight: 700;
    font-style: italic;
    font-display: swap;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${fonts.mono};
    background-color: ${colors.paper};
    color: ${colors.ink};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    line-height: 1.5;
  }

  /* Ensure all elements inherit the font */
  * {
    font-family: inherit;
  }

  /* Better font rendering for Courier Prime */
  input,
  textarea,
  button {
    font-family: ${fonts.mono};
    letter-spacing: -0.01em;
    font-variant-ligatures: none;
  }

  /* Custom scrollbar to match retro theme */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.ink};
    border-radius: 0;
  }

  /* Remove default button styles */
  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  /* Remove default link styles */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Prevent text selection on interactive elements */
  button,
  [role='button'] {
    user-select: none;
  }
`;
