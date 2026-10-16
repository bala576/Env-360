export type WidgetCategory = 'overview' | 'devices' | 'alarms' | 'analytics';
export type WidgetTone = 'green' | 'orange' | 'purple' | 'blue' | 'red' | 'yellow';

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: string;
  tone: WidgetTone;
  category: WidgetCategory;
}

export interface CategoryFilter {
  key: WidgetCategory | 'all';
  label: string;
}

export const MAX_SELECTED_WIDGETS = 12;

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { key: 'all', label: 'All' },
  { key: 'overview', label: 'Overview' },
  { key: 'devices', label: 'Devices' },
  { key: 'alarms', label: 'Alarms' },
  { key: 'analytics', label: 'Analytics' },
];

export const AVAILABLE_WIDGETS: DashboardWidget[] = [
  { id: 'env-overview', title: 'Environment Overview', description: 'Temperature, humidity, air quality trends', icon: 'leaf', tone: 'green', category: 'overview' },
  { id: 'device-status', title: 'Device Status', description: 'Online, offline, alarms', icon: 'status', tone: 'orange', category: 'devices' },
  { id: 'humidity-trends', title: 'Humidity Trends', description: 'Humidity trend and statistics', icon: 'humidity', tone: 'purple', category: 'analytics' },
  { id: 'temperature-trends', title: 'Temperature Trends', description: 'Temperature trend and statistics', icon: 'thermometer', tone: 'purple', category: 'analytics' },
  { id: 'water-quality', title: 'Water Quality', description: 'Water quality parameters', icon: 'droplet', tone: 'blue', category: 'overview' },
  { id: 'alarms-by-category', title: 'Alarms by Category', description: 'Alarm count by category', icon: 'alert', tone: 'red', category: 'alarms' },
  { id: 'top-locations', title: 'Top Locations by Alarms', description: 'Locations with highest alarms', icon: 'pins', tone: 'red', category: 'alarms' },
  { id: 'recent-alarms', title: 'Recent Alarms', description: 'Latest alarm events', icon: 'alert', tone: 'red', category: 'alarms' },
  { id: 'device-type-distribution', title: 'Device Type Distribution', description: 'Devices by type', icon: 'grid', tone: 'blue', category: 'devices' },
  { id: 'environmental-map', title: 'Environmental Map', description: 'Interactive map with device status', icon: 'map', tone: 'blue', category: 'devices' },
  { id: 'energy-consumption', title: 'Energy Consumption', description: 'Energy usage and trends', icon: 'pin', tone: 'yellow', category: 'overview' },
  { id: 'custom-kpi', title: 'Custom KPI', description: 'Create a custom KPI widget', icon: 'kpi', tone: 'purple', category: 'analytics' },
  { id: 'sensor-readings', title: 'Sensor Readings', description: 'Live sensor parameter values', icon: 'device', tone: 'blue', category: 'devices' },
  { id: 'alarm-trends', title: 'Alarm Trends', description: 'Alarm volume over time', icon: 'bell', tone: 'red', category: 'alarms' },
  { id: 'air-quality', title: 'Air Quality Index', description: 'AQI, PM2.5, PM10 and CO2 levels', icon: 'wind', tone: 'green', category: 'overview' },
  { id: 'site-summary', title: 'Site Summary', description: 'Sites by health status', icon: 'building', tone: 'purple', category: 'overview' },
  { id: 'health-score', title: 'Health Score', description: 'Overall environment health score', icon: 'shield', tone: 'green', category: 'overview' },
  { id: 'compliance-report', title: 'Compliance Summary', description: 'Parameters within compliance limits', icon: 'chart', tone: 'purple', category: 'analytics' },
];

export const DEFAULT_SELECTED_IDS: string[] = [
  'env-overview',
  'device-status',
  'alarms-by-category',
  'top-locations',
  'environmental-map',
  'recent-alarms',
];

export interface LayoutTemplate {
  key: string;
  label: string;
  description: string;
  columns: number;
  // CSS grid-template-columns for the canvas; omitted means equal columns
  template?: string;
  // Thumbnail cells as [column, row, colSpan, rowSpan] on a 3x2 grid
  thumb: [number, number, number, number][];
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  { key: 'one', label: '1 Column', description: 'Full width widgets', columns: 1, thumb: [[1, 1, 3, 2]] },
  { key: 'two', label: '2 Columns', description: 'Side by side widgets', columns: 2, thumb: [[1, 1, 1, 1], [2, 1, 2, 1], [1, 2, 1, 1], [2, 2, 2, 1]] },
  { key: 'three', label: '3 Columns', description: 'Multi-column layout', columns: 3, thumb: [[1, 1, 1, 2], [2, 1, 1, 2], [3, 1, 1, 2]] },
  { key: 'left-sidebar', label: 'Left Sidebar', description: 'Main content with side panel', columns: 2, template: '1fr 2fr', thumb: [[1, 1, 1, 2], [2, 1, 2, 1], [2, 2, 2, 1]] },
  { key: 'right-sidebar', label: 'Right Sidebar', description: 'Main content with side panel', columns: 2, template: '2fr 1fr', thumb: [[1, 1, 2, 1], [1, 2, 2, 1], [3, 1, 1, 2]] },
  { key: 'custom', label: 'Custom Layout', description: 'Start with an empty layout', columns: 2, thumb: [[1, 1, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1], [1, 2, 2, 1], [3, 2, 1, 1]] },
];

export const COLUMN_OPTIONS = [1, 2, 3, 4];

export const REFRESH_OPTIONS = [
  { value: 30, label: '30 Seconds' },
  { value: 60, label: '1 Minute' },
  { value: 300, label: '5 Minutes' },
  { value: 600, label: '10 Minutes' },
  { value: 900, label: '15 Minutes' },
  { value: 1800, label: '30 Minutes' },
];

