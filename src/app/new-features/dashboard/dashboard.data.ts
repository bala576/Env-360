// Static mock data for the overview dashboard. Replace with API calls when available.

export type Tone = 'purple' | 'green' | 'blue' | 'red' | 'orange' | 'pink' | 'yellow' | 'gray';
export type SiteStatus = 'normal' | 'warning' | 'critical' | 'offline';
export type Severity = 'critical' | 'major' | 'warning' | 'minor';

export interface Kpi {
  label: string;
  value: string;
  change: string;
  direction: 'up' | 'down';
  good: boolean;
  icon: string;
  tone: Tone;
}

export interface SiteMarker {
  name: string;
  lat: number;
  lng: number;
  count: number;
  status: SiteStatus;
}

export interface CategorySlice {
  label: string;
  value: number;
  color: string;
}

export interface HealthMetric {
  label: string;
  value: number;
  icon: string;
  tone: Tone;
}

export interface SensorReading {
  label: string;
  value: string;
  unit: string;
  icon: string;
  tone: Tone;
  color: string;
  history: number[];
}

export interface TrendSeries {
  key: string;
  label: string;
  unit: string;
  color: string;
  min: number;
  max: number;
  data: number[];
}

export interface SiteAlarms {
  name: string;
  critical: number;
  warning: number;
  minor: number;
}

export interface RecentAlarm {
  title: string;
  location: string;
  time: string;
  severity: Severity;
  icon: string;
  tone: Tone;
}

export interface SpaceUsage {
  label: string;
  value: number;
  caption: string;
  icon: string;
  tone: Tone;
}

