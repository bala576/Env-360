import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { Dropdown, DropdownOption } from '../../../shared/dropdown/dropdown';
import {
  ACCEPTED_EXTENSIONS,
  buildRecords,
  ColumnMapping,
  DEMO_FILE,
  defaultMappings,
  FIELD_OPTIONS,
  FILE_REQUIREMENTS,
  MAPPING_TIPS,
  MAX_FILE_BYTES,
  OVERVIEW_ROWS,
  ImportRecord,
  PAGE_SIZES,
  RECORD_FILTERS,
  RecordStatus,
  SAVED_MAPPINGS,
  STATUS_FILTERS,
  StepId,
  TARGET_FIELDS,
  TEMPLATE_COLUMNS,
  UPLOAD_ICONS,
  UPLOAD_STEPS,
  UploadedFile,
  VALIDATION_RULES,
} from './deviceuplaod.data';

const LOAD_DELAY_MS = 700;
const TOAST_MS = 2600;
const IMPORT_TICK_MS = 80;
const IMPORT_BATCH = 2;
const RESULT_PAGE_SIZE = 10;
const REVALIDATE_MS = 600;

type SortKey = 'type' | 'status';
type ResultTab = 'all' | 'failed' | 'skipped';
export type ImportState = 'pending' | 'importing' | 'imported' | 'failed' | 'skipped';
const STATUS_ORDER: Record<RecordStatus, number> = { invalid: 0, duplicate: 1, valid: 2 };

@Component({
  selector: 'app-deviceuplaod',
  imports: [CommonModule, FormsModule, Breadcrumb, Dropdown],
  templateUrl: './deviceuplaod.html',
  styleUrl: './deviceuplaod.css',
})
export class Deviceuplaod implements OnDestroy {
  private router = inject(Router);

  readonly breadcrumb: BreadcrumbItem[] = [
    { label: 'Devices & Sensors', route: '/devices' },
    { label: 'Bulk Import' },
  ];

  icons = UPLOAD_ICONS;
  steps = UPLOAD_STEPS;
  fieldOptions = FIELD_OPTIONS;
  savedMappings = SAVED_MAPPINGS;
  tips = MAPPING_TIPS;
  statusFilters = STATUS_FILTERS;
  pageSizes = PAGE_SIZES;
  rules = VALIDATION_RULES;
  requirements = FILE_REQUIREMENTS;
  templateColumns = TEMPLATE_COLUMNS;
  overviewRows = OVERVIEW_ROWS;
  accept = ACCEPTED_EXTENSIONS.join(',');

  loading = true;
  step: StepId = 1;
  direction: 'forward' | 'back' = 'forward';

  // ---------- Upload ----------
  file: UploadedFile | null = DEMO_FILE;
  dragOver = false;
  fileError = '';

  // ---------- Mapping ----------
  mappings: ColumnMapping[] = defaultMappings();
  savedMapping = 'default';

  // ---------- Preview ----------
  records: ImportRecord[] = buildRecords();
  recordFilter = 'all';
  statusFilter: RecordStatus | 'all' = 'all';
  recordSearch = '';
  sortKey: SortKey | null = null;
  sortDir: 1 | -1 = 1;
  pageSize = 10;
  page = 1;
  selected = new Set<number>();
  moreOpen = false;
  rulesOpen = false;
  revalidating = false;

  // ---------- Import ----------
  importDone = false;
  // Number of records processed so far, in file order
  processed = 0;
  importedAt = new Map<number, Date>();
  resultTab: ResultTab = 'all';
  resultPage = 1;
  resultPageSize = RESULT_PAGE_SIZE;
  resultPageSizes = PAGE_SIZES;

  toast = '';

