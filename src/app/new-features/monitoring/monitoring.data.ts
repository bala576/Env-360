// Static mock data for the Monitoring page. Replace with API calls when available.

export type PointStatus = 'normal' | 'warning' | 'critical' | 'offline';

export interface ParameterSummary {
  key: string;
  label: string;
  total: number;
  icon: string;
  tone: string;
  breakdown: Record<PointStatus, number>;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  site: string;
  building: string;
  floor: string;
  space: string;
  spaceType: string;
  parameter: string;
  value: string;
  valueTone: 'blue' | 'red' | 'orange' | 'green' | 'neutral';
  status: PointStatus;
  trend: number[];
  trendColor: string;
  lastReading: string;
  device: string;
  installed: string;
  battery: number;
  signal: number;
}

export interface CurrentReading {
  label: string;
  value: string;
  unit: string;
  icon: string;
  tone: string;
  status: PointStatus;
  note: string;
}

export const STATUS_COLORS: Record<PointStatus, string> = {
  normal: '#16a34a',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#9ca3af',
};

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const MONITORING_ICONS: Record<string, string[]> = {
  temperature: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  humidity: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  co2: ['M7 18a4 4 0 01-.5-8A6 6 0 0118 9a4.5 4.5 0 01-.5 9z'],
  water: ['M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0', 'M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0', 'M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0'],
  energy: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  others: ['M3 8h11a3 3 0 10-3-3', 'M3 12h16a3 3 0 11-3 3', 'M3 16h7'],
  door: ['M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17', 'M3 21h18', 'M15 12h.01'],
  gas: ['M12 4a3 3 0 100 6 3 3 0 000-6z', 'M6 12a3 3 0 100 6 3 3 0 000-6z', 'M18 12a3 3 0 100 6 3 3 0 000-6z'],
  settings: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
  export: ['M12 15V3', 'M7 8l5-5 5 5', 'M4 19h16'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  more: ['M5 12h.01M12 12h.01M19 12h.01'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  close: ['M6 6l12 12M18 6L6 18'],
  chevron: ['M6 9l6 6 6-6'],
  fridge: ['M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z', 'M5 10h14', 'M8 6v2M8 13v3'],
};

export const PARAMETER_SUMMARY: ParameterSummary[] = [
  { key: 'temperature', label: 'Temperature', total: 1128, icon: 'temperature', tone: 'red', breakdown: { normal: 1020, warning: 78, critical: 25, offline: 5 } },
  { key: 'humidity', label: 'Humidity', total: 956, icon: 'humidity', tone: 'blue', breakdown: { normal: 862, warning: 68, critical: 18, offline: 8 } },
  { key: 'co2', label: 'CO₂', total: 480, icon: 'co2', tone: 'green', breakdown: { normal: 412, warning: 46, critical: 15, offline: 7 } },
  { key: 'water', label: 'Water Level', total: 220, icon: 'water', tone: 'indigo', breakdown: { normal: 180, warning: 28, critical: 8, offline: 4 } },
  { key: 'energy', label: 'Energy', total: 310, icon: 'energy', tone: 'orange', breakdown: { normal: 292, warning: 14, critical: 3, offline: 1 } },
  { key: 'others', label: 'Others', total: 236, icon: 'others', tone: 'cyan', breakdown: { normal: 210, warning: 20, critical: 4, offline: 2 } },
];

export interface MonitoringSection {
  slug: string;
  label: string;
  description: string;
  // Shown in the page tab strip; the rest are reached from the sidebar only
  tab: boolean;
}

// Sub-modules of Monitoring, addressed as /monitoring?tab=<slug> (the sidebar links to these)
export const MONITORING_SECTIONS: MonitoringSection[] = [
  { slug: 'live-monitoring', label: 'Live Monitoring', tab: true, description: 'Real-time and historical monitoring of all environmental parameters' },
  { slug: 'historical-data', label: 'Historical Data', tab: true, description: 'Review past sensor readings, statistics and excursions for any monitoring point' },
  { slug: 'trend-analysis', label: 'Trend Analysis', tab: true, description: 'Analyse trends, patterns and correlations across parameters and monitoring points' },
  { slug: 'multi-parameter', label: 'Multi-Parameter', tab: true, description: 'Compare multiple parameters from the same or different monitoring points to identify patterns and correlations' },
  { slug: 'data-explorer', label: 'Data Explorer', tab: true, description: 'Explore, query and analyze raw and processed environmental data with advanced filtering, comparison and visualization tools' },
  { slug: 'monitoring-points', label: 'Monitoring Points', tab: false, description: 'Manage the monitoring points assigned to sites, spaces and devices' },
  { slug: 'calculated-parameters', label: 'Calculated Parameters', tab: false, description: 'Define parameters derived from formulas over raw sensor readings' },
  { slug: 'data-quality', label: 'Data Quality', tab: false, description: 'Track completeness, gaps and estimated readings across monitoring points' },
  { slug: 'monitoring-templates', label: 'Monitoring Templates', tab: false, description: 'Reusable monitoring setups for common space and equipment types' },
];
export const DETAIL_TABS = ['Overview', 'Live Readings', 'Trends', 'Alarms', 'Device Info', 'Maintenance'];

type SeedPoint = Pick<MonitoringPoint, 'name' | 'space' | 'parameter' | 'value' | 'valueTone' | 'status' | 'trendColor' | 'building' | 'floor' | 'spaceType'>;

const SEED_POINTS: SeedPoint[] = [
  { name: 'Cold Room 01', space: 'Retail Store - 101', parameter: 'Temperature', value: '-18.2 °C', valueTone: 'blue', status: 'normal', trendColor: '#16a34a', building: 'Building A', floor: 'Level 1', spaceType: 'Cold Room' },
  { name: 'Cold Room 01', space: 'Retail Store - 101', parameter: 'Humidity', value: '72.4 %RH', valueTone: 'blue', status: 'normal', trendColor: '#2563eb', building: 'Building A', floor: 'Level 1', spaceType: 'Cold Room' },
  { name: 'Refrigeration Area', space: 'Retail Store - 102', parameter: 'Water Leak', value: 'Dry', valueTone: 'neutral', status: 'normal', trendColor: '#9ca3af', building: 'Building A', floor: 'Level 1', spaceType: 'Retail Store' },
  { name: 'Main DB', space: 'Service Room', parameter: 'Energy', value: '124.6 kWh', valueTone: 'red', status: 'warning', trendColor: '#ef4444', building: 'Service Building', floor: 'Ground Floor', spaceType: 'Service Room' },
  { name: 'Data Hall A', space: 'Data Centre', parameter: 'Temperature', value: '23.1 °C', valueTone: 'blue', status: 'normal', trendColor: '#16a34a', building: 'Building B', floor: 'Basement 1', spaceType: 'Data Centre' },
  { name: 'Data Hall A', space: 'Data Centre', parameter: 'Humidity', value: '45.8 %RH', valueTone: 'blue', status: 'normal', trendColor: '#2563eb', building: 'Building B', floor: 'Basement 1', spaceType: 'Data Centre' },
  { name: 'Server Room - 1', space: 'IT Room', parameter: 'Temperature', value: '21.6 °C', valueTone: 'blue', status: 'normal', trendColor: '#7c3aed', building: 'Building A', floor: 'Level 2', spaceType: 'IT Room' },
  { name: 'Meeting Room - 3', space: 'Level 1', parameter: 'CO₂', value: '980 ppm', valueTone: 'red', status: 'warning', trendColor: '#f59e0b', building: 'Building A', floor: 'Level 1', spaceType: 'Meeting Room' },
  { name: 'Restroom - West', space: 'Level 1', parameter: 'Occupancy', value: '2', valueTone: 'blue', status: 'normal', trendColor: '#16a34a', building: 'Building A', floor: 'Level 1', spaceType: 'Restroom' },
  { name: 'Parking Level P1', space: 'Parking - Zone A', parameter: 'Occupancy', value: '84 %', valueTone: 'red', status: 'critical', trendColor: '#ef4444', building: 'Parking Building', floor: 'Basement 1', spaceType: 'Parking' },
  { name: 'Water Tank 01', space: 'Roof', parameter: 'Water Level', value: '3.2 m', valueTone: 'blue', status: 'normal', trendColor: '#2563eb', building: 'Building A', floor: 'Level 2', spaceType: 'Utility' },
  { name: 'Irrigation Zone 1', space: 'Landscape', parameter: 'Soil Moisture', value: '28 %', valueTone: 'orange', status: 'warning', trendColor: '#f59e0b', building: 'Building B', floor: 'Ground Floor', spaceType: 'Landscape' },
];

const DEVICES = ['Milesight EM500', 'Milesight AM307', 'Dragino LHT65', 'Elsys ERS CO2', 'Schneider PM5560'];

// Deterministic pseudo-random trend so the table stays stable between renders
function buildTrend(seed: number, flat: boolean): number[] {
  return Array.from({ length: 16 }, (_, i) => {
    if (flat) return i % 5 === 2 ? 8 : 2;
    return 10 + Math.sin(i * 0.9 + seed) * 4 + ((i * seed) % 5);
  });
}

function buildPoints(total: number): MonitoringPoint[] {
  return Array.from({ length: total }, (_, i) => {
    const seed = SEED_POINTS[i % SEED_POINTS.length];
    const round = Math.floor(i / SEED_POINTS.length);
    const minute = 24 - (i % 24);
    return {
      ...seed,
      id: `MP-${seed.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}-${String(i + 1).padStart(2, '0')}`,
      name: round === 0 ? seed.name : `${seed.name} (${round + 1})`,
      site: 'Dubai Mall',
      trend: buildTrend(i + 1, seed.parameter === 'Water Leak'),
      lastReading: `21 May 2025 10:${String(minute).padStart(2, '0')}`,
      device: DEVICES[i % DEVICES.length],
      installed: '12 Jan 2024',
      battery: 60 + ((i * 7) % 40),
      signal: -60 - ((i * 3) % 30),
    };
  });
}

export const MONITORING_POINTS: MonitoringPoint[] = buildPoints(245);

export const CURRENT_READINGS: CurrentReading[] = [
  { label: 'Temperature', value: '-18.2', unit: '°C', icon: 'temperature', tone: 'red', status: 'normal', note: 'Min -19.4  Max -17.2' },
  { label: 'Humidity', value: '72.4', unit: '%RH', icon: 'humidity', tone: 'blue', status: 'normal', note: 'Min 65.8  Max 78.1' },
  { label: 'Door Status', value: 'Closed', unit: '', icon: 'door', tone: 'indigo', status: 'normal', note: 'Open Count: 2' },
  { label: 'Refrigerant Gas', value: '0', unit: 'ppm', icon: 'gas', tone: 'cyan', status: 'normal', note: 'Threshold: < 10 ppm' },
];

// 24h trend, one sample per hour
export const TREND_TEMPERATURE = [-21, -21.2, -20.8, -21, -21.1, -20.9, -21, -21.2, -21, -20.8, -21, -21.1, -20.2, -19.8, -20.4, -21, -21.1, -21, -20.9, -21.2, -21, -20.9, -21.1, -21];
export const TREND_HUMIDITY = [70, 71, 70, 72, 71, 70, 71, 72, 71, 70, 71, 72, 68, 66, 70, 72, 71, 72, 71, 70, 72, 71, 70, 71];
// Highlighted hours (door-open event)
export const TREND_EVENT = { from: 12.5, to: 15.5 };
