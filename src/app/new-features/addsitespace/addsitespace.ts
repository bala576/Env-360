import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ADD_ICONS,
  AREA_OPTIONS,
  Attachment,
  CITY_OPTIONS,
  CONSTRUCTION_OPTIONS,
  COUNTRY_OPTIONS,
  DEFAULT_ATTACHMENTS,
  FORM_SECTIONS,
  HierarchyNode,
  MAP_BOUNDS,
  MAP_MODES,
  MAP_OPTIONS,
  MAP_PLACES,
  MAP_TYPES,
  MapMode,
  MapPlace,
  MapType,
  MINI_PLAN_ROOMS,
  NEW_NODE_ID,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  SectionId,
  SITE_HIERARCHY,
  TIMEZONE_OPTIONS,
  TYPE_OPTIONS,
  USAGE_OPTIONS,
} from './addsitespace.data';

const DESCRIPTION_LIMIT = 500;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const LOAD_DELAY_MS = 700;

@Component({
  selector: 'app-addsitespace',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './addsitespace.html',
  styleUrl: './addsitespace.css',
})
export class Addsitespace implements OnDestroy {
  private readonly router = inject(Router);

  icons = ADD_ICONS;
  sections = FORM_SECTIONS;
  stepIndex = 0;
  loading = true;
  private loadTimer?: ReturnType<typeof setTimeout>;
  descriptionLimit = DESCRIPTION_LIMIT;

  typeOptions = TYPE_OPTIONS;
  statusOptions = STATUS_OPTIONS;
  countryOptions = COUNTRY_OPTIONS;
  constructionOptions = CONSTRUCTION_OPTIONS;
  usageOptions = USAGE_OPTIONS;
  timezoneOptions = TIMEZONE_OPTIONS;
  roleOptions = ROLE_OPTIONS;
  mapOptions = MAP_OPTIONS;
  planRooms = MINI_PLAN_ROOMS;
  mapModes = MAP_MODES;
  mapTypes = MAP_TYPES;
  places = MAP_PLACES;

  form = {
    name: 'Dubai Mall - Main Building',
    type: 'Building',
    code: 'DM-MB',
    status: 'Active',
    description: 'Main building of Dubai Mall including retail, F&B and common areas.',
    country: 'United Arab Emirates',
    city: 'Dubai',
    address: 'Financial Center Road, Downtown Dubai',
    address2: '',
    postalCode: '00000',
    area: 'Downtown Dubai',
    latitude: '25.1972',
    longitude: '55.2744',
    parentId: 'dm' as string | null,
    totalArea: '500,000',
    floors: '5',
    construction: 'Commercial',
    usage: 'Retail & Entertainment',
    contactName: 'Ahmed Al Mansoori',
    contactRole: 'Facility Manager',
    contactEmail: 'ahmed.mansoori@dubaimall.ae',
    contactPhone: '+971 4 362 7500',
    timezone: '(GMT+04:00) Dubai',
    openTime: '10:00',
    closeTime: '23:00',
    monitoringEnabled: true,
    selectedMap: 'Dubai Mall - Level 1',
  };

  mapZoom = 1;
  mapMode: MapMode = 'map';
  mapType: MapType = 'satellite';
  mapSearch = '';
  searchOpen = false;
  popupOpen = true;
  // Marker position on the map, may differ from saved coordinates until "Update from Map"
  marker = { lat: 25.1972, lng: 55.2744 };
  selectedPlace: MapPlace | null = MAP_PLACES[0];
  planZoom = 1;
  floorPlanFile: string | null = null;
  attachments: Attachment[] = DEFAULT_ATTACHMENTS.map(a => ({ ...a }));
  private nextId = DEFAULT_ATTACHMENTS.length + 1;
  private objectUrls: string[] = [];

  // ---------- Hierarchy state ----------
  hierarchy: HierarchyNode[] = structuredClone(SITE_HIERARCHY);
  // Placeholder for the site/space being created; name, type and status follow the form
  readonly currentNode: HierarchyNode = this.createCurrentNode();
  parentOptions: DropdownOption[] = [];
  expanded = new Set<string>(['root']);
  levelOrder = 1;
  editingId: string | null = null;
  private dragIndex: number | null = null;
  private nextSiblingId = 1;

  constructor() {
    this.refreshParentOptions();
    this.placeCurrent();
    // Simulated fetch; swap for the real API call when available
    this.loadTimer = setTimeout(() => (this.loading = false), LOAD_DELAY_MS);
  }

  get cityOptions(): DropdownOption[] {
    return CITY_OPTIONS[this.form.country] ?? [];
  }

