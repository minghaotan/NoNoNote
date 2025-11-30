import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { Button } from './Button';
import { polishText, continueThought } from '../services/geminiService';

interface EditorOverlayProps {
  isOpen: boolean;
  initialNote: Note | null;
  onSave: (title: string, content: string, id?: string) => void;
  onClose: () => void;
  enableAI: boolean;
}

export const EditorOverlay: React.FC<EditorOverlayProps> = ({
  isOpen,
  initialNote,
  onSave,
  onClose,
  enableAI,
}) => {
  const [content, setContent] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialNote) {
        setContent(initialNote.content);
      } else {
        setContent('');
      }
    }
  }, [isOpen, initialNote]);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      // Small timeout to allow animation to settle
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!content.trim()) {
      onClose();
      return;
    }

    // Auto-generate title internally for data structure
    const lines = content.trim().split('\n');
    const generatedTitle = (lines[0] ?? '').substring(0, 60).trim();

    onSave(generatedTitle, content, initialNote?.id);
    onClose();
  };

  const handleAiPolish = async () => {
    if (!content) return;
    setIsAiProcessing(true);
    try {
      const polished = await polishText(content);
      setContent(polished);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleAiContinue = async () => {
    if (!content) return;
    setIsAiProcessing(true);
    try {
      const continued = await continueThought(content);
      setContent((prev) => prev + (prev.endsWith(' ') ? '' : ' ') + continued);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-paper flex flex-col paper-texture animate-in slide-in-from-bottom duration-300">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b-2 border-ink bg-paper z-10 shadow-sm">
        <button
          onClick={onClose}
          className="text-ink hover:text-accent font-mono text-sm font-bold uppercase tracking-widest px-2"
        >
          Close
        </button>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-bold text-ink/40 uppercase tracking-widest hidden sm:inline-block">
            {initialNote ? 'Editing' : 'New Note'}
          </span>
        </div>

        <button
          onClick={handleSave}
          className="bg-ink text-white font-mono text-sm font-bold uppercase tracking-widest border-2 border-ink px-4 py-1 hover:bg-ink/80 transition-colors shadow-[2px_2px_0px_0px_rgba(255,82,82,1)]"
        >
          Save
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden relative w-full flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full h-full p-6 resize-none bg-transparent font-mono text-lg text-ink focus:outline-none leading-relaxed placeholder:text-ink/20"
          placeholder="Type your story here..."
          spellCheck={false}
        />
      </div>

      {/* AI Tools Bar - Only shown if enabled */}
      {enableAI && (
        <div className="p-4 border-t-2 border-ink bg-white pb-8 safe-area-bottom z-20">
          <div className="flex gap-3 justify-center max-w-md mx-auto overflow-x-auto">
            <Button
              variant="secondary"
              onClick={handleAiPolish}
              disabled={!content || isAiProcessing}
              loading={isAiProcessing}
              className="flex-shrink-0 text-xs px-4 py-2"
            >
              ✨ Polish
            </Button>
            <Button
              variant="secondary"
              onClick={handleAiContinue}
              disabled={!content || isAiProcessing}
              loading={isAiProcessing}
              className="flex-shrink-0 text-xs px-4 py-2"
            >
              🖊️ Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
