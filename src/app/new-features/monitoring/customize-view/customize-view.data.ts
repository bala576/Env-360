// Static config for the Monitoring "Customize View" page. Replace with API calls when available.
import { DropdownOption } from '../../../shared/dropdown/dropdown';
import { MP_ICONS } from '../multi-parameter/multi-parameter.data';

// full: whole row, wide: two columns (and two rows tall), single: one column
export type WidgetSize = 'full' | 'wide' | 'single';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
export type ShareMode = 'specific' | 'all' | 'public';
export type ShareRole = 'viewer' | 'editor';

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
  layout: { columns: 2 | 3; density: 'comfortable' | 'compact'; rounded: boolean; template: string };
  filters: ViewFilters;
  display: ViewDisplay;
  sharing: {
    enabled: boolean;
    mode: ShareMode;
    name: string;
    makeDefault: boolean;
    members: string[];
    roles: Record<string, ShareRole>;
    allowEdit: boolean;
    allowReshare: boolean;
  };
  presets: FilterPreset[];
}

export interface ViewDisplay {
  // Chart
  chartType: 'line' | 'area';
  yAxis: 'dual' | 'left' | 'right';
  scheme: string;
  interval: number; // minutes between samples, 0 = based on date range
  dataPoints: boolean;
  thresholds: boolean;
  legend: boolean;
  events: boolean;
  grid: boolean;
  smooth: boolean;
  tooltips: boolean;
  unit: 'C' | 'F';
  refresh: number;
  // KPI / summary cards
  cardLayout: 'compact' | 'comfortable';
  numberFormat: 'auto' | 'value' | 'precise';
  cardStyle: 'default' | 'minimal' | 'detailed' | 'icon';
  trendIndicator: boolean;
  comparison: boolean;
  minMax: boolean;
  // Table
  columns: string[];
  density: 'compact' | 'standard' | 'comfortable';
  sortBy: string;
  miniTrend: boolean;
  highlightAlarms: boolean;
  pageSize: number;
}

export type DisplayToggle =
  | 'dataPoints' | 'thresholds' | 'legend' | 'events' | 'grid' | 'smooth' | 'tooltips'
  | 'trendIndicator' | 'comparison' | 'minMax' | 'miniTrend' | 'highlightAlarms';

export interface DisplaySelect {
  key: 'chartType' | 'yAxis' | 'interval' | 'cardLayout' | 'numberFormat' | 'sortBy' | 'pageSize';
  label: string;
  options: DropdownOption[];
}

export const DISPLAY_SELECTS: Record<DisplaySelect['key'], DisplaySelect> = {
  chartType: { key: 'chartType', label: 'Default Chart Type', options: [{ label: 'Line Chart', value: 'line' }, { label: 'Area Chart', value: 'area' }] },
  yAxis: { key: 'yAxis', label: 'Y-Axis Position', options: [{ label: 'Left & Right (Dual Axis)', value: 'dual' }, { label: 'Left Only', value: 'left' }, { label: 'Right Only', value: 'right' }] },
  interval: { key: 'interval', label: 'Chart Time Interval', options: [{ label: 'Auto (Based on Date Range)', value: 0 }, { label: '15 Minutes', value: 15 }, { label: '1 Hour', value: 60 }, { label: '4 Hours', value: 240 }] },
  cardLayout: { key: 'cardLayout', label: 'Card Layout', options: [{ label: 'Compact', value: 'compact' }, { label: 'Comfortable', value: 'comfortable' }] },
  numberFormat: { key: 'numberFormat', label: 'Number Format', options: [{ label: 'Auto (with Unit)', value: 'auto' }, { label: 'Value Only', value: 'value' }, { label: 'Extra Decimal', value: 'precise' }] },
  sortBy: { key: 'sortBy', label: 'Sort By (Default)', options: [{ label: 'Monitoring Point (A-Z)', value: 'name' }, { label: 'Space / Location (A-Z)', value: 'space' }, { label: 'Parameter (A-Z)', value: 'parameter' }, { label: 'Status (Critical first)', value: 'status' }] },
  pageSize: { key: 'pageSize', label: 'Pagination', options: [{ label: '5 records per page', value: 5 }, { label: '10 records per page', value: 10 }, { label: '20 records per page', value: 20 }, { label: '50 records per page', value: 50 }] },
};

