/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { AppSettings } from '../types';
import { Button } from './Button';
import { colors, shadows, transitions, fonts, fontSize, zIndex, mixins } from '../styles';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const overlayStyles = css`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(26, 26, 26, 0.2);
  backdrop-filter: blur(4px);

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  animation: fadeIn 200ms ease-out;
`;

const containerStyles = css`
  background-color: ${colors.paper};
  border: 2px solid ${colors.ink};
  box-shadow: ${shadows.retro};
  padding: 1.5rem;
  width: 100%;
  max-width: 24rem;
  ${mixins.paperTexture}

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
  animation: zoomIn 200ms ease-out;
`;

const headerStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid ${colors.ink};
  padding-bottom: 1rem;
`;

const iconContainerStyles = css`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${colors.ink};
  background-color: ${colors.ink};
  color: ${colors.white};
  border-radius: 9999px;
`;

const titleStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.xl};
  font-weight: 700;
  color: ${colors.ink};
  text-transform: uppercase;
  letter-spacing: -0.05em;
`;

const contentStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const settingItemStyles = css`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;

  &:hover h3 {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-decoration-color: ${colors.accent};
  }
`;

const checkboxStyles = (isChecked: boolean) => css`
  margin-top: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid ${colors.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.colors};
  box-shadow: ${shadows.retroLight};
  flex-shrink: 0;
  background-color: ${isChecked ? colors.accent : colors.white};
`;

const settingTextStyles = css`
  flex: 1;
`;

const settingTitleStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.base};
  font-weight: 700;
  color: ${colors.ink};
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const settingDescriptionStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  color: rgba(26, 26, 26, 0.6);
  line-height: 1.6;
`;

const versionInfoStyles = css`
  padding-top: 1.5rem;
  border-top: 2px solid rgba(26, 26, 26, 0.1);
  text-align: center;
`;

const versionTextStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.xs};
  color: rgba(26, 26, 26, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const footerStyles = css`
  margin-top: 2rem;
`;

const closeButtonStyles = css`
  width: 100%;
`;

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggleAI = () => {
    onUpdateSettings({
      ...settings,
      enableAI: !settings.enableAI,
    });
  };

  return (
    <div css={overlayStyles} onClick={onClose}>
      <div css={containerStyles} onClick={(e) => e.stopPropagation()}>
        <div css={headerStyles}>
          <span css={iconContainerStyles}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <h2 css={titleStyles}>Configuration</h2>
        </div>

        <div css={contentStyles}>
          <div css={settingItemStyles} onClick={toggleAI}>
            <div css={checkboxStyles(settings.enableAI)}>
              {settings.enableAI && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div css={settingTextStyles}>
              <h3 css={settingTitleStyles}>Enable AI Features</h3>
              <p css={settingDescriptionStyles}>
                Allow the experimental typewriter intelligence to help polish text and continue
                thoughts.
              </p>
            </div>
          </div>

          <div css={versionInfoStyles}>
            <p css={versionTextStyles}>Typewriter Notes v1.0</p>
          </div>
        </div>

        <div css={footerStyles}>
          <Button variant="primary" onClick={onClose} css={closeButtonStyles}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
