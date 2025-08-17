import React from 'react';
import { getBackground, SceneType } from '../data/backgrounds';

interface SceneProps {
  variant: SceneType;
  children: React.ReactNode;
  className?: string;
}

/**
 * Scene component that provides full-screen background based on scene type
 * Automatically switches between villa_day.png and villa_night.png
 */
export function Scene({ variant, children, className = '' }: SceneProps) {
  const backgroundUrl = getBackground(variant);
  
  return (
    <div 
      className={`bg-cover bg-center min-h-screen ${className}`}
      style={{ 
        backgroundImage: `url(${backgroundUrl})` 
      }}
    >
      {/* Background overlay for content readability */}
      <div className="bg-white/85 backdrop-blur-sm min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default Scene;