import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import { PLAN, RoomDrawing, buildingDecor, drawRoom } from './space.plan';
import {
  CURRENT_OCCUPANCY,
  FLOORS,
  FLOOR_IMAGES,
  INSIGHTS,
  ROOMS,
  Room,
  SPACE_ICONS,
  SPACE_STATUS,
  SPACE_TABS,
  SPACE_TYPES,
  TOTAL_CAPACITY,
  TREND_AVERAGE,
  TREND_TODAY,
  TREND_YESTERDAY,
} from './space.data';

const MAX_ZOOM = 2.5;

// Drawings never change, so build each room's furniture once
const DRAWINGS = new Map<string, RoomDrawing>(ROOMS.map(r => [r.id, drawRoom(r)]));
const DECOR = buildingDecor();

// Trend chart plot area inside its 340x150 viewBox
const TREND = { left: 32, right: 330, top: 14, bottom: 122 };

// Heat colour steps by utilization
const HEAT = [
  { min: 0.8, key: 'high', color: '#ef4444' },
  { min: 0.6, key: 'warm', color: '#f97316' },
  { min: 0.4, key: 'mid', color: '#facc15' },
  { min: 0, key: 'low', color: '#22c55e' },
];

function toOptions(all: string, values: string[]): DropdownOption[] {
  return [{ label: all, value: 'all' }, ...Array.from(new Set(values)).sort().map(v => ({ label: v, value: v }))];
}

function donut<T extends { color: string }>(items: T[], value: (item: T) => number) {
  const total = items.reduce((sum, i) => sum + value(i), 0) || 1;
  let offset = 0;
  return items.map(item => {
    const share = (value(item) / total) * 100;
    const slice = { ...item, share, dash: `${Math.max(0, share - 0.8)} 100`, offset: -offset };
    offset += share;
    return slice;
  });
}

@Component({
  selector: 'app-space',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './space.html',
  styleUrl: './space.css',
})
export class Space implements OnInit, OnDestroy {

  icons = SPACE_ICONS;
  tabs = SPACE_TABS;
  activeTab = SPACE_TABS[0];
  insights = INSIGHTS;
  plan = PLAN;
  heatSteps = HEAT;
  trendPlot = TREND;
  totalCapacity = TOTAL_CAPACITY;
  currentOccupancy = CURRENT_OCCUPANCY;

  ngOnInit(): void {
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
  }

  ngOnDestroy(): void {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
  }

  // ---------- KPIs ----------
  get occupancyRate(): number {
    return Math.round((CURRENT_OCCUPANCY / TOTAL_CAPACITY) * 100);
  }

  get statusCounts() {
    const total = SPACE_STATUS.reduce((sum, s) => sum + s.value, 0);
    const inUse = SPACE_STATUS[0].value;
    const available = SPACE_STATUS[1].value;
    return {
      total,
      inUse,
      available,
      inUsePct: Math.round((inUse / total) * 100),
      availablePct: Math.round((available / total) * 100),
    };
  }

  get peak() {
    const max = Math.max(...TREND_TODAY);
    const hour = TREND_TODAY.indexOf(max);
    return { people: Math.round((max / 100) * TOTAL_CAPACITY), time: `${String(hour).padStart(2, '0')}:00` };
  }

  // ---------- Donuts ----------
  spaceTypes = donut(SPACE_TYPES, t => t.occupants).map(t => ({ ...t, rate: Math.round((t.occupants / t.capacity) * 100) }));
  spaceStatus = donut(SPACE_STATUS, s => s.value).map(s => ({ ...s, pct: Math.round(s.share) }));

