import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ACCESS_ROLE_OPTIONS,
  ADD_ICONS,
  AREA_OPTIONS,
  Attachment,
  CITY_OPTIONS,
  CONSTRUCTION_OPTIONS,
  CONTACT_ROLES,
  ContactRole,
  COUNTRY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  DaySchedule,
  DEFAULT_ATTACHMENTS,
  DEFAULT_ATTRIBUTES,
  DEFAULT_CONTACTS,
  DEFAULT_FEATURES,
  DEFAULT_FLOORS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_SCHEDULE,
  DIAL_CODE_OPTIONS,
  DOC_CATEGORIES,
  DocCategory,
  FLOOR_STATUS_OPTIONS,
  FLOOR_USAGE_OPTIONS,
  FORM_SECTIONS,
  HierarchyNode,
  LANGUAGE_OPTIONS,
  MAP_BOUNDS,
  MAP_MODES,
  MAP_OPTIONS,
  MAP_PLACES,
  MAP_TYPES,
  MAP_VIEW_OPTIONS,
  MAX_TIME_RANGES,
  MEDIA_TABS,
  MediaTab,
  MapMode,
  MapPlace,
  MapType,
  MINI_PLAN_ROOMS,
  NEW_NODE_ID,
  NOTIFICATION_CHANNELS,
  OPERATING_STATUS_OPTIONS,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  SectionId,
  SEVERITY_LEVELS,
  SITE_HIERARCHY,
  SiteAttribute,
  SiteContact,
  SiteFloor,
  SPEC_TEMPLATES,
  TIME_FORMAT_OPTIONS,
  TIMEZONE_OPTIONS,
  TYPE_OPTIONS,
  UPLOAD_RULES,
  USAGE_OPTIONS,
  VISIBILITY_OPTIONS,
} from './addsitespace.data';

const DESCRIPTION_LIMIT = 500;
const SPEC_NOTES_LIMIT = 500;
const CONTACT_NOTES_LIMIT = 300;
const RESTRICTED_VISIBILITY = 'Visible to selected users and roles';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactDraft = Omit<SiteContact, 'id' | 'status'> & { primary: boolean };
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const LOAD_DELAY_MS = 700;

@Component({
  selector: 'app-addsitespace',
  imports: [CommonModule, FormsModule, Breadcrumb, Dropdown],
  templateUrl: './addsitespace.html',
  styleUrl: './addsitespace.css',
})
export class Addsitespace implements OnDestroy {
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  readonly breadcrumb: BreadcrumbItem[] = [
    { label: 'Sites & Spaces', route: '/sites' },
    { label: 'Add Site / Space' },
  ];

  icons = ADD_ICONS;
  sections = FORM_SECTIONS;
  stepIndex = 0;
  stepDir: 'forward' | 'back' = 'forward';
  loading = true;
  private loadTimer?: ReturnType<typeof setTimeout>;
  descriptionLimit = DESCRIPTION_LIMIT;
  specNotesLimit = SPEC_NOTES_LIMIT;
  contactNotesLimit = CONTACT_NOTES_LIMIT;

  typeOptions = TYPE_OPTIONS;
  statusOptions = STATUS_OPTIONS;
  countryOptions = COUNTRY_OPTIONS;
  constructionOptions = CONSTRUCTION_OPTIONS;
  usageOptions = USAGE_OPTIONS;
  operatingStatusOptions = OPERATING_STATUS_OPTIONS;
  floorUsageOptions = FLOOR_USAGE_OPTIONS;
  floorStatusOptions = FLOOR_STATUS_OPTIONS;
  templateOptions: DropdownOption[] = SPEC_TEMPLATES.map(t => ({ label: t.label, value: t.id }));
  timezoneOptions = TIMEZONE_OPTIONS;
  dateFormatOptions = DATE_FORMAT_OPTIONS;
  timeFormatOptions = TIME_FORMAT_OPTIONS;
  languageOptions = LANGUAGE_OPTIONS;
  visibilityOptions = VISIBILITY_OPTIONS;
  mapViewOptions = MAP_VIEW_OPTIONS;
  severityLevels = SEVERITY_LEVELS;
  notificationChannels = NOTIFICATION_CHANNELS;
  maxTimeRanges = MAX_TIME_RANGES;
  roleOptions = ROLE_OPTIONS;
  contactRoles = CONTACT_ROLES;
  dialCodeOptions = DIAL_CODE_OPTIONS;
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
    builtYear: '2010',
    occupancy: '200,000',
    operatingStatus: 'Operational',
    siteCode: '',
    specNotes: '',
    timezone: '(UTC+04:00) Dubai, Abu Dhabi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24 Hour',
    language: 'English',
    customHours: true,
    visibility: RESTRICTED_VISIBILITY,
    siteCodePrefix: 'DM-MB-',
    defaultMapView: 'Satellite',
    geofencing: true,
    includeInReports: true,
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

