import React from 'react';
import { SingleSpeakerRenderer, DialogueLine } from '../components/SingleSpeakerRenderer';

/**
 * Example demonstrating the new single-speaker dialogue layout
 * Shows one avatar + speech bubble at a time with keyboard navigation
 */
export function SingleSpeakerExample() {
  // Example dialogue sequence
  const exampleLines: DialogueLine[] = [
    {
      id: 'welcome',
      speakerId: 'ariana',
      text: 'Welcome to Love Island USA! I\'m your host Ariana Madix, and this villa is about to get very interesting...',
      scene: 'day'
    },
    {
      id: 'jana_excited',
      speakerId: 'jana',
      text: 'OMG, I literally cannot believe I\'m actually here! This place is like a dream come true!',
      scene: 'day'
    },
    {
      id: 'nic_thoughtful',
      speakerId: 'nic',
      text: 'Yeah, it\'s pretty surreal. Still processing that this is actually happening, you know?',
      scene: 'day'
    },
    {
      id: 'leah_direct',
      speakerId: 'leah',
      text: 'Listen, I\'m not here to play games. I know what I want and I\'m going to go after it.',
      scene: 'gossip'
    },
    {
      id: 'serena_wisdom',
      speakerId: 'serena',
      text: 'The villa has a way of bringing out everyone\'s true colors. We\'re all about to learn a lot about ourselves.',
      scene: 'gossip'
    },
    {
      id: 'firepit_ceremony',
      speakerId: 'ariana',
      text: 'Islanders, please gather around the firepit. Tonight, everything changes. Are you ready?',
      scene: 'firepit'
    },
    {
      id: 'huda_observation',
      speakerId: 'huda',
      text: 'The tension in the air right now is absolutely electric. I can practically feel everyone\'s heartbeats.',
      scene: 'firepit'
    },
    {
      id: 'amaya_confidence',
      speakerId: 'amaya',
      text: 'I\'ve been waiting for this moment. Time to show everyone what I\'m really made of.',
      scene: 'night'
    }
  ];

  const handleComplete = () => {
    console.log('Dialogue sequence completed!');
    // Could navigate to next scene, show choices, etc.
  };

  return (
    <SingleSpeakerRenderer 
      lines={exampleLines}
      onComplete={handleComplete}
    />
  );
}

/**
 * Test component for different layouts and speakers
 */
export function SingleSpeakerTests() {
  const testLines: DialogueLine[] = [
    {
      id: 'test_left_align',
      speakerId: 'jana',
      text: 'This tests the default left alignment - avatar on left, bubble on right.',
      scene: 'day'
    },
    {
      id: 'test_long_text',
      speakerId: 'serena',
      text: 'This is a longer message to test how the speech bubble handles longer text content. It should wrap nicely and maintain good readability while staying within the max-width constraints.',
      scene: 'day'
    },
    {
      id: 'test_narrator',
      speakerId: 'narrator',
      text: 'This tests the narrator fallback - should show Ariana\'s avatar since narrator isn\'t in the character registry.',
      scene: 'night'
    },
    {
      id: 'test_mobile_responsive',
      speakerId: 'nic',
      text: 'This tests mobile responsiveness - avatar should be smaller on mobile.',
      scene: 'firepit'
    }
  ];

  return (
    <SingleSpeakerRenderer 
      lines={testLines}
      onComplete={() => console.log('Tests completed!')}
    />
  );
}

/**
 * Comparison component showing old vs new layouts side by side
 * (For development/testing purposes only)
 */
export function LayoutComparison() {
  const sampleLines: DialogueLine[] = [
    {
      id: 'comparison_1',
      speakerId: 'jana',
      text: 'Hey everyone! This is how the new single-speaker layout looks.',
      scene: 'day'
    },
    {
      id: 'comparison_2',
      speakerId: 'nic',
      text: 'Pretty clean and focused, right? No more scrolling through a chat feed.',
      scene: 'day'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 p-4">
      <div>
        <h2 className="text-xl font-bold mb-4">New: Single Speaker</h2>
        <div className="border rounded">
          <SingleSpeakerRenderer lines={sampleLines} />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Old: Stacked Bubbles</h2>
        <div className="border rounded">
          {/* Would show DialogueRenderer with old scrolling layout */}
          <div className="p-4 text-gray-500">
            (Old stacked bubble layout preserved for comparison)
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleSpeakerExample;
