import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from './Scene';
import { SpeakerLine } from './SpeakerLine';
import { getCharacter, getAvatarUrl } from '../data/characters';
import { SceneType } from '../data/backgrounds';

export interface DialogueLine {
  id: string;
  speakerId: string;
  text: string;
  scene: SceneType;
}

interface SingleSpeakerRendererProps {
  lines: DialogueLine[];
  onComplete?: () => void;
  className?: string;
}

/**
 * SingleSpeakerRenderer - Shows one character avatar + speech bubble at a time
 * Space/Enter advances to next line, re-rendering the same component with new data
 */
export function SingleSpeakerRenderer({ 
  lines, 
  onComplete, 
  className = '' 
}: SingleSpeakerRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentLine = lines[currentIndex];
  const currentScene: SceneType = currentLine?.scene || 'day';
  
  // Advance to next line
  const advanceLine = useCallback(() => {
    if (currentIndex < lines.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, lines.length, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); // Prevent page scroll
        advanceLine();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [advanceLine]);

  // Reset index when lines change
  useEffect(() => {
    setCurrentIndex(0);
  }, [lines]);

  if (!currentLine) {
    return (
      <Scene variant="day" className={className}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">🏝️</div>
            <div className="text-lg">No dialogue to display</div>
          </div>
        </div>
      </Scene>
    );
  }

  // Get character data
  const character = getCharacter(currentLine.speakerId);
  const avatarUrl = getAvatarUrl(currentLine.speakerId);

  return (
    <Scene variant={currentScene} className={className}>
      {/* Centered single speaker line */}
      <div className="flex items-center justify-center min-h-screen py-12">
        <SpeakerLine
          avatarSrc={avatarUrl}
          name={character.name}
          text={currentLine.text}
          accentColor={character.color}
          align="left"
        />
      </div>
      
      {/* Progress indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm">
          <span className="hidden sm:inline">Press Space or Enter to continue • </span>
          {currentIndex + 1} / {lines.length}
        </div>
      </div>
    </Scene>
  );
}

/**
 * Hook for managing single-speaker dialogue state
 */
export function useSingleSpeakerDialogue(lines: DialogueLine[]) {
  const [isActive, setIsActive] = useState(false);
  const [currentLines, setCurrentLines] = useState<DialogueLine[]>([]);

  const start = useCallback((newLines: DialogueLine[]) => {
    setCurrentLines(newLines);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setCurrentLines([]);
  }, []);

  return {
    isActive,
    currentLines,
    start,
    stop
  };
}

export default SingleSpeakerRenderer;
