import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ACKNOWLEDGED_TODAY,
  ALARMS,
  ALARM_CATEGORIES,
  ALARM_DETAIL_TABS,
  ALARM_ICONS,
  ALARM_KPIS,
  ALARM_TABS,
  Alarm,
  AlarmKpi,
  SEVERITY_HOURLY,
  SEVERITY_META,
  SEVERITY_ORDER,
  Severity,
  TREND_DAYS,
  TREND_SERIES,
} from './alermsandevents.data';

const PAGE_SIZE = 10;

// Plot areas inside the 400x200 chart viewBoxes
const PLOT = { left: 34, right: 392, top: 10, bottom: 172 };

function toOptions(all: string, values: string[]): DropdownOption[] {
  return [{ label: all, value: 'all' }, ...Array.from(new Set(values)).map(v => ({ label: v, value: v }))];
}

// Round the axis max up to a step that gives ~5 gridlines
function niceMax(value: number): { max: number; step: number } {
  const step = value <= 5 ? 1 : value <= 10 ? 2 : value <= 25 ? 5 : 10;
  return { max: Math.max(step, Math.ceil(value / step) * step), step };
}

function ticks(max: number, step: number): { y: number; label: number }[] {
  const result = [];
  for (let v = 0; v <= max; v += step) {
    result.push({ y: PLOT.bottom - (v / max) * (PLOT.bottom - PLOT.top), label: v });
  }
  return result;
}

@Component({
  selector: 'app-alermsandevents',
  imports: [CommonModule, FormsModule, Dropdown, DragScroll],
  templateUrl: './alermsandevents.html',
  styleUrl: './alermsandevents.css',
})
export class Alermsandevents {

  icons = ALARM_ICONS;
  severityMeta = SEVERITY_META;
  severities = SEVERITY_ORDER;
  kpis = ALARM_KPIS;
  tabs = ALARM_TABS;
  activeTab = ALARM_TABS[0];
  plot = PLOT;

  private alarms: Alarm[] = ALARMS.map(a => ({ ...a, timeline: a.timeline.map(s => ({ ...s })) }));

