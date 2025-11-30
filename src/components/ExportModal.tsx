/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useMemo, useCallback } from 'react';
import { Button } from './Button';
import { Note } from '../types';
import { colors, shadows, transitions, fonts, fontSize, zIndex, mixins } from '../styles';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
}

const overlayStyles = css`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(26, 26, 26, 0.3);
  backdrop-filter: blur(4px);
`;

const containerStyles = css`
  background-color: ${colors.paper};
  border: 2px solid ${colors.ink};
  box-shadow: ${shadows.retro};
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  width: 100%;
  max-width: 32rem;
  ${mixins.paperTexture}
`;

const headerStyles = css`
  padding: 1.25rem;
  border-bottom: 2px solid ${colors.ink};
  background-color: ${colors.white};
`;

const titleStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.xl};
  font-weight: 700;
  color: ${colors.ink};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const titleAccentStyles = css`
  width: 0.5rem;
  height: 1.5rem;
  background-color: ${colors.accent};
`;

const contentStyles = css`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  background-color: ${colors.paper};
`;

const selectHeaderStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const selectLabelStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  font-weight: 700;
  color: rgba(26, 26, 26, 0.5);
  text-transform: uppercase;
`;

const toggleButtonStyles = css`
  font-size: ${fontSize.sm};
  font-family: ${fonts.mono};
  color: ${colors.ink};
  border: 1px solid ${colors.ink};
  padding: 0.25rem 0.5rem;
  background: none;
  cursor: pointer;

  &:hover {
    background-color: ${colors.white};
  }
`;

const emptyMessageStyles = css`
  text-align: center;
  font-family: ${fonts.mono};
  font-size: ${fontSize.base};
  opacity: 0.5;
  padding: 1rem;
`;

const noteListStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const noteItemStyles = (isSelected: boolean) => css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid;
  cursor: pointer;
  transition: ${transitions.fast};

  ${isSelected
    ? css`
        background-color: ${colors.white};
        border-color: ${colors.ink};
        box-shadow: ${shadows.retroSm};
        transform: translate(-2px, -2px);
      `
    : css`
        background-color: transparent;
        border-color: rgba(26, 26, 26, 0.2);

        &:hover {
          border-color: rgba(26, 26, 26, 0.5);
        }
      `}
`;

const checkboxStyles = (isSelected: boolean) => css`
  width: 1rem;
  height: 1rem;
  margin-top: 0.25rem;
  border: 2px solid ${colors.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${isSelected ? colors.accent : 'transparent'};
`;

const checkmarkStyles = css`
  color: ${colors.white};
  font-size: ${fontSize.xs};
  font-weight: 700;
`;

const noteContentStyles = css`
  flex: 1;
  min-width: 0;
`;

const noteTitleStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  color: ${colors.ink};
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const noteDateStyles = css`
  font-size: ${fontSize.xs};
  color: rgba(26, 26, 26, 0.6);
  font-family: ${fonts.mono};
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const previewSectionStyles = css`
  margin-top: 1.5rem;
`;

const previewLabelStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  font-weight: 700;
  color: rgba(26, 26, 26, 0.5);
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
`;

const previewContainerStyles = css`
  background-color: ${colors.white};
  border: 2px solid ${colors.ink};
  padding: 0.5rem;
  max-height: 8rem;
  overflow: auto;
`;

const previewTextStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.xs};
  color: ${colors.ink};
  white-space: pre-wrap;
  word-break: break-all;
`;

const footerStyles = css`
  padding: 1.25rem;
  border-top: 2px solid ${colors.ink};
  background-color: ${colors.white};
  display: flex;
  gap: 0.75rem;
`;

const footerButtonStyles = css`
  flex: 1;
  font-size: ${fontSize.sm};
`;

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, notes }) => {
  const allNoteIds = useMemo(() => new Set(notes.map((n) => n.id)), [notes]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const [prevNoteIds, setPrevNoteIds] = useState<Set<string>>(() => new Set());
  if (isOpen && allNoteIds !== prevNoteIds) {
    setSelectedIds(new Set(allNoteIds));
    setPrevNoteIds(allNoteIds);
  }

  const toggleNote = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === notes.length) {
        return new Set();
      }
      return new Set(notes.map((n) => n.id));
    });
  }, [notes]);

  const selectedNotes = useMemo(() => {
    return notes.filter((n) => selectedIds.has(n.id));
  }, [notes, selectedIds]);

  const handleCopy = useCallback(() => {
    const json = JSON.stringify(selectedNotes, null, 2);
    navigator.clipboard.writeText(json);
    alert('Copied to clipboard!');
  }, [selectedNotes]);

  const handleDownload = useCallback(() => {
    const json = JSON.stringify(selectedNotes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedNotes]);

  if (!isOpen) return null;

  return (
    <div css={overlayStyles} onClick={onClose}>
      <div css={containerStyles} onClick={(e) => e.stopPropagation()}>
        <div css={headerStyles}>
          <h2 css={titleStyles}>
            <span css={titleAccentStyles} />
            EXPORT DATA
          </h2>
        </div>

        <div css={contentStyles}>
          <div css={selectHeaderStyles}>
            <span css={selectLabelStyles}>Select Notes</span>
            <button onClick={toggleAll} css={toggleButtonStyles}>
              {selectedIds.size === notes.length ? 'NONE' : 'ALL'}
            </button>
          </div>

          {notes.length === 0 ? (
            <p css={emptyMessageStyles}>No notes available.</p>
          ) : (
            <div css={noteListStyles}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => toggleNote(note.id)}
                  css={noteItemStyles(selectedIds.has(note.id))}
                >
                  <div css={checkboxStyles(selectedIds.has(note.id))}>
                    {selectedIds.has(note.id) && <span css={checkmarkStyles}>✓</span>}
                  </div>
                  <div css={noteContentStyles}>
                    <p css={noteTitleStyles}>{note.content.split('\n')[0] || 'Untitled'}</p>
                    <p css={noteDateStyles}>{new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedIds.size > 0 && (
            <div css={previewSectionStyles}>
              <span css={previewLabelStyles}>Preview</span>
              <div css={previewContainerStyles}>
                <pre css={previewTextStyles}>{JSON.stringify(selectedNotes, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        <div css={footerStyles}>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={selectedIds.size === 0}
            css={footerButtonStyles}
          >
            Download
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopy}
            disabled={selectedIds.size === 0}
            css={footerButtonStyles}
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
