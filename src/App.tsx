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
    <div className="app-container">
      <div className="content-container">
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

        <main className="main-content">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <span className="text-2xl font-mono italic">{dateRange.start ? '0' : '?'}</span>
              </div>
              <p className="font-mono text-ink text-sm">
                {dateRange.start ? `No notes in selected range.` : 'Type something...'}
              </p>
            </div>
          ) : (
            <>
              {dateRange.start && (
                <div className="filter-bar animate-slide-down">
                  <span className="filter-label">
                    Range: {dateRange.start.toLocaleDateString()}
                    {dateRange.end ? ` — ${dateRange.end.toLocaleDateString()}` : ' +'}
                  </span>
                  <button
                    onClick={() => setDateRange({ start: null, end: null })}
                    className="filter-clear-btn"
                  >
                    CLEAR
                  </button>
                </div>
              )}
              <div className="note-grid">
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

      <div className="fab-container">
        <div className="fab-wrapper">
          <Button
            variant="icon"
            onClick={handleCreateNote}
            className="w-14 h-14 text-2xl transform transition hover:scale-105"
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
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