  get areaOptions(): DropdownOption[] {
    return AREA_OPTIONS[this.form.city] ?? [];
  }

  get activeSection(): SectionId {
    return this.sections[this.stepIndex].id;
  }

  get nextLabel(): string | null {
    return this.sections[this.stepIndex + 1]?.label ?? null;
  }

  get searchResults(): MapPlace[] {
    const q = this.mapSearch.trim().toLowerCase();
    return q ? this.places.filter(p => `${p.name} ${p.address}`.toLowerCase().includes(q)) : this.places;
  }

  get markerLabel(): string {
    return this.selectedPlace?.name ?? 'Dropped Pin';
  }

  get selectedAddress(): string {
    return this.selectedPlace?.address ?? this.form.address;
  }

  get images(): Attachment[] {
    return this.attachments.filter(a => a.kind === 'image');
  }

  get documents(): Attachment[] {
    return this.attachments.filter(a => a.kind === 'pdf');
  }

  get mapLevelLabel(): string {
    return this.form.selectedMap.split(' - ')[1] ?? '';
  }

  get canSave(): boolean {
    const f = this.form;
    return !!(f.name.trim() && f.type && f.country && f.city);
  }

  // ---------- Hierarchy ----------
  get siblings(): HierarchyNode[] {
    return this.childList(this.form.parentId);
  }

  get parentNode(): HierarchyNode | null {
    return this.form.parentId ? this.findNode(this.form.parentId) : null;
  }

  // Ancestors of the new site/space, ending with the new node itself
  get hierarchyPath(): HierarchyNode[] {
    return this.findPath(NEW_NODE_ID) ?? [this.currentNode];
  }

  get siblingLabel(): string {
    const type = this.form.type.toLowerCase();
    return type.endsWith('s') ? type : `${type}s`;
  }

  nodeIcon(node: HierarchyNode): string {
    if (node.type === 'Group') return 'group';
    if (node.type === 'Floor') return 'layers';
    return 'building';
  }

  trackById(_: number, node: HierarchyNode): string {
    return node.id;
  }

  onParentChange(id: string | null): void {
    this.form.parentId = id;
    this.levelOrder = this.childList(id).filter(n => n !== this.currentNode).length + 1;
    this.placeCurrent();
  }

  onLevelOrderChange(value: number): void {
    this.levelOrder = Number(value) || 1;
    this.placeCurrent();
  }

  toggleNode(id: string): void {
    this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
  }

  addSibling(): void {
    const node: HierarchyNode = { id: `sib-${this.nextSiblingId++}`, name: `New ${this.form.type}`, type: this.form.type, status: 'Active' };
    this.siblings.push(node);
    this.editingId = node.id;
    this.refreshParentOptions();
  }

  finishEdit(node: HierarchyNode): void {
    node.name = node.name.trim() || 'Untitled';
    this.editingId = null;
    this.refreshParentOptions();
  }

  onRowDragStart(index: number): void {
    this.dragIndex = index;
  }

  onRowDrop(index: number): void {
    if (this.dragIndex === null || this.dragIndex === index) return;
    const list = this.siblings;
    const [moved] = list.splice(this.dragIndex, 1);
    list.splice(index, 0, moved);
    this.levelOrder = list.indexOf(this.currentNode) + 1;
    this.dragIndex = null;
  }

  private placeCurrent(): void {
    this.detach(this.hierarchy);
    const list = this.siblings;
    const index = Math.min(list.length, Math.max(0, this.levelOrder - 1));
    list.splice(index, 0, this.currentNode);
    this.levelOrder = index + 1;
    this.findPath(NEW_NODE_ID)?.forEach(n => this.expanded.add(n.id));
  }

  private detach(nodes: HierarchyNode[]): boolean {
    const index = nodes.indexOf(this.currentNode);
    if (index >= 0) {
      nodes.splice(index, 1);
      return true;
    }
    return nodes.some(n => !!n.children && this.detach(n.children));
  }

  private childList(id: string | null): HierarchyNode[] {
    const node = id ? this.findNode(id) : null;
    return node ? (node.children ??= []) : this.hierarchy;
  }

  private findNode(id: string): HierarchyNode | null {
    return this.findPath(id)?.at(-1) ?? null;
  }

  private findPath(id: string, nodes = this.hierarchy): HierarchyNode[] | null {
    for (const node of nodes) {
      if (node.id === id) return [node];
      const sub = node.children && this.findPath(id, node.children);
      if (sub) return [node, ...sub];
    }
    return null;
  }

