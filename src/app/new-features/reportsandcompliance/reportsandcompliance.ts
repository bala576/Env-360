import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  AUDITS_COMPLETED,
  AUDITS_DAILY,
  BUILDINGS,
  CATEGORIES,
  COMPLIANCE_BY_STANDARD,
  COMPLIANCE_COLORS,
  ComplianceState,
  DUE_ITEMS,
  DueItem,
  EXPORT_TYPES,
  ExportFormat,
  GENERATED,
  GeneratedReport,
  ISSUES_DAILY,
  KPIS,
  RANGE_SCALE,
  REPORT_ICONS,
  REPORT_TABS,
  REQUIREMENTS,
  ReportKpi,
  SCHEDULED,
  SITES,
  STANDARDS,
  ScheduledReport,
  TODAY,
  TOP_REPORTS,
  TopReport,
} from './reportsandcompliance.data';

// Trend chart height in screen pixels; its width follows the card so one SVG
// unit is one pixel and text keeps the same size on every screen
const TREND_HEIGHT = 160;
const DAY_MS = 86_400_000;

// Share of the organisation's reporting that each site / building filter covers
const SITE_SHARE: Record<string, number> = {
  'Dubai Mall': 1, 'City Center (Deira)': 0.62, 'Abu Dhabi Mall': 0.55, 'Sharjah City Center': 0.4, 'Ajman Mall': 0.46,
};

// Top report categories rolled up into the chart's category groups
const CATEGORY_GROUP: Record<string, string> = {
  Energy: 'Energy & Sustainability',
  Occupancy: 'Space & Occupancy',
  Operations: 'Operations',
  Maintenance: 'Maintenance',
  Security: 'Security & Safety',
  Compliance: 'Compliance',
};

const COMPLIANCE_ORDER: ComplianceState[] = ['Compliant', 'Minor Issues', 'Non-Compliant', 'Not Assessed'];

