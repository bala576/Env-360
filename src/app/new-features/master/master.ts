import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  CONFIG_ITEMS,
  HIERARCHY,
  HierarchyNode,
  MASTER_ENTITIES,
  MASTER_ICONS,
  MASTER_SITES,
  MASTER_STATS,
  MASTER_TABS,
  MasterEntity,
  MasterSite,
  SITE_TYPES,
} from './master.data';

const PAGE_SIZE = 7;

@Component({
  selector: 'app-master',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './master.html',
  styleUrl: './master.css',
})
export class Master implements OnDestroy {

  private router = inject(Router);

  icons = MASTER_ICONS;
  tabs = MASTER_TABS;
  activeTab = MASTER_TABS[0];
  stats = MASTER_STATS;
  entities = MASTER_ENTITIES;
  configItems = CONFIG_ITEMS;

  ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
  }

  // Cards with an existing master screen open it; the rest are not built yet
  openEntity(entity: MasterEntity): void {
    if (entity.route) {
      this.router.navigateByUrl(entity.route);
    } else if (entity.key !== 'site') {
      this.notify(`${entity.name} master is coming soon`);
    }
  }

  // ---------- Sites list ----------
  sites: MasterSite[] = MASTER_SITES.map(s => ({ ...s }));
  search = '';
  status = 'all';
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'Active' },
    { label: 'Offline', value: 'Offline' },
  ];
  page = 1;
  selected = new Set<number>();
  menuFor: number | null = null;

  get filtered(): MasterSite[] {
    const q = this.search.trim().toLowerCase();
    return this.sites.filter(s =>
      (this.status === 'all' || s.status === this.status) &&
      (!q || [s.name, s.code, s.city, s.type].some(v => v.toLowerCase().includes(q))));
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE));
  }

  get pageRows(): MasterSite[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  }

  get rangeStart(): number {
    return this.filtered.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filtered.length);
  }

  // Page buttons with gaps (null) collapsed into an ellipsis
  get pages(): (number | null)[] {
    const total = this.pageCount;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const near = [1, total, this.page - 1, this.page, this.page + 1].filter(p => p >= 1 && p <= total);
    const sorted = [...new Set(near)].sort((a, b) => a - b);
    return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [null, p] : [p]));
  }

  goTo(page: number): void {
    this.page = Math.min(Math.max(1, page), this.pageCount);
  }

  onFilterChange(): void {
    this.page = 1;
  }

  get allOnPageSelected(): boolean {
    return this.pageRows.length > 0 && this.pageRows.every(s => this.selected.has(s.id));
  }

  toggleAll(): void {
    const select = !this.allOnPageSelected;
    this.pageRows.forEach(s => (select ? this.selected.add(s.id) : this.selected.delete(s.id)));
  }

  toggleRow(id: number): void {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id);
  }

  toggleMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.menuFor = this.menuFor === id ? null : id;
  }

  toggleStatus(site: MasterSite): void {
    site.status = site.status === 'Active' ? 'Offline' : 'Active';
    this.menuFor = null;
    this.notify(`${site.name} marked ${site.status.toLowerCase()}`);
  }

  deleteSite(site: MasterSite): void {
    this.sites = this.sites.filter(s => s.id !== site.id);
    this.selected.delete(site.id);
    this.menuFor = null;
    this.goTo(this.page);
    this.notify(`${site.name} deleted`);
  }

  deleteSelected(): void {
    const count = this.selected.size;
    this.sites = this.sites.filter(s => !this.selected.has(s.id));
    this.selected.clear();
    this.goTo(this.page);
    this.notify(`${count} site${count === 1 ? '' : 's'} deleted`);
  }

  // ---------- Add / edit site dialog ----------
  dialogOpen = false;
  editing: MasterSite | null = null;
  draft = this.emptyDraft();
  typeOptions: DropdownOption[] = SITE_TYPES.map(t => ({ label: t, value: t }));

  private emptyDraft() {
    return { name: '', city: '', type: SITE_TYPES[0], buildings: 1, devices: 0 };
  }

  openAdd(): void {
    this.editing = null;
    this.draft = this.emptyDraft();
    this.dialogOpen = true;
  }

  openEdit(site: MasterSite): void {
    this.editing = site;
    this.draft = { name: site.name, city: site.city, type: site.type, buildings: site.buildings, devices: site.devices };
    this.menuFor = null;
    this.dialogOpen = true;
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 1 && this.draft.city.trim().length > 1;
  }

  saveSite(): void {
    if (!this.canSave) return;
    const values = {
      name: this.draft.name.trim(),
      city: this.draft.city.trim(),
      type: this.draft.type,
      buildings: Math.max(0, Number(this.draft.buildings) || 0),
      devices: Math.max(0, Number(this.draft.devices) || 0),
    };
    if (this.editing) {
      Object.assign(this.editing, values);
      this.notify(`${values.name} updated`);
    } else {
      const id = Math.max(0, ...this.sites.map(s => s.id)) + 1;
      this.sites = [{ ...values, id, code: `SITE-${String(id).padStart(3, '0')}`, status: 'Active' }, ...this.sites];
      this.search = '';
      this.status = 'all';
      this.page = 1;
      this.notify(`${values.name} added`);
    }
    this.dialogOpen = false;
  }

  // ---------- Hierarchy ----------
  hierarchySite = 'all';
  hierarchyOptions: DropdownOption[] = [{ label: 'All Sites', value: 'all' }, ...HIERARCHY.map(n => ({ label: n.label, value: n.id }))];
  // Only the first site starts expanded, as in the overview
  expanded = new Set<string>(['dubai-mall', 'l1', 'l2', 'l3']);

  get hierarchy(): HierarchyNode[] {
    return this.hierarchySite === 'all' ? HIERARCHY : HIERARCHY.filter(n => n.id === this.hierarchySite);
  }

  toggleNode(node: HierarchyNode): void {
    if (!node.children?.length) return;
    this.expanded.has(node.id) ? this.expanded.delete(node.id) : this.expanded.add(node.id);
  }

  // ---------- Toast ----------
  toast = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  private notify(message: string): void {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 2800);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.menuFor = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dialogOpen = false;
    this.menuFor = null;
  }
}
