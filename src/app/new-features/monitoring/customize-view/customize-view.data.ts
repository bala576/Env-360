// Static config for the Monitoring "Customize View" page. Replace with API calls when available.
import { DropdownOption } from '../../../shared/dropdown/dropdown';
import { MP_ICONS } from '../multi-parameter/multi-parameter.data';

// full: whole row, wide: two columns (and two rows tall), single: one column
export type WidgetSize = 'full' | 'wide' | 'single';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
export type Visibility = 'private' | 'team' | 'everyone';

export interface WidgetDef {
  key: string;
  label: string;
  description: string;
  icon: string;
  tone: string;
  size: WidgetSize;
}

export interface ViewConfig {
  widgets: { key: string; enabled: boolean }[];
  layout: { columns: 2 | 3; density: 'comfortable' | 'compact'; rounded: boolean };
  filters: { site: string; range: number; summaryParams: string[] };
  display: { chartType: 'line' | 'area'; thresholds: boolean; sparklines: boolean; unit: 'C' | 'F'; refresh: number };
  sharing: { name: string; visibility: Visibility; makeDefault: boolean };
}

export const WIDGETS: WidgetDef[] = [
  { key: 'summary', label: 'Summary Cards', description: 'Key parameter overview (Temperature, Humidity, etc.)', icon: 'grid', tone: 'purple', size: 'full' },
  { key: 'points', label: 'Monitoring Points', description: 'List of monitoring points with status', icon: 'list', tone: 'blue', size: 'wide' },
  { key: 'trend', label: 'Trend Chart', description: 'Time series chart for selected parameters', icon: 'spike', tone: 'purple', size: 'full' },
  { key: 'comparison', label: 'Parameter Comparison', description: 'Compare multiple parameters', icon: 'bars', tone: 'green', size: 'single' },
  { key: 'map', label: 'Map View', description: 'Monitoring points on site map', icon: 'map', tone: 'blue', size: 'single' },
  { key: 'alarms', label: 'Alarm Summary', description: 'Recent alarms and events', icon: 'alert', tone: 'red', size: 'single' },
  { key: 'correlation', label: 'Correlation Analysis', description: 'Parameter correlation matrix', icon: 'link', tone: 'sky', size: 'single' },
  { key: 'insights', label: 'Top Insights', description: 'AI insights and recommendations', icon: 'bulb', tone: 'amber', size: 'single' },
  { key: 'devices', label: 'Device Status', description: 'Device health and connectivity', icon: 'signal', tone: 'blue', size: 'single' },
  { key: 'environment', label: 'Environmental Index', description: 'Air quality / comfort index', icon: 'leaf', tone: 'green', size: 'single' },
  { key: 'energy', label: 'Energy Analysis', description: 'Energy consumption insights', icon: 'energy', tone: 'amber', size: 'single' },
];

export const SUMMARY_PARAMS = [
  { key: 'temperature', label: 'Temperature', value: -18.2, unit: '°C', decimals: 1, delta: '-0.6 °C', up: false, good: true, icon: 'temperature', tone: 'red', color: '#2563eb' },
  { key: 'humidity', label: 'Humidity', value: 82.4, unit: '%RH', decimals: 1, delta: '-2.1 %', up: false, good: true, icon: 'humidity', tone: 'purple', color: '#7c3aed' },
  { key: 'co2', label: 'CO₂', value: 480, unit: 'ppm', decimals: 0, delta: '-12 ppm', up: false, good: true, icon: 'cloud', tone: 'green', color: '#16a34a' },
  { key: 'energy', label: 'Energy', value: 310, unit: 'kWh', decimals: 0, delta: '+8 %', up: true, good: false, icon: 'energy', tone: 'amber', color: '#f59e0b' },
  { key: 'pressure', label: 'Air Pressure', value: 12.4, unit: 'Pa', decimals: 1, delta: '+0.3 Pa', up: true, good: true, icon: 'gauge', tone: 'slate', color: '#db2777' },
];

