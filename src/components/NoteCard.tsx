import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

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
    <div onClick={() => onClick(note)} className="card card-interactive min-h-[90px] flex flex-col">
      <button
        className="card-delete-btn"
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

      <div className="card-content">
        <p className="note-text">
          {note.content ? note.content : <span className="placeholder-text">...</span>}
        </p>
      </div>

      <div className="card-footer">
        <span className="card-date">{formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
};
