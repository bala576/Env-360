import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ACTIVE_PLAYLISTS,
  DAILY_PLAYS,
  DISPLAY_ICONS,
  DISPLAY_TABS,
  DISPLAY_TYPES,
  Display,
  FAILED_PCT,
  FEATURED,
  NOW,
  PLAYBACK_END,
  PLAYLISTS,
  PLAYLIST_CHANGE,
  PLAYLIST_POSTER,
  POSTERS,
  PREV_PERIOD,
  Poster,
  SITES,
  TODAY,
  TOTAL_CHANGE,
  scheduleFor,
} from './digitaldisplay.data';

const PAGE_SIZE = 7;
const MAX_ZOOM = 2;
const ROTATE_MS = 6000;

// Map drawing size (SVG units)
const MAP = { width: 300, height: 200 };
// Chart heights in screen pixels. Chart widths follow their card, so one SVG
// unit is one pixel and text keeps the same size on every screen.
const CHART_HEIGHT = { bars: 170, line: 150 };

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

// Fill each site up to its display count around the hand-placed featured displays,
// marking exactly the site's offline count as offline
function buildDisplays(): Display[] {
  const rand = seeded(42);
  const pick = <T>(list: T[]) => list[Math.floor(rand() * list.length)];
  const displays: Display[] = FEATURED.map((d, i) => ({ ...d, id: `DD-${String(i + 1).padStart(3, '0')}` }));
  SITES.forEach(site => {
    const featured = displays.filter(d => d.site === site.name);
    let offlineLeft = site.offline - featured.filter(d => d.status === 'offline').length;
    const remaining = site.total - featured.length;
    const counters = new Map<string, number>();
    for (let i = 0; i < remaining; i++) {
      const zone = site.zones[i % site.zones.length];
      const n = (counters.get(zone.name) ?? 0) + 1;
      counters.set(zone.name, n);
      // Spread the offline ones through the list instead of bunching them at the end
      const offline = offlineLeft > 0 && (remaining - i <= offlineLeft || rand() < 0.08);
      if (offline) offlineLeft--;
      const minute = 24 - Math.floor(rand() * 6);
      displays.push({
        id: `DD-${String(displays.length + 1).padStart(3, '0')}`,
        name: `${zone.name} ${pad(n + 3)}`,
        site: site.name,
        building: zone.building,
        zone: zone.name,
        level: pick(site.levels),
        type: pick(DISPLAY_TYPES),
        playlist: pick(PLAYLISTS),
        status: offline ? 'offline' : 'online',
        lastSeen: offline ? `${TODAY} 0${6 + Math.floor(rand() * 3)}:${pad(Math.floor(rand() * 60))}` : `${TODAY} 10:${pad(minute)}`,
        x: Math.round(24 + rand() * (MAP.width - 48)),
        y: Math.round(24 + rand() * (MAP.height - 48)),
      });
    }
  });
  return displays;
}

