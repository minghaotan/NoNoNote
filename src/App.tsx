/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { NoteCard } from './components/NoteCard';
import { EditorOverlay } from './components/EditorOverlay';
import { Button } from './components/Button';
import { Calendar } from './components/Calendar';
import { ExportModal } from './components/ExportModal';
import { ConfirmModal } from './components/ConfirmModal';
import { SettingsModal } from './components/SettingsModal';
import { Note, AppSettings } from './types';
import { getNotes, saveNotes, generateId, getSettings, saveSettings } from './services/storage';
import { colors, zIndex, mixins, fonts, fontSize } from './styles';

// Styles
const appContainerStyles = css`
  min-height: 100vh;
  padding-bottom: 6rem;
  background-color: ${colors.paper};
  ${mixins.paperTexture}
  font-family: ${fonts.mono};
  position: relative;
  display: flex;
  flex-direction: column;
`;

const mainContainerStyles = css`
  max-width: 42rem;
  margin: 0 auto;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const mainContentStyles = css`
  flex: 1;
  padding: 1.5rem;
`;

const emptyStateStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 16rem;
  opacity: 0.5;
  text-align: center;
`;

const emptyIconStyles = css`
  width: 3rem;
  height: 3rem;
  border: 2px dashed ${colors.ink};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const emptyIconTextStyles = css`
  font-size: ${fontSize.xxl};
  font-family: ${fonts.mono};
  font-style: italic;
`;

const emptyMessageStyles = css`
  font-family: ${fonts.mono};
  color: ${colors.ink};
  font-size: ${fontSize.base};
`;

const filterHeaderStyles = css`
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed rgba(26, 26, 26, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @keyframes fadeInSlide {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: fadeInSlide 200ms ease-out;
`;

const filterLabelStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  color: rgba(26, 26, 26, 0.5);
  text-transform: uppercase;
  font-weight: 700;
`;

const clearFilterButtonStyles = css`
  font-size: ${fontSize.xs};
  color: ${colors.accent};
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const notesGridStyles = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
`;

const stickyButtonContainerStyles = css`
  position: fixed;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: ${zIndex.stickyButton};
  pointer-events: none;
`;

const stickyButtonWrapperStyles = css`
  pointer-events: auto;
`;

const createButtonStyles = css`
  width: 3.5rem;
  height: 3.5rem;
  font-size: ${fontSize.xxl};
  transform-origin: center;
  transition: transform 150ms ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleCreateNote = () => {
    setActiveNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  };

  const requestDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingNoteId(id);
  };

  const confirmDeleteNote = () => {
    if (deletingNoteId) {
      setNotes((prev) => prev.filter((n) => n.id !== deletingNoteId));
      setDeletingNoteId(null);
    }
  };

  const handleSaveNote = (title: string, content: string, id?: string) => {
    const timestamp = Date.now();

    if (id) {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title, content, updatedAt: timestamp } : n))
      );
    } else {
      const newNote: Note = {
        id: generateId(),
        title,
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const activeDates = useMemo(() => {
    const dates = new Set<string>();
    notes.forEach((note) => {
      try {
        const d = new Date(note.createdAt);
        if (!isNaN(d.getTime())) {
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          dates.add(dateStr);
        }
      } catch {
        // ignore invalid dates
      }
    });
    return dates;
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!dateRange.start) return notes;

    const startFilter = new Date(dateRange.start);
    startFilter.setHours(0, 0, 0, 0);

    let endFilter: Date | null = null;
    if (dateRange.end) {
      endFilter = new Date(dateRange.end);
      endFilter.setHours(23, 59, 59, 999);
    }

    return notes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      if (!endFilter) {
        return noteDate >= startFilter;
      }
      return noteDate >= startFilter && noteDate <= endFilter;
    });
  }, [notes, dateRange]);

  return (
    <div css={appContainerStyles}>
      <div css={mainContainerStyles}>
        <Header
          onToggleCalendar={() => setIsCalendarOpen(true)}
          isCalendarOpen={isCalendarOpen}
          hasActiveFilter={!!dateRange.start}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <Calendar
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          dateRange={dateRange}
          onChangeRange={setDateRange}
          activeDates={activeDates}
        />

        <main css={mainContentStyles}>
          {filteredNotes.length === 0 ? (
            <div css={emptyStateStyles}>
              <div css={emptyIconStyles}>
                <span css={emptyIconTextStyles}>{dateRange.start ? '0' : '?'}</span>
              </div>
              <p css={emptyMessageStyles}>
                {dateRange.start ? `No notes in selected range.` : 'Type something...'}
              </p>
            </div>
          ) : (
            <>
              {dateRange.start && (
                <div css={filterHeaderStyles}>
                  <span css={filterLabelStyles}>
                    Range: {dateRange.start.toLocaleDateString()}
                    {dateRange.end ? ` — ${dateRange.end.toLocaleDateString()}` : ' +'}
                  </span>
                  <button
                    onClick={() => setDateRange({ start: null, end: null })}
                    css={clearFilterButtonStyles}
                  >
                    CLEAR
                  </button>
                </div>
              )}
              <div css={notesGridStyles}>
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={handleEditNote}
                    onDelete={requestDeleteNote}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <div css={stickyButtonContainerStyles}>
        <div css={stickyButtonWrapperStyles}>
          <Button
            variant="icon"
            onClick={handleCreateNote}
            css={createButtonStyles}
            aria-label="Create new note"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Button>
        </div>
      </div>

      <EditorOverlay
        isOpen={isEditorOpen}
        initialNote={activeNote}
        onSave={handleSaveNote}
        onClose={() => setIsEditorOpen(false)}
        enableAI={settings.enableAI}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        notes={filteredNotes}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <ConfirmModal
        isOpen={!!deletingNoteId}
        onClose={() => setDeletingNoteId(null)}
        onConfirm={confirmDeleteNote}
      />
    </div>
  );
};

export default App;
