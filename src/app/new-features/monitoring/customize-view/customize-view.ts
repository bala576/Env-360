import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { DAY, fixedAxis, parseInputDate, scale, timeTicks } from '../shared/chart-utils';
import { simulate } from '../shared/sensor-sim';
import { MP_PARAMETERS, MP_POINTS } from '../multi-parameter/multi-parameter.data';
import { MONITORING_POINTS, STATUS_COLORS } from '../monitoring.data';
import {
  ALARM_SUMMARY,
  CUSTOMIZE_ICONS,
  DEFAULT_VIEW,
  DEVICE_HEALTH,
  PANEL_TABS,
  PREVIEW_INSIGHTS,
  PanelTab,
  PreviewDevice,
  REFRESH_OPTIONS,
  SITE_OPTIONS,
  SUMMARY_PARAMS,
  VIEW_STORAGE_KEY,
  ViewConfig,
  WIDGETS,
  WidgetDef,
} from './customize-view.data';

const PREVIEW_END = '2026-10-07';
const PREVIEW_PAGE = 5;
// Trend chart plot area inside its 760x230 viewBox
const PLOT = { width: 760, height: 230, left: 46, right: 714, top: 10, bottom: 182 };
const SPARK = { width: 60, height: 22 };

@Component({
  selector: 'app-customize-view',
  imports: [CommonModule, FormsModule, RouterLink, Breadcrumb, Dropdown],
  templateUrl: './customize-view.html',
  styleUrl: './customize-view.css',
})
export class CustomizeView {
  private readonly router = inject(Router);

  icons = CUSTOMIZE_ICONS;
  breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', route: '/new-dashboard' },
    { label: 'Monitoring', route: '/monitoring' },
    { label: 'Customize View' },
  ];
  panelTabs = PANEL_TABS;
  panelTab: PanelTab = 'Widgets';
  siteOptions = SITE_OPTIONS;
  refreshOptions = REFRESH_OPTIONS;
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

  get previewWidgets(): WidgetDef[] {
    return this.config.widgets.filter(w => w.enabled).map(w => this.widget(w.key));
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
    this.config.filters.range = days;
    this.trend = this.buildTrend();
  }

  setUnit(unit: 'C' | 'F'): void {
    this.config.display.unit = unit;
    this.trend = this.buildTrend();
  }

  get previewSummary() {
    return SUMMARY_PARAMS.filter(p => this.isSummaryParam(p.key)).map(p => ({ ...p, display: this.formatValue(p.key, p.value, p.decimals, p.unit) }));
  }

  private formatValue(key: string, value: number, decimals: number, unit: string): string {
    if (key === 'temperature' && this.config.display.unit === 'F') return `${(value * 9 / 5 + 32).toFixed(decimals)} °F`;
    return `${value.toFixed(decimals)} ${unit}`;
  }

  spark(seed: number): string {
    const pts = Array.from({ length: 12 }, (_, i) => {
      const v = Math.sin(i * 0.8 + seed) * 0.5 + i / 22 + Math.sin(i * 2.3 + seed * 3) * 0.2;
      return `${((i / 11) * SPARK.width).toFixed(1)},${(SPARK.height - 3 - (v + 0.7) / 2 * (SPARK.height - 6)).toFixed(1)}`;
    });
    return `M${pts.join('L')}`;
  }

  // ---------- Sharing ----------
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
      };
    } catch {
      return base;
    }
  }

  // ---------- Preview: monitoring points ----------
  get filteredPoints() {
    const q = this.pointSearch.trim().toLowerCase();
    return q ? MONITORING_POINTS.filter(p => `${p.name} ${p.space} ${p.parameter}`.toLowerCase().includes(q)) : MONITORING_POINTS;
  }

  get pagedPoints() {
    const start = (this.pointPage - 1) * PREVIEW_PAGE;
    return this.filteredPoints.slice(start, start + PREVIEW_PAGE);
  }

  get pointPages(): number {
    return Math.max(1, Math.ceil(this.filteredPoints.length / PREVIEW_PAGE));
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
    const end = parseInputDate(PREVIEW_END) + DAY;
    const start = end - days * DAY;
    const point = MP_POINTS[0];
    const interval = days <= 3 ? 15 : days <= 7 ? 60 : 240;
    const [temp, hum] = ['temperature', 'humidity'].map(k => MP_PARAMETERS.find(p => p.key === k)!);
    const toUnit = (v: number) => (fahrenheit ? v * 9 / 5 + 32 : v);
    const tempAxis = fahrenheit ? fixedAxis(-22, 50, 4) : fixedAxis(-30, 10, 4);
    const humAxis = fixedAxis(0, 100, 5);
    const x = (t: number) => PLOT.left + ((t - start) / (end - start)) * (PLOT.right - PLOT.left);
    const y = (v: number, axis: { min: number; max: number }) => scale(v, axis, PLOT.bottom, PLOT.top);
    const path = (samples: { t: number; v: number }[], axis: { min: number; max: number }, map = (v: number) => v) =>
      samples.map((s, i) => `${i ? 'L' : 'M'}${x(s.t).toFixed(1)},${y(map(s.v), axis).toFixed(1)}`).join('');
    const tempSamples = simulate(point, temp, start, end, interval);
    const humSamples = simulate(point, hum, start, end, interval);
    const tempPath = path(tempSamples, tempAxis, toUnit);
    const humPath = path(humSamples, humAxis);
    const close = (d: string) => (d ? `${d}L${PLOT.right},${PLOT.bottom}L${PLOT.left},${PLOT.bottom}Z` : '');
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
