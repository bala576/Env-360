import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ANALYTICS_ICONS,
  ANALYTICS_KPIS,
  ANALYTICS_TABS,
  AnalyticsKpi,
  COMPARISON_SITES,
  CORRELATION_PARAMS,
  CORRELATION_SAMPLES,
  ENERGY_CATEGORIES,
  ENERGY_DAILY,
  FORECAST,
  FORECAST_HISTORY,
  FORECAST_HISTORY_DAYS,
  FORECAST_POINTS_PER_DAY,
  HEALTH_GOOD,
  INSIGHTS,
  PARAMS,
  PARAM_ORDER,
  PREDICTION_ACTIONS,
  ParamKey,
  SITE_COMPARISON,
  SITE_HEALTH,
  TREND_DATA,
  TREND_POINTS_PER_DAY,
  dayLabel,
} from './analytics.data';

// Plot area shared by the wide charts (440x200 viewBox) and the narrow ones (400x200)
const WIDE = { left: 38, right: 400, top: 10, bottom: 172 };
const NARROW = { left: 40, right: 388, top: 10, bottom: 168 };

interface Axis {
  min: number;
  max: number;
  ticks: { y: number; value: number; label: string }[];
  scale: (v: number) => number;
}

// Round a range out to ~4-5 gridlines at 1/2/2.5/5 x 10^n steps
function niceAxis(values: number[], top: number, bottom: number, fromZero = false, steps = 5): Axis {
  let lo = fromZero ? 0 : Math.min(...values);
  let hi = Math.max(...values);
  if (hi === lo) hi = lo + 1;
  const raw = (hi - lo) / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) ?? raw;
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  const scale = (v: number) => bottom - ((v - lo) / (hi - lo)) * (bottom - top);
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) {
    ticks.push({ y: scale(v), value: v, label: Number(v.toFixed(2)).toLocaleString('en-US') });
  }
  return { min: lo, max: hi, ticks, scale };
}

