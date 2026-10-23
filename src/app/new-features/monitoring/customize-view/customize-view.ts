import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { DAY, fixedAxis, fullDate, parseInputDate, scale, stamp, timeTicks, toInputDate } from '../shared/chart-utils';
import { simulate } from '../shared/sensor-sim';
import { MP_PARAMETERS, MP_POINTS } from '../multi-parameter/multi-parameter.data';
import { MONITORING_POINTS, STATUS_COLORS } from '../monitoring.data';
import {
  ALARM_SUMMARY,
  CARD_STYLES,
  COLOR_SCHEMES,
  CUSTOMIZE_ICONS,
  DISPLAY_SELECTS,
  DisplaySelect,
  DisplayToggle,
  ROW_DENSITIES,
  SHARE_PEOPLE,
  SHARE_ROLES,
  ShareRole,
  SharePerson,
  TABLE_COLUMNS,
  DEFAULT_VIEW,
  DEVICE_HEALTH,
  DEVICE_MODELS,
  DEVICE_STATUSES,
  FILTER_FIELDS,
  FILTER_TABS,
  FilterField,
  FilterPreset,
  FilterTab,
  QUICK_FILTERS,
  ViewFilters,
  LAYOUT_TEMPLATES,
  LayoutTemplate,
  PANEL_TABS,
  PREVIEW_INSIGHTS,
  PanelTab,
  PreviewDevice,
  SUMMARY_PARAMS,
  VIEW_STORAGE_KEY,
  ViewConfig,
  WIDGETS,
  WidgetDef,
} from './customize-view.data';

const PREVIEW_END = '2026-10-07';
const PREVIEW_PAGE = 5;
// Trend chart plot area inside its 760x140 viewBox
const PLOT = { width: 760, height: 140, left: 46, right: 714, top: 8, bottom: 104 };
const SPARK = { width: 60, height: 22 };
const STATUS_ORDER: Record<string, number> = { critical: 0, warning: 1, offline: 2, normal: 3 };

interface TrendSample {
  x: number;
  time: string;
  temp?: { v: number; y: number };
  hum?: { v: number; y: number };
}

// Catmull-Rom spline through the points, as cubic Bezier segments
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

@Component({
  selector: 'app-customize-view',
  imports: [CommonModule, FormsModule, RouterLink, Breadcrumb],
  templateUrl: './customize-view.html',
  styleUrls: ['./customize-view.css', './customize-view-tabs.css'],
})
export class CustomizeView {
  private readonly router = inject(Router);

