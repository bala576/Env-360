import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownOption } from '../../../shared/dropdown/dropdown';
import {
  Axis,
  DAY,
  HOUR,
  MINUTE,
  exportCsv,
  exportSvg,
  fixedAxis,
  fullDate,
  options,
  parseInputDate,
  pearson,
  scale,
  signed,
  stamp,
  timeTicks,
  toInputDate,
} from '../shared/chart-utils';
import { Sample, simulate } from '../shared/sensor-sim';
import { AGGREGATION_OPTIONS, MAX_RANGE_DAYS, QUICK_RANGES } from '../trend-analysis/trend-analysis.data';
import {
  MAX_PARAMS,
  MP_CHART_OPTIONS,
  MP_COMPARE_OPTIONS,
  MP_ICONS,
  MP_PARAMETERS,
  MP_POINTS,
  MpParameter,
  MpPoint,
} from './multi-parameter.data';

const MAX_BUCKETS = 168;
const SPARK_SLICES = 16;
const SPARK = { width: 100, height: 30 };
const CHART = { width: 1400, left: 64, axisGap: 58, laneHeight: 16, laneGap: 6, top: 12, plotHeight: 135, footer: 40 };

type ChartType = 'combo' | 'line';
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

interface Series {
  param: MpParameter;
  samples: Sample[];
}

interface Kpi {
  param: MpParameter;
  label: string;
  value: string;
  delta?: { text: string; up: boolean; tone: 'good' | 'bad' | 'neutral' };
  notes?: { text: string; color: string }[];
  spark: { line: string; area: string; color: string };
}

interface Plot {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface ChartAxis extends Axis {
  param: MpParameter | null;
  x: number;
  side: 'left' | 'right';
}

interface ChartLine {
  param: MpParameter;
  path: string;
}

interface ChartBars {
  param: MpParameter;
  width: number;
  bars: { x: number; y: number; height: number }[];
}

interface ChartLane {
  param: MpParameter;
  y: number;
  path: string;
  area: string;
}

interface CompareRow {
  param: MpParameter;
  label: string;
  current: number;
  previous: number;
  change: number;
  changePct: number;
  min: number;
  max: number;
  unit: string;
  tone: 'good' | 'bad' | 'neutral';
}

interface Insight {
  icon: string;
  tone: string;
  title: string;
  text: string;
  params: string[];
}

@Component({
  selector: 'app-multi-parameter',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './multi-parameter.html',
  styleUrl: './multi-parameter.css',
})
export class MultiParameter {
  icons = MP_ICONS;
  intervalOptions = AGGREGATION_OPTIONS;
  chartOptions = MP_CHART_OPTIONS;
  compareOptions = MP_COMPARE_OPTIONS;
  quickRanges = QUICK_RANGES;
  maxParams = MAX_PARAMS;

  draft: Filters = {
    site: MP_POINTS[0].site,
    building: MP_POINTS[0].building,
    pointId: MP_POINTS[0].id,
    params: ['temperature', 'humidity', 'door', 'energy'],
    from: '2026-10-01',
    to: '2026-10-07',
    interval: 15,
  };
  applied: Filters = structuredClone(this.draft);

  paramMenuOpen = false;
  dateOpen = false;

  // ---------- Results ----------
  series: Series[] = [];
  kpis: Kpi[] = [];
  rows: CompareRow[] = [];
  matrix: { param: MpParameter; cells: (number | null)[] }[] = [];
  insights: Insight[] = [];
  focus: string[] | null = null;

  // ---------- Chart ----------
  chartType: ChartType = 'combo';
  normalize = false;
  showEvents = true;
  expanded = false;
  plot: Plot = { width: CHART.width, height: 300, left: CHART.left, right: CHART.width - CHART.left, top: 40, bottom: 250 };
  axes: ChartAxis[] = [];
  lines: ChartLine[] = [];
  barSets: ChartBars[] = [];
  lanes: ChartLane[] = [];
  thresholdLines: { y: number; color: string }[] = [];
  timeTicks: { x: number; date: string; time: string }[] = [];
  events: { x: number; time: string; label: string }[] = [];
  hover: { x: number; left: number; time: string; values: { label: string; color: string; value: string }[] } | null = null;
  private buckets: { t: number; values: (number | null)[] }[] = [];
  private span = { start: 0, end: 1 };
  private step = HOUR;
  // Data range per series, used when values are normalised to 0-100 %
  private ranges: { min: number; max: number }[] = [];

