# Single-Speaker Dialogue System

## Overview

A simplified dialogue layout that shows **one character avatar + one speech bubble at a time** instead of a scrolling chat feed. Press Space or Enter to advance to the next line, re-rendering the same component with new speaker data.

## 🎯 Acceptance Criteria - ALL MET

✅ **Single Avatar + Bubble**: Only one avatar and speech bubble visible at a time  
✅ **Space/Enter Navigation**: Keyboard controls advance to next line  
✅ **Bubble Tail**: Small triangle points toward the avatar  
✅ **Villa Background**: Background image remains visible behind content  
✅ **Mobile Responsive**: Works on desktop and mobile devices  
✅ **No TypeScript Errors**: Clean TypeScript implementation  
✅ **Old System Preserved**: Legacy renderer available for rollback  

## 📁 Files Created

### **Core Components**

#### **1. `SpeakerLine.tsx`** - Single Avatar + Speech Bubble
```typescript
interface SpeakerLineProps {
  avatarSrc: string;
  name: string; 
  text: string;
  accentColor?: string;
  align?: 'left' | 'right'; // Default: 'left'
}
```

**Features:**
- **64-80px circular avatar** with 2-3px accent ring
- **Speech bubble** with white background, subtle shadow, proper padding
- **Bubble tail** pointing toward avatar (triangle pseudo-element)
- **Max-width**: `min(720px, 72vw)` for responsive design
- **Framer Motion animations** with smooth entrance effects

#### **2. `SingleSpeakerRenderer.tsx`** - Main Orchestrator
```typescript
interface SingleSpeakerRendererProps {
  lines: DialogueLine[];
  onComplete?: () => void;
}
```

**Features:**
- **One line at a time**: Shows current dialogue line only
- **Keyboard controls**: Space/Enter advances (preventDefault scroll)
- **Auto scene switching**: Background changes based on line.scene
- **Progress indicator**: Shows current position (1/5, 2/5, etc.)
- **Vertical centering**: Content centered with generous padding

### **Integration Options**

#### **3. `vanilla-integration.js`** - Vanilla JS Bridge
For existing vanilla JS projects:

```javascript
const speaker = new VanillaSingleSpeaker('dialogue-container', {
    useSingleSpeaker: true,
    onComplete: () => console.log('Dialogue finished!')
});

speaker.showDialogue([
    { id: '1', speakerId: 'ariana', text: 'Welcome!', scene: 'day' },
    { id: '2', speakerId: 'jana', text: 'So excited!', scene: 'day' }
]);
```

#### **4. Legacy `DialogueRenderer.tsx`** - Preserved for Rollback
- Old stacked bubble system available via feature flag
- Marked as `@deprecated` with migration guidance
- Zero breaking changes to existing code

## 🎬 Usage Examples

### TypeScript/React
```tsx
import { SingleSpeakerRenderer } from './src/components/SingleSpeakerRenderer';

const dialogue = [
  {
    id: 'intro',
    speakerId: 'ariana', 
    text: 'Welcome to Love Island!',
    scene: 'day'
  },
  {
    id: 'reaction',
    speakerId: 'jana',
    text: 'This is literally amazing!', 
    scene: 'day'
  }
];

<SingleSpeakerRenderer 
  lines={dialogue}
  onComplete={() => goToNextScene()}
/>
```

### Vanilla JavaScript
```javascript
// Include vanilla-integration.js in your HTML
const speaker = new VanillaSingleSpeaker('game-container');
speaker.showDialogue(dialogueLines);
```

## 🎨 Visual Design

### Avatar Styling
- **Perfect circle**: 64px (mobile) / 80px (desktop)
- **Dual ring**: White inner + character accent color outer (2-3px)
- **Shadow**: Subtle drop shadow for depth
- **Fallback**: Character initial if image fails to load

### Speech Bubble Styling  
- **Background**: White with subtle shadow
- **Padding**: 12-16px for comfortable reading
- **Border**: 4px left border in character accent color
- **Typography**: 14-16px text, proper line height
- **Tail**: 12px triangle pointing toward avatar

### Layout & Spacing
- **Centered**: Vertically centered with generous top/bottom padding
- **Responsive**: Works on mobile (stacked) and desktop (side-by-side)
- **Max-width**: Prevents overly wide bubbles on large screens
- **Villa background**: Always visible behind content

## 🎮 User Experience

### Navigation
- **Space** or **Enter**: Advance to next line
- **Auto-prevent**: Page scroll disabled during navigation
- **Progress indicator**: Shows current position (1/8, 2/8, etc.)
- **Completion callback**: Triggers when dialogue ends

### Animations
- **Entrance**: Smooth fade-in + slide-up (0.4s cubic-bezier)
- **Re-render**: Component re-animates on each line change
- **Key-based**: Framer Motion key ensures proper re-animation

### Accessibility
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Proper alt text and semantic markup
- **Mobile**: Touch-friendly with larger tap targets
- **Focus management**: Clear visual focus indicators

## 🔄 Migration Guide

### From Old Stacked System
```tsx
// Old way - stacked bubbles
<DialogueRenderer lines={dialogue} />

// New way - single speaker
<SingleSpeakerRenderer lines={dialogue} onComplete={handleComplete} />
```

### Feature Flag Rollback
```tsx
// Temporary rollback option
<DialogueRenderer lines={dialogue} useSingleSpeaker={false} />
```

### Vanilla JS Integration
```javascript
// Replace existing dialogue rendering
const speaker = new VanillaSingleSpeaker('dialogue-container');
speaker.showDialogue(lines);

// Old system still available
const speaker = new VanillaSingleSpeaker('dialogue-container', { 
    useSingleSpeaker: false 
});
```

## 🧪 Testing

### Test Cases Included
- **Different speakers**: Jana, Nic, Serena, etc. show correct avatars
- **Scene backgrounds**: Day vs night scenes change background
- **Long text**: Proper text wrapping and max-width handling
- **Mobile responsive**: Avatar sizing and layout adaptation
- **Keyboard navigation**: Space/Enter advancement works
- **Fallback cases**: Unknown speakers fall back to Ariana

### Run Tests
```bash
# TypeScript examples
npm run dev # Then navigate to /examples/single-speaker

# Vanilla JS tests  
# Open index.html with vanilla-integration.js included
```

## 🚀 Production Deployment

### Dependencies
```json
{
  "react": "^18.2.0",
  "framer-motion": "^10.16.0",
  "tailwindcss": "^3.3.0"
}
```

### Asset Requirements
```
/assets/avatars/ariana.png
/assets/avatars/jana.png  
/assets/avatars/nic.png
... (all character avatars)

/assets/backgrounds/villa_day.png
/assets/backgrounds/villa_night.png
```

### Performance
- **Lightweight**: Single component render vs multiple bubble stack
- **Smooth animations**: Hardware-accelerated CSS transforms
- **Memory efficient**: No accumulating DOM elements
- **Fast navigation**: Instant line switching with keyboard

## 🎯 Key Benefits

1. **Focused Experience**: One speaker at a time = clearer communication
2. **TV-Style Presentation**: Mimics actual Love Island episode dialogue
3. **Better Mobile UX**: No tiny scrolling chat feed on mobile
4. **Faster Navigation**: Space/Enter is faster than scrolling
5. **Cleaner Design**: Villa background always visible
6. **Performance**: Lighter DOM, smoother animations
7. **Accessibility**: Better keyboard navigation and screen reader support

This single-speaker system transforms the dialogue experience from a chat app feel to a professional TV episode presentation! 🏝️✨
