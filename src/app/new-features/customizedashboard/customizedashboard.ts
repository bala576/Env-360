import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  ACCESS_LEVELS,
  ACCESS_SUMMARY,
  ALERT_SOURCES,
  AlertRecipient,
  AlertRule,
  APPEARANCE_ALARM_CATEGORIES,
  APPEARANCE_DASHBOARDS,
  APPEARANCE_DEVICE_STATUS,
  APPEARANCE_KPIS,
  APPEARANCE_TREND,
  AVAILABLE_WIDGETS,
  CHART_STYLES,
  CATEGORY_FILTERS,
  COLUMN_OPTIONS,
  CUSTOMIZE_ICONS,
  DASHBOARD_STYLES,
  CategoryFilter,
  DATA_DISPLAY_OPTIONS,
  DATE_RANGE_CHIPS,
  DEFAULT_DATE_RANGES,
  FILTER_DEFINITIONS,
  DATE_FORMATS,
  DEFAULT_PREFERENCES,
  DEFAULT_SELECTED_IDS,
  DashboardPreferences,
  FilterSetting,
  DashboardVersionMeta,
  DashboardWidget,
  EXPORT_FORMATS,
  FONT_SCALES,
  LAYOUT_TEMPLATES,
  LayoutTemplate,
  LINK_SCOPES,
  MEMBER_ACCESS,
  MemberAccess,
  MANAGE_KPIS,
  MAX_RETRIES,
  MAX_SELECTED_WIDGETS,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_TYPES,
  NUMBER_FORMATS,
  PREVIEW_AQI_TREND,
  PREVIEW_RECENT_ALERTS,
  PREVIEW_ROLES,
  PREVIEW_ALARMS,
  PREVIEW_KPIS,
  PREVIEW_METRICS,
  PREVIEW_TREND,
  PRIMARY_COLORS,
  REFRESH_OPTIONS,
  REFRESH_SCOPES,
  RECIPIENT_ROLES,
  RETRY_INTERVALS,
  RULE_CONDITIONS,
  RULE_PARAMETERS,
  SEED_VERSIONS,
  SEVERITY_LEVELS,
  SHARE_TREND,
  ShareMember,
  RefreshSchedule,
  SETTINGS_SECTIONS,
  SITE_OPTIONS,
  SettingsSection,
  TEMPERATURE_UNITS,
  THEME_MODES,
  TIME_ZONES,
  UPDATE_METHODS,
  WEEKDAYS,
  WIDGET_CORNERS,
  WIDGET_DENSITIES,
  WidgetDensity,
  WIDGET_FILTERS,
} from './customizedashboard.data';
import { WidgetPreview } from './widget-preview/widget-preview';

type CustomizeTab = 'widgets' | 'layout' | 'settings';

interface DashboardSettings {
  widgetIds: string[];
  layout: string;
  columns: number;
  spans: Record<string, number>;
  filters: Record<string, string>;
  refreshInterval: number;
  showTitles: boolean;
  showTimeRange: boolean;
  showWidgetMenu: boolean;
  showGrid: boolean;
  compactMode: boolean;
  preferences: DashboardPreferences;
}

// Template that matches a plain column count picked from the settings dropdown
const COLUMN_TEMPLATES: Record<number, string> = { 1: 'one', 2: 'two', 3: 'three' };

// Preview chart plot area (SVG user units)
const CHART = { width: 300, height: 120, left: 28, bottom: 18, top: 6 };

// Appearance preview trend plot (SVG user units). The SVG stretches to fill its card,
// so axis labels are HTML positioned by percentage and strokes don't scale.
const AP_CHART = { width: 300, height: 100, pad: 4, max: 100 };
const apY = (v: number) => AP_CHART.height - (AP_CHART.height - AP_CHART.pad) * (v / AP_CHART.max);

