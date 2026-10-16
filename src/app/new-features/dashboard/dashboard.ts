import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import * as L from 'leaflet';
import {
  ALARM_CATEGORIES,
  DASHBOARD_ICONS,
  DEVICE_STATUS,
  ENERGY_TOTAL,
  ENERGY_WEEK,
  HEALTH_METRICS,
  HEALTH_SCORE,
  KPIS,
  RECENT_ALARMS,
  SENSOR_READINGS,
  SITE_ALARMS,
  SITE_MARKERS,
  SITE_SUMMARY,
  SPACE_USAGE,
  SiteStatus,
  TREND_SERIES,
  TrendSeries,
} from './dashboard.data';

type MapView = 'map' | 'list' | 'satellite';

interface DonutSegment {
  color: string;
  dash: string;
  offset: number;
}

interface ChartLine {
  series: TrendSeries;
  points: string;
  dots: { x: number; y: number }[];
}

const STATUS_COLORS: Record<SiteStatus, string> = {
  normal: '#16a34a',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#6b7280',
};

const TILE_LAYERS: Record<Exclude<MapView, 'list'>, { url: string; attribution: string }> = {
  map: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
};

// Line chart plot area inside its 520x220 viewBox
const CHART = { left: 40, right: 480, top: 12, bottom: 180 };
// Sparkline viewBox is 100x32
const SPARK = { width: 100, height: 32 };

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule, Dropdown],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  icons = DASHBOARD_ICONS;
  statusColors = STATUS_COLORS;

  kpis = KPIS;

  // Site overview
  siteSummary = SITE_SUMMARY;
  siteFilter: SiteStatus | 'all' = 'all';
  siteFilterOptions: DropdownOption[] = [
    { label: 'All Sites', value: 'all' },
    ...SITE_SUMMARY.map(s => ({ label: s.label, value: s.status })),
  ];
  mapView: MapView = 'map';
  private map: L.Map | null = null;
  private tileLayer: L.TileLayer | null = null;
  private markerLayer = L.layerGroup();

  // Alarms by category
  alarmCategories = ALARM_CATEGORIES;
  alarmTotal = ALARM_CATEGORIES.reduce((sum, c) => sum + c.value, 0);
  alarmSegments = this.buildDonut(ALARM_CATEGORIES.map(c => ({ value: c.value, color: c.color })));

  // Environmental health
  healthScore = HEALTH_SCORE;
  healthMetrics = HEALTH_METRICS;

  // Device status
  deviceStatus = DEVICE_STATUS;
  deviceTotal = DEVICE_STATUS.online + DEVICE_STATUS.offline;
  onlinePct = (DEVICE_STATUS.online / this.deviceTotal) * 100;
  deviceSegments = this.buildDonut([
    { value: DEVICE_STATUS.online, color: '#16a34a' },
    { value: DEVICE_STATUS.offline, color: '#d1d5db' },
  ]);

  // Sensor readings carousel
  sensors = SENSOR_READINGS;
  sensorStart = 0;
  readonly sensorsVisible = 3;
  selectedSensor = '';
  sensorOptions: DropdownOption[] = SENSOR_READINGS.map(s => ({ label: s.label, value: s.label }));

  // Key parameter trend
  trendSeries = TREND_SERIES;
  trendRanges = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];
  trendRange = this.trendRanges[0];
  trendRangeOptions: DropdownOption[] = this.trendRanges.map(r => ({ label: r, value: r }));
  activeTrend = TREND_SERIES[0].key;
  trendLines: ChartLine[] = [];
  trendXLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
  chart = CHART;

  // Top sites
  siteAlarms = SITE_ALARMS;
  topOptions = [5, 3, 7];
  topCount = 5;
  topCountOptions: DropdownOption[] = this.topOptions.map(n => ({ label: `Top ${n}`, value: n }));

  recentAlarms = RECENT_ALARMS;
  spaceUsage = SPACE_USAGE;

  // Energy
  energyWeek = ENERGY_WEEK;
  energyTotal = ENERGY_TOTAL;
  energyRanges = ['Last 7 Days', 'Last 30 Days'];
  energyRange = this.energyRanges[0];
  energyRangeOptions: DropdownOption[] = this.energyRanges.map(r => ({ label: r, value: r }));
  energyMax = 600;
  energyTicks = [600, 400, 200, 0];

  private readonly router = inject(Router);

  constructor() {
    this.buildTrend();
  }

  openCustomize(): void {
    this.router.navigate(['/customize-dashboard']);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  // ---------- Site overview ----------

  private initMap(): void {
    if (!this.mapContainer) return;
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false,
    }).setView([25.17, 55.3], 9);
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    this.setTiles('map');
    this.markerLayer.addTo(this.map);
    this.renderMarkers();
  }

  private setTiles(view: Exclude<MapView, 'list'>): void {
    if (!this.map) return;
    this.tileLayer?.remove();
    const tiles = TILE_LAYERS[view];
    this.tileLayer = L.tileLayer(tiles.url, { attribution: tiles.attribution, maxZoom: 18 }).addTo(this.map);
  }

  renderMarkers(): void {
    this.markerLayer.clearLayers();
    for (const site of this.filteredSites) {
      const icon = L.divIcon({
        className: 'site-marker-icon',
        html: `<span class="site-marker" style="background:${STATUS_COLORS[site.status]}">${site.count}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker([site.lat, site.lng], { icon })
        .bindTooltip(`${site.name} · ${site.count} sites`, { direction: 'top', offset: [0, -16] })
        .addTo(this.markerLayer);
    }
  }

  get filteredSites() {
    return this.siteFilter === 'all' ? SITE_MARKERS : SITE_MARKERS.filter(s => s.status === this.siteFilter);
  }

  setMapView(view: MapView): void {
    this.mapView = view;
    if (view === 'list') return;
    this.setTiles(view);
    // Map container was hidden in list view; let Leaflet re-measure it
    setTimeout(() => this.map?.invalidateSize());
  }

  zoom(delta: number): void {
    if (delta > 0) this.map?.zoomIn();
    else this.map?.zoomOut();
  }

  recenter(): void {
    this.map?.setView([25.17, 55.3], 9);
  }

  // ---------- Donuts ----------

  // Segments for a circle drawn with pathLength=100, leaving a small gap between slices
  private buildDonut(parts: { value: number; color: string }[]): DonutSegment[] {
    const total = parts.reduce((sum, p) => sum + p.value, 0);
    const gap = parts.length > 1 ? 1 : 0;
    let offset = 0;
    return parts.map(p => {
      const length = (p.value / total) * 100;
      const segment = { color: p.color, dash: `${Math.max(length - gap, 0)} ${100 - length + gap}`, offset: -offset };
      offset += length;
      return segment;
    });
  }

  // ---------- Sensors ----------

  get visibleSensors() {
    return Array.from({ length: Math.min(this.sensorsVisible, this.sensors.length) },
      (_, i) => this.sensors[(this.sensorStart + i) % this.sensors.length]);
  }

  nextSensors(): void {
    this.sensorStart = (this.sensorStart + 1) % this.sensors.length;
  }

  onSensorSelect(): void {
    const index = this.sensors.findIndex(s => s.label === this.selectedSensor);
    if (index >= 0) this.sensorStart = index;
  }

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

  sparkArea(values: number[]): string {
    return `0,${SPARK.height} ${this.sparkPoints(values)} ${SPARK.width},${SPARK.height}`;
  }

  // ---------- Trend chart ----------

  selectTrend(key: string): void {
    this.activeTrend = key;
    this.buildTrend();
  }

  get primarySeries(): TrendSeries {
    return this.trendLines[0].series;
  }

  get secondarySeries(): TrendSeries {
    return this.trendLines[1].series;
  }

  // Selected parameter on the left axis, compared against humidity (or temperature) on the right
  private buildTrend(): void {
    const primary = TREND_SERIES.find(s => s.key === this.activeTrend) ?? TREND_SERIES[0];
    const secondaryKey = primary.key === 'humidity' ? 'temperature' : 'humidity';
    const secondary = TREND_SERIES.find(s => s.key === secondaryKey)!;
    this.trendLines = [primary, secondary].map(series => {
      const dots = this.lineDots(series);
      return { series, dots, points: dots.map(d => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(' ') };
    });
  }

  private lineDots(series: TrendSeries): { x: number; y: number }[] {
    const width = CHART.right - CHART.left;
    const height = CHART.bottom - CHART.top;
    return series.data.map((v, i) => ({
      x: CHART.left + (i / (series.data.length - 1)) * width,
      y: CHART.bottom - ((v - series.min) / (series.max - series.min)) * height,
    }));
  }

  axisTicks(series: TrendSeries): { label: string; y: number }[] {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const value = series.min + ((series.max - series.min) / steps) * i;
      return {
        label: Number.isInteger(value) ? `${value}` : value.toFixed(1),
        y: CHART.bottom - ((CHART.bottom - CHART.top) / steps) * i,
      };
    });
  }

  xLabelPos(i: number): number {
    return CHART.left + (i / (this.trendXLabels.length - 1)) * (CHART.right - CHART.left);
  }

  // ---------- Top sites ----------

  get topSites() {
    return [...this.siteAlarms]
      .sort((a, b) => this.siteTotal(b) - this.siteTotal(a))
      .slice(0, this.topCount);
  }

  siteTotal(site: { critical: number; warning: number; minor: number }): number {
    return site.critical + site.warning + site.minor;
  }

}
