import React from 'react';
import { motion } from 'framer-motion';

interface SpeakerLineProps {
  avatarSrc: string;
  name: string;
  text: string;
  accentColor?: string;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * SpeakerLine - Single character avatar with one speech bubble
 * Replaces scrolling chat feed with simple single-speaker layout
 */
export function SpeakerLine({ 
  avatarSrc, 
  name, 
  text, 
  accentColor = '#E91E63',
  align = 'left', 
  className = '' 
}: SpeakerLineProps) {
  const isLeft = align === 'left';

  return (
    <motion.div
      key={`${name}-${text.slice(0, 20)}`} // Re-animate on content change
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`flex items-center gap-4 max-w-4xl mx-auto px-6 ${
        isLeft ? 'flex-row' : 'flex-row-reverse'
      } ${className}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div 
          className="w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {/* White inner ring */}
          <div className="w-full h-full bg-white rounded-full p-0.5">
            {/* Avatar image */}
            <img
              src={avatarSrc}
              alt={name}
              className="w-full h-full rounded-full object-cover bg-gray-100"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                // Fallback to colored circle with initial
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            {/* Fallback avatar */}
            <div 
              className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg hidden"
              style={{ backgroundColor: accentColor }}
            >
              {name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 relative" style={{ maxWidth: 'min(720px, 72vw)' }}>
        {/* Bubble tail */}
        <div 
          className={`absolute top-6 w-0 h-0 ${
            isLeft 
              ? 'left-0 transform -translate-x-2' 
              : 'right-0 transform translate-x-2'
          }`}
          style={{
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            [isLeft ? 'borderRight' : 'borderLeft']: '12px solid white'
          }}
        />
        
        {/* Message card */}
        <div 
          className={`bg-white rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border-l-4 ${
            isLeft ? 'ml-3' : 'mr-3'
          }`}
          style={{ borderLeftColor: accentColor }}
        >
          {/* Speaker name */}
          <div 
            className="font-bold text-sm mb-2 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            {name}
          </div>
          
          {/* Message text */}
          <div className="text-gray-800 leading-relaxed text-sm md:text-base">
            {text}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SpeakerLine;
