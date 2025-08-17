export interface Character {
  id: string;
  name: string;
  avatar: string;
  color: string;
  season?: string | number;
  voice?: string;
}

export const CHARACTERS: Record<string, Character> = {
  ariana: {
    id: 'ariana',
    name: 'Ariana Madix',
    avatar: 'ariana.png',
    color: '#E91E63',
    season: 'Host',
    voice: 'charismatic host'
  },
  
  // Season 6 (2024)
  serena: {
    id: 'serena',
    name: 'Serena',
    avatar: 'serena.png',
    color: '#FF6B9D',
    season: 6,
    voice: 'warm & steady'
  },
  
  leah: {
    id: 'leah',
    name: 'Leah',
    avatar: 'leah.png',
    color: '#E2B547',
    season: 6,
    voice: 'direct communicator'
  },
  
  jana: {
    id: 'jana',
    name: 'JaNa',
    avatar: 'jana.png',
    color: '#FF8C42',
    season: 6,
    voice: 'fun-loving spirit'
  },
  
  // Season 7 (2025)
  nic: {
    id: 'nic',
    name: 'Nic',
    avatar: 'nic.png',
    color: '#34495E',
    season: 7,
    voice: 'thoughtful introvert'
  },
  
  huda: {
    id: 'huda',
    name: 'Huda',
    avatar: 'huda.png',
    color: '#E67E22',
    season: 7,
    voice: 'witty observer'
  },
  
  amaya: {
    id: 'amaya',
    name: 'Amaya',
    avatar: 'amaya.png',
    color: '#C8102E',
    season: 7,
    voice: 'confident leader'
  },
  
  rob: {
    id: 'rob',
    name: 'Rob',
    avatar: 'rob.png',
    color: '#2980B9',
    season: 7,
    voice: 'confident charmer'
  },
  
  olandria: {
    id: 'olandria',
    name: 'Olandria',
    avatar: 'olandria.png',
    color: '#8E44AD',
    season: 7,
    voice: 'sharp & strategic'
  }
};

// Helper function to get character by ID with fallback to Ariana
export function getCharacter(speakerId: string): Character {
  return CHARACTERS[speakerId] || CHARACTERS.ariana;
}

// Helper function to get avatar URL with proper path
export function getAvatarUrl(speakerId: string): string {
  const character = getCharacter(speakerId);
  return `/assets/avatars/${character.avatar}`;
}