function dayLabel(offsetFromEnd: number): string {
  const d = new Date(PLAYBACK_END);
  d.setDate(d.getDate() - offsetFromEnd);
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`;
}

function niceAxis(peak: number, plot: { top: number; bottom: number }, steps = 4) {
  const raw = peak / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) ?? raw;
  const max = Math.ceil(peak / step) * step;
  const y = (v: number) => plot.bottom - (v / max) * (plot.bottom - plot.top);
  const ticks = [];
  for (let v = 0; v <= max; v += step) ticks.push({ y: y(v), label: v.toLocaleString('en-US') });
  return { y, ticks };
}

@Component({
  selector: 'app-digitaldisplay',
  imports: [CommonModule, FormsModule, Dropdown, DragScroll],
  templateUrl: './digitaldisplay.html',
  styleUrl: './digitaldisplay.css',
})
export class Digitaldisplay implements OnInit, OnDestroy {

  icons = DISPLAY_ICONS;
  tabs = DISPLAY_TABS;
  activeTab = DISPLAY_TABS[0];
  posters = POSTERS;
  playlists = PLAYLISTS;
  map = MAP;
  chartHeight = CHART_HEIGHT;
  barsWidth = 340;
  lineWidth = 340;
  totalChange = TOTAL_CHANGE;
  activePlaylists = ACTIVE_PLAYLISTS;
  playlistChange = PLAYLIST_CHANGE;

  displays: Display[] = buildDisplays();
  selected: Display = this.displays[0];

  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Live preview cycles through the selected display's scheduled content
    this.timer = setInterval(() => this.nextSlide(), ROTATE_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.resizer?.disconnect();
  }

  // ---------- Chart sizing ----------
  private zone = inject(NgZone);
  private resizer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(entries =>
    this.zone.run(() => entries.forEach(e => {
      const width = Math.round(e.contentRect.width);
      if (!width) return;
      if (e.target.classList.contains('bars-chart')) this.barsWidth = width;
      else this.lineWidth = width;
    })));

  @ViewChild('barsSvg') set barsSvg(el: ElementRef<SVGSVGElement> | undefined) {
    if (el) this.resizer?.observe(el.nativeElement);
  }

  @ViewChild('lineSvg') set lineSvg(el: ElementRef<SVGSVGElement> | undefined) {
    if (el) this.resizer?.observe(el.nativeElement);
  }

  get barsPlot() {
    return { left: 30, right: this.barsWidth - 6, top: 8, bottom: CHART_HEIGHT.bars - 30 };
  }

  get linePlot() {
    return { left: 40, right: this.lineWidth - 20, top: 10, bottom: CHART_HEIGHT.line - 20 };
  }

  posterFor(playlist: string): Poster {
    return POSTERS[PLAYLIST_POSTER[playlist]] ?? POSTERS['welcome'];
  }

  // ---------- KPIs ----------
  get onlineCount(): number {
    return this.displays.filter(d => d.status === 'online').length;
  }

  get offlineCount(): number {
    return this.displays.length - this.onlineCount;
  }

  percent(part: number): number {
    return this.displays.length ? Math.round((part / this.displays.length) * 100) : 0;
  }

  // ---------- Display status by location ----------
  statusSite = 'all';
  statusSiteOptions: DropdownOption[] = [
    { label: 'All Sites', value: 'all' },
    ...SITES.map(s => ({ label: s.name, value: s.name })),
  ];

  // All sites: one bar per site. A single site: one bar per zone.
  get statusChart() {
    const BARS = this.barsPlot;
    // Below ~72px per bar the two-line names collide, so fall back to short names
    const narrow = (BARS.right - BARS.left) / SITES.length < 72;
    const groups = this.statusSite === 'all'
      ? SITES.map(s => ({ name: s.name, label: narrow ? [s.short] : s.label, items: this.displays.filter(d => d.site === s.name) }))
      : (SITES.find(s => s.name === this.statusSite)?.zones ?? []).map(z => ({
          name: z.name,
          label: z.name.split(' '),
          items: this.displays.filter(d => d.site === this.statusSite && d.zone === z.name),
        }));
    const axis = niceAxis(Math.max(1, ...groups.map(g => g.items.length)), BARS, 5);
    const slot = (BARS.right - BARS.left) / groups.length;
    const width = Math.min(32, slot * 0.45);
    return {
      ticks: axis.ticks,
      bars: groups.map((g, i) => {
        const online = g.items.filter(d => d.status === 'online').length;
        const offline = g.items.length - online;
        const yOnline = axis.y(online);
        const yTotal = axis.y(online + offline);
        return {
          x: BARS.left + slot * i + (slot - width) / 2,
          cx: BARS.left + slot * i + slot / 2,
          width,
          label: g.label,
          online: { y: yOnline, h: BARS.bottom - yOnline },
          offline: { y: yTotal, h: yOnline - yTotal },
          tooltip: `${g.name}: ${online} online, ${offline} offline`,
        };
      }),
    };
  }

  // ---------- Content playback statistics ----------
  playbackRange = 7;
  playbackRangeOptions: DropdownOption[] = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 14 Days', value: 14 },
  ];
  hoverIndex: number | null = null;

  get playback() {
    const days = this.playbackRange;
    const plays = DAILY_PLAYS.slice(-days);
    const failedPct = FAILED_PCT.slice(-days);
    const total = plays.reduce((a, b) => a + b, 0);
    const failed = plays.reduce((sum, p, i) => sum + p * (failedPct[i] / 100), 0);
    const failedRate = Math.round((failed / total) * 100);
    const prev = PREV_PERIOD[days];
    return {
      total,
      success: 100 - failedRate,
      failed: failedRate,
      totalChange: Math.round(((total - prev.total) / prev.total) * 100),
      successChange: 100 - failedRate - prev.success,
      failedChange: failedRate - prev.failed,
    };
  }

  get lineChart() {
    const days = this.playbackRange;
    const values = DAILY_PLAYS.slice(-days);
    const LINE = this.linePlot;
    const axis = niceAxis(Math.max(...values) * 1.1, LINE);
    const x = (i: number) => LINE.left + (i / (values.length - 1)) * (LINE.right - LINE.left);
    const pts = values.map((v, i) => ({ x: x(i), y: axis.y(v), value: v, label: dayLabel(days - 1 - i) }));
    const line = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const slot = (LINE.right - LINE.left) / (values.length - 1);
    // Roughly one date label per 52px so they never overlap
    const every = Math.ceil(values.length / Math.max(2, Math.floor((LINE.right - LINE.left) / 52)));
    return {
      pts,
      line,
      area: `${x(0)},${LINE.bottom} ${line} ${x(values.length - 1)},${LINE.bottom}`,
      yTicks: axis.ticks,
      xTicks: pts.filter((_, i) => (values.length - 1 - i) % every === 0),
      hits: pts.map(p => ({ x: p.x - slot / 2, width: slot })),
    };
  }

  get hoverPoint() {
    if (this.hoverIndex === null) return null;
    const p = this.lineChart.pts[this.hoverIndex];
    if (!p) return null;
    // Keep the tooltip inside the plot
    const plot = this.linePlot;
    const boxX = Math.min(plot.right - 84, Math.max(plot.left, p.x - 42));
    return { ...p, boxX, boxY: Math.max(0, p.y - 40) };
  }

  // ---------- Filters ----------
  siteFilter = 'all';
  buildingFilter = 'all';
  zoneFilter = 'all';
  typeFilter = 'all';
  statusFilter = 'all';

  siteOptions: DropdownOption[] = [{ label: 'All Sites', value: 'all' }, ...SITES.map(s => ({ label: s.name, value: s.name }))];
  typeOptions: DropdownOption[] = [{ label: 'All Types', value: 'all' }, ...DISPLAY_TYPES.map(t => ({ label: t, value: t }))];
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' },
  ];

  private distinct(values: string[]): string[] {
    return [...new Set(values)].sort();
  }

  // Building and zone lists narrow to the chosen site (and building)
  get buildingOptions(): DropdownOption[] {
    const pool = this.displays.filter(d => this.siteFilter === 'all' || d.site === this.siteFilter);
    return [{ label: 'All Buildings', value: 'all' }, ...this.distinct(pool.map(d => d.building)).map(b => ({ label: b, value: b }))];
  }

  get zoneOptions(): DropdownOption[] {
    const pool = this.displays.filter(d =>
      (this.siteFilter === 'all' || d.site === this.siteFilter) &&
      (this.buildingFilter === 'all' || d.building === this.buildingFilter));
    return [{ label: 'All Zones', value: 'all' }, ...this.distinct(pool.map(d => d.zone)).map(z => ({ label: z, value: z }))];
  }

  onSiteChange(): void {
    this.buildingFilter = 'all';
    this.zoneFilter = 'all';
    this.onFilterChange();
  }

  onBuildingChange(): void {
    this.zoneFilter = 'all';
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.page = 1;
  }

  // ---------- Table ----------
  page = 1;
  checked = new Set<string>();

  get filteredDisplays(): Display[] {
    return this.displays.filter(d =>
      (this.siteFilter === 'all' || d.site === this.siteFilter) &&
      (this.buildingFilter === 'all' || d.building === this.buildingFilter) &&
      (this.zoneFilter === 'all' || d.zone === this.zoneFilter) &&
      (this.typeFilter === 'all' || d.type === this.typeFilter) &&
      (this.statusFilter === 'all' || d.status === this.statusFilter));
  }

  get pagedDisplays(): Display[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredDisplays.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDisplays.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredDisplays.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredDisplays.length);
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

  toggleRow(display: Display): void {
    this.checked.has(display.id) ? this.checked.delete(display.id) : this.checked.add(display.id);
  }

  get allPageChecked(): boolean {
    return this.pagedDisplays.length > 0 && this.pagedDisplays.every(d => this.checked.has(d.id));
  }

  toggleAllPage(): void {
    const check = !this.allPageChecked;
    this.pagedDisplays.forEach(d => (check ? this.checked.add(d.id) : this.checked.delete(d.id)));
  }

  // ---------- Menus ----------
  uploadMenuOpen = false;
  assignMenuOpen = false;
  moreMenuOpen = false;
  rowMenuId: string | null = null;
  toast = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  private notify(message: string): void {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 2600);
  }

  // Assigns to the checked displays, or the selected one when nothing is checked
  assignPlaylist(playlist: string): void {
    const targets = this.checked.size ? this.displays.filter(d => this.checked.has(d.id)) : [this.selected];
    targets.forEach(d => (d.playlist = playlist));
    this.assignMenuOpen = false;
    this.checked.clear();
    this.slideIndex = 0;
    this.notify(`${playlist} assigned to ${targets.length} display${targets.length === 1 ? '' : 's'}`);
  }

  rowAction(display: Display, action: 'refresh' | 'restart' | 'select'): void {
    this.rowMenuId = null;
    if (action === 'select') {
      this.selectDisplay(display);
      return;
    }
    if (action === 'restart' && display.status === 'offline') {
      display.status = 'online';
      display.lastSeen = `${TODAY} ${NOW}`;
      this.notify(`${display.name} restarted and is back online`);
    } else {
      display.lastSeen = `${TODAY} ${NOW}`;
      this.notify(`${display.name} content refreshed`);
    }
  }

  notifyAction(label: string): void {
    this.uploadMenuOpen = false;
    this.moreMenuOpen = false;
    this.notify(`${label} coming soon`);
  }

  // ---------- Selected display: preview, map, schedule ----------
  slideIndex = 0;

  selectDisplay(display: Display): void {
    this.selected = display;
    this.slideIndex = 0;
    this.mapLevel = `${display.site}|${display.level}`;
    this.zoom = 1;
  }

  get schedule() {
    const slots = scheduleFor(this.selected.playlist);
    // A slot runs until the next one starts
    const activeIndex = slots.reduce((idx, s, i) => (s.time <= NOW ? i : idx), -1);
    return slots.map((s, i) => ({
      ...s,
      poster: POSTERS[s.poster],
      state: i < activeIndex ? 'Completed' : i === activeIndex ? 'Active' : 'Upcoming',
    }));
  }

  get slides(): Poster[] {
    return this.schedule.map(s => s.poster);
  }

  get currentSlide(): Poster {
    return this.slides[this.slideIndex] ?? this.posterFor(this.selected.playlist);
  }

  nextSlide(): void {
    if (this.selected.status === 'offline') return;
    this.slideIndex = (this.slideIndex + 1) % this.slides.length;
  }

  showSlide(index: number): void {
    this.slideIndex = index;
    // Restart the rotation so the chosen slide gets its full time on screen
    clearInterval(this.timer);
    this.timer = setInterval(() => this.nextSlide(), ROTATE_MS);
  }

  // ---------- Display locations map ----------
  mapLevel = `${this.selected.site}|${this.selected.level}`;
  mapLevelOptions: DropdownOption[] = SITES.flatMap(s => s.levels.map(l => ({ label: `${s.name} - ${l}`, value: `${s.name}|${l}` })));
  zoom = 1;

  get mapPins(): Display[] {
    const [site, level] = this.mapLevel.split('|');
    return this.displays.filter(d => d.site === site && d.level === level);
  }

  get viewBox(): string {
    // Zoom towards the selected pin when it is on this level, otherwise the centre
    const focus = this.mapPins.includes(this.selected) ? this.selected : { x: MAP.width / 2, y: MAP.height / 2 };
    const w = MAP.width / this.zoom;
    const h = MAP.height / this.zoom;
    const x = Math.min(MAP.width - w, Math.max(0, focus.x - w / 2));
    const y = Math.min(MAP.height - h, Math.max(0, focus.y - h / 2));
    return `${x} ${y} ${w} ${h}`;
  }

  setZoom(step: number): void {
    this.zoom = Math.min(MAX_ZOOM, Math.max(1, this.zoom + step));
  }

  // Tooltip box for the selected pin, kept inside the map
  get pinLabel() {
    if (!this.mapPins.includes(this.selected)) return null;
    const width = Math.max(64, this.selected.name.length * 4.6 + 16);
    const x = Math.min(MAP.width - width - 4, Math.max(4, this.selected.x - width / 2));
    const above = this.selected.y > 50;
    return { x, y: above ? this.selected.y - 44 : this.selected.y + 10, width };
  }

  // Close popover menus when clicking elsewhere. composedPath() is used
  // because a dropdown option removes itself from the DOM on click.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const path = event.composedPath();
    const inside = (cls: string) => path.some(el => el instanceof Element && el.classList.contains(cls));
    if (this.uploadMenuOpen && !inside('upload-split')) this.uploadMenuOpen = false;
    if (this.assignMenuOpen && !inside('assign-wrap')) this.assignMenuOpen = false;
    if (this.moreMenuOpen && !inside('more-wrap')) this.moreMenuOpen = false;
    if (this.rowMenuId && !inside('row-menu-wrap')) this.rowMenuId = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.uploadMenuOpen = this.assignMenuOpen = this.moreMenuOpen = false;
    this.rowMenuId = null;
  }
}