export const ALARM_SUMMARY = [
  { label: 'Critical', count: 2, icon: 'alert', tone: 'red' },
  { label: 'Major', count: 8, icon: 'alert', tone: 'amber' },
  { label: 'Minor', count: 15, icon: 'alert', tone: 'blue' },
  { label: 'Information', count: 23, icon: 'info', tone: 'slate' },
];

export const PREVIEW_INSIGHTS = [
  { title: 'Temperature spike detected', text: 'Temperature increased to -15.1 °C at Cold Room 01', icon: 'temperature', tone: 'red' },
  { title: 'High humidity correlation', text: 'Humidity increases when temperature rises above -16 °C', icon: 'humidity', tone: 'purple' },
  { title: 'Stable operating conditions', text: '92% of monitoring points are within normal range', icon: 'shield', tone: 'green' },
  { title: 'Energy consumption trending up', text: '+8% increase compared to previous week', icon: 'energy', tone: 'amber' },
];

export const DEVICE_HEALTH = [
  { label: 'Online', count: 228, color: '#16a34a' },
  { label: 'Low Battery', count: 9, color: '#f59e0b' },
  { label: 'Offline', count: 8, color: '#ef4444' },
];

export const SITE_OPTIONS: DropdownOption[] = [
  { label: 'All Sites', value: 'all' },
  { label: 'Dubai Mall Store', value: 'Dubai Mall Store' },
  { label: 'Mall of the Emirates Store', value: 'Mall of the Emirates Store' },
];

export const REFRESH_OPTIONS: DropdownOption[] = [
  { label: 'Every 30 seconds', value: 30 },
  { label: 'Every 1 minute', value: 60 },
  { label: 'Every 5 minutes', value: 300 },
  { label: 'Manual only', value: 0 },
];

export const PANEL_TABS = ['Widgets', 'Layout', 'Filters', 'Display', 'Sharing'] as const;
export type PanelTab = (typeof PANEL_TABS)[number];

export const VIEW_STORAGE_KEY = 'env360.monitoring.customView';

export const DEFAULT_VIEW: ViewConfig = {
  widgets: [
    { key: 'summary', enabled: true },
    { key: 'points', enabled: true },
    { key: 'trend', enabled: true },
    { key: 'comparison', enabled: true },
    { key: 'map', enabled: false },
    { key: 'alarms', enabled: true },
    { key: 'correlation', enabled: false },
    { key: 'insights', enabled: true },
    { key: 'devices', enabled: false },
    { key: 'environment', enabled: false },
    { key: 'energy', enabled: false },
  ],
  layout: { columns: 3, density: 'comfortable', rounded: true },
  filters: { site: 'all', range: 7, summaryParams: ['temperature', 'humidity', 'co2', 'energy'] },
  display: { chartType: 'line', thresholds: true, sparklines: true, unit: 'C', refresh: 60 },
  sharing: { name: 'My Monitoring View', visibility: 'private', makeDefault: true },
};

export const CUSTOMIZE_ICONS: Record<string, string[]> = {
  ...MP_ICONS,
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  list: ['M9 6h11M9 12h11M9 18h11', 'M4 6h.01M4 12h.01M4 18h.01'],
  map: ['M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z', 'M9 4v14M15 6v14'],
  bulb: ['M9 18h6M10 21h4', 'M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z'],
  leaf: ['M5 19c0-8 5-13 15-14-1 10-6 15-14 15', 'M5 19l7-7'],
  cloud: ['M7 18a4 4 0 010-8 5.5 5.5 0 0110.6-1.5A4 4 0 0117 18z'],
  drag: ['M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01'],
  desktop: ['M3 4h18v12H3z', 'M8 20h8M12 16v4'],
  tablet: ['M6 3h12v18H6z', 'M11 18h2'],
  mobile: ['M8 3h8v18H8z', 'M11 18h2'],
  reset: ['M4 12a8 8 0 108-8 8.5 8.5 0 00-6 2.5L4 8', 'M4 3v5h5'],
  check: ['M5 12l5 5 9-10'],
  copy: ['M9 9h11v11H9z', 'M5 15H4V4h11v1'],
};
