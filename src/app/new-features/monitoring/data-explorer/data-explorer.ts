import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
  scale,
  stamp,
  timeTicks,
} from '../shared/chart-utils';
import { Sample, isEstimated, simulate } from '../shared/sensor-sim';
import { MAX_PARAMS, MP_PARAMETERS, MP_POINTS, MpParameter, MpPoint } from '../multi-parameter/multi-parameter.data';
import { AGGREGATION_OPTIONS, MAX_RANGE_DAYS } from '../trend-analysis/trend-analysis.data';
import {
  DATA_SOURCES,
  DOOR_FILTER_OPTIONS,
  DoorFilter,
  EXPLORER_ICONS,
  PAGE_SIZE,
  QUERY_TEMPLATES,
  RangeFilter,
  SAVED_QUERIES_KEY,
  VISUALIZATION_OPTIONS,
  Visualization,
} from './data-explorer.data';

const MAX_BUCKETS = 180;
const MIN_ZOOM = 2 * HOUR;
const CHART = { width: 1400, left: 64, axisGap: 58, laneHeight: 16, laneGap: 6, top: 12, plotHeight: 176, footer: 44 };

interface Query {
  site: string;
  building: string;
  pointId: string;
  params: string[];
  from: string;
  to: string;
  interval: number;
  source: string;
  ranges: RangeFilter[];
  door: DoorFilter;
}

interface SavedQuery {
  name: string;
  savedAt: number;
  query: Query;
}

interface Series {
  param: MpParameter;
  samples: Sample[];
  byTime: Map<number, number>;
}

type Quality = 'Good' | 'Estimated' | 'Missing';

interface DataRow {
  t: number;
  time: string;
  values: (number | null)[];
  door: number | null;
  quality: Quality;
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
  param: MpParameter;
  x: number;
  side: 'left' | 'right';
}

@Component({
  selector: 'app-data-explorer',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './data-explorer.html',
  styleUrl: './data-explorer.css',
})
export class DataExplorer {
  @ViewChild('builder') private builderRef?: ElementRef<HTMLElement>;

  icons = EXPLORER_ICONS;
  intervalOptions = AGGREGATION_OPTIONS;
  visualizationOptions = VISUALIZATION_OPTIONS;
  doorOptions = DOOR_FILTER_OPTIONS;
  sources = DATA_SOURCES;
  maxParams = MAX_PARAMS;
  templateOptions: DropdownOption[] = QUERY_TEMPLATES.map((t, i) => ({ label: t.label, value: i }));
  template: number | null = null;

  draft: Query = {
    site: MP_POINTS[0].site,
    building: MP_POINTS[0].building,
    pointId: MP_POINTS[0].id,
    params: ['temperature', 'humidity', 'energy'],
    from: '2026-10-01',
    to: '2026-10-07',
    interval: 15,
    source: 'sensor',
    ranges: [
      { key: 'temperature', min: -30, max: 10 },
      { key: 'humidity', min: 0, max: 100 },
    ],
    door: 'all',
  };
  applied: Query = structuredClone(this.draft);

  // Presentation settings apply straight away
  visualization: Visualization = 'combo';
  showThresholds = true;
  showEvents = true;

  // ---------- Menus ----------
  paramMenuOpen = false;
  dateOpen = false;
  addMenuOpen = false;
  moreMenuOpen = false;
  columnsOpen = false;
  savedOpen = false;
  saveOpen = false;
  saveName = '';
  builderTab: 'visual' | 'raw' = 'visual';
  paramSearch = '';
  builderFlash = false;
  copied = false;
  expanded = false;
  savedQueries: SavedQuery[] = this.readSaved();

  // ---------- Results ----------
  series: Series[] = [];
  rows: DataRow[] = [];
  filteredRows: DataRow[] = [];
  hiddenColumns = new Set<string>();
  page = 1;
  selectedT: number | null = null;
  hasDoor = false;

