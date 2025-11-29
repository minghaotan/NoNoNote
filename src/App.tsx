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
  // Initialize state lazily to ensure it runs once and doesn't cause hydration/effect loops
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Date Range State
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Persist notes whenever they change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Persist settings
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
    // Stop propagation is handled in NoteCard, but good to have here too just in case
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
      // Update existing
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title, content, updatedAt: timestamp } : n))
      );
    } else {
      // Create new
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

  // Logic for active dates in calendar
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

  // Logic for filtering list by range
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
      // If only start is selected, show everything after start
      if (!endFilter) {
        return noteDate >= startFilter;
      }
      // If range, show within range
      return noteDate >= startFilter && noteDate <= endFilter;
    });
  }, [notes, dateRange]);

  return (
    <div className="min-h-screen pb-24 bg-paper paper-texture font-mono relative flex flex-col">
      <div className="max-w-2xl mx-auto min-h-screen w-full flex flex-col">
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

        <main className="flex-1 p-6">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 opacity-50 text-center">
              <div className="w-12 h-12 border-2 border-ink border-dashed rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-mono italic">{dateRange.start ? '0' : '?'}</span>
              </div>
              <p className="font-mono text-ink text-sm">
                {dateRange.start ? `No notes in selected range.` : 'Type something...'}
              </p>
            </div>
          ) : (
            <>
              {dateRange.start && (
                <div className="mb-4 pb-2 border-b-2 border-dashed border-ink/20 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                  <span className="font-mono text-xs text-ink/50 uppercase font-bold">
                    Range: {dateRange.start.toLocaleDateString()}
                    {dateRange.end ? ` — ${dateRange.end.toLocaleDateString()}` : ' +'}
                  </span>
                  <button
                    onClick={() => setDateRange({ start: null, end: null })}
                    className="text-[10px] text-accent hover:underline font-bold tracking-widest uppercase"
                  >
                    CLEAR
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3">
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

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <div className="pointer-events-auto">
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