// Temperature / humidity line colours for each scheme
export const COLOR_SCHEMES = [
  { key: 'blue', label: 'Ocean', swatch: '#2563eb', temp: '#2563eb', hum: '#7c3aed' },
  { key: 'purple', label: 'Violet', swatch: '#7c3aed', temp: '#7c3aed', hum: '#db2777' },
  { key: 'green', label: 'Forest', swatch: '#16a34a', temp: '#16a34a', hum: '#0891b2' },
  { key: 'amber', label: 'Sunset', swatch: '#f59e0b', temp: '#f59e0b', hum: '#2563eb' },
  { key: 'red', label: 'Coral', swatch: '#ef4444', temp: '#ef4444', hum: '#7c3aed' },
];

export const CARD_STYLES: { key: ViewDisplay['cardStyle']; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'detailed', label: 'Detailed' },
  { key: 'icon', label: 'Icon Only' },
];

export const TABLE_COLUMNS = [
  { key: 'name', label: 'Monitoring Point' },
  { key: 'space', label: 'Space / Location' },
  { key: 'parameter', label: 'Parameter' },
  { key: 'value', label: 'Current Value' },
  { key: 'status', label: 'Status' },
  { key: 'trend', label: 'Trend (24h)' },
];

export const ROW_DENSITIES: ViewDisplay['density'][] = ['compact', 'standard', 'comfortable'];

export interface ViewFilters {
  site: string;
  building: string;
  floor: string;
  spaces: string[];
  params: string[];
  status: string;
  aggregation: string;
  // Date range shown on the trend chart; range is its length in days
  dateFrom: string;
  dateTo: string;
  range: number;
  quick: string[];
  summaryParams: string[];
  deviceStatus: string[];
  models: string[];
  excludeEstimated: boolean;
  alarmsOnly: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  detail: string;
  icon: string;
  tone: string;
  filters: Partial<ViewFilters>;
}

// Single fields hold a string ('' = all), multi fields a list of values
export interface FilterField {
  key: 'site' | 'building' | 'floor' | 'spaces' | 'params' | 'status' | 'aggregation';
  label: string;
  placeholder: string;
  multi?: boolean;
  clearable?: boolean;
  options: DropdownOption[];
}

const opts = (values: string[]): DropdownOption[] => values.map(v => ({ label: v, value: v }));

export const FILTER_FIELDS: FilterField[] = [
  { key: 'site', label: 'Site', placeholder: 'All Sites', clearable: true, options: opts(['Dubai Mall Store', 'Mall of the Emirates Store']) },
  { key: 'building', label: 'Building / Area', placeholder: 'All Areas', clearable: true, options: opts(['Retail Store - 101', 'Retail Store - 102', 'Service Room', 'Data Centre']) },
  { key: 'floor', label: 'Floor', placeholder: 'All Floors', clearable: true, options: [{ label: 'All Floors', value: '' }, ...opts(['Ground Floor', 'Level 1', 'Basement 1'])] },
  { key: 'spaces', label: 'Space / Monitoring Point', placeholder: 'All Points', multi: true, clearable: true, options: opts(['Cold Room 01', 'Refrigeration Area', 'Main DB', 'Data Hall A', 'Server Room - 1']) },
  { key: 'params', label: 'Parameter Type', placeholder: 'All Parameters', multi: true, options: opts(['Temperature', 'Humidity', 'Energy', 'Water Leak', 'CO₂', 'Occupancy']) },
  { key: 'status', label: 'Status', placeholder: 'All Status', options: [{ label: 'All Status', value: '' }, { label: 'Normal', value: 'normal' }, { label: 'Warning', value: 'warning' }, { label: 'Critical', value: 'critical' }, { label: 'Offline', value: 'offline' }] },
  { key: 'aggregation', label: 'Aggregation', placeholder: 'Raw Data', options: opts(['Raw Data', '5 Minutes', '15 Minutes', '1 Hour', '1 Day']) },
];

