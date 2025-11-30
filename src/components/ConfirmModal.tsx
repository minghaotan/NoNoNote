/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { Button } from './Button';
import { colors, shadows, fonts, fontSize, zIndex, mixins } from '../styles';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

const contentStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const iconContainerStyles = css`
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  border: 2px solid ${colors.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.accent};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-weight: 700;
  font-size: ${fontSize.xxl};
  box-shadow: ${shadows.retroSm};
`;

const titleStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.xl};
  font-weight: 700;
  color: ${colors.ink};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const messageStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.base};
  color: ${colors.ink};
  line-height: 1.6;
`;

const disclaimerStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  color: rgba(26, 26, 26, 0.5);
  margin-top: 0.5rem;
  font-style: italic;
`;

const buttonContainerStyles = css`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const buttonStyles = css`
  flex: 1;
`;

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div css={overlayStyles} onClick={onClose}>
      <div css={containerStyles} onClick={(e) => e.stopPropagation()}>
        <div css={contentStyles}>
          <div css={iconContainerStyles}>!</div>
          <h3 css={titleStyles}>Confirm Delete</h3>
          <p css={messageStyles}>Are you sure you want to discard this note?</p>
          <p css={disclaimerStyles}>(This action cannot be undone)</p>
        </div>

        <div css={buttonContainerStyles}>
          <Button variant="secondary" onClick={onClose} css={buttonStyles}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} css={buttonStyles}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