  // ---------- Filters ----------
  site = 'Dubai Mall';
  building = 'all';
  spaceType = 'all';
  parameter = 'all';
  severity = 'all';
  status = 'Active';
  search = '';
  siteOptions: DropdownOption[] = [{ label: 'Dubai Mall', value: 'Dubai Mall' }];
  buildingOptions = toOptions('All Buildings', this.alarms.map(a => a.building));
  spaceTypeOptions = toOptions('All Types', this.alarms.map(a => a.spaceType));
  parameterOptions = toOptions('All Parameters', this.alarms.map(a => a.parameter));
  severityOptions = toOptions('All Severities', SEVERITY_ORDER);
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'Active' },
    { label: 'Acknowledged', value: 'Acknowledged' },
    { label: 'Resolved', value: 'Resolved' },
  ];

  // ---------- Chart ranges ----------
  severityRange = 24;
  severityRangeOptions: DropdownOption[] = [
    { label: 'Last 24 Hours', value: 24 },
    { label: 'Last 12 Hours', value: 12 },
    { label: 'Last 6 Hours', value: 6 },
  ];
  trendRange = 7;
  trendRangeOptions: DropdownOption[] = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 5 Days', value: 5 },
    { label: 'Last 3 Days', value: 3 },
  ];

  // ---------- Table ----------
  page = 1;
  checked = new Set<number>();

  // ---------- Detail panel ----------
  selected: Alarm | null = this.alarms[0];
  detailTabs = ALARM_DETAIL_TABS;
  activeDetailTab = ALARM_DETAIL_TABS[0];

  // ---------- KPIs ----------
  private get openAlarms(): Alarm[] {
    return this.alarms.filter(a => a.status === 'Active');
  }

  kpiValue(kpi: AlarmKpi): number {
    if (kpi.key === 'active') return this.openAlarms.length;
    if (kpi.key === 'acknowledged') return ACKNOWLEDGED_TODAY + this.alarms.filter(a => a.status === 'Acknowledged').length;
    return this.openAlarms.filter(a => a.severity === kpi.key).length;
  }

  // Rising alarm counts are bad news; rising acknowledgements are good
  deltaTone(kpi: AlarmKpi): string {
    if (kpi.change === 0) return '';
    return (kpi.change > 0) === !!kpi.upIsGood ? 'good' : 'bad';
  }

  // ---------- Donut (alarms by category) ----------
  get categorySlices() {
    const open = this.openAlarms;
    let offset = 0;
    return ALARM_CATEGORIES.map(c => {
      const value = open.filter(a => a.category === c.label).length;
      const share = open.length ? (value / open.length) * 100 : 0;
      const slice = { ...c, value, dash: `${Math.max(0, share - 0.8)} 100`, offset: -offset };
      offset += share;
      return slice;
    });
  }

  // ---------- Stacked bars (alarms by severity) ----------
  get severityBars() {
    const hours = SEVERITY_HOURLY.slice(-this.severityRange);
    const startHour = 24 - hours.length;
    const { max } = this.severityAxis;
    const slot = (PLOT.right - PLOT.left) / hours.length;
    const width = Math.min(18, slot * 0.6);
    return hours.map((counts, i) => {
      let y = PLOT.bottom;
      const segments = counts.map((count, s) => {
        const h = (count / max) * (PLOT.bottom - PLOT.top);
        y -= h;
        return { y, h, color: SEVERITY_META[SEVERITY_ORDER[s]].color };
      });
      const hour = startHour + i;
      return {
        x: PLOT.left + slot * i + (slot - width) / 2,
        cx: PLOT.left + slot * i + slot / 2,
        width,
        segments,
        label: hour % (hours.length > 12 ? 4 : 2) === 0 ? `${String(hour).padStart(2, '0')}:00` : '',
        tooltip: `${String(hour).padStart(2, '0')}:00 — ` + counts.map((c, s) => `${SEVERITY_ORDER[s]}: ${c}`).join(', '),
      };
    });
  }

  get severityAxis() {
    const peak = Math.max(...SEVERITY_HOURLY.slice(-this.severityRange).map(h => h.reduce((a, b) => a + b, 0)));
    const { max, step } = niceMax(peak);
    return { max, ticks: ticks(max, step) };
  }

  // ---------- Line chart (alarm trend) ----------
  get trendAxis() {
    const peak = Math.max(...TREND_SERIES.flatMap(s => s.values.slice(-this.trendRange)));
    const { max, step } = niceMax(peak);
    return { max, ticks: ticks(max, step) };
  }

  get trendDays(): { x: number; label: string }[] {
    const days = TREND_DAYS.slice(-this.trendRange);
    return days.map((label, i) => ({ x: this.trendX(i, days.length), label }));
  }

  get trendLines() {
    const { max } = this.trendAxis;
    return TREND_SERIES.map(s => {
      const values = s.values.slice(-this.trendRange);
      const dots = values.map((v, i) => ({
        x: this.trendX(i, values.length),
        y: PLOT.bottom - (v / max) * (PLOT.bottom - PLOT.top),
        tooltip: `${TREND_DAYS[TREND_DAYS.length - values.length + i]} — ${s.severity}: ${v}`,
      }));
      return {
        severity: s.severity,
        color: SEVERITY_META[s.severity].color,
        dots,
        points: dots.map(d => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(' '),
      };
    });
  }

  private trendX(i: number, count: number): number {
    const inset = 14;
    return PLOT.left + inset + (count > 1 ? (i / (count - 1)) * (PLOT.right - PLOT.left - inset * 2) : 0);
  }

  // ---------- Filtering & paging ----------
  get filteredAlarms(): Alarm[] {
    const query = this.search.trim().toLowerCase();
    return this.alarms.filter(a =>
      (this.building === 'all' || a.building === this.building) &&
      (this.spaceType === 'all' || a.spaceType === this.spaceType) &&
      (this.parameter === 'all' || a.parameter === this.parameter) &&
      (this.severity === 'all' || a.severity === this.severity) &&
      (this.status === 'all' || a.status === this.status) &&
      (!query || [a.location, a.parameter, a.title, a.site].some(f => f.toLowerCase().includes(query)))
    );
  }

  get pagedAlarms(): Alarm[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredAlarms.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAlarms.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredAlarms.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredAlarms.length);
  }

  get pageList(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilterChange(): void {
    this.page = 1;
  }

  goToPage(page: number): void {
    this.page = Math.min(this.totalPages, Math.max(1, page));
  }

  toggleRow(alarm: Alarm): void {
    this.checked.has(alarm.id) ? this.checked.delete(alarm.id) : this.checked.add(alarm.id);
  }

  get allPageChecked(): boolean {
    return this.pagedAlarms.length > 0 && this.pagedAlarms.every(a => this.checked.has(a.id));
  }

  toggleAllPage(): void {
    const check = !this.allPageChecked;
    this.pagedAlarms.forEach(a => (check ? this.checked.add(a.id) : this.checked.delete(a.id)));
  }

  selectAlarm(alarm: Alarm): void {
    this.selected = alarm;
    this.activeDetailTab = ALARM_DETAIL_TABS[0];
  }

  // ---------- Actions ----------
  // Bulk actions apply to checked rows, falling back to the open alarm
  private get targets(): Alarm[] {
    const checked = this.alarms.filter(a => this.checked.has(a.id));
    return checked.length ? checked : this.selected ? [this.selected] : [];
  }

  acknowledge(alarm?: Alarm): void {
    (alarm ? [alarm] : this.targets).filter(a => a.status === 'Active').forEach(a => {
      a.status = 'Acknowledged';
      this.setStep(a, 2, { title: 'Acknowledged', note: 'by Admin User', status: 'Acknowledged', tone: 'blue' });
    });
    this.afterAction();
  }

  assign(alarm?: Alarm): void {
    (alarm ? [alarm] : this.targets).filter(a => a.status !== 'Resolved').forEach(a => {
      this.setStep(a, 3, { title: 'Assigned to Technician', note: 'Facility Team', status: 'Assigned', tone: 'blue' });
    });
    this.afterAction();
  }

  resolve(alarm?: Alarm): void {
    (alarm ? [alarm] : this.targets).filter(a => a.status !== 'Resolved').forEach(a => {
      a.status = 'Resolved';
      this.setStep(a, 4, { title: 'Resolved', note: 'by Admin User', status: 'Resolved', tone: 'green' });
    });
    this.afterAction();
  }

  private setStep(alarm: Alarm, index: number, step: Omit<Alarm['timeline'][number], 'time'>): void {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    alarm.timeline[index] = { ...step, time };
  }

  private afterAction(): void {
    this.checked.clear();
    this.goToPage(this.page);
  }

  severityIcon(severity: Severity): string {
    return SEVERITY_META[severity].icon;
  }

  severityTone(severity: Severity): string {
    return 'sev-' + severity.toLowerCase();
  }
}
