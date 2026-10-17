// Static mock config for the Data Explorer tab. Points and parameters are shared with Multi-Parameter.
import { DropdownOption } from '../../../shared/dropdown/dropdown';
import { MP_ICONS } from '../multi-parameter/multi-parameter.data';

export interface DataSource {
  key: string;
  label: string;
  table: string;
  // Parameters this source exposes; empty means every parameter
  params: string[];
}

export interface RangeFilter {
  key: string;
  min: number | null;
  max: number | null;
}

export interface QueryTemplate {
  label: string;
  params: string[];
  interval?: number;
  ranges?: RangeFilter[];
  door?: DoorFilter;
}

export type DoorFilter = 'all' | 'open' | 'closed';
export type Visualization = 'line' | 'area' | 'combo';

export const DATA_SOURCES: DataSource[] = [
  { key: 'sensor', label: 'Sensor Data', table: 'sensor_readings', params: ['temperature', 'humidity', 'energy', 'co2', 'pressure'] },
  { key: 'calculated', label: 'Calculated Parameters', table: 'calculated_values', params: ['energy', 'temperature', 'humidity'] },
  { key: 'device', label: 'Device Status', table: 'device_status', params: ['door', 'compressor', 'defrost', 'battery', 'signal'] },
  { key: 'events', label: 'Events', table: 'event_log', params: ['door', 'defrost', 'compressor'] },
  { key: 'alarms', label: 'Alarms', table: 'alarm_history', params: ['temperature', 'humidity', 'co2', 'door'] },
  { key: 'aggregated', label: 'Aggregated Data', table: 'aggregated_readings', params: [] },
];

export const VISUALIZATION_OPTIONS: DropdownOption[] = [
  { label: 'Line Chart', value: 'line' },
  { label: 'Area Chart', value: 'area' },
  { label: 'Line + Bar Chart', value: 'combo' },
];

export const DOOR_FILTER_OPTIONS: DropdownOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
];

export const QUERY_TEMPLATES: QueryTemplate[] = [
  { label: 'Temperature Excursions', params: ['temperature', 'humidity', 'door'], ranges: [{ key: 'temperature', min: -8, max: null }] },
  { label: 'Door Open Periods', params: ['temperature', 'energy', 'door'], door: 'open' },
  { label: 'Energy Overview', params: ['energy', 'temperature', 'compressor'], interval: 60 },
  { label: 'Device Health', params: ['battery', 'signal'], interval: 60 },
];

export const PAGE_SIZE = 8;
export const SAVED_QUERIES_KEY = 'env360.dataExplorer.savedQueries';

export const EXPLORER_ICONS: Record<string, string[]> = {
  ...MP_ICONS,
  play: ['M7 4l13 8-13 8z'],
  save: ['M5 3h11l3 3v15H5z', 'M8 3v6h8V3', 'M8 21v-7h8v7'],
  filter: ['M3 5h18l-7 8v6l-4 2v-8z'],
  plus: ['M12 5v14M5 12h14'],
  reset: ['M4 12a8 8 0 108-8 8.5 8.5 0 00-6 2.5L4 8', 'M4 3v5h5'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13'],
  copy: ['M9 9h11v11H9z', 'M5 15H4V4h11v1'],
  check: ['M5 12l5 5 9-10'],
  bookmark: ['M6 3h12v18l-6-4-6 4z'],
};
