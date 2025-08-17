export type SceneType = 'day' | 'night' | 'firepit' | 'gossip';

interface BackgroundMapping {
  [key: string]: string;
}

const BACKGROUND_MAP: BackgroundMapping = {
  day: '/assets/backgrounds/villa_day.png',
  gossip: '/assets/backgrounds/villa_day.png',
  night: '/assets/backgrounds/villa_night.png',
  firepit: '/assets/backgrounds/villa_night.png'
};

/**
 * Get background image URL for a given scene type
 * @param scene - The scene type ('day', 'night', 'firepit', 'gossip')
 * @returns Background image URL
 */
export function getBackground(scene: SceneType): string {
  return BACKGROUND_MAP[scene] || BACKGROUND_MAP.day;
}

/**
 * Get all available background URLs
 * @returns Object with all background mappings
 */
export function getAllBackgrounds(): BackgroundMapping {
  return { ...BACKGROUND_MAP };
}

/**
 * Check if scene should use day background
 * @param scene - The scene type
 * @returns True if scene uses day background
 */
export function isDayScene(scene: SceneType): boolean {
  return scene === 'day' || scene === 'gossip';
}

/**
 * Check if scene should use night background  
 * @param scene - The scene type
 * @returns True if scene uses night background
 */
export function isNightScene(scene: SceneType): boolean {
  return scene === 'night' || scene === 'firepit';
}