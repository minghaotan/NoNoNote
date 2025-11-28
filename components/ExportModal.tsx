import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Note } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, notes }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(notes.map(n => n.id)));
    }
  }, [isOpen, notes]);

  if (!isOpen) return null;

  const toggleNote = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === notes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notes.map(n => n.id)));
    }
  };

  const getSelectedNotes = () => {
    return notes.filter(n => selectedIds.has(n.id));
  };

  const handleCopy = () => {
    const json = JSON.stringify(getSelectedNotes(), null, 2);
    navigator.clipboard.writeText(json);
    alert('Copied to clipboard!');
  };

  const handleDownload = () => {
    const json = JSON.stringify(getSelectedNotes(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-paper border-2 border-ink shadow-retro flex flex-col max-h-[85vh] w-full max-w-lg paper-texture"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b-2 border-ink bg-white">
            <h2 className="font-mono text-xl font-bold text-ink mb-1 flex items-center gap-2">
                 <span className="w-2 h-6 bg-accent"></span>
                 EXPORT DATA
            </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 bg-paper">
            <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs font-bold text-ink/50 uppercase">Select Notes</span>
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
                    {notes.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => toggleNote(note.id)} 
                            className={`flex items-start gap-3 p-3 border-2 cursor-pointer transition-all ${selectedIds.has(note.id) ? 'bg-white border-ink shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-transparent border-ink/20 hover:border-ink/50'}`}
                        >
                            <div className={`w-4 h-4 mt-1 border-2 border-ink flex items-center justify-center ${selectedIds.has(note.id) ? 'bg-accent' : 'bg-transparent'}`}>
                                {selectedIds.has(note.id) && <span className="text-white text-[10px] font-bold">✓</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-xs text-ink truncate font-bold">
                                    {note.content.split('\n')[0] || "Untitled"}
                                </p>
                                <p className="text-[10px] text-ink/60 truncate font-mono mt-1">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {selectedIds.size > 0 && (
                <div className="mt-6">
                    <span className="font-mono text-xs font-bold text-ink/50 uppercase block mb-2">Preview</span>
                    <div className="bg-white border-2 border-ink p-2 max-h-32 overflow-auto">
                        <pre className="font-mono text-[10px] text-ink whitespace-pre-wrap break-all">
                            {JSON.stringify(getSelectedNotes(), null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>

        <div className="p-5 border-t-2 border-ink bg-white flex gap-3">
             <Button variant="primary" onClick={handleDownload} disabled={selectedIds.size === 0} className="flex-1 text-xs">
                Download
             </Button>
             <Button variant="secondary" onClick={handleCopy} disabled={selectedIds.size === 0} className="flex-1 text-xs">
                Copy
             </Button>
        </div>
      </div>
    </div>
  );
};