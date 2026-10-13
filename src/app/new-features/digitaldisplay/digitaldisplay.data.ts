// Static mock data for the Digital Displays page. Replace with API calls when available.

export type DisplayStatus = 'online' | 'offline';
export type PosterArt = 'skyline' | 'shopper' | 'food' | 'event' | 'arrow' | 'grid' | 'cinema';

export interface Display {
  id: string;
  name: string;
  site: string;
  building: string;
  zone: string;
  level: string;
  type: string;
  playlist: string;
  status: DisplayStatus;
  lastSeen: string;
  // Pin position on the level map, in map units
  x: number;
  y: number;
}

export interface Poster {
  key: string;
  title: string;
  eyebrow: string;
  lines: string[];
  cta?: string;
  bg: string;
  ink: string;
  accent: string;
  art: PosterArt;
}

export interface ScheduleSlot {
  time: string;
  poster: string;
  duration: number;
}

export interface SiteDef {
  name: string;
  // Chart axis label, one entry per line, and a one-word version for narrow charts
  label: string[];
  short: string;
  levels: string[];
  zones: { name: string; building: string }[];
  total: number;
  offline: number;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const DISPLAY_ICONS: Record<string, string[]> = {
  monitor: ['M3 5h18v11H3z', 'M8 20h8M12 16v4'],
  wifi: ['M2 9a15 15 0 0120 0', 'M5 12.5a10 10 0 0114 0', 'M8.5 16a5 5 0 017 0', 'M12 19.5h.01'],
  wifiOff: ['M3 3l18 18', 'M8.5 16a5 5 0 017 0', 'M5 12.5a10 10 0 015.5-2.8', 'M2 9a15 15 0 015-3.2', 'M17 9.6a10 10 0 012 1.6M14.5 5.3A15 15 0 0122 9', 'M12 19.5h.01'],
  play: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M10 8.5v7l6-3.5z'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  chevron: ['M6 9l6 6 6-6'],
  upload: ['M12 16V4', 'M7 9l5-5 5 5', 'M4 16v4h16v-4'],
  calendar: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3v4M16 3v4'],
  more: ['M5 12h.01M12 12h.01M19 12h.01'],
  image: ['M4 5h16v14H4z', 'M4 16l5-5 4 4 3-3 4 4', 'M15 9h.01'],
  video: ['M3 6h13v12H3z', 'M16 10l5-3v10l-5-3'],
  list: ['M8 6h13M8 12h13M8 18h13', 'M3 6h.01M3 12h.01M3 18h.01'],
  assign: ['M4 6h10M4 12h10M4 18h6', 'M16 15l3 3 3-6'],
  refresh: ['M20 11a8 8 0 10-2.3 5.7', 'M20 5v6h-6'],
  power: ['M12 3v9', 'M6.3 7a8 8 0 1011.4 0'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  pin: ['M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z'],
};

export const DISPLAY_TABS = ['Overview', 'Content Management', 'Playlists', 'Scheduling', 'Device Management', 'Zones & Locations', 'Reports'];

export const TOTAL_CHANGE = 8;
export const ACTIVE_PLAYLISTS = 18;
export const PLAYLIST_CHANGE = 12;

// Clock used for "Active / Upcoming" schedule states and last-seen times
export const NOW = '10:24';
export const TODAY = '21 May 2025';

export const POSTERS: Record<string, Poster> = {
  welcome: {
    key: 'welcome', title: 'Mall Welcome', eyebrow: 'DUBAI MALL', lines: ['SHOP', 'DINE', 'EXPLORE'], cta: 'DISCOVER MORE',
    bg: 'linear-gradient(180deg, #0b1230 0%, #2d2350 45%, #b0643a 82%, #e0a35a 100%)', ink: '#ffffff', accent: '#f6b73c', art: 'skyline',
  },
  promo: {
    key: 'promo', title: 'Promotional Campaign', eyebrow: 'LIMITED TIME', lines: ['SPECIAL', 'OFFER'], cta: 'UP TO 50% OFF',
    bg: 'linear-gradient(135deg, #fff1e3 0%, #fed7aa 55%, #fb923c 100%)', ink: '#7c2d12', accent: '#dc2626', art: 'shopper',
  },
  food: {
    key: 'food', title: 'Food & Beverage', eyebrow: 'LEVEL 2', lines: ['FOOD', 'COURT'], cta: 'TASTE THE WORLD',
    bg: 'linear-gradient(135deg, #1c1917 0%, #44281a 60%, #78350f 100%)', ink: '#ffffff', accent: '#fbbf24', art: 'food',
  },
  event: {
    key: 'event', title: 'Event Announcement', eyebrow: '24 - 30 MAY', lines: ['SUMMER', 'FESTIVAL'], cta: 'MAIN ATRIUM',
    bg: 'linear-gradient(135deg, #3b0764 0%, #7e22ce 55%, #db2777 100%)', ink: '#ffffff', accent: '#fde047', art: 'event',
  },
  wayfinding: {
    key: 'wayfinding', title: 'Wayfinding', eyebrow: 'PARKING', lines: ['P1', 'LEVELS B1-B3'], cta: '1,240 SPACES FREE',
    bg: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)', ink: '#ffffff', accent: '#4ade80', art: 'arrow',
  },
  directory: {
    key: 'directory', title: 'Directory', eyebrow: 'FIND A STORE', lines: ['STORE', 'DIRECTORY'], cta: 'TOUCH TO START',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #7c3aed 100%)', ink: '#ffffff', accent: '#c4b5fd', art: 'grid',
  },
  movies: {
    key: 'movies', title: 'Movie Schedule', eyebrow: 'REEL CINEMAS', lines: ['NOW', 'SHOWING'], cta: 'BOOK TICKETS',
    bg: 'linear-gradient(135deg, #18080a 0%, #5f0f1a 60%, #9f1239 100%)', ink: '#ffffff', accent: '#fcd34d', art: 'cinema',
  },
};

export const PLAYLIST_POSTER: Record<string, string> = {
  'Mall Welcome': 'welcome',
  'Food & Beverage': 'food',
  'Promotions': 'promo',
  'Wayfinding': 'wayfinding',
  'Directory': 'directory',
  'Movie Schedule': 'movies',
  'Event Announcement': 'event',
};

export const PLAYLISTS = Object.keys(PLAYLIST_POSTER);

// Daily schedule for each playlist: the playlist's own content opens the day,
// then the shared campaign slots follow
const SHARED_SLOTS: ScheduleSlot[] = [
  { time: '10:30', poster: 'promo', duration: 20 },
  { time: '12:00', poster: 'event', duration: 30 },
  { time: '16:00', poster: 'food', duration: 15 },
];

export function scheduleFor(playlist: string): ScheduleSlot[] {
  const own = PLAYLIST_POSTER[playlist] ?? 'welcome';
  const rest = SHARED_SLOTS.filter(s => s.poster !== own);
  return [{ time: '08:00', poster: own, duration: 30 }, ...rest];
}

export const DISPLAY_TYPES = ['LED Video Wall', 'LCD Display', 'Interactive Display', 'Outdoor LED'];

export const SITES: SiteDef[] = [
  {
    name: 'Dubai Mall', label: ['Dubai Mall'], short: 'Dubai', levels: ['Level 1', 'Level 2', 'Ground'], total: 38, offline: 3,
    zones: [
      { name: 'Main Entrance', building: 'Main Mall' },
      { name: 'Food Court', building: 'Main Mall' },
      { name: 'Fashion Avenue', building: 'Fashion Avenue' },
      { name: 'Parking', building: 'Grand Parking' },
      { name: 'Main Atrium', building: 'Main Mall' },
      { name: 'Cinema', building: 'Main Mall' },
    ],
  },
  {
    name: 'City Center (Deira)', label: ['City Center', '(Deira)'], short: 'Deira', levels: ['Level 1', 'Ground'], total: 24, offline: 1,
    zones: [
      { name: 'Entrance', building: 'Main Building' },
      { name: 'Hypermarket', building: 'Main Building' },
      { name: 'Food Court', building: 'Main Building' },
      { name: 'Parking', building: 'Multi-Storey Parking' },
    ],
  },
  {
    name: 'Abu Dhabi Mall', label: ['Abu Dhabi', 'Mall'], short: 'Abu Dhabi', levels: ['Level 1', 'Ground'], total: 22, offline: 1,
    zones: [
      { name: 'Entrance', building: 'Main Building' },
      { name: 'Atrium', building: 'Main Building' },
      { name: 'Food Court', building: 'East Wing' },
      { name: 'Cinema', building: 'East Wing' },
    ],
  },
  {
    name: 'Sharjah City Center', label: ['Sharjah City', 'Center'], short: 'Sharjah', levels: ['Ground'], total: 18, offline: 1,
    zones: [
      { name: 'Entrance', building: 'Main Building' },
      { name: 'Food Court', building: 'Main Building' },
      { name: 'Parking', building: 'Parking' },
    ],
  },
  {
    name: 'Ajman Mall', label: ['Ajman Mall'], short: 'Ajman', levels: ['Level 1', 'Ground'], total: 23, offline: 1,
    zones: [
      { name: 'Entrance', building: 'Main Building' },
      { name: 'Atrium', building: 'Main Building' },
      { name: 'Food Court', building: 'Main Building' },
      { name: 'Kids Zone', building: 'Family Wing' },
    ],
  },
];

// Hand-placed displays shown first in the table and on the Dubai Mall Level 1 map
export const FEATURED: Omit<Display, 'id'>[] = [
  { name: 'Main Entrance 01', site: 'Dubai Mall', building: 'Main Mall', zone: 'Main Entrance', level: 'Level 1', type: 'LED Video Wall', playlist: 'Mall Welcome', status: 'online', lastSeen: `${TODAY} 10:24`, x: 222, y: 130 },
  { name: 'Food Court 03', site: 'Dubai Mall', building: 'Main Mall', zone: 'Food Court', level: 'Level 1', type: 'LCD Display', playlist: 'Food & Beverage', status: 'online', lastSeen: `${TODAY} 10:24`, x: 62, y: 98 },
  { name: 'Fashion Zone 02', site: 'Dubai Mall', building: 'Fashion Avenue', zone: 'Fashion Avenue', level: 'Level 1', type: 'LCD Display', playlist: 'Promotions', status: 'offline', lastSeen: `${TODAY} 08:10`, x: 188, y: 70 },
  { name: 'Parking P1', site: 'Dubai Mall', building: 'Grand Parking', zone: 'Parking', level: 'Level 1', type: 'LCD Display', playlist: 'Wayfinding', status: 'online', lastSeen: `${TODAY} 10:23`, x: 260, y: 62 },
  { name: 'Information Desk', site: 'Dubai Mall', building: 'Main Mall', zone: 'Main Atrium', level: 'Level 1', type: 'Interactive Display', playlist: 'Directory', status: 'online', lastSeen: `${TODAY} 10:24`, x: 104, y: 46 },
  { name: 'Cinema Lobby', site: 'Dubai Mall', building: 'Main Mall', zone: 'Cinema', level: 'Level 1', type: 'LCD Display', playlist: 'Movie Schedule', status: 'online', lastSeen: `${TODAY} 10:24`, x: 46, y: 158 },
  { name: 'City Center Entrance', site: 'City Center (Deira)', building: 'Main Building', zone: 'Entrance', level: 'Level 1', type: 'LCD Display', playlist: 'Mall Welcome', status: 'online', lastSeen: `${TODAY} 10:22`, x: 160, y: 140 },
];

// Daily plays for the 14 days ending 21 May; failed share per day in %
export const PLAYBACK_END = new Date(2025, 4, 21);
export const DAILY_PLAYS = [2410, 2520, 2380, 2610, 2700, 2480, 2550, 2250, 2380, 2520, 2700, 2900, 3180, 2630];
export const FAILED_PCT = [3.1, 2.8, 3.0, 2.6, 2.4, 2.9, 2.7, 2.2, 2.0, 1.9, 2.1, 1.8, 1.7, 2.3];
// Same figures for the previous period of each range, used for the change indicators
export const PREV_PERIOD: Record<number, { total: number; success: number; failed: number }> = {
  7: { total: 16140, success: 96, failed: 3 },
  14: { total: 33320, success: 96, failed: 4 },
};