  // ---------- Chart ----------
  plot: Plot = { width: CHART.width, height: 300, left: CHART.left, right: CHART.width - CHART.left, top: 40, bottom: 260 };
  axes: ChartAxis[] = [];
  lines: { param: MpParameter; path: string; area: string }[] = [];
  barSets: { param: MpParameter; width: number; bars: { x: number; y: number; height: number }[] }[] = [];
  lanes: { param: MpParameter; y: number; path: string; area: string }[] = [];
  thresholdLines: { y: number; color: string }[] = [];
  thresholdBands: { y: number; height: number; color: string }[] = [];
  matchMarks: { x: number; width: number }[] = [];
  events: { x: number; time: string; label: string }[] = [];
  timeTicks: { x: number; date: string; time: string }[] = [];
  hover: { x: number; left: number; time: string; dots: { y: number; color: string }[]; values: { label: string; color: string; value: string }[] } | null = null;
  brush: { x: number; width: number } | null = null;
  private dragStart: number | null = null;
  private span = { start: 0, end: 1 };
  view = { start: 0, end: 1 };
  private step = HOUR;
  private buckets: { t: number; values: (number | null)[] }[] = [];

  constructor() {
    this.run();
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
    return this.draft.params.map(k => this.param(k)).filter(p => this.draftParams.includes(p));
  }

  // Builder checklist: parameters the chosen data source exposes, narrowed by the search box
  get builderParams(): MpParameter[] {
    const source = this.sources.find(s => s.key === this.draft.source);
    const q = this.paramSearch.trim().toLowerCase();
    return this.draftParams.filter(p => (!source?.params.length || source.params.includes(p.key)) && (!q || p.label.toLowerCase().includes(q)));
  }

  // Parameters that can still receive a value-range filter
  get filterableParams(): MpParameter[] {
    return this.draft.params.map(k => this.param(k)).filter(p => p.kind !== 'state' && !this.draft.ranges.some(r => r.key === p.key));
  }

  get addableParams(): MpParameter[] {
    return this.draftParams.filter(p => !this.applied.params.includes(p.key));
  }

  get dateError(): string | null {
    const { from, to } = this.draft;
    if (!from || !to) return 'Select a start and end date.';
    const days = (parseInputDate(to) - parseInputDate(from)) / DAY + 1;
    if (days < 1) return 'End date must be on or after the start date.';
    if (days > MAX_RANGE_DAYS) return `Date range can be at most ${MAX_RANGE_DAYS} days.`;
    return null;
  }

  get canRun(): boolean {
    return !this.dateError && this.draft.params.length > 0;
  }

  get dirty(): boolean {
    return JSON.stringify(this.draft) !== JSON.stringify(this.applied);
  }

  get dateLabel(): string {
    return `${fullDate(parseInputDate(this.draft.from))} - ${fullDate(parseInputDate(this.draft.to))}`;
  }

  get appliedPoint(): MpPoint {
    return this.point(this.applied.pointId);
  }

  get zoomed(): boolean {
    return this.view.start > this.span.start || this.view.end < this.span.end;
  }

  get activeFilterCount(): number {
    return this.activeRanges(this.applied).length + (this.applied.door !== 'all' && this.hasDoor ? 1 : 0);
  }

