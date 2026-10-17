import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import { DataExplorer } from './data-explorer/data-explorer';
import { HistoricalData } from './historical-data/historical-data';
import { MultiParameter } from './multi-parameter/multi-parameter';
import { TrendAnalysis } from './trend-analysis/trend-analysis';
import {
  CURRENT_READINGS,
  DETAIL_TABS,
  MONITORING_ICONS,
  MONITORING_POINTS,
  MONITORING_SECTIONS,
  MonitoringSection,
  MonitoringPoint,
  PARAMETER_SUMMARY,
  PointStatus,
  STATUS_COLORS,
  TREND_EVENT,
  TREND_HUMIDITY,
  TREND_TEMPERATURE,
} from './monitoring.data';

const PAGE_SIZE = 12;
// Row sparkline viewBox is 100x28
const SPARK = { width: 100, height: 28 };
// Trend chart plot area inside its 520x220 viewBox
const CHART = { left: 44, right: 476, top: 14, bottom: 178 };
const TEMP_RANGE = { min: -30, max: -10 };
const HUMIDITY_RANGE = { min: 0, max: 100 };

function toOptions(all: string, values: string[]): DropdownOption[] {
  return [{ label: all, value: 'all' }, ...Array.from(new Set(values)).map(v => ({ label: v, value: v }))];
}

@Component({
  selector: 'app-monitoring',
  imports: [CommonModule, FormsModule, RouterLink, Dropdown, DragScroll, HistoricalData, TrendAnalysis, MultiParameter, DataExplorer],
  templateUrl: './monitoring.html',
  styleUrl: './monitoring.css',
})
export class Monitoring {

  icons = MONITORING_ICONS;
  statusColors = STATUS_COLORS;
  statuses: PointStatus[] = ['normal', 'warning', 'critical', 'offline'];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tabs = MONITORING_SECTIONS.filter(s => s.tab);
  activeSection: MonitoringSection = MONITORING_SECTIONS[0];

  summary = PARAMETER_SUMMARY;

  // ---------- Filters ----------
  private points = MONITORING_POINTS;
  site = 'all';
  building = 'all';
  floor = 'all';
  spaceType = 'all';
  parameter = 'all';
  status = 'all';
  search = '';

  siteOptions = toOptions('All Sites', this.points.map(p => p.site));
  buildingOptions = toOptions('All Buildings', this.points.map(p => p.building));
  floorOptions = toOptions('All Floors', this.points.map(p => p.floor));
  spaceTypeOptions = toOptions('All Types', this.points.map(p => p.spaceType));
  parameterOptions = toOptions('All Parameters', this.points.map(p => p.parameter));
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    ...this.statuses.map(s => ({ label: s[0].toUpperCase() + s.slice(1), value: s })),
  ];

  // ---------- Table ----------
  page = 1;
  checked = new Set<string>();
  bulkOpen = false;

  // ---------- Detail panel ----------
  selected: MonitoringPoint | null = this.points[0];
  detailTabs = DETAIL_TABS;
  activeDetailTab = DETAIL_TABS[0];
  readings = CURRENT_READINGS;
  rangeOptions: DropdownOption[] = [
    { label: 'Last 1 Hour', value: '1h' },
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
  ];
  range = '24h';

  // ---------- Trend chart (static, precomputed) ----------
  chart = CHART;
  tempLine = this.chartPoints(TREND_TEMPERATURE, TEMP_RANGE);
  humidityLine = this.chartPoints(TREND_HUMIDITY, HUMIDITY_RANGE);
  tempTicks = [-10, -15, -20, -25, -30].map(v => ({ label: v, y: this.chartY(v, TEMP_RANGE) }));
  humidityTicks = [100, 75, 50, 25, 0].map(v => ({ label: v, y: this.chartY(v, HUMIDITY_RANGE) }));
  hourTicks = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'].map((label, i) => ({
    label,
    x: CHART.left + (i / 6) * (CHART.right - CHART.left),
  }));
  eventBand = {
    x: this.chartX(TREND_EVENT.from, 24),
    width: this.chartX(TREND_EVENT.to, 24) - this.chartX(TREND_EVENT.from, 24),
  };

  constructor() {
    // The active sub-module lives in the URL so sidebar links and the back button work
    this.route.queryParamMap.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(params => {
      this.activeSection = MONITORING_SECTIONS.find(s => s.slug === params.get('tab')) ?? MONITORING_SECTIONS[0];
    });
  }

  openSection(section: MonitoringSection): void {
    if (section === this.activeSection) return;
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: section.slug }, queryParamsHandling: 'merge' });
  }

  // ---------- Filtering & paging ----------
  get filteredPoints(): MonitoringPoint[] {
    const query = this.search.trim().toLowerCase();
    return this.points.filter(p =>
      (this.site === 'all' || p.site === this.site) &&
      (this.building === 'all' || p.building === this.building) &&
      (this.floor === 'all' || p.floor === this.floor) &&
      (this.spaceType === 'all' || p.spaceType === this.spaceType) &&
      (this.parameter === 'all' || p.parameter === this.parameter) &&
      (this.status === 'all' || p.status === this.status) &&
      (!query || p.name.toLowerCase().includes(query) || p.space.toLowerCase().includes(query) || p.id.toLowerCase().includes(query))
    );
  }

  get pagedPoints(): MonitoringPoint[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredPoints.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredPoints.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredPoints.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredPoints.length);
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

  onFilterChange(): void {
    this.page = 1;
  }

  toggleRow(point: MonitoringPoint): void {
    this.checked.has(point.id) ? this.checked.delete(point.id) : this.checked.add(point.id);
  }

  get allPageChecked(): boolean {
    return this.pagedPoints.length > 0 && this.pagedPoints.every(p => this.checked.has(p.id));
  }

  toggleAllPage(): void {
    const check = !this.allPageChecked;
    this.pagedPoints.forEach(p => (check ? this.checked.add(p.id) : this.checked.delete(p.id)));
  }

  // ---------- Detail panel ----------
  selectPoint(point: MonitoringPoint): void {
    this.selected = point;
    this.activeDetailTab = DETAIL_TABS[0];
  }

  closeDetail(): void {
    this.selected = null;
  }

  signalBars(dbm: number): number {
    if (dbm >= -70) return 4;
    if (dbm >= -80) return 3;
    if (dbm >= -90) return 2;
    return 1;
  }

  // ---------- Charts ----------
  sparkPoints(values: number[]): string {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * SPARK.width;
        const y = SPARK.height - 3 - ((v - min) / range) * (SPARK.height - 6);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  private chartX(index: number, count: number): number {
    return CHART.left + (index / (count - 1)) * (CHART.right - CHART.left);
  }

  private chartY(value: number, range: { min: number; max: number }): number {
    return CHART.bottom - ((value - range.min) / (range.max - range.min)) * (CHART.bottom - CHART.top);
  }

  private chartPoints(values: number[], range: { min: number; max: number }): { points: string; dots: { x: number; y: number }[] } {
    const dots = values.map((v, i) => ({ x: this.chartX(i, values.length), y: this.chartY(v, range) }));
    return { points: dots.map(d => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(' '), dots };
  }
}
