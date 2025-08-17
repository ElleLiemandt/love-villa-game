import React from 'react';
import { Scene } from './Scene';
import { DialogueBubble } from './DialogueBubble';
import { getCharacter, getAvatarUrl } from '../data/characters';
import { SceneType } from '../data/backgrounds';

export interface DialogueLine {
  id: string;
  speakerId: string;
  text: string;
  scene: SceneType;
}

interface DialogueRendererProps {
  lines: DialogueLine[];
  className?: string;
  useSingleSpeaker?: boolean; // Feature flag for new layout
}

/**
 * DialogueRenderer orchestrates the display of dialogue lines with appropriate backgrounds
 * Automatically handles character lookup, avatar display, and scene backgrounds
 * 
 * @deprecated - Use SingleSpeakerRenderer for new single-speaker layout
 */
export function DialogueRenderer({ lines, className = '', useSingleSpeaker = false }: DialogueRendererProps) {
  // Feature flag check
  if (useSingleSpeaker) {
    console.warn('DialogueRenderer: useSingleSpeaker=true, consider migrating to SingleSpeakerRenderer component');
  }

  // Determine current scene from the last line (or fallback to 'day')
  const currentScene: SceneType = lines.length > 0 
    ? lines[lines.length - 1].scene 
    : 'day';

  return (
    <Scene variant={currentScene} className={className}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Render each dialogue line */}
        {lines.map((line, index) => {
          // Get character data (fallback to Ariana for narrator/unknown speakers)
          const character = getCharacter(line.speakerId);
          const avatarUrl = getAvatarUrl(line.speakerId);
          
          const props = {
            speakerName: character.name,
            avatarUrl: avatarUrl,
            ringColor: character.color,
            text: line.text,
            className: index === lines.length - 1 ? 'mb-8' : ''
          };
          
          return React.createElement(DialogueBubble, {
            ...props,
            key: `${line.id}-${index}`
          });
        })}
        
        {/* Empty state */}
        {lines.length === 0 && (
          <div className="flex items-center justify-center min-h-[50vh] text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">🏝️</div>
              <div className="text-lg">No dialogue to display</div>
            </div>
          </div>
        )}
      </div>
    </Scene>
  );
}

export default DialogueRenderer;

/**
 * Example usage:
 * 
 * const exampleLines: DialogueLine[] = [
 *   {
 *     id: 'intro_1',
 *     speakerId: 'ariana',
 *     text: 'Welcome to the villa, islanders! Time to meet your potential matches.',
 *     scene: 'day'
 *   },
 *   {
 *     id: 'reaction_1', 
 *     speakerId: 'jana',
 *     text: 'Oh my gosh, everyone looks amazing! This is going to be so much fun!',
 *     scene: 'day'
 *   },
 *   {
 *     id: 'firepit_1',
 *     speakerId: 'ariana',
 *     text: 'Tonight at the firepit ceremony, everything changes...',
 *     scene: 'firepit'
 *   }
 * ];
 * 
 * <DialogueRenderer lines={exampleLines} />
 */