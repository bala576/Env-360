import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  FLOORS,
  FLOOR_POINTS,
  FLOOR_ROOMS,
  FLOOR_SPACES,
  HIERARCHY,
  HierarchyNode,
  LIVE_PARAMETERS,
  MonitoringPoint,
  PARAM_COLORS,
  PARAM_LABELS,
  ParamKey,
  PointStatus,
  SITE_ICONS,
  STATUS_COLORS,
  Space,
} from './sites.data';

type ViewMode = 'list' | 'map' | 'plan';
type BottomTab = 'spaces' | 'points' | 'devices';

const PAGE_SIZE = 7;
// Sparkline viewBox is 100x32
const SPARK = { width: 100, height: 32 };

@Component({
  selector: 'app-sites',
  imports: [CommonModule, FormsModule, RouterLink, Dropdown, DragScroll],
  templateUrl: './sites.html',
  styleUrl: './sites.css',
})
export class Sites {

  icons = SITE_ICONS;
  statusColors = STATUS_COLORS;
  paramColors = PARAM_COLORS;
  paramLabels = PARAM_LABELS;
  statuses: PointStatus[] = ['normal', 'warning', 'critical', 'offline'];

  viewMode: ViewMode = 'plan';

  // ---------- Hierarchy ----------
  hierarchy = HIERARCHY;
  treeSearch = '';
  expanded = new Set<string>(['org', 'uae', 'dubai', 'dubai-mall', 'building-a']);
  selectedNodeId = 'L1';
  private parents = new Map<string, HierarchyNode[]>();

  // ---------- Floor plan ----------
  floors = FLOORS;
  rooms = FLOOR_ROOMS;
  zoomLevel = 1;
  parameterFilter: ParamKey | 'all' = 'all';
  parameterOptions: DropdownOption[] = [
    { label: 'All Parameters', value: 'all' },
    ...(Object.keys(PARAM_LABELS) as ParamKey[]).map(k => ({ label: PARAM_LABELS[k], value: k })),
  ];
  hoveredPoint: MonitoringPoint | null = null;

  // ---------- Space details ----------
  liveParameters = LIVE_PARAMETERS;
  selectedSpace: Space;

