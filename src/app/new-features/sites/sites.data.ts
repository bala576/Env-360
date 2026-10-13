// Static mock data for the Sites & Spaces page. Replace with API calls when available.

export type PointStatus = 'normal' | 'warning' | 'critical' | 'offline';
export type NodeKind = 'org' | 'country' | 'city' | 'site' | 'building' | 'floor';
export type ParamKey = 'temperature' | 'humidity' | 'co2' | 'energy' | 'water' | 'occupancy';

export interface HierarchyNode {
  id: string;
  label: string;
  kind: NodeKind;
  count: number;
  children?: HierarchyNode[];
}

export interface FloorRoom {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

export interface MonitoringPoint {
  id: string;
  param: ParamKey;
  status: PointStatus;
  // Position in % of the floor plan
  x: number;
  y: number;
}

export interface Space {
  name: string;
  code: string;
  type: string;
  floor: string;
  area: number;
  capacity: number;
  points: number;
  devices: number;
  params: ParamKey[];
  status: 'Active' | 'Inactive';
  description: string;
}

export interface LiveParameter {
  key: ParamKey;
  label: string;
  value: string;
  unit: string;
  status: PointStatus;
  tone: string;
  color: string;
  history: number[];
}

export const STATUS_COLORS: Record<PointStatus, string> = {
  normal: '#16a34a',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#9ca3af',
};

export const PARAM_COLORS: Record<ParamKey, string> = {
  temperature: '#ef4444',
  humidity: '#2563eb',
  co2: '#16a34a',
  energy: '#f59e0b',
  water: '#0891b2',
  occupancy: '#7c3aed',
};

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const SITE_ICONS: Record<string, string[]> = {
  org: ['M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16', 'M14 9h5a1 1 0 011 1v11', 'M3 21h18', 'M7 8h2M7 12h2M7 16h2'],
  country: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M3 12h18', 'M12 3a14 14 0 010 18M12 3a14 14 0 000 18'],
  city: ['M3 21h18', 'M5 21V9h5v12', 'M10 21V4h9v17', 'M13 8h3M13 12h3M13 16h3'],
  site: ['M3 21h18', 'M5 21V7l7-4 7 4v14', 'M9 21v-5h6v5', 'M9 9h.01M15 9h.01M9 13h.01M15 13h.01'],
  building: ['M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17', 'M3 21h18', 'M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2'],
  floor: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  plus: ['M12 5v14M5 12h14'],
  import: ['M12 3v12', 'M7 10l5 5 5-5', 'M4 19h16'],
  export: ['M12 15V3', 'M7 8l5-5 5 5', 'M4 19h16'],
  list: ['M8 6h13M8 12h13M8 18h13', 'M3 6h.01M3 12h.01M3 18h.01'],
  map: ['M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z', 'M12 7.1a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z'],
  plan: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5', 'M3 8v5M21 8v5'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  columns: ['M4 4h16v16H4z', 'M10 4v16M15 4v16'],
  store: ['M4 9l1-5h14l1 5', 'M4 9h16v11H4z', 'M9 20v-6h6v6'],
  more: ['M5 12h.01M12 12h.01M19 12h.01'],
  alert: ['M12 7v6', 'M12 17h.01'],
  expand: ['M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'],
  temperature: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  humidity: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  co2: ['M7 18a4 4 0 01-.5-8A6 6 0 0118 9a4.5 4.5 0 01-.5 9z'],
  energy: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  water: ['M5 12a7 7 0 0014 0', 'M12 3v9', 'M8 7l4-4 4 4'],
  occupancy: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
};

export const PARAM_LABELS: Record<ParamKey, string> = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  co2: 'CO₂',
  energy: 'Energy',
  water: 'Water',
  occupancy: 'Occupancy',
};