  private refreshParentOptions(): void {
    const out: DropdownOption[] = [];
    const walk = (nodes: HierarchyNode[]) =>
      nodes.forEach(n => {
        if (n === this.currentNode || n.type === 'Floor') return;
        out.push({ label: n.name, value: n.id });
        if (n.children) walk(n.children);
      });
    walk(this.hierarchy);
    this.parentOptions = out;
  }

  private createCurrentNode(): HierarchyNode {
    const form = this.form;
    return {
      id: NEW_NODE_ID,
      get name() { return form.name.trim() || 'New Site / Space'; },
      get type() { return form.type; },
      get status() { return form.status; },
    };
  }

  onCountryChange(country: string): void {
    this.form.country = country;
    this.form.city = this.cityOptions[0]?.value as string;
    this.onCityChange(this.form.city);
  }

  onCityChange(city: string): void {
    this.form.city = city;
    this.form.area = (this.areaOptions[0]?.value as string) ?? '';
  }

  goToStep(index: number): void {
    this.stepIndex = Math.min(this.sections.length - 1, Math.max(0, index));
  }

  next(): void {
    this.goToStep(this.stepIndex + 1);
  }

  back(): void {
    this.goToStep(this.stepIndex - 1);
  }

  // ---------- Map ----------
  markerX(lng = this.marker.lng): number {
    return ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
  }

  markerY(lat = this.marker.lat): number {
    return ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100;
  }

  onMapClick(event: MouseEvent, surface: HTMLElement): void {
    if (this.mapMode !== 'map') return;
    const rect = surface.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.marker = {
      lat: +(MAP_BOUNDS.north - y * (MAP_BOUNDS.north - MAP_BOUNDS.south)).toFixed(4),
      lng: +(MAP_BOUNDS.west + x * (MAP_BOUNDS.east - MAP_BOUNDS.west)).toFixed(4),
    };
    this.selectedPlace = null;
    this.popupOpen = true;
    this.updateFromMap();
  }

  selectPlace(place: MapPlace): void {
    this.selectedPlace = place;
    this.marker = { lat: place.lat, lng: place.lng };
    this.mapSearch = place.name;
    this.searchOpen = false;
    this.popupOpen = true;
    this.updateFromMap();
  }

  setMapMode(mode: MapMode): void {
    this.mapMode = mode;
    this.searchOpen = mode === 'search';
  }

  // Move the marker to manually entered coordinates when they fall inside the map
  onCoordsChange(): void {
    const lat = parseFloat(this.form.latitude);
    const lng = parseFloat(this.form.longitude);
    if (isNaN(lat) || isNaN(lng)) return;
    this.marker = { lat, lng };
    this.selectedPlace = this.places.find(p => p.lat === lat && p.lng === lng) ?? null;
  }

  get markerInView(): boolean {
    const x = this.markerX();
    const y = this.markerY();
    return x >= 0 && x <= 100 && y >= 0 && y <= 100;
  }

  updateFromMap(): void {
    this.form.latitude = this.marker.lat.toFixed(4);
    this.form.longitude = this.marker.lng.toFixed(4);
    if (this.selectedPlace) this.form.address = this.selectedPlace.address;
  }

  recenter(): void {
    this.mapZoom = 1;
    this.selectPlace(this.places[0]);
  }

  zoomMap(delta: number): void {
    this.mapZoom = Math.min(2, Math.max(1, +(this.mapZoom + delta).toFixed(2)));
  }

  zoomPlan(delta: number): void {
    this.planZoom = Math.min(2, Math.max(1, +(this.planZoom + delta).toFixed(2)));
  }

  getFromMap(): void {
    this.updateFromMap();
  }

  onFloorPlanSelected(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (file && file.size <= MAX_UPLOAD_BYTES) this.floorPlanFile = file.name;
    input.value = '';
  }

  onFilesSelected(input: HTMLInputElement): void {
    for (const file of Array.from(input.files ?? [])) {
      if (file.size > MAX_UPLOAD_BYTES) continue;
      const isImage = file.type.startsWith('image/');
      const url = isImage ? URL.createObjectURL(file) : undefined;
      if (url) this.objectUrls.push(url);
      this.attachments.push({
        id: this.nextId++,
        name: file.name,
        size: this.formatSize(file.size),
        kind: isImage ? 'image' : 'pdf',
        url,
        caption: isImage ? file.name : undefined,
      });
    }
    input.value = '';
  }

  removeAttachment(id: number): void {
    this.attachments = this.attachments.filter(a => a.id !== id);
  }

  cancel(): void {
    this.router.navigate(['/sites']);
  }

  save(): void {
    if (!this.canSave) return;
    this.router.navigate(['/sites']);
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadTimer);
    this.objectUrls.forEach(u => URL.revokeObjectURL(u));
  }

  private formatSize(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
}
