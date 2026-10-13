import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  AUTOMATION_ICONS,
  AUTOMATION_KPIS,
  AUTOMATION_TABS,
  CONTROL_DEVICES,
  CONTROL_ZONES,
  ControlDevice,
  RECENT_ACTIONS,
  RULES,
  RULE_DETAIL_TABS,
  RecentAction,
  Rule,
} from './automationandcontrol.data';

const PAGE_SIZE = 12;
const SETPOINT = { min: -25, max: 30 };

function toOptions(all: string, values: string[]): DropdownOption[] {
  return [{ label: all, value: 'all' }, ...Array.from(new Set(values)).map(v => ({ label: v, value: v }))];
}

@Component({
  selector: 'app-automationandcontrol',
  imports: [CommonModule, FormsModule, RouterModule, Dropdown, DragScroll],
  templateUrl: './automationandcontrol.html',
  styleUrl: './automationandcontrol.css',
})
export class Automationandcontrol {

  icons = AUTOMATION_ICONS;
  kpis = AUTOMATION_KPIS;
  tabs = AUTOMATION_TABS;
  activeTab = AUTOMATION_TABS[0];
  createMenuOpen = false;

  // ---------- Filters ----------
  private rules = RULES;
  site = 'Dubai Mall';
  spaceType = 'all';
  ruleType = 'all';
  status = 'all';
  search = '';
  siteOptions: DropdownOption[] = [{ label: 'Dubai Mall', value: 'Dubai Mall' }];
  spaceTypeOptions = toOptions('All Types', this.rules.map(r => r.spaceType));
  ruleTypeOptions = toOptions('All Types', this.rules.map(r => r.ruleType));
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' },
  ];

  // ---------- Table ----------
  page = 1;
  checked = new Set<number>();

  // ---------- Rule details ----------
  selected: Rule = this.rules[0];
  detailTabs = RULE_DETAIL_TABS;
  activeDetailTab = RULE_DETAIL_TABS[0];

  // ---------- Live control (state kept per zone) ----------
  zoneOptions: DropdownOption[] = CONTROL_ZONES.map(z => ({ label: z, value: z }));
  zone = CONTROL_ZONES[0];
  private zoneDevices = new Map<string, ControlDevice[]>(
    CONTROL_ZONES.map(z => [z, CONTROL_DEVICES.map(d => ({ ...d }))])
  );
  private zoneSetpoints = new Map<string, number>(CONTROL_ZONES.map((z, i) => [z, [-18, 22, 20][i]]));
  refreshing = false;

  recentActions: RecentAction[] = [...RECENT_ACTIONS];

  // ---------- Filtering & paging ----------
  get filteredRules(): Rule[] {
    const query = this.search.trim().toLowerCase();
    return this.rules.filter(r =>
      (this.spaceType === 'all' || r.spaceType === this.spaceType) &&
      (this.ruleType === 'all' || r.ruleType === this.ruleType) &&
      (this.status === 'all' || (this.status === 'enabled') === r.enabled) &&
      (!query || r.name.toLowerCase().includes(query) || r.appliesTo.toLowerCase().includes(query))
    );
  }

  get pagedRules(): Rule[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredRules.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRules.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredRules.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredRules.length);
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

  toggleRow(rule: Rule): void {
    this.checked.has(rule.id) ? this.checked.delete(rule.id) : this.checked.add(rule.id);
  }

  get allPageChecked(): boolean {
    return this.pagedRules.length > 0 && this.pagedRules.every(r => this.checked.has(r.id));
  }

  toggleAllPage(): void {
    const check = !this.allPageChecked;
    this.pagedRules.forEach(r => (check ? this.checked.add(r.id) : this.checked.delete(r.id)));
  }

  // ---------- Rules ----------
  selectRule(rule: Rule): void {
    this.selected = rule;
    this.activeDetailTab = RULE_DETAIL_TABS[0];
  }

  toggleRule(rule: Rule, event?: Event): void {
    event?.stopPropagation();
    rule.enabled = !rule.enabled;
    this.logAction(`Rule "${rule.name}" ${rule.enabled ? 'enabled' : 'disabled'}`, 'Manual (User)');
  }

  // ---------- Live control ----------
  get devices(): ControlDevice[] {
    return this.zoneDevices.get(this.zone) ?? [];
  }

  get setpoint(): number {
    return this.zoneSetpoints.get(this.zone) ?? 0;
  }

  toggleDevice(device: ControlDevice): void {
    device.on = !device.on;
    this.logAction(`${device.label} ${device.on ? device.onLabel : device.offLabel}`, 'Manual (User)');
  }

  stepSetpoint(step: number): void {
    const next = Math.min(SETPOINT.max, Math.max(SETPOINT.min, this.setpoint + step));
    if (next === this.setpoint) return;
    this.zoneSetpoints.set(this.zone, next);
    this.logAction(`Temperature Set to ${next} °C`, 'Manual (User)');
  }

  refresh(): void {
    this.refreshing = true;
    setTimeout(() => (this.refreshing = false), 700);
  }

  private logAction(action: string, by: string): void {
    const now = new Date();
    const time = `${now.getDate()} ${now.toLocaleString('en-GB', { month: 'short' })} ${now.getFullYear()} ` +
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const entry: RecentAction = { time, action, by, status: 'Success' };
    this.recentActions = [entry, ...this.recentActions].slice(0, 20);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inside = event.composedPath().some(el => el instanceof Element && el.classList.contains('create-split'));
    if (this.createMenuOpen && !inside) this.createMenuOpen = false;
  }
}
