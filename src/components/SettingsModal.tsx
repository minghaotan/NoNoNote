import React from 'react';
import { AppSettings } from '../types';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggleAI = () => {
    onUpdateSettings({
      ...settings,
      enableAI: !settings.enableAI,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-paper border-2 border-ink shadow-retro p-6 w-full max-w-sm paper-texture animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-6 border-b-2 border-ink pb-4">
          <span className="w-6 h-6 flex items-center justify-center border-2 border-ink bg-ink text-white rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </span>
          <h2 className="font-mono text-xl font-bold text-ink uppercase tracking-tighter">
            Configuration
          </h2>
        </div>

        <div className="space-y-6">
          {/* AI Toggle */}
          <div className="flex items-start gap-4 cursor-pointer group" onClick={toggleAI}>
            <div
              className={`mt-1 w-6 h-6 border-2 border-ink flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_rgba(26,26,26,0.3)] ${settings.enableAI ? 'bg-accent' : 'bg-white'}`}
            >
              {settings.enableAI && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-sm font-bold text-ink uppercase mb-1 group-hover:underline decoration-2 decoration-accent">
                Enable AI Features
              </h3>
              <p className="font-mono text-xs text-ink/60 leading-relaxed">
                Allow the experimental typewriter intelligence to help polish text and continue
                thoughts.
              </p>
            </div>
          </div>

          {/* Version Info */}
          <div className="pt-6 border-t-2 border-ink/10 text-center">
            <p className="font-mono text-[10px] text-ink/40 uppercase tracking-widest">
              Typewriter Notes v1.0
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="primary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
