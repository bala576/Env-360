// Static mock data for the Operations & Maintenance page. Replace with API calls when available.

export type WoStatus = 'Open' | 'In Progress' | 'On Hold' | 'Overdue' | 'Closed';
export type WoPriority = 'High' | 'Medium' | 'Low';

export interface Activity {
  user: string;
  text: string;
  time: string;
}

export interface WorkOrder {
  id: number;
  number: string;
  title: string;
  device: string;
  deviceType: string;
  serial: string;
  location: string;
  building: string;
  priority: WoPriority;
  status: WoStatus;
  createdOn: string;
  scheduled: string;
  due: string;
  assignee: string;
  description: string;
  activities: Activity[];
  parts: { name: string; qty: number }[];
  attachments: string[];
  relatedAlarms: string[];
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const OPS_ICONS: Record<string, string[]> = {
  wrench: ['M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z'],
  clock: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v5l3 2'],
  clipboard: ['M9 4h6v3H9z', 'M9 5H6a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1h-3', 'M9 14l2 2 4-4'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M8.5 12l2.5 2.5 4.5-4.5'],
  gear: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z'],
  plus: ['M12 5v14M5 12h14'],
  chevron: ['M6 9l6 6 6-6'],
  more: ['M5 12h.01M12 12h.01M19 12h.01'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  export: ['M12 15V3', 'M7 8l5-5 5 5', 'M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  check: ['M20 6L9 17l-5-5'],
  close: ['M6 6l12 12M18 6L6 18'],
  thermometer: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  file: ['M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z', 'M14 3v6h6'],
  bell: ['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 01-3.4 0'],
  box: ['M21 8l-9-5-9 5 9 5 9-5z', 'M3 8v8l9 5 9-5V8', 'M12 13v8'],
};

export const OPS_TABS = ['Overview', 'Work Orders', 'Preventive Maintenance', 'Inspections', 'Calibration', 'Device Health', 'Maintenance Schedule', 'Spare Parts', 'Vendors & Technicians'];
export const WO_DETAIL_TABS = ['Activities', 'Parts Used', 'Attachments', 'Related Alarms'];

export const STATUS_META: Record<WoStatus, { color: string; cls: string }> = {
  'Open': { color: '#3b82f6', cls: 'st-open' },
  'Closed': { color: '#22c55e', cls: 'st-closed' },
  'Overdue': { color: '#ef4444', cls: 'st-overdue' },
  'In Progress': { color: '#f59e0b', cls: 'st-progress' },
  'On Hold': { color: '#8b5cf6', cls: 'st-hold' },
};

export const STATUS_ORDER: WoStatus[] = ['Open', 'Closed', 'Overdue', 'In Progress', 'On Hold'];
export const PRIORITIES: WoPriority[] = ['High', 'Medium', 'Low'];
export const TECHNICIANS = ['Ahmed Khan', 'Suresh Kumar', 'Fatima Ali', 'Omar Hassan', 'Priya Nair'];
export const BUILDINGS = ['Building A', 'Building B', 'Building C', 'Parking'];

// Small KPIs that don't come from the work order list
export const PREVENTIVE = { total: 56, completion: 12 };
export const DEVICE_HEALTH = { percent: 96, online: 2856, total: 2976 };
export const RESOLUTION = { hours: 6.4, change: -18 };
export const OVERDUE_CHANGE = 2;

export const COMPLIANCE = { scheduled: 86, completed: 75, pending: 9, overdue: 2 };

// Daily work orders for the last 14 days ending 27 May: [open, closed, overdue, in progress]
export const TREND_END = new Date(2025, 4, 27);
export const WO_TREND: number[][] = [
  [9, 6, 2, 3], [10, 7, 1, 4], [8, 9, 3, 2], [11, 8, 2, 5], [9, 10, 2, 3], [12, 9, 3, 4], [8, 7, 1, 2],
  [10, 11, 2, 5], [13, 10, 3, 6], [9, 8, 2, 3], [11, 12, 2, 4], [10, 9, 1, 3], [12, 10, 3, 5], [11, 9, 2, 4],
];
export const TREND_LABELS: WoStatus[] = ['Open', 'Closed', 'Overdue', 'In Progress'];

function act(user: string, text: string, time: string): Activity {
  return { user, text, time };
}

// The ten most recent work orders, as shown at the top of the list
const RECENT: Omit<WorkOrder, 'id' | 'number'>[] = [
  {
    title: 'Check high temperature alarm in cold room', device: 'Temperature Sensor', deviceType: 'Temperature Sensor', serial: 'TS-4587',
    location: 'Cold Room 01', building: 'Building A', priority: 'High', status: 'Open', createdOn: '21 May 2025 09:15',
    scheduled: '21 May 2025 10:00', due: '22 May 2025 14:00', assignee: 'Ahmed Khan',
    description: 'Investigate high temperature alarm. Check sensor accuracy and recalibrate if required.',
    activities: [
      act('Ahmed Khan', 'Started inspection', '21 May 2025 10:00'),
      act('Ahmed Khan', 'Checked sensor and verified alarm', '21 May 2025 09:40'),
      act('Suresh Kumar', 'Work order assigned to Ahmed Khan', '21 May 2025 09:20'),
    ],
    parts: [{ name: 'Calibration kit', qty: 1 }], attachments: ['alarm-snapshot.png', 'sensor-log.csv'], relatedAlarms: ['Cold Room 01 - High Temperature'],
  },
  {
    title: 'Replace door sensor battery', device: 'Door Sensor', deviceType: 'Door Sensor', serial: 'DS-1120',
    location: 'Cold Room 01', building: 'Building A', priority: 'Medium', status: 'In Progress', createdOn: '20 May 2025 16:30',
    scheduled: '21 May 2025 11:00', due: '21 May 2025 18:00', assignee: 'Fatima Ali',
    description: 'Low battery reported on door contact sensor. Replace CR2032 cell and confirm heartbeat.',
    activities: [act('Fatima Ali', 'Battery replacement in progress', '21 May 2025 11:05'), act('Suresh Kumar', 'Work order assigned to Fatima Ali', '20 May 2025 16:40')],
    parts: [{ name: 'CR2032 battery', qty: 2 }], attachments: [], relatedAlarms: [],
  },
  {
    title: 'Calibrate CO₂ sensor', device: 'CO₂ Sensor', deviceType: 'Air Quality Sensor', serial: 'AQ-2231',
    location: 'Meeting Room 3', building: 'Building C', priority: 'Medium', status: 'Open', createdOn: '20 May 2025 12:10',
    scheduled: '22 May 2025 09:00', due: '22 May 2025 17:00', assignee: 'Omar Hassan',
    description: 'Readings drifting by +60 ppm compared to reference meter. Perform two-point calibration.',
    activities: [act('Suresh Kumar', 'Work order assigned to Omar Hassan', '20 May 2025 12:15')],
    parts: [], attachments: ['drift-report.pdf'], relatedAlarms: [],
  },
  {
    title: 'Inspect water level sensor', device: 'Level Sensor', deviceType: 'Level Sensor', serial: 'LS-0912',
    location: 'Manhole - Zone A', building: 'Parking', priority: 'High', status: 'Overdue', createdOn: '18 May 2025 08:00',
    scheduled: '20 May 2025 10:00', due: '20 May 2025 16:00', assignee: 'Priya Nair',
    description: 'Sensor reporting intermittent values. Inspect for debris and check cable gland.',
    activities: [act('System', 'Work order marked overdue', '20 May 2025 16:00'), act('Suresh Kumar', 'Work order assigned to Priya Nair', '18 May 2025 08:10')],
    parts: [], attachments: [], relatedAlarms: ['Manhole - Zone A - Sensor Fault'],
  },
  {
    title: 'HVAC filter replacement', device: 'HVAC Unit', deviceType: 'HVAC Unit', serial: 'HV-3301',
    location: 'Data Hall A', building: 'Building B', priority: 'Low', status: 'Closed', createdOn: '17 May 2025 10:00',
    scheduled: '20 May 2025 09:00', due: '20 May 2025 17:00', assignee: 'Omar Hassan',
    description: 'Quarterly filter replacement for CRAC unit 2.',
    activities: [act('Omar Hassan', 'Filters replaced, work order closed', '20 May 2025 12:30')],
    parts: [{ name: 'G4 panel filter', qty: 4 }], attachments: [], relatedAlarms: [],
  },
  {
    title: 'Clean air quality sensor', device: 'Air Quality Sensor', deviceType: 'Air Quality Sensor', serial: 'AQ-1984',
    location: 'Level 1 - Food Court', building: 'Building A', priority: 'Low', status: 'Closed', createdOn: '16 May 2025 14:20',
    scheduled: '19 May 2025 08:00', due: '19 May 2025 12:00', assignee: 'Fatima Ali',
    description: 'Clean optical chamber of PM sensor exposed to cooking fumes.',
    activities: [act('Fatima Ali', 'Sensor cleaned, readings normal', '19 May 2025 09:10')],
    parts: [], attachments: [], relatedAlarms: [],
  },
  {
    title: 'Replace parking sensor', device: 'Parking Sensor', deviceType: 'Parking Sensor', serial: 'PK-5521',
    location: 'Parking - Zone B', building: 'Parking', priority: 'Medium', status: 'Open', createdOn: '20 May 2025 09:00',
    scheduled: '22 May 2025 07:00', due: '22 May 2025 12:00', assignee: 'Priya Nair',
    description: 'Bay B-112 sensor damaged by vehicle. Replace unit and re-pair with gateway.',
    activities: [act('Suresh Kumar', 'Work order assigned to Priya Nair', '20 May 2025 09:05')],
    parts: [{ name: 'Parking sensor puck', qty: 1 }], attachments: ['damage-photo.jpg'], relatedAlarms: [],
  },
  {
    title: 'Update firmware', device: 'Gateway', deviceType: 'Gateway', serial: 'GW-0007',
    location: 'Main DB Room', building: 'Building B', priority: 'Medium', status: 'In Progress', createdOn: '19 May 2025 15:00',
    scheduled: '21 May 2025 22:00', due: '22 May 2025 02:00', assignee: 'Omar Hassan',
    description: 'Apply gateway firmware v3.4.1 during the night maintenance window.',
    activities: [act('Omar Hassan', 'Firmware download started', '21 May 2025 22:05')],
    parts: [], attachments: ['release-notes.pdf'], relatedAlarms: [],
  },
  {
    title: 'Inspect water tank sensor', device: 'Level Sensor', deviceType: 'Level Sensor', serial: 'LS-0450',
    location: 'Water Tank 01', building: 'Building C', priority: 'High', status: 'Open', createdOn: '21 May 2025 08:00',
    scheduled: '23 May 2025 09:00', due: '23 May 2025 15:00', assignee: 'Ahmed Khan',
    description: 'High water level alarm raised twice this week. Verify float and ultrasonic readings.',
    activities: [act('Suresh Kumar', 'Work order assigned to Ahmed Khan', '21 May 2025 08:05')],
    parts: [], attachments: [], relatedAlarms: ['Water Tank 01 - High Water Level'],
  },
  {
    title: 'Meeting room display issue', device: 'E-Ink Display', deviceType: 'Display', serial: 'EI-3310',
    location: 'Meeting Room 1', building: 'Building C', priority: 'Low', status: 'Closed', createdOn: '15 May 2025 11:00',
    scheduled: '18 May 2025 10:00', due: '18 May 2025 16:00', assignee: 'Fatima Ali',
    description: 'Display not refreshing booking schedule. Reset and re-provision.',
    activities: [act('Fatima Ali', 'Display re-provisioned, issue resolved', '18 May 2025 11:20')],
    parts: [], attachments: [], relatedAlarms: [],
  },
];

// Templates used to fill the rest of the history
const TEMPLATES = [
  { title: 'Inspect smoke detector', device: 'Smoke Detector', deviceType: 'Safety Sensor', location: 'Corridor L2' },
  { title: 'Calibrate humidity sensor', device: 'Humidity Sensor', deviceType: 'Temperature Sensor', location: 'Storage Area - 2' },
  { title: 'Replace occupancy sensor', device: 'Occupancy Sensor', deviceType: 'Occupancy Sensor', location: 'Restroom - West' },
  { title: 'Check energy meter readings', device: 'Energy Meter', deviceType: 'Energy Meter', location: 'Main DB' },
  { title: 'Clean condensate drain', device: 'HVAC Unit', deviceType: 'HVAC Unit', location: 'AHU Room 3' },
  { title: 'Verify leak detection cable', device: 'Leak Sensor', deviceType: 'Leak Sensor', location: 'Server Room' },
  { title: 'Gateway connectivity check', device: 'Gateway', deviceType: 'Gateway', location: 'IT Room' },
  { title: 'Replace temperature probe', device: 'Temperature Sensor', deviceType: 'Temperature Sensor', location: 'Freezer 02' },
];

// Status mix for the generated history, tuned so the full list totals
// 52 open, 46 closed, 8 overdue, 12 in progress and 6 on hold
const HISTORY_STATUS: WoStatus[] = [
  ...Array(48).fill('Open'), ...Array(43).fill('Closed'), ...Array(7).fill('Overdue'),
  ...Array(10).fill('In Progress'), ...Array(6).fill('On Hold'),
];

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateHistory(count: number): Omit<WorkOrder, 'id' | 'number'>[] {
  const rand = seeded(7);
  const statuses = [...HISTORY_STATUS].sort(() => rand() - 0.5);
  return Array.from({ length: count }, (_, i) => {
    const t = TEMPLATES[i % TEMPLATES.length];
    const day = 17 - Math.floor(i / 9);
    const date = `${day > 0 ? day : day + 30} ${day > 0 ? 'May' : 'Apr'} 2025`;
    const assignee = TECHNICIANS[Math.floor(rand() * TECHNICIANS.length)];
    return {
      ...t,
      serial: `${t.device.slice(0, 2).toUpperCase()}-${1000 + Math.floor(rand() * 8999)}`,
      building: BUILDINGS[Math.floor(rand() * BUILDINGS.length)],
      priority: PRIORITIES[Math.floor(rand() * 3)],
      status: statuses[i % statuses.length],
      createdOn: `${date} 09:00`,
      scheduled: `${date} 10:00`,
      due: `${date} 17:00`,
      assignee,
      description: `${t.title} at ${t.location}.`,
      activities: [act('Suresh Kumar', `Work order assigned to ${assignee}`, `${date} 09:05`)],
      parts: [], attachments: [], relatedAlarms: [],
    };
  });
}

export const WORK_ORDERS: WorkOrder[] = [...RECENT, ...generateHistory(114)].map((wo, i) => ({
  ...wo,
  id: 124 - i,
  number: `WO-2025-${String(124 - i).padStart(4, '0')}`,
}));