  // ---------- Occupancy trend ----------
  trendDay: 'today' | 'yesterday' = 'today';
  trendDayOptions: DropdownOption[] = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
  ];
  hoverIndex: number | null = null;

  get trendChart() {
    const values = this.trendDay === 'today' ? TREND_TODAY : TREND_YESTERDAY;
    const x = (h: number) => TREND.left + (h / 23) * (TREND.right - TREND.left);
    const y = (v: number) => TREND.bottom - (v / 100) * (TREND.bottom - TREND.top);
    const pts = values.map((v, h) => ({ x: x(h), y: y(v), value: v, hour: h }));
    const avg = TREND_AVERAGE.map((v, h) => ({ x: x(h), y: y(v) }));
    const line = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const slot = (TREND.right - TREND.left) / 23;
    return {
      pts,
      line,
      avg: avg.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
      area: `${x(0)},${TREND.bottom} ${line} ${pts[pts.length - 1].x.toFixed(1)},${TREND.bottom}`,
      yTicks: [0, 20, 40, 60, 80, 100].map(v => ({ y: y(v), label: `${v}%` })),
      xTicks: [0, 4, 8, 12, 16, 20].map(h => ({ x: x(h), label: `${String(h).padStart(2, '0')}:00` })),
      hits: Array.from({ length: 24 }, (_, h) => ({ x: x(h) - slot / 2, width: slot })),
    };
  }

  get hoverPoint() {
    if (this.hoverIndex === null) return null;
    const p = this.trendChart.pts[this.hoverIndex];
    if (!p) return null;
    const boxX = Math.min(TREND.right - 80, Math.max(TREND.left, p.x - 40));
    return {
      ...p,
      boxX,
      boxY: Math.max(0, p.y - 36),
      label: `${String(p.hour).padStart(2, '0')}:00`,
      people: Math.round((p.value / 100) * TOTAL_CAPACITY).toLocaleString('en-US'),
      avg: TREND_AVERAGE[p.hour],
    };
  }

  // ---------- Filters ----------
  site = 'Dubai Mall';
  building = 'all';
  floor = FLOORS[0];
  spaceType = 'all';
  status = 'all';
  search = '';
  siteOptions: DropdownOption[] = [{ label: 'Dubai Mall', value: 'Dubai Mall' }];
  buildingOptions = toOptions('All Buildings', ROOMS.map(r => r.building));
  floorOptions: DropdownOption[] = FLOORS.map(f => ({ label: f, value: f }));
  spaceTypeOptions = toOptions('All Types', ROOMS.map(r => r.type));
  statusOptions = toOptions('All Status', ROOMS.map(r => r.status));

  private matches(room: Room): boolean {
    const query = this.search.trim().toLowerCase();
    return (this.building === 'all' || room.building === this.building) &&
      (this.spaceType === 'all' || room.type === this.spaceType) &&
      (this.status === 'all' || room.status === this.status) &&
      (!query || room.name.toLowerCase().includes(query) || room.type.toLowerCase().includes(query));
  }

  // ---------- Floor plan ----------
  showHeat = true;
  hovered: Room | null = null;

  decor = DECOR;

  get floorImage(): string | null {
    return FLOOR_IMAGES[this.floor] ?? null;
  }

  get floorRooms() {
    return ROOMS.filter(r => r.floor === this.floor).map((room, ri) => {
      const util = room.capacity ? room.current / room.capacity : 0;
      const drawing = DRAWINGS.get(room.id)!;
      // Vary each seating cluster a little around the room's utilization so the heatmap looks organic
      const blobs = room.current > 0 && room.status !== 'Out of Service'
        ? drawing.clusters.map((c, i) => {
          const factor = 0.7 + 0.6 * (((i * 37 + ri * 11) % 10) / 10);
          return { ...c, r: drawing.blobSize * 1.4, key: this.heatFor(util * factor).key };
        })
        : [];
      return { room, drawing, blobs, match: this.matches(room), heat: this.heatFor(util) };
    });
  }

  // Name pill font size that fits the room width; null hides the pill (hover still shows the name)
  tagFont(room: Room): number | null {
    const size = Math.min(8, (room.w - 16) / (room.name.length * 0.6));
    return size >= 5.5 ? Math.round(size * 10) / 10 : null;
  }

  heatFor(util: number) {
    return HEAT.find(h => util >= h.min) ?? HEAT[HEAT.length - 1];
  }

  utilization(room: Room): number {
    return room.capacity ? Math.round((room.current / room.capacity) * 100) : 0;
  }

  // ---------- Zoom & pan ----------
  zoom = 1;
  panX = 0;
  panY = 0;
  private drag: { x: number; y: number; panX: number; panY: number; id: number } | null = null;
  @ViewChild('planWrap') planWrap?: ElementRef<HTMLElement>;
  fullscreen = false;

  get viewBox(): string {
    return `${this.panX} ${this.panY} ${PLAN.width / this.zoom} ${PLAN.height / this.zoom}`;
  }

  setZoom(step: number): void {
    const next = Math.min(MAX_ZOOM, Math.max(1, this.zoom + step));
    // Keep the view centred on the same point while zooming
    const cx = this.panX + PLAN.width / this.zoom / 2;
    const cy = this.panY + PLAN.height / this.zoom / 2;
    this.zoom = next;
    this.clampPan(cx - PLAN.width / next / 2, cy - PLAN.height / next / 2);
  }

  onFloorChange(): void {
    this.hovered = null;
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
  }

  private clampPan(x: number, y: number): void {
    this.panX = Math.min(PLAN.width - PLAN.width / this.zoom, Math.max(0, x));
    this.panY = Math.min(PLAN.height - PLAN.height / this.zoom, Math.max(0, y));
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
    const unit = PLAN.width / this.zoom / svg.getBoundingClientRect().width;
    this.clampPan(this.drag.panX - (event.clientX - this.drag.x) * unit, this.drag.panY - (event.clientY - this.drag.y) * unit);
  }

  onPointerUp(): void {
    this.drag = null;
  }

  toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.planWrap?.nativeElement.requestFullscreen?.();
    }
  }

  private onFullscreenChange = () => {
    this.fullscreen = !!document.fullscreenElement;
  };

  // ---------- Top occupied spaces ----------
  showAllTop = false;

  get topSpaces(): Room[] {
    const rooms = ROOMS
      .filter(r => r.floor === this.floor && this.matches(r))
      .sort((a, b) => b.current / b.capacity - a.current / a.capacity);
    return this.showAllTop ? rooms : rooms.slice(0, 5);
  }
}