  // ---------- Bottom table ----------
  activeTab: BottomTab = 'spaces';
  spaceSearch = '';
  typeFilter = 'all';
  statusFilter = 'all';
  typeOptions: DropdownOption[] = [];
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];
  page = 1;
  checked = new Set<string>();

  constructor() {
    this.indexParents(this.hierarchy, []);
    this.selectedSpace = this.allSpaces[0];
    this.buildTypeOptions();
  }

  // ---------- Hierarchy ----------
  private indexParents(node: HierarchyNode, path: HierarchyNode[]): void {
    this.parents.set(node.id, path);
    node.children?.forEach(child => this.indexParents(child, [...path, node]));
  }

  get treeRoots(): HierarchyNode[] {
    const query = this.treeSearch.trim().toLowerCase();
    if (!query) return [this.hierarchy];
    const filtered = this.filterTree(this.hierarchy, query);
    return filtered ? [filtered] : [];
  }

  private filterTree(node: HierarchyNode, query: string): HierarchyNode | null {
    const children = (node.children ?? [])
      .map(child => this.filterTree(child, query))
      .filter((child): child is HierarchyNode => child !== null);
    if (node.label.toLowerCase().includes(query) || children.length) {
      return { ...node, children };
    }
    return null;
  }

  isExpanded(node: HierarchyNode): boolean {
    return !!this.treeSearch.trim() || this.expanded.has(node.id);
  }

  hasChildren(node: HierarchyNode): boolean {
    return node.kind !== 'floor';
  }

  toggleNode(node: HierarchyNode, event: Event): void {
    event.stopPropagation();
    this.expanded.has(node.id) ? this.expanded.delete(node.id) : this.expanded.add(node.id);
  }

  selectNode(node: HierarchyNode): void {
    this.selectedNodeId = node.id;
    if (node.kind === 'floor') {
      this.selectFloor(node.id);
    } else if (this.hasChildren(node)) {
      this.expanded.add(node.id);
    }
  }

  isOnSelectedPath(node: HierarchyNode): boolean {
    return (this.parents.get(this.selectedNodeId) ?? []).some(p => p.id === node.id && p.kind === 'site');
  }

  get breadcrumb(): BreadcrumbItem[] {
    const path = this.parents.get(this.selectedNodeId) ?? [];
    const site = path.find(p => p.kind === 'site');
    const node = this.findNode(this.hierarchy, this.selectedNodeId);
    const items: BreadcrumbItem[] = [{ label: 'Sites & Spaces', route: '/sites' }];
    if (site) items.push({ label: site.label });
    if (node && node !== site) items.push({ label: node.label });
    return items;
  }

  private findNode(node: HierarchyNode, id: string): HierarchyNode | null {
    if (node.id === id) return node;
    for (const child of node.children ?? []) {
      const found = this.findNode(child, id);
      if (found) return found;
    }
    return null;
  }

  // ---------- Floor plan ----------
  get currentFloorId(): string {
    return FLOOR_SPACES[this.selectedNodeId] ? this.selectedNodeId : 'L1';
  }

  get currentFloorLabel(): string {
    return this.floors.find(f => f.id === this.currentFloorId)?.label ?? '';
  }

  get visiblePoints(): MonitoringPoint[] {
    const points = FLOOR_POINTS[this.currentFloorId] ?? [];
    return this.parameterFilter === 'all' ? points : points.filter(p => p.param === this.parameterFilter);
  }

  selectFloor(id: string): void {
    this.selectedNodeId = id;
    this.page = 1;
    this.checked.clear();
    this.selectedSpace = this.allSpaces[0];
    this.buildTypeOptions();
  }

  zoom(step: number): void {
    this.zoomLevel = Math.min(2.5, Math.max(0.6, +(this.zoomLevel + step * 0.2).toFixed(1)));
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  pointIcon(point: MonitoringPoint): string {
    return point.status === 'critical' ? 'alert' : point.param;
  }

  // ---------- Space details ----------
  selectSpace(space: Space): void {
    this.selectedSpace = space;
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

  // ---------- Bottom table ----------
  get allSpaces(): Space[] {
    return FLOOR_SPACES[this.currentFloorId] ?? [];
  }

  get pointCount(): number {
    return this.allSpaces.reduce((sum, s) => sum + s.points, 0);
  }

  get deviceCount(): number {
    return this.allSpaces.reduce((sum, s) => sum + s.devices, 0);
  }

  private buildTypeOptions(): void {
    const types = Array.from(new Set(this.allSpaces.map(s => s.type)));
    this.typeOptions = [{ label: 'All Types', value: 'all' }, ...types.map(t => ({ label: t, value: t }))];
  }

  get filteredSpaces(): Space[] {
    const query = this.spaceSearch.trim().toLowerCase();
    return this.allSpaces.filter(s =>
      (!query || s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)) &&
      (this.typeFilter === 'all' || s.type === this.typeFilter) &&
      (this.statusFilter === 'all' || s.status === this.statusFilter)
    );
  }

  get pagedSpaces(): Space[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredSpaces.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSpaces.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredSpaces.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredSpaces.length);
  }

  // Page numbers with null marking an ellipsis gap
  get pageList(): (number | null)[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, 2, 3, total, this.page - 1, this.page, this.page + 1]);
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

  onFilterChange(): void {
    this.page = 1;
  }

  toggleRow(space: Space): void {
    this.checked.has(space.code) ? this.checked.delete(space.code) : this.checked.add(space.code);
  }

  get allPageChecked(): boolean {
    return this.pagedSpaces.length > 0 && this.pagedSpaces.every(s => this.checked.has(s.code));
  }

  toggleAllPage(): void {
    const check = !this.allPageChecked;
    this.pagedSpaces.forEach(s => (check ? this.checked.add(s.code) : this.checked.delete(s.code)));
  }
}
