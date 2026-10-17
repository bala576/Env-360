import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownOption } from '../../../shared/dropdown/dropdown';
import {
  Axis,
  DAY,
  MINUTE,
  SLOT,
  fixedAxis,
  fullDate,
  hash,
  niceAxis,
  options,
  pad,
  parseInputDate,
  pearson,
  scale,
  signed,
  stamp,
  timeTicks,
  toInputDate,
} from '../shared/chart-utils';
import {
  AGGREGATION_OPTIONS,
  CHART_TYPE_OPTIONS,
  COMPARE_OPTIONS,
  COUPLING,
  MAX_COMPARE,
  MAX_RANGE_DAYS,
  QUICK_RANGES,
  TREND_ICONS,
  TREND_PARAMETERS,
  TREND_POINTS,
  TrendParameter,
  TrendPoint,
} from './trend-analysis.data';

const MAX_BUCKETS = 140;
const SPARK_SLICES = 16;
const SCATTER_POINTS = 110;
// Plot areas inside each chart's viewBox
const PLOT = { width: 1400, height: 210, left: 64, right: 1336, top: 26, bottom: 164 };
const BAR = { width: 460, height: 230, left: 46, right: 446, top: 18, bottom: 186 };
const SCATTER = { width: 460, height: 230, left: 50, right: 446, top: 12, bottom: 186 };
const SPARK = { width: 100, height: 30 };

type ChartType = 'line' | 'area';
type CompareMode = 'previous' | 'month';

interface Filters {
  site: string;
  building: string;
  pointId: string;
  params: string[];
  from: string;
  to: string;
  interval: number;
}

interface Sample {
  t: number;
  v: number;
}

interface Series {
  param: TrendParameter;
  samples: Sample[];
  expected: number;
}

interface ParamStats {
  param: TrendParameter;
  avg: number;
  max: Sample | null;
  latest: Sample | null;
  inRange: number;
  outside: number;
}

interface Kpi {
  label: string;
  value: string;
  delta: { text: string; up: boolean; good: boolean };
  icon: string;
  tone: string;
  spark: { line: string; area: string; color: string };
}

interface ChartLine {
  param: TrendParameter;
  path: string;
  area: string;
}

interface TrendEvent {
  x: number;
  time: string;
  label: string;
}

interface Insight {
  icon: string;
  tone: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-trend-analysis',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './trend-analysis.html',
  styleUrl: './trend-analysis.css',
})
export class TrendAnalysis {
  icons = TREND_ICONS;
  plot = PLOT;
  bar = BAR;
  scatter = SCATTER;
  aggregationOptions = AGGREGATION_OPTIONS;
  chartTypeOptions = CHART_TYPE_OPTIONS;
  compareOptions = COMPARE_OPTIONS;
  quickRanges = QUICK_RANGES;
  maxCompare = MAX_COMPARE;

  draft: Filters = {
    site: TREND_POINTS[0].site,
    building: TREND_POINTS[0].building,
    pointId: TREND_POINTS[0].id,
    params: [...TREND_POINTS[0].parameters],
    from: '2026-10-01',
    to: '2026-10-07',
    interval: 15,
  };
  applied: Filters = structuredClone(this.draft);

  paramMenuOpen = false;
  dateOpen = false;

  // ---------- Results ----------
  series: Series[] = [];
  stats: ParamStats[] = [];
  kpis: Kpi[] = [];
  insights: Insight[] = [];

  // ---------- Trend chart ----------
  chartType: ChartType = 'line';
  showThresholds = true;
  showEvents = true;
  expanded = false;
  leftAxis: Axis | null = null;
  rightAxis: Axis | null = null;
  lines: ChartLine[] = [];
  timeTicks: { x: number; date: string; time: string }[] = [];
  thresholdLines: { y: number; color: string }[] = [];
  thresholdBands: { y: number; height: number; color: string }[] = [];
  events: TrendEvent[] = [];
  hover: { x: number; left: number; time: string; values: { label: string; color: string; value: string }[] } | null = null;
  private buckets: { t: number; values: (number | null)[] }[] = [];
  private span = { start: 0, end: 1 };