export const HIERARCHY: HierarchyNode = {
  id: 'org', label: 'Purple IQ Demo', kind: 'org', count: 500,
  children: [
    {
      id: 'uae', label: 'UAE', kind: 'country', count: 12,
      children: [
        {
          id: 'dubai', label: 'Dubai', kind: 'city', count: 8,
          children: [
            {
              id: 'dubai-mall', label: 'Dubai Mall', kind: 'site', count: 1,
              children: [
                {
                  id: 'building-a', label: 'Building A (Main Mall)', kind: 'building', count: 6,
                  children: [
                    { id: 'L2', label: 'Level 2', kind: 'floor', count: 120 },
                    { id: 'L1', label: 'Level 1', kind: 'floor', count: 98 },
                    { id: 'GF', label: 'Ground Floor', kind: 'floor', count: 110 },
                    { id: 'B1', label: 'Basement 1', kind: 'floor', count: 86 },
                  ],
                },
                { id: 'building-b', label: 'Building B (Expansion)', kind: 'building', count: 4, children: [] },
                { id: 'parking-building', label: 'Parking Building', kind: 'building', count: 3, children: [] },
                { id: 'service-building', label: 'Service Building', kind: 'building', count: 1, children: [] },
              ],
            },
            { id: 'dubai-airport', label: 'Dubai Airport', kind: 'site', count: 1, children: [] },
            { id: 'dubai-municipality', label: 'Dubai Municipality', kind: 'site', count: 1, children: [] },
          ],
        },
        { id: 'abu-dhabi', label: 'Abu Dhabi', kind: 'city', count: 3, children: [] },
        { id: 'sharjah', label: 'Sharjah', kind: 'city', count: 1, children: [] },
      ],
    },
  ],
};

export const FLOORS = [
  { id: 'L2', short: 'L2', label: 'Level 2' },
  { id: 'L1', short: 'L1', label: 'Level 1' },
  { id: 'GF', short: 'GF', label: 'Ground Floor' },
  { id: 'B1', short: 'B1', label: 'Basement 1' },
];

// Floor plan schematic, coordinates in a 600x380 viewBox
export const FLOOR_ROOMS: FloorRoom[] = [
  { name: 'Fashion Store', x: 20, y: 20, w: 150, h: 120, fill: '#eef2ff' },
  { name: 'Electronics', x: 180, y: 20, w: 110, h: 90, fill: '#f0fdf4' },
  { name: 'Restaurant', x: 300, y: 20, w: 120, h: 90, fill: '#fef9c3' },
  { name: 'Food Court', x: 430, y: 20, w: 150, h: 150, fill: '#fff7ed' },
  { name: 'Atrium', x: 200, y: 130, w: 200, h: 110, fill: '#f8fafc' },
  { name: 'Restroom', x: 20, y: 150, w: 80, h: 70, fill: '#ecfeff' },
  { name: 'Retail Store', x: 20, y: 230, w: 170, h: 130, fill: '#f5f3ff' },
  { name: 'Kiosks', x: 200, y: 250, w: 140, h: 110, fill: '#fdf2f8' },
  { name: 'Meeting Room', x: 430, y: 240, w: 150, h: 120, fill: '#eff6ff' },
  { name: 'Corridor', x: 350, y: 180, w: 70, h: 180, fill: '#f1f5f9' },
];

const L1_POINTS: MonitoringPoint[] = [
  { id: 'p1', param: 'humidity', status: 'normal', x: 39, y: 13 },
  { id: 'p2', param: 'temperature', status: 'normal', x: 10, y: 28 },
  { id: 'p3', param: 'temperature', status: 'normal', x: 47, y: 32 },
  { id: 'p4', param: 'temperature', status: 'normal', x: 75, y: 24 },
  { id: 'p5', param: 'energy', status: 'warning', x: 30, y: 52 },
  { id: 'p6', param: 'temperature', status: 'critical', x: 45, y: 43 },
  { id: 'p7', param: 'temperature', status: 'offline', x: 15, y: 48 },
  { id: 'p8', param: 'temperature', status: 'offline', x: 19, y: 60 },
  { id: 'p9', param: 'temperature', status: 'normal', x: 22, y: 41 },
  { id: 'p10', param: 'temperature', status: 'critical', x: 28, y: 63 },
  { id: 'p11', param: 'temperature', status: 'normal', x: 15, y: 75 },
  { id: 'p12', param: 'energy', status: 'normal', x: 65, y: 58 },
  { id: 'p13', param: 'temperature', status: 'normal', x: 75, y: 62 },
  { id: 'p14', param: 'humidity', status: 'normal', x: 81, y: 80 },
  { id: 'p15', param: 'energy', status: 'warning', x: 63, y: 86 },
  { id: 'p16', param: 'temperature', status: 'normal', x: 47, y: 87 },
  { id: 'p17', param: 'humidity', status: 'normal', x: 9, y: 85 },
  { id: 'p18', param: 'co2', status: 'critical', x: 56, y: 27 },
];

// Derive other floors from Level 1 with shifted statuses so each floor looks distinct
function deriveFloor(shift: number): MonitoringPoint[] {
  const statuses: PointStatus[] = ['normal', 'normal', 'normal', 'warning', 'normal', 'critical', 'normal', 'offline'];
  return L1_POINTS.map((p, i) => ({
    ...p,
    id: `${p.id}-${shift}`,
    x: Math.min(95, Math.max(5, p.x + ((i * shift) % 7) - 3)),
    y: Math.min(92, Math.max(8, p.y + ((i * (shift + 2)) % 9) - 4)),
    status: statuses[(i + shift) % statuses.length],
  }));
}

