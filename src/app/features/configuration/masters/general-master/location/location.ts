import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface LocationTypeRow {
  id: string;
  code: string;
  name: string;
  parentLocationType: string;
  description: string;
  icon: string;
  color: string;
  allowsMonitoringPoints: boolean;
  allowsDevices: boolean;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-location',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './location.html',
  styleUrl: './location.css',
})
export class Location {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Location' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Location Type Code' },
    { key: 'name', label: 'Location Type Name' },
    { key: 'parentLocationType', label: 'Parent Location Type' },
    { key: 'allowsMonitoringPoints', label: 'Monitoring Points' },
    { key: 'allowsDevices', label: 'Devices' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: LocationTypeRow[] = [
    { id: 'LOC-001', code: 'LT-BLD', name: 'Building', parentLocationType: '-', description: 'Top level building structure', icon: '', color: '#7030a0', allowsMonitoringPoints: true, allowsDevices: true, status: 'Active', displayOrder: 1 },
    { id: 'LOC-002', code: 'LT-FLR', name: 'Floor', parentLocationType: 'Building', description: 'Floor within a building', icon: '', color: '#3b82f6', allowsMonitoringPoints: true, allowsDevices: true, status: 'Active', displayOrder: 2 },
    { id: 'LOC-003', code: 'LT-RM', name: 'Room', parentLocationType: 'Floor', description: 'Room within a floor', icon: '', color: '#22c55e', allowsMonitoringPoints: true, allowsDevices: true, status: 'Active', displayOrder: 3 },
    { id: 'LOC-004', code: 'LT-MH', name: 'Manhole', parentLocationType: '-', description: 'Underground manhole location', icon: '', color: '#f97316', allowsMonitoringPoints: true, allowsDevices: true, status: 'Active', displayOrder: 4 },
    { id: 'LOC-005', code: 'LT-ZN', name: 'Zone', parentLocationType: '-', description: 'Open outdoor zone', icon: '', color: '#9ca3af', allowsMonitoringPoints: false, allowsDevices: true, status: 'Inactive', displayOrder: 5 },
  ];

  popupOpen = false;
  editingRow: LocationTypeRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      parentLocationType: [''],
      description: [''],
      icon: [''],
      color: ['#7030a0'],
      allowsMonitoringPoints: [true],
      allowsDevices: [true],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  get parentOptions(): LocationTypeRow[] {
    return this.rows.filter(row => row.id !== this.editingRow?.id);
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ color: '#7030a0', allowsMonitoringPoints: true, allowsDevices: true, status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: LocationTypeRow): void {
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
      this.rows.push({ id: `LOC-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: LocationTypeRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