  // ---------- Images & Documents state ----------
  mediaTabs = MEDIA_TABS;
  docCategories = DOC_CATEGORIES;
  categoryOptions: DropdownOption[] = DOC_CATEGORIES.map(c => ({ label: c.label, value: c.id }));
  uploadRules = UPLOAD_RULES;
  mediaTab: MediaTab = 'images';
  docFilter: string = 'all';
  uploadCategory: string = 'general';
  coverId: number | null = DEFAULT_ATTACHMENTS.find(a => a.kind === 'image')?.id ?? null;
  previewId: number | null = this.coverId;
  menuId: number | null = null;
  renamingId: number | null = null;
  dropTarget: MediaTab | null = null;
  uploadErrors: Partial<Record<MediaTab, string>> = {};
  viewing: Attachment | null = null;
  viewerUrl: SafeResourceUrl | null = null;

  // ---------- Specifications state ----------
  floors: SiteFloor[] = DEFAULT_FLOORS.map(f => ({ ...f }));
  attributes: SiteAttribute[] = DEFAULT_ATTRIBUTES.map(a => ({ ...a }));
  editingFloorId: number | null = null;
  editingAttrId: number | null = null;
  selectedTemplate: string | null = null;
  readonly currentYear = new Date().getFullYear();
  private nextFloorId = DEFAULT_FLOORS.length + 1;
  private nextAttrId = DEFAULT_ATTRIBUTES.length + 1;

  // ---------- Contacts state ----------
  contacts: SiteContact[] = DEFAULT_CONTACTS.map(c => ({ ...c }));
  primaryContactId: number | null = DEFAULT_CONTACTS[0]?.id ?? null;
  contactDraft: ContactDraft = this.emptyDraft();
  editingContactId: number | null = null;
  addingContact = false;
  contactSubmitted = false;
  contactBannerOpen = true;
  private nextContactId = DEFAULT_CONTACTS.length + 1;

  // ---------- Settings state ----------
  schedule: DaySchedule[] = structuredClone(DEFAULT_SCHEDULE);
  features = DEFAULT_FEATURES.map(f => ({ ...f }));
  notify = structuredClone(DEFAULT_NOTIFICATIONS);
  recipientsOpen = false;
  addingRecipient = false;
  newRecipient = '';
  extraRecipients: string[] = [];
  allowedRoles = ['Site Manager', 'Facility Engineer', 'Security Team'];
  addingRole = false;

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
    return this.attachments.filter(a => a.kind === 'document');
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

  // ---------- Specifications ----------
  trackByRowId(_: number, row: { id: number }): number {
    return row.id;
  }

  addFloor(): void {
    const level = `Level ${this.floors.length}`;
    const floor: SiteFloor = { id: this.nextFloorId++, level, name: level, area: '', usage: 'Retail', status: 'Active' };
    this.floors.push(floor);
    this.editingFloorId = floor.id;
  }

  finishFloorEdit(floor: SiteFloor): void {
    floor.level = floor.level.trim() || 'Level';
    floor.name = floor.name.trim() || floor.level;
    floor.area = floor.area.trim();
    this.editingFloorId = null;
  }

  removeFloor(id: number): void {
    this.floors = this.floors.filter(f => f.id !== id);
    if (this.editingFloorId === id) this.editingFloorId = null;
  }

  addAttribute(): void {
    const attr: SiteAttribute = { id: this.nextAttrId++, name: '', value: '', unit: '-', description: '' };
    this.attributes.push(attr);
    this.editingAttrId = attr.id;
  }

  finishAttrEdit(attr: SiteAttribute): void {
    attr.name = attr.name.trim() || 'Untitled Attribute';
    attr.unit = attr.unit.trim() || '-';
    this.editingAttrId = null;
  }

