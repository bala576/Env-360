// Static mock config for the Trend Analysis tab. Points and parameters are shared with Historical Data.
import { DropdownOption } from '../../../shared/dropdown/dropdown';
import { HIST_ICONS } from '../historical-data/historical-data.data';

export {
  CHART_TYPE_OPTIONS,
  HIST_PARAMETERS as TREND_PARAMETERS,
  HIST_POINTS as TREND_POINTS,
  INTERVAL_OPTIONS as AGGREGATION_OPTIONS,
  MAX_COMPARE,
  MAX_RANGE_DAYS,
  QUICK_RANGES,
} from '../historical-data/historical-data.data';
export type { HistParameter as TrendParameter, HistPoint as TrendPoint } from '../historical-data/historical-data.data';

// How strongly each parameter follows the shared room drivers; humidity moves against temperature
export const COUPLING: Record<string, number> = { temperature: 1, humidity: -1, co2: 1 };

export const COMPARE_OPTIONS: DropdownOption[] = [
  { label: 'Previous Period', value: 'previous' },
  { label: 'Same Period Last Month', value: 'month' },
];

export const TREND_ICONS: Record<string, string[]> = {
  ...HIST_ICONS,
  shield: ['M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  link: ['M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1', 'M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1'],
  cycle: ['M20 12a8 8 0 01-14.3 4.9', 'M4 12a8 8 0 0114.3-4.9', 'M18 3v4.5h-4.5', 'M6 21v-4.5h4.5'],
  spike: ['M3 17l5-5 4 4 8-9', 'M15 7h5v5'],
  steady: ['M3 12h4l2-4 4 8 2-4h6'],
};
