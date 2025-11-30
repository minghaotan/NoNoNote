/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { Note } from '../types';
import { colors, shadows, transitions, fonts, fontSize, mixins } from '../styles';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const cardStyles = css`
  position: relative;
  background-color: ${colors.white};
  border: 2px solid ${colors.ink};
  padding: 1rem;
  box-shadow: ${shadows.retro};
  transition: ${transitions.default};
  cursor: pointer;
  min-height: 90px;
  display: flex;
  flex-direction: column;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: ${shadows.retroSm};
  }
`;

const deleteButtonStyles = css`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  z-index: 30;
  padding: 0.375rem;
  color: rgba(26, 26, 26, 0.2);
  transition: ${transitions.colors};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${colors.accent};
    background-color: rgba(26, 26, 26, 0.05);
  }
`;

const contentStyles = css`
  flex: 1;
  padding-right: 1.5rem;
  padding-top: 0.125rem;
`;

const textStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.base};
  color: ${colors.ink};
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  ${mixins.lineClamp(6)}
`;

const emptyTextStyles = css`
  opacity: 0.3;
  font-style: italic;
`;

const footerStyles = css`
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  padding-top: 0.25rem;
`;

const dateStyles = css`
  font-family: ${fonts.mono};
  font-size: 9px;
  color: rgba(26, 26, 26, 0.3);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(e, note.id);
  };

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div css={cardStyles} onClick={() => onClick(note)}>
      <button
        css={deleteButtonStyles}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleDelete}
        title="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div css={contentStyles}>
        <p css={textStyles}>
          {note.content ? note.content : <span css={emptyTextStyles}>...</span>}
        </p>
      </div>

      <div css={footerStyles}>
        <span css={dateStyles}>{formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
};
