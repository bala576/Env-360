import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  COMPLIANCE,
  DEVICE_HEALTH,
  OPS_ICONS,
  OPS_TABS,
  OVERDUE_CHANGE,
  PREVENTIVE,
  PRIORITIES,
  RESOLUTION,
  STATUS_META,
  STATUS_ORDER,
  TECHNICIANS,
  TREND_END,
  TREND_LABELS,
  WORK_ORDERS,
  WO_DETAIL_TABS,
  WO_TREND,
  WoPriority,
  WoStatus,
  WorkOrder,
} from './operations.data';

const PAGE_SIZE = 10;

// Trend chart plot area inside its 400x200 viewBox
const PLOT = { left: 34, right: 392, top: 10, bottom: 168 };

// Steps of the progress tracker, and how many of them each status has completed
const PROGRESS_STEPS = ['Created', 'Assigned', 'In Progress', 'Completed'];
const PROGRESS_DONE: Record<WoStatus, number> = {
  'Open': 2,
  'Overdue': 2,
  'On Hold': 2,
  'In Progress': 3,
  'Closed': 4,
};

function toOptions(all: string, values: string[]): DropdownOption[] {
  return [{ label: all, value: 'all' }, ...Array.from(new Set(values)).sort().map(v => ({ label: v, value: v }))];
}

