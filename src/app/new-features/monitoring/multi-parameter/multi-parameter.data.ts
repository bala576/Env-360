// Static mock config for the Multi-Parameter tab. Replace with API calls when available.
import { DropdownOption } from '../../../shared/dropdown/dropdown';
import { TREND_ICONS } from '../trend-analysis/trend-analysis.data';

// line: continuous reading, bar: consumption per interval, state: on/off signal
export type MpKind = 'line' | 'bar' | 'state';

export interface MpParameter {
  key: string;
  label: string;
  unit: string;
  color: string;
  icon: string;
  tone: string;
  kind: MpKind;
  decimals: number;
  // Acceptable band for continuous readings
  low?: number;
  high?: number;
  // Fixed axis range when values are not normalised
  axis: [number, number];
  // Labels for the on (1) and off (0) states
  states?: [string, string];
}

export interface MpPoint {
  id: string;
  name: string;
  site: string;
  building: string;
  parameters: string[];
  seed: number;
  // Shifts the baseline of continuous parameters
  offsets?: Record<string, number>;
}

export const MP_PARAMETERS: MpParameter[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#2563eb', icon: 'temperature', tone: 'blue', kind: 'line', decimals: 1, low: -27, high: -8, axis: [-30, 10] },
  { key: 'humidity', label: 'Humidity', unit: '%RH', color: '#7c3aed', icon: 'humidity', tone: 'purple', kind: 'line', decimals: 1, low: 12, high: 92, axis: [0, 100] },
  { key: 'door', label: 'Door Status', unit: '%', color: '#16a34a', icon: 'door', tone: 'green', kind: 'state', decimals: 0, axis: [0, 1], states: ['Open', 'Closed'] },
  { key: 'energy', label: 'Energy', unit: 'kWh', color: '#f59e0b', icon: 'energy', tone: 'amber', kind: 'bar', decimals: 1, axis: [0, 8] },
  { key: 'defrost', label: 'Defrost Status', unit: '%', color: '#0ea5e9', icon: 'snow', tone: 'sky', kind: 'state', decimals: 0, axis: [0, 1], states: ['ON', 'OFF'] },
  { key: 'co2', label: 'CO₂', unit: 'ppm', color: '#64748b', icon: 'co2', tone: 'slate', kind: 'line', decimals: 0, low: 400, high: 1000, axis: [300, 1300] },
  { key: 'compressor', label: 'Compressor Status', unit: '%', color: '#0d9488', icon: 'cycle', tone: 'sky', kind: 'state', decimals: 0, axis: [0, 1], states: ['ON', 'OFF'] },
  { key: 'pressure', label: 'Air Pressure', unit: 'Pa', color: '#db2777', icon: 'gauge', tone: 'slate', kind: 'line', decimals: 1, low: 5, high: 25, axis: [0, 30] },
  { key: 'battery', label: 'Battery Level', unit: '%', color: '#65a30d', icon: 'battery', tone: 'green', kind: 'line', decimals: 0, low: 20, high: 100, axis: [0, 100] },
  { key: 'signal', label: 'Signal Strength', unit: 'dBm', color: '#9333ea', icon: 'signal', tone: 'purple', kind: 'line', decimals: 0, low: -90, high: -40, axis: [-100, -30] },
];

export const MP_POINTS: MpPoint[] = [
  { id: 'cr-01', name: 'Cold Room 01', site: 'Dubai Mall Store', building: 'Retail Store - 101', parameters: ['temperature', 'humidity', 'door', 'energy', 'defrost', 'compressor', 'pressure', 'battery', 'signal'], seed: 1 },
  { id: 'cr-02', name: 'Cold Room 02', site: 'Dubai Mall Store', building: 'Retail Store - 101', parameters: ['temperature', 'humidity', 'door', 'energy', 'defrost', 'compressor', 'pressure', 'battery', 'signal'], seed: 2, offsets: { temperature: 1.2 } },
  { id: 'fz-01', name: 'Freezer 01', site: 'Dubai Mall Store', building: 'Retail Store - 101', parameters: ['temperature', 'humidity', 'door', 'energy', 'defrost', 'compressor', 'pressure', 'battery', 'signal'], seed: 3, offsets: { temperature: -3, humidity: -8, energy: 0.4 } },
  { id: 'cr-03', name: 'Cold Room 03', site: 'Dubai Mall Store', building: 'Retail Store - 102', parameters: ['temperature', 'humidity', 'door', 'energy', 'defrost', 'compressor', 'pressure', 'battery', 'signal'], seed: 4 },
  { id: 'mr-03', name: 'Meeting Room 03', site: 'Dubai Mall Store', building: 'Retail Store - 102', parameters: ['co2', 'humidity', 'door', 'energy', 'battery', 'signal'], seed: 5, offsets: { humidity: -24, energy: -0.3 } },
  { id: 'cr-a', name: 'Cold Room A', site: 'Mall of the Emirates Store', building: 'Hypermarket - 201', parameters: ['temperature', 'humidity', 'door', 'energy', 'defrost', 'compressor', 'pressure', 'battery', 'signal'], seed: 6 },
  { id: 'cr-b', name: 'Cold Room B', site: 'Mall of the Emirates Store', building: 'Hypermarket - 201', parameters: ['temperature', 'humidity', 'door', 'energy', 'defrost', 'compressor', 'pressure', 'battery', 'signal'], seed: 7, offsets: { temperature: 0.8 } },
];

export const MAX_PARAMS = 6;

export const MP_CHART_OPTIONS: DropdownOption[] = [
  { label: 'Line + Bar Chart', value: 'combo' },
  { label: 'Line Chart', value: 'line' },
];

export const MP_COMPARE_OPTIONS: DropdownOption[] = [
  { label: 'Current Period vs Previous Period', value: 'previous' },
  { label: 'Current Period vs Last Month', value: 'month' },
];

export const MP_ICONS: Record<string, string[]> = {
  ...TREND_ICONS,
  snow: ['M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7', 'M9 4l3 2 3-2M9 20l3-2 3 2'],
  info: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 11v5', 'M12 8h.01'],
  chevronRight: ['M9 6l6 6-6 6'],
  gauge: ['M4 18a8 8 0 1116 0', 'M12 18l4-6', 'M12 18h.01'],
  battery: ['M3 8h15v8H3z', 'M21 11v2', 'M6 11v2M9 11v2'],
  signal: ['M4 20v-3M9 20v-7M14 20V9M19 20V4'],
};