export const FLOOR_POINTS: Record<string, MonitoringPoint[]> = {
  L2: deriveFloor(3),
  L1: L1_POINTS,
  GF: deriveFloor(5),
  B1: deriveFloor(2).slice(0, 12),
};

const SPACE_TEMPLATES: Omit<Space, 'name' | 'code' | 'floor'>[] = [
  { type: 'Retail Store', area: 245, capacity: 50, points: 4, devices: 8, params: ['temperature', 'humidity', 'co2', 'energy'], status: 'Active', description: 'Fashion retail outlet with environment monitoring and energy metering.' },
  { type: 'Retail Store', area: 180, capacity: 40, points: 3, devices: 6, params: ['temperature', 'humidity', 'co2', 'energy'], status: 'Active', description: 'Accessories retail outlet with HVAC and lighting monitoring.' },
  { type: 'Food & Beverage', area: 420, capacity: 120, points: 6, devices: 12, params: ['temperature', 'humidity', 'co2', 'energy'], status: 'Active', description: 'Full-service restaurant with kitchen exhaust and air quality monitoring.' },
  { type: 'Retail Store', area: 320, capacity: 80, points: 5, devices: 10, params: ['temperature', 'humidity', 'co2', 'energy'], status: 'Active', description: 'Electronics showroom with energy sub-metering.' },
  { type: 'Restroom', area: 60, capacity: 20, points: 4, devices: 8, params: ['temperature', 'humidity', 'co2', 'occupancy'], status: 'Active', description: 'Public restroom with occupancy and odour monitoring.' },
  { type: 'Meeting Room', area: 90, capacity: 12, points: 3, devices: 6, params: ['temperature', 'humidity', 'co2', 'water', 'occupancy'], status: 'Active', description: 'Bookable meeting room with occupancy and air quality sensors.' },
  { type: 'Retail Store', area: 280, capacity: 70, points: 4, devices: 8, params: ['temperature', 'humidity', 'co2', 'energy'], status: 'Active', description: 'Flagship fashion store with environment monitoring.' },
];

const SPACE_NAMES = ['Retail Store', 'Retail Store', 'Restaurant', 'Electronics', 'Restroom', 'Meeting Room', 'Fashion Store'];
const SPACE_CODES = ['RS', 'RS', 'RT', 'EL', 'WC', 'MR', 'FS'];

function buildSpaces(floor: string, total: number, start: number): Space[] {
  return Array.from({ length: total }, (_, i) => {
    const t = i % SPACE_TEMPLATES.length;
    const num = start + i + 1;
    const tpl = SPACE_TEMPLATES[t];
    return {
      ...tpl,
      name: `${SPACE_NAMES[t]} - ${num}`,
      code: `${SPACE_CODES[t]}-${num}`,
      floor,
      area: tpl.area + (i >= 7 ? (i * 13) % 60 : 0),
      status: i > 0 && i % 11 === 0 ? 'Inactive' : 'Active',
    };
  });
}

export const FLOOR_SPACES: Record<string, Space[]> = {
  L2: buildSpaces('Level 2', 120, 200),
  L1: buildSpaces('Level 1', 98, 100),
  GF: buildSpaces('Ground Floor', 110, 0),
  B1: buildSpaces('Basement 1', 86, 900),
};

export const LIVE_PARAMETERS: LiveParameter[] = [
  { key: 'temperature', label: 'Temperature', value: '22.4', unit: '°C', status: 'normal', tone: 'red', color: '#16a34a', history: [21.8, 22.1, 21.9, 22.3, 22.0, 22.5, 22.2, 22.6, 22.4] },
  { key: 'humidity', label: 'Humidity', value: '56.8', unit: '%RH', status: 'normal', tone: 'blue', color: '#16a34a', history: [54, 56, 55, 58, 55, 57, 56, 58, 56.8] },
  { key: 'co2', label: 'CO₂', value: '742', unit: 'ppm', status: 'normal', tone: 'green', color: '#16a34a', history: [700, 720, 690, 735, 710, 750, 728, 760, 742] },
  { key: 'energy', label: 'Energy', value: '12.4', unit: 'kWh', status: 'normal', tone: 'orange', color: '#16a34a', history: [11, 12.5, 11.8, 12.9, 12.1, 13.2, 12.3, 12.8, 12.4] },
];
