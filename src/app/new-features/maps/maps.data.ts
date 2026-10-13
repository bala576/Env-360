// Static mock data for the Maps & Digital Twin page. Replace with API calls when available.

export type MapLayer = 'Buildings' | 'Floors' | 'Assets' | 'People' | 'Sensors' | 'Zones' | 'Heatmaps';
export type TrackKind = 'Employee' | 'Visitor' | 'Asset';

export interface Building {
  key: string;
  name: string;
  icon: string;
  color: string;
  stat: string;
  floors: number;
  // Footprint on the site map (map units) and extruded height in 3D view
  x: number;
  y: number;
  w: number;
  h: number;
  height: number;
  roof: string;
  wall: string;
  // 0-100, drives the Zones and Heatmaps layers
  occupancy: number;
  shape?: 'round';
}

export interface AssetType {
  name: string;
  count: number;
  color: string;
  mobile: boolean;
}

export interface HeatSpot {
  x: number;
  y: number;
  r: number;
  // 0-1, maps onto green / amber / red
  level: number;
}

export interface Tracked {
  kind: TrackKind;
  label: string;
  color: string;
  // Route walked on the tracking plan, in plan units
  route: [number, number][];
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const MAP_ICONS: Record<string, string[]> = {
  cube: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M4 7.5l8 4.5 8-4.5', 'M12 12v9'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5', 'M3 17.5l9 5 9-5'],
  expand: ['M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'],
  close: ['M6 6l12 12M18 6L6 18'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  chevron: ['M6 9l6 6 6-6'],
  chevronRight: ['M9 6l6 6-6 6'],
  parking: ['M7 20V4h6a4 4 0 010 8H7'],
  bag: ['M5 8h14l-1 12H6z', 'M9 8V6a3 3 0 016 0v2'],
  food: ['M7 3v8M5 3v5a2 2 0 004 0V3', 'M7 11v10', 'M16 3c-2 2-2 6 0 8v10'],
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  pin: ['M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z', 'M12 7a2 2 0 100 4 2 2 0 000-4z'],
  gear: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
  building: ['M5 21V5l7-2v18', 'M12 8h7v13', 'M8 8h.01M8 12h.01M8 16h.01M15 12h.01M15 16h.01', 'M3 21h18'],
  stack: ['M12 3l9 5-9 5-9-5z', 'M3 12l9 5 9-5', 'M3 16l9 5 9-5'],
  box: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M8 5.3l8 4.5'],
  wifi: ['M2 9a15 15 0 0120 0', 'M5 12.5a10 10 0 0114 0', 'M8.5 16a5 5 0 017 0', 'M12 19.5h.01'],
};

export const MAP_TABS = ['Overview', '3D View', 'Floor Plans', 'Assets', 'People', 'Sensors', 'Alerts', 'Layers', 'Analytics'];
export const MAP_LAYERS: MapLayer[] = ['Buildings', 'Floors', 'Assets', 'People', 'Sensors', 'Zones', 'Heatmaps'];
export const SITE_VIEWS = ['Dubai Mall', 'City Center (Deira)', 'Abu Dhabi Mall'];

export const SENSORS_ONLINE = 2485;
export const SENSORS_TOTAL = 2720;

export const BUILDINGS: Building[] = [
  { key: 'carpark', name: 'Car Park', icon: 'parking', color: '#2563eb', stat: 'Occupancy: 78%', floors: 6, x: 40, y: 56, w: 220, h: 150, height: 14, roof: '#a3a9b2', wall: '#7b828d', occupancy: 78 },
  { key: 'fashion', name: 'Fashion Zone', icon: 'bag', color: '#7c3aed', stat: 'Occupancy: 62%', floors: 6, x: 286, y: 40, w: 200, h: 140, height: 30, roof: '#e9e1d2', wall: '#b9ad99', occupancy: 62 },
  { key: 'food', name: 'Food Court', icon: 'food', color: '#f59e0b', stat: 'Temp: 24°C | CO₂: 600 ppm', floors: 5, x: 516, y: 48, w: 244, h: 156, height: 26, roof: '#efe7d8', wall: '#c2b6a1', occupancy: 84 },
  { key: 'entrance', name: 'Main Entrance', icon: 'people', color: '#16a34a', stat: 'Visitors: 1,240', floors: 6, x: 40, y: 250, w: 226, h: 146, height: 24, roof: '#e6ded0', wall: '#b6aa96', occupancy: 55 },
  { key: 'atrium', name: 'Central Atrium', icon: 'pin', color: '#2563eb', stat: 'Occupancy: 68%', floors: 0, x: 340, y: 228, w: 150, h: 150, height: 36, roof: '#bfe3f5', wall: '#9fb7c6', occupancy: 68, shape: 'round' },
  { key: 'hvac', name: 'HVAC Plant', icon: 'gear', color: '#ef4444', stat: '3 Active Alarms', floors: 5, x: 566, y: 248, w: 196, h: 146, height: 20, roof: '#d8d5ce', wall: '#a9a59c', occupancy: 35 },
];

export const ASSET_TYPES: AssetType[] = [
  { name: 'Equipment', count: 642, color: '#2563eb', mobile: false },
  { name: 'Parking Asset', count: 420, color: '#16a34a', mobile: false },
  { name: 'Digital Display', count: 125, color: '#f59e0b', mobile: false },
  { name: 'Sensor', count: 782, color: '#7c3aed', mobile: false },
  { name: 'Access Control', count: 86, color: '#ef4444', mobile: false },
  { name: 'EV Charger', count: 48, color: '#f97316', mobile: false },
  { name: 'Cleaning Robot', count: 12, color: '#0ea5e9', mobile: true },
  { name: 'Wheelchair', count: 36, color: '#14b8a6', mobile: true },
];

export const FLOORS = ['Roof', 'L3', 'L2', 'L1', 'B1', 'B2'];

// Hot spots on the 300 x 200 heatmap plan, per floor
export const HEATMAPS: Record<string, HeatSpot[]> = {
  Roof: [{ x: 70, y: 60, r: 26, level: 0.2 }, { x: 220, y: 140, r: 30, level: 0.35 }],
  L3: [{ x: 90, y: 50, r: 30, level: 0.45 }, { x: 200, y: 70, r: 34, level: 0.6 }, { x: 240, y: 160, r: 24, level: 0.25 }],
  L2: [{ x: 70, y: 120, r: 34, level: 0.7 }, { x: 180, y: 50, r: 30, level: 0.5 }, { x: 250, y: 150, r: 26, level: 0.3 }, { x: 140, y: 170, r: 20, level: 0.2 }],
  L1: [{ x: 80, y: 40, r: 38, level: 0.95 }, { x: 165, y: 75, r: 44, level: 0.9 }, { x: 250, y: 60, r: 26, level: 0.35 }, { x: 40, y: 150, r: 24, level: 0.25 },
    { x: 150, y: 165, r: 22, level: 0.3 }, { x: 260, y: 165, r: 24, level: 0.2 }, { x: 200, y: 130, r: 22, level: 0.4 }],
  B1: [{ x: 60, y: 60, r: 30, level: 0.55 }, { x: 210, y: 120, r: 36, level: 0.75 }],
  B2: [{ x: 120, y: 100, r: 34, level: 0.4 }, { x: 240, y: 50, r: 22, level: 0.2 }],
};

// Routes on the 400 x 200 tracking plan
export const TRACKED: Tracked[] = [
  { kind: 'Employee', label: 'Employee', color: '#2563eb', route: [[40, 120], [80, 70], [130, 50], [190, 40], [240, 60]] },
  { kind: 'Visitor', label: 'Visitor', color: '#7c3aed', route: [[110, 150], [170, 120], [220, 100], [280, 80], [330, 60]] },
  { kind: 'Asset', label: 'Asset', color: '#16a34a', route: [[150, 175], [210, 160], [260, 140], [300, 120], [350, 110]] },
];