export interface EnergyDay {
  label: string;
  value: number;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const DASHBOARD_ICONS: Record<string, string[]> = {
  building: ['M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16', 'M14 9h5a1 1 0 011 1v11', 'M3 21h18', 'M7 8h2M7 12h2M7 16h2M10 8h1M10 12h1M10 16h1M17 13h.01M17 17h.01'],
  device: ['M6 3h12a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z', 'M9 21h6M12 17v4', 'M9 8h6M9 12h4'],
  wifi: ['M2 9a15 15 0 0120 0', 'M5 12.5a10 10 0 0114 0', 'M8.5 16a5 5 0 017 0', 'M12 19.5h.01'],
  bell: ['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 01-3.4 0'],
  automation: ['M7 4a3 3 0 100 6 3 3 0 000-6z', 'M17 14a3 3 0 100 6 3 3 0 000-6z', 'M10 7h4a3 3 0 013 3v4', 'M14 17h-4a3 3 0 01-3-3v-4'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  thermometer: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  droplet: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  wind: ['M3 8h11a3 3 0 10-3-3', 'M3 12h16a3 3 0 11-3 3', 'M3 16h7'],
  water: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z', 'M9 14a3 3 0 003 3'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  cloud: ['M7 18a4 4 0 01-.5-8A6 6 0 0118 9a4.5 4.5 0 01-.5 9z'],
  door: ['M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17', 'M3 21h18', 'M15 12h.01'],
  office: ['M3 21h18', 'M5 21V8l7-5 7 5v13', 'M9 21v-6h6v6', 'M9 11h.01M15 11h.01'],
  meeting: ['M8 7a2 2 0 100 4 2 2 0 000-4zM16 7a2 2 0 100 4 2 2 0 000-4z', 'M3 19a5 5 0 0110 0M11 19a5 5 0 0110 0'],
  restroom: ['M7 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM17 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z', 'M5 9h4l1 6H8v6H6v-6H4z', 'M15 9h4l2 7h-2v5h-4v-5h-2z'],
  parking: ['M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z', 'M9 17V7h4a3 3 0 010 6H9'],
  settings: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
};

export const KPIS: Kpi[] = [
  { label: 'Total Sites', value: '50', change: '3', direction: 'up', good: true, icon: 'building', tone: 'purple' },
  { label: 'Total Devices', value: '3,120', change: '8%', direction: 'up', good: true, icon: 'device', tone: 'green' },
  { label: 'Active Sensors', value: '2,856', change: '6%', direction: 'up', good: true, icon: 'wifi', tone: 'blue' },
  { label: 'Active Alarms', value: '12', change: '4', direction: 'up', good: false, icon: 'bell', tone: 'red' },
  { label: 'Automation Rules', value: '86', change: '2', direction: 'up', good: true, icon: 'automation', tone: 'orange' },
  { label: 'Compliance Score', value: '92.4%', change: '3.2%', direction: 'up', good: true, icon: 'shield', tone: 'green' },
];

export const SITE_MARKERS: SiteMarker[] = [
  { name: 'Dubai Downtown', lat: 25.2048, lng: 55.2708, count: 12, status: 'normal' },
  { name: 'Sharjah', lat: 25.3463, lng: 55.4209, count: 8, status: 'normal' },
  { name: 'Ajman Road', lat: 25.3, lng: 55.52, count: 3, status: 'warning' },
  { name: 'Deira', lat: 25.25, lng: 55.42, count: 2, status: 'critical' },
  { name: 'Al Warqa', lat: 25.16, lng: 55.42, count: 5, status: 'warning' },
  { name: 'Dubai Marina', lat: 25.08, lng: 55.14, count: 7, status: 'normal' },
  { name: 'Jebel Ali', lat: 24.99, lng: 55.07, count: 4, status: 'normal' },
  { name: 'Al Qudra', lat: 24.95, lng: 55.32, count: 2, status: 'offline' },
];

export const SITE_SUMMARY: { status: SiteStatus; label: string; count: number }[] = [
  { status: 'normal', label: 'Normal', count: 38 },
  { status: 'warning', label: 'Warning', count: 7 },
  { status: 'critical', label: 'Critical', count: 3 },
  { status: 'offline', label: 'Offline', count: 2 },
];

export const ALARM_CATEGORIES: CategorySlice[] = [
  { label: 'Temperature', value: 4, color: '#ef4444' },
  { label: 'Water Level', value: 3, color: '#f97316' },
  { label: 'Air Quality', value: 2, color: '#facc15' },
  { label: 'Water Leak', value: 1, color: '#8b5cf6' },
  { label: 'Gas', value: 1, color: '#3b82f6' },
  { label: 'Others', value: 1, color: '#9ca3af' },
];

export const HEALTH_SCORE = { value: 92.4, change: 3.2, label: 'Good' };

export const HEALTH_METRICS: HealthMetric[] = [
  { label: 'Temperature', value: 96, icon: 'thermometer', tone: 'red' },
  { label: 'Humidity', value: 94, icon: 'droplet', tone: 'blue' },
  { label: 'Air Quality', value: 89, icon: 'wind', tone: 'purple' },
  { label: 'Water Quality', value: 90, icon: 'water', tone: 'blue' },
  { label: 'Energy', value: 93, icon: 'bolt', tone: 'orange' },
  { label: 'Space Occupancy', value: 95, icon: 'people', tone: 'purple' },
];

export const DEVICE_STATUS = { online: 2856, offline: 264 };

export const SENSOR_READINGS: SensorReading[] = [
  { label: 'Temperature', value: '22.6', unit: '°C', icon: 'thermometer', tone: 'red', color: '#16a34a', history: [21.8, 22.1, 21.9, 22.4, 22.2, 22.8, 22.3, 22.9, 22.5, 22.7, 22.4, 22.6] },
  { label: 'Humidity', value: '56.8', unit: '%RH', icon: 'droplet', tone: 'blue', color: '#2563eb', history: [54, 55.2, 54.6, 56.1, 55.4, 57.2, 56, 57.8, 56.4, 57.1, 56.2, 56.8] },
  { label: 'CO₂', value: '742', unit: 'ppm', icon: 'cloud', tone: 'green', color: '#ef4444', history: [690, 705, 698, 725, 710, 748, 720, 760, 735, 750, 730, 742] },
  { label: 'Water Level', value: '1.8', unit: 'm', icon: 'water', tone: 'blue', color: '#0ea5e9', history: [1.6, 1.65, 1.7, 1.68, 1.72, 1.75, 1.74, 1.78, 1.76, 1.8, 1.79, 1.8] },
  { label: 'Energy', value: '128', unit: 'kW', icon: 'bolt', tone: 'orange', color: '#f59e0b', history: [110, 118, 115, 124, 120, 132, 126, 135, 129, 131, 125, 128] },
];

const HOURS = 25;
const wave = (base: number, amp: number, phase: number, noise: number[]) =>
  Array.from({ length: HOURS }, (_, i) => +(base + amp * Math.sin((i / 24) * Math.PI * 2 + phase) + noise[i % noise.length]).toFixed(1));

export const TREND_SERIES: TrendSeries[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#ef4444', min: 0, max: 40, data: wave(23, 3, -1.2, [0, 0.6, -0.4, 0.8, -0.2, 0.5, -0.6]) },
  { key: 'humidity', label: 'Humidity', unit: '%RH', color: '#2563eb', min: 0, max: 100, data: wave(50, 6, 1.6, [0, 1.5, -1, 2, -0.5, 1, -1.5]) },
  { key: 'co2', label: 'CO₂', unit: 'ppm', color: '#16a34a', min: 300, max: 1000, data: wave(700, 80, -0.6, [0, 15, -10, 20, -5, 10, -15]) },
  { key: 'water-level', label: 'Water Level', unit: 'm', color: '#0ea5e9', min: 0, max: 3, data: wave(1.7, 0.2, 0.4, [0, 0.05, -0.03, 0.04, -0.02]) },
  { key: 'energy', label: 'Energy', unit: 'kW', color: '#f59e0b', min: 0, max: 200, data: wave(120, 30, -1.8, [0, 5, -4, 6, -3, 4]) },
];

export const SITE_ALARMS: SiteAlarms[] = [
  { name: 'Dubai Mall', critical: 2, warning: 2, minor: 1 },
  { name: 'City Center (Deira)', critical: 1, warning: 2, minor: 1 },
  { name: 'Abu Dhabi HQ', critical: 1, warning: 1, minor: 1 },
  { name: 'Warehouse (JAFZA)', critical: 1, warning: 1, minor: 0 },
  { name: 'Retail Outlet - Marina', critical: 0, warning: 1, minor: 1 },
  { name: 'Sharjah Office', critical: 0, warning: 1, minor: 0 },
  { name: 'Jebel Ali Plant', critical: 0, warning: 0, minor: 1 },
];

export const RECENT_ALARMS: RecentAlarm[] = [
  { title: 'High Temperature Detected', location: 'Cold Room 01 - Dubai Mall', time: '10:24', severity: 'critical', icon: 'thermometer', tone: 'red' },
  { title: 'Water Leak Detected', location: 'Server Room - Abu Dhabi HQ', time: '10:18', severity: 'major', icon: 'droplet', tone: 'blue' },
  { title: 'High CO₂ Level', location: 'Meeting Room 2 - DCS Office', time: '10:15', severity: 'major', icon: 'cloud', tone: 'yellow' },
  { title: 'Water Level Rising', location: 'Manhole 24 - Al Ain', time: '10:10', severity: 'warning', icon: 'water', tone: 'purple' },
  { title: 'Door Open', location: 'Cold Room 03 - Warehouse', time: '09:58', severity: 'minor', icon: 'door', tone: 'orange' },
];

export const SPACE_USAGE: SpaceUsage[] = [
  { label: 'Office Spaces', value: 68, caption: 'Occupied', icon: 'office', tone: 'purple' },
  { label: 'Meeting Rooms', value: 42, caption: 'Occupied', icon: 'meeting', tone: 'blue' },
  { label: 'Restrooms', value: 55, caption: 'In Use', icon: 'restroom', tone: 'pink' },
  { label: 'Parking Spaces', value: 78, caption: 'Occupied', icon: 'parking', tone: 'green' },
];

export const ENERGY_WEEK: EnergyDay[] = [
  { label: '15 May', value: 310 },
  { label: '16 May', value: 335 },
  { label: '17 May', value: 520 },
  { label: '18 May', value: 350 },
  { label: '19 May', value: 485 },
  { label: '20 May', value: 500 },
  { label: '21 May', value: 545 },
];

export const ENERGY_TOTAL: { value: string; unit: string; change: string; direction: 'up' | 'down' } =
  { value: '3,428', unit: 'kWh', change: '6.2%', direction: 'down' };