  removeAttribute(id: number): void {
    this.attributes = this.attributes.filter(a => a.id !== id);
    if (this.editingAttrId === id) this.editingAttrId = null;
  }

  applyTemplate(): void {
    const template = SPEC_TEMPLATES.find(t => t.id === this.selectedTemplate);
    if (!template) return;
    Object.assign(this.form, template.specs);
    this.floors = template.floors.map(f => ({ ...f, id: this.nextFloorId++ }));
    this.attributes = template.attributes.map(a => ({ ...a, id: this.nextAttrId++ }));
    this.editingFloorId = this.editingAttrId = null;
  }

  // ---------- Contacts ----------
  get primaryContact(): SiteContact | null {
    return this.contacts.find(c => c.id === this.primaryContactId) ?? null;
  }

  get contactErrors(): { name: boolean; role: boolean; email: boolean } {
    const d = this.contactDraft;
    return { name: !d.name.trim(), role: !d.role, email: !EMAIL_PATTERN.test(d.email.trim()) };
  }

  get contactValid(): boolean {
    const e = this.contactErrors;
    return !e.name && !e.role && !e.email;
  }

  roleTone(role: string): string {
    return CONTACT_ROLES.find(r => r.label === role)?.tone ?? 'gray';
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts.at(-1)![0] : '')).toUpperCase() || '?';
  }

  startNewContact(focus?: HTMLInputElement): void {
    this.resetContactForm();
    this.addingContact = true;
    focus?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    focus?.focus({ preventScroll: true });
  }

  editContact(contact: SiteContact, focus?: HTMLInputElement): void {
    const { id, status, ...fields } = contact;
    this.contactDraft = { ...fields, primary: id === this.primaryContactId };
    this.editingContactId = id;
    this.addingContact = false;
    this.contactSubmitted = false;
    focus?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    focus?.focus({ preventScroll: true });
  }

  saveContact(): void {
    this.contactSubmitted = true;
    if (!this.contactValid) return;
    const { primary, ...fields } = this.contactDraft;
    const data = { ...fields, name: fields.name.trim(), email: fields.email.trim() };
    let id = this.editingContactId;
    const existing = id !== null ? this.contacts.find(c => c.id === id) : undefined;
    if (existing) {
      Object.assign(existing, data);
    } else {
      id = this.nextContactId++;
      this.contacts.push({ ...data, id, status: 'Active' });
    }
    if (primary || this.primaryContactId === null) this.primaryContactId = id;
    else if (this.primaryContactId === id) this.primaryContactId = this.contacts.find(c => c.id !== id)?.id ?? id;
    this.resetContactForm();
  }

  removeContact(id: number): void {
    this.contacts = this.contacts.filter(c => c.id !== id);
    if (this.primaryContactId === id) this.primaryContactId = this.contacts[0]?.id ?? null;
    if (this.editingContactId === id) this.resetContactForm();
  }

  setPrimary(id: number): void {
    this.primaryContactId = id;
    if (this.editingContactId !== null) this.contactDraft.primary = this.editingContactId === id;
  }

  toggleContactStatus(contact: SiteContact): void {
    contact.status = contact.status === 'Active' ? 'Inactive' : 'Active';
  }

  pickRole(role: ContactRole): void {
    this.contactDraft.role = role.label;
  }

  resetContactForm(): void {
    this.contactDraft = this.emptyDraft();
    this.editingContactId = null;
    this.addingContact = false;
    this.contactSubmitted = false;
  }

  private emptyDraft(): ContactDraft {
    return { name: '', role: '', department: '', email: '', dialCode: '+971', phone: '', designation: '', notes: '', primary: false };
  }

  // ---------- Settings ----------
  get restrictedVisibility(): boolean {
    return this.form.visibility === RESTRICTED_VISIBILITY;
  }

  get enabledFeatures(): string[] {
    return this.features.filter(f => f.enabled).map(f => f.summary);
  }

  get envMonitoring() {
    return this.features.find(f => f.key === 'env')!;
  }

  get weekdayHours() {
    return this.schedule[0].ranges[0];
  }

  get recipientOptions(): string[] {
    return [...CONTACT_ROLES.map(r => r.label), ...this.extraRecipients];
  }

  get recipientLabel(): string {
    return this.notify.recipients.join(', ');
  }

  get roleChoices(): DropdownOption[] {
    return ACCESS_ROLE_OPTIONS.filter(o => !this.allowedRoles.includes(o.value as string));
  }

  get usingDefaultNotifications(): boolean {
    const same = (a: string[], b: string[]) => a.length === b.length && a.every(x => b.includes(x));
    const d = DEFAULT_NOTIFICATIONS;
    return same(this.notify.recipients, d.recipients) && same(this.notify.severities, d.severities) && same(this.notify.channels, d.channels);
  }

  dayHoursLabel(day: DaySchedule): string {
    if (!this.form.customHours) return '24 Hours';
    if (!day.open) return 'Closed';
    return day.ranges.map(r => `${this.formatTime(r.from)} - ${this.formatTime(r.to)}`).join(', ');
  }

  addTimeRange(day: DaySchedule): void {
    if (day.ranges.length >= MAX_TIME_RANGES) return;
    const last = day.ranges.at(-1)!;
    day.ranges.push({ from: last.to, to: last.to });
  }

  removeTimeRange(day: DaySchedule, index: number): void {
    day.ranges.splice(index, 1);
  }

  toggleIn(list: string[], value: string): void {
    const i = list.indexOf(value);
    i >= 0 ? list.splice(i, 1) : list.push(value);
  }

  confirmRecipient(): void {
    const value = this.newRecipient.trim();
    if (value && !this.recipientOptions.includes(value)) this.extraRecipients.push(value);
    if (value && !this.notify.recipients.includes(value)) this.notify.recipients.push(value);
    this.newRecipient = '';
    this.addingRecipient = false;
  }

  resetNotifications(): void {
    this.notify = structuredClone(DEFAULT_NOTIFICATIONS);
  }

  addRole(role: string | null): void {
    if (role && !this.allowedRoles.includes(role)) this.allowedRoles.push(role);
    this.addingRole = false;
  }

  removeRole(role: string): void {
    this.allowedRoles = this.allowedRoles.filter(r => r !== role);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.recipientsOpen && !target.closest('.multi-select')) this.recipientsOpen = false;
    if (this.menuId !== null && !target.closest('.img-menu')) this.menuId = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.viewing = null;
    this.menuId = null;
  }

  private formatTime(value: string): string {
    if (this.form.timeFormat !== '12 Hour' || !value) return value;
    const [h, m] = value.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
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
    const target = Math.min(this.sections.length - 1, Math.max(0, index));
    if (target === this.stepIndex) return;
    this.stepDir = target > this.stepIndex ? 'forward' : 'back';
    this.stepIndex = target;
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

  // ---------- Images & Documents ----------
  get previewImage(): Attachment | null {
    const images = this.images;
    return images.find(i => i.id === this.previewId) ?? images[0] ?? null;
  }

  get previewIndex(): number {
    const current = this.previewImage;
    return current ? this.images.indexOf(current) : -1;
  }

  get filteredDocuments(): Attachment[] {
    const docs = this.documents;
    return this.docFilter === 'all' ? docs : docs.filter(d => d.category === this.docFilter);
  }

  get floorPlanDocs(): Attachment[] {
    return this.documents.filter(d => d.category === 'floorplan');
  }

  get totalSize(): string {
    return this.formatSize(this.attachments.reduce((sum, a) => sum + a.bytes, 0));
  }

  category(doc: Attachment): DocCategory {
    return DOC_CATEGORIES.find(c => c.id === doc.category) ?? DOC_CATEGORIES[0];
  }

  categoryCount(id: string): number {
    return this.documents.filter(d => d.category === id).length;
  }

  imageBackground(img: Attachment): string | undefined {
    return img.url ? `url(${img.url})` : img.gradient;
  }

  ruleLabel(target: MediaTab): string {
    return this.uploadRules[target].label;
  }

  uploadError(target: MediaTab): string | undefined {
    return this.uploadErrors[target];
  }

  onFilesPicked(input: HTMLInputElement, target: MediaTab): void {
    this.addFiles(Array.from(input.files ?? []), target);
    input.value = '';
  }

  // Overview picker accepts both images and documents
  onFilesSelected(input: HTMLInputElement): void {
    const files = Array.from(input.files ?? []);
    const isImage = (f: File) => this.uploadRules.images.extensions.includes(this.extension(f.name));
    this.addFiles(files.filter(isImage), 'images');
    this.addFiles(files.filter(f => !isImage(f)), 'documents');
    input.value = '';
  }

  onDragOver(event: DragEvent, target: MediaTab): void {
    event.preventDefault();
    this.dropTarget = target;
  }

  onDragLeave(event: DragEvent): void {
    const zone = event.currentTarget as HTMLElement;
    if (!zone.contains(event.relatedTarget as Node | null)) this.dropTarget = null;
  }

  onDrop(event: DragEvent, target: MediaTab): void {
    event.preventDefault();
    this.dropTarget = null;
    this.addFiles(Array.from(event.dataTransfer?.files ?? []), target);
  }

  setCover(id: number): void {
    this.coverId = id;
    this.menuId = null;
  }

  startRename(id: number): void {
    this.renamingId = id;
    this.menuId = null;
  }

  finishRename(img: Attachment): void {
    img.caption = img.caption?.trim() || this.titleFromName(img.name);
    this.renamingId = null;
  }

  stepPreview(delta: number): void {
    const images = this.images;
    if (!images.length) return;
    const index = (this.previewIndex + delta + images.length) % images.length;
    this.previewId = images[index].id;
  }

  scrollStrip(strip: HTMLElement, direction: number): void {
    strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: 'smooth' });
  }

  view(file: Attachment): void {
    this.menuId = null;
    this.viewing = file;
    // Only blob URLs created from the user's own uploads reach the viewer frame
    this.viewerUrl = file.url && file.fileType === 'PDF' ? this.sanitizer.bypassSecurityTrustResourceUrl(file.url) : null;
  }

  download(file: Attachment): void {
    this.menuId = null;
    if (!file.url) return;
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  }

  removeAttachment(id: number): void {
    const file = this.attachments.find(a => a.id === id);
    if (file?.url) {
      URL.revokeObjectURL(file.url);
      this.objectUrls = this.objectUrls.filter(u => u !== file.url);
    }
    this.attachments = this.attachments.filter(a => a.id !== id);
    if (this.coverId === id) this.coverId = this.images[0]?.id ?? null;
    if (this.previewId === id) this.previewId = this.coverId;
    if (this.viewing?.id === id) this.viewing = null;
    if (this.menuId === id) this.menuId = null;
  }

  private addFiles(files: File[], target: MediaTab): void {
    if (!files.length) return;
    const rule = this.uploadRules[target];
    const rejected: string[] = [];
    let firstImage: number | null = null;
    for (const file of files) {
      const ext = this.extension(file.name);
      if (!rule.extensions.includes(ext) || file.size > MAX_UPLOAD_BYTES) {
        rejected.push(file.name);
        continue;
      }
      const isImage = target === 'images';
      // Only images and PDFs can be previewed in the browser
      const previewable = file.type.startsWith('image/') || ext === 'pdf';
      const url = previewable ? URL.createObjectURL(file) : undefined;
      if (url) this.objectUrls.push(url);
      const id = this.nextId++;
      this.attachments.push({
        id,
        name: file.name,
        bytes: file.size,
        kind: isImage ? 'image' : 'document',
        fileType: ext.toUpperCase(),
        uploadedOn: this.today(),
        category: isImage ? undefined : target === 'plans' ? 'floorplan' : (this.uploadCategory as Attachment['category']),
        url,
        caption: isImage ? this.titleFromName(file.name) : undefined,
      });
      if (isImage) firstImage ??= id;
    }
    if (firstImage !== null) {
      this.coverId ??= firstImage;
      this.previewId = firstImage;
    }
    this.uploadErrors[target] = rejected.length
      ? `${rejected.length} file${rejected.length > 1 ? 's' : ''} skipped (${rejected.join(', ')}). Use ${rule.label} up to 10 MB.`
      : undefined;
  }

  private extension(name: string): string {
    return name.split('.').pop()?.toLowerCase() ?? '';
  }

  private titleFromName(name: string): string {
    const base = name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
    return base.replace(/\b\w/g, c => c.toUpperCase()) || 'Untitled';
  }

  private today(): string {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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

  formatSize(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
}