  // Readable SQL for the draft query, shown on the Raw Query tab
  get rawQuery(): string {
    const q = this.draft;
    const source = this.sources.find(s => s.key === q.source)!;
    const column = (p: MpParameter) => p.key === 'door' ? 'door_status' : p.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_$/, '');
    const params = q.params.map(k => this.param(k));
    const select = params.map(p => `       ${p.kind === 'state' ? 'MAX' : 'AVG'}(${column(p)}) AS ${column(p)}`).join(',\n');
    const where = [
      `point_id = '${q.pointId}'`,
      `ts >= '${q.from} 00:00' AND ts < '${q.to} 24:00'`,
      ...this.activeRanges(q).map(r => {
        const c = column(this.param(r.key));
        if (r.min !== null && r.max !== null) return `${c} BETWEEN ${r.min} AND ${r.max}`;
        return r.min !== null ? `${c} >= ${r.min}` : `${c} <= ${r.max}`;
      }),
      ...(q.door !== 'all' ? [`door_status = '${q.door === 'open' ? 'Open' : 'Closed'}'`] : []),
    ];
    return [
      `SELECT time_bucket('${q.interval} minutes', ts) AS timestamp,`,
      select || '       NULL',
      `FROM ${source.table}`,
      `WHERE ${where.join('\n  AND ')}`,
      'GROUP BY 1',
      'ORDER BY 1;',
    ].join('\n');
  }

  // ---------- Filter handlers ----------
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
    this.draft.params = kept.length ? kept : available.slice(0, 3);
    this.draft.ranges = this.draft.ranges.filter(r => this.draft.params.includes(r.key));
  }

  isSelected(key: string): boolean {
    return this.draft.params.includes(key);
  }

  canToggle(key: string): boolean {
    return this.isSelected(key) || this.draft.params.length < MAX_PARAMS;
  }

  toggleParam(key: string): void {
    if (this.isSelected(key)) this.removeParam(key);
    else if (this.canToggle(key)) this.draft.params = [...this.draft.params, key];
  }

  removeParam(key: string, event?: Event): void {
    event?.stopPropagation();
    this.draft.params = this.draft.params.filter(p => p !== key);
    this.draft.ranges = this.draft.ranges.filter(r => r.key !== key);
  }

  addParameter(key: string): void {
    this.addMenuOpen = false;
    if (!this.isSelected(key) && this.draft.params.length < MAX_PARAMS) this.draft.params = [...this.draft.params, key];
    this.run();
  }

  addFilter(): void {
    const next = this.filterableParams[0];
    if (next) this.draft.ranges = [...this.draft.ranges, { key: next.key, min: next.axis[0], max: next.axis[1] }];
  }

  removeFilter(filter: RangeFilter): void {
    this.draft.ranges = this.draft.ranges.filter(r => r !== filter);
  }

  loadTemplate(index: number): void {
    const t = QUERY_TEMPLATES[index];
    if (!t) return;
    this.template = index;
    const available = this.point(this.draft.pointId).parameters;
    this.draft.params = t.params.filter(p => available.includes(p));
    this.draft.ranges = (t.ranges ?? []).filter(r => this.draft.params.includes(r.key)).map(r => ({ ...r }));
    this.draft.door = t.door ?? 'all';
    if (t.interval) this.draft.interval = t.interval;
    this.builderTab = 'visual';
  }

  openAdvanced(): void {
    this.builderTab = 'visual';
    this.builderRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.builderFlash = false;
    // Restart the highlight animation on repeated clicks
    setTimeout(() => (this.builderFlash = true));
    setTimeout(() => (this.builderFlash = false), 1600);
  }

  copyRaw(): void {
    navigator.clipboard?.writeText(this.rawQuery).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    });
  }

  // ---------- Saved queries ----------
  saveQuery(): void {
    const name = this.saveName.trim() || `Query ${this.savedQueries.length + 1}`;
    this.savedQueries = [{ name, savedAt: Date.now(), query: structuredClone(this.draft) }, ...this.savedQueries.filter(s => s.name !== name)];
    this.writeSaved();
    this.saveName = '';
    this.saveOpen = false;
  }

  loadSaved(saved: SavedQuery): void {
    this.draft = structuredClone(saved.query);
    this.savedOpen = false;
    this.run();
  }

  deleteSaved(saved: SavedQuery, event: Event): void {
    event.stopPropagation();
    this.savedQueries = this.savedQueries.filter(s => s !== saved);
    this.writeSaved();
  }

  savedDate(saved: SavedQuery): string {
    return stamp(saved.savedAt);
  }

  private readSaved(): SavedQuery[] {
    try {
      return JSON.parse(localStorage.getItem(SAVED_QUERIES_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private writeSaved(): void {
    try {
      localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(this.savedQueries));
    } catch {
      // Storage unavailable (private mode); saved queries last for this session only
    }
  }

  // ---------- Menus ----------
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.paramMenuOpen && !target.closest('.param-select')) this.paramMenuOpen = false;
    if (this.dateOpen && !target.closest('.date-field')) this.dateOpen = false;
    if (this.addMenuOpen && !target.closest('.add-wrap')) this.addMenuOpen = false;
    if (this.moreMenuOpen && !target.closest('.more-wrap')) this.moreMenuOpen = false;
    if (this.columnsOpen && !target.closest('.columns-wrap')) this.columnsOpen = false;
    if (this.savedOpen && !target.closest('.saved-wrap')) this.savedOpen = false;
    if (this.saveOpen && !target.closest('.save-wrap')) this.saveOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.expanded = this.dateOpen = this.paramMenuOpen = this.addMenuOpen = this.moreMenuOpen = this.columnsOpen = this.savedOpen = this.saveOpen = false;
    this.cancelDrag();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.dragStart === null) return;
    const svg = (event.target as Element).closest?.('svg.chart') ?? document.querySelector('app-data-explorer svg.chart');
    if (svg) this.endDrag(event, svg);
    else this.cancelDrag();
  }

  // ---------- Run ----------
  run(): void {
    if (!this.canRun) return;
    this.paramMenuOpen = this.dateOpen = false;
    this.applied = structuredClone(this.draft);
    const q = this.applied;
    const point = this.point(q.pointId);
    const start = parseInputDate(q.from);
    const end = parseInputDate(q.to) + DAY;
    this.span = { start, end };
    this.view = { start, end };

    const make = (param: MpParameter): Series => {
      const samples = simulate(point, param, start, end, q.interval);
      return { param, samples, byTime: new Map(samples.map(s => [s.t, s.v])) };
    };
    this.series = q.params.map(k => make(this.param(k)));
    this.hasDoor = point.parameters.includes('door');
    const door = this.hasDoor ? (this.series.find(s => s.param.key === 'door') ?? make(this.param('door'))) : null;

    const step = q.interval * MINUTE;
    this.rows = [];
    for (let t = start; t < end; t += step) {
      const values = this.series.map(s => s.byTime.get(t) ?? null);
      const missing = values.some(v => v === null);
      this.rows.push({
        t,
        time: stamp(t),
        values,
        door: door?.byTime.get(t) ?? null,
        quality: missing ? 'Missing' : isEstimated(point, t) ? 'Estimated' : 'Good',
      });
    }
    this.applyRowFilters();
    this.selectedT = null;
    this.buildChart();
  }

  // Ranges that actually narrow the data; one spanning the whole axis is a no-op
  private activeRanges(q: Query): RangeFilter[] {
    return q.ranges.filter(r => {
      const [lo, hi] = this.param(r.key).axis;
      return q.params.includes(r.key) && ((r.min !== null && r.min > lo) || (r.max !== null && r.max < hi));
    });
  }

  private applyRowFilters(): void {
    const ranges = this.activeRanges(this.applied).map(r => ({ ...r, index: this.applied.params.indexOf(r.key) }));
    const door = this.hasDoor ? this.applied.door : 'all';
    this.filteredRows = this.rows.filter(row =>
      ranges.every(r => {
        const v = row.values[r.index];
        return v !== null && (r.min === null || v >= r.min) && (r.max === null || v <= r.max);
      }) &&
      (door === 'all' || (door === 'open' ? row.door === 1 : row.door === 0)),
    );
    this.page = 1;
  }

  // ---------- Table ----------
  get pagedRows(): DataRow[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredRows.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredRows.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredRows.length);
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

  selectRow(row: DataRow): void {
    this.selectedT = this.selectedT === row.t ? null : row.t;
    // Bring the selected reading into view if the chart is zoomed elsewhere
    if (this.selectedT !== null && (row.t < this.view.start || row.t > this.view.end)) this.resetZoom();
  }

  toggleColumn(key: string): void {
    this.hiddenColumns.has(key) ? this.hiddenColumns.delete(key) : this.hiddenColumns.add(key);
  }

  formatCell(param: MpParameter, v: number | null): string {
    if (v === null) return '-';
    if (param.kind === 'state') return v ? param.states![0] : param.states![1];
    return v.toFixed(param.decimals);
  }

  exportRows(): void {
    const header = ['Timestamp', ...this.series.map(s => s.param.kind === 'state' ? s.param.label : `${s.param.label} (${s.param.unit})`), ...(this.hasDoor ? ['Door Status'] : []), 'Data Quality'];
    const data = this.filteredRows.map(r => [
      r.time,
      ...r.values.map((v, i) => this.formatCell(this.series[i].param, v)),
      ...(this.hasDoor ? [r.door === null ? '-' : r.door ? 'Open' : 'Closed'] : []),
      r.quality,
    ]);
    exportCsv(header, data, `${this.fileBase()}.csv`);
    this.moreMenuOpen = false;
  }

  exportChart(svg: Element): void {
    exportSvg(svg, `${this.fileBase()}-chart.svg`);
    this.moreMenuOpen = false;
  }

  // ---------- Chart interaction ----------
  private svgX(event: MouseEvent, svg: Element): number {
    const rect = svg.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * this.plot.width;
  }

  private clampX(x: number): number {
    return Math.min(this.plot.right, Math.max(this.plot.left, x));
  }

  private xTime(x: number): number {
    return this.view.start + ((x - this.plot.left) / (this.plot.right - this.plot.left)) * (this.view.end - this.view.start);
  }

  startDrag(event: MouseEvent, svg: Element): void {
    if (event.button !== 0) return;
    const x = this.svgX(event, svg);
    if (x < this.plot.left || x > this.plot.right) return;
    event.preventDefault();
    this.dragStart = x;
    this.brush = { x, width: 0 };
  }

  onChartMove(event: MouseEvent, svg: Element): void {
    const x = this.svgX(event, svg);
    if (this.dragStart !== null) {
      const end = this.clampX(x);
      this.brush = { x: Math.min(this.dragStart, end), width: Math.abs(end - this.dragStart) };
      this.hover = null;
      return;
    }
    if (!this.buckets.length || x < this.plot.left || x > this.plot.right) {
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
      dots: this.series
        .map((s, i) => ({ s, v: bucket.values[i] }))
        .filter(d => d.v !== null && d.s.param.kind !== 'state')
        .map(d => ({ y: this.valueY(d.s.param, d.v!), color: d.s.param.color })),
      values: this.series.map((s, i) => ({ label: s.param.label, color: s.param.color, value: this.formatHover(s.param, bucket.values[i]) })),
    };
  }

  private endDrag(event: MouseEvent, svg: Element): void {
    const startX = this.dragStart!;
    const endX = this.clampX(this.svgX(event, svg));
    this.cancelDrag();
    if (Math.abs(endX - startX) > 10) {
      const a = this.xTime(Math.min(startX, endX));
      const b = this.xTime(Math.max(startX, endX));
      const mid = (a + b) / 2;
      const half = Math.max(b - a, MIN_ZOOM) / 2;
      this.view = { start: Math.max(this.span.start, mid - half), end: Math.min(this.span.end, mid + half) };
      this.buildChart();
      return;
    }
    // A plain click selects the closest matching reading and opens its page in the table
    this.selectNearest(this.xTime(endX));
  }

  private cancelDrag(): void {
    this.dragStart = null;
    this.brush = null;
  }

  private selectNearest(t: number): void {
    if (!this.filteredRows.length) return;
    let best = 0;
    this.filteredRows.forEach((r, i) => {
      if (Math.abs(r.t - t) < Math.abs(this.filteredRows[best].t - t)) best = i;
    });
    this.selectedT = this.filteredRows[best].t;
    this.page = Math.floor(best / PAGE_SIZE) + 1;
  }

  resetZoom(): void {
    this.view = { ...this.span };
    this.buildChart();
  }

  setVisualization(v: Visualization): void {
    this.visualization = v;
    this.buildChart();
  }

  get selectedX(): number | null {
    if (this.selectedT === null || this.selectedT < this.view.start || this.selectedT > this.view.end) return null;
    return this.timeX(this.selectedT + this.applied.interval * MINUTE / 2);
  }

  private formatHover(param: MpParameter, v: number | null): string {
    if (v === null) return 'No data';
    if (param.kind === 'state') return v === 0 ? param.states![1] : `${param.states![0]} ${(v * 100).toFixed(0)}%`;
    return `${v.toFixed(param.decimals)} ${param.unit}`;
  }

  // ---------- Chart build ----------
  private buildChart(): void {
    const { start, end } = this.view;
    const step = (this.step = Math.max(this.applied.interval * MINUTE, (end - start) / MAX_BUCKETS));
    const count = Math.max(1, Math.ceil((end - start) / step));
    const sums = this.series.map(() => Array.from({ length: count }, () => ({ sum: 0, n: 0 })));
    this.series.forEach((s, si) =>
      s.samples.forEach(sample => {
        if (sample.t < start || sample.t >= end) return;
        const cell = sums[si][Math.min(count - 1, Math.floor((sample.t - start) / step))];
        cell.sum += sample.v;
        cell.n++;
      }),
    );
    this.buckets = Array.from({ length: count }, (_, i) => ({
      t: start + i * step,
      values: sums.map(list => (list[i].n ? list[i].sum / list[i].n : null)),
    }));

    // Layout: on/off lanes above the plot, one value axis per numeric parameter (up to three)
    const states = this.series.filter(s => s.param.kind === 'state');
    const numeric = this.series.filter(s => s.param.kind !== 'state');
    const axisParams = numeric.slice(0, 3).map(s => s.param);
    const rightAxes = Math.max(0, axisParams.length - 1);
    const top = CHART.top + states.length * (CHART.laneHeight + CHART.laneGap) + (states.length ? 6 : 0);
    const bottom = top + CHART.plotHeight;
    const right = CHART.width - CHART.left - Math.max(0, rightAxes - 1) * CHART.axisGap;
    this.plot = { width: CHART.width, height: bottom + CHART.footer, left: CHART.left, right, top, bottom };
    this.axes = axisParams.map((p, i) => ({
      ...fixedAxis(p.axis[0], p.axis[1], 5),
      param: p,
      x: i === 0 ? CHART.left : right + (i - 1) * CHART.axisGap,
      side: i === 0 ? 'left' : 'right',
    }));

    this.lines = [];
    this.barSets = [];
    numeric.forEach(s => {
      const si = this.series.indexOf(s);
      if (s.param.kind === 'bar' && this.visualization === 'combo') {
        const width = Math.max(1.5, ((right - CHART.left) / count) * 0.6);
        const bars = this.buckets
          .filter(b => b.values[si] !== null)
          .map(b => {
            const y = this.valueY(s.param, b.values[si]!);
            return { x: this.timeX(b.t + step / 2) - width / 2, y, height: bottom - y };
          });
        this.barSets.push({ param: s.param, width, bars });
        return;
      }
      let path = '';
      let area = '';
      let run: { x: number; y: number }[] = [];
      const flush = () => {
        if (!run.length) return;
        path += run.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
        area += `M${run[0].x.toFixed(1)},${bottom}` + run.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + `L${run.at(-1)!.x.toFixed(1)},${bottom}Z`;
        run = [];
      };
      this.buckets.forEach(b => {
        const v = b.values[si];
        if (v === null) return flush();
        run.push({ x: this.timeX(b.t + step / 2), y: this.valueY(s.param, v) });
      });
      flush();
      this.lines.push({ param: s.param, path, area });
    });

    this.lanes = states.map((s, li) => {
      const si = this.series.indexOf(s);
      const laneTop = CHART.top + li * (CHART.laneHeight + CHART.laneGap);
      const laneBottom = laneTop + CHART.laneHeight;
      let path = '';
      this.buckets.forEach((b, i) => {
        const ly = laneBottom - (b.values[si] ?? 0) * CHART.laneHeight;
        const x0 = this.timeX(b.t);
        path += i ? `H${x0.toFixed(1)}V${ly.toFixed(1)}` : `M${x0.toFixed(1)},${ly.toFixed(1)}`;
      });
      path += `H${this.timeX(end).toFixed(1)}`;
      return { param: s.param, y: laneTop, path, area: `${path}V${laneBottom}H${this.timeX(start).toFixed(1)}Z` };
    });

    // First continuous reading gets dashed limits, the second shaded bands
    const readings = numeric.filter(s => s.param.kind === 'line').map(s => s.param);
    this.thresholdLines = [];
    this.thresholdBands = [];
    if (readings[0]) {
      const p = readings[0];
      this.thresholdLines = [
        { y: this.valueY(p, p.high!), color: '#ef4444' },
        { y: this.valueY(p, p.low!), color: '#2563eb' },
      ].filter(l => l.y > top && l.y < bottom);
    }
    if (readings[1]) {
      const p = readings[1];
      const highY = this.valueY(p, p.high!);
      const lowY = this.valueY(p, p.low!);
      this.thresholdBands = [
        { y: top, height: Math.max(0, highY - top), color: 'rgba(239, 68, 68, 0.08)' },
        { y: lowY, height: Math.max(0, bottom - lowY), color: 'rgba(37, 99, 235, 0.07)' },
      ];
    }

    this.events = this.series
      .filter(s => s.param.kind === 'line')
      .flatMap(s => this.excursions(s).map(peak => ({ t: peak.t, label: `${s.param.label} ${peak.v.toFixed(s.param.decimals)} ${s.param.unit}` })))
      .filter(e => e.t >= start && e.t < end)
      .map(e => ({ x: this.timeX(e.t), time: stamp(e.t), label: e.label }));

    // Strip along the time axis marking where the query filters match
    this.matchMarks = [];
    if (this.activeFilterCount) {
      const cell = (right - CHART.left) / count;
      const hit = new Set(this.filteredRows.filter(r => r.t >= start && r.t < end).map(r => Math.min(count - 1, Math.floor((r.t - start) / step))));
      this.matchMarks = [...hit].map(i => ({ x: CHART.left + i * cell, width: Math.max(1.5, cell) }));
    }

    this.timeTicks = timeTicks(start, end, t => this.timeX(t));
    this.hover = null;
  }

  get legend(): { label: string; color: string; kind: 'dot' | 'dash' | 'band' | 'square' | 'event' }[] {
    type Item = { label: string; color: string; kind: 'dot' | 'dash' | 'band' | 'square' | 'event' };
    const items: Item[] = this.series.map(s => ({
      label: s.param.kind === 'state' ? `${s.param.label} (${s.param.states!.join('/')})` : `${s.param.label} (${s.param.unit})`,
      color: s.param.color,
      kind: s.param.kind === 'bar' && this.visualization === 'combo' ? 'square' : 'dot',
    }));
    const readings = this.series.filter(s => s.param.kind === 'line').map(s => s.param);
    if (this.showThresholds && readings[0] && this.thresholdLines.length) {
      items.push(
        { label: `High Threshold (${readings[0].label})`, color: '#ef4444', kind: 'dash' },
        { label: `Low Threshold (${readings[0].label})`, color: '#2563eb', kind: 'dash' },
      );
    }
    if (this.showThresholds && readings[1]) {
      items.push(
        { label: `High Threshold (${readings[1].label})`, color: 'rgba(239, 68, 68, 0.25)', kind: 'band' },
        { label: `Low Threshold (${readings[1].label})`, color: 'rgba(37, 99, 235, 0.25)', kind: 'band' },
      );
    }
    if (this.showEvents && this.events.length) items.push({ label: 'Threshold Violation', color: '#ef4444', kind: 'event' });
    if (this.matchMarks.length) items.push({ label: 'Matches Query Filters', color: '#a78bfa', kind: 'square' });
    return items;
  }

  axisY(v: number, axis: Axis): number {
    return scale(v, axis, this.plot.bottom, this.plot.top);
  }

  private valueY(param: MpParameter, v: number): number {
    const axis = this.axes.find(a => a.param === param) ?? { min: param.axis[0], max: param.axis[1] };
    return Math.min(this.plot.bottom, Math.max(this.plot.top, scale(v, axis, this.plot.bottom, this.plot.top)));
  }

  private timeX(t: number): number {
    const { start, end } = this.view;
    return this.plot.left + ((t - start) / (end - start)) * (this.plot.right - this.plot.left);
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

  param(key: string): MpParameter {
    return MP_PARAMETERS.find(p => p.key === key) ?? MP_PARAMETERS[0];
  }

  private point(id: string): MpPoint {
    return MP_POINTS.find(p => p.id === id) ?? MP_POINTS[0];
  }

  private fileBase(): string {
    return `data-explorer-${this.appliedPoint.name.toLowerCase().replace(/\s+/g, '-')}-${this.applied.from}-to-${this.applied.to}`;
  }
}
