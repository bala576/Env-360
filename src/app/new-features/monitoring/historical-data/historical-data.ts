import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragScroll } from '../../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../../shared/dropdown/dropdown';
import {
  CHART_TYPE_OPTIONS,
  HIST_ICONS,
  HIST_PARAMETERS,
  HIST_POINTS,
  HistParameter,
  HistPoint,
  INTERVAL_OPTIONS,
  MAX_COMPARE,
  MAX_RANGE_DAYS,
  QUICK_RANGES,
} from './historical-data.data';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
// Base sampling slot of the simulated sensors
const SLOT = 5 * MINUTE;
const PAGE_SIZE = 5;
const MAX_BUCKETS = 112;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Chart plot area inside its 1400x200 viewBox
const PLOT = { width: 1400, height: 200, left: 64, right: 1336, top: 10, bottom: 158 };

type RecordStatus = 'Normal' | 'Warning' | 'Critical';
type ChartType = 'line' | 'area';

interface Filters {
  site: string;
  building: string;
  floor: string;
  pointId: string;
  params: string[];
  from: string;
  to: string;
  interval: number;
}

interface Sample {
  t: number;
  v: number;
  estimated: boolean;
}

interface Series {
  param: HistParameter;
  samples: Sample[];
  expected: number;
}

interface HistRecord {
  t: number;
  time: string;
  point: string;
  param: HistParameter;
  value: string;
  status: RecordStatus;
  quality: 'Good' | 'Estimated';
  device: string;
  search: string;
}

interface ParamStats {
  param: HistParameter;
  min: Sample | null;
  max: Sample | null;
  avg: number;
  std: number;
  inRange: number;
  excursions: number;
}

interface Kpi {
  label: string;
  value: string;
  sub?: string;
  delta?: { text: string; good: boolean; up: boolean };
  icon: string;
  tone: string;
}

interface ChartAxis {
  min: number;
  max: number;
  ticks: { value: number; y: number }[];
}

interface ChartLine {
  param: HistParameter;
  path: string;
  area: string;
  dots: { x: number; y: number }[];
}

