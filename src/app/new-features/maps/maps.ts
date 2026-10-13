import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ASSET_TYPES,
  AssetType,
  BUILDINGS,
  Building,
  FLOORS,
  HEATMAPS,
  MAP_ICONS,
  MAP_LAYERS,
  MAP_TABS,
  MapLayer,
  SENSORS_ONLINE,
  SENSORS_TOTAL,
  SITE_VIEWS,
  TRACKED,
  TrackKind,
} from './maps.data';

interface MapPoint {
  x: number;
  y: number;
  color: string;
  label: string;
  // Building the point sits in, so it rises with the roof in 3D view
  building: Building;
  dim?: boolean;
}

// Site map drawing size (SVG units)
const MAP = { width: 800, height: 420 };
const MAX_ZOOM = 3;
const TRACK_MS = 80;
// One full lap of a tracking route, in ticks
const LAP_TICKS = 160;

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Random points inside a building footprint (inset from the walls)
function pointsIn(b: Building, count: number, rand: () => number): [number, number][] {
  return Array.from({ length: count }, () => [b.x + 12 + rand() * (b.w - 24), b.y + 12 + rand() * (b.h - 24)]);
}

function heatColor(level: number): string {
  return level >= 0.7 ? '#ef4444' : level >= 0.4 ? '#f59e0b' : '#22c55e';
}

// Point a fraction t (0-1) of the way along a polyline
function along(route: [number, number][], t: number): { x: number; y: number } {
  const lengths = route.slice(1).map((p, i) => Math.hypot(p[0] - route[i][0], p[1] - route[i][1]));
  let remaining = t * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const f = lengths[i] ? remaining / lengths[i] : 0;
      return { x: route[i][0] + (route[i + 1][0] - route[i][0]) * f, y: route[i][1] + (route[i + 1][1] - route[i][1]) * f };
    }
    remaining -= lengths[i];
  }
  const last = route[route.length - 1];
  return { x: last[0], y: last[1] };
}

@Component({
  selector: 'app-maps',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './maps.html',
  styleUrl: './maps.css',
})
export class Maps implements OnInit, OnDestroy {

  icons = MAP_ICONS;
  tabs = MAP_TABS;
  activeTab = MAP_TABS[0];
  layers = MAP_LAYERS;
  buildings = BUILDINGS;
  floors = FLOORS;
  map = MAP;

  private timer?: ReturnType<typeof setInterval>;
  private tick = 0;

  ngOnInit(): void {
    // Simulated live positions for the tracking card
    this.timer = setInterval(() => (this.tick = (this.tick + 1) % (LAP_TICKS * 2)), TRACK_MS);
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    this.resizer?.disconnect();
  }

  // ---------- Site overview ----------
  get siteStats() {
    const footprints = BUILDINGS.filter(b => b.floors > 0);
    return [
      { label: 'Total Buildings', value: footprints.length.toLocaleString('en-US'), icon: 'building', tone: 'purple' },
      { label: 'Total Floors', value: footprints.reduce((a, b) => a + b.floors, 0).toLocaleString('en-US'), icon: 'stack', tone: 'blue' },
      { label: 'Active Assets', value: ASSET_TYPES.reduce((a, t) => a + t.count, 0).toLocaleString('en-US'), icon: 'box', tone: 'green' },
      { label: 'Sensors Online', value: SENSORS_ONLINE.toLocaleString('en-US'), icon: 'wifi', tone: 'green',
        sub: `/ ${SENSORS_TOTAL.toLocaleString('en-US')} (${Math.round((SENSORS_ONLINE / SENSORS_TOTAL) * 100)}%)` },
    ];
  }

  // ---------- Main map ----------
  siteView = SITE_VIEWS[0];
  siteViewOptions: DropdownOption[] = SITE_VIEWS.flatMap(s => [
    { label: `${s} - 3D View`, value: `${s}|3d` },
    { label: `${s} - 2D Plan`, value: `${s}|2d` },
  ]);
  viewChoice = `${SITE_VIEWS[0]}|3d`;
  is3d = true;
  layer: MapLayer = 'Buildings';
  selected: Building | null = null;
  highlightType: string | null = null;
  showLabels = true;
  showTrees = true;
  layerMenuOpen = false;

  onViewChoice(): void {
    const [site, mode] = this.viewChoice.split('|');
    this.siteView = site;
    this.is3d = mode === '3d';
  }

  set3d(on: boolean): void {
    this.is3d = on;
    this.viewChoice = `${this.siteView}|${on ? '3d' : '2d'}`;
  }

  setLayer(layer: MapLayer): void {
    this.layer = layer;
    if (layer !== 'Assets') this.highlightType = null;
  }

