// Static mock data for the Analytics & Predictions page. Replace with API calls when available.

export type ParamKey = 'temperature' | 'humidity' | 'co2' | 'waterLevel' | 'energy' | 'occupancy';

export interface ParamMeta {
  key: ParamKey;
  label: string;
  // Short label used in chips and legends
  short: string;
  unit: string;
  icon: string;
  tone: string;
  color: string;
  decimals: number;
}

export interface AnalyticsKpi {
  param: ParamKey;
  value: number;
  change: number;
  // true when a rise is bad news (e.g. water level)
  upIsBad?: boolean;
  spark: number[];
}

export interface Insight {
  title: string;
  text: string;
  icon: string;
  tone: string;
  tag: string;
}

export interface SiteHealth {
  site: string;
  score: number;
  trend: 'up' | 'down';
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const ANALYTICS_ICONS: Record<string, string[]> = {
  thermometer: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  drop: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  cloud: ['M7 18a4 4 0 01-.6-8A6 6 0 0118 9a4.5 4.5 0 01-1 9z'],
  waves: ['M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0', 'M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0', 'M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  export: ['M12 15V3', 'M7 8l5-5 5 5', 'M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4'],
  warning: ['M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z', 'M12 9v4M12 17h.01'],
  fan: ['M12 12a2 2 0 100-.01', 'M12 10c0-4 1-7 4-7s3 4-4 7', 'M14 12c4 0 7 1 7 4s-4 3-7-4', 'M12 14c0 4-1 7-4 7s-3-4 4-7', 'M10 12c-4 0-7-1-7-4s4-3 7 4'],
  door: ['M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17', 'M3 21h18', 'M15 12h.01'],
  monitor: ['M3 12h4l3-8 4 16 3-8h4'],
  check: ['M20 6L9 17l-5-5'],
};

export const PARAMS: Record<ParamKey, ParamMeta> = {
  temperature: { key: 'temperature', label: 'Temperature', short: 'Temperature', unit: '°C', icon: 'thermometer', tone: 'red', color: '#ef4444', decimals: 1 },
  humidity: { key: 'humidity', label: 'Humidity', short: 'Humidity', unit: '%RH', icon: 'drop', tone: 'blue', color: '#2563eb', decimals: 1 },
  co2: { key: 'co2', label: 'CO₂', short: 'CO₂', unit: 'ppm', icon: 'cloud', tone: 'green', color: '#16a34a', decimals: 0 },
  waterLevel: { key: 'waterLevel', label: 'Water Level', short: 'Water Level', unit: 'm', icon: 'waves', tone: 'sky', color: '#0284c7', decimals: 1 },
  energy: { key: 'energy', label: 'Energy', short: 'Energy', unit: 'kWh', icon: 'bolt', tone: 'amber', color: '#f59e0b', decimals: 1 },
  occupancy: { key: 'occupancy', label: 'Occupancy', short: 'Occupancy', unit: '%', icon: 'people', tone: 'pink', color: '#9333ea', decimals: 0 },
};

export const PARAM_ORDER: ParamKey[] = ['temperature', 'humidity', 'co2', 'waterLevel', 'energy', 'occupancy'];

export const ANALYTICS_TABS = ['Overview', 'Environmental Analytics', 'Occupancy Analytics', 'Energy Analytics', 'Predictive Analytics', 'Comparison', 'Custom Reports'];

// Deterministic pseudo-random numbers so the mock charts look the same on every load
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seeded(42);

function wave(count: number, base: number, amp: number, noise: number, drift = 0, phase = 0): number[] {
  return Array.from({ length: count }, (_, i) =>
    base + amp * Math.sin(i / 2.2 + phase) + (rand() - 0.5) * noise + drift * (i / count));
}

export const ANALYTICS_KPIS: AnalyticsKpi[] = [
  { param: 'temperature', value: 22.4, change: -12, spark: wave(24, 22, 0.6, 1.2, 2) },
  { param: 'humidity', value: 56.8, change: 8, spark: wave(24, 54, 2, 3, 4) },
  { param: 'co2', value: 742, change: 15, upIsBad: true, spark: wave(24, 700, 25, 50, 80) },
  { param: 'waterLevel', value: 3.2, change: 18, upIsBad: true, spark: wave(24, 3, 0.08, 0.15, 0.3) },
  { param: 'energy', value: 124.6, change: 10, upIsBad: true, spark: wave(24, 118, 4, 8, 12) },
  { param: 'occupancy', value: 68, change: 5, spark: wave(24, 62, 4, 8, 10) },
];

// Readings every 6 hours for the last 14 days (4 points per day)
export const TREND_DAYS_TOTAL = 14;
export const TREND_POINTS_PER_DAY = 4;
const TREND_COUNT = TREND_DAYS_TOTAL * TREND_POINTS_PER_DAY;

export const TREND_DATA: Record<ParamKey, number[]> = {
  temperature: wave(TREND_COUNT, 24.5, 1.2, 1.2),
  humidity: wave(TREND_COUNT, 54, 2.5, 3, 0, 2.4),
  co2: wave(TREND_COUNT, 720, 60, 80, 0, 0.8),
  waterLevel: wave(TREND_COUNT, 3.1, 0.15, 0.2, 0, 1.6),
  energy: wave(TREND_COUNT, 120, 15, 20, 0, 0.4),
  occupancy: wave(TREND_COUNT, 62, 12, 14, 0, 1.1),
};

// Last day of the data set
export const END_DATE = new Date(2025, 4, 27);

export function dayLabel(offsetFromEnd: number): string {
  const d = new Date(END_DATE);
  d.setDate(d.getDate() - offsetFromEnd);
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`;
}

// ---------- Forecast ----------
export const FORECAST_POINTS_PER_DAY = 2;
export const FORECAST_HISTORY_DAYS = 7;
export const FORECAST_MAX_DAYS = 5;
export const FORECAST_HISTORY: number[] = wave(FORECAST_HISTORY_DAYS * FORECAST_POINTS_PER_DAY, 22.6, 0.5, 1.2);
export const FORECAST: { mean: number; spread: number }[] = Array.from(
  { length: FORECAST_MAX_DAYS * FORECAST_POINTS_PER_DAY },
  (_, i) => ({ mean: 23.4 + 0.25 * Math.sin(i / 1.3) + i * 0.08 + (rand() - 0.5) * 0.8, spread: 0.9 + i * 0.16 }),
);

export const PREDICTION_ACTIONS = [
  { icon: 'fan', label: 'Check HVAC performance' },
  { icon: 'door', label: 'Verify door seals' },
  { icon: 'monitor', label: 'Increase monitoring frequency' },
];

// ---------- Correlation ----------
export const CORRELATION_PARAMS: ParamKey[] = ['occupancy', 'co2', 'temperature', 'humidity', 'energy'];

// Readings sampled across sites; most parameters follow occupancy with varying noise
export const CORRELATION_SAMPLES: Record<ParamKey, number>[] = Array.from({ length: 90 }, () => {
  const occupancy = 5 + rand() * 82;
  return {
    occupancy,
    co2: 380 + occupancy * 11 + (rand() - 0.5) * 360,
    temperature: 21 + occupancy * 0.05 + (rand() - 0.5) * 3,
    humidity: 48 + occupancy * 0.08 + (rand() - 0.5) * 16,
    energy: 60 + occupancy * 0.9 + (rand() - 0.5) * 40,
    waterLevel: 3 + (rand() - 0.5) * 0.4,
  };
});

// ---------- Energy ----------
export const ENERGY_CATEGORIES = [
  { label: 'HVAC', color: '#7c3aed' },
  { label: 'Lighting', color: '#3b82f6' },
  { label: 'Equipment', color: '#fbbf24' },
  { label: 'Others', color: '#a8a8b8' },
];

// Daily kWh per category for the last 14 days
export const ENERGY_DAILY: number[][] = Array.from({ length: 14 }, () => [
  280 + rand() * 160, 150 + rand() * 80, 120 + rand() * 100, 80 + rand() * 90,
]);

// ---------- Insights ----------
export const INSIGHTS: Insight[] = [
  { title: 'Temperature Pattern', text: 'Consistent temperature rise observed between 12:00 – 16:00 across 8 retail stores.', icon: 'thermometer', tone: 'red', tag: 'Pattern' },
  { title: 'CO₂ vs Occupancy', text: 'Strong correlation (R=0.86) between occupancy and CO₂ levels in meeting rooms.', icon: 'cloud', tone: 'green', tag: 'Insight' },
  { title: 'Energy Optimization', text: '15% potential energy savings identified in non-operational hours.', icon: 'bolt', tone: 'amber', tag: 'Opportunity' },
  { title: 'Humidity Anomaly', text: 'Unusual humidity spike detected in Storage Area - 2 on 26 May. Possible HVAC issue.', icon: 'drop', tone: 'blue', tag: 'Anomaly' },
  { title: 'Water Level Prediction', text: 'Manhole 12 predicted to reach 85% capacity within 48 hours based on rainfall forecast.', icon: 'waves', tone: 'sky', tag: 'Prediction' },
];

// ---------- Site comparison ----------
export const COMPARISON_SITES = ['Dubai Mall', 'City Center (Deira)', 'Abu Dhabi Mall', 'Sharjah City Center', 'Ajman Mall'];

// [current, previous] per site
export const SITE_COMPARISON: Partial<Record<ParamKey, [number, number][]>> = {
  temperature: [[22.6, 24.1], [21.8, 23.9], [22.9, 24.4], [23.4, 25.2], [22.1, 24.6]],
  humidity: [[56, 52], [58, 55], [54, 57], [61, 59], [55, 53]],
  co2: [[742, 690], [705, 712], [768, 731], [690, 655], [720, 702]],
  energy: [[124.6, 113.2], [98.4, 101.7], [110.3, 104.8], [87.5, 90.1], [76.2, 72.9]],
  occupancy: [[68, 65], [61, 63], [72, 66], [55, 58], [49, 47]],
};

// ---------- Health score ----------
export const SITE_HEALTH: SiteHealth[] = [
  { site: 'Dubai Mall', score: 92.4, trend: 'up' },
  { site: 'City Center (Deira)', score: 88.1, trend: 'up' },
  { site: 'Abu Dhabi Mall', score: 85.6, trend: 'down' },
  { site: 'Sharjah City Center', score: 90.3, trend: 'up' },
  { site: 'Ajman Mall', score: 82.7, trend: 'down' },
];

// Scores at or above this are "Good", below are "Fair"
export const HEALTH_GOOD = 88;