  icons = CUSTOMIZE_ICONS;
  private readonly baseCrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/new-dashboard' },
    { label: 'Monitoring', route: '/monitoring' },
    { label: 'Customize View' },
  ];
  private readonly layoutCrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/new-dashboard' },
    { label: 'Monitoring', route: '/monitoring' },
    { label: 'Customize View', route: '/monitoring/customize' },
    { label: 'Layouts' },
  ];
  private readonly filterCrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/new-dashboard' },
    { label: 'Monitoring', route: '/monitoring' },
    { label: 'Customize View', route: '/monitoring/customize' },
    { label: 'Filters' },
  ];
  private readonly displayCrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/new-dashboard' },
    { label: 'Monitoring', route: '/monitoring' },
    { label: 'Customize View', route: '/monitoring/customize' },
    { label: 'Display' },
  ];
  private readonly sharingCrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/new-dashboard' },
    { label: 'Monitoring', route: '/monitoring' },
    { label: 'Customize View', route: '/monitoring/customize' },
    { label: 'Sharing' },
  ];
  templates = LAYOUT_TEMPLATES;
  layoutSearch = '';
  // Layouts tab: hides the per-widget edit controls on the right
  previewOnly = false;
  trendExpanded = false;
  panelTabs = PANEL_TABS;
  panelTab: PanelTab = 'Widgets';
  filterFields = FILTER_FIELDS;
  filterTabs = FILTER_TABS;
  filterTab: FilterTab = 'General Filters';
  quickFilters = QUICK_FILTERS;
  deviceStatuses = DEVICE_STATUSES;
  deviceModels = DEVICE_MODELS;
  // Which popover is open: a filter field key, 'dates' or 'preset-<id>'
  openMenu: string | null = null;
  displaySelects = DISPLAY_SELECTS;
  colorSchemes = COLOR_SCHEMES;
  cardStyles = CARD_STYLES;
  tableColumns = TABLE_COLUMNS;
  rowDensities = ROW_DENSITIES;
  sharePeople = SHARE_PEOPLE;
  shareRoles = SHARE_ROLES;
  peopleSearch = '';
  roleFilter: '' | ShareRole = '';
  // Nearest trend sample under the pointer, for the chart tooltip
  hover: TrendSample | null = null;
  summaryParams = SUMMARY_PARAMS;
  alarms = ALARM_SUMMARY;
  insights = PREVIEW_INSIGHTS;
  deviceHealth = DEVICE_HEALTH;
  statusColors = STATUS_COLORS;
  ranges = [1, 3, 7, 30];
  plot = PLOT;
  Math = Math;

  saved: ViewConfig = this.readSaved();
  config: ViewConfig = structuredClone(this.saved);
  device: PreviewDevice = 'desktop';
  search = '';
  toast: string | null = null;
  copied = false;
  private toastTimer?: ReturnType<typeof setTimeout>;

  // Drag-to-reorder state for the widget list
  dragKey: string | null = null;

  // ---------- Preview data ----------
  pointSearch = '';
  pointPage = 1;
  trend = this.buildTrend();

  get layoutsMode(): boolean {
    return this.panelTab === 'Layouts';
  }

  get filtersMode(): boolean {
    return this.panelTab === 'Filters';
  }

  get displayMode(): boolean {
    return this.panelTab === 'Display';
  }

  get sharingMode(): boolean {
    return this.panelTab === 'Sharing';
  }

  // Layouts and Filters use the wide page layout with the tabs above both panes
  get topTabs(): boolean {
    return this.panelTab !== 'Widgets';
  }

  get breadcrumb(): BreadcrumbItem[] {
    if (this.layoutsMode) return this.layoutCrumbs;
    if (this.filtersMode) return this.filterCrumbs;
    if (this.displayMode) return this.displayCrumbs;
    return this.sharingMode ? this.sharingCrumbs : this.baseCrumbs;
  }

  get editing(): boolean {
    return this.layoutsMode && !this.previewOnly;
  }

  get dirty(): boolean {
    return JSON.stringify(this.config) !== JSON.stringify(this.saved);
  }

  // ---------- Widgets ----------
  widget(key: string): WidgetDef {
    return WIDGETS.find(w => w.key === key)!;
  }

  get listedWidgets(): { def: WidgetDef; entry: ViewConfig['widgets'][number] }[] {
    const q = this.search.trim().toLowerCase();
    return this.config.widgets
      .map(entry => ({ def: this.widget(entry.key), entry }))
      .filter(w => !q || w.def.label.toLowerCase().includes(q) || w.def.description.toLowerCase().includes(q));
  }

  // Getters rebuild their row objects on every check; track by key so ngFor keeps the
  // rows instead of recreating them (recreated ngModels trigger another check, looping forever)
  trackWidget(_: number, w: { def: WidgetDef }): string {
    return w.def.key;
  }

  trackSummary(_: number, p: { key: string }): string {
    return p.key;
  }

  get allSelected(): boolean {
    return this.config.widgets.every(w => w.enabled);
  }

  get enabledCount(): number {
    return this.config.widgets.filter(w => w.enabled).length;
  }

  toggleAll(): void {
    const enable = !this.allSelected;
    this.config.widgets.forEach(w => (w.enabled = enable));
  }

  // Full-width widgets lead the preview so the rest pack into the grid below them
  get previewWidgets(): WidgetDef[] {
    const sizes = this.activeTemplate?.sizes ?? {};
    const enabled = this.config.widgets
      .filter(w => w.enabled)
      .map(w => this.widget(w.key))
      .map(def => (sizes[def.key] ? { ...def, size: sizes[def.key]! } : def));
    return [...enabled.filter(w => w.size === 'full'), ...enabled.filter(w => w.size !== 'full')];
  }

  trackDef(_: number, w: WidgetDef): string {
    return w.key;
  }

  removeWidget(key: string): void {
    const entry = this.config.widgets.find(w => w.key === key);
    if (entry) entry.enabled = false;
  }

  // ---------- Layout templates ----------
  get activeTemplate(): LayoutTemplate | undefined {
    return LAYOUT_TEMPLATES.find(t => t.id === this.config.layout.template);
  }

  get filteredTemplates(): LayoutTemplate[] {
    const q = this.layoutSearch.trim().toLowerCase();
    return q ? LAYOUT_TEMPLATES.filter(t => t.name.toLowerCase().includes(q)) : LAYOUT_TEMPLATES;
  }

  templateSize(t: LayoutTemplate, key: string): string {
    return t.sizes?.[key] ?? this.widget(key).size;
  }

  applyTemplate(t: LayoutTemplate): void {
    const rest = WIDGETS.map(w => w.key).filter(k => !t.widgets.includes(k));
    this.config.widgets = [...t.widgets, ...rest].map(key => ({ key, enabled: t.widgets.includes(key) }));
    this.config.layout.template = t.id;
  }

  createCustomLayout(): void {
    this.config.layout.template = 'custom';
    this.panelTab = 'Widgets';
    this.showToast('Custom layout: pick and reorder widgets to build it.');
  }

  onDragStart(event: DragEvent, key: string): void {
    this.dragKey = key;
    event.dataTransfer?.setData('text/plain', key);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  // Rows shift live while dragging, so the drop simply ends the gesture
  onDragOver(event: DragEvent, key: string): void {
    if (!this.dragKey) return;
    event.preventDefault();
    if (key !== this.dragKey) this.move(this.dragKey, key);
  }

  onDragEnd(): void {
    this.dragKey = null;
  }

  // Keyboard alternative to dragging: arrow keys on the handle
  nudge(key: string, offset: number, event: Event): void {
    event.preventDefault();
    const list = this.config.widgets;
    const from = list.findIndex(w => w.key === key);
    const to = from + offset;
    if (to < 0 || to >= list.length) return;
    this.move(key, list[to].key);
  }

  private move(key: string, targetKey: string): void {
    const list = this.config.widgets;
    const from = list.findIndex(w => w.key === key);
    const to = list.findIndex(w => w.key === targetKey);
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
  }

  // ---------- Filters & display ----------
  isSummaryParam(key: string): boolean {
    return this.config.filters.summaryParams.includes(key);
  }

  toggleSummaryParam(key: string): void {
    const list = this.config.filters.summaryParams;
    this.config.filters.summaryParams = list.includes(key) ? list.filter(k => k !== key) : [...list, key];
  }

  setRange(days: number): void {
    const f = this.config.filters;
    f.range = days;
    f.dateFrom = toInputDate(parseInputDate(f.dateTo) - (days - 1) * DAY);
    this.trend = this.buildTrend();
  }

  // ---------- Filter fields ----------
  @HostListener('document:click')
  closeMenus(): void {
    this.openMenu = null;
  }

  toggleMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.openMenu = this.openMenu === id ? null : id;
  }

  fieldText(field: FilterField): string {
    const value = this.config.filters[field.key];
    if (Array.isArray(value)) {
      if (!value.length) return field.placeholder;
      return value.length === 1 ? value[0] : `Multiple Selected (${value.length})`;
    }
    return field.options.find(o => o.value === value)?.label ?? field.placeholder;
  }

  isMultiple(field: FilterField): boolean {
    const value = this.config.filters[field.key];
    return Array.isArray(value) && value.length > 1;
  }

  isPicked(field: FilterField, value: unknown): boolean {
    const current = this.config.filters[field.key];
    return Array.isArray(current) ? current.includes(value as string) : current === value;
  }

  pick(field: FilterField, value: unknown): void {
    const f = this.config.filters as unknown as Record<string, string | string[]>;
    const current = f[field.key];
    if (Array.isArray(current)) {
      f[field.key] = current.includes(value as string) ? current.filter(v => v !== value) : [...current, value as string];
      return;
    }
    f[field.key] = value as string;
    this.openMenu = null;
    if (field.key === 'status') this.pointPage = 1;
  }

  clearField(field: FilterField, event: Event): void {
    event.stopPropagation();
    const f = this.config.filters as unknown as Record<string, string | string[]>;
    f[field.key] = field.multi ? [] : '';
    this.openMenu = null;
  }

  // Toggles a value in one of the checkbox lists
  toggleIn(key: 'quick' | 'deviceStatus' | 'models', value: string): void {
    const list = this.config.filters[key];
    this.config.filters[key] = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
  }

  get dateLabel(): string {
    return `${fullDate(parseInputDate(this.config.filters.dateFrom))} - ${fullDate(parseInputDate(this.config.filters.dateTo))}`;
  }

  setDate(which: 'dateFrom' | 'dateTo', value: string): void {
    if (!value) return;
    const f = this.config.filters;
    f[which] = value;
    if (f.dateFrom > f.dateTo) f[which === 'dateFrom' ? 'dateTo' : 'dateFrom'] = value;
    const days = Math.round((parseInputDate(f.dateTo) - parseInputDate(f.dateFrom)) / DAY) + 1;
    f.range = Math.min(90, days);
    this.trend = this.buildTrend();
  }

  // ---------- Filter presets ----------
  applyPreset(preset: FilterPreset): void {
    Object.assign(this.config.filters, structuredClone(preset.filters));
    this.openMenu = null;
    this.pointPage = 1;
    this.setRange(this.config.filters.range);
    this.showToast(`Preset "${preset.name}" applied`);
  }

  deletePreset(preset: FilterPreset): void {
    this.config.presets = this.config.presets.filter(p => p !== preset);
    this.openMenu = null;
  }

  addPreset(): void {
    const f = this.config.filters;
    const filters: Partial<ViewFilters> = structuredClone({
      site: f.site, building: f.building, floor: f.floor, spaces: f.spaces, params: f.params,
      status: f.status, aggregation: f.aggregation, range: f.range,
    });
    const params = f.params.length ? f.params.join(', ') : 'All Parameters';
    const range = f.range === 1 ? 'Last 24 Hours' : `Last ${f.range} Days`;
    this.config.presets = [
      ...this.config.presets,
      {
        id: `custom-${Date.now()}`,
        name: `Custom Preset ${this.config.presets.length + 1}`,
        detail: `${f.site || 'All Sites'} | ${params} | ${range}`,
        icon: 'bookmark',
        tone: 'blue',
        filters,
      },
    ];
    this.showToast('Current filters saved as a preset');
  }

  setUnit(unit: 'C' | 'F'): void {
    this.config.display.unit = unit;
    this.trend = this.buildTrend();
  }

  get previewSummary() {
    return SUMMARY_PARAMS.filter(p => this.isSummaryParam(p.key)).map(p => ({
      ...p,
      display: this.formatValue(p.key, p.value, p.decimals, p.unit),
      minText: this.formatValue(p.key, p.min, p.decimals, p.unit),
      maxText: this.formatValue(p.key, p.max, p.decimals, p.unit),
    }));
  }

  private formatValue(key: string, value: number, decimals: number, unit: string): string {
    const format = this.config.display.numberFormat;
    const places = format === 'precise' ? decimals + 1 : decimals;
    const fahrenheit = key === 'temperature' && this.config.display.unit === 'F';
    const shown = (fahrenheit ? value * 9 / 5 + 32 : value).toFixed(places);
    return format === 'value' ? shown : `${shown} ${fahrenheit ? '°F' : unit}`;
  }

  // ---------- Display settings ----------
  displayText(field: DisplaySelect): string {
    const value = this.config.display[field.key];
    return field.options.find(o => o.value === value)?.label ?? '';
  }

  setDisplay(field: DisplaySelect, value: unknown): void {
    (this.config.display as unknown as Record<string, unknown>)[field.key] = value;
    this.openMenu = null;
    if (field.key === 'interval' || field.key === 'chartType') this.trend = this.buildTrend();
    if (field.key === 'sortBy' || field.key === 'pageSize') this.pointPage = 1;
  }

  toggleDisplay(key: DisplayToggle): void {
    this.config.display[key] = !this.config.display[key];
    if (key === 'smooth' || key === 'dataPoints' || key === 'events') this.trend = this.buildTrend();
    if (key === 'tooltips') this.hover = null;
  }

  // Fill Area is the area chart type, so the two controls stay in sync
  toggleFill(): void {
    this.config.display.chartType = this.config.display.chartType === 'area' ? 'line' : 'area';
  }

  get scheme() {
    return COLOR_SCHEMES.find(c => c.key === this.config.display.scheme) ?? COLOR_SCHEMES[0];
  }

  hasCol(key: string): boolean {
    return this.config.display.columns.includes(key);
  }

  get missingColumns() {
    return TABLE_COLUMNS.filter(c => !this.hasCol(c.key));
  }

  get shownColumns() {
    return TABLE_COLUMNS.filter(c => this.hasCol(c.key));
  }

  removeColumn(key: string): void {
    this.config.display.columns = this.config.display.columns.filter(k => k !== key);
  }

  addColumn(key: string): void {
    // Keep the table's natural column order
    const next = [...this.config.display.columns, key];
    this.config.display.columns = TABLE_COLUMNS.map(c => c.key).filter(k => next.includes(k));
    this.openMenu = null;
  }

  // ---------- Trend tooltip ----------
  onTrendMove(event: MouseEvent): void {
    if (!this.config.display.tooltips) return;
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PLOT.width;
    const samples = this.trend.samples;
    if (x < PLOT.left || x > PLOT.right || !samples.length) {
      this.hover = null;
      return;
    }
    // Samples are evenly spaced in time, so the index follows from x
    const i = Math.round(((x - PLOT.left) / (PLOT.right - PLOT.left)) * (samples.length - 1));
    this.hover = samples[Math.min(samples.length - 1, Math.max(0, i))];
  }

  spark(seed: number): string {
    const pts = Array.from({ length: 12 }, (_, i) => {
      const v = Math.sin(i * 0.8 + seed) * 0.5 + i / 22 + Math.sin(i * 2.3 + seed * 3) * 0.2;
      return `${((i / 11) * SPARK.width).toFixed(1)},${(SPARK.height - 3 - (v + 0.7) / 2 * (SPARK.height - 6)).toFixed(1)}`;
    });
    return `M${pts.join('L')}`;
  }

  // ---------- Sharing ----------
  get filteredPeople(): SharePerson[] {
    const q = this.peopleSearch.trim().toLowerCase();
    return SHARE_PEOPLE.filter(p =>
      (!q || `${p.name} ${p.sub}`.toLowerCase().includes(q)) && (!this.roleFilter || this.roleOf(p.id) === this.roleFilter),
    );
  }

  isMember(id: string): boolean {
    return this.config.sharing.members.includes(id);
  }

  toggleMember(id: string): void {
    const members = this.config.sharing.members;
    this.config.sharing.members = members.includes(id) ? members.filter(m => m !== id) : [...members, id];
  }

  roleOf(id: string): ShareRole {
    return this.config.sharing.roles[id] ?? 'viewer';
  }

  setRole(id: string, role: unknown): void {
    this.config.sharing.roles = { ...this.config.sharing.roles, [id]: role as ShareRole };
    this.openMenu = null;
  }

  roleLabel(role: string): string {
    return SHARE_ROLES.find(r => r.value === role)?.label ?? 'All Roles';
  }

  get shareLink(): string {
    const slug = this.config.sharing.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'view';
    return `${location.origin}/monitoring?view=${slug}`;
  }

  copyLink(): void {
    navigator.clipboard?.writeText(this.shareLink).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    });
  }

  // ---------- Actions ----------
  resetToDefault(): void {
    this.config = structuredClone(DEFAULT_VIEW);
    this.trend = this.buildTrend();
    this.showToast('Default layout restored. Save to keep it.');
  }

  discard(): void {
    this.config = structuredClone(this.saved);
    this.router.navigate(['/monitoring']);
  }

  save(): void {
    this.saved = structuredClone(this.config);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(this.saved));
    } catch {
      // Storage unavailable (private mode); the view lasts for this session only
    }
    this.showToast('View saved');
    setTimeout(() => this.router.navigate(['/monitoring']), 700);
  }

  private showToast(message: string): void {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 2400);
  }

  // Saved view merged over the defaults, so widgets added later still show up
  private readSaved(): ViewConfig {
    const base = structuredClone(DEFAULT_VIEW);
    try {
      const raw = localStorage.getItem(VIEW_STORAGE_KEY);
      if (!raw) return base;
      const stored = JSON.parse(raw) as Partial<ViewConfig>;
      const known = (stored.widgets ?? []).filter(w => WIDGETS.some(d => d.key === w.key));
      const missing = base.widgets.filter(w => !known.some(k => k.key === w.key));
      return {
        widgets: [...known, ...missing],
        layout: { ...base.layout, ...stored.layout },
        filters: { ...base.filters, ...stored.filters },
        display: { ...base.display, ...stored.display },
        sharing: { ...base.sharing, ...stored.sharing },
        presets: stored.presets ?? base.presets,
      };
    } catch {
      return base;
    }
  }

  // ---------- Preview: monitoring points ----------
  private pointsCache = { key: '', list: MONITORING_POINTS };

  // Status is the one default filter the preview table applies; the rest are saved for the dashboard.
  // Cached because the table reads it several times per check.
  get filteredPoints() {
    const q = this.pointSearch.trim().toLowerCase();
    const { status } = this.config.filters;
    const { sortBy } = this.config.display;
    const key = `${q}|${status}|${sortBy}`;
    if (this.pointsCache.key !== key) {
      const list = MONITORING_POINTS.filter(p => (!status || p.status === status) && (!q || `${p.name} ${p.space} ${p.parameter}`.toLowerCase().includes(q)));
      list.sort((a, b) =>
        sortBy === 'status'
          ? STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
          : String(a[sortBy as 'name' | 'space' | 'parameter']).localeCompare(String(b[sortBy as 'name' | 'space' | 'parameter']), undefined, { numeric: true }),
      );
      this.pointsCache = { key, list };
    }
    return this.pointsCache.list;
  }

  // The preview shows at most 5 rows; the saved page size applies on the dashboard
  get pageSize(): number {
    return Math.min(PREVIEW_PAGE, this.config.display.pageSize);
  }

  get pagedPoints() {
    const start = (this.pointPage - 1) * this.pageSize;
    return this.filteredPoints.slice(start, start + this.pageSize);
  }

  get pointPages(): number {
    return Math.max(1, Math.ceil(this.filteredPoints.length / this.pageSize));
  }

  get pointPageList(): (number | null)[] {
    const total = this.pointPages;
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [...new Set([1, 2, 3, this.pointPage, total])].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
    const result: (number | null)[] = [];
    pages.forEach((p, i) => {
      if (i && p - pages[i - 1] > 1) result.push(null);
      result.push(p);
    });
    return result;
  }

  goToPointPage(page: number): void {
    this.pointPage = Math.min(this.pointPages, Math.max(1, page));
  }

  pointSpark(values: number[]): string {
    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;
    return values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * 60).toFixed(1)},${(19 - ((v - min) / range) * 16).toFixed(1)}`).join('');
  }

  // ---------- Preview: trend chart ----------
  private buildTrend() {
    const days = this.config?.filters.range ?? DEFAULT_VIEW.filters.range;
    const fahrenheit = this.config?.display.unit === 'F';
    const end = parseInputDate(this.config?.filters.dateTo ?? PREVIEW_END) + DAY;
    const start = end - days * DAY;
    const point = MP_POINTS[0];
    const chosen = this.config?.display.interval || (days <= 3 ? 15 : days <= 7 ? 60 : 240);
    // Cap the sample count so long ranges at fine intervals stay light
    const interval = Math.max(chosen, Math.ceil((days * 1440) / 1500));
    const smooth = this.config?.display.smooth ?? true;
    const [temp, hum] = ['temperature', 'humidity'].map(k => MP_PARAMETERS.find(p => p.key === k)!);
    const toUnit = (v: number) => (fahrenheit ? v * 9 / 5 + 32 : v);
    const tempAxis = fahrenheit ? fixedAxis(-22, 50, 4) : fixedAxis(-30, 10, 4);
    const humAxis = fixedAxis(0, 100, 5);
    const x = (t: number) => PLOT.left + ((t - start) / (end - start)) * (PLOT.right - PLOT.left);
    const y = (v: number, axis: { min: number; max: number }) => scale(v, axis, PLOT.bottom, PLOT.top);
    const points = (samples: { t: number; v: number }[], axis: { min: number; max: number }, map = (v: number) => v) =>
      samples.map(s => [x(s.t), y(map(s.v), axis)] as [number, number]);
    const path = (samples: { t: number; v: number }[], axis: { min: number; max: number }, map = (v: number) => v) => {
      const pts = points(samples, axis, map);
      return smooth ? smoothPath(pts) : pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
    };
    const tempSamples = simulate(point, temp, start, end, interval);
    const humSamples = simulate(point, hum, start, end, interval);
    const tempPath = path(tempSamples, tempAxis, toUnit);
    const humPath = path(humSamples, humAxis);
    const close = (d: string) => (d ? `${d}L${PLOT.right},${PLOT.bottom}L${PLOT.left},${PLOT.bottom}Z` : '');
    // Thin the markers so they stay readable at any interval
    const every = <T,>(list: T[]) => list.filter((_, i) => i % Math.max(1, Math.ceil(list.length / 42)) === 0);
    const tempByTime = new Map(tempSamples.map(s => [s.t, s.v]));
    const humByTime = new Map(humSamples.map(s => [s.t, s.v]));
    const samples: TrendSample[] = [];
    for (let t = start; t < end; t += interval * 60_000) {
      const tv = tempByTime.get(t);
      const hv = humByTime.get(t);
      samples.push({
        x: x(t),
        time: stamp(t),
        temp: tv === undefined ? undefined : { v: +toUnit(tv).toFixed(1), y: y(toUnit(tv), tempAxis) },
        hum: hv === undefined ? undefined : { v: +hv.toFixed(1), y: y(hv, humAxis) },
      });
    }
    return {
      unit: fahrenheit ? '°F' : '°C',
      tempAxis: tempAxis.ticks.map(v => ({ v, y: y(v, tempAxis) })),
      humAxis: humAxis.ticks.map(v => ({ v, y: y(v, humAxis) })),
      tempPath,
      humPath,
      tempArea: close(tempPath),
      humArea: close(humPath),
      high: y(toUnit(temp.high!), tempAxis),
      low: y(toUnit(temp.low!), tempAxis),
      bandHigh: y(hum.high!, humAxis),
      bandLow: y(hum.low!, humAxis),
      ticks: timeTicks(start, end, x).filter((_, i, all) => all.length <= 8 || i % 2 === 0),
      tempDots: every(points(tempSamples, tempAxis, toUnit)),
      humDots: every(points(humSamples, humAxis)),
      // Sample door / defrost events marked on the chart
      events: [0.18, 0.47, 0.79].map((f, i) => ({ x: PLOT.left + f * (PLOT.right - PLOT.left), label: i === 1 ? 'Door open' : 'Defrost' })),
      samples,
    };
  }

  // ---------- Preview: small widgets ----------
  comparison = [
    { label: 'Temperature', current: -18.6, previous: -19.4 },
    { label: 'Humidity', current: 82.4, previous: 85.1 },
  ];

  barY(v: number): number {
    return scale(v, { min: -30, max: 90 }, 120, 10);
  }

  correlation = [
    { label: 'Temp', cells: [1, -0.68, 0.72] },
    { label: 'Humidity', cells: [-0.68, 1, -0.54] },
    { label: 'Energy', cells: [0.72, -0.54, 1] },
  ];

  cellColor(r: number): string {
    const t = Math.min(1, Math.abs(r));
    const [cr, cg, cb] = r < 0 ? [37, 99, 235] : [239, 68, 68];
    const mix = (c: number) => Math.round(255 + (c - 255) * t);
    return `rgb(${mix(cr)}, ${mix(cg)}, ${mix(cb)})`;
  }

  mapPins = [
    { x: 22, y: 30, status: 'normal' as const },
    { x: 48, y: 22, status: 'normal' as const },
    { x: 70, y: 40, status: 'warning' as const },
    { x: 34, y: 62, status: 'normal' as const },
    { x: 62, y: 70, status: 'critical' as const },
    { x: 84, y: 64, status: 'normal' as const },
  ];

  get deviceTotal(): number {
    return this.deviceHealth.reduce((n, d) => n + d.count, 0);
  }

  energyBars = [262, 284, 301, 276, 318, 295, 310];
  energyDays = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];

  // Environmental index gauge (0-100 mapped onto a half circle)
  envIndex = 82;

  get envArc(): string {
    const angle = Math.PI * (1 - this.envIndex / 100);
    const x = 60 + 46 * Math.cos(angle);
    const y = 60 - 46 * Math.sin(angle);
    return `M14,60 A46,46 0 0 1 ${x.toFixed(1)},${y.toFixed(1)}`;
  }
}