  // ---------- Comparison ----------
  compareWith: CompareMode = 'previous';
  barAxis: Axis = niceAxis(0, 1);
  barWidth = 38;
  barGroups: { label: string; x: number; bars: { x: number; y: number; height: number; value: string; labelY: number; current: boolean }[] }[] = [];

  // ---------- Correlation ----------
  correlation: number | null = null;
  scatterX: Axis = niceAxis(0, 1);
  scatterY: Axis = niceAxis(0, 1);
  scatterDots: { x: number; y: number }[] = [];
  regression: { x1: number; y1: number; x2: number; y2: number } | null = null;

  constructor() {
    this.compute();
  }

  // ---------- Filter options ----------
  get siteOptions(): DropdownOption[] {
    return options(TREND_POINTS.map(p => p.site));
  }

  get buildingOptions(): DropdownOption[] {
    return options(TREND_POINTS.filter(p => p.site === this.draft.site).map(p => p.building));
  }

  get pointOptions(): DropdownOption[] {
    return TREND_POINTS
      .filter(p => p.site === this.draft.site && p.building === this.draft.building)
      .map(p => ({ label: p.name, value: p.id }));
  }

  get draftParams(): TrendParameter[] {
    const point = this.point(this.draft.pointId);
    return TREND_PARAMETERS.filter(p => point.parameters.includes(p.key));
  }

  get selectedParamLabels(): TrendParameter[] {
    return this.draftParams.filter(p => this.draft.params.includes(p.key));
  }

  get dateError(): string | null {
    const { from, to } = this.draft;
    if (!from || !to) return 'Select a start and end date.';
    const days = (parseInputDate(to) - parseInputDate(from)) / DAY + 1;
    if (days < 1) return 'End date must be on or after the start date.';
    if (days > MAX_RANGE_DAYS) return `Date range can be at most ${MAX_RANGE_DAYS} days.`;
    return null;
  }

  get canApply(): boolean {
    return !this.dateError && this.draft.params.length > 0;
  }

  get dirty(): boolean {
    return JSON.stringify(this.draft) !== JSON.stringify(this.applied);
  }

  get dateLabel(): string {
    return `${fullDate(parseInputDate(this.draft.from))} - ${fullDate(parseInputDate(this.draft.to))}`;
  }

  get appliedDays(): number {
    return (parseInputDate(this.applied.to) - parseInputDate(this.applied.from)) / DAY + 1;
  }

  get appliedPoint(): TrendPoint {
    return this.point(this.applied.pointId);
  }

  get correlationText(): string {
    return this.correlation === null ? '-' : this.correlation.toFixed(2);
  }

  onSiteChange(site: string): void {
    this.draft.site = site;
    this.onBuildingChange(this.buildingOptions[0]?.value as string);
  }

  onBuildingChange(building: string): void {
    this.draft.building = building;
    this.onPointChange(this.pointOptions[0]?.value as string);
  }

  onPointChange(id: string): void {
    this.draft.pointId = id;
    const available = this.point(id).parameters;
    const kept = this.draft.params.filter(p => available.includes(p));
    this.draft.params = kept.length ? kept : available.slice(0, MAX_COMPARE);
  }

  toggleParam(key: string): void {
    const params = this.draft.params;
    const i = params.indexOf(key);
    if (i >= 0) params.splice(i, 1);
    else if (params.length < MAX_COMPARE) params.push(key);
  }

  removeParam(key: string, event: Event): void {
    event.stopPropagation();
    this.draft.params = this.draft.params.filter(p => p !== key);
  }

  apply(): void {
    if (!this.canApply) return;
    this.applied = structuredClone(this.draft);
    this.dateOpen = this.paramMenuOpen = false;
    this.compute();
  }

  setQuickRange(days: number): void {
    const end = parseInputDate(this.applied.to);
    this.draft = { ...structuredClone(this.applied), from: toInputDate(end - (days - 1) * DAY) };
    this.apply();
  }

  setCompare(mode: CompareMode): void {
    this.compareWith = mode;
    this.buildComparison();
  }

  toggleThresholds(): void {
    this.showThresholds = !this.showThresholds;
  }