  private loadTimer?: ReturnType<typeof setTimeout>;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private importTimer?: ReturnType<typeof setInterval>;
  private revalidateTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Simulated fetch; swap for the real API call when available
    this.loadTimer = setTimeout(() => (this.loading = false), LOAD_DELAY_MS);
  }

  // ---------- Stepper ----------
  goToStep(step: StepId): void {
    if (step === this.step) return;
    this.direction = step > this.step ? 'forward' : 'back';
    this.step = step;
    if (step === 4) this.startImport();
  }

  // Only finished steps are reachable from the stepper, and never once importing
  canJump(step: StepId): boolean {
    return step < this.step && this.step !== 4;
  }

  next(): void {
    if (this.step < 4 && this.canContinue) this.goToStep((this.step + 1) as StepId);
  }

  back(): void {
    if (this.step === 1) this.close();
    else this.goToStep((this.step - 1) as StepId);
  }

  close(): void {
    this.router.navigate(['/devices']);
  }

  get canContinue(): boolean {
    switch (this.step) {
      case 1: return !!this.file;
      case 2: return !this.mappingIssues.length;
      case 3: return this.importCount > 0 && !this.revalidating;
      case 4: return this.importDone;
      default: return false;
    }
  }

  get nextLabel(): string {
    return this.step === 1 ? 'Next: Map Columns' : this.step === 2 ? 'Next: Preview & Validate' : 'Next: Import';
  }

  // ---------- Upload ----------
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.acceptFile(file);
  }

  onFilePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.acceptFile(file);
    input.value = '';
  }

  private acceptFile(file: File): void {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      this.fileError = 'Unsupported file type. Upload a .csv, .xlsx or .xls file.';
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      this.fileError = 'File is larger than 10 MB.';
      return;
    }
    this.fileError = '';
    // Row count is simulated until parsing is wired to the API
    this.file = { name: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), rows: DEMO_FILE.rows };
  }

  changeFile(): void {
    this.goToStep(1);
  }

  removeFile(): void {
    this.file = null;
  }

  downloadTemplate(): void {
    const header = this.mappings.map(m => m.column).join(',');
    const url = URL.createObjectURL(new Blob([header + '\n'], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devices_bulk_upload_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Mapping ----------
  fieldType(mapping: ColumnMapping): string {
    return TARGET_FIELDS.find(f => f.value === mapping.field)?.type ?? '-';
  }

  isDuplicate(mapping: ColumnMapping): boolean {
    return !!mapping.field && this.mappings.filter(m => m.field === mapping.field).length > 1;
  }

  get mappingIssues(): string[] {
    const issues: string[] = [];
    const mapped = new Set(this.mappings.map(m => m.field));
    const missing = TARGET_FIELDS.filter(f => f.mandatory && !mapped.has(f.value)).map(f => f.label);
    if (missing.length) issues.push(`Map required fields: ${missing.join(', ')}`);
    const unmapped = this.mappings.filter(m => m.required && !m.field).map(m => m.column);
    if (unmapped.length) issues.push(`Required columns not mapped: ${unmapped.join(', ')}`);
    if (this.mappings.some(m => this.isDuplicate(m))) issues.push('Each field can be mapped only once');
    return issues;
  }

  stepSubtitle(id: StepId, fallback: string): string {
    if (id >= this.step) return fallback;
    if (id === 1 && this.file) return this.file.name;
    if (id === 2) return `${this.mappedCount} of ${this.mappings.length} columns mapped`;
    if (id === 3) return `${this.countOf('valid')} valid, ${this.countOf('invalid')} invalid, ${this.countOf('duplicate')} duplicates`;
    return fallback;
  }

  get mappedCount(): number {
    return this.mappings.filter(m => m.field).length;
  }

  applySavedMapping(key: string): void {
    this.mappings = defaultMappings();
    if (key === 'last') {
      this.mappings.forEach(m => {
        if (m.column === 'location_building') m.field = null;
        if (m.column === 'tags') m.rule = 'Split by ;';
      });
    }
    this.showToast(`${this.savedMappings.find(o => o.value === key)?.label} applied`);
  }

  saveMapping(): void {
    this.showToast('Mapping saved for future uploads');
  }

  clearMapping(): void {
    this.mappings.forEach(m => (m.field = null));
    this.showToast('Mapping cleared');
  }

  // ---------- Preview ----------
  countOf(status: RecordStatus): number {
    return this.records.filter(r => r.status === status).length;
  }

  get recordFilters(): DropdownOption[] {
    const counts: Record<string, number> = {
      all: this.records.length,
      issues: this.records.length - this.countOf('valid'),
      selected: this.selected.size,
    };
    return RECORD_FILTERS.map(o => ({ ...o, label: `${o.label} (${counts[o.value as string]})` }));
  }

  get filteredRecords(): ImportRecord[] {
    const query = this.recordSearch.trim().toLowerCase();
    const rows = this.records.filter(r =>
      (this.recordFilter !== 'issues' || r.status !== 'valid') &&
      (this.recordFilter !== 'selected' || this.selected.has(r.index)) &&
      (this.statusFilter === 'all' || r.status === this.statusFilter) &&
      (!query ||
        r.name.toLowerCase().includes(query) ||
        r.serial.toLowerCase().includes(query) ||
        r.message.toLowerCase().includes(query))
    );
    if (!this.sortKey) return rows;
    const key = this.sortKey;
    const value = (r: ImportRecord) => (key === 'status' ? STATUS_ORDER[r.status] : r.type);
    return [...rows].sort((a, b) => (value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : a.index - b.index) * this.sortDir);
  }

  get pagedRecords(): ImportRecord[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRecords.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRecords.length / this.pageSize));
  }

  get rangeStart(): number {
    return this.filteredRecords.length ? (this.page - 1) * this.pageSize + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * this.pageSize, this.filteredRecords.length);
  }

  get pageList(): (number | null)[] {
    return this.buildPageList(this.totalPages, this.page);
  }

  // Page numbers with null marking an ellipsis gap
  private buildPageList(total: number, current: number): (number | null)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, 2, 3, 4, 5, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
    const result: (number | null)[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
      result.push(p);
    });
    return result;
  }

  onRecordFilterChange(): void {
    this.page = 1;
  }

  goToPage(page: number): void {
    this.page = Math.min(this.totalPages, Math.max(1, page));
  }

  sortBy(key: SortKey): void {
    if (this.sortKey !== key) {
      this.sortKey = key;
      this.sortDir = 1;
    } else if (this.sortDir === 1) {
      this.sortDir = -1;
    } else {
      this.sortKey = null;
    }
  }

  trackRecord(_: number, record: ImportRecord): number {
    return record.index;
  }

  toggleRecord(record: ImportRecord): void {
    this.selected.has(record.index) ? this.selected.delete(record.index) : this.selected.add(record.index);
  }

  get allPageSelected(): boolean {
    return this.pagedRecords.length > 0 && this.pagedRecords.every(r => this.selected.has(r.index));
  }

  toggleAllPage(): void {
    const select = !this.allPageSelected;
    this.pagedRecords.forEach(r => (select ? this.selected.add(r.index) : this.selected.delete(r.index)));
  }

  removeSelected(): void {
    const count = this.selected.size;
    this.records = this.records.filter(r => !this.selected.has(r.index));
    this.selected.clear();
    this.moreOpen = false;
    this.goToPage(this.page);
    this.showToast(`${count} record${count === 1 ? '' : 's'} removed`);
  }

  removeIssues(): void {
    const count = this.records.length - this.countOf('valid');
    this.records = this.records.filter(r => r.status === 'valid');
    this.selected.clear();
    this.moreOpen = false;
    this.goToPage(this.page);
    this.showToast(`${count} records with issues removed`);
  }

  // Simulated re-run of the server-side validation
  revalidate(): void {
    this.moreOpen = false;
    this.revalidating = true;
    clearTimeout(this.revalidateTimer);
    this.revalidateTimer = setTimeout(() => {
      this.revalidating = false;
      this.showToast('Validation complete');
    }, REVALIDATE_MS);
  }

  exportResults(): void {
    this.downloadCsv('devices_validation_results.csv', this.filteredRecords);
  }

  downloadErrorReport(): void {
    this.downloadCsv('devices_error_report.csv', this.records.filter(r => r.status !== 'valid'));
  }

  private downloadCsv(filename: string, rows: ImportRecord[]): void {
    const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const header = ['Row', 'Device Name', 'Device Type', 'Model', 'Serial Number', 'Asset Tag', 'Location', 'Status', 'Validation Message'];
    const lines = rows.map(r => [r.index, r.name, r.type, r.model, r.serial, r.assetTag, r.location, r.status, r.message].map(cell).join(','));
    const url = URL.createObjectURL(new Blob([[header.map(cell).join(','), ...lines].join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Location without the site, which the overview table has no room for
  shortLocation(record: ImportRecord): string {
    return record.location.split(' > ').slice(1).join(' / ');
  }

  // Only valid records are imported; invalid and duplicate rows are skipped
  get importCount(): number {
    return this.countOf('valid');
  }

  get skippedCount(): number {
    return this.records.length - this.importCount;
  }

  // ---------- Import ----------
  // Simulated import that walks the records in file order; swap for the real API job
  private startImport(): void {
    clearInterval(this.importTimer);
    this.processed = 0;
    this.importedAt.clear();
    this.importDone = false;
    this.resultTab = 'all';
    this.resultPage = 1;
    this.importTimer = setInterval(() => {
      const end = Math.min(this.records.length, this.processed + IMPORT_BATCH);
      const now = new Date();
      for (let i = this.processed; i < end; i++) this.importedAt.set(this.records[i].index, now);
      this.processed = end;
      if (end === this.records.length) {
        clearInterval(this.importTimer);
        this.importDone = true;
      }
    }, IMPORT_TICK_MS);
  }

  get importProgress(): number {
    return this.records.length ? Math.round((this.processed / this.records.length) * 100) : 100;
  }

  importState(record: ImportRecord, position: number): ImportState {
    if (position >= this.processed) return position === this.processed && !this.importDone ? 'importing' : 'pending';
    return record.status === 'valid' ? 'imported' : record.status === 'invalid' ? 'failed' : 'skipped';
  }

  private processedOf(status: RecordStatus): number {
    return this.records.slice(0, this.processed).filter(r => r.status === status).length;
  }

  get importedSoFar(): number {
    return this.processedOf('valid');
  }

  get secondsRemaining(): number {
    const ticks = Math.ceil((this.records.length - this.processed) / IMPORT_BATCH);
    return Math.max(1, Math.ceil((ticks * IMPORT_TICK_MS) / 1000));
  }

  // Records paired with their file position, since the import walks the file in order
  private get resultSource(): { record: ImportRecord; position: number }[] {
    const all = this.records.map((record, position) => ({ record, position }));
    if (this.resultTab === 'failed') return all.filter(r => r.record.status === 'invalid');
    if (this.resultTab === 'skipped') return all.filter(r => r.record.status === 'duplicate');
    return all;
  }

  get resultRows(): { record: ImportRecord; position: number }[] {
    const start = (this.resultPage - 1) * this.resultPageSize;
    return this.resultSource.slice(start, start + this.resultPageSize);
  }

  get resultTotal(): number {
    return this.resultSource.length;
  }

  get resultPages(): number {
    return Math.max(1, Math.ceil(this.resultTotal / this.resultPageSize));
  }

  get resultPageList(): (number | null)[] {
    return this.buildPageList(this.resultPages, this.resultPage);
  }

  trackResult(_: number, row: { record: ImportRecord }): number {
    return row.record.index;
  }

  setResultTab(tab: ResultTab): void {
    this.resultTab = tab;
    this.resultPage = 1;
  }

  goToResultPage(page: number): void {
    this.resultPage = Math.min(this.resultPages, Math.max(1, page));
  }

  downloadImportLog(): void {
    const rows = this.records.slice(0, this.processed).map((r, i) => ({ ...r, message: this.resultMessage(r, i) }));
    this.downloadCsv('devices_import_log.csv', rows);
  }

  downloadImportedData(): void {
    this.downloadCsv('devices_imported.csv', this.records.slice(0, this.processed).filter(r => r.status === 'valid'));
  }

  resultMessage(record: ImportRecord, position: number): string {
    const state = this.importState(record, position);
    if (state === 'imported') return 'Success';
    if (state === 'pending' || state === 'importing') return '-';
    return record.message;
  }

  finish(): void {
    this.router.navigate(['/devices']);
  }

  uploadAnother(): void {
    this.file = null;
    this.mappings = defaultMappings();
    this.savedMapping = 'default';
    this.records = buildRecords();
    this.importDone = false;
    this.processed = 0;
    this.selected.clear();
    this.recordFilter = 'all';
    this.statusFilter = 'all';
    this.recordSearch = '';
    this.page = 1;
    this.goToStep(1);
  }

  viewDevices(): void {
    this.router.navigate(['/devices']);
  }

  private showToast(message: string): void {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), TOAST_MS);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inside = event.composedPath().some(el => el instanceof Element && el.classList.contains('more-wrap'));
    if (this.moreOpen && !inside) this.moreOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.rulesOpen = false;
    this.moreOpen = false;
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadTimer);
    clearTimeout(this.revalidateTimer);
    clearTimeout(this.toastTimer);
    clearInterval(this.importTimer);
  }
}