export const FILTER_TABS = ['General Filters', 'Parameter Filters', 'Device Filters', 'Advanced Filters'] as const;
export type FilterTab = (typeof FILTER_TABS)[number];

export const QUICK_FILTERS = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Custom Range'];
export const DEVICE_STATUSES = ['Online', 'Low Battery', 'Offline'];
export const DEVICE_MODELS = ['Milesight EM500', 'Milesight AM307', 'Dragino LHT65', 'Elsys ERS CO2', 'Schneider PM5560'];

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
  { key: 'temperature', min: -19.4, max: -17.2, label: 'Temperature', value: -18.2, unit: '°C', decimals: 1, delta: '-0.6 °C', up: false, good: true, icon: 'temperature', tone: 'red', color: '#2563eb' },
  { key: 'humidity', min: 78.6, max: 86.1, label: 'Humidity', value: 82.4, unit: '%RH', decimals: 1, delta: '-2.1 %', up: false, good: true, icon: 'humidity', tone: 'purple', color: '#7c3aed' },
  { key: 'co2', min: 430, max: 560, label: 'CO₂', value: 480, unit: 'ppm', decimals: 0, delta: '-12 ppm', up: false, good: true, icon: 'cloud', tone: 'green', color: '#16a34a' },
  { key: 'energy', min: 262, max: 318, label: 'Energy', value: 310, unit: 'kWh', decimals: 0, delta: '+8 %', up: true, good: false, icon: 'energy', tone: 'amber', color: '#f59e0b' },
  { key: 'pressure', min: 11.2, max: 13.6, label: 'Air Pressure', value: 12.4, unit: 'Pa', decimals: 1, delta: '+0.3 Pa', up: true, good: true, icon: 'gauge', tone: 'slate', color: '#db2777' },
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

export const PANEL_TABS = ['Widgets', 'Layouts', 'Filters', 'Display', 'Sharing'] as const;
export type PanelTab = (typeof PANEL_TABS)[number];

// Prebuilt layouts: which widgets show, in what order, and any size overrides
export interface LayoutTemplate {
  id: string;
  name: string;
  widgets: string[];
  sizes?: Partial<Record<string, WidgetSize>>;
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  { id: 'default', name: 'Default Layout', widgets: ['summary', 'trend', 'points', 'alarms', 'insights'] },
  { id: 'overview', name: 'Overview Layout', widgets: ['summary', 'trend', 'points', 'alarms', 'devices', 'energy'] },
  { id: 'trend', name: 'Trend Analysis Layout', widgets: ['trend', 'energy', 'comparison', 'correlation'] },
  { id: 'multi', name: 'Multi-Parameter Layout', widgets: ['summary', 'trend', 'energy', 'comparison', 'alarms'], sizes: { energy: 'wide' } },
  { id: 'map', name: 'Map Centered Layout', widgets: ['map', 'alarms', 'insights', 'points'], sizes: { map: 'wide', points: 'full' } },
  { id: 'list', name: 'List & Detail Layout', widgets: ['points', 'alarms', 'insights', 'devices'], sizes: { points: 'full' } },
];

export interface SharePerson {
  id: string;
  name: string;
  sub: string;
  group?: boolean;
  initials?: string;
  tone: string;
}

export const SHARE_PEOPLE: SharePerson[] = [
  { id: 'ops-team', name: 'Operations Team', sub: 'Group · 12 Members', group: true, tone: 'purple' },
  { id: 'facilities-team', name: 'Facilities Team', sub: 'Group · 8 Members', group: true, tone: 'purple' },
  { id: 'john', name: 'John Mathew', sub: 'john.mathew@purpleiq.ai', initials: 'JM', tone: 'violet' },
  { id: 'sarah', name: 'Sarah Khan', sub: 'sarah.khan@purpleiq.ai', initials: 'SK', tone: 'mint' },
  { id: 'ahmed', name: 'Ahmed Raza', sub: 'ahmed.raza@purpleiq.ai', initials: 'AR', tone: 'slate' },
  { id: 'priya', name: 'Priya Nair', sub: 'priya.nair@purpleiq.ai', initials: 'PN', tone: 'rose' },
];

