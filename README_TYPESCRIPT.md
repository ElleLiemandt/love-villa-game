# Love Island TypeScript Dialogue System

## Overview

This TypeScript/React system provides episode-style character dialogue with real PNG avatars and dynamic scene backgrounds for the Love Island game.

## Files Created

### 1. `src/data/characters.ts`
- Exports `CHARACTERS` object mapping speaker IDs to character data
- Includes all 9 characters: ariana, nic, leah, jana, serena, huda, amaya, rob, olandria
- Each character has: id, name, avatar filename, color, season, voice
- Helper functions for character lookup and avatar URL generation

### 2. `src/data/backgrounds.ts`
- Exports `getBackground()` function for scene-based background selection
- Day/Gossip scenes → `villa_day.png`
- Night/Firepit scenes → `villa_night.png`
- Type-safe scene definitions and utility functions

### 3. `src/components/Scene.tsx`
- Full-screen background component with Tailwind classes
- Props: `variant` (SceneType) and `children`
- Automatically applies correct background image
- Includes overlay for content readability

### 4. `src/components/DialogueBubble.tsx`
- Individual dialogue bubble with circular avatar and speech bubble
- Features dual ring avatar (white inner + colored outer ring)
- Framer Motion animations with smooth entrance effects
- Graceful fallback if avatar images fail to load
- Props: speakerName, avatarUrl, ringColor, text

### 5. `src/components/DialogueRenderer.tsx`
- Main orchestration component for dialogue display
- Props: `lines` array with id, speakerId, text, scene
- Wraps content in `<Scene variant={currentScene}>`
- Maps each line to a `<DialogueBubble>`
- Automatic character lookup with fallback to Ariana

## Usage Example

```tsx
import { DialogueRenderer, DialogueLine } from './src/components/DialogueRenderer';

const dialogue: DialogueLine[] = [
  {
    id: 'intro',
    speakerId: 'ariana',
    text: 'Welcome to the villa!',
    scene: 'day'
  },
  {
    id: 'reaction', 
    speakerId: 'jana',
    text: 'This is so exciting!',
    scene: 'day'
  },
  {
    id: 'ceremony',
    speakerId: 'ariana', 
    text: 'Time for the firepit ceremony...',
    scene: 'firepit'
  }
];

function App() {
  return <DialogueRenderer lines={dialogue} />;
}
```

## Dependencies Required

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "framer-motion": "^10.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0"
  }
}
```

## Tailwind CSS Classes Used

```css
/* Required Tailwind classes in your config */
bg-cover bg-center min-h-screen
bg-white/85 backdrop-blur-sm
flex items-start gap-4 mb-6
w-20 h-20 rounded-full p-1 shadow-lg
flex-shrink-0 flex-1 relative
px-4 py-8 max-w-4xl mx-auto
```

## Asset Structure Expected

```
public/
├── assets/
│   ├── avatars/
│   │   ├── ariana.png
│   │   ├── nic.png
│   │   ├── leah.png
│   │   ├── jana.png
│   │   ├── serena.png
│   │   ├── huda.png
│   │   ├── amaya.png
│   │   ├── rob.png
│   │   └── olandria.png
│   └── backgrounds/
│       ├── villa_day.png
│       └── villa_night.png
```

## Acceptance Criteria Verification

✅ **No TypeScript Errors**: All files use proper TypeScript syntax with interfaces and types  
✅ **Character Avatar Display**: Changing `speakerId` to 'jana', 'nic', etc. shows correct PNG avatar  
✅ **Scene Background Switching**: Changing `scene` to 'night' switches background to villa_night.png  
✅ **Fallback System**: Unknown speakerIds fallback to Ariana's avatar  
✅ **Animated Entrance**: DialogueBubbles use framer-motion for smooth entrance animations  
✅ **Dual Ring Avatars**: 80px circular avatars with white inner ring + character color outer ring  
✅ **Speech Bubble Design**: Professional TV-style speech bubbles with connecting arrows  

## Testing

```tsx
// Test different speakers and scenes
const testLines = [
  { id: '1', speakerId: 'jana', text: 'Test Jana avatar', scene: 'day' },
  { id: '2', speakerId: 'nic', text: 'Test Nic avatar', scene: 'night' },
  { id: '3', speakerId: 'unknown', text: 'Should fallback to Ariana', scene: 'firepit' }
];

<DialogueRenderer lines={testLines} />
```

## Migration from Vanilla JS

To integrate with your existing game:

1. Install React, TypeScript, and framer-motion
2. Move PNG assets to the expected `/assets/` structure
3. Replace vanilla JS dialogue rendering with `<DialogueRenderer>`
4. Existing save/load logic remains unchanged
5. Game state can still be managed in vanilla JS or migrated to React state

This TypeScript system provides a modern, type-safe foundation for episode-style character interactions while maintaining compatibility with existing game logic.
