/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { colors, shadows, transitions, fonts, fontSize } from '../styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  loading?: boolean;
}

const baseStyles = css`
  font-family: ${fonts.mono};
  transition: ${transitions.fast};
  cursor: pointer;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: ${shadows.retroActive};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const variantStyles = {
  primary: css`
    background-color: ${colors.ink};
    color: ${colors.white};
    border: 2px solid ${colors.ink};
    box-shadow: ${shadows.retro};
    padding: 0.5rem 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: ${fontSize.base};
    font-weight: 700;

    &:hover:not(:disabled) {
      background-color: ${colors.inkLight};
    }
  `,
  secondary: css`
    background-color: ${colors.white};
    color: ${colors.ink};
    border: 2px solid ${colors.ink};
    box-shadow: ${shadows.retro};
    padding: 0.5rem 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: ${fontSize.base};
    font-weight: 700;

    &:hover:not(:disabled) {
      background-color: #f5f5f5;
    }
  `,
  icon: css`
    padding: 0.75rem;
    border-radius: 9999px;
    background-color: ${colors.ink};
    color: ${colors.white};
    border: 2px solid ${colors.ink};
    box-shadow: ${shadows.retro};
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      background-color: ${colors.inkLight};
    }
  `,
};

const loadingContainerStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const spinnerStyles = css`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: spin 1s linear infinite;
  width: 1rem;
  height: 1rem;
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading,
  disabled,
  ...props
}) => {
  return (
    <button css={[baseStyles, variantStyles[variant]]} disabled={disabled || loading} {...props}>
      {loading ? (
        <span css={loadingContainerStyles}>
          <svg css={spinnerStyles} viewBox="0 0 24 24">
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          ...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