function hash(a: number, b: number): number {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toInputDate(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseInputDate(value: string): number {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

function shortDate(t: number): string {
  const d = new Date(t);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
}

function clock(t: number): string {
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fullDate(t: number): string {
  return `${shortDate(t)} ${new Date(t).getFullYear()}`;
}

function stamp(t: number): string {
  return `${fullDate(t)} ${clock(t)}`;
}

function niceStep(span: number, count: number): number {
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
}

function options(values: string[]): DropdownOption[] {
  return Array.from(new Set(values)).map(v => ({ label: v, value: v }));
}

@Component({
  selector: 'app-historical-data',
  imports: [CommonModule, FormsModule, Dropdown, DragScroll],
  templateUrl: './historical-data.html',
  styleUrl: './historical-data.css',
})
export class HistoricalData {
  icons = HIST_ICONS;
  plot = PLOT;
  intervalOptions = INTERVAL_OPTIONS;
  chartTypeOptions = CHART_TYPE_OPTIONS;
  quickRanges = QUICK_RANGES;
  maxCompare = MAX_COMPARE;

  draft: Filters = {
    site: HIST_POINTS[0].site,
    building: HIST_POINTS[0].building,
    floor: HIST_POINTS[0].floor,
    pointId: HIST_POINTS[0].id,
    params: [...HIST_POINTS[0].parameters],
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
  records: HistRecord[] = [];

  // ---------- Chart ----------
  chartType: ChartType = 'line';
  compare = true;
  expanded = false;
  leftAxis: ChartAxis | null = null;
  rightAxis: ChartAxis | null = null;
  lines: ChartLine[] = [];
  timeTicks: { x: number; date: string; time: string }[] = [];
  thresholdLines: { y: number; color: string }[] = [];
  thresholdBands: { y: number; height: number; color: string }[] = [];
  legend: { label: string; color: string; kind: 'dot' | 'dash' | 'band' }[] = [];
  hover: { x: number; left: number; time: string; values: { label: string; color: string; value: string }[] } | null = null;
  private buckets: { t: number; values: (number | null)[] }[] = [];
  private span = { start: 0, end: 1 };

  // ---------- Records table ----------
  search = '';
  sortDesc = true;
  page = 1;

  constructor() {
    this.compute();
  }

  // ---------- Filter options ----------
  get siteOptions(): DropdownOption[] {
    return options(HIST_POINTS.map(p => p.site));
  }

  get buildingOptions(): DropdownOption[] {
    return options(HIST_POINTS.filter(p => p.site === this.draft.site).map(p => p.building));
  }

  get floorOptions(): DropdownOption[] {
    return options(this.pointsIn(this.draft.site, this.draft.building).map(p => p.floor));
  }

  get pointOptions(): DropdownOption[] {
    return this.pointsIn(this.draft.site, this.draft.building, this.draft.floor).map(p => ({ label: p.name, value: p.id }));
  }

  get draftParams(): HistParameter[] {
    const point = this.point(this.draft.pointId);
    return HIST_PARAMETERS.filter(p => point.parameters.includes(p.key));
  }

  get selectedParamLabels(): HistParameter[] {
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

  get appliedRangeLabel(): string {
    return `${fullDate(parseInputDate(this.applied.from))} - ${fullDate(parseInputDate(this.applied.to))}`;
  }

  get appliedDays(): number {
    return (parseInputDate(this.applied.to) - parseInputDate(this.applied.from)) / DAY + 1;
  }

  get appliedPoint(): HistPoint {
    return this.point(this.applied.pointId);
  }

  onSiteChange(site: string): void {
    this.draft.site = site;
    this.onBuildingChange(this.buildingOptions[0]?.value as string);
  }

  onBuildingChange(building: string): void {
    this.draft.building = building;
    this.onFloorChange(this.floorOptions[0]?.value as string);
  }

  onFloorChange(floor: string): void {
    this.draft.floor = floor;
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

  // ---------- Records table ----------
  get filteredRecords(): HistRecord[] {
    const q = this.search.trim().toLowerCase();
    const rows = q ? this.records.filter(r => r.search.includes(q)) : this.records;
    return this.sortDesc ? rows : [...rows].reverse();
  }

  get pagedRecords(): HistRecord[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredRecords.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRecords.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredRecords.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredRecords.length);
  }

  // Page numbers with null marking an ellipsis gap
  get pageList(): (number | null)[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, 2, 3, 4, 5, total, this.page - 1, this.page, this.page + 1]);
    const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
    const result: (number | null)[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
      result.push(p);
    });
    return result;
  }

  goToPage(page: number): void {
    this.page = Math.min(this.totalPages, Math.max(1, page));
  }

  onSearchChange(): void {
    this.page = 1;
  }

  toggleSort(): void {
    this.sortDesc = !this.sortDesc;
    this.page = 1;
  }

  exportRecords(): void {
    const header = ['Timestamp', 'Monitoring Point', 'Parameter', 'Value', 'Unit', 'Status', 'Data Quality', 'Device ID'];
    const rows = this.filteredRecords.map(r => [r.time, r.point, r.param.label, r.value, r.param.unit, r.status, r.quality, r.device]);
    const csv = [header, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    this.saveFile(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), `${this.fileBase()}.csv`);
  }

  exportChart(svg: Element): void {
    const clone = svg.cloneNode(true) as Element;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('font-family', 'Inter, Arial, sans-serif');
    const markup = new XMLSerializer().serializeToString(clone);
    this.saveFile(new Blob([markup], { type: 'image/svg+xml' }), `${this.fileBase()}-chart.svg`);
  }

  // ---------- Chart ----------
  setChartType(type: ChartType): void {
    this.chartType = type;
  }

  toggleCompare(): void {
    this.compare = !this.compare;
    this.buildChart();
  }

  onChartMove(event: MouseEvent, svg: Element): void {
    if (!this.buckets.length) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PLOT.width;
    if (x < PLOT.left || x > PLOT.right) {
      this.hover = null;
      return;
    }
    const t = this.span.start + ((x - PLOT.left) / (PLOT.right - PLOT.left)) * (this.span.end - this.span.start);
    const step = (this.span.end - this.span.start) / this.buckets.length;
    const index = Math.min(this.buckets.length - 1, Math.max(0, Math.floor((t - this.span.start) / step)));
    const bucket = this.buckets[index];
    const visible = this.compare ? this.series : this.series.slice(0, 1);
    this.hover = {
      x: this.timeX(bucket.t),
      left: (this.timeX(bucket.t) / PLOT.width) * 100,
      time: stamp(bucket.t),
      values: visible.map((s, i) => ({
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
    const params = HIST_PARAMETERS.filter(p => f.params.includes(p.key));
    const start = parseInputDate(f.from);
    const end = parseInputDate(f.to) + DAY;
    const span = end - start;
    this.span = { start, end };

    this.series = params.map(param => this.generate(point, param, start, end, f.interval));
    const previous = params.map(param => this.generate(point, param, start - span, start, f.interval));
    this.stats = this.series.map(s => this.statsFor(s));
    const prevStats = previous.map(s => this.statsFor(s));

    this.records = this.series
      .flatMap(s => s.samples.map(sample => this.toRecord(point, s.param, sample)))
      .sort((a, b) => b.t - a.t || a.param.label.localeCompare(b.param.label));
    this.search = '';
    this.page = 1;

    this.kpis = this.buildKpis(this.series, previous, prevStats);
    this.buildChart();
  }

  private generate(point: HistPoint, param: HistParameter, start: number, end: number, interval: number): Series {
    const step = interval * MINUTE;
    const pIndex = HIST_PARAMETERS.indexOf(param);
    const seed = point.seed * 31 + pIndex * 7;
    const base = param.base + (point.offsets?.[param.key] ?? 0);
    const samples: Sample[] = [];
    let expected = 0;
    for (let t = start; t < end; t += step) {
      expected++;
      const slot = Math.floor(t / SLOT);
      if (hash(slot, seed + 333) < 0.004) continue;
      const hour = new Date(t).getHours() + new Date(t).getMinutes() / 60;
      const daily = Math.sin(((hour - 6) / 24) * Math.PI * 2);
      const slow = Math.sin(slot / 97 + seed);
      let v = base + param.amplitude * (0.6 * daily + 0.4 * slow) + param.noise * (hash(slot, seed) - 0.5) * 2;
      // Rare short excursions above the high threshold (door left open, defrost cycle...)
      if (hash(slot, seed + 99) < 0.0015) v += param.high - base + param.noise * 1.5;
      samples.push({ t, v: +v.toFixed(param.decimals), estimated: hash(slot, seed + 555) < 0.01 });
    }
    return { param, samples, expected };
  }

  private statsFor(series: Series): ParamStats {
    const { samples, param } = series;
    if (!samples.length) return { param, min: null, max: null, avg: 0, std: 0, inRange: 0, excursions: 0 };
    let min = samples[0];
    let max = samples[0];
    let sum = 0;
    let inRange = 0;
    let excursions = 0;
    let outside = false;
    for (const s of samples) {
      if (s.v < min.v) min = s;
      if (s.v > max.v) max = s;
      sum += s.v;
      const ok = s.v >= param.low && s.v <= param.high;
      if (ok) inRange++;
      if (!ok && !outside) excursions++;
      outside = !ok;
    }
    const avg = sum / samples.length;
    const std = Math.sqrt(samples.reduce((acc, s) => acc + (s.v - avg) ** 2, 0) / samples.length);
    return { param, min, max, avg, std, inRange: (inRange / samples.length) * 100, excursions };
  }

  private toRecord(point: HistPoint, param: HistParameter, sample: Sample): HistRecord {
    const range = param.high - param.low;
    const beyond = Math.max(param.low - sample.v, sample.v - param.high, 0);
    const status: RecordStatus = beyond === 0 ? 'Normal' : beyond <= range * 0.1 ? 'Warning' : 'Critical';
    const time = stamp(sample.t);
    const device = `SEN-${param.deviceCode}-${String(point.seed).padStart(3, '0')}`;
    const value = sample.v.toFixed(param.decimals);
    const quality = sample.estimated ? 'Estimated' : 'Good';
    return {
      t: sample.t, time, point: point.name, param, value, status, quality, device,
      search: `${time} ${point.name} ${param.label} ${value} ${status} ${quality} ${device}`.toLowerCase(),
    };
  }

  private buildKpis(series: Series[], previous: Series[], prevStats: ParamStats[]): Kpi[] {
    const count = (list: Series[]) => list.reduce((n, s) => n + s.samples.length, 0);
    const expected = (list: Series[]) => list.reduce((n, s) => n + s.expected, 0);
    const excursions = (stats: ParamStats[]) => stats.reduce((n, s) => n + s.excursions, 0);
    const pct = (now: number, before: number) => (before ? ((now - before) / before) * 100 : now ? 100 : 0);
    const delta = (value: number, upIsGood: boolean) => ({
      text: `${value > 0 ? '+' : ''}${value.toFixed(Math.abs(value) < 10 ? 1 : 0)}%`,
      up: value >= 0,
      good: value === 0 || (value > 0) === upIsGood,
    });

    const records = count(series);
    const prevRecords = count(previous);
    const completeness = expected(series) ? (records / expected(series)) * 100 : 0;
    const prevCompleteness = expected(previous) ? (prevRecords / expected(previous)) * 100 : 0;
    const exc = excursions(this.stats);
    const primary = this.stats[0];
    const p = primary?.param;
    const fmt = (v: number | undefined) => (v === undefined || !p ? '-' : `${v.toFixed(p.decimals)} ${p.unit}`);

    return [
      { label: 'Total Records', value: records.toLocaleString(), delta: delta(pct(records, prevRecords), true), sub: 'vs previous period', icon: 'records', tone: 'blue' },
      { label: `Minimum (${p?.label ?? '-'})`, value: fmt(primary?.min?.v), sub: primary?.min ? stamp(primary.min.t) : undefined, icon: p?.icon ?? 'temperature', tone: 'blue' },
      { label: `Maximum (${p?.label ?? '-'})`, value: fmt(primary?.max?.v), sub: primary?.max ? stamp(primary.max.t) : undefined, icon: p?.icon ?? 'temperature', tone: 'red' },
      { label: `Average (${p?.label ?? '-'})`, value: fmt(primary?.avg), icon: 'bars', tone: 'green' },
      { label: 'Excursions', value: String(exc), delta: delta(pct(exc, excursions(prevStats)), false), sub: 'vs previous period', icon: 'alert', tone: 'red' },
      { label: 'Data Completeness', value: `${completeness.toFixed(1)} %`, delta: delta(completeness - prevCompleteness, true), sub: 'vs previous period', icon: 'pie', tone: 'purple' },
    ];
  }

  private buildChart(): void {
    const visible = this.compare ? this.series : this.series.slice(0, 1);
    const { start, end } = this.span;
    const step = Math.max(this.applied.interval * MINUTE, (end - start) / MAX_BUCKETS);
    const count = Math.ceil((end - start) / step);
    const sums = visible.map(() => Array.from({ length: count }, () => ({ sum: 0, n: 0 })));
    visible.forEach((s, si) =>
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

    const axes = visible.map((s, si) => this.axisFor(s.param, this.buckets.map(b => b.values[si])));
    this.leftAxis = axes[0] ?? null;
    this.rightAxis = axes[1] ?? null;

    const dotEvery = Math.max(1, Math.ceil(count / 120));
    this.lines = visible.map((s, si) => {
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
      const dots: { x: number; y: number }[] = [];
      this.buckets.forEach((b, i) => {
        const v = b.values[si];
        if (v === null) return flush();
        const pt = { x: this.timeX(b.t + step / 2), y: this.valueY(v, axis) };
        run.push(pt);
        if (i % dotEvery === 0) dots.push(pt);
      });
      flush();
      return { param: s.param, path, area, dots };
    });

    // Primary parameter thresholds as dashed lines, secondary as shaded bands
    this.thresholdLines = [];
    this.thresholdBands = [];
    this.legend = visible.map(s => ({ label: `${s.param.label} (${s.param.unit})`, color: s.param.color, kind: 'dot' as const }));
    const primary = visible[0]?.param;
    if (primary && this.leftAxis) {
      this.thresholdLines.push({ y: this.valueY(primary.high, this.leftAxis), color: '#ef4444' }, { y: this.valueY(primary.low, this.leftAxis), color: '#2563eb' });
      this.legend.push(
        { label: `High Threshold (${primary.label})`, color: '#ef4444', kind: 'dash' },
        { label: `Low Threshold (${primary.label})`, color: '#2563eb', kind: 'dash' },
      );
    }
    const secondary = visible[1]?.param;
    if (secondary && this.rightAxis) {
      const highY = this.valueY(secondary.high, this.rightAxis);
      const lowY = this.valueY(secondary.low, this.rightAxis);
      this.thresholdBands.push({ y: PLOT.top, height: Math.max(0, highY - PLOT.top), color: 'rgba(239, 68, 68, 0.08)' });
      this.thresholdBands.push({ y: lowY, height: Math.max(0, PLOT.bottom - lowY), color: 'rgba(37, 99, 235, 0.08)' });
      this.legend.push(
        { label: `High Threshold (${secondary.label})`, color: 'rgba(239, 68, 68, 0.25)', kind: 'band' },
        { label: `Low Threshold (${secondary.label})`, color: 'rgba(37, 99, 235, 0.25)', kind: 'band' },
      );
    }

    this.timeTicks = this.buildTimeTicks(start, end);
    this.hover = null;
  }

  private axisFor(param: HistParameter, values: (number | null)[]): ChartAxis {
    let min: number;
    let max: number;
    if (param.axis) {
      [min, max] = param.axis;
    } else {
      const data = values.filter((v): v is number => v !== null);
      const lo = Math.min(param.low, ...data);
      const hi = Math.max(param.high, ...data);
      const step = niceStep(hi - lo || 1, 5);
      min = Math.floor(lo / step) * step;
      max = Math.ceil(hi / step) * step;
      if (min === lo) min -= step;
      if (max === hi) max += step;
    }
    const step = niceStep(max - min, 5);
    const ticks: { value: number; y: number }[] = [];
    const axis = { min, max, ticks };
    for (let v = min; v <= max + step / 1000; v += step) ticks.push({ value: +v.toFixed(2), y: this.valueY(v, axis) });
    return axis;
  }

  private buildTimeTicks(start: number, end: number): { x: number; date: string; time: string }[] {
    const hours = (end - start) / (60 * MINUTE);
    const steps = [1, 2, 3, 6, 12, 24, 48, 72, 120, 168, 336];
    const stepHours = steps.find(s => hours / s <= 14) ?? 336;
    const ticks = [];
    for (let t = start; t < end; t += stepHours * 60 * MINUTE) {
      ticks.push({ x: this.timeX(t), date: shortDate(t), time: clock(t) });
    }
    return ticks;
  }

  private timeX(t: number): number {
    const { start, end } = this.span;
    return PLOT.left + ((t - start) / (end - start)) * (PLOT.right - PLOT.left);
  }

  private valueY(v: number, axis: { min: number; max: number }): number {
    return PLOT.bottom - ((v - axis.min) / (axis.max - axis.min)) * (PLOT.bottom - PLOT.top);
  }

  private pointsIn(site: string, building?: string, floor?: string): HistPoint[] {
    return HIST_POINTS.filter(p => p.site === site && (!building || p.building === building) && (!floor || p.floor === floor));
  }

  private point(id: string): HistPoint {
    return HIST_POINTS.find(p => p.id === id) ?? HIST_POINTS[0];
  }

  private fileBase(): string {
    return `historical-${this.appliedPoint.name.toLowerCase().replace(/\s+/g, '-')}-${this.applied.from}-to-${this.applied.to}`;
  }

  private saveFile(blob: Blob, name: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url));
  }
}