export const CUSTOMIZE_ICONS: Record<string, string[]> = {
  close: ['M6 6l12 12', 'M18 6L6 18'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M20 20l-4-4'],
  plus: ['M12 5v14', 'M5 12h14'],
  drag: ['M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01'],
  trash: ['M4 7h16', 'M10 11v6M14 11v6', 'M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13', 'M9 7V4h6v3'],
  leaf: ['M5 19c0-8 5-14 15-15-1 10-7 15-15 15z', 'M5 19l7-7'],
  status: ['M12 3a9 9 0 019 9', 'M21 12a9 9 0 01-9 9', 'M12 21a9 9 0 01-9-9', 'M3 12a9 9 0 019-9', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  humidity: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z', 'M9.5 15.5l5-5', 'M10 11h.01M14 15h.01'],
  thermometer: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  droplet: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  alert: ['M12 3L2 20h20z', 'M12 10v4', 'M12 17h.01'],
  pins: ['M8 3a4 4 0 014 4c0 3-4 7-4 7S4 10 4 7a4 4 0 014-4z', 'M16 9a4 4 0 014 4c0 3-4 7-4 7s-4-4-4-7a4 4 0 014-4z'],
  grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  map: ['M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z', 'M12 6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z'],
  pin: ['M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z', 'M13 6l-3 4h3l-1 3'],
  kpi: ['M4 4h16v16H4z', 'M8 16l3-4 3 2 3-5'],
  device: ['M6 3h12a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z', 'M9 21h6M12 17v4', 'M9 8h6M9 12h4'],
  bell: ['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 01-3.4 0'],
  wind: ['M3 8h11a3 3 0 10-3-3', 'M3 12h16a3 3 0 11-3 3', 'M3 16h7'],
  building: ['M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16', 'M14 9h5a1 1 0 011 1v11', 'M3 21h18', 'M7 8h2M7 12h2M7 16h2'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  chart: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M3 20h18'],
  more: ['M12 5h.01', 'M12 12h.01', 'M12 19h.01'],
  gridDots: ['M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01'],
  reset: ['M4 12a8 8 0 108-8 8.5 8.5 0 00-6 2.5L4 8', 'M4 4v4h4'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  expand: ['M4 9V4h5', 'M20 9V4h-5', 'M4 15v5h5', 'M20 15v5h-5'],
  minus: ['M5 12h14'],
  chevronDown: ['M6 9l6 6 6-6'],
  gear: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z'],
  sliders: ['M4 6h10M18 6h2', 'M4 12h4M12 12h8', 'M4 18h12M20 18h0', 'M16 4v4M10 10v4M18 16v4'],
  refresh: ['M20 12a8 8 0 01-14.3 4.9', 'M4 12a8 8 0 0114.3-4.9', 'M18 3v4.5h-4.5', 'M6 21v-4.5h4.5'],
  palette: ['M4 5h16l-6 7v6l-4 2v-8z'],
  share: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M17 8v6M14 11h6'],
  sun: ['M12 8a4 4 0 100 8 4 4 0 000-8z', 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'],
  moon: ['M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z'],
  monitor: ['M3 4h18v12H3z', 'M8 20h8M12 16v4'],
  calendar: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3v4M16 3v4'],
  file: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 12h6M9 16h6'],
  wifi: ['M2 9a15 15 0 0120 0', 'M5 12.5a10 10 0 0114 0', 'M8.5 16a5 5 0 017 0', 'M12 19.5h.01'],
  copy: ['M9 9h11v11H9z', 'M5 15H4V4h11v1'],
  info: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 11v5', 'M12 8h.01'],
  funnel: ['M4 5h16l-6 7v6l-4 2v-8z'],
  save: ['M5 4h11l3 3v13H5z', 'M8 4v5h7V4', 'M8 20v-6h8v6'],
  external: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v6H4V6h6'],
  checkCircle: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M8 12.5l3 3 5-6'],
  history: ['M4 12a8 8 0 108-8 8.5 8.5 0 00-6 2.5L4 8', 'M4 4v4h4', 'M12 8v4l3 2'],
  calendarClock: ['M4 6h16v6', 'M4 6v14h7', 'M4 10h16', 'M8 3v4M16 3v4', 'M17 13a4 4 0 100 8 4 4 0 000-8z', 'M17 15.5V17l1 1'],
  broadcast: ['M12 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3z', 'M12 14v7', 'M8.5 9.5a5 5 0 000 6', 'M15.5 9.5a5 5 0 010 6', 'M5.6 7a9 9 0 000 11', 'M18.4 7a9 9 0 010 11'],
  alertCircle: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7.5v5.5', 'M12 16.5h.01'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  list: ['M8 6h12M8 12h12M8 18h12', 'M4 6h.01M4 12h.01M4 18h.01'],
  square: ['M5 5h14v14H5z'],
  rounded: ['M9 5h6a4 4 0 014 4v6a4 4 0 01-4 4H9a4 4 0 01-4-4V9a4 4 0 014-4z'],
  extraRounded: ['M12 5h0a7 7 0 017 7v0a7 7 0 01-7 7h0a7 7 0 01-7-7v0a7 7 0 017-7z'],
  rows: ['M5 5h14v6H5z', 'M5 13h14v6H5z'],
  target: ['M12 4a8 8 0 100 16 8 8 0 000-16z', 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z', 'M12 2v3M12 19v3M2 12h3M19 12h3'],
  cloudSun: ['M8 3v1.5M3.5 8H2M4.5 4.5l1 1M12.5 4.5l-1 1', 'M10.5 9.5a3 3 0 00-5.4 1.8', 'M7 20h10a3.5 3.5 0 00.4-7 5 5 0 00-9.6 1.2A3 3 0 007 20z'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  message: ['M4 5h16v11H9l-5 4z', 'M8 10h.01M12 10h.01M16 10h.01'],
  phone: ['M8 2h8a1 1 0 011 1v18a1 1 0 01-1 1H8a1 1 0 01-1-1V3a1 1 0 011-1z', 'M11 18h2'],
  webhook: ['M10 7a3 3 0 115 2.2L12 15', 'M7.5 12.5a3 3 0 102.5 4.5h6', 'M17 13a3 3 0 11-1.5 5.6'],
  users: ['M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M2.5 20a6.5 6.5 0 0113 0', 'M16 4.5a3.5 3.5 0 010 6.5', 'M18 14a6 6 0 013.5 6'],
  lock: ['M6 11h12v10H6z', 'M8.5 11V8a3.5 3.5 0 017 0v3', 'M12 15v2'],
  globe: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M3 12h18', 'M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z'],
  link: ['M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1', 'M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1'],
  download: ['M12 4v11', 'M7.5 10.5L12 15l4.5-4.5', 'M4 17v3h16v-3'],
  upload: ['M12 15V4', 'M7.5 8.5L12 4l4.5 4.5', 'M4 17v3h16v-3'],
  pencil: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
};

// ---------- Widget previews shown on the layout canvas ----------
export interface PreviewItem {
  label: string;
  value: number;
  color: string;
  caption?: string;
}

export interface PreviewRow {
  time: string;
  location: string;
  parameter: string;
  value: string;
  status: 'High' | 'Medium' | 'Low';
}

export interface PreviewPin {
  x: number;
  y: number;
  color: string;
}

export type WidgetPreview =
  | { kind: 'line'; min: number; max: number; series: { label: string; color: string; data: number[] }[] }
  | { kind: 'donut'; total: string; caption: string; items: PreviewItem[] }
  | { kind: 'bars'; items: PreviewItem[] }
  | { kind: 'hbars'; items: PreviewItem[] }
  | { kind: 'table'; rows: PreviewRow[] }
  | { kind: 'map'; pins: PreviewPin[] }
  | { kind: 'kpi'; value: string; unit: string; caption: string; change: string; good: boolean }
  | { kind: 'list'; items: PreviewItem[] };

export interface WidgetFilter {
  options: string[];
  value: string;
}

export const TIME_RANGES = ['Last 1 Hour', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];

export const WIDGET_FILTERS: Record<string, WidgetFilter> = {
  'env-overview': { options: TIME_RANGES, value: 'Last 24 Hours' },
  'humidity-trends': { options: TIME_RANGES, value: 'Last 24 Hours' },
  'temperature-trends': { options: TIME_RANGES, value: 'Last 24 Hours' },
  'alarms-by-category': { options: TIME_RANGES, value: 'Last 7 Days' },
  'top-locations': { options: TIME_RANGES, value: 'Last 7 Days' },
  'alarm-trends': { options: TIME_RANGES, value: 'Last 7 Days' },
  'energy-consumption': { options: TIME_RANGES, value: 'Last 7 Days' },
  'environmental-map': { options: ['Ground Floor', 'First Floor', 'Second Floor'], value: 'Ground Floor' },
};

const wave = (base: number, amp: number, phase: number) =>
  Array.from({ length: 24 }, (_, i) => +(base + amp * Math.sin(i / 2.2 + phase) + amp * 0.4 * Math.sin(i * 1.3)).toFixed(1));

export const WIDGET_PREVIEWS: Record<string, WidgetPreview> = {
  'env-overview': {
    kind: 'line',
    min: 0,
    max: 30,
    series: [
      { label: 'Temperature', color: '#2563eb', data: wave(24, 2.5, 0) },
      { label: 'Humidity', color: '#7c3aed', data: wave(19, 2, 1.4) },
      { label: 'Air Quality', color: '#16a34a', data: wave(12, 1.8, 2.6) },
    ],
  },
  'humidity-trends': { kind: 'line', min: 0, max: 100, series: [{ label: 'Humidity %RH', color: '#7c3aed', data: wave(56, 8, 0.6) }] },
  'temperature-trends': { kind: 'line', min: 0, max: 40, series: [{ label: 'Temperature °C', color: '#ef4444', data: wave(23, 4, -1) }] },
  'alarm-trends': { kind: 'line', min: 0, max: 30, series: [{ label: 'Alarms', color: '#dc2626', data: wave(14, 6, 2) }] },
  'device-status': {
    kind: 'donut',
    total: '3,120',
    caption: 'Devices',
    items: [
      { label: 'Online', value: 2687, color: '#16a34a', caption: '2,687 (86%)' },
      { label: 'Offline', value: 233, color: '#ef4444', caption: '233 (7%)' },
      { label: 'With Alarms', value: 47, color: '#f59e0b', caption: '47 (2%)' },
      { label: 'Maintenance', value: 153, color: '#9ca3af', caption: '153 (5%)' },
    ],
  },
  'alarms-by-category': {
    kind: 'bars',
    items: [
      { label: 'Temperature', value: 18, color: '#3b82f6' },
      { label: 'Humidity', value: 12, color: '#7c3aed' },
      { label: 'Air Quality', value: 8, color: '#f59e0b' },
      { label: 'Water Level', value: 6, color: '#facc15' },
      { label: 'Leak Detection', value: 3, color: '#38bdf8' },
    ],
  },
  'device-type-distribution': {
    kind: 'bars',
    items: [
      { label: 'Temp', value: 820, color: '#3b82f6' },
      { label: 'Humidity', value: 640, color: '#7c3aed' },
      { label: 'Air', value: 510, color: '#16a34a' },
      { label: 'Water', value: 380, color: '#0ea5e9' },
      { label: 'Energy', value: 290, color: '#f59e0b' },
    ],
  },
  'energy-consumption': {
    kind: 'bars',
    items: [
      { label: 'Mon', value: 420, color: '#f59e0b' },
      { label: 'Tue', value: 480, color: '#f59e0b' },
      { label: 'Wed', value: 450, color: '#f59e0b' },
      { label: 'Thu', value: 530, color: '#f59e0b' },
      { label: 'Fri', value: 500, color: '#f59e0b' },
      { label: 'Sat', value: 360, color: '#f59e0b' },
      { label: 'Sun', value: 310, color: '#f59e0b' },
    ],
  },
  'top-locations': {
    kind: 'hbars',
    items: [
      { label: 'Data Centre - DC1', value: 12, color: '#ef4444' },
      { label: 'Warehouse - WH1', value: 8, color: '#f97316' },
      { label: 'Food Court', value: 6, color: '#fb923c' },
      { label: 'Parking Basement', value: 5, color: '#facc15' },
      { label: 'Office Tower 1', value: 4, color: '#facc15' },
    ],
  },
  'compliance-report': {
    kind: 'hbars',
    items: [
      { label: 'Air Quality', value: 96, color: '#16a34a' },
      { label: 'Water Quality', value: 91, color: '#16a34a' },
      { label: 'Noise', value: 84, color: '#f59e0b' },
      { label: 'Emissions', value: 78, color: '#f59e0b' },
    ],
  },
  'recent-alarms': {
    kind: 'table',
    rows: [
      { time: '21 May 2025 14:32', location: 'Cold Store 1', parameter: 'Temperature', value: '12.8 °C', status: 'High' },
      { time: '21 May 2025 13:18', location: 'Data Centre - DC1', parameter: 'Humidity', value: '75 %', status: 'High' },
      { time: '21 May 2025 11:05', location: 'Water Tank A', parameter: 'Water Level', value: '15 %', status: 'Low' },
      { time: '21 May 2025 09:47', location: 'Warehouse - WH1', parameter: 'Temperature', value: '34.2 °C', status: 'High' },
      { time: '21 May 2025 08:21', location: 'Office - L3', parameter: 'Air Quality (AQI)', value: '168', status: 'High' },
    ],
  },
  'environmental-map': {
    kind: 'map',
    pins: [
      { x: 18, y: 28, color: '#f59e0b' },
      { x: 30, y: 58, color: '#16a34a' },
      { x: 42, y: 62, color: '#16a34a' },
      { x: 56, y: 62, color: '#ef4444' },
      { x: 66, y: 26, color: '#f59e0b' },
      { x: 70, y: 70, color: '#ef4444' },
      { x: 86, y: 50, color: '#16a34a' },
    ],
  },
  'water-quality': {
    kind: 'list',
    items: [
      { label: 'pH', value: 7.2, color: '#16a34a', caption: '7.2' },
      { label: 'Turbidity', value: 1.4, color: '#16a34a', caption: '1.4 NTU' },
      { label: 'Dissolved O₂', value: 6.8, color: '#f59e0b', caption: '6.8 mg/L' },
      { label: 'Conductivity', value: 512, color: '#16a34a', caption: '512 µS/cm' },
    ],
  },
  'air-quality': {
    kind: 'list',
    items: [
      { label: 'AQI', value: 68, color: '#f59e0b', caption: '68' },
      { label: 'PM2.5', value: 18, color: '#16a34a', caption: '18 µg/m³' },
      { label: 'PM10', value: 42, color: '#16a34a', caption: '42 µg/m³' },
      { label: 'CO₂', value: 742, color: '#f59e0b', caption: '742 ppm' },
    ],
  },
  'sensor-readings': {
    kind: 'list',
    items: [
      { label: 'Temperature', value: 22.6, color: '#ef4444', caption: '22.6 °C' },
      { label: 'Humidity', value: 56.8, color: '#2563eb', caption: '56.8 %RH' },
      { label: 'Water Level', value: 1.8, color: '#0ea5e9', caption: '1.8 m' },
      { label: 'Energy', value: 128, color: '#f59e0b', caption: '128 kW' },
    ],
  },
  'site-summary': {
    kind: 'list',
    items: [
      { label: 'Normal', value: 42, color: '#16a34a', caption: '42 sites' },
      { label: 'Warning', value: 6, color: '#f59e0b', caption: '6 sites' },
      { label: 'Critical', value: 3, color: '#ef4444', caption: '3 sites' },
      { label: 'Offline', value: 1, color: '#6b7280', caption: '1 site' },
    ],
  },
  'custom-kpi': { kind: 'kpi', value: '98.6', unit: '%', caption: 'Uptime this month', change: '▲ 1.2%', good: true },
  'health-score': { kind: 'kpi', value: '92.4', unit: '/100', caption: 'Environment health', change: '▲ 3.2', good: true },
};

// ---------- Settings tab ----------
export interface FilterSetting {
  enabled: boolean;
  value: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  icon: string;
  hint: string;
  options: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type DashboardStyle = 'default' | 'minimal' | 'compact' | 'modern' | 'glass';
export type WidgetDensity = 'compact' | 'comfortable' | 'spacious';
export type WidgetCorners = 'square' | 'rounded' | 'extra';
export type FontScale = 'small' | 'medium' | 'large';
export type ChartStyle = 'solid' | 'gradient' | 'outline';
export interface AlertRule {
  parameter: string;
  condition: string;
  threshold: string;
  severity: string;
}

export interface AlertRecipient {
  name: string;
  role: string;
  contact: string;
  types: string;
}

export type AccessLevel = 'private' | 'view' | 'edit' | 'public';
export type MemberAccess = 'Owner' | 'Edit' | 'View';

export interface ShareMember {
  name: string;
  detail: string;
  type: 'User' | 'Group';
  count: number;
  guest: boolean;
  access: MemberAccess;
  view: boolean;
  edit: boolean;
  share: boolean;
  expiry: string;
}

export type RefreshScope = 'all' | 'realtime' | 'custom';
export type UpdateMethod = 'websocket' | 'polling' | 'hybrid';

export interface RefreshSchedule {
  name: string;
  enabled: boolean;
  days: string[];
  time: string;
  timeZone: string;
}

export type SettingsSection = 'general' | 'data' | 'refresh' | 'appearance' | 'alerts' | 'sharing' | 'manage';

export interface DashboardPreferences {
  name: string;
  description: string;
  defaultTimeRange: string;
  defaultSite: string;
  themeMode: ThemeMode;
  primaryColor: string;
  dataDisplay: string;
  numberFormat: string;
  temperatureUnit: string;
  dateFormat: string;
  customFrom: string;
  customTo: string;
  filters: Record<string, FilterSetting>;
  pauseWhenHidden: boolean;
  showLastUpdated: boolean;
  dashboardStyle: DashboardStyle;
  density: WidgetDensity;
  corners: WidgetCorners;
  showBreadcrumb: boolean;
  fontScale: FontScale;
  chartStyle: ChartStyle;
  showDataLabels: boolean;
  smoothLines: boolean;
  alertsEnabled: boolean;
  alertIndicator: boolean;
  alertSources: Record<string, boolean>;
  severities: Record<string, boolean>;
  alertRules: AlertRule[];
  channels: Record<string, boolean>;
  recipients: AlertRecipient[];
  alertBanner: boolean;
  autoOpenPanel: boolean;
  autoRefresh: boolean;
  refreshScope: RefreshScope;
  scheduledRefresh: boolean;
  schedules: RefreshSchedule[];
  realtimeUpdates: boolean;
  updateMethod: UpdateMethod;
  retryOnFailure: boolean;
  retryInterval: string;
  maxRetries: string;
  notifyOnFailure: boolean;
  failureBanner: boolean;
  alarmBadges: boolean;
  highlightAlarmWidgets: boolean;
  criticalSound: boolean;
  sharingEnabled: boolean;
  accessLevel: AccessLevel;
  members: ShareMember[];
  shareLink: boolean;
  linkScope: string;
}

export const DEFAULT_PREFERENCES: DashboardPreferences = {
  name: 'Environment Overview',
  description: 'Real-time overview of environmental assets and facilities.',
  defaultTimeRange: 'Last 30 Days',
  defaultSite: 'Dubai Mall',
  themeMode: 'light',
  primaryColor: '#4c1d95',
  dataDisplay: 'Show value and chart',
  numberFormat: 'Automatic (e.g. 1,234)',
  temperatureUnit: 'Celsius (°C)',
  dateFormat: '21 May 2025 14:32',
  customFrom: '',
  customTo: '',
  filters: {
    category: { enabled: true, value: 'All Categories' },
    deviceType: { enabled: true, value: 'All Device Types' },
    status: { enabled: false, value: 'All Status' },
    severity: { enabled: true, value: 'All Severities' },
    assetGroup: { enabled: false, value: 'All Asset Groups' },
  },
  pauseWhenHidden: true,
  showLastUpdated: true,
  dashboardStyle: 'default',
  density: 'comfortable',
  corners: 'rounded',
  showBreadcrumb: true,
  fontScale: 'medium',
  chartStyle: 'solid',
  showDataLabels: true,
  smoothLines: false,
  alertsEnabled: true,
  alertIndicator: true,
  alertSources: { environment: true, devices: true, locations: true, system: true, external: false },
  severities: { critical: true, high: true, medium: true, low: false },
  alertRules: [
    { parameter: 'Temperature', condition: 'Greater than', threshold: '30 °C', severity: 'Critical' },
    { parameter: 'Humidity', condition: 'Greater than', threshold: '80 %', severity: 'High' },
    { parameter: 'Air Quality (AQI)', condition: 'Greater than', threshold: '150', severity: 'Medium' },
    { parameter: 'Water Level', condition: 'Less than', threshold: '10 %', severity: 'Critical' },
  ],
  channels: { inApp: true, email: true, sms: false, push: true, webhook: false },
  recipients: [
    { name: 'Rex Kumar', role: 'Dashboard Owner', contact: 'rex@dcsme.com', types: 'All Alerts' },
    { name: 'Facility Team', role: 'Site Manager', contact: 'facilities@dcsme.com', types: 'Critical, High' },
    { name: 'IT Support', role: 'Support Team', contact: 'support@dcsme.com', types: 'System Events' },
  ],
  alertBanner: true,
  autoOpenPanel: true,
  autoRefresh: true,
  refreshScope: 'all',
  scheduledRefresh: true,
  schedules: [
    { name: 'Morning Refresh', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], time: '08:00', timeZone: '(GMT+04:00) Abu Dhabi, Muscat' },
    { name: 'End of Day Refresh', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], time: '18:00', timeZone: '(GMT+04:00) Abu Dhabi, Muscat' },
  ],
  realtimeUpdates: true,
  updateMethod: 'websocket',
  retryOnFailure: true,
  retryInterval: '1 Minute',
  maxRetries: '3 Attempts',
  notifyOnFailure: true,
  failureBanner: true,
  alarmBadges: true,
  highlightAlarmWidgets: true,
  criticalSound: false,
  sharingEnabled: true,
  accessLevel: 'view',
  members: [
    { name: 'Rex Kumar', detail: 'rex@dcsme.com', type: 'User', count: 1, guest: false, access: 'Owner', view: true, edit: true, share: true, expiry: '' },
    { name: 'Operations Team', detail: '20 members', type: 'Group', count: 20, guest: false, access: 'Edit', view: true, edit: true, share: true, expiry: '' },
    { name: 'Facility Manager', detail: 'fm@dcsme.com', type: 'User', count: 1, guest: false, access: 'Edit', view: true, edit: true, share: false, expiry: '2025-06-30' },
    { name: 'Maintenance Team', detail: '8 members', type: 'Group', count: 8, guest: false, access: 'View', view: true, edit: false, share: false, expiry: '2025-12-31' },
    { name: 'Guest User', detail: 'guest@domain.com', type: 'User', count: 1, guest: true, access: 'View', view: true, edit: false, share: false, expiry: '2025-05-28' },
  ],
  shareLink: true,
  linkScope: 'Anyone with the link can view this dashboard',
};

export const SETTINGS_SECTIONS: { key: SettingsSection; label: string; description: string; icon: string }[] = [
  { key: 'general', label: 'General', description: 'Dashboard name, theme and view', icon: 'gear' },
  { key: 'data', label: 'Data & Filters', description: 'Default filters and data range', icon: 'sliders' },
  { key: 'refresh', label: 'Refresh & Auto Update', description: 'Real-time and scheduled refresh', icon: 'refresh' },
  { key: 'appearance', label: 'Appearance', description: 'Colors, density and visual options', icon: 'palette' },
  { key: 'alerts', label: 'Alerts & Notifications', description: 'Widget alert settings', icon: 'bell' },
  { key: 'sharing', label: 'Sharing & Access', description: 'Who can view and edit', icon: 'share' },
  { key: 'manage', label: 'Reset & Manage', description: 'Reset, duplicate or delete', icon: 'reset' },
];

export const THEME_MODES: { key: ThemeMode; label: string; icon: string }[] = [
  { key: 'light', label: 'Light', icon: 'sun' },
  { key: 'dark', label: 'Dark', icon: 'moon' },
  { key: 'system', label: 'System', icon: 'monitor' },
];

export const PRIMARY_COLORS = ['#4c1d95', '#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#d946ef'];
export const SITE_OPTIONS = ['All Sites', 'Dubai Mall', 'Abu Dhabi HQ', 'City Center (Deira)', 'Warehouse (JAFZA)'];
export const DATA_DISPLAY_OPTIONS = ['Show value and chart', 'Value only', 'Chart only'];
export const NUMBER_FORMATS = ['Automatic (e.g. 1,234)', 'Compact (e.g. 1.2K)', 'Raw (e.g. 1234)'];
export const TEMPERATURE_UNITS = ['Celsius (°C)', 'Fahrenheit (°F)'];
export const DATE_FORMATS = ['21 May 2025 14:32', '05/21/2025 2:32 PM', '2025-05-21 14:32'];
export const DEFAULT_DATE_RANGES = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Range'];
export const DATE_RANGE_CHIPS = [
  { label: '7 Days', value: 'Last 7 Days' },
  { label: '30 Days', value: 'Last 30 Days' },
  { label: '90 Days', value: 'Last 90 Days' },
  { label: 'Custom', value: 'Custom Range' },
];

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  { key: 'category', label: 'Category', icon: 'grid', hint: 'Limit widgets to one monitoring category', options: ['All Categories', 'Temperature', 'Humidity', 'Air Quality', 'Water Quality', 'Energy'] },
  { key: 'deviceType', label: 'Device Type', icon: 'device', hint: 'Show data only from this device type', options: ['All Device Types', 'Sensor', 'Gateway', 'Meter', 'Controller'] },
  { key: 'status', label: 'Status', icon: 'status', hint: 'Filter devices by connection status', options: ['All Status', 'Online', 'Offline', 'Maintenance'] },
  { key: 'severity', label: 'Alarm Severity', icon: 'alert', hint: 'Minimum alarm severity shown in alarm widgets', options: ['All Severities', 'Critical', 'Major', 'Warning', 'Minor'] },
  { key: 'assetGroup', label: 'Asset Group', icon: 'building', hint: 'Restrict widgets to an asset group', options: ['All Asset Groups', 'Cold Storage', 'Data Centres', 'Offices', 'Warehouses'] },
];

export const PREVIEW_KPIS = [
  { label: 'Sites', value: '42', change: '5%', good: true, icon: 'leaf', tone: 'green' },
  { label: 'Devices', value: '3,120', change: '8%', good: true, icon: 'file', tone: 'purple' },
  { label: 'Online', value: '2,687', change: '10%', good: true, icon: 'wifi', tone: 'green' },
  { label: 'Active Alarms', value: '47', change: '20%', good: false, icon: 'alert', tone: 'red' },
];

// ---------- Refresh & Auto Update ----------
export const REFRESH_SCOPES: { value: RefreshScope; label: string }[] = [
  { value: 'all', label: 'All Widgets' },
  { value: 'realtime', label: 'Only Real-time Widgets' },
  { value: 'custom', label: 'Custom Selection' },
];

export const UPDATE_METHODS: { value: UpdateMethod; label: string; description: string }[] = [
  { value: 'websocket', label: 'Live Streaming (WebSocket)', description: 'Instant updates for supported widgets' },
  { value: 'polling', label: 'Polling', description: 'Periodic data fetch at defined interval' },
  { value: 'hybrid', label: 'Hybrid', description: 'Use live for real-time widgets and polling for others' },
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const TIME_ZONES = ['(GMT+04:00) Abu Dhabi, Muscat', '(GMT+03:00) Riyadh, Kuwait', '(GMT+05:30) Mumbai, New Delhi', '(GMT+00:00) London, UTC'];
export const RETRY_INTERVALS = ['30 Seconds', '1 Minute', '5 Minutes', '10 Minutes'];
export const MAX_RETRIES = ['1 Attempt', '3 Attempts', '5 Attempts', '10 Attempts'];

export const PREVIEW_METRICS = ['Temperature', 'Humidity', 'Air Quality', 'Water Quality'];

export interface PreviewSeries {
  label: string;
  color: string;
  values: number[];
}

export const PREVIEW_TREND: Record<string, { unit: string; min: number; max: number; series: PreviewSeries[] }> = {
  Temperature: {
    unit: 'Temperature (°C)', min: 15, max: 35,
    series: [
      { label: 'Warehouse', color: '#2563eb', values: [29, 30, 28, 29, 27, 28, 30, 29, 28, 30, 29, 28, 29, 30, 29, 28, 30, 31, 29, 30, 29, 28] },
      { label: 'Data Centre', color: '#7c3aed', values: [22, 24, 23, 24, 24, 23, 22, 23, 25, 23, 24, 22, 24, 23, 25, 25, 24, 23, 25, 24, 25, 24] },
      { label: 'Office', color: '#16a34a', values: [18, 19, 20, 21, 22, 21, 20, 22, 21, 20, 19, 20, 19, 21, 22, 23, 22, 21, 20, 21, 22, 21] },
    ],
  },
  Humidity: {
    unit: 'Humidity (%)', min: 30, max: 80,
    series: [
      { label: 'Warehouse', color: '#2563eb', values: [62, 64, 63, 66, 65, 67, 68, 66, 65, 64, 66, 68, 69, 67, 66, 65, 64, 66, 67, 68, 66, 65] },
      { label: 'Data Centre', color: '#7c3aed', values: [45, 46, 44, 45, 47, 46, 45, 44, 46, 47, 45, 44, 46, 45, 44, 46, 47, 46, 45, 44, 45, 46] },
      { label: 'Office', color: '#16a34a', values: [52, 54, 55, 53, 52, 51, 53, 55, 56, 54, 53, 52, 54, 56, 55, 53, 52, 54, 55, 54, 53, 52] },
    ],
  },
  'Air Quality': {
    unit: 'AQI', min: 0, max: 200,
    series: [
      { label: 'Warehouse', color: '#2563eb', values: [88, 92, 95, 102, 110, 105, 98, 94, 99, 108, 115, 120, 112, 104, 98, 96, 102, 110, 106, 100, 95, 92] },
      { label: 'Data Centre', color: '#7c3aed', values: [42, 45, 44, 46, 48, 47, 45, 44, 46, 48, 50, 49, 47, 46, 45, 47, 48, 46, 45, 44, 46, 45] },
      { label: 'Office', color: '#16a34a', values: [60, 62, 65, 70, 74, 72, 68, 66, 70, 76, 80, 84, 78, 72, 68, 66, 70, 74, 72, 68, 65, 63] },
    ],
  },
  'Water Quality': {
    unit: 'pH', min: 6, max: 9,
    series: [
      { label: 'Warehouse', color: '#2563eb', values: [7.4, 7.5, 7.4, 7.3, 7.4, 7.5, 7.6, 7.5, 7.4, 7.3, 7.4, 7.5, 7.4, 7.3, 7.4, 7.5, 7.6, 7.5, 7.4, 7.5, 7.4, 7.3] },
      { label: 'Data Centre', color: '#7c3aed', values: [7.0, 7.1, 7.0, 6.9, 7.0, 7.1, 7.0, 6.9, 7.0, 7.1, 7.2, 7.1, 7.0, 6.9, 7.0, 7.1, 7.0, 6.9, 7.0, 7.1, 7.0, 7.0] },
      { label: 'Office', color: '#16a34a', values: [7.8, 7.9, 8.0, 7.9, 7.8, 7.7, 7.8, 7.9, 8.0, 8.1, 8.0, 7.9, 7.8, 7.9, 8.0, 7.9, 7.8, 7.7, 7.8, 7.9, 8.0, 7.9] },
    ],
  },
};

export const PREVIEW_ALARMS = [
  { time: '21 May 14:32', location: 'Cold Store 1', parameter: 'Temperature', value: '12.8 °C', status: 'High' },
  { time: '21 May 13:18', location: 'Data Centre', parameter: 'Humidity', value: '75 %', status: 'High' },
  { time: '21 May 11:05', location: 'Water Tank A', parameter: 'Water Level', value: '15 %', status: 'Low' },
  { time: '21 May 09:47', location: 'Warehouse', parameter: 'Temperature', value: '34.2 °C', status: 'High' },
  { time: '21 May 08:21', location: 'Office - L3', parameter: 'Air Quality', value: '168', status: 'High' },
];

// ---------- Appearance ----------
export const DASHBOARD_STYLES: { value: DashboardStyle; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'compact', label: 'Compact' },
  { value: 'modern', label: 'Modern' },
  { value: 'glass', label: 'Glass' },
];

export const WIDGET_DENSITIES: { value: WidgetDensity; label: string; icon: string }[] = [
  { value: 'compact', label: 'Compact', icon: 'list' },
  { value: 'comfortable', label: 'Comfortable', icon: 'rounded' },
  { value: 'spacious', label: 'Spacious', icon: 'rows' },
];

export const WIDGET_CORNERS: { value: WidgetCorners; label: string; icon: string }[] = [
  { value: 'square', label: 'Square', icon: 'square' },
  { value: 'rounded', label: 'Rounded', icon: 'rounded' },
  { value: 'extra', label: 'Extra Rounded', icon: 'extraRounded' },
];

export const FONT_SCALES: { value: FontScale; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium (Default)' },
  { value: 'large', label: 'Large' },
];

export const CHART_STYLES: { value: ChartStyle; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'outline', label: 'Outline' },
];

export const APPEARANCE_DASHBOARDS = ['Environment Overview', 'Energy Monitoring', 'Facility Operations'];

export const APPEARANCE_KPIS = [
  { label: 'Air Quality', value: 'Good', change: '', good: true, icon: 'leaf', tone: 'green' },
  { label: 'Temperature', value: '24.8 °C', change: '2%', good: false, icon: 'thermometer', tone: 'red' },
  { label: 'Humidity', value: '56 %', change: '4%', good: true, icon: 'droplet', tone: 'blue' },
];

export const APPEARANCE_TREND: PreviewSeries[] = [
  { label: 'Temperature (°C)', color: '#2563eb', values: [62, 64, 80, 92, 76, 52, 66, 72, 62, 84] },
  { label: 'Humidity (%)', color: '#7c3aed', values: [42, 44, 60, 72, 62, 46, 52, 56, 44, 56] },
  { label: 'Air Quality (AQI)', color: '#16a34a', values: [20, 24, 38, 46, 40, 24, 32, 40, 28, 40] },
];

export const APPEARANCE_DEVICE_STATUS = [
  { label: 'Online', count: '2,687', pct: 86, color: '#16a34a' },
  { label: 'Offline', count: '233', pct: 7, color: '#ef4444' },
  { label: 'With Alarms', count: '47', pct: 2, color: '#f59e0b' },
  { label: 'Maintenance', count: '153', pct: 5, color: '#9ca3af' },
];

export const APPEARANCE_ALARM_CATEGORIES = [
  { label: 'Temperature', short: 'Temp.', value: 18, color: '#3b82f6' },
  { label: 'Humidity', short: 'Humid.', value: 12, color: '#7c3aed' },
  { label: 'Air Quality', short: 'AQI', value: 8, color: '#f59e0b' },
  { label: 'Water', short: 'Water', value: 6, color: '#facc15' },
  { label: 'Leak', short: 'Leak', value: 3, color: '#0ea5e9' },
];

// ---------- Alerts & Notifications ----------
export const ALERT_SOURCES = [
  { key: 'environment', label: 'Environment Sensors', icon: 'leaf', tone: 'green' },
  { key: 'devices', label: 'Devices & Equipment', icon: 'device', tone: 'purple' },
  { key: 'locations', label: 'Locations / Sites', icon: 'map', tone: 'purple' },
  { key: 'system', label: 'System Events', icon: 'alert', tone: 'purple' },
  { key: 'external', label: 'External Data (Weather)', icon: 'cloudSun', tone: 'yellow' },
];

export const SEVERITY_LEVELS = [
  { key: 'critical', label: 'Critical', color: '#dc2626', fill: 100 },
  { key: 'high', label: 'High', color: '#f97316', fill: 75 },
  { key: 'medium', label: 'Medium', color: '#eab308', fill: 50 },
  { key: 'low', label: 'Low', color: '#3b82f6', fill: 25 },
];

export const NOTIFICATION_CHANNELS = [
  { key: 'inApp', label: 'In-App', description: 'Show alerts in dashboard.', icon: 'monitor' },
  { key: 'email', label: 'Email', description: 'Send alerts via email.', icon: 'mail' },
  { key: 'sms', label: 'SMS', description: 'Send alerts via SMS.', icon: 'message' },
  { key: 'push', label: 'Mobile Push', description: 'Send push notifications.', icon: 'phone' },
  { key: 'webhook', label: 'Webhook', description: 'Send to external system.', icon: 'webhook' },
];

export const RULE_PARAMETERS = ['Temperature', 'Humidity', 'Air Quality (AQI)', 'Water Level', 'CO₂', 'Energy Usage'];
export const RULE_CONDITIONS = ['Greater than', 'Less than', 'Equal to', 'Outside range'];
export const RECIPIENT_ROLES = ['Dashboard Owner', 'Site Manager', 'Support Team', 'Operator', 'Viewer'];
export const NOTIFICATION_TYPES = ['All Alerts', 'Critical, High', 'Critical only', 'System Events'];

export const PREVIEW_AQI_TREND = [176, 172, 175, 171, 174, 173, 178, 176, 175, 179, 180, 178, 176, 173, 175, 179, 181, 178, 176, 172, 171, 174, 172, 173];

export const PREVIEW_RECENT_ALERTS = [
  { title: 'High Temperature', detail: 'Cold Store 1 - 32.5 °C', time: '2 min ago', severity: 'critical' },
  { title: 'Humidity Above Threshold', detail: 'Warehouse - 82 %', time: '15 min ago', severity: 'high' },
  { title: 'Water Level Low', detail: 'Water Tank A - 8 %', time: '32 min ago', severity: 'critical' },
  { title: 'Air Quality Deteriorated', detail: 'Office - AQI 165', time: '1 hour ago', severity: 'medium' },
  { title: 'Device Offline', detail: 'Environment Sensor #102', time: '2 hours ago', severity: 'low' },
];

// ---------- Sharing & Access ----------
export const ACCESS_LEVELS: { value: AccessLevel; label: string; description: string; icon: string }[] = [
  { value: 'private', label: 'Private', description: 'Only you can access', icon: 'lock' },
  { value: 'view', label: 'Shared View', description: 'Others can view', icon: 'eye' },
  { value: 'edit', label: 'Shared Edit', description: 'Others can view and edit', icon: 'pencil' },
  { value: 'public', label: 'Public', description: 'Available to all users in organization', icon: 'users' },
];

export const MEMBER_ACCESS: MemberAccess[] = ['Owner', 'Edit', 'View'];
export const LINK_SCOPES = ['Anyone with the link can view this dashboard', 'Only people in your organization can open this link', 'Only invited users and groups can open this link'];
export const PREVIEW_ROLES = ['Owner View', 'Editor View', 'Viewer View'];

export const SHARE_TREND = [22, 23, 23.5, 24, 25, 26, 27, 28, 28.5, 29, 30, 30.5, 30, 29, 28.5, 29.5, 31, 31.5, 30, 29];

export const ACCESS_SUMMARY = [
  { key: 'owners', label: 'Owners', color: '#4c1d95' },
  { key: 'editors', label: 'Editors', color: '#2563eb' },
  { key: 'viewers', label: 'Viewers', color: '#16a34a' },
  { key: 'guests', label: 'Guests', color: '#ef4444' },
];

// ---------- Reset & Manage ----------
export interface DashboardVersionMeta {
  version: string;
  date: string;
  by: string;
  description: string;
}

export const SEED_VERSIONS: DashboardVersionMeta[] = [
  { version: 'v3.0', date: '27 May 2025 14:32', by: 'Rex Kumar', description: 'Updated layout and added air quality widget' },
  { version: 'v2.1', date: '25 May 2025 10:18', by: 'Operations Team', description: 'Changed filters and refresh settings' },
  { version: 'v2.0', date: '20 May 2025 16:05', by: 'Rex Kumar', description: 'Added temperature and humidity widgets' },
  { version: 'v1.0', date: '15 May 2025 09:22', by: 'System', description: 'Initial dashboard configuration' },
];

export const EXPORT_FORMATS = [
  { value: 'json', label: 'Export as JSON' },
  { value: 'csv', label: 'Export as CSV' },
];

export const MANAGE_KPIS = [
  { label: 'Temperature', value: '24.8 °C', change: '2%', good: true, icon: 'thermometer', tone: 'red' },
  { label: 'Humidity', value: '56 %', change: '4%', good: false, icon: 'droplet', tone: 'blue' },
  { label: 'Air Quality', value: 'Good', change: '', good: true, icon: 'leaf', tone: 'green' },
  { label: 'Water Level', value: '68 %', change: '1%', good: true, icon: 'humidity', tone: 'blue' },
];
