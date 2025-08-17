import React from 'react';
import { DialogueRenderer, DialogueLine } from '../components/DialogueRenderer';

/**
 * Example demonstrating the TypeScript dialogue system
 * Shows how different speakers and scenes work together
 */
export function DialogueExample() {
  // Example dialogue lines showcasing the system
  const exampleLines: DialogueLine[] = [
    {
      id: 'day_intro',
      speakerId: 'ariana',
      text: 'Good morning islanders! Welcome to another beautiful day in the villa.',
      scene: 'day'
    },
    {
      id: 'jana_reaction',
      speakerId: 'jana',
      text: 'OMG this place is literally paradise! I\'m so excited to meet everyone!',
      scene: 'day'
    },
    {
      id: 'nic_intro',
      speakerId: 'nic',
      text: 'Yeah, it\'s pretty incredible. Still trying to take it all in, to be honest.',
      scene: 'day'
    },
    {
      id: 'serena_comment',
      speakerId: 'serena',
      text: 'The energy here is amazing. I can already tell this is going to be an unforgettable experience.',
      scene: 'day'
    },
    {
      id: 'gossip_transition',
      speakerId: 'leah',
      text: 'Okay but real talk... did anyone else notice the tension between those two earlier?',
      scene: 'gossip'
    },
    {
      id: 'huda_observation',
      speakerId: 'huda',
      text: 'Girl, I saw EVERYTHING. These people think they\'re being subtle but...',
      scene: 'gossip'
    },
    {
      id: 'firepit_drama',
      speakerId: 'ariana',
      text: 'Islanders, please gather around the firepit. Tonight, someone will be leaving the villa.',
      scene: 'firepit'
    },
    {
      id: 'amaya_concern',
      speakerId: 'amaya',
      text: 'This is it. Everything we\'ve worked for comes down to this moment.',
      scene: 'firepit'
    }
  ];

  return (
    <div className="min-h-screen">
      <DialogueRenderer lines={exampleLines} />
    </div>
  );
}

/**
 * Test cases for different scenarios
 */
export function createTestDialogue(): DialogueLine[] {
  return [
    // Test Jana with day scene
    {
      id: 'test_jana_day',
      speakerId: 'jana',
      text: 'This should show Jana\'s avatar (jana.png) with day background (villa_day.png)',
      scene: 'day'
    },
    
    // Test Nic with night scene  
    {
      id: 'test_nic_night',
      speakerId: 'nic', 
      text: 'This should show Nic\'s avatar (nic.png) with night background (villa_night.png)',
      scene: 'night'
    },
    
    // Test narrator fallback
    {
      id: 'test_narrator',
      speakerId: 'narrator',
      text: 'This should fallback to Ariana\'s avatar since narrator isn\'t in CHARACTERS',
      scene: 'firepit'
    },
    
    // Test Rob with gossip scene (should use day background)
    {
      id: 'test_rob_gossip',
      speakerId: 'rob',
      text: 'This should show Rob\'s avatar with day background since gossip uses day background',
      scene: 'gossip'
    }
  ];
}

export default DialogueExample;
