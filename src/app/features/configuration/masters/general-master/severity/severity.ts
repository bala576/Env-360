import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface SeverityRow {
  id: string;
  code: string;
  name: string;
  priority: number;
  description: string;
  color: string;
  icon: string;
  acknowledgementRequired: boolean;
  escalationRequired: boolean;
  slaMinutes: number;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-severity',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './severity.html',
  styleUrl: './severity.css',
})
export class Severity {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Severity' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Severity Code' },
    { key: 'name', label: 'Severity Name' },
    { key: 'priority', label: 'Priority' },
    { key: 'slaMinutes', label: 'SLA Minutes' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: SeverityRow[] = [
    { id: 'SEV-001', code: 'CRIT', name: 'Critical', priority: 1, description: 'Immediate action required', color: '#ef4444', icon: '', acknowledgementRequired: true, escalationRequired: true, slaMinutes: 15, status: 'Active', displayOrder: 1 },
    { id: 'SEV-002', code: 'MAJ', name: 'Major', priority: 2, description: 'Significant impact', color: '#f97316', icon: '', acknowledgementRequired: true, escalationRequired: true, slaMinutes: 60, status: 'Active', displayOrder: 2 },
    { id: 'SEV-003', code: 'MIN', name: 'Minor', priority: 3, description: 'Limited impact', color: '#eab308', icon: '', acknowledgementRequired: true, escalationRequired: false, slaMinutes: 240, status: 'Active', displayOrder: 3 },
    { id: 'SEV-004', code: 'WARN', name: 'Warning', priority: 4, description: 'Informational warning', color: '#3b82f6', icon: '', acknowledgementRequired: false, escalationRequired: false, slaMinutes: 0, status: 'Active', displayOrder: 4 },
    { id: 'SEV-005', code: 'INFO', name: 'Info', priority: 5, description: 'For information only', color: '#9ca3af', icon: '', acknowledgementRequired: false, escalationRequired: false, slaMinutes: 0, status: 'Inactive', displayOrder: 5 },
  ];

  popupOpen = false;
  editingRow: SeverityRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      priority: [1, Validators.required],
      description: [''],
      color: ['#7030a0'],
      icon: [''],
      acknowledgementRequired: [false],
      escalationRequired: [false],
      slaMinutes: [0],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ priority: this.rows.length + 1, color: '#7030a0', acknowledgementRequired: false, escalationRequired: false, slaMinutes: 0, status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: SeverityRow): void {
    this.editingRow = row;
    this.form.reset(row);
    this.popupOpen = true;
  }

  closePopup(): void {
    this.popupOpen = false;
    this.editingRow = null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.editingRow) {
      Object.assign(this.editingRow, value);
    } else {
      this.rows.push({ id: `SEV-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: SeverityRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
