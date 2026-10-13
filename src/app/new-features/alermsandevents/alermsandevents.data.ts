// Static mock data for the Alarms & Events page. Replace with API calls when available.

export type Severity = 'Critical' | 'Major' | 'Minor' | 'Info';
export type AlarmStatus = 'Active' | 'Acknowledged' | 'Resolved';

export interface AlarmKpi {
  key: 'active' | Severity | 'acknowledged';
  label: string;
  icon: string;
  tone: string;
  change: number;
  // true when a rise is good news (e.g. more alarms acknowledged)
  upIsGood?: boolean;
}

export interface CategorySlice {
  label: string;
  color: string;
}

export interface TimelineStep {
  time: string;
  title: string;
  note?: string;
  status: string;
  tone: 'red' | 'green' | 'blue' | 'gray' | 'amber';
}

export interface Alarm {
  id: number;
  severity: Severity;
  date: string;
  time: string;
  site: string;
  location: string;
  parameter: string;
  icon: string;
  value: string;
  threshold: string;
  duration: string;
  status: AlarmStatus;
  building: string;
  level: string;
  spaceType: string;
  category: string;
  // Detail panel
  title: string;
  numericValue?: string;
  timeline: TimelineStep[];
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const ALARM_ICONS: Record<string, string[]> = {
  bell: ['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 01-3.4 0'],
  alert: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7.5v5.5M12 16.5h.01'],
  warning: ['M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z', 'M12 9v4M12 17h.01'],
  info: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 11v5.5M12 7.5h.01'],
  check: ['M20 6L9 17l-5-5'],
  checkCircle: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M8 12.5l2.7 2.7L16 9.8'],
  plus: ['M12 5v14M5 12h14'],
  more: ['M5 12h.01M12 12h.01M19 12h.01'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  close: ['M6 6l12 12M18 6L6 18'],
  user: ['M12 4a4 4 0 100 8 4 4 0 000-8z', 'M4 21a8 8 0 0116 0'],
  resolve: ['M5 4h14v16H5z', 'M8.5 12l2.5 2.5 4.5-4.5'],
  thermometer: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  drop: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  flame: ['M12 3c1 3 5 5 5 10a5 5 0 01-10 0c0-2.5 1.5-4 2.5-5 0 2 1 3 2 3 0-3-1-5.5.5-8z'],
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  wind: ['M3 8h11a3 3 0 10-3-3', 'M3 12h16a3 3 0 11-3 3', 'M3 16h7'],
  snow: ['M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7', 'M9 4l3 2 3-2M9 20l3-2 3 2'],
};

export const SEVERITY_META: Record<Severity, { color: string; icon: string }> = {
  Critical: { color: '#ef4444', icon: 'thermometer' },
  Major: { color: '#f97316', icon: 'warning' },
  Minor: { color: '#fbbf24', icon: 'warning' },
  Info: { color: '#8b5cf6', icon: 'info' },
};

export const ALARM_TABS = ['Active Alarms', 'Alarm History', 'Events', 'Alarm Rules', 'Notification Rules', 'Escalations'];
export const ALARM_DETAIL_TABS = ['Overview', 'Readings', 'Trend', 'Actions', 'Notes', 'Related Events'];

export const ALARM_KPIS: AlarmKpi[] = [
  { key: 'active', label: 'Active Alarms', icon: 'bell', tone: 'red', change: 4 },
  { key: 'Critical', label: 'Critical', icon: 'alert', tone: 'red-solid', change: 2 },
  { key: 'Major', label: 'Major', icon: 'warning', tone: 'orange', change: 1 },
  { key: 'Minor', label: 'Minor', icon: 'warning', tone: 'amber', change: -1 },
  { key: 'Info', label: 'Info', icon: 'info', tone: 'blue', change: 0 },
  { key: 'acknowledged', label: 'Acknowledged', icon: 'check', tone: 'green', change: 3, upIsGood: true },
];

// Alarms acknowledged earlier today that are no longer in the list below
export const ACKNOWLEDGED_TODAY = 8;

export const ALARM_CATEGORIES: CategorySlice[] = [
  { label: 'Temperature', color: '#ef4444' },
  { label: 'Water Level', color: '#f97316' },
  { label: 'Air Quality', color: '#fbbf24' },
  { label: 'Water Leak', color: '#8b5cf6' },
  { label: 'Energy', color: '#3b82f6' },
  { label: 'Others', color: '#9ca3af' },
];

export const SEVERITY_ORDER: Severity[] = ['Critical', 'Major', 'Minor', 'Info'];

// Hourly alarm counts for the last 24 hours, one entry per hour [critical, major, minor, info]
export const SEVERITY_HOURLY: number[][] = [
  [1, 1, 1, 1], [1, 0, 2, 1], [0, 1, 1, 1], [1, 1, 0, 0], [1, 0, 1, 1], [0, 1, 1, 0],
  [2, 1, 1, 0], [1, 1, 0, 1], [2, 2, 2, 1], [1, 1, 2, 0], [2, 1, 3, 1], [3, 2, 2, 1],
  [4, 2, 3, 0], [2, 1, 1, 1], [4, 3, 2, 0], [2, 1, 2, 1], [1, 1, 1, 0], [2, 1, 2, 1],
  [3, 2, 1, 0], [1, 1, 2, 1], [1, 2, 1, 0], [2, 1, 1, 0], [1, 1, 1, 1], [1, 0, 1, 0],
];

export const TREND_DAYS = ['15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May'];

// Daily alarm counts for the last 7 days per severity
export const TREND_SERIES: { severity: Severity; values: number[] }[] = [
  { severity: 'Critical', values: [10, 9, 11, 10, 18, 15, 20] },
  { severity: 'Major', values: [6, 8, 8, 9, 15, 14, 16] },
  { severity: 'Minor', values: [4, 6, 5, 7, 7, 9, 10] },
  { severity: 'Info', values: [2, 2, 3, 3, 5, 2, 7] },
];

function steps(triggered: string, note: string, severity: Severity, acked: boolean): TimelineStep[] {
  return [
    { time: triggered, title: 'Alarm Triggered', note, status: severity, tone: 'red' },
    { time: addMinutes(triggered, 2), title: 'Notification Sent', note: 'Email and SMS sent to facility team', status: 'Success', tone: 'green' },
    acked
      ? { time: addMinutes(triggered, 4), title: 'Acknowledged', note: 'by Ahmed (Facility Team)', status: 'Acknowledged', tone: 'blue' }
      : { time: '--:--', title: 'Acknowledge', status: 'Pending', tone: 'amber' },
    { time: '--:--', title: 'Assign to Technician', status: 'Not Assigned', tone: 'gray' },
    { time: '--:--', title: 'Resolution', status: 'Pending', tone: 'amber' },
  ];
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const DATE = '21 May 2025';

export const ALARMS: Alarm[] = [
  {
    id: 1, severity: 'Critical', date: DATE, time: '10:24', site: 'Dubai Mall', location: 'Cold Room 01',
    parameter: 'Temperature', icon: 'thermometer', value: '-18.2 °C', threshold: '< -20 °C', duration: '2h 15m', status: 'Active',
    building: 'Building A', level: 'Level 1', spaceType: 'Cold Storage', category: 'Temperature',
    title: 'Cold Room 01 - High Temperature',
    timeline: steps('10:24', 'Temperature -18.2 °C crossed threshold < -20 °C', 'Critical', true),
  },
  {
    id: 2, severity: 'Major', date: DATE, time: '10:18', site: 'Dubai Mall', location: 'Server Room',
    parameter: 'Water Leak', icon: 'drop', value: 'Detected', threshold: 'Leak Detected', duration: '1h 05m', status: 'Active',
    building: 'Building A', level: 'Basement', spaceType: 'Technical', category: 'Water Leak',
    title: 'Server Room - Water Leak',
    timeline: steps('10:18', 'Leak sensor reported water presence', 'Major', false),
  },
  {
    id: 3, severity: 'Critical', date: DATE, time: '10:15', site: 'Dubai Mall', location: 'Main DB',
    parameter: 'Energy Demand', icon: 'bolt', value: '650 kW', threshold: '> 600 kW', duration: '3h 42m', status: 'Active',
    building: 'Building B', level: 'Ground', spaceType: 'Technical', category: 'Energy',
    title: 'Main DB - High Energy Demand',
    timeline: steps('10:15', 'Energy demand 650 kW crossed threshold > 600 kW', 'Critical', true),
  },
  {
    id: 4, severity: 'Major', date: DATE, time: '09:58', site: 'Dubai Mall', location: 'Kitchen Area',
    parameter: 'LPG Gas', icon: 'flame', value: '120 ppm', threshold: '> 100 ppm', duration: '55m', status: 'Active',
    building: 'Building A', level: 'Level 2', spaceType: 'Food Court', category: 'Air Quality',
    title: 'Kitchen Area - LPG Gas Detected',
    timeline: steps('09:58', 'LPG 120 ppm crossed threshold > 100 ppm', 'Major', false),
  },
  {
    id: 5, severity: 'Critical', date: DATE, time: '09:45', site: 'Dubai Mall', location: 'Water Tank 01',
    parameter: 'Water Level', icon: 'drop', value: '3.2 m', threshold: '> 3.0 m', duration: '4h 12m', status: 'Active',
    building: 'Building C', level: 'Roof', spaceType: 'Utility', category: 'Water Level',
    title: 'Water Tank 01 - High Water Level',
    timeline: steps('09:45', 'Water level 3.2 m crossed threshold > 3.0 m', 'Critical', true),
  },
  {
    id: 6, severity: 'Minor', date: DATE, time: '09:30', site: 'Dubai Mall', location: 'Restroom - West',
    parameter: 'Occupancy', icon: 'people', value: '12', threshold: '> 10', duration: '1h 20m', status: 'Active',
    building: 'Building A', level: 'Level 1', spaceType: 'Restroom', category: 'Others',
    title: 'Restroom - West - High Occupancy',
    timeline: steps('09:30', 'Occupancy 12 crossed threshold > 10', 'Minor', false),
  },
  {
    id: 7, severity: 'Major', date: DATE, time: '09:10', site: 'Dubai Mall', location: 'Data Hall A',
    parameter: 'Temperature', icon: 'thermometer', value: '28.4 °C', threshold: '> 28 °C', duration: '2h 05m', status: 'Active',
    building: 'Building B', level: 'Level 3', spaceType: 'Technical', category: 'Temperature',
    title: 'Data Hall A - High Temperature',
    timeline: steps('09:10', 'Temperature 28.4 °C crossed threshold > 28 °C', 'Major', true),
  },
  {
    id: 8, severity: 'Info', date: DATE, time: '08:55', site: 'Dubai Mall', location: 'Parking - Zone A',
    parameter: 'Air Quality (CO₂)', icon: 'wind', value: '820 ppm', threshold: '> 800 ppm', duration: '3h 10m', status: 'Active',
    building: 'Parking', level: 'P1', spaceType: 'Parking', category: 'Air Quality',
    title: 'Parking - Zone A - Elevated CO₂',
    timeline: steps('08:55', 'CO₂ 820 ppm crossed threshold > 800 ppm', 'Info', false),
  },
  {
    id: 9, severity: 'Major', date: DATE, time: '08:40', site: 'Dubai Mall', location: 'Meeting Room 3',
    parameter: 'Humidity', icon: 'drop', value: '75 %RH', threshold: '> 70 %RH', duration: '4h 25m', status: 'Active',
    building: 'Building C', level: 'Level 4', spaceType: 'Office', category: 'Temperature',
    title: 'Meeting Room 3 - High Humidity',
    timeline: steps('08:40', 'Humidity 75 %RH crossed threshold > 70 %RH', 'Major', true),
  },
  {
    id: 10, severity: 'Minor', date: DATE, time: '08:12', site: 'Dubai Mall', location: 'HVAC Plant',
    parameter: 'Refrigerant Gas', icon: 'snow', value: '420 ppm', threshold: '> 400 ppm', duration: '5h 10m', status: 'Active',
    building: 'Building B', level: 'Roof', spaceType: 'Utility', category: 'Others',
    title: 'HVAC Plant - Refrigerant Leak',
    timeline: steps('08:12', 'Refrigerant 420 ppm crossed threshold > 400 ppm', 'Minor', true),
  },
  {
    id: 11, severity: 'Critical', date: DATE, time: '07:50', site: 'Dubai Mall', location: 'Freezer 02',
    parameter: 'Temperature', icon: 'thermometer', value: '-15.6 °C', threshold: '< -20 °C', duration: '5h 32m', status: 'Active',
    building: 'Building A', level: 'Level 1', spaceType: 'Cold Storage', category: 'Temperature',
    title: 'Freezer 02 - High Temperature',
    timeline: steps('07:50', 'Temperature -15.6 °C crossed threshold < -20 °C', 'Critical', true),
  },
  {
    id: 12, severity: 'Critical', date: DATE, time: '07:22', site: 'Dubai Mall', location: 'Water Tank 02',
    parameter: 'Water Level', icon: 'drop', value: '0.4 m', threshold: '< 0.5 m', duration: '6h 00m', status: 'Active',
    building: 'Building C', level: 'Roof', spaceType: 'Utility', category: 'Water Level',
    title: 'Water Tank 02 - Low Water Level',
    timeline: steps('07:22', 'Water level 0.4 m crossed threshold < 0.5 m', 'Critical', false),
  },
];