function formatDate(d: Date, withTime = false): string {
  const date = `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-GB', { month: 'short' })} ${d.getFullYear()}`;
  return withTime ? `${date} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : date;
}

function niceAxis(peak: number, top: number, bottom: number, steps = 4) {
  const raw = peak / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) ?? raw;
  const max = Math.ceil(peak / step) * step;
  const y = (v: number) => bottom - (v / max) * (bottom - top);
  const ticks = [];
  for (let v = 0; v <= max; v += step) ticks.push({ value: v, y: y(v) });
  return { y, ticks, max };
}

@Component({
  selector: 'app-reportsandcompliance',
  imports: [CommonModule, FormsModule, Dropdown, DragScroll],
  templateUrl: './reportsandcompliance.html',
  styleUrl: './reportsandcompliance.css',
})
export class Reportsandcompliance implements OnDestroy {

  icons = REPORT_ICONS;
  tabs = REPORT_TABS;
  activeTab = REPORT_TABS[0];
  kpis = KPIS;
  complianceColors = COMPLIANCE_COLORS;
  complianceOrder = COMPLIANCE_ORDER;
  trendHeight = TREND_HEIGHT;

  scheduled: ScheduledReport[] = SCHEDULED.map(s => ({ ...s }));
  generated: GeneratedReport[] = GENERATED.map(g => ({ ...g }));

  ngOnDestroy(): void {
    this.resizer?.disconnect();
    clearTimeout(this.toastTimer);
  }

  // ---------- Filters ----------
  // Draft values are edited in the filter bar; Apply copies them to the page
  site = 'Dubai Mall';
  building = 'all';
  category = 'all';
  standard = 'all';
  range = 30;
  applied = { site: this.site, building: this.building, category: this.category };

  siteOptions: DropdownOption[] = SITES.map(s => ({ label: s, value: s }));
  buildingOptions: DropdownOption[] = [{ label: 'All Buildings', value: 'all' }, ...BUILDINGS.map(b => ({ label: b, value: b }))];
  categoryOptions: DropdownOption[] = [{ label: 'All Categories', value: 'all' }, ...CATEGORIES.map(c => ({ label: c.name, value: c.name }))];
  standardOptions: DropdownOption[] = [{ label: 'All Standards', value: 'all' }, ...STANDARDS.map(s => ({ label: s, value: s }))];
  rangeOptions: DropdownOption[] = [
    { label: 'Last 30 Days', value: 30 },
    { label: 'Last 90 Days', value: 90 },
    { label: 'Last 12 Months', value: 365 },
  ];

  applyFilters(): void {
    this.applied = { site: this.site, building: this.building, category: this.category };
    this.categoryRange = this.range;
    this.complianceStandard = this.standard;
    this.notify('Filters applied');
  }

  private get share(): number {
    return (SITE_SHARE[this.applied.site] ?? 1) * (this.applied.building === 'all' ? 1 : 0.45);
  }

  // ---------- KPIs ----------
  kpiValue(kpi: ReportKpi): string {
    switch (kpi.key) {
      case 'total': return String(this.totalReports);
      case 'score': return `${COMPLIANCE_BY_STANDARD['all'].score}%`;
      case 'nonconformities': {
        const c = COMPLIANCE_BY_STANDARD['all'].counts;
        return String(c['Minor Issues'] + c['Non-Compliant']);
      }
      case 'audits': return String(AUDITS_COMPLETED);
      case 'due': return String(this.dueItems.filter(d => d.days <= 30).length);
    }
  }

  // Bars for the KPI sparkline, newest bar fully opaque
  sparkBars(kpi: ReportKpi) {
    const max = Math.max(...kpi.spark);
    return kpi.spark.map((v, i) => ({ h: (v / max) * 100, opacity: 0.25 + (i / (kpi.spark.length - 1)) * 0.75 }));
  }

  // ---------- Reports by category ----------
  categoryRange = 30;

  get categories() {
    const scale = (RANGE_SCALE[this.categoryRange] ?? 1) * this.share;
    const rows = CATEGORIES.map(c => ({ ...c, count: Math.round(c.count * scale) }));
    const total = rows.reduce((a, c) => a + c.count, 0) || 1;
    let offset = 0;
    return rows.map(c => {
      const pct = (c.count / total) * 100;
      const seg = { ...c, pct: Math.round(pct), dash: Math.max(0, pct - 0.8), offset };
      offset += pct;
      return seg;
    });
  }

  get totalReports(): number {
    return this.categories.reduce((a, c) => a + c.count, 0);
  }

  // ---------- Compliance status ----------
  complianceStandard = 'all';

  get compliance() {
    const data = COMPLIANCE_BY_STANDARD[this.complianceStandard] ?? COMPLIANCE_BY_STANDARD['all'];
    const total = COMPLIANCE_ORDER.reduce((a, s) => a + data.counts[s], 0) || 1;
    let offset = 0;
    const segments = COMPLIANCE_ORDER.map(state => {
      const pct = (data.counts[state] / total) * 100;
      const seg = { state, count: data.counts[state], color: COMPLIANCE_COLORS[state], dash: Math.max(0, pct - (pct ? 0.8 : 0)), offset };
      offset += pct;
      return seg;
    });
    return { score: data.score, segments };
  }

  // ---------- Audit & inspection trend ----------
  trendDays = 7;
  trendOptions: DropdownOption[] = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 14 Days', value: 14 },
  ];
  trendWidth = 360;
  hoverIndex: number | null = null;

  private zone = inject(NgZone);
  private resizer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(entries =>
    this.zone.run(() => entries.forEach(e => {
      const width = Math.round(e.contentRect.width);
      if (width) this.trendWidth = width;
    })));

  @ViewChild('trendSvg') set trendSvg(el: ElementRef<SVGSVGElement> | undefined) {
    if (el) this.resizer?.observe(el.nativeElement);
  }

  get trendPlot() {
    return { left: 46, right: this.trendWidth - 44, top: 10, bottom: TREND_HEIGHT - 22 };
  }

  get trend() {
    const plot = this.trendPlot;
    const days = this.trendDays;
    const audits = AUDITS_DAILY.slice(-days).map(v => Math.round(v * this.share));
    const issues = ISSUES_DAILY.slice(-days).map(v => Math.round(v * this.share));
    const left = niceAxis(Math.max(4, ...audits) * 1.1, plot.top, plot.bottom);
    const right = niceAxis(Math.max(4, ...issues) * 1.1, plot.top, plot.bottom, 5);
    const slot = (plot.right - plot.left) / days;
    const width = Math.min(26, slot * 0.6);
    const every = Math.ceil(days / Math.max(2, Math.floor((plot.right - plot.left) / 48)));
    const points = issues.map((v, i) => ({ x: plot.left + slot * i + slot / 2, y: right.y(v), value: v }));
    return {
      leftTicks: left.ticks,
      rightTicks: right.ticks,
      bars: audits.map((v, i) => {
        const d = new Date(TODAY.getTime() - (days - 1 - i) * DAY_MS);
        return {
          x: plot.left + slot * i + (slot - width) / 2,
          cx: plot.left + slot * i + slot / 2,
          y: left.y(v),
          h: plot.bottom - left.y(v),
          width,
          value: v,
          issues: issues[i],
          label: `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`,
          showLabel: (days - 1 - i) % every === 0,
          hitX: plot.left + slot * i,
          hitW: slot,
        };
      }),
      points,
      line: points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
    };
  }

  get hoverBar() {
    if (this.hoverIndex === null) return null;
    const b = this.trend.bars[this.hoverIndex];
    if (!b) return null;
    const plot = this.trendPlot;
    return { ...b, boxX: Math.min(plot.right - 86, Math.max(plot.left, b.cx - 43)) };
  }

  // ---------- Tables ----------
  get topReports(): TopReport[] {
    return TOP_REPORTS.filter(r => this.applied.category === 'all' || CATEGORY_GROUP[r.category] === this.applied.category);
  }

  get requirements() {
    return REQUIREMENTS.filter(r => this.complianceStandard === 'all' || r.standard.startsWith(this.complianceStandard));
  }

  stateClass(state: string): string {
    return 'c-' + state.toLowerCase().replace(/[^a-z]+/g, '-');
  }

  get dueItems() {
    return DUE_ITEMS.map((item: DueItem) => {
      const due = new Date(`${item.due}T00:00:00`);
      const days = Math.round((due.getTime() - TODAY.getTime()) / DAY_MS);
      return {
        ...item,
        day: String(due.getDate()).padStart(2, '0'),
        month: due.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
        days,
        label: days < 0 ? 'Overdue' : days === 0 ? 'Due today' : `Due in ${days} days`,
        tone: days < 0 ? 'overdue' : days <= 14 ? 'soon' : 'later',
      };
    }).sort((a, b) => a.days - b.days);
  }

  toggleSchedule(s: ScheduledReport): void {
    s.enabled = !s.enabled;
    this.notify(`${s.name} ${s.enabled ? 'resumed' : 'paused'}`);
  }

  // ---------- Data export ----------
  exportType = EXPORT_TYPES[0];
  exportTypeOptions: DropdownOption[] = EXPORT_TYPES.map(t => ({ label: t, value: t }));
  exportRange = 30;
  exportFormat: ExportFormat = 'Excel';
  formats: ExportFormat[] = ['PDF', 'Excel', 'CSV'];

  exportData(): void {
    const name = `${this.exportType} Export`;
    this.addGenerated(name, this.exportFormat);
    this.download(name, this.exportFormat);
  }

  // Downloads a CSV snapshot. PDF and Excel rendering needs the reporting API,
  // so until then those formats also download the CSV data.
  download(name: string, format: ExportFormat = 'CSV'): void {
    const rows = [
      ['Report', 'Site', 'Generated', 'Requested Format'],
      [name, this.applied.site, formatDate(TODAY), format],
      ...this.categories.map(c => [c.name, this.applied.site, `${c.count} reports`, format]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.notify(`${name} downloaded`);
  }

  // ---------- Menus & toast ----------
  generateMenuOpen = false;
  toast = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  notify(message: string): void {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 2600);
  }

  generateReport(name: string): void {
    this.generateMenuOpen = false;
    this.addGenerated(name, 'PDF');
    this.notify(`${name} generated`);
  }

  // Newest first, stamped with the mock date and the current clock time
  private addGenerated(name: string, format: ExportFormat): void {
    const stamp = new Date(TODAY);
    const clock = new Date();
    stamp.setHours(clock.getHours(), clock.getMinutes());
    this.generated = [{ name, generatedOn: formatDate(stamp, true), format }, ...this.generated].slice(0, 6);
  }

  // Close the menu when clicking elsewhere. composedPath() is used because
  // a dropdown option removes itself from the DOM on click.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inside = event.composedPath().some(el => el instanceof Element && el.classList.contains('generate-split'));
    if (this.generateMenuOpen && !inside) this.generateMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.generateMenuOpen = false;
  }
}
