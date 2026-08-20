import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface StatusRow {
  id: string;
  code: string;
  name: string;
  statusType: string;
  description: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isTerminal: boolean;
  recordStatus: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-status',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Status' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Status Code' },
    { key: 'name', label: 'Status Name' },
    { key: 'statusType', label: 'Status Type' },
    { key: 'isDefault', label: 'Is Default' },
    { key: 'isTerminal', label: 'Is Terminal' },
    { key: 'recordStatus', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: StatusRow[] = [
    { id: 'STA-001', code: 'OPEN', name: 'Open', statusType: 'Alarm', description: 'Newly raised', color: '#3b82f6', icon: '', isDefault: true, isTerminal: false, recordStatus: 'Active', displayOrder: 1 },
    { id: 'STA-002', code: 'INPROG', name: 'In Progress', statusType: 'Alarm', description: 'Being worked on', color: '#eab308', icon: '', isDefault: false, isTerminal: false, recordStatus: 'Active', displayOrder: 2 },
    { id: 'STA-003', code: 'RESOLVED', name: 'Resolved', statusType: 'Alarm', description: 'Issue resolved', color: '#22c55e', icon: '', isDefault: false, isTerminal: true, recordStatus: 'Active', displayOrder: 3 },
    { id: 'STA-004', code: 'CLOSED', name: 'Closed', statusType: 'Workflow', description: 'Workflow closed', color: '#6b7280', icon: '', isDefault: false, isTerminal: true, recordStatus: 'Active', displayOrder: 4 },
    { id: 'STA-005', code: 'ESCALATED', name: 'Escalated', statusType: 'Alarm', description: 'Escalated to next level', color: '#ef4444', icon: '', isDefault: false, isTerminal: false, recordStatus: 'Inactive', displayOrder: 5 },
  ];

  statusTypes = ['Alarm', 'Workflow', 'Event'];

  popupOpen = false;
  editingRow: StatusRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      statusType: ['', Validators.required],
      description: [''],
      color: ['#7030a0'],
      icon: [''],
      isDefault: [false],
      isTerminal: [false],
      recordStatus: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ color: '#7030a0', isDefault: false, isTerminal: false, recordStatus: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: StatusRow): void {
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
      this.rows.push({ id: `STA-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: StatusRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
