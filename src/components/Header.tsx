/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { colors, shadows, transitions, fonts, fontSize, zIndex } from '../styles';

interface HeaderProps {
  onToggleCalendar: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  isCalendarOpen: boolean;
  hasActiveFilter: boolean;
}

const headerStyles = css`
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.paper};
  position: sticky;
  top: 0;
  z-index: ${zIndex.header};
`;

const titleContainerStyles = css`
  display: flex;
  align-items: center;
`;

const titleStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.xl};
  font-weight: 700;
  color: ${colors.ink};
  letter-spacing: -0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const accentDotStyles = css`
  width: 0.625rem;
  height: 0.625rem;
  background-color: ${colors.accent};
  border: 1px solid ${colors.ink};
  display: inline-block;
  box-shadow: ${shadows.retroSm};
`;

const buttonContainerStyles = css`
  display: flex;
  gap: 0.5rem;
`;

const iconButtonBaseStyles = css`
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: ${transitions.slow};
  background: none;
  border: none;
  cursor: pointer;
`;

const iconButtonDefaultStyles = css`
  color: ${colors.ink};

  &:hover {
    background-color: rgba(26, 26, 26, 0.1);
  }
`;

const iconButtonActiveStyles = css`
  background-color: ${colors.ink};
  color: ${colors.white};
`;

export const Header: React.FC<HeaderProps> = ({
  onToggleCalendar,
  onOpenExport,
  onOpenSettings,
  isCalendarOpen,
  hasActiveFilter,
}) => {
  const isCalendarActive = isCalendarOpen || hasActiveFilter;

  return (
    <header css={headerStyles}>
      <div css={titleContainerStyles}>
        <h1 css={titleStyles}>
          <span css={accentDotStyles} />
          TypeNotes
        </h1>
      </div>
      <div css={buttonContainerStyles}>
        <button
          css={[
            iconButtonBaseStyles,
            isCalendarActive ? iconButtonActiveStyles : iconButtonDefaultStyles,
          ]}
          onClick={onToggleCalendar}
          title="Filter by Date Range"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
        <button
          css={[iconButtonBaseStyles, iconButtonDefaultStyles]}
          onClick={onOpenExport}
          title="Backup Data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
        <button
          css={[iconButtonBaseStyles, iconButtonDefaultStyles]}
          onClick={onOpenSettings}
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
};
