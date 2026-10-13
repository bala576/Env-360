// Static mock data for the Space & Occupancy page. Replace with API calls when available.

export type RoomStatus = 'In Use' | 'Available' | 'Out of Service';

export interface Room {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: string;
  status: RoomStatus;
  current: number;
  capacity: number;
  // Position on the floor plan (SVG units, 720x310 drawing)
  x: number;
  y: number;
  w: number;
  h: number;
  // Furniture drawn inside the room
  furniture: 'tables' | 'desks' | 'meeting' | 'lounge' | 'stage';
}

export interface SpaceTypeStat {
  label: string;
  occupants: number;
  capacity: number;
  color: string;
}

export interface Insight {
  title: string;
  text: string;
  icon: string;
  tone: string;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const SPACE_ICONS: Record<string, string[]> = {
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  pie: ['M12 3v9h9a9 9 0 11-9-9z', 'M15 3.5A9 9 0 0120.5 9H15z'],
  building: ['M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16', 'M15 9h4a1 1 0 011 1v11', 'M3 21h18', 'M8 8h3M8 12h3M8 16h3'],
  desk: ['M3 10h18', 'M5 10v9M19 10v9', 'M8 10V6h8v4', 'M9 14h6'],
  crowd: ['M8 6a2.5 2.5 0 100 5 2.5 2.5 0 000-5z', 'M16 6a2.5 2.5 0 100 5 2.5 2.5 0 000-5z', 'M3 19a5 5 0 0110 0', 'M11 19a5 5 0 0110 0'],
  chart: ['M3 3v18h18', 'M7 15l4-4 3 3 6-6', 'M16 8h4v4'],
  bulb: ['M9 18h6M10 21h4', 'M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z'],
  calendar: ['M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z', 'M4 10h16M8 3v4M16 3v4'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  expand: ['M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'],
  close: ['M6 6l12 12M18 6L6 18'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5', 'M3 17l9 5 9-5'],
};

export const SPACE_TABS = ['Overview', 'Live View', 'Space Utilization', 'Room Analytics', 'People Flow', 'Trends & Predictions', 'Reports'];

export const TOTAL_CAPACITY = 6200;
export const CURRENT_OCCUPANCY = 3842;

export const SPACE_TYPES: SpaceTypeStat[] = [
  { label: 'Meeting Rooms', occupants: 390, capacity: 500, color: '#7c3aed' },
  { label: 'Workstations', occupants: 1300, capacity: 2000, color: '#3b82f6' },
  { label: 'Collaboration Areas', occupants: 432, capacity: 800, color: '#22c55e' },
  { label: 'Cafeteria', occupants: 1066, capacity: 1300, color: '#f97316' },
  { label: 'Event Spaces', occupants: 216, capacity: 600, color: '#fbbf24' },
  { label: 'Others', occupants: 438, capacity: 1000, color: '#a8a8b8' },
];

// Bookable spaces across the site by status
export const SPACE_STATUS: { label: RoomStatus; value: number; color: string }[] = [
  { label: 'In Use', value: 128, color: '#22c55e' },
  { label: 'Available', value: 74, color: '#3b82f6' },
  { label: 'Out of Service', value: 8, color: '#ef4444' },
];

// Site occupancy (% of capacity) per hour: today so far, and the 7-day average
export const TREND_TODAY = [8, 6, 5, 5, 6, 9, 16, 28, 42, 55, 63, 70, 78, 83, 76, 74, 72, 70, 66, 61, 52];
export const TREND_AVERAGE = [9, 7, 6, 6, 7, 10, 15, 25, 38, 50, 58, 64, 70, 74, 70, 66, 64, 62, 58, 52, 44, 34, 22, 14];
export const TREND_YESTERDAY = [10, 8, 6, 6, 7, 11, 17, 27, 40, 52, 60, 67, 73, 79, 74, 70, 68, 65, 60, 55, 47, 37, 25, 15];

export const INSIGHTS: Insight[] = [
  { title: 'High Utilization', text: 'Cafeteria occupancy reached 84% between 12:00 – 14:00.', icon: 'crowd', tone: 'red' },
  { title: 'Underutilized Spaces', text: 'Meeting Rooms on Level 2 have < 30% average utilization.', icon: 'chart', tone: 'blue' },
  { title: 'Optimization Opportunity', text: 'Consider reconfiguring Workstation Zone 3 based on low occupancy.', icon: 'bulb', tone: 'green' },
  { title: 'Predicted Peak', text: 'AI predicts 15% higher occupancy tomorrow between 12:00 – 14:00.', icon: 'calendar', tone: 'purple' },
];

export const FLOORS = ['Level 1', 'Level 2', 'Level 3'];

// Optional rendered floor plan per level (e.g. 'floorplans/level-1.png' in /public), drawn
// under the heatmap instead of the vector plan. It must match the 720x310 plan layout.
export const FLOOR_IMAGES: Record<string, string | null> = {
  'Level 1': null,
  'Level 2': null,
  'Level 3': null,
};

// Shared room footprint on each floor; names and loads differ per level
const LAYOUT = [
  { x: 70, y: 20, w: 84, h: 96, furniture: 'tables' },
  { x: 160, y: 20, w: 128, h: 96, furniture: 'meeting' },
  { x: 294, y: 20, w: 58, h: 96, furniture: 'meeting' },
  { x: 358, y: 20, w: 52, h: 96, furniture: 'desks' },
  { x: 470, y: 20, w: 192, h: 96, furniture: 'lounge' },
  { x: 70, y: 150, w: 150, h: 142, furniture: 'tables' },
  { x: 246, y: 150, w: 112, h: 142, furniture: 'desks' },
  { x: 416, y: 150, w: 150, h: 142, furniture: 'desks' },
  { x: 572, y: 150, w: 90, h: 142, furniture: 'stage' },
] as const;

type RoomSpec = [name: string, type: string, building: string, status: RoomStatus, current: number, capacity: number];

const FLOOR_ROOMS: Record<string, RoomSpec[]> = {
  'Level 1': [
    ['Cafeteria - Express', 'Cafeteria', 'Building A', 'In Use', 62, 120],
    ['Meeting Room 1', 'Meeting Room', 'Building A', 'In Use', 8, 12],
    ['Meeting Room 3', 'Meeting Room', 'Building A', 'In Use', 9, 10],
    ['Focus Pods', 'Meeting Room', 'Building A', 'Available', 1, 8],
    ['Collaboration Area A', 'Collaboration', 'Building A', 'In Use', 45, 60],
    ['Cafeteria - Main', 'Cafeteria', 'Building A', 'In Use', 420, 500],
    ['Workstations - Zone 1', 'Workstation', 'Building A', 'In Use', 320, 500],
    ['Workstations - Zone 2', 'Workstation', 'Building A', 'In Use', 140, 400],
    ['Event Space', 'Event Space', 'Building A', 'In Use', 180, 300],
  ],
  'Level 2': [
    ['Training Room', 'Meeting Room', 'Building B', 'Available', 4, 40],
    ['Meeting Room 21', 'Meeting Room', 'Building B', 'Available', 2, 10],
    ['Meeting Room 22', 'Meeting Room', 'Building B', 'Out of Service', 0, 10],
    ['Phone Booths', 'Meeting Room', 'Building B', 'In Use', 3, 6],
    ['Collaboration Area B', 'Collaboration', 'Building B', 'In Use', 22, 60],
    ['Lounge', 'Others', 'Building B', 'In Use', 70, 150],
    ['Workstations - Zone 3', 'Workstation', 'Building B', 'In Use', 95, 400],
    ['Workstations - Zone 4', 'Workstation', 'Building B', 'In Use', 260, 400],
    ['Library', 'Others', 'Building B', 'In Use', 38, 80],
  ],
  'Level 3': [
    ['Executive Dining', 'Cafeteria', 'Building C', 'In Use', 48, 80],
    ['Board Room', 'Meeting Room', 'Building C', 'In Use', 14, 16],
    ['Meeting Room 31', 'Meeting Room', 'Building C', 'In Use', 6, 10],
    ['Wellness Room', 'Others', 'Building C', 'Available', 0, 6],
    ['Innovation Lab', 'Collaboration', 'Building C', 'In Use', 30, 40],
    ['Auditorium', 'Event Space', 'Building C', 'In Use', 210, 400],
    ['Workstations - Zone 5', 'Workstation', 'Building C', 'In Use', 300, 360],
    ['Workstations - Zone 6', 'Workstation', 'Building C', 'Out of Service', 0, 300],
    ['Event Hall', 'Event Space', 'Building C', 'Available', 12, 250],
  ],
};

export const ROOMS: Room[] = FLOORS.flatMap((floor, f) =>
  FLOOR_ROOMS[floor].map(([name, type, building, status, current, capacity], i) => ({
    id: `${f + 1}-${i + 1}`,
    name, type, building, status, current, capacity, floor,
    ...LAYOUT[i],
  })),
);
