import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ACCESSIBLE,
  ANALYTICS_END,
  ANALYTICS_TABS,
  ANPR_EVENTS,
  BAY_META,
  BAY_ORDER,
  BayStatus,
  DWELL_DAILY,
  EV,
  INITIAL_OCCUPIED,
  OCCUPANCY_TODAY,
  OCCUPANCY_YESTERDAY,
  PARKING_ICONS,
  PARKING_KPIS,
  PARKING_TABS,
  PEAK_HOURS,
  ParkingKpi,
  RESERVATIONS,
  TOTAL_CHANGE,
  TOTAL_SPACES,
  USER_TYPES,
  VEHICLE_DAILY,
  VIP_RESERVED,
  VISITORS,
  ZONES,
  Zone,
} from './parking.data';

interface Bay {
  id: string;
  x: number;
  y: number;
  status: BayStatus;
  since: string;
}

// Live map drawing size (SVG units) and bay geometry
// Extra width on the right keeps the zoom controls clear of the bays
const MAP = { width: 376, height: 220 };
const BAY = { width: 20, height: 34, gap: 2, perRow: 14, left: 32 };
const BAY_ROWS = [6, 72, 108, 180];
const MAX_ZOOM = 2.5;

// Trend and analytics plot areas inside their viewBoxes
const TREND = { left: 30, right: 292, top: 12, bottom: 122 };
const BARS = { left: 36, right: 292, top: 10, bottom: 138 };

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function dayLabel(offsetFromEnd: number): string {
  const d = new Date(ANALYTICS_END);
  d.setDate(d.getDate() - offsetFromEnd);
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`;
}

// Bays drawn for a zone: a representative 56-bay section whose mix follows the zone's occupancy
function buildBays(zone: Zone, index: number): Bay[] {
  const rand = seeded(index * 97 + 13);
  const rate = zone.occupied / zone.capacity;
  const bays: Bay[] = [];
  BAY_ROWS.forEach((y, row) => {
    for (let i = 0; i < BAY.perRow; i++) {
      const n = row * BAY.perRow + i;
      let status: BayStatus = rand() < rate ? 'occupied' : 'available';
      if (row === 0 && i < 2) status = 'accessible';
      else if (zone.code === 'P7' || (row === 3 && i >= BAY.perRow - 3)) status = rand() < rate ? 'ev' : 'available';
      else if (zone.code === 'P5' ? rand() < 0.5 : row === 1 && i % 6 === 2) status = 'reserved';
      const minutes = Math.floor(rand() * 240);
      const h = 10 - Math.floor(minutes / 60);
      bays.push({
        id: `${zone.code}-${String(n + 1).padStart(3, '0')}`,
        x: BAY.left + i * (BAY.width + BAY.gap),
        y,
        status,
        since: `${String(Math.max(6, h)).padStart(2, '0')}:${String(59 - (minutes % 60)).padStart(2, '0')}`,
      });
    }
  });
  return bays;
}

@Component({
  selector: 'app-parking',
  imports: [CommonModule, FormsModule, Dropdown, DragScroll],
  templateUrl: './parking.html',
  styleUrl: './parking.css',
})
export class Parking implements OnInit, OnDestroy {

  icons = PARKING_ICONS;
  tabs = PARKING_TABS;
  activeTab = PARKING_TABS[0];
  kpis = PARKING_KPIS;
  bayMeta = BAY_META;
  bayOrder = BAY_ORDER;
  bayBox = BAY;
  map = MAP;
  trendPlot = TREND;
  barsPlot = BARS;
  anprEvents = ANPR_EVENTS;
  reservations = RESERVATIONS;
  zones: Zone[] = ZONES.map(z => ({ ...z }));

  occupied = INITIAL_OCCUPIED;
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Simulated live feed: a car arrives or leaves every few seconds
    this.timer = setInterval(() => this.tick(), 4000);
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
  }

  private tick(): void {
    const candidates = this.bays.filter(b => b.status === 'available' || b.status === 'occupied');
    const bay = candidates[Math.floor(Math.random() * candidates.length)];
    if (!bay) return;
    const arriving = bay.status === 'available';
    bay.status = arriving ? 'occupied' : 'available';
    const now = new Date();
    bay.since = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    this.occupied += arriving ? 1 : -1;
    this.currentZone.occupied += arriving ? 1 : -1;
  }

  // ---------- KPIs ----------
  kpiValue(kpi: ParkingKpi): string {
    switch (kpi.key) {
      case 'total': return TOTAL_SPACES.toLocaleString('en-US');
      case 'occupied': return this.occupied.toLocaleString('en-US');
      case 'available': return (TOTAL_SPACES - this.occupied).toLocaleString('en-US');
      case 'visitors': return VISITORS.toLocaleString('en-US');
      case 'vip': return String(VIP_RESERVED);
      case 'ev': return `${EV.used} / ${EV.total}`;
    }
  }

  kpiPercent(kpi: ParkingKpi): number {
    switch (kpi.key) {
      case 'occupied': return Math.round((this.occupied / TOTAL_SPACES) * 100);
      case 'available': return Math.round(((TOTAL_SPACES - this.occupied) / TOTAL_SPACES) * 100);
      case 'visitors': return Math.round((VISITORS / TOTAL_SPACES) * 100);
      case 'vip': return Math.round((VIP_RESERVED / TOTAL_SPACES) * 100);
      case 'ev': return Math.round((EV.used / EV.total) * 100);
      default: return 0;
    }
  }

  totalChange = TOTAL_CHANGE;

  // ---------- Zones ----------
  zonePercent(zone: Zone): number {
    return Math.round((zone.occupied / zone.capacity) * 100);
  }

  zoneTone(zone: Zone): string {
    const p = this.zonePercent(zone);
    return p >= 80 ? 'high' : p >= 60 ? 'mid' : 'low';
  }

  // ---------- Live map ----------
  zoneCode = 'P1';
  zoneOptions: DropdownOption[] = ZONES.map(z => ({ label: `${z.code} - ${z.name}`, value: z.code }));
  private bayCache = new Map<string, Bay[]>(ZONES.map((z, i) => [z.code, buildBays(z, i)]));
  hiddenStatuses = new Set<BayStatus>();
  hoveredBay: Bay | null = null;

  get currentZone(): Zone {
    return this.zones.find(z => z.code === this.zoneCode) ?? this.zones[0];
  }

  get bays(): Bay[] {
    return this.bayCache.get(this.zoneCode) ?? [];
  }

  onZoneChange(): void {
    this.hoveredBay = null;
    this.resetView();
  }

  toggleStatus(status: BayStatus): void {
    this.hiddenStatuses.has(status) ? this.hiddenStatuses.delete(status) : this.hiddenStatuses.add(status);
  }

  bayCount(status: BayStatus): number {
    return this.bays.filter(b => b.status === status).length;
  }

  // ---------- Zoom & pan ----------
  zoom = 1;
  panX = 0;
  panY = 0;
  private drag: { x: number; y: number; panX: number; panY: number; id: number } | null = null;
  @ViewChild('mapWrap') mapWrap?: ElementRef<HTMLElement>;
  fullscreen = false;

  get viewBox(): string {
    const w = MAP.width / this.zoom;
    const h = MAP.height / this.zoom;
    return `${this.panX} ${this.panY} ${w} ${h}`;
  }

  setZoom(step: number): void {
    const next = Math.min(MAX_ZOOM, Math.max(1, this.zoom + step));
    // Keep the view centred on the same point while zooming
    const cx = this.panX + MAP.width / this.zoom / 2;
    const cy = this.panY + MAP.height / this.zoom / 2;
    this.zoom = next;
    this.clampPan(cx - MAP.width / next / 2, cy - MAP.height / next / 2);
  }

  resetView(): void {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
  }

  private clampPan(x: number, y: number): void {
    this.panX = Math.min(MAP.width - MAP.width / this.zoom, Math.max(0, x));
    this.panY = Math.min(MAP.height - MAP.height / this.zoom, Math.max(0, y));
  }

  onPointerDown(event: PointerEvent): void {
    if (this.zoom === 1) return;
    this.drag = { x: event.clientX, y: event.clientY, panX: this.panX, panY: this.panY, id: event.pointerId };
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.drag || event.pointerId !== this.drag.id) return;
    const svg = event.currentTarget as SVGSVGElement;
    // Convert screen pixels to SVG units at the current zoom
    const unit = MAP.width / this.zoom / svg.getBoundingClientRect().width;
    this.clampPan(this.drag.panX - (event.clientX - this.drag.x) * unit, this.drag.panY - (event.clientY - this.drag.y) * unit);
  }

  onPointerUp(): void {
    this.drag = null;
  }

  toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.mapWrap?.nativeElement.requestFullscreen?.();
    }
  }

  private onFullscreenChange = () => {
    this.fullscreen = !!document.fullscreenElement;
  };

  // ---------- Real-time occupancy donut ----------
  get occupancyPercent(): number {
    return Math.round((this.occupied / TOTAL_SPACES) * 100);
  }

  get occupancyLegend() {
    return [
      { label: 'Occupied', value: this.occupied, color: BAY_META.occupied.color },
      { label: 'Available', value: TOTAL_SPACES - this.occupied, color: BAY_META.available.color },
      { label: 'Reserved', value: VIP_RESERVED, color: BAY_META.reserved.color },
      { label: 'EV Charging', value: EV.used, color: BAY_META.ev.color },
      { label: 'Accessible', value: ACCESSIBLE, color: BAY_META.accessible.color },
    ];
  }

  // ---------- Occupancy trend ----------
  trendDay: 'today' | 'yesterday' = 'today';
  trendDayOptions: DropdownOption[] = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
  ];
  hoverIndex: number | null = null;

  get trendChart() {
    const values = this.trendDay === 'today' ? OCCUPANCY_TODAY : OCCUPANCY_YESTERDAY;
    const x = (h: number) => TREND.left + (h / 23) * (TREND.right - TREND.left);
    const y = (v: number) => TREND.bottom - (v / 100) * (TREND.bottom - TREND.top);
    const pts = values.map((v, h) => ({ x: x(h), y: y(v), value: v, hour: h }));
    const line = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const slot = (TREND.right - TREND.left) / 23;
    return {
      pts,
      line,
      area: `${x(0)},${TREND.bottom} ${line} ${pts[pts.length - 1].x.toFixed(1)},${TREND.bottom}`,
      yTicks: [0, 25, 50, 75, 100].map(v => ({ y: y(v), label: `${v}%` })),
      xTicks: [0, 4, 8, 12, 16, 20].map(h => ({ x: x(h), label: `${String(h).padStart(2, '0')}:00` })),
      // Invisible hover columns, one per reading
      hits: pts.map(p => ({ x: p.x - slot / 2, width: slot })),
    };
  }

  get hoverPoint() {
    if (this.hoverIndex === null) return null;
    const p = this.trendChart.pts[this.hoverIndex];
    if (!p) return null;
    // Keep the tooltip inside the plot
    const boxX = Math.min(TREND.right - 78, Math.max(TREND.left, p.x - 39));
    return { ...p, boxX, boxY: Math.max(0, p.y - 34), label: `${String(p.hour).padStart(2, '0')}:00` };
  }

  // ---------- Parking analytics ----------
  analyticsTabs = ANALYTICS_TABS;
  analyticsTab = ANALYTICS_TABS[0];
  userTypes = USER_TYPES;
  analyticsRange = 7;
  analyticsRangeOptions: DropdownOption[] = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 14 Days', value: 14 },
  ];

  private axis(peak: number) {
    const raw = peak / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) ?? raw;
    const max = Math.ceil(peak / step) * step;
    const scale = (v: number) => (v / max) * (BARS.bottom - BARS.top);
    const ticks = [];
    for (let v = 0; v <= max; v += step) ticks.push({ y: BARS.bottom - scale(v), label: v.toLocaleString('en-US') });
    return { scale, ticks };
  }

  // Vehicle count (stacked by user type), dwell time and peak hours share one bar renderer
  get barChart() {
    let series: number[][];
    let labels: string[];
    let colors: string[];
    let unit: string;
    if (this.analyticsTab === 'Peak Hours') {
      series = PEAK_HOURS.map(v => [v]);
      labels = PEAK_HOURS.map((_, i) => `${String(i + 6).padStart(2, '0')}:00`);
      colors = ['#7c3aed'];
      unit = 'vehicles / hour';
    } else {
      const days = this.analyticsRange;
      labels = Array.from({ length: days }, (_, i) => dayLabel(days - 1 - i));
      if (this.analyticsTab === 'Dwell Time') {
        series = DWELL_DAILY.slice(-days).map(v => [v]);
        colors = ['#8b5cf6'];
        unit = 'minutes';
      } else {
        series = VEHICLE_DAILY.slice(-days);
        colors = USER_TYPES.map(u => u.color);
        unit = 'vehicles';
      }
    }
    const axis = this.axis(Math.max(...series.map(s => s.reduce((a, b) => a + b, 0))));
    const slot = (BARS.right - BARS.left) / series.length;
    const width = Math.min(20, slot * 0.6);
    const every = Math.ceil(series.length / 7);
    return {
      ticks: axis.ticks,
      bars: series.map((values, i) => {
        let y = BARS.bottom;
        const segments = values.map((v, s) => {
          const h = axis.scale(v);
          y -= h;
          return { y, h, color: colors[s] };
        });
        const total = values.reduce((a, b) => a + b, 0);
        return {
          x: BARS.left + slot * i + (slot - width) / 2,
          cx: BARS.left + slot * i + slot / 2,
          width, segments,
          label: (series.length - 1 - i) % every === 0 ? labels[i] : '',
          tooltip: `${labels[i]}: ${total.toLocaleString('en-US')} ${unit}`,
        };
      }),
    };
  }

  get userTypeShares() {
    const days = VEHICLE_DAILY.slice(-this.analyticsRange);
    const totals = USER_TYPES.map((_, t) => days.reduce((sum, d) => sum + d[t], 0));
    const all = totals.reduce((a, b) => a + b, 0);
    return USER_TYPES.map((u, t) => ({ ...u, value: totals[t], share: Math.round((totals[t] / all) * 100) }));
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.hoveredBay = null;
  }
}