  compareWith: CompareMode = 'previous';

  constructor() {
    this.compute();
  }

  // ---------- Filter options ----------
  get siteOptions(): DropdownOption[] {
    return options(MP_POINTS.map(p => p.site));
  }

  get buildingOptions(): DropdownOption[] {
    return options(MP_POINTS.filter(p => p.site === this.draft.site).map(p => p.building));
  }

  get pointOptions(): DropdownOption[] {
    return MP_POINTS.filter(p => p.site === this.draft.site && p.building === this.draft.building).map(p => ({ label: p.name, value: p.id }));
  }

  get draftParams(): MpParameter[] {
    const point = this.point(this.draft.pointId);
    return MP_PARAMETERS.filter(p => point.parameters.includes(p.key));
  }

  get selectedParamLabels(): MpParameter[] {
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

  get appliedPoint(): MpPoint {
    return this.point(this.applied.pointId);
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
    this.draft.params = kept.length ? kept : available.slice(0, 4);
  }

  toggleParam(key: string): void {
    const params = this.draft.params;
    const i = params.indexOf(key);
    if (i >= 0) params.splice(i, 1);
    else if (params.length < MAX_PARAMS) params.push(key);
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

  setChartType(type: ChartType): void {
    this.chartType = type;
    this.buildChart();
  }

  toggleNormalize(): void {
    this.normalize = !this.normalize;
    this.buildChart();
  }

  setCompare(mode: CompareMode): void {
    this.compareWith = mode;
    this.rows = this.buildRows();
  }

  toggleFocus(insight: Insight): void {
    const same = this.focus && this.focus.join() === insight.params.join();
    this.focus = same ? null : insight.params;
  }

  isFocused(insight: Insight): boolean {
    return !!this.focus && this.focus.join() === insight.params.join();
  }

  dimmed(param: MpParameter): boolean {
    return !!this.focus && !this.focus.includes(param.key);
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
    this.focus = null;
  }

  // ---------- Export ----------
  exportChart(svg: Element): void {
    exportSvg(svg, `${this.fileBase()}-chart.svg`);
  }

  exportRows(): void {
    const header = ['Parameter', 'Current (Avg)', 'Previous (Avg)', 'Change', 'Change %', 'Min', 'Max', 'Unit'];
    const data = this.rows.map(r => {
      const d = r.param.decimals || 1;
      return [r.label, r.current.toFixed(d), r.previous.toFixed(d), signed(r.change, d), `${signed(r.changePct, 1)}%`, r.min.toFixed(d), r.max.toFixed(d), r.unit];
    });
    exportCsv(header, data, `${this.fileBase()}-comparison.csv`);
  }

  // ---------- Tooltip ----------
  onChartMove(event: MouseEvent, svg: Element): void {
    if (!this.buckets.length) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * this.plot.width;
    if (x < this.plot.left || x > this.plot.right) {
      this.hover = null;
      return;
    }
    const index = Math.min(this.buckets.length - 1, Math.max(0, Math.floor(((x - this.plot.left) / (this.plot.right - this.plot.left)) * this.buckets.length)));
    const bucket = this.buckets[index];
    const bx = this.timeX(bucket.t + this.step / 2);
    this.hover = {
      x: bx,
      left: (bx / this.plot.width) * 100,
      time: stamp(bucket.t),
      values: this.series.map((s, i) => ({ label: s.param.label, color: s.param.color, value: this.formatBucket(s.param, bucket.values[i]) })),
    };
  }

  private formatBucket(param: MpParameter, v: number | null): string {
    if (v === null) return 'No data';
    if (param.kind === 'state') {
      const [on, off] = param.states!;
      return v === 0 ? off : `${on} ${(v * 100).toFixed(0)}% of the time`;
    }
    return `${v.toFixed(param.decimals)} ${param.unit}`;
  }

  // ---------- Computation ----------
  private compute(): void {
    const f = this.applied;
    const point = this.point(f.pointId);
    const params = MP_PARAMETERS.filter(p => f.params.includes(p.key));
    const start = parseInputDate(f.from);
    const end = parseInputDate(f.to) + DAY;
    this.span = { start, end };
    this.focus = null;

    this.series = params.map(param => this.generate(point, param, start, end, f.interval));
    const previous = params.map(param => this.generate(point, param, 2 * start - end, start, f.interval));

    this.kpis = this.series.map((s, i) => this.buildKpi(s, previous[i]));
    this.rows = this.buildRows();
    this.matrix = this.buildMatrix();
    this.buildChart();
    this.insights = this.buildInsights();
  }

  private generate(point: MpPoint, param: MpParameter, start: number, end: number, interval: number): Series {
    return { param, samples: simulate(point, param, start, end, interval) };
  }

  // Average of a series; energy is reported as consumption per day
  private summary(series: Series): { avg: number; min: number; max: number } {
    const { param, samples } = series;
    if (!samples.length) return { avg: 0, min: 0, max: 0 };
    if (param.kind === 'bar') {
      const days = new Map<number, number>();
      const hours = this.applied.interval / 60;
      samples.forEach(s => {
        const day = Math.floor((s.t - this.span.start) / DAY);
        days.set(day, (days.get(day) ?? 0) + s.v * hours);
      });
      const totals = [...days.values()];
      return { avg: totals.reduce((n, v) => n + v, 0) / totals.length, min: Math.min(...totals), max: Math.max(...totals) };
    }
    const values = samples.map(s => s.v * (param.kind === 'state' ? 100 : 1));
    return { avg: values.reduce((n, v) => n + v, 0) / values.length, min: Math.min(...values), max: Math.max(...values) };
  }

  private slices(series: Series, start: number, end: number): number[] {
    const size = (end - start) / SPARK_SLICES;
    const groups = Array.from({ length: SPARK_SLICES }, () => ({ sum: 0, n: 0 }));
    series.samples.forEach(s => {
      const g = groups[Math.min(SPARK_SLICES - 1, Math.max(0, Math.floor((s.t - start) / size)))];
      g.sum += s.v;
      g.n++;
    });
    return groups.filter(g => g.n).map(g => g.sum / g.n);
  }

  private spark(values: number[], color: string, stepped = false): Kpi['spark'] {
    if (values.length < 2) return { line: '', area: '', color };
    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;
    const pts = values.map((v, i) => ({ x: (i / (values.length - 1)) * SPARK.width, y: SPARK.height - 3 - ((v - min) / range) * (SPARK.height - 6) }));
    const line = stepped
      ? pts.map((p, i) => (i ? `H${p.x.toFixed(1)}V${p.y.toFixed(1)}` : `M${p.x.toFixed(1)},${p.y.toFixed(1)}`)).join('')
      : pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
    return { line, area: `${line}V${SPARK.height}H0Z`, color };
  }

  private buildKpi(series: Series, previous: Series): Kpi {
    const { param, samples } = series;
    const now = this.summary(series);
    const before = this.summary(previous);
    const spark = this.spark(this.slices(series, this.span.start, this.span.end), param.color, param.kind === 'state');
    const latest = samples.at(-1);

    if (param.kind === 'state') {
      const [on, off] = param.states!;
      const onPct = now.avg;
      if (param.key === 'defrost') {
        const cycles = samples.filter((s, i) => s.v === 1 && samples[i - 1]?.v !== 1).length;
        return { param, label: param.label, value: latest?.v ? on : off, notes: [{ text: `${cycles} events`, color: '#9ca3af' }], spark };
      }
      return {
        param,
        label: param.label,
        value: latest?.v ? on : off,
        notes: [
          { text: `${(100 - onPct).toFixed(1)}% ${off.toLowerCase()}`, color: '#16a34a' },
          { text: `${onPct.toFixed(1)}% ${on.toLowerCase()}`, color: '#ef4444' },
        ],
        spark,
      };
    }

    if (param.kind === 'bar') {
      const pct = before.avg ? ((now.avg - before.avg) / before.avg) * 100 : 0;
      return {
        param,
        label: `${param.label} Consumption`,
        value: `${now.avg.toFixed(param.decimals)} ${param.unit}`,
        delta: { text: `${signed(pct, 0)}%`, up: pct >= 0, tone: pct <= 0 ? 'good' : 'bad' },
        spark,
      };
    }

    const diff = now.avg - before.avg;
    const mid = (param.low! + param.high!) / 2;
    return {
      param,
      label: param.label,
      value: latest ? `${latest.v.toFixed(param.decimals)} ${param.unit}` : '-',
      delta: {
        text: `${signed(diff, param.decimals)} ${param.unit}`,
        up: diff >= 0,
        tone: Math.abs(now.avg - mid) <= Math.abs(before.avg - mid) ? 'good' : 'bad',
      },
      spark,
    };
  }

  private buildRows(): CompareRow[] {
    const point = this.appliedPoint;
    const { start, end } = this.span;
    const shift = this.compareWith === 'previous' ? end - start : 30 * DAY;
    return this.series.map(s => {
      const now = this.summary(s);
      const before = this.summary(this.generate(point, s.param, start - shift, end - shift, this.applied.interval));
      const change = now.avg - before.avg;
      const p = s.param;
      // Lower is better for energy use and door openings; readings are judged against their band
      let tone: CompareRow['tone'] = 'neutral';
      if (p.key === 'energy' || p.key === 'door') tone = change <= 0 ? 'good' : 'bad';
      else if (p.kind === 'line') tone = Math.abs(now.avg - (p.low! + p.high!) / 2) <= Math.abs(before.avg - (p.low! + p.high!) / 2) ? 'good' : 'bad';
      return {
        param: p,
        label: p.kind === 'state' ? `${p.label} (${p.states![0]} %)` : `${p.label} (${p.unit})`,
        current: now.avg,
        previous: before.avg,
        change,
        changePct: before.avg ? (change / Math.abs(before.avg)) * 100 : 0,
        min: now.min,
        max: now.max,
        unit: p.unit,
        tone,
      };
    });
  }

  private buildMatrix(): { param: MpParameter; cells: (number | null)[] }[] {
    const maps = this.series.map(s => new Map(s.samples.map(x => [x.t, x.v])));
    return this.series.map((a, i) => ({
      param: a.param,
      cells: this.series.map((_, j) => {
        if (i === j) return 1;
        const other = maps[j];
        return pearson(a.samples.filter(x => other.has(x.t)).map(x => [x.v, other.get(x.t)!] as const));
      }),
    }));
  }

  cellColor(r: number | null): string {
    if (r === null) return '#f3f4f6';
    // Diverging scale: blue for negative, white at zero, red for positive
    const t = Math.min(1, Math.abs(r));
    const [cr, cg, cb] = r < 0 ? [37, 99, 235] : [239, 68, 68];
    const mix = (c: number) => Math.round(255 + (c - 255) * t);
    return `rgb(${mix(cr)}, ${mix(cg)}, ${mix(cb)})`;
  }

  private buildChart(): void {
    const { start, end } = this.span;
    const step = (this.step = Math.max(this.applied.interval * MINUTE, (end - start) / MAX_BUCKETS));
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
    this.ranges = this.series.map((s, si) => {
      const values = this.buckets.map(b => b.values[si]).filter((v): v is number => v !== null);
      return values.length ? { min: Math.min(...values), max: Math.max(...values) } : { min: 0, max: 1 };
    });

    // Layout: on/off lanes sit above the plot, one value axis per numeric parameter (up to three)
    const states = this.series.filter(s => s.param.kind === 'state');
    const numeric = this.series.filter(s => s.param.kind !== 'state');
    const axisParams = this.normalize ? [] : numeric.slice(0, 3).map(s => s.param);
    const rightAxes = this.normalize ? 0 : Math.max(0, axisParams.length - 1);
    const top = CHART.top + states.length * (CHART.laneHeight + CHART.laneGap) + (states.length ? 6 : 0);
    const bottom = top + CHART.plotHeight;
    const right = CHART.width - CHART.left - Math.max(0, rightAxes - 1) * CHART.axisGap;
    this.plot = { width: CHART.width, height: bottom + CHART.footer, left: CHART.left, right, top, bottom };

    this.axes = this.normalize
      ? [{ ...fixedAxis(0, 100), param: null, x: CHART.left, side: 'left' }]
      : axisParams.map((p, i) => ({
          ...fixedAxis(p.axis[0], p.axis[1], 5),
          param: p,
          x: i === 0 ? CHART.left : right + (i - 1) * CHART.axisGap,
          side: i === 0 ? 'left' : 'right',
        }));

    const y = (si: number, v: number) => this.valueY(si, v);
    this.lines = [];
    this.barSets = [];
    numeric.forEach(s => {
      const si = this.series.indexOf(s);
      if (s.param.kind === 'bar' && this.chartType === 'combo') {
        const width = Math.max(1.5, ((right - CHART.left) / count) * 0.6);
        const base = this.plot.bottom;
        const bars = this.buckets
          .map(b => b.values[si] === null ? null : { x: this.timeX(b.t + step / 2) - width / 2, y: y(si, b.values[si]!), height: base - y(si, b.values[si]!) })
          .filter((b): b is { x: number; y: number; height: number } => !!b && b.height > 0);
        this.barSets.push({ param: s.param, width, bars });
        return;
      }
      let path = '';
      let open = false;
      this.buckets.forEach(b => {
        const v = b.values[si];
        if (v === null) {
          open = false;
          return;
        }
        path += `${open ? 'L' : 'M'}${this.timeX(b.t + step / 2).toFixed(1)},${y(si, v).toFixed(1)}`;
        open = true;
      });
      this.lines.push({ param: s.param, path });
    });

    this.lanes = states.map((s, li) => {
      const si = this.series.indexOf(s);
      const laneTop = CHART.top + li * (CHART.laneHeight + CHART.laneGap);
      const laneBottom = laneTop + CHART.laneHeight;
      let path = '';
      this.buckets.forEach((b, i) => {
        const v = b.values[si] ?? 0;
        const ly = laneBottom - v * CHART.laneHeight;
        const x0 = this.timeX(b.t);
        path += i ? `H${x0.toFixed(1)}V${ly.toFixed(1)}` : `M${x0.toFixed(1)},${ly.toFixed(1)}`;
      });
      path += `H${this.timeX(end).toFixed(1)}`;
      return { param: s.param, y: laneTop, path, area: `${path}V${laneBottom}H${this.timeX(start).toFixed(1)}Z` };
    });

    // High/low limits of the first continuous reading
    this.thresholdLines = [];
    const primary = this.series.findIndex(s => s.param.kind === 'line');
    if (primary >= 0) {
      const p = this.series[primary].param;
      this.thresholdLines = [
        { y: y(primary, p.high!), color: '#ef4444' },
        { y: y(primary, p.low!), color: '#2563eb' },
      ].filter(l => l.y >= top && l.y <= bottom);
    }

    this.events = this.series
      .filter(s => s.param.kind === 'line')
      .flatMap(s => this.excursions(s).map(peak => ({ t: peak.t, label: `${s.param.label} ${peak.v.toFixed(s.param.decimals)} ${s.param.unit}` })))
      .sort((a, b) => a.t - b.t)
      .map(e => ({ x: this.timeX(e.t), time: stamp(e.t), label: e.label }));

    this.timeTicks = timeTicks(start, end, t => this.timeX(t));
    this.hover = null;
  }

  get legend(): { label: string; color: string; kind: 'dot' | 'dash' | 'square' | 'event' }[] {
    const items: { label: string; color: string; kind: 'dot' | 'dash' | 'square' | 'event' }[] = this.series.map(s => ({
      label: s.param.kind === 'state' ? `${s.param.label} (${s.param.states!.join('/')})` : `${s.param.label} (${s.param.unit})`,
      color: s.param.color,
      kind: s.param.kind === 'bar' && this.chartType === 'combo' ? 'square' : 'dot',
    }));
    const primary = this.series.find(s => s.param.kind === 'line')?.param;
    if (primary && this.thresholdLines.length) {
      items.push(
        { label: `High Threshold (${primary.label})`, color: '#ef4444', kind: 'dash' },
        { label: `Low Threshold (${primary.label})`, color: '#2563eb', kind: 'dash' },
      );
    }
    if (this.showEvents && this.events.length) items.push({ label: 'Threshold Violation', color: '#ef4444', kind: 'event' });
    return items;
  }

  axisY(v: number, axis: Axis): number {
    return scale(v, axis, this.plot.bottom, this.plot.top);
  }

  // Value position for series si, on its own axis or on the shared 0-100 % axis when normalised
  private valueY(si: number, v: number): number {
    const param = this.series[si].param;
    if (this.normalize) {
      const r = this.ranges[si];
      return scale(((v - r.min) / (r.max - r.min || 1)) * 100, { min: 0, max: 100 }, this.plot.bottom, this.plot.top);
    }
    const axis = this.axes.find(a => a.param === param) ?? { min: param.axis[0], max: param.axis[1] };
    return Math.min(this.plot.bottom, Math.max(this.plot.top, scale(v, axis, this.plot.bottom, this.plot.top)));
  }

  private excursions(series: Series): Sample[] {
    const { low, high } = series.param;
    const peaks: Sample[] = [];
    let current: Sample | null = null;
    const distance = (x: Sample) => Math.max(low! - x.v, x.v - high!);
    for (const s of series.samples) {
      if (distance(s) <= 0) {
        if (current) peaks.push(current);
        current = null;
      } else if (!current || distance(s) > distance(current)) {
        current = s;
      }
    }
    if (current) peaks.push(current);
    return peaks;
  }

  private buildInsights(): Insight[] {
    const insights: Insight[] = [];
    const pairs: { a: MpParameter; b: MpParameter; r: number }[] = [];
    this.matrix.forEach((row, i) =>
      row.cells.forEach((r, j) => {
        if (j > i && r !== null) pairs.push({ a: row.param, b: this.matrix[j].param, r });
      }),
    );
    const strength = (r: number) => (Math.abs(r) >= 0.7 ? 'Strong' : Math.abs(r) >= 0.4 ? 'Moderate' : 'Weak');

    const positive = [...pairs].sort((x, y) => y.r - x.r)[0];
    if (positive && positive.r > 0.2) {
      insights.push({
        icon: 'link',
        tone: 'sky',
        title: `${strength(positive.r)} ${positive.a.label}-${positive.b.label} Correlation`,
        text: `${positive.b.label} increases when ${positive.a.label.toLowerCase()} rises (r = ${positive.r.toFixed(2)})`,
        params: [positive.a.key, positive.b.key],
      });
    }

    const negative = [...pairs].sort((x, y) => x.r - y.r)[0];
    if (negative && negative.r < -0.2) {
      insights.push({
        icon: negative.b.icon,
        tone: 'purple',
        title: `Inverse ${negative.a.label}-${negative.b.label} Relationship`,
        text: `${negative.b.label} decreases as ${negative.a.label.toLowerCase()} rises (r = ${negative.r.toFixed(2)})`,
        params: [negative.a.key, negative.b.key],
      });
    }

    const door = this.series.find(s => s.param.key === 'door');
    const energy = this.series.find(s => s.param.key === 'energy');
    if (door && energy) {
      const open = new Map(door.samples.map(s => [s.t, s.v]));
      const split = { open: { sum: 0, n: 0 }, closed: { sum: 0, n: 0 } };
      energy.samples.forEach(s => {
        if (!open.has(s.t)) return;
        const g = open.get(s.t) ? split.open : split.closed;
        g.sum += s.v;
        g.n++;
      });
      if (split.open.n && split.closed.n) {
        const lift = ((split.open.sum / split.open.n) / (split.closed.sum / split.closed.n) - 1) * 100;
        insights.push({
          icon: 'door',
          tone: 'green',
          title: 'Door Open Events Impact Energy',
          text: `Energy consumption is ${Math.abs(lift).toFixed(0)}% ${lift >= 0 ? 'higher' : 'lower'} during door open periods`,
          params: ['door', 'energy'],
        });
      }
    }

    const readings = this.series.filter(s => s.param.kind === 'line');
    if (readings.length) {
      const share = readings.reduce((n, s) => n + s.samples.filter(x => x.v >= s.param.low! && x.v <= s.param.high!).length / (s.samples.length || 1), 0) / readings.length;
      const stable = share >= 0.9;
      insights.push({
        icon: stable ? 'steady' : 'alert',
        tone: stable ? 'blue' : 'amber',
        title: stable ? 'Stable Operating Conditions' : 'Frequent Excursions',
        text: `Parameters are within normal range for ${(share * 100).toFixed(0)}% of the time`,
        params: readings.map(s => s.param.key),
      });
    }
    return insights;
  }

  private timeX(t: number): number {
    const { start, end } = this.span;
    return this.plot.left + ((t - start) / (end - start)) * (this.plot.right - this.plot.left);
  }

  private point(id: string): MpPoint {
    return MP_POINTS.find(p => p.id === id) ?? MP_POINTS[0];
  }

  private fileBase(): string {
    return `multi-parameter-${this.appliedPoint.name.toLowerCase().replace(/\s+/g, '-')}-${this.applied.from}-to-${this.applied.to}`;
  }
}
