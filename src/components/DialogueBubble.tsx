import React from 'react';
import { motion } from 'framer-motion';

interface DialogueBubbleProps {
  speakerName: string;
  avatarUrl: string;
  ringColor: string;
  text: string;
  className?: string;
}

/**
 * DialogueBubble component with circular avatar and speech bubble
 * Features dual ring avatar (white inner + colored outer) and animated entrance
 */
export function DialogueBubble({ 
  speakerName, 
  avatarUrl, 
  ringColor, 
  text, 
  className = '' 
}: DialogueBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.4, 0, 0.2, 1] // cubic-bezier easing for smooth entrance
      }}
      className={`flex items-start gap-4 mb-6 ${className}`}
    >
      {/* Avatar Container */}
      <div className="flex-shrink-0">
        <div 
          className="w-20 h-20 rounded-full p-1 shadow-lg"
          style={{ backgroundColor: ringColor }}
        >
          {/* White inner ring */}
          <div className="w-full h-full bg-white rounded-full p-1">
            {/* Avatar image */}
            <img
              src={avatarUrl}
              alt={speakerName}
              className="w-full h-full rounded-full object-cover bg-gray-100"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                // Fallback to colored background with initials if image fails
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
              style={{ backgroundColor: ringColor }}
            >
              {speakerName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 relative">
        {/* Speech bubble arrow */}
        <div 
          className="absolute left-0 top-6 w-0 h-0 transform -translate-x-2"
          style={{
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '12px solid white'
          }}
        />
        
        {/* Message card */}
        <div 
          className="bg-white rounded-2xl px-5 py-4 shadow-lg border-l-4"
          style={{ borderLeftColor: ringColor }}
        >
          {/* Speaker name */}
          <div 
            className="font-bold text-sm mb-2 uppercase tracking-wide"
            style={{ color: ringColor }}
          >
            {speakerName}
          </div>
          
          {/* Message text */}
          <div className="text-gray-800 leading-relaxed">
            {text}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DialogueBubble;