function stamp(date = new Date()): string {
  return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })} ${date.getFullYear()} ` +
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-operations',
  imports: [CommonModule, FormsModule, Dropdown, DragScroll],
  templateUrl: './operations.html',
  styleUrl: './operations.css',
})
export class Operations {

  icons = OPS_ICONS;
  tabs = OPS_TABS;
  activeTab = OPS_TABS[0];
  statusMeta = STATUS_META;
  plot = PLOT;
  compliance = COMPLIANCE;
  preventive = PREVENTIVE;
  deviceHealth = DEVICE_HEALTH;
  resolution = RESOLUTION;
  overdueChange = OVERDUE_CHANGE;

  workOrders: WorkOrder[] = WORK_ORDERS.map(w => ({ ...w, activities: [...w.activities] }));

  // ---------- KPIs & status donut ----------
  count(status: WoStatus): number {
    return this.workOrders.filter(w => w.status === status).length;
  }

  get statusSlices() {
    const total = this.workOrders.length || 1;
    let offset = 0;
    return STATUS_ORDER.map(status => {
      const value = this.count(status);
      const share = (value / total) * 100;
      const slice = { label: status, value, color: STATUS_META[status].color, dash: `${Math.max(0, share - 0.8)} 100`, offset: -offset };
      offset += share;
      return slice;
    });
  }

  get complianceRate(): number {
    return Math.round((COMPLIANCE.completed / COMPLIANCE.scheduled) * 100);
  }

  // ---------- Trend chart ----------
  trendRange = 14;
  trendRangeOptions: DropdownOption[] = [
    { label: 'Last 14 Days', value: 14 },
    { label: 'Last 7 Days', value: 7 },
  ];
  trendLabels = TREND_LABELS;

  get trendChart() {
    const days = WO_TREND.slice(-this.trendRange);
    const peak = Math.max(...days.map(d => d.reduce((a, b) => a + b, 0)));
    const step = 10;
    const max = Math.ceil(peak / step) * step;
    const scale = (v: number) => (v / max) * (PLOT.bottom - PLOT.top);
    const slot = (PLOT.right - PLOT.left) / days.length;
    const width = Math.min(20, slot * 0.6);
    const ticks = Array.from({ length: max / step + 1 }, (_, i) => ({ y: PLOT.bottom - scale(i * step), label: i * step }));
    const every = days.length > 7 ? 2 : 1;
    return {
      ticks,
      bars: days.map((values, i) => {
        const date = new Date(TREND_END);
        date.setDate(date.getDate() - (days.length - 1 - i));
        const label = `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
        let y = PLOT.bottom;
        const segments = values.map((v, s) => {
          const h = scale(v);
          y -= h;
          return { y, h, color: STATUS_META[TREND_LABELS[s]].color };
        });
        return {
          x: PLOT.left + slot * i + (slot - width) / 2,
          cx: PLOT.left + slot * i + slot / 2,
          width, segments,
          label: (days.length - 1 - i) % every === 0 ? label : '',
          tooltip: `${label}: ` + values.map((v, s) => `${TREND_LABELS[s]} ${v}`).join(', '),
        };
      }),
    };
  }

  // ---------- Filters ----------
  site = 'Dubai Mall';
  building = 'all';
  deviceType = 'all';
  status = 'all';
  priority = 'all';
  search = '';
  siteOptions: DropdownOption[] = [{ label: 'Dubai Mall', value: 'Dubai Mall' }];
  buildingOptions = toOptions('All Buildings', this.workOrders.map(w => w.building));
  deviceTypeOptions = toOptions('All Types', this.workOrders.map(w => w.deviceType));
  statusOptions = toOptions('All Status', STATUS_ORDER);
  priorityOptions = toOptions('All Priority', PRIORITIES);
  statusEditOptions: DropdownOption[] = STATUS_ORDER.map(s => ({ label: s, value: s }));
  priorityEditOptions: DropdownOption[] = PRIORITIES.map(p => ({ label: p, value: p }));
  technicianOptions: DropdownOption[] = TECHNICIANS.map(t => ({ label: t, value: t }));

  get filtered(): WorkOrder[] {
    const query = this.search.trim().toLowerCase();
    return this.workOrders.filter(w =>
      (this.building === 'all' || w.building === this.building) &&
      (this.deviceType === 'all' || w.deviceType === this.deviceType) &&
      (this.status === 'all' || w.status === this.status) &&
      (this.priority === 'all' || w.priority === this.priority) &&
      (!query || [w.number, w.title, w.device, w.location].some(f => f.toLowerCase().includes(query)))
    );
  }

  // ---------- Table & paging ----------
  page = 1;
  checked = new Set<number>();

  get paged(): WorkOrder[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filtered.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filtered.length);
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

  onFilterChange(): void {
    this.page = 1;
  }

  goToPage(page: number): void {
    this.page = Math.min(this.totalPages, Math.max(1, page));
  }

  toggleRow(wo: WorkOrder): void {
    this.checked.has(wo.id) ? this.checked.delete(wo.id) : this.checked.add(wo.id);
  }

  get allPageChecked(): boolean {
    return this.paged.length > 0 && this.paged.every(w => this.checked.has(w.id));
  }

  toggleAllPage(): void {
    const check = !this.allPageChecked;
    this.paged.forEach(w => (check ? this.checked.add(w.id) : this.checked.delete(w.id)));
  }

  // ---------- Menus ----------
  bulkMenuOpen = false;
  rowMenuId: number | null = null;
  moreMenuOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inside = (cls: string) => event.composedPath().some(el => el instanceof Element && el.classList.contains(cls));
    if (!inside('bulk-wrap')) this.bulkMenuOpen = false;
    if (!inside('row-menu-wrap')) this.rowMenuId = null;
    if (!inside('more-wrap')) this.moreMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.bulkMenuOpen = false;
    this.rowMenuId = null;
    this.moreMenuOpen = false;
    this.createOpen = false;
  }

  // Bulk actions apply to checked rows, falling back to the open work order
  bulkSetStatus(status: WoStatus): void {
    const targets = this.workOrders.filter(w => this.checked.has(w.id));
    (targets.length ? targets : this.selected ? [this.selected] : []).forEach(w => this.setStatus(w, status));
    this.checked.clear();
    this.bulkMenuOpen = false;
    this.goToPage(this.page);
  }

  setStatus(wo: WorkOrder, status: WoStatus): void {
    if (wo.status === status) return;
    wo.status = status;
    this.log(wo, `Status changed to ${status}`);
    this.rowMenuId = null;
  }

  private log(wo: WorkOrder, text: string): void {
    wo.activities = [{ user: 'Admin User', text, time: stamp() }, ...wo.activities];
  }

  // ---------- Detail panel ----------
  selected: WorkOrder | null = this.workOrders[0];
  detailTabs = WO_DETAIL_TABS;
  activeDetailTab = WO_DETAIL_TABS[0];
  progressSteps = PROGRESS_STEPS;

  select(wo: WorkOrder): void {
    this.selected = wo;
    this.activeDetailTab = WO_DETAIL_TABS[0];
    this.editing = null;
  }

  // Number of completed steps; the step right after them is the current one
  stepsDone(wo: WorkOrder): number {
    return PROGRESS_DONE[wo.status];
  }

  // Share of the connector line to fill, from the first dot to the current one
  progressFill(wo: WorkOrder): number {
    return Math.min(PROGRESS_DONE[wo.status], PROGRESS_STEPS.length - 1) / (PROGRESS_STEPS.length - 1);
  }

  // Timestamps shown under the stepper for steps with a known time
  progressTime(wo: WorkOrder, step: number): string {
    if (step === 0) return wo.createdOn;
    if (step === 1) return wo.activities.find(a => a.text.startsWith('Work order assigned'))?.time ?? '';
    return '';
  }

  tabCount(wo: WorkOrder, tab: string): number | null {
    if (tab === 'Attachments') return wo.attachments.length;
    if (tab === 'Related Alarms') return wo.relatedAlarms.length;
    return null;
  }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }

  // ---------- Edit ----------
  editing: Pick<WorkOrder, 'status' | 'priority' | 'assignee' | 'description'> | null = null;

  startEdit(): void {
    if (!this.selected) return;
    const { status, priority, assignee, description } = this.selected;
    this.editing = { status, priority, assignee, description };
  }

  saveEdit(): void {
    const wo = this.selected;
    if (!wo || !this.editing) return;
    if (this.editing.priority !== wo.priority) this.log(wo, `Priority changed to ${this.editing.priority}`);
    if (this.editing.assignee !== wo.assignee) this.log(wo, `Work order assigned to ${this.editing.assignee}`);
    if (this.editing.description !== wo.description) this.log(wo, 'Description updated');
    this.setStatus(wo, this.editing.status);
    Object.assign(wo, this.editing);
    this.editing = null;
  }

  // ---------- Create ----------
  createOpen = false;
  draft = this.emptyDraft();

  private emptyDraft() {
    return { title: '', device: '', location: '', building: 'Building A', priority: 'Medium' as WoPriority, assignee: TECHNICIANS[0], due: '' };
  }

  buildingEditOptions: DropdownOption[] = this.buildingOptions.slice(1);

  openCreate(): void {
    this.draft = this.emptyDraft();
    this.createOpen = true;
  }

  get draftValid(): boolean {
    return !!(this.draft.title.trim() && this.draft.device.trim() && this.draft.location.trim());
  }

  createWorkOrder(): void {
    if (!this.draftValid) return;
    const id = Math.max(...this.workOrders.map(w => w.id)) + 1;
    const now = stamp();
    const due = this.draft.due ? stamp(new Date(this.draft.due)) : now;
    const wo: WorkOrder = {
      id,
      number: `WO-2025-${String(id).padStart(4, '0')}`,
      title: this.draft.title.trim(),
      device: this.draft.device.trim(),
      deviceType: this.draft.device.trim(),
      serial: '—',
      location: this.draft.location.trim(),
      building: this.draft.building,
      priority: this.draft.priority,
      status: 'Open',
      createdOn: now,
      scheduled: now,
      due,
      assignee: this.draft.assignee,
      description: this.draft.title.trim(),
      activities: [
        { user: 'Admin User', text: `Work order assigned to ${this.draft.assignee}`, time: now },
        { user: 'Admin User', text: 'Work order created', time: now },
      ],
      parts: [], attachments: [], relatedAlarms: [],
    };
    this.workOrders = [wo, ...this.workOrders];
    this.status = 'all';
    this.page = 1;
    this.select(wo);
    this.createOpen = false;
  }

  // ---------- Export ----------
  exportCsv(): void {
    const header = ['WO No.', 'Title', 'Device / Asset', 'Site / Location', 'Building', 'Priority', 'Status', 'Scheduled Date', 'Assigned To'];
    const rows = this.filtered.map(w => [w.number, w.title, w.device, w.location, w.building, w.priority, w.status, w.scheduled, w.assignee]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'work-orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