function toPoints(pts: { x: number; y: number }[]): string {
  return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, FormsModule, Dropdown, DragScroll],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics {

  icons = ANALYTICS_ICONS;
  params = PARAMS;
  tabs = ANALYTICS_TABS;
  activeTab = ANALYTICS_TABS[0];
  wide = WIDE;
  narrow = NARROW;

  // ---------- Filters (edited as a draft, applied with the Apply button) ----------
  siteOptions: DropdownOption[] = [{ label: 'Dubai Mall', value: 'Dubai Mall' }];
  buildingOptions: DropdownOption[] = ['All Buildings', 'Building A', 'Building B', 'Building C'].map((l, i) => ({ label: l, value: i ? l : 'all' }));
  spaceTypeOptions: DropdownOption[] = ['All Types', 'Retail', 'Office', 'Cold Storage', 'Technical', 'Parking'].map((l, i) => ({ label: l, value: i ? l : 'all' }));
  parameterOptions: DropdownOption[] = [
    { label: 'All Parameters', value: 'all' },
    { label: 'Temperature, Humidity, CO₂', value: 'environment' },
    { label: 'Water Level, Energy', value: 'utilities' },
    { label: 'Occupancy', value: 'occupancy' },
  ];
  timeRangeOptions: DropdownOption[] = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 14 Days', value: 14 },
  ];
  compareOptions: DropdownOption[] = [
    { label: 'Previous Period', value: 'previous' },
    { label: 'Same Period Last Year', value: 'year' },
  ];

  draft = { site: 'Dubai Mall', building: 'all', spaceType: 'all', parameter: 'all', range: 7, compare: 'previous' };
  applied = { ...this.draft };

  private readonly paramGroups: Record<string, ParamKey[]> = {
    all: PARAM_ORDER,
    environment: ['temperature', 'humidity', 'co2'],
    utilities: ['waterLevel', 'energy'],
    occupancy: ['occupancy'],
  };

  get filtersDirty(): boolean {
    return JSON.stringify(this.draft) !== JSON.stringify(this.applied);
  }

  apply(): void {
    this.applied = { ...this.draft };
    this.trendRange = this.applied.range;
    this.energyRange = this.applied.range;
    if (!this.visibleParams.includes(this.trendParam)) this.trendParam = this.visibleParams[0];
  }

  get visibleParams(): ParamKey[] {
    return this.paramGroups[this.applied.parameter];
  }

  // ---------- KPIs ----------
  get kpis(): AnalyticsKpi[] {
    return ANALYTICS_KPIS.filter(k => this.visibleParams.includes(k.param));
  }

  kpiChange(kpi: AnalyticsKpi): number {
    // Year-on-year swings are wider than period-on-period ones in the mock data
    return this.applied.compare === 'year' ? Math.round(kpi.change * 1.6) : kpi.change;
  }

  get compareLabel(): string {
    if (this.applied.compare === 'year') return 'vs last year';
    return this.applied.range === 7 ? 'vs last week' : 'vs prev. 14 days';
  }

  kpiTone(kpi: AnalyticsKpi): string {
    return (this.kpiChange(kpi) > 0) === !!kpi.upIsBad ? 'bad' : 'good';
  }

  sparkline(kpi: AnalyticsKpi): { line: string; area: string } {
    const min = Math.min(...kpi.spark);
    const max = Math.max(...kpi.spark);
    const pts = kpi.spark.map((v, i) => ({ x: (i / (kpi.spark.length - 1)) * 100, y: 28 - ((v - min) / (max - min || 1)) * 24 }));
    const line = toPoints(pts);
    return { line, area: `0,30 ${line} 100,30` };
  }

  formatValue(param: ParamKey, value: number): string {
    return value.toFixed(PARAMS[param].decimals);
  }

  // ---------- Parameter trends ----------
  trendParam: ParamKey = 'temperature';
  trendRange = 7;

  // Humidity is the comparison line, unless it is the selected parameter
  get trendSecondary(): ParamKey {
    return this.trendParam === 'humidity' ? 'temperature' : 'humidity';
  }

  get trendChart() {
    const count = this.trendRange * TREND_POINTS_PER_DAY;
    const primary = TREND_DATA[this.trendParam].slice(-count);
    const secondary = TREND_DATA[this.trendSecondary].slice(-count);
    const left = niceAxis(primary, WIDE.top, WIDE.bottom, false, 5);
    const right = niceAxis(secondary, WIDE.top, WIDE.bottom, false, 5);
    const x = (i: number) => WIDE.left + 6 + (i / (count - 1)) * (WIDE.right - WIDE.left - 12);
    const pPts = primary.map((v, i) => ({ x: x(i), y: left.scale(v) }));
    const sPts = secondary.map((v, i) => ({ x: x(i), y: right.scale(v) }));
    const every = this.trendRange > 7 ? 2 : 1;
    const days = Array.from({ length: this.trendRange }, (_, d) => d)
      .filter(d => (this.trendRange - 1 - d) % every === 0)
      .map(d => ({ x: x(d * TREND_POINTS_PER_DAY + (TREND_POINTS_PER_DAY - 1) / 2), label: dayLabel(this.trendRange - 1 - d) }));
    return {
      left, right, days,
      primary: { meta: PARAMS[this.trendParam], points: toPoints(pPts), dots: pPts.filter((_, i) => i % 2 === 1) },
      secondary: {
        meta: PARAMS[this.trendSecondary], points: toPoints(sPts), dots: sPts.filter((_, i) => i % 2 === 1),
        area: `${x(0).toFixed(1)},${WIDE.bottom} ${toPoints(sPts)} ${x(count - 1).toFixed(1)},${WIDE.bottom}`,
      },
    };
  }

  // ---------- Forecast ----------
  forecastDays = 3;
  forecastOptions: DropdownOption[] = [
    { label: 'Next 3 Days', value: 3 },
    { label: 'Next 5 Days', value: 5 },
  ];
  predictionActions = PREDICTION_ACTIONS;

  get forecastChart() {
    const history = FORECAST_HISTORY;
    const future = FORECAST.slice(0, this.forecastDays * FORECAST_POINTS_PER_DAY);
    const total = history.length + future.length;
    const axis = niceAxis([...history, ...future.map(f => f.mean + f.spread), ...future.map(f => f.mean - f.spread)], WIDE.top, WIDE.bottom, false, 5);
    const x = (i: number) => WIDE.left + 6 + (i / (total - 1)) * (WIDE.right - WIDE.left - 12);
    const hPts = history.map((v, i) => ({ x: x(i), y: axis.scale(v) }));
    const last = hPts[hPts.length - 1];
    const fPts = future.map((f, i) => ({ x: x(history.length + i), y: axis.scale(f.mean) }));
    const upper = future.map((f, i) => ({ x: x(history.length + i), y: axis.scale(f.mean + f.spread) }));
    const lower = future.map((f, i) => ({ x: x(history.length + i), y: axis.scale(f.mean - f.spread) })).reverse();
    const days = FORECAST_HISTORY_DAYS + this.forecastDays;
    const every = days > 10 ? 2 : 1;
    return {
      axis,
      history: toPoints(hPts),
      historyDots: hPts,
      forecast: toPoints([last, ...fPts]),
      forecastDots: fPts,
      band: toPoints([last, ...upper, ...lower, last]),
      divider: last.x,
      days: Array.from({ length: days }, (_, d) => d)
        .filter(d => d % every === 0)
        .map(d => ({ x: x(d * FORECAST_POINTS_PER_DAY), label: dayLabel(FORECAST_HISTORY_DAYS - 1 - d) })),
    };
  }

  // ---------- Correlation ----------
  correlationOptions: DropdownOption[] = CORRELATION_PARAMS.map(p => ({ label: PARAMS[p].label, value: p }));
  corrX: ParamKey = 'occupancy';
  corrY: ParamKey = 'co2';

  get correlation() {
    const xs = CORRELATION_SAMPLES.map(s => s[this.corrX]);
    const ys = CORRELATION_SAMPLES.map(s => s[this.corrY]);
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0, syy = 0;
    xs.forEach((xv, i) => {
      sxy += (xv - mx) * (ys[i] - my);
      sxx += (xv - mx) ** 2;
      syy += (ys[i] - my) ** 2;
    });
    const r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 1;
    const slope = sxx ? sxy / sxx : 0;

    const yAxis = niceAxis(ys, NARROW.top, NARROW.bottom, false, 4);
    const xAxis = niceAxis(xs, NARROW.left, NARROW.right, false, 5);
    // niceAxis maps to a vertical range; flip it for the horizontal axis
    const sx = (v: number) => NARROW.left + ((v - xAxis.min) / (xAxis.max - xAxis.min)) * (NARROW.right - NARROW.left);
    const xTicks = xAxis.ticks.map(t => ({ label: t.label, x: sx(t.value) }));
    const fit = (v: number) => my + slope * (v - mx);
    const abs = Math.abs(r);
    const strength = abs >= 0.7 ? 'Strong' : abs >= 0.4 ? 'Moderate' : abs >= 0.2 ? 'Weak' : 'No';
    return {
      r: r.toFixed(2),
      strength: strength === 'No' ? 'No Correlation' : `${strength} ${r >= 0 ? 'Positive' : 'Negative'}`,
      tone: abs >= 0.7 ? 'strong' : abs >= 0.4 ? 'moderate' : 'weak',
      yAxis, xTicks,
      dots: xs.map((xv, i) => ({ x: sx(xv), y: yAxis.scale(ys[i]) })),
      line: { x1: sx(xAxis.min), y1: yAxis.scale(fit(xAxis.min)), x2: sx(xAxis.max), y2: yAxis.scale(fit(xAxis.max)) },
    };
  }

  // ---------- Energy ----------
  energyCategories = ENERGY_CATEGORIES;
  energyRange = 7;
  energyRangeOptions = this.timeRangeOptions;

  get energyChart() {
    const days = ENERGY_DAILY.slice(-this.energyRange);
    const axis = niceAxis(days.map(d => d.reduce((a, b) => a + b, 0)), NARROW.top, NARROW.bottom, true, 5);
    const slot = (NARROW.right - NARROW.left) / days.length;
    const width = Math.min(18, slot * 0.55);
    const every = days.length > 7 ? 2 : 1;
    return {
      axis,
      bars: days.map((values, i) => {
        let y = NARROW.bottom;
        const segments = values.map((v, c) => {
          const h = NARROW.bottom - axis.scale(v);
          y -= h;
          return { y, h, color: ENERGY_CATEGORIES[c].color };
        });
        const label = dayLabel(days.length - 1 - i);
        return {
          x: NARROW.left + slot * i + (slot - width) / 2,
          cx: NARROW.left + slot * i + slot / 2,
          width, segments,
          label: (days.length - 1 - i) % every === 0 ? label : '',
          tooltip: `${label}: ` + values.map((v, c) => `${ENERGY_CATEGORIES[c].label} ${Math.round(v)} kWh`).join(', '),
        };
      }),
    };
  }

  // ---------- Insights ----------
  insights = INSIGHTS;

  // ---------- Site comparison ----------
  comparisonParam: ParamKey = 'temperature';
  comparisonOptions: DropdownOption[] = (Object.keys(SITE_COMPARISON) as ParamKey[]).map(p => ({ label: PARAMS[p].label, value: p }));

  get comparisonChart() {
    const data = SITE_COMPARISON[this.comparisonParam] ?? [];
    const axis = niceAxis(data.flat(), WIDE.top, 128, true, 4);
    const slot = (WIDE.right - WIDE.left) / data.length;
    const width = Math.min(16, slot * 0.22);
    const meta = PARAMS[this.comparisonParam];
    return {
      axis,
      groups: data.map(([current, previous], i) => {
        const cx = WIDE.left + slot * i + slot / 2;
        const site = COMPARISON_SITES[i];
        return {
          cx,
          lines: this.wrapLabel(site),
          current: { x: cx - width - 1, y: axis.scale(current), h: 128 - axis.scale(current), width },
          previous: { x: cx + 1, y: axis.scale(previous), h: 128 - axis.scale(previous), width },
          tooltip: `${site} — Current: ${current} ${meta.unit}, Previous: ${previous} ${meta.unit}`,
        };
      }),
    };
  }

  // Split a site name over at most two lines for the x axis
  private wrapLabel(label: string): string[] {
    if (label.length <= 12) return [label];
    const words = label.split(' ');
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }

  // ---------- Health score ----------
  healthFilter = 'all';
  healthOptions: DropdownOption[] = [
    { label: 'All Sites', value: 'all' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
  ];

  get healthRows() {
    return SITE_HEALTH
      .map(s => ({ ...s, good: s.score >= HEALTH_GOOD }))
      .filter(s => this.healthFilter === 'all' || (this.healthFilter === 'good') === s.good);
  }

  // ---------- Export ----------
  exportCsv(): void {
    const count = this.applied.range * TREND_POINTS_PER_DAY;
    const keys = this.visibleParams;
    const header = ['Date', 'Time', ...keys.map(k => `${PARAMS[k].label} (${PARAMS[k].unit})`)];
    const rows = Array.from({ length: count }, (_, i) => {
      const day = this.applied.range - 1 - Math.floor(i / TREND_POINTS_PER_DAY);
      const hour = (i % TREND_POINTS_PER_DAY) * (24 / TREND_POINTS_PER_DAY);
      return [dayLabel(day) + ' 2025', `${String(hour).padStart(2, '0')}:00`,
        ...keys.map(k => this.formatValue(k, TREND_DATA[k].slice(-count)[i]))];
    });
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${this.applied.site.toLowerCase().replace(/\s+/g, '-')}-last-${this.applied.range}-days.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
