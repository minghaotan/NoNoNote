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
    <div className="modal-backdrop z-[60] animate-fade-in" onClick={onClose}>
      <div
        className="modal-container animate-zoom-in p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="alert-icon mb-4">!</div>
          <h3 className="modal-title mb-2">Confirm Delete</h3>
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
            className="flex-1 !bg-accent hover:!bg-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