// Catmull-Rom spline through the points, expressed as cubic Béziers
function smoothPath(points: { x: number; y: number }[]): string {
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// Alerts preview sparkline (SVG user units, stretched to card width)
const AQI_CHART = { width: 200, height: 60, min: 160, max: 190 };

// Sharing preview temperature trend (stretched SVG, °C range 15–35)
const SHARE_CHART = { width: 300, height: 100, pad: 4, min: 15, max: 35 };
const shareY = (v: number) =>
  SHARE_CHART.height - (SHARE_CHART.height - SHARE_CHART.pad) * ((v - SHARE_CHART.min) / (SHARE_CHART.max - SHARE_CHART.min));

interface TrendLine {
  label: string;
  color: string;
  line: string;
  area: string;
  points: { x: number; y: number }[];
}

const STORAGE_KEY = 'env360.dashboard.customization';
const VERSIONS_KEY = 'env360.dashboard.versions';
const MAX_VERSIONS = 10;

// A saved version; seeded history entries carry no snapshot and restore to defaults
interface DashboardVersion extends DashboardVersionMeta {
  settings?: DashboardSettings;
}

const formatStamp = (d: Date): string =>
  `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const defaultFilters = (): Record<string, string> =>
  Object.fromEntries(Object.entries(WIDGET_FILTERS).map(([id, f]) => [id, f.value]));

const DEFAULT_SETTINGS: DashboardSettings = {
  widgetIds: [...DEFAULT_SELECTED_IDS],
  layout: 'two',
  columns: 2,
  spans: {},
  filters: defaultFilters(),
  refreshInterval: 300,
  showTitles: true,
  showTimeRange: true,
  showWidgetMenu: true,
  showGrid: true,
  compactMode: false,
  preferences: DEFAULT_PREFERENCES,
};

@Component({
  selector: 'app-customizedashboard',
  imports: [CommonModule, FormsModule, RouterModule, WidgetPreview],
  templateUrl: './customizedashboard.html',
  styleUrls: [
    './customizedashboard.css',
    './customizedashboard-settings.css',
    './customizedashboard-refresh.css',
    './customizedashboard-appearance.css',
    './customizedashboard-alerts.css',
    './customizedashboard-sharing.css',
    './customizedashboard-manage.css',
  ],
})
export class Customizedashboard {
  private readonly router = inject(Router);

  readonly icons = CUSTOMIZE_ICONS;
  readonly categories = CATEGORY_FILTERS;
  readonly layoutTemplates = LAYOUT_TEMPLATES;
  readonly columnOptions = COLUMN_OPTIONS;
  readonly refreshOptions = REFRESH_OPTIONS;
  readonly maxSelected = MAX_SELECTED_WIDGETS;
  readonly filterOptions = WIDGET_FILTERS;
  readonly settingsSections = SETTINGS_SECTIONS;
  readonly themeModes = THEME_MODES;
  readonly primaryColors = PRIMARY_COLORS;
  readonly dateRanges = DEFAULT_DATE_RANGES;
  readonly dateRangeChips = DATE_RANGE_CHIPS;
  readonly filterDefinitions = FILTER_DEFINITIONS;
  readonly siteOptions = SITE_OPTIONS;
  readonly dataDisplayOptions = DATA_DISPLAY_OPTIONS;
  readonly numberFormats = NUMBER_FORMATS;
  readonly temperatureUnits = TEMPERATURE_UNITS;
  readonly dateFormats = DATE_FORMATS;
  readonly accessLevels = ACCESS_LEVELS;
  readonly memberAccessOptions = MEMBER_ACCESS;
  readonly linkScopes = LINK_SCOPES;
  readonly previewRoles = PREVIEW_ROLES;
  readonly exportFormats = EXPORT_FORMATS;
  readonly manageKpis = MANAGE_KPIS;
  readonly shareUrl = 'https://app.environment360.ai/d/8f2a3c9b-1e4d-4b7a-9c1e-2f5g8h9i01k';
  readonly shareChart = SHARE_CHART;
  readonly shareYTicks = [15, 20, 25, 30, 35].map((v) => ({ label: v, y: shareY(v), pct: (shareY(v) / SHARE_CHART.height) * 100 }));
  readonly sharePoints = SHARE_TREND.map((v, i, all) => ({ x: SHARE_CHART.pad + ((SHARE_CHART.width - SHARE_CHART.pad * 2) / (all.length - 1)) * i, y: shareY(v) }));
  readonly shareLine = this.sharePoints.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  readonly shareArea = `${this.shareLine} L${this.sharePoints[this.sharePoints.length - 1].x.toFixed(1)} ${SHARE_CHART.height} L${SHARE_CHART.pad} ${SHARE_CHART.height} Z`;
  readonly previewKpis = PREVIEW_KPIS;
  readonly refreshScopes = REFRESH_SCOPES;
  readonly updateMethods = UPDATE_METHODS;
  readonly weekdays = WEEKDAYS;
  readonly timeZones = TIME_ZONES;
  readonly retryIntervals = RETRY_INTERVALS;
  readonly maxRetryOptions = MAX_RETRIES;
  readonly previewMetrics = PREVIEW_METRICS;
  readonly previewAlarms = PREVIEW_ALARMS;
  readonly chart = CHART;
  readonly dashboardStyles = DASHBOARD_STYLES;
  readonly widgetDensities = WIDGET_DENSITIES;
  readonly widgetCorners = WIDGET_CORNERS;
  readonly fontScales = FONT_SCALES;
  readonly chartStyles = CHART_STYLES;
  readonly appearanceDashboards = APPEARANCE_DASHBOARDS;
  readonly appearanceKpis = APPEARANCE_KPIS;
  readonly deviceStatus = APPEARANCE_DEVICE_STATUS;
  readonly alarmCategories = APPEARANCE_ALARM_CATEGORIES;
  readonly alarmMax = Math.max(...APPEARANCE_ALARM_CATEGORIES.map((c) => c.value));
  readonly apChart = AP_CHART;
  readonly apYTicks = [20, 40, 60, 80, 100].map((v) => ({ label: v, y: apY(v), pct: (apY(v) / AP_CHART.height) * 100 }));
  // Donut arcs: circumference of r=15.9 is ~100, so dash lengths equal percentages
  readonly donutArcs = APPEARANCE_DEVICE_STATUS.map((s, i, all) => ({
    color: s.color,
    dash: `${s.pct} ${100 - s.pct}`,
    offset: 25 - all.slice(0, i).reduce((sum, x) => sum + x.pct, 0),
  }));
  readonly alertSources = ALERT_SOURCES;
  readonly severityLevels = SEVERITY_LEVELS;
  readonly notificationChannels = NOTIFICATION_CHANNELS;
  readonly ruleParameters = RULE_PARAMETERS;
  readonly ruleConditions = RULE_CONDITIONS;
  readonly recipientRoles = RECIPIENT_ROLES;
  readonly notificationTypes = NOTIFICATION_TYPES;
  readonly aqiChart = AQI_CHART;
  readonly aqiPoints = PREVIEW_AQI_TREND.map((v, i, all) => ({
    x: (AQI_CHART.width / (all.length - 1)) * i,
    y: AQI_CHART.height - ((v - AQI_CHART.min) / (AQI_CHART.max - AQI_CHART.min)) * AQI_CHART.height,
  }));
  readonly aqiLine = this.aqiPoints.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  readonly aqiArea = `${this.aqiLine} L${AQI_CHART.width} ${AQI_CHART.height} L0 ${AQI_CHART.height} Z`;
  readonly chartXTicks = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

  activeTab: CustomizeTab = 'widgets';
  activeCategory: CategoryFilter['key'] = 'all';
  searchTerm = '';

  selected: DashboardWidget[] = [];
  layout = DEFAULT_SETTINGS.layout;
  columns = DEFAULT_SETTINGS.columns;
  spans: Record<string, number> = {};
  filters: Record<string, string> = {};
  refreshInterval = DEFAULT_SETTINGS.refreshInterval;
  showTitles = DEFAULT_SETTINGS.showTitles;
  showTimeRange = DEFAULT_SETTINGS.showTimeRange;
  showWidgetMenu = DEFAULT_SETTINGS.showWidgetMenu;
  showGrid = DEFAULT_SETTINGS.showGrid;
  compactMode = DEFAULT_SETTINGS.compactMode;
  prefs: DashboardPreferences = { ...DEFAULT_PREFERENCES };

  settingsSection: SettingsSection = 'general';
  previewMetric = PREVIEW_METRICS[0];
  trendLines: TrendLine[] = [];
  trendYTicks: { y: number; label: string }[] = [];
  editingSchedule: number | null = null;
  appearanceDashboard = APPEARANCE_DASHBOARDS[0];
  appearanceRange = 'Last 24 Hours';
  apTrend: TrendLine[] = [];
  editingRule: number | null = null;
  memberSearch = '';
  memberFilter: MemberAccess | 'all' = 'all';
  selectedMembers = new Set<ShareMember>();
  editingMember: ShareMember | null = null;
  previewRole = 'Viewer View';
  showLinkSettings = false;
  versions: DashboardVersion[] = this.loadVersions();
  restoredVersion: string | null = null;
  editingRecipient: number | null = null;
  notice = '';

  openMenuId: string | null = null;

  private dragIndex: number | null = null;
  dragOverIndex: number | null = null;
  dropZoneActive = false;

  constructor() {
    this.applySettings(this.loadSettings());
    this.selectMetric(this.previewMetric);
    this.buildAppearanceTrend();
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.openMenuId = null;
  }

  get filteredWidgets(): DashboardWidget[] {
    const term = this.searchTerm.trim().toLowerCase();
    return AVAILABLE_WIDGETS.filter(
      (w) =>
        (this.activeCategory === 'all' || w.category === this.activeCategory) &&
        (!term || w.title.toLowerCase().includes(term) || w.description.toLowerCase().includes(term)),
    );
  }

  get isFull(): boolean {
    return this.selected.length >= this.maxSelected;
  }

  get gridTemplate(): string {
    const template = LAYOUT_TEMPLATES.find((t) => t.key === this.layout)?.template;
    return template ?? `repeat(${this.columns}, minmax(0, 1fr))`;
  }

  categoryCount(key: CategoryFilter['key']): number {
    return key === 'all' ? AVAILABLE_WIDGETS.length : AVAILABLE_WIDGETS.filter((w) => w.category === key).length;
  }

  isSelected(widget: DashboardWidget): boolean {
    return this.selected.some((w) => w.id === widget.id);
  }

  addWidget(widget: DashboardWidget): void {
    if (this.isSelected(widget) || this.isFull) return;
    this.selected = [...this.selected, widget];
  }

  removeWidget(index: number): void {
    this.selected = this.selected.filter((_, i) => i !== index);
  }

  // ---------- Layout templates & settings ----------
  selectTemplate(template: LayoutTemplate): void {
    this.layout = template.key;
    this.columns = template.columns;
  }

  onColumnsChange(columns: number): void {
    this.columns = columns;
    const sidebar = this.layout === 'left-sidebar' || this.layout === 'right-sidebar';
    if (sidebar && columns === 2) return;
    this.layout = COLUMN_TEMPLATES[columns] ?? 'custom';
  }

  thumbArea(cell: [number, number, number, number]): string {
    const [col, row, colSpan, rowSpan] = cell;
    return `${row} / ${col} / span ${rowSpan} / span ${colSpan}`;
  }

  spanOf(widget: DashboardWidget): number {
    return Math.min(this.spans[widget.id] ?? 1, this.columns);
  }

  toggleMenu(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  widen(widget: DashboardWidget): void {
    this.spans = { ...this.spans, [widget.id]: Math.min(this.spanOf(widget) + 1, this.columns) };
  }

  narrow(widget: DashboardWidget): void {
    this.spans = { ...this.spans, [widget.id]: Math.max(this.spanOf(widget) - 1, 1) };
  }

  removeById(id: string): void {
    this.selected = this.selected.filter((w) => w.id !== id);
  }

  resetLayout(): void {
    this.layout = DEFAULT_SETTINGS.layout;
    this.columns = DEFAULT_SETTINGS.columns;
    this.spans = {};
    this.filters = defaultFilters();
    this.showGrid = true;
  }

  // ---------- Settings ----------
  get previewDark(): boolean {
    if (this.prefs.themeMode === 'system') {
      return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.prefs.themeMode === 'dark';
  }

  resetPreferences(): void {
    this.prefs = {
      ...DEFAULT_PREFERENCES,
      filters: this.cloneFilters(DEFAULT_PREFERENCES.filters),
      schedules: this.cloneSchedules(DEFAULT_PREFERENCES.schedules),
      ...this.cloneAlerts(DEFAULT_PREFERENCES),
      members: this.cloneMembers(DEFAULT_PREFERENCES.members),
    };
    this.selectedMembers = new Set();
    this.editingMember = null;
    this.editingSchedule = null;
    this.editingRule = null;
    this.editingRecipient = null;
    this.compactMode = this.prefs.density === 'compact';
    this.buildAppearanceTrend();
    this.notice = 'Settings restored to defaults.';
  }

  get appliedFilters(): string[] {
    const range = this.prefs.defaultTimeRange === 'Custom Range' && this.prefs.customFrom && this.prefs.customTo
      ? `${this.prefs.customFrom} – ${this.prefs.customTo}`
      : this.prefs.defaultTimeRange;
    const enabled = FILTER_DEFINITIONS.filter((f) => this.prefs.filters[f.key]?.enabled).map((f) => this.prefs.filters[f.key].value);
    return [range, this.prefs.defaultSite, ...enabled];
  }

  clearFilters(): void {
    this.prefs.defaultSite = 'All Sites';
    for (const f of FILTER_DEFINITIONS) {
      this.prefs.filters[f.key] = { enabled: false, value: f.options[0] };
    }
  }

  createFilter(): void {
    this.notice = 'Custom filter builder is coming soon.';
  }

  manageSegments(): void {
    this.notice = 'Saved segments are coming soon.';
  }

  viewDashboard(): void {
    this.router.navigate(['/new-dashboard']);
  }

  // ---------- Appearance ----------
  setDensity(density: WidgetDensity): void {
    this.prefs.density = density;
    this.compactMode = density === 'compact';
  }

  buildAppearanceTrend(): void {
    const { width, height, pad } = AP_CHART;
    const baseY = height;
    this.apTrend = APPEARANCE_TREND.map((s) => {
      const step = (width - pad * 2) / (s.values.length - 1);
      const points = s.values.map((v, i) => ({ x: pad + i * step, y: apY(v) }));
      const line = this.prefs.smoothLines
        ? smoothPath(points)
        : points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
      const last = points[points.length - 1];
      return {
        label: s.label,
        color: s.color,
        line,
        area: `${line} L${last.x.toFixed(1)} ${baseY} L${points[0].x.toFixed(1)} ${baseY} Z`,
        points,
      };
    });
  }

  // ---------- Sharing & Access ----------
  get filteredMembers(): ShareMember[] {
    const term = this.memberSearch.trim().toLowerCase();
    return this.prefs.members.filter(
      (m) =>
        (this.memberFilter === 'all' || m.access === this.memberFilter) &&
        (!term || m.name.toLowerCase().includes(term) || m.detail.toLowerCase().includes(term)),
    );
  }

  initials(member: ShareMember): string {
    return member.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
  }

  setMemberAccess(member: ShareMember, access: MemberAccess): void {
    member.access = access;
    member.view = true;
    member.edit = access !== 'View';
    member.share = access === 'Owner';
    if (access === 'Owner') member.expiry = '';
  }

  get allMembersSelected(): boolean {
    const list = this.filteredMembers;
    return list.length > 0 && list.every((m) => this.selectedMembers.has(m));
  }

  toggleAllMembers(checked: boolean): void {
    this.selectedMembers = new Set(checked ? this.filteredMembers : []);
  }

  toggleMember(member: ShareMember, checked: boolean): void {
    const next = new Set(this.selectedMembers);
    if (checked) next.add(member);
    else next.delete(member);
    this.selectedMembers = next;
  }

  addMember(): void {
    const member: ShareMember = {
      name: '', detail: '', type: 'User', count: 1, guest: false,
      access: 'View', view: true, edit: false, share: false, expiry: '',
    };
    this.prefs.members = [...this.prefs.members, member];
    this.memberSearch = '';
    this.memberFilter = 'all';
    this.editingMember = member;
  }

  removeMember(member: ShareMember): void {
    this.prefs.members = this.prefs.members.filter((m) => m !== member);
    this.toggleMember(member, false);
    if (this.editingMember === member) this.editingMember = null;
    this.openMenuId = null;
  }

  removeSelectedMembers(): void {
    this.prefs.members = this.prefs.members.filter((m) => m.access === 'Owner' || !this.selectedMembers.has(m));
    this.selectedMembers = new Set();
  }

  editMember(member: ShareMember): void {
    this.editingMember = this.editingMember === member ? null : member;
    this.openMenuId = null;
  }

  async copyShareLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareUrl);
      this.notice = 'Link copied to clipboard.';
    } catch {
      this.notice = 'Copy failed. Select the link and copy it manually.';
    }
  }

  get accessSummary(): { label: string; color: string; count: number; pct: number }[] {
    const counts: Record<string, number> = { owners: 0, editors: 0, viewers: 0, guests: 0 };
    for (const m of this.prefs.members) {
      const key = m.access === 'Owner' ? 'owners' : m.access === 'Edit' ? 'editors' : m.guest ? 'guests' : 'viewers';
      counts[key] += m.count;
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return ACCESS_SUMMARY.map((s) => ({ label: s.label, color: s.color, count: counts[s.key], pct: Math.round((counts[s.key] / total) * 100) }));
  }

  get ownerName(): string {
    return this.prefs.members.find((m) => m.access === 'Owner')?.name || 'You';
  }

  get groupCount(): number {
    return this.prefs.members.filter((m) => m.type === 'Group').length;
  }

  get totalMembers(): number {
    return this.prefs.members.reduce((sum, m) => sum + m.count, 0);
  }

  // Donut arcs on a circle with circumference 100 (r = 15.9)
  get accessArcs(): { color: string; dash: string; offset: number }[] {
    const total = this.totalMembers || 1;
    let before = 0;
    return this.accessSummary.map((s) => {
      const len = (s.count / total) * 100;
      const arc = { color: s.color, dash: `${len} ${100 - len}`, offset: 25 - before };
      before += len;
      return arc;
    });
  }

  get previewAccessNote(): string {
    if (!this.prefs.sharingEnabled || this.prefs.accessLevel === 'private') return 'Private (Only you)';
    if (this.previewRole === 'Owner View') return 'You own this dashboard';
    if (this.previewRole === 'Editor View') return 'Shared with you (Can Edit)';
    return 'Shared with you (View Only)';
  }

  get previewCanEdit(): boolean {
    return this.previewRole !== 'Viewer View';
  }

  private cloneMembers(members: ShareMember[] | undefined): ShareMember[] {
    return (members ?? DEFAULT_PREFERENCES.members).map((m) => ({ ...m }));
  }

  // ---------- Alerts & Notifications ----------
  severityColor(label: string): string {
    return SEVERITY_LEVELS.find((s) => s.label === label || s.key === label)?.color ?? '#6b7280';
  }

  get previewAlerts(): typeof PREVIEW_RECENT_ALERTS {
    return PREVIEW_RECENT_ALERTS.filter((a) => this.prefs.severities[a.severity]);
  }

  get criticalActive(): boolean {
    return this.prefs.alertsEnabled && this.prefs.severities['critical'];
  }

  addRule(): void {
    this.prefs.alertRules = [...this.prefs.alertRules, { parameter: RULE_PARAMETERS[0], condition: RULE_CONDITIONS[0], threshold: '', severity: 'High' }];
    this.editingRule = this.prefs.alertRules.length - 1;
  }

  toggleEditRule(index: number): void {
    this.editingRule = this.editingRule === index ? null : index;
  }

  deleteRule(index: number): void {
    this.prefs.alertRules = this.prefs.alertRules.filter((_, i) => i !== index);
    this.editingRule = this.shiftEditing(this.editingRule, index);
  }

  addRecipient(): void {
    this.prefs.recipients = [...this.prefs.recipients, { name: '', role: RECIPIENT_ROLES[3], contact: '', types: NOTIFICATION_TYPES[0] }];
    this.editingRecipient = this.prefs.recipients.length - 1;
  }

  toggleEditRecipient(index: number): void {
    this.editingRecipient = this.editingRecipient === index ? null : index;
  }

  deleteRecipient(index: number): void {
    this.prefs.recipients = this.prefs.recipients.filter((_, i) => i !== index);
    this.editingRecipient = this.shiftEditing(this.editingRecipient, index);
  }

  // Keep the edited row pointing at the same item after a row is removed
  private shiftEditing(editing: number | null, removed: number): number | null {
    if (editing === null || editing === removed) return null;
    return editing > removed ? editing - 1 : editing;
  }

  private cloneAlerts(p: Partial<DashboardPreferences> | undefined) {
    const d = DEFAULT_PREFERENCES;
    return {
      alertSources: { ...d.alertSources, ...p?.alertSources },
      severities: { ...d.severities, ...p?.severities },
      channels: { ...d.channels, ...p?.channels },
      alertRules: (p?.alertRules ?? d.alertRules).map((r) => ({ ...r })),
      recipients: (p?.recipients ?? d.recipients).map((r) => ({ ...r })),
    };
  }

  // ---------- Refresh & Auto Update ----------
  get refreshShortLabel(): string {
    if (!this.prefs.autoRefresh) return 'Off';
    const s = this.refreshInterval;
    return s < 60 ? `${s} sec` : `${s / 60} min`;
  }

  selectMetric(metric: string): void {
    this.previewMetric = metric;
    const trend = PREVIEW_TREND[metric];
    const { width, height, left, bottom, top } = CHART;
    const plotH = height - bottom - top;
    const toY = (v: number) => top + plotH * (1 - (v - trend.min) / (trend.max - trend.min));
    const baseY = height - bottom;

    this.trendLines = trend.series.map((s) => {
      const step = (width - left) / (s.values.length - 1);
      const points = s.values.map((v, i) => ({ x: left + i * step, y: toY(v) }));
      const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
      return { label: s.label, color: s.color, line, area: `${line} L${width} ${baseY} L${left} ${baseY} Z`, points };
    });

    const ticks = 4;
    this.trendYTicks = Array.from({ length: ticks + 1 }, (_, i) => {
      const v = trend.min + ((trend.max - trend.min) * i) / ticks;
      return { y: toY(v), label: Number.isInteger(v) ? String(v) : v.toFixed(1) };
    });
  }

  get trendUnit(): string {
    return PREVIEW_TREND[this.previewMetric].unit;
  }

  hasDay(schedule: RefreshSchedule, day: string): boolean {
    return schedule.days.includes(day);
  }

  toggleDay(schedule: RefreshSchedule, day: string): void {
    schedule.days = this.hasDay(schedule, day)
      ? schedule.days.filter((d) => d !== day)
      : WEEKDAYS.filter((d) => d === day || schedule.days.includes(d));
  }

  addSchedule(): void {
    this.prefs.schedules = [
      ...this.prefs.schedules,
      { name: 'New Schedule', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], time: '12:00', timeZone: TIME_ZONES[0] },
    ];
    this.editingSchedule = this.prefs.schedules.length - 1;
  }

  toggleEditSchedule(index: number): void {
    this.editingSchedule = this.editingSchedule === index ? null : index;
  }

  deleteSchedule(index: number): void {
    this.prefs.schedules = this.prefs.schedules.filter((_, i) => i !== index);
    if (this.editingSchedule === index) this.editingSchedule = null;
    else if (this.editingSchedule !== null && this.editingSchedule > index) this.editingSchedule--;
  }

  private cloneSchedules(schedules: RefreshSchedule[]): RefreshSchedule[] {
    return schedules.map((s) => ({ ...s, days: [...s.days] }));
  }

  private cloneFilters(filters: Record<string, FilterSetting>): Record<string, FilterSetting> {
    return Object.fromEntries(Object.entries(filters).map(([k, f]) => [k, { ...f }]));
  }

  // ---------- Reset & Manage ----------
  get currentVersion(): DashboardVersion | undefined {
    return this.versions[0];
  }

  resetDashboard(): void {
    if (!confirm('Reset this dashboard to the default layout and settings?')) return;
    this.resetToDefault();
    this.notice = 'Dashboard reset to defaults. Apply settings to save.';
  }

  exportConfiguration(format: string): void {
    this.openMenuId = null;
    const settings = this.currentSettings();
    const base = (this.prefs.name || 'dashboard').trim().replace(/[^\w-]+/g, '-').toLowerCase();
    const [content, type, ext] =
      format === 'csv'
        ? [this.toCsv(settings), 'text/csv', 'csv']
        : [JSON.stringify({ app: 'Environment360', exportedAt: new Date().toISOString(), settings }, null, 2), 'application/json', 'json'];
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${base}-config.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    this.notice = `Configuration exported as ${ext.toUpperCase()}.`;
  }

  importConfiguration(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text);
        const settings = parsed?.settings ?? parsed;
        if (!settings || !Array.isArray(settings.widgetIds) || typeof settings.preferences !== 'object') {
          throw new Error('missing fields');
        }
        this.applySettings({ ...DEFAULT_SETTINGS, ...settings });
        this.notice = `Imported "${file.name}". Apply settings to save.`;
      } catch {
        this.notice = `"${file.name}" is not a valid dashboard configuration (JSON export expected).`;
      }
    });
  }

  restoreVersion(version: DashboardVersion): void {
    this.openMenuId = null;
    this.applySettings(version.settings ?? DEFAULT_SETTINGS);
    this.restoredVersion = version.version;
    this.notice = `Restored ${version.version}. Apply settings to save it as the current version.`;
  }

  deleteVersion(version: DashboardVersion): void {
    this.openMenuId = null;
    this.versions = this.versions.filter((v) => v !== version);
    this.saveVersions();
  }

  private nextVersion(): string {
    const [major, minor] = (this.currentVersion?.version ?? 'v0.0').slice(1).split('.').map(Number);
    return `v${major}.${(minor || 0) + 1}`;
  }

  private loadVersions(): DashboardVersion[] {
    try {
      const raw = localStorage.getItem(VERSIONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore corrupt or unavailable storage
    }
    return SEED_VERSIONS.map((v) => ({ ...v }));
  }

  private saveVersions(): void {
    try {
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(this.versions.slice(0, MAX_VERSIONS)));
    } catch {
      // storage unavailable; history lives for this session only
    }
  }

  // Flatten settings into path,value rows
  private toCsv(settings: DashboardSettings): string {
    const rows: string[] = ['key,value'];
    const walk = (value: unknown, path: string): void => {
      if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
      } else {
        rows.push(`${path},"${String(value ?? '').replace(/"/g, '""')}"`);
      }
    };
    walk(settings, '');
    return rows.join('\n');
  }

  duplicateDashboard(): void {
    this.prefs = { ...this.prefs, name: `${this.prefs.name} (Copy)` };
    this.notice = 'Dashboard duplicated. Apply settings to save the copy.';
  }

  deleteDashboard(): void {
    if (!confirm(`Delete "${this.prefs.name}" customization? This cannot be undone.`)) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSIONS_KEY);
    } catch {
      // storage unavailable; nothing saved to remove
    }
    this.router.navigate(['/new-dashboard']);
  }

  // ---------- Drag: available card -> selected list / canvas ----------
  onWidgetDragStart(event: DragEvent, widget: DashboardWidget): void {
    this.dragIndex = null;
    event.dataTransfer?.setData('text/widget-id', widget.id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
  }

  onDropZoneOver(event: DragEvent): void {
    event.preventDefault();
    this.dropZoneActive = true;
  }

  onDropZoneLeave(): void {
    this.dropZoneActive = false;
  }

  onDropZoneDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropZoneActive = false;
    const id = event.dataTransfer?.getData('text/widget-id');
    const widget = AVAILABLE_WIDGETS.find((w) => w.id === id);
    if (widget) this.addWidget(widget);
  }

  // ---------- Drag: reorder selected widgets ----------
  onRowDragStart(event: DragEvent, index: number): void {
    this.dragIndex = index;
    this.openMenuId = null;
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onRowDragOver(event: DragEvent, index: number): void {
    if (this.dragIndex === null) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragOverIndex = index;
  }

  onRowDrop(event: DragEvent, index: number): void {
    if (this.dragIndex === null) return;
    event.preventDefault();
    event.stopPropagation();
    const list = [...this.selected];
    const [moved] = list.splice(this.dragIndex, 1);
    list.splice(index, 0, moved);
    this.selected = list;
    this.onRowDragEnd();
  }

  onRowDragEnd(): void {
    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  // ---------- Footer actions ----------
  resetToDefault(): void {
    this.applySettings(DEFAULT_SETTINGS);
  }

  cancel(): void {
    this.router.navigate(['/new-dashboard']);
  }

  applyChanges(): void {
    const settings = this.currentSettings();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable; changes apply for this session only
    }
    this.versions = [
      {
        version: this.nextVersion(),
        date: formatStamp(new Date()),
        by: this.ownerName,
        description: this.restoredVersion ? `Restored from ${this.restoredVersion}` : 'Updated dashboard settings',
        settings,
      },
      ...this.versions,
    ];
    this.saveVersions();
    this.router.navigate(['/new-dashboard']);
  }

  private currentSettings(): DashboardSettings {
    return {
      widgetIds: this.selected.map((w) => w.id),
      layout: this.layout,
      columns: this.columns,
      spans: this.spans,
      filters: this.filters,
      refreshInterval: this.refreshInterval,
      showTitles: this.showTitles,
      showTimeRange: this.showTimeRange,
      showWidgetMenu: this.showWidgetMenu,
      showGrid: this.showGrid,
      compactMode: this.compactMode,
      preferences: this.prefs,
    };
  }

  private loadSettings(): DashboardSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      // ignore corrupt or unavailable storage
    }
    return DEFAULT_SETTINGS;
  }

  private applySettings(settings: DashboardSettings): void {
    const template = LAYOUT_TEMPLATES.find((t) => t.key === settings.layout);
    this.selected = settings.widgetIds
      .map((id) => AVAILABLE_WIDGETS.find((w) => w.id === id))
      .filter((w): w is DashboardWidget => !!w);
    this.layout = template ? template.key : DEFAULT_SETTINGS.layout;
    this.columns = template ? settings.columns : DEFAULT_SETTINGS.columns;
    this.spans = { ...settings.spans };
    this.filters = { ...defaultFilters(), ...settings.filters };
    this.refreshInterval = REFRESH_OPTIONS.some((r) => r.value === settings.refreshInterval)
      ? settings.refreshInterval
      : DEFAULT_SETTINGS.refreshInterval;
    this.showTitles = settings.showTitles;
    this.showTimeRange = settings.showTimeRange;
    this.showWidgetMenu = settings.showWidgetMenu;
    this.showGrid = settings.showGrid;
    this.compactMode = settings.compactMode;
    this.prefs = {
      ...DEFAULT_PREFERENCES,
      ...settings.preferences,
      filters: this.cloneFilters({ ...DEFAULT_PREFERENCES.filters, ...settings.preferences?.filters }),
      schedules: this.cloneSchedules(settings.preferences?.schedules ?? DEFAULT_PREFERENCES.schedules),
      ...this.cloneAlerts(settings.preferences),
      members: this.cloneMembers(settings.preferences?.members),
    };
    this.selectedMembers = new Set();
    this.editingMember = null;
    this.editingRule = null;
    this.editingRecipient = null;
    // Older saves only stored the compact flag
    if (!settings.preferences?.density) this.prefs.density = this.compactMode ? 'compact' : 'comfortable';
    this.compactMode = this.prefs.density === 'compact';
    this.editingSchedule = null;
    this.buildAppearanceTrend();
  }
}
