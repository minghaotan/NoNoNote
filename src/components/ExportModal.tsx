import React, { useState, useMemo, useCallback } from 'react';
import { Button } from './Button';
import { Note } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
}

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
    <div className="modal-backdrop z-50" onClick={onClose}>
      <div
        className="modal-container flex flex-col max-h-[85vh] w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title-bar">
            <span className="modal-accent-bar"></span>
            EXPORT DATA
          </h2>
        </div>

        <div className="modal-body">
          <div className="flex justify-between items-center mb-4">
            <span className="label">Select Notes</span>
            <button
              onClick={toggleAll}
              className="text-xs font-mono text-ink border border-ink px-2 py-1 hover:bg-white"
            >
              {selectedIds.size === notes.length ? 'NONE' : 'ALL'}
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="text-center font-mono text-sm opacity-50 py-4">No notes available.</p>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => {
                const isSelected = selectedIds.has(note.id);
                const itemClass = isSelected
                  ? 'list-item list-item-selected'
                  : 'list-item list-item-default';
                const checkboxClass = isSelected ? 'checkbox checkbox-checked' : 'checkbox';

                return (
                  <div key={note.id} onClick={() => toggleNote(note.id)} className={itemClass}>
                    <div className={checkboxClass}>
                      {isSelected && <span className="checkbox-mark">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-ink truncate font-bold">
                        {note.content.split('\n')[0] || 'Untitled'}
                      </p>
                      <p className="text-[10px] text-ink/60 truncate font-mono mt-1">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedIds.size > 0 && (
            <div className="mt-6">
              <span className="label block mb-2">Preview</span>
              <div className="preview-box">
                <pre className="preview-text">{JSON.stringify(selectedNotes, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={selectedIds.size === 0}
            className="flex-1 text-xs"
          >
            Download
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopy}
            disabled={selectedIds.size === 0}
            className="flex-1 text-xs"
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
