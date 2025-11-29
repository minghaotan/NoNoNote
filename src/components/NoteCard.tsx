import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    // Critical: Stop propagation immediately to prevent opening the editor
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
    <div
      onClick={() => onClick(note)}
      className="group relative bg-white border-2 border-ink p-4 shadow-retro transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-retro-sm cursor-pointer min-h-[90px] flex flex-col"
    >
      {/* Delete Button - Absolute positioning with high z-index and explicit event blocking */}
      <button
        className="absolute top-1 right-1 z-30 p-1.5 text-ink/20 hover:text-accent hover:bg-ink/5 transition-colors"
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
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Content - Plain Text */}
      <div className="flex-1 pr-6 pt-0.5">
        <p className="font-mono text-sm text-ink leading-relaxed line-clamp-6 whitespace-pre-wrap break-words">
          {note.content ? note.content : <span className="opacity-30 italic">...</span>}
        </p>
      </div>

      {/* Footer - Minimal Compact Date */}
      <div className="mt-2 flex justify-end pt-1">
        <span className="font-mono text-[9px] text-ink/30 tracking-widest uppercase">
          {formatDate(note.createdAt)}
        </span>
      </div>
    </div>
  );
};