  toggleEvents(): void {
    this.showEvents = !this.showEvents;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.paramMenuOpen && !target.closest('.param-select')) this.paramMenuOpen = false;
    if (this.dateOpen && !target.closest('.date-field')) this.dateOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.expanded = this.dateOpen = this.paramMenuOpen = false;
  }

  onChartMove(event: MouseEvent, svg: Element): void {
    if (!this.buckets.length) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PLOT.width;
    if (x < PLOT.left || x > PLOT.right) {
      this.hover = null;
      return;
    }
    const index = Math.min(this.buckets.length - 1, Math.max(0, Math.floor(((x - PLOT.left) / (PLOT.right - PLOT.left)) * this.buckets.length)));
    const bucket = this.buckets[index];
    const step = (this.span.end - this.span.start) / this.buckets.length;
    const bx = this.timeX(bucket.t + step / 2);
    this.hover = {
      x: bx,
      left: (bx / PLOT.width) * 100,
      time: stamp(bucket.t),
      values: this.series.map((s, i) => ({
        label: s.param.label,
        color: s.param.color,
        value: bucket.values[i] === null ? 'No data' : `${bucket.values[i]!.toFixed(s.param.decimals)} ${s.param.unit}`,
      })),
    };
  }

  // ---------- Computation ----------
  private compute(): void {
    const f = this.applied;
    const point = this.point(f.pointId);
    const params = TREND_PARAMETERS.filter(p => f.params.includes(p.key));
    const start = parseInputDate(f.from);
    const end = parseInputDate(f.to) + DAY;
    this.span = { start, end };

    this.series = params.map(param => this.generate(point, param, start, end, f.interval));
    this.stats = this.series.map(s => this.statsFor(s));
    const previous = params.map(param => this.generate(point, param, 2 * start - end, start, f.interval));

    this.kpis = this.buildKpis(previous);
    this.buildChart();
    this.buildComparison();
    this.buildCorrelation();
    this.insights = this.buildInsights();
  }

  private generate(point: TrendPoint, param: TrendParameter, start: number, end: number, interval: number): Series {
    const step = interval * MINUTE;
    const seed = point.seed * 31 + TREND_PARAMETERS.indexOf(param) * 7;
    // Drivers shared by every parameter of a point, so related parameters move together
    const room = point.seed * 13;
    const coupling = COUPLING[param.key] ?? 1;
    const base = param.base + (point.offsets?.[param.key] ?? 0);
    const samples: Sample[] = [];
    let expected = 0;
    for (let t = start; t < end; t += step) {
      expected++;
      const slot = Math.floor(t / SLOT);
      if (hash(slot, seed + 333) < 0.004) continue;
      const hour = new Date(t).getHours() + new Date(t).getMinutes() / 60;
      const daily = Math.sin(((hour - 8) / 24) * Math.PI * 2);
      const slow = Math.sin(slot / 97 + room);
      const wobble = hash(Math.floor(slot / 6), room) - 0.5;
      let v = base + coupling * param.amplitude * (0.5 * daily + 0.3 * slow + 0.7 * wobble) + param.noise * (hash(slot, seed) - 0.5) * 2;
      // Rare short excursions (door left open, defrost cycle...) push past the threshold
      if (hash(slot, room + 99) < 0.003) v += coupling > 0 ? param.high - base + param.noise * 1.5 : -param.amplitude * 2.5;
      samples.push({ t, v: +v.toFixed(param.decimals) });
    }
    return { param, samples, expected };
  }

  private statsFor(series: Series): ParamStats {
    const { samples, param } = series;
    if (!samples.length) return { param, avg: 0, max: null, latest: null, inRange: 0, outside: 0 };
    let max = samples[0];
    let sum = 0;
    let outside = 0;
    for (const s of samples) {
      if (s.v > max.v) max = s;
      sum += s.v;
      if (s.v < param.low || s.v > param.high) outside++;
    }
    return {
      param,
      avg: sum / samples.length,
      max,
      latest: samples.at(-1)!,
      inRange: ((samples.length - outside) / samples.length) * 100,
      outside,
    };
  }

  // Splits the applied span into equal slices and reduces each one to a number
  private slices(series: Series, reduce: (samples: Sample[], expected: number) => number | null): number[] {
    const { start, end } = this.span;
    const size = (end - start) / SPARK_SLICES;
    const groups: Sample[][] = Array.from({ length: SPARK_SLICES }, () => []);
    series.samples.forEach(s => groups[Math.min(SPARK_SLICES - 1, Math.floor((s.t - start) / size))].push(s));
    const expected = series.expected / SPARK_SLICES;
    return groups.map(g => reduce(g, expected)).filter((v): v is number => v !== null);
  }

  private spark(values: number[], color: string): Kpi['spark'] {
    if (values.length < 2) return { line: '', area: '', color };
    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;
    const pts = values.map((v, i) => `${((i / (values.length - 1)) * SPARK.width).toFixed(1)},${(SPARK.height - 3 - ((v - min) / range) * (SPARK.height - 6)).toFixed(1)}`);
    return { line: `M${pts.join('L')}`, area: `M0,${SPARK.height}L${pts.join('L')}L${SPARK.width},${SPARK.height}Z`, color };
  }

  private buildKpis(previous: Series[]): Kpi[] {
    const prevStats = previous.map(s => this.statsFor(s));
    const average = (list: Sample[]) => (list.length ? list.reduce((n, s) => n + s.v, 0) / list.length : null);
    // A parameter delta is "good" when the average moved toward the middle of its acceptable band
    const paramDelta = (now: ParamStats, before: ParamStats | undefined) => {
      const diff = now.avg - (before?.avg ?? now.avg);
      const mid = (now.param.low + now.param.high) / 2;
      return {
        text: `${signed(diff, now.param.decimals)} ${now.param.unit}`,
        up: diff >= 0,
        good: Math.abs(now.avg - mid) <= Math.abs((before?.avg ?? now.avg) - mid),
      };
    };

    const kpis: Kpi[] = this.stats.map((s, i) => ({
      label: s.param.label,
      value: s.latest ? `${s.latest.v.toFixed(s.param.decimals)} ${s.param.unit}` : '-',
      delta: paramDelta(s, prevStats[i]),
      icon: s.param.icon,
      tone: s.param.tone,
      spark: this.spark(this.slices(this.series[i], average), s.param.color),
    }));

    const primary = this.stats[0];
    if (primary) {
      kpis.push({
        label: `Average ${primary.param.label}`,
        value: `${primary.avg.toFixed(primary.param.decimals)} ${primary.param.unit}`,
        delta: paramDelta(primary, prevStats[0]),
        icon: 'bars',
        tone: 'green',
        spark: this.spark(this.slices(this.series[0], average), primary.param.color),
      });
    }

    const completeness = (list: Series[]) => {
      const expected = list.reduce((n, s) => n + s.expected, 0);
      return expected ? (list.reduce((n, s) => n + s.samples.length, 0) / expected) * 100 : 0;
    };
    const now = completeness(this.series);
    const diff = now - completeness(previous);
    kpis.push({
      label: 'Data Completeness',
      value: `${now.toFixed(1)} %`,
      delta: { text: `${signed(diff, 1)} %`, up: diff >= 0, good: diff >= 0 },
      icon: 'shield',
      tone: 'green',
      spark: this.spark(this.slices(this.series[0], (g, expected) => (g.length / expected) * 100), '#2563eb'),
    });

    const violations = this.countViolations(this.series);
    const before = this.countViolations(previous);
    const change = before ? ((violations - before) / before) * 100 : violations ? 100 : 0;
    kpis.push({
      label: 'Threshold Violations',
      value: String(violations),
      delta: { text: `${signed(change, 0)}%`, up: change >= 0, good: change <= 0 },
      icon: 'alert',
      tone: 'red',
      spark: this.spark(
        this.slices(this.series[0], g => g.filter(s => s.v < this.series[0].param.low || s.v > this.series[0].param.high).length),
        '#ef4444',
      ),
    });
    return kpis;
  }

  // Number of separate excursions (runs of readings outside the acceptable band)
  private countViolations(list: Series[]): number {
    return list.reduce((n, s) => n + this.excursions(s).length, 0);
  }

  private excursions(series: Series): Sample[] {
    const peaks: Sample[] = [];
    let current: Sample | null = null;
    const { low, high } = series.param;
    for (const s of series.samples) {
      const out = s.v < low || s.v > high;
      if (!out) {
        if (current) peaks.push(current);
        current = null;
        continue;
      }
      const distance = (x: Sample) => Math.max(low - x.v, x.v - high);
      if (!current || distance(s) > distance(current)) current = s;
    }
    if (current) peaks.push(current);
    return peaks;
  }

  private buildChart(): void {
    const { start, end } = this.span;
    const step = Math.max(this.applied.interval * MINUTE, (end - start) / MAX_BUCKETS);
    const count = Math.ceil((end - start) / step);
    const sums = this.series.map(() => Array.from({ length: count }, () => ({ sum: 0, n: 0 })));
    this.series.forEach((s, si) =>
      s.samples.forEach(sample => {
        const cell = sums[si][Math.min(count - 1, Math.floor((sample.t - start) / step))];
        cell.sum += sample.v;
        cell.n++;
      }),
    );
    this.buckets = Array.from({ length: count }, (_, i) => ({
      t: start + i * step,
      values: sums.map(list => (list[i].n ? list[i].sum / list[i].n : null)),
    }));

    const axes = this.series.map((s, si) => this.axisFor(s.param, this.buckets.map(b => b.values[si])));
    this.leftAxis = axes[0] ?? null;
    this.rightAxis = axes[1] ?? null;

    this.lines = this.series.map((s, si) => {
      const axis = axes[si];
      let path = '';
      let area = '';
      let run: { x: number; y: number }[] = [];
      const flush = () => {
        if (!run.length) return;
        path += run.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
        area += `M${run[0].x.toFixed(1)},${PLOT.bottom}` + run.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + `L${run.at(-1)!.x.toFixed(1)},${PLOT.bottom}Z`;
        run = [];
      };
      this.buckets.forEach(b => {
        const v = b.values[si];
        if (v === null) return flush();
        run.push({ x: this.timeX(b.t + step / 2), y: this.valueY(v, axis) });
      });
      flush();
      return { param: s.param, path, area };
    });

    // Primary parameter thresholds as dashed lines, secondary as shaded bands
    this.thresholdLines = [];
    this.thresholdBands = [];
    const primary = this.series[0]?.param;
    if (primary && this.leftAxis) {
      this.thresholdLines.push({ y: this.valueY(primary.high, this.leftAxis), color: '#ef4444' }, { y: this.valueY(primary.low, this.leftAxis), color: '#2563eb' });
    }
    const secondary = this.series[1]?.param;
    if (secondary && this.rightAxis) {
      const highY = this.valueY(secondary.high, this.rightAxis);
      const lowY = this.valueY(secondary.low, this.rightAxis);
      this.thresholdBands.push({ y: PLOT.top, height: Math.max(0, highY - PLOT.top), color: 'rgba(239, 68, 68, 0.1)' });
      this.thresholdBands.push({ y: lowY, height: Math.max(0, PLOT.bottom - lowY), color: 'rgba(37, 99, 235, 0.08)' });
    }

    this.events = this.series
      .flatMap(s => this.excursions(s).map(peak => ({ t: peak.t, label: `${s.param.label} ${peak.v.toFixed(s.param.decimals)} ${s.param.unit}` })))
      .sort((a, b) => a.t - b.t)
      .map(e => ({ x: this.timeX(e.t), time: stamp(e.t), label: e.label }));

    this.timeTicks = timeTicks(start, end, t => this.timeX(t));
    this.hover = null;
  }

  get legend(): { label: string; color: string; kind: 'dot' | 'dash' | 'band' | 'event' }[] {
    const items: { label: string; color: string; kind: 'dot' | 'dash' | 'band' | 'event' }[] = this.series.map(s => ({
      label: `${s.param.label} (${s.param.unit})`,
      color: s.param.color,
      kind: 'dot',
    }));
    const [primary, secondary] = this.series.map(s => s.param);
    if (this.showThresholds && primary) {
      items.push(
        { label: `High Threshold (${primary.label})`, color: '#ef4444', kind: 'dash' },
        { label: `Low Threshold (${primary.label})`, color: '#2563eb', kind: 'dash' },
      );
    }
    if (this.showThresholds && secondary) {
      items.push(
        { label: `High Threshold (${secondary.label})`, color: 'rgba(239, 68, 68, 0.25)', kind: 'band' },
        { label: `Low Threshold (${secondary.label})`, color: 'rgba(37, 99, 235, 0.25)', kind: 'band' },
      );
    }
    if (this.showEvents) items.push({ label: 'Threshold Violation', color: '#ef4444', kind: 'event' });
    return items;
  }

  private buildComparison(): void {
    if (!this.series.length) {
      this.barGroups = [];
      return;
    }
    const point = this.appliedPoint;
    const { start, end } = this.span;
    const shift = this.compareWith === 'previous' ? end - start : 30 * DAY;
    const pairs = this.series.map(s => {
      const before = this.statsFor(this.generate(point, s.param, start - shift, end - shift, this.applied.interval));
      return { param: s.param, values: [this.stats.find(st => st.param === s.param)!.avg, before.avg] };
    });

    const all = pairs.flatMap(p => p.values);
    this.barAxis = niceAxis(Math.min(0, ...all), Math.max(0, ...all), 4);
    const axis = this.barAxis;
    const y = (v: number) => scale(v, axis, BAR.bottom, BAR.top);
    const zero = y(0);
    const groupWidth = (BAR.right - BAR.left) / pairs.length;
    const barWidth = (this.barWidth = Math.min(38, groupWidth / 3.2));

    this.barGroups = pairs.map((p, gi) => {
      const center = BAR.left + groupWidth * (gi + 0.5);
      return {
        label: `${p.param.label} (${p.param.unit})`,
        x: center,
        bars: p.values.map((v, bi) => {
          const top = Math.min(y(v), zero);
          return {
            x: center + (bi === 0 ? -barWidth - 4 : 4),
            y: top,
            height: Math.max(1, Math.abs(y(v) - zero)),
            value: v.toFixed(p.param.decimals),
            labelY: v >= 0 ? top - 6 : top + Math.abs(y(v) - zero) + 13,
            current: bi === 0,
          };
        }),
      };
    });
  }

  barY(value: number): number {
    return scale(value, this.barAxis, BAR.bottom, BAR.top);
  }

  private buildCorrelation(): void {
    this.correlation = null;
    this.scatterDots = [];
    this.regression = null;
    if (this.series.length < 2) return;

    const [a, b] = this.series;
    const other = new Map(b.samples.map(s => [s.t, s.v]));
    const pairs = a.samples.filter(s => other.has(s.t)).map(s => [s.v, other.get(s.t)!] as const);
    if (pairs.length < 3) return;

    const r = pearson(pairs);
    if (r === null) return;
    this.correlation = r;
    const n = pairs.length;
    const mx = pairs.reduce((sum, p) => sum + p[0], 0) / n;
    const my = pairs.reduce((sum, p) => sum + p[1], 0) / n;
    let sxy = 0;
    let sxx = 0;
    for (const [x, y] of pairs) {
      sxy += (x - mx) * (y - my);
      sxx += (x - mx) ** 2;
    }

    // Plot a thinned sample so the scatter stays readable on long ranges
    const every = Math.max(1, Math.ceil(n / SCATTER_POINTS));
    const shown = pairs.filter((_, i) => i % every === 0);
    const xs = shown.map(p => p[0]);
    const ys = shown.map(p => p[1]);
    this.scatterX = niceAxis(Math.min(...xs), Math.max(...xs), 5);
    this.scatterY = niceAxis(Math.min(...ys), Math.max(...ys), 5);
    const sx = (v: number) => scale(v, this.scatterX, SCATTER.left, SCATTER.right);
    const sy = (v: number) => scale(v, this.scatterY, SCATTER.bottom, SCATTER.top);
    this.scatterDots = shown.map(([x, y]) => ({ x: sx(x), y: sy(y) }));

    const slope = sxx ? sxy / sxx : 0;
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    this.regression = { x1: sx(lo), y1: sy(my + slope * (lo - mx)), x2: sx(hi), y2: sy(my + slope * (hi - mx)) };
  }

  scatterXPos(v: number): number {
    return scale(v, this.scatterX, SCATTER.left, SCATTER.right);
  }

  scatterYPos(v: number): number {
    return scale(v, this.scatterY, SCATTER.bottom, SCATTER.top);
  }

  private buildInsights(): Insight[] {
    const insights: Insight[] = [];
    const primary = this.stats[0];
    if (primary?.max) {
      const p = primary.param;
      const spike = primary.max.v > p.high;
      insights.push({
        icon: spike ? 'spike' : 'temperature',
        tone: 'red',
        title: spike ? `${p.label} spike detected` : `Peak ${p.label.toLowerCase()}`,
        text: `${p.label} reached ${primary.max.v.toFixed(p.decimals)} ${p.unit} on ${stamp(primary.max.t)}`,
      });
    }

    if (this.correlation !== null && this.series.length > 1) {
      const r = this.correlation;
      const strength = Math.abs(r) >= 0.7 ? 'Strong' : Math.abs(r) >= 0.4 ? 'Moderate' : 'Weak';
      const [a, b] = this.series.map(s => s.param.label);
      insights.push({
        icon: 'link',
        tone: 'amber',
        title: `${strength} ${r < 0 ? 'negative' : 'positive'} correlation`,
        text: `${b} tends to ${r < 0 ? 'fall' : 'rise'} when ${a.toLowerCase()} rises (r = ${r.toFixed(2)})`,
      });
    }

    if (this.stats.length) {
      const inRange = this.stats.reduce((n, s) => n + s.inRange, 0) / this.stats.length;
      const names = this.stats.map(s => s.param.label.toLowerCase()).join(' and ');
      insights.push({
        icon: inRange >= 95 ? 'steady' : 'alert',
        tone: inRange >= 95 ? 'blue' : 'amber',
        title: inRange >= 95 ? 'Stable trend' : 'Frequent excursions',
        text: `${names[0].toUpperCase() + names.slice(1)} ${this.stats.length > 1 ? 'were' : 'was'} within normal range for ${inRange.toFixed(1)}% of the time`,
      });
    }

    // Daily cycle: the two-hour window with the highest average reading
    const cyclic = this.series[1] ?? this.series[0];
    if (cyclic?.samples.length) {
      const sums = Array.from({ length: 24 }, () => ({ sum: 0, n: 0 }));
      cyclic.samples.forEach(s => {
        const cell = sums[new Date(s.t).getHours()];
        cell.sum += s.v;
        cell.n++;
      });
      const avg = sums.map(c => (c.n ? c.sum / c.n : -Infinity));
      let peak = 0;
      for (let h = 1; h < 24; h++) if (avg[h] + avg[(h + 1) % 24] > avg[peak] + avg[(peak + 1) % 24]) peak = h;
      insights.push({
        icon: 'cycle',
        tone: 'purple',
        title: 'Cyclic pattern',
        text: `Daily peak ${cyclic.param.label.toLowerCase()} observed at ${pad(peak)}:00 - ${pad((peak + 2) % 24)}:00`,
      });
    }
    return insights;
  }

  private axisFor(param: TrendParameter, values: (number | null)[]): Axis {
    if (param.axis) return fixedAxis(param.axis[0], param.axis[1]);
    const data = values.filter((v): v is number => v !== null);
    return niceAxis(Math.min(param.low, ...data), Math.max(param.high, ...data), 5);
  }

  axisY(v: number, axis: Axis): number {
    return this.valueY(v, axis);
  }

  private timeX(t: number): number {
    const { start, end } = this.span;
    return PLOT.left + ((t - start) / (end - start)) * (PLOT.right - PLOT.left);
  }

  private valueY(v: number, axis: { min: number; max: number }): number {
    return scale(v, axis, PLOT.bottom, PLOT.top);
  }

  private point(id: string): TrendPoint {
    return TREND_POINTS.find(p => p.id === id) ?? TREND_POINTS[0];
  }
}
