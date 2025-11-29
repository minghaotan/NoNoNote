import React from 'react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-paper border-2 border-ink shadow-retro p-6 w-full max-w-sm paper-texture animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 mb-4 border-2 border-ink flex items-center justify-center bg-accent text-white font-mono font-bold text-2xl shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            !
          </div>
          <h3 className="font-mono text-xl font-bold text-ink mb-2 uppercase tracking-widest">
            Confirm Delete
          </h3>
          <p className="font-mono text-ink text-sm leading-relaxed">
            Are you sure you want to discard this note?
          </p>
          <p className="font-mono text-ink/50 text-xs mt-2 italic">
            (This action cannot be undone)
          </p>
        </div>

        <div className="flex gap-4 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1 !bg-accent !text-white hover:!bg-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
