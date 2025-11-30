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

  useEffect(() => {
    if (isOpen && textareaRef.current) {
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
    <div className="overlay-fullscreen animate-slide-up">
      <div className="overlay-toolbar">
        <button onClick={onClose} className="btn-text text-ink hover:text-accent px-2">
          Close
        </button>

        <div className="flex items-center gap-4">
          <span className="toolbar-label hidden sm:inline-block">
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

      <div className="flex-1 overflow-hidden relative w-full flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="editor-textarea"
          placeholder="Type your story here..."
          spellCheck={false}
        />
      </div>

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