export const SHARE_ROLES: DropdownOption[] = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
];

export const VIEW_STORAGE_KEY = 'env360.monitoring.customView';

export const DEFAULT_VIEW: ViewConfig = {
  widgets: [
    { key: 'summary', enabled: true },
    { key: 'points', enabled: true },
    { key: 'trend', enabled: true },
    { key: 'comparison', enabled: false },
    { key: 'map', enabled: false },
    { key: 'alarms', enabled: true },
    { key: 'correlation', enabled: false },
    { key: 'insights', enabled: true },
    { key: 'devices', enabled: false },
    { key: 'environment', enabled: false },
    { key: 'energy', enabled: false },
  ],
  layout: { columns: 3, density: 'comfortable', rounded: true, template: 'default' },
  filters: {
    site: 'Dubai Mall Store',
    building: 'Retail Store - 101',
    floor: '',
    spaces: ['Cold Room 01', 'Refrigeration Area', 'Main DB'],
    params: ['Temperature', 'Humidity', 'Energy', 'Water Leak'],
    status: '',
    aggregation: '15 Minutes',
    dateFrom: '2026-10-01',
    dateTo: '2026-10-07',
    range: 7,
    quick: [...QUICK_FILTERS],
    summaryParams: ['temperature', 'humidity', 'co2', 'energy'],
    deviceStatus: [...DEVICE_STATUSES],
    models: [...DEVICE_MODELS],
    excludeEstimated: false,
    alarmsOnly: false,
  },
  display: {
    chartType: 'line',
    yAxis: 'dual',
    scheme: 'blue',
    interval: 0,
    dataPoints: true,
    thresholds: true,
    legend: true,
    events: true,
    grid: true,
    smooth: true,
    tooltips: true,
    unit: 'C',
    refresh: 60,
    cardLayout: 'compact',
    numberFormat: 'auto',
    cardStyle: 'default',
    trendIndicator: true,
    comparison: true,
    minMax: true,
    columns: ['name', 'space', 'parameter', 'value', 'status', 'trend'],
    density: 'compact',
    sortBy: 'name',
    miniTrend: true,
    highlightAlarms: true,
    pageSize: 20,
  },
  sharing: {
    enabled: true,
    mode: 'specific',
    name: 'My Monitoring View',
    makeDefault: true,
    members: ['ops-team', 'facilities-team', 'john'],
    roles: { 'ops-team': 'viewer', 'facilities-team': 'editor', john: 'viewer', sarah: 'editor', ahmed: 'viewer', priya: 'viewer' },
    allowEdit: true,
    allowReshare: false,
  },
  presets: [
    { id: 'all-dubai', name: 'All Parameters - Dubai Mall', detail: 'Dubai Mall Store | All Parameters | Last 7 Days', icon: 'grid', tone: 'purple', filters: { site: 'Dubai Mall Store', params: [], range: 7 } },
    { id: 'energy', name: 'Energy Monitoring', detail: 'Dubai Mall Store | Energy | Last 30 Days', icon: 'energy', tone: 'red', filters: { site: 'Dubai Mall Store', params: ['Energy'], range: 30 } },
    { id: 'environment', name: 'Environmental Quality', detail: 'All Sites | Temperature, Humidity, CO₂ | Last 7 Days', icon: 'leaf', tone: 'green', filters: { site: '', params: ['Temperature', 'Humidity', 'CO₂'], range: 7 } },
    { id: 'critical', name: 'Critical Devices', detail: 'All Sites | Alarm / Fault Status | Last 24 Hours', icon: 'alert', tone: 'red', filters: { site: '', status: 'critical', range: 1 } },
  ],
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
  plus: ['M12 5v14M5 12h14'],
  bookmark: ['M6 3h12v18l-6-4-6 4z'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13'],
  users: ['M9 11a4 4 0 100-8 4 4 0 000 8z', 'M2 21a7 7 0 0114 0', 'M16 3.5a4 4 0 010 7.5', 'M18 21a7 7 0 00-2.6-5.5'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z', 'M12 15a3 3 0 100-6 3 3 0 000 6z'],
};
