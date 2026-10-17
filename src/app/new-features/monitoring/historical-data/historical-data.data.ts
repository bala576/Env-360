// Static mock data for the Historical Data tab. Replace with API calls when available.
import { DropdownOption } from '../../../shared/dropdown/dropdown';
import { MONITORING_ICONS } from '../monitoring.data';

export interface HistParameter {
  key: string;
  label: string;
  unit: string;
  color: string;
  icon: string;
  tone: string;
  deviceCode: string;
  decimals: number;
  // Acceptable band; readings outside it count as excursions
  low: number;
  high: number;
  // Simulated signal shape
  base: number;
  amplitude: number;
  noise: number;
  // Fixed axis range; otherwise the axis fits the data
  axis?: [number, number];
}

export interface HistPoint {
  id: string;
  name: string;
  site: string;
  building: string;
  floor: string;
  parameters: string[];
  seed: number;
  offsets?: Record<string, number>;
}

export const HIST_PARAMETERS: HistParameter[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#2563eb', icon: 'temperature', tone: 'blue', deviceCode: 'TEMP', decimals: 1, low: -27, high: -8, base: -19, amplitude: 1.3, noise: 0.5, axis: [-30, -5] },
  { key: 'humidity', label: 'Humidity', unit: '%RH', color: '#7c3aed', icon: 'humidity', tone: 'purple', deviceCode: 'HUM', decimals: 1, low: 12, high: 88, base: 76, amplitude: 4, noise: 1.6, axis: [0, 100] },
  { key: 'co2', label: 'CO₂', unit: 'ppm', color: '#16a34a', icon: 'co2', tone: 'green', deviceCode: 'CO2', decimals: 0, low: 400, high: 1000, base: 690, amplitude: 160, noise: 35 },
];

export const HIST_POINTS: HistPoint[] = [
  { id: 'cr-01', name: 'Cold Room 01', site: 'Dubai Mall Store', building: 'Retail Store - 101', floor: 'Ground Floor', parameters: ['temperature', 'humidity'], seed: 1 },
  { id: 'cr-02', name: 'Cold Room 02', site: 'Dubai Mall Store', building: 'Retail Store - 101', floor: 'Ground Floor', parameters: ['temperature', 'humidity'], seed: 2, offsets: { temperature: 1.2 } },
  { id: 'fz-01', name: 'Freezer 01', site: 'Dubai Mall Store', building: 'Retail Store - 101', floor: 'Level 1', parameters: ['temperature', 'humidity'], seed: 3, offsets: { temperature: -3, humidity: -8 } },
  { id: 'cr-03', name: 'Cold Room 03', site: 'Dubai Mall Store', building: 'Retail Store - 102', floor: 'Ground Floor', parameters: ['temperature', 'humidity'], seed: 4 },
  { id: 'mr-03', name: 'Meeting Room 03', site: 'Dubai Mall Store', building: 'Retail Store - 102', floor: 'Level 1', parameters: ['co2', 'humidity'], seed: 5, offsets: { humidity: -14 } },
  { id: 'cr-a', name: 'Cold Room A', site: 'Mall of the Emirates Store', building: 'Hypermarket - 201', floor: 'Ground Floor', parameters: ['temperature', 'humidity'], seed: 6 },
  { id: 'cr-b', name: 'Cold Room B', site: 'Mall of the Emirates Store', building: 'Hypermarket - 201', floor: 'Ground Floor', parameters: ['temperature', 'humidity'], seed: 7, offsets: { temperature: 0.8 } },
];

export const INTERVAL_OPTIONS: DropdownOption[] = [
  { label: '5 Minutes', value: 5 },
  { label: '15 Minutes', value: 15 },
  { label: '30 Minutes', value: 30 },
  { label: '1 Hour', value: 60 },
  { label: '1 Day', value: 1440 },
];

export const CHART_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'Line Chart', value: 'line' },
  { label: 'Area Chart', value: 'area' },
];

export const QUICK_RANGES = [1, 3, 7, 30];
export const MAX_RANGE_DAYS = 90;
export const MAX_COMPARE = 2;

export const HIST_ICONS: Record<string, string[]> = {
  ...MONITORING_ICONS,
  records: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 12h6M10 16h6'],
  alert: ['M12 3l9.5 17h-19z', 'M12 10v4', 'M12 17h.01'],
  pie: ['M12 3a9 9 0 109 9h-9z', 'M15 3.5A9 9 0 0120.5 9H15z'],
  bars: ['M5 20V12M10 20V8M15 20v-5M20 20V5', 'M3 20h18'],
  calendar: ['M4 6h16v15H4z', 'M4 10h16', 'M8 3v4M16 3v4'],
  expand: ['M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'],
  collapse: ['M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'],
  download: ['M12 4v11', 'M7 10l5 5 5-5', 'M5 20h14'],
  sort: ['M8 9l4-4 4 4', 'M8 15l4 4 4-4'],
  arrowUp: ['M12 19V5', 'M6 11l6-6 6 6'],
  arrowDown: ['M12 5v14', 'M6 13l6 6 6-6'],
};
