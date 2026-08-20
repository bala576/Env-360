import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'toggle' | 'health';
}

@Component({
  selector: 'app-generic-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable {

  @Input() title = '';
  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyMessage = 'No records found';
  @Input() showAdd = true;
  @Input() showActions = true;
  @Input() showDownload = false;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<void>();
  @Output() statusToggle = new EventEmitter<any>();
  @Output() download = new EventEmitter<any[]>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() cellAction = new EventEmitter<{ row: any; column: TableColumn }>();

  searchTerm = '';

  get filteredRows(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.rows;
    return this.rows.filter(row =>
      this.columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(term))
    );
  }

  isActiveValue(value: unknown): boolean {
    return value === 'Active' || value === true;
  }

  displayValue(value: unknown): unknown {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  }

  onRefresh(): void {
    this.searchTerm = '';
    this.refresh.emit();
  }

  onDownload(): void {
    this.download.emit(this.filteredRows);
  }

  toggleStatus(row: any, col: TableColumn): void {
    row[col.key] = this.isActiveValue(row[col.key]) ? 'Inactive' : 'Active';
    this.statusToggle.emit(row);
  }

  onCellAction(row: any, col: TableColumn): void {
    if (!row[col.key]) return;
    this.cellAction.emit({ row, column: col });
  }
}
