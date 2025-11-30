/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { Button } from './Button';
import { polishText, continueThought } from '../services/geminiService';
import { colors, shadows, fonts, fontSize, zIndex, mixins } from '../styles';

interface EditorOverlayProps {
  isOpen: boolean;
  initialNote: Note | null;
  onSave: (title: string, content: string, id?: string) => void;
  onClose: () => void;
  enableAI: boolean;
}

const overlayStyles = css`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.overlay};
  background-color: ${colors.paper};
  display: flex;
  flex-direction: column;
  ${mixins.paperTexture}

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
  animation: slideInFromBottom 300ms ease-out;
`;

const toolbarStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 2px solid ${colors.ink};
  background-color: ${colors.paper};
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const closeButtonStyles = css`
  color: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: ${fontSize.base};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${colors.accent};
  }
`;

const statusContainerStyles = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const statusTextStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  font-weight: 700;
  color: rgba(26, 26, 26, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  @media (max-width: 640px) {
    display: none;
  }
`;

const saveButtonStyles = css`
  background-color: ${colors.ink};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-size: ${fontSize.base};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 2px solid ${colors.ink};
  padding: 0.25rem 1rem;
  box-shadow: ${shadows.accentGlow};
  transition: all 150ms ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(26, 26, 26, 0.8);
  }
`;

const editorContainerStyles = css`
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const textareaStyles = css`
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  resize: none;
  background: transparent;
  font-family: ${fonts.mono};
  font-size: ${fontSize.xl};
  color: ${colors.ink};
  line-height: 1.6;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(26, 26, 26, 0.2);
  }
`;

const aiToolbarStyles = css`
  padding: 1rem;
  border-top: 2px solid ${colors.ink};
  background-color: ${colors.white};
  padding-bottom: 2rem;
  z-index: 20;

  /* Safe area for mobile devices */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    padding-bottom: calc(2rem + env(safe-area-inset-bottom));
  }
`;

const aiButtonContainerStyles = css`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  max-width: 28rem;
  margin: 0 auto;
  overflow-x: auto;
`;

const aiButtonStyles = css`
  flex-shrink: 0;
  font-size: ${fontSize.sm};
  padding: 0.5rem 1rem;
`;

export const EditorOverlay: React.FC<EditorOverlayProps> = ({
  isOpen,
  initialNote,
  onSave,
  onClose,
  enableAI,
}) => {
  const [content, setContent] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialNote) {
        setContent(initialNote.content);
      } else {
        setContent('');
      }
    }
  }, [isOpen, initialNote]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!content.trim()) {
      onClose();
      return;
    }

    const lines = content.trim().split('\n');
    const generatedTitle = (lines[0] ?? '').substring(0, 60).trim();

    onSave(generatedTitle, content, initialNote?.id);
    onClose();
  };

  const handleAiPolish = async () => {
    if (!content) return;
    setIsAiProcessing(true);
    try {
      const polished = await polishText(content);
      setContent(polished);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleAiContinue = async () => {
    if (!content) return;
    setIsAiProcessing(true);
    try {
      const continued = await continueThought(content);
      setContent((prev) => prev + (prev.endsWith(' ') ? '' : ' ') + continued);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div css={overlayStyles}>
      <div css={toolbarStyles}>
        <button onClick={onClose} css={closeButtonStyles}>
          Close
        </button>

        <div css={statusContainerStyles}>
          <span css={statusTextStyles}>{initialNote ? 'Editing' : 'New Note'}</span>
        </div>

        <button onClick={handleSave} css={saveButtonStyles}>
          Save
        </button>
      </div>

      <div css={editorContainerStyles}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          css={textareaStyles}
          placeholder="Type your story here..."
          spellCheck={false}
        />
      </div>

      {enableAI && (
        <div css={aiToolbarStyles}>
          <div css={aiButtonContainerStyles}>
            <Button
              variant="secondary"
              onClick={handleAiPolish}
              disabled={!content || isAiProcessing}
              loading={isAiProcessing}
              css={aiButtonStyles}
            >
              ✨ Polish
            </Button>
            <Button
              variant="secondary"
              onClick={handleAiContinue}
              disabled={!content || isAiProcessing}
              loading={isAiProcessing}
              css={aiButtonStyles}
            >
              🖊️ Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