  // Roofs rise by the building height in 3D view
  lift(b: Building): number {
    return this.is3d ? b.height : 0;
  }

  // Floor divisions drawn on a building's front wall in the Floors layer
  floorLines(b: Building): number[] {
    const top = b.y + b.h - b.height;
    return Array.from({ length: Math.max(0, b.floors - 1) }, (_, i) => top + (b.height / b.floors) * (i + 1));
  }

  selectBuilding(b: Building): void {
    this.selected = this.selected === b ? null : b;
  }

  // Scenery generated once: trees along the site edges and cars in the open car park
  trees = (() => {
    const rand = seeded(7);
    const spots: [number, number][] = [];
    for (let x = 20; x < MAP.width; x += 26) spots.push([x + rand() * 8, 18 + rand() * 10], [x + rand() * 8, 408 + rand() * 6]);
    for (let y = 225; y < 400; y += 30) spots.push([290 + rand() * 30, y], [510 + rand() * 30, y]);
    return spots.map(([x, y]) => ({ x, y, r: 5 + rand() * 4 }));
  })();

  cars = (() => {
    const rand = seeded(11);
    const lot = BUILDINGS[0];
    const cars: { x: number; y: number; color: string }[] = [];
    const colors = ['#f8fafc', '#1f2937', '#94a3b8', '#b91c1c', '#e2e8f0', '#334155', '#2563eb'];
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 16; i++) {
        if (rand() < 0.78) cars.push({ x: lot.x + 10 + i * 12.7, y: lot.y + 14 + row * 34, color: colors[Math.floor(rand() * colors.length)] });
      }
    }
    return cars;
  })();

  // Layer overlays, generated once per layer from a fixed seed
  private overlayCache = new Map<MapLayer, MapPoint[]>();

  get overlay(): MapPoint[] {
    let points = this.overlayCache.get(this.layer);
    if (!points) {
      points = this.buildOverlay(this.layer);
      this.overlayCache.set(this.layer, points);
    }
    if (this.layer === 'Assets' && this.highlightType) {
      return points.map(p => ({ ...p, dim: p.label !== this.highlightType }));
    }
    return points;
  }

  private buildOverlay(layer: MapLayer): MapPoint[] {
    const rand = seeded(layer.length * 31);
    const inside = BUILDINGS.filter(b => b.floors > 0 || b.shape === 'round');
    switch (layer) {
      case 'Assets':
        return inside.flatMap(b => pointsIn(b, 9, rand).map(([x, y]) => {
          const t = ASSET_TYPES[Math.floor(rand() * ASSET_TYPES.length)];
          return { x, y, color: t.color, label: t.name, building: b };
        }));
      case 'People':
        return inside.flatMap(b => pointsIn(b, Math.round(b.occupancy / 6), rand).map(([x, y]) => ({
          x, y, color: rand() < 0.3 ? '#2563eb' : '#7c3aed', label: 'Person', building: b,
        })));
      case 'Sensors':
        return inside.flatMap(b => pointsIn(b, 6, rand).map(([x, y]) => ({
          x, y, color: rand() < 0.09 ? '#ef4444' : '#16a34a', label: 'Sensor', building: b,
        })));
      default:
        return [];
    }
  }

  heatColor = heatColor;

  // ---------- Zoom & pan ----------
  zoom = 1;
  panX = 0;
  panY = 0;
  private drag: { x: number; y: number; panX: number; panY: number; id: number } | null = null;
  @ViewChild('mapCard') mapCard?: ElementRef<HTMLElement>;
  fullscreen = false;

  get viewBox(): string {
    return `${this.panX} ${this.panY} ${MAP.width / this.zoom} ${MAP.height / this.zoom}`;
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
    // Convert screen pixels to map units at the current zoom (the map is fitted to the height)
    const unit = MAP.height / this.zoom / svg.getBoundingClientRect().height;
    this.clampPan(this.drag.panX - (event.clientX - this.drag.x) * unit, this.drag.panY - (event.clientY - this.drag.y) * unit);
  }

  onPointerUp(): void {
    this.drag = null;
  }

  get dragging(): boolean {
    return this.drag !== null;
  }

  // The map is always fitted to the card's height: a wide card shows ground
  // beside it, a narrow one crops the sides. The HTML labels need the box
  // size to find where a map point lands on screen.
  private zone = inject(NgZone);
  private box = { width: MAP.width, height: MAP.height };
  private resizer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(entries =>
    this.zone.run(() => {
      const r = entries[0].contentRect;
      if (r.width && r.height) this.box = { width: r.width, height: r.height };
    }));

  @ViewChild('mapBox') set mapBox(el: ElementRef<HTMLElement> | undefined) {
    if (el) this.resizer?.observe(el.nativeElement);
  }

  // Screen position (px inside the map box) of a map point
  toScreen(x: number, y: number): { left: number; top: number } {
    const w = MAP.width / this.zoom;
    const h = MAP.height / this.zoom;
    const scale = this.box.height / h;
    const offsetX = (this.box.width - w * scale) / 2;
    return { left: offsetX + (x - this.panX) * scale, top: (y - this.panY) * scale };
  }

  // Height-fit: "meet" when the card is wider than the map, "slice" when narrower
  get aspectMode(): string {
    return this.box.width / this.box.height > MAP.width / MAP.height ? 'xMidYMid meet' : 'xMidYMid slice';
  }

  // Labels near the right edge open to the left so they clear the map controls
  hotspot(b: Building) {
    const pos = this.toScreen(b.x + b.w / 2, b.y + b.h / 2 - this.lift(b));
    return { ...pos, flip: pos.left > this.box.width - 260 };
  }

  toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.mapCard?.nativeElement.requestFullscreen?.();
    }
  }

  private onFullscreenChange = () => {
    this.fullscreen = !!document.fullscreenElement;
  };

  // ---------- Occupancy heatmap ----------
  floor = 'L1';
  floorOptions: DropdownOption[] = FLOORS.map(f => ({ label: f === 'Roof' ? 'Roof' : `Level ${f.replace('L', '')}`, value: f }));

  get heatSpots() {
    return (HEATMAPS[this.floor] ?? []).map((s, i) => ({ ...s, id: `heat-${i}`, color: heatColor(s.level) }));
  }

  floorLabel(f: string): string {
    return f.startsWith('L') ? `Level ${f.slice(1)}` : f === 'Roof' ? 'Roof' : `Basement ${f.slice(1)}`;
  }

  // ---------- Multi-floor navigation ----------
  // Plates are drawn bottom-up so the upper floors overlap the lower ones
  get plates() {
    return FLOORS.map((f, i) => ({ floor: f, cy: 34 + i * 30 })).reverse();
  }

  plate(cy: number): string {
    return `20,${cy} 120,${cy - 26} 260,${cy - 26} 160,${cy}`;
  }

  // ---------- Asset locations ----------
  assetFilter = 'all';
  assetFilterOptions: DropdownOption[] = [
    { label: 'All Asset Types', value: 'all' },
    { label: 'Fixed Assets', value: 'fixed' },
    { label: 'Mobile Assets', value: 'mobile' },
  ];

  get assetTypes(): AssetType[] {
    return ASSET_TYPES.filter(t => this.assetFilter === 'all' || t.mobile === (this.assetFilter === 'mobile'));
  }

  // Show one asset type on the site map
  focusAsset(t: AssetType): void {
    this.layer = 'Assets';
    this.highlightType = this.highlightType === t.name ? null : t.name;
  }

  // ---------- Live tracking ----------
  trackFilter: TrackKind | 'all' = 'all';
  trackOptions: DropdownOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Employees', value: 'Employee' },
    { label: 'Visitors', value: 'Visitor' },
    { label: 'Assets', value: 'Asset' },
  ];

  // Background crowd on the tracking plan
  crowd = (() => {
    const rand = seeded(23);
    return Array.from({ length: 22 }, () => ({
      x: 20 + rand() * 360,
      y: 20 + rand() * 160,
      kind: (['Employee', 'Visitor', 'Asset'] as TrackKind[])[Math.floor(rand() * 3)],
    }));
  })();

  get tracked() {
    // Walk to the end of the route and back again
    const phase = this.tick / LAP_TICKS;
    const t = phase <= 1 ? phase : 2 - phase;
    return TRACKED.filter(r => this.trackFilter === 'all' || r.kind === this.trackFilter).map((r, i) => {
      const pos = along(r.route, Math.min(1, Math.max(0, (t + i * 0.18) % 1)));
      return { ...r, pos, trail: r.route.map(p => p.join(',')).join(' '), left: (pos.x / 400) * 100, top: (pos.y / 200) * 100 };
    });
  }

  trackColor(kind: TrackKind): string {
    return TRACKED.find(t => t.kind === kind)?.color ?? '#64748b';
  }

  // Close the layer menu when clicking elsewhere. composedPath() is used
  // because a dropdown option removes itself from the DOM on click.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inside = event.composedPath().some(el => el instanceof Element && el.classList.contains('layer-wrap'));
    if (this.layerMenuOpen && !inside) this.layerMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.layerMenuOpen = false;
    this.selected = null;
  }
}
