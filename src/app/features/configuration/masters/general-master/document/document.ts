import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface DocumentTypeRow {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  allowedFileTypes: string;
  maximumFileSize: string;
  mandatory: boolean;
  expiryApplicable: boolean;
  retentionPeriod: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-document',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './document.html',
  styleUrl: './document.css',
})
export class Document {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Document' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Document Type Code' },
    { key: 'name', label: 'Document Type Name' },
    { key: 'category', label: 'Document Category' },
    { key: 'mandatory', label: 'Mandatory' },
    { key: 'expiryApplicable', label: 'Expiry Applicable' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: DocumentTypeRow[] = [
    { id: 'DOC-001', code: 'CAL-CERT', name: 'Calibration Certificate', category: 'Compliance', description: 'Sensor calibration certificate', allowedFileTypes: 'PDF', maximumFileSize: '5 MB', mandatory: true, expiryApplicable: true, retentionPeriod: '5 Years', status: 'Active', displayOrder: 1 },
    { id: 'DOC-002', code: 'COMP-RPT', name: 'Compliance Report', category: 'Compliance', description: 'Regulatory compliance report', allowedFileTypes: 'PDF, DOCX', maximumFileSize: '10 MB', mandatory: true, expiryApplicable: true, retentionPeriod: '3 Years', status: 'Active', displayOrder: 2 },
    { id: 'DOC-003', code: 'SITE-PHOTO', name: 'Site Photo', category: 'Media', description: 'Site inspection photo', allowedFileTypes: 'JPG, PNG', maximumFileSize: '8 MB', mandatory: false, expiryApplicable: false, retentionPeriod: '1 Year', status: 'Active', displayOrder: 3 },
    { id: 'DOC-004', code: 'MAINT-LOG', name: 'Maintenance Log', category: 'Operations', description: 'Maintenance activity log', allowedFileTypes: 'PDF, XLSX', maximumFileSize: '5 MB', mandatory: true, expiryApplicable: false, retentionPeriod: '2 Years', status: 'Active', displayOrder: 4 },
    { id: 'DOC-005', code: 'WARRANTY', name: 'Warranty Card', category: 'Asset', description: 'Device warranty document', allowedFileTypes: 'PDF, JPG', maximumFileSize: '5 MB', mandatory: false, expiryApplicable: true, retentionPeriod: '10 Years', status: 'Inactive', displayOrder: 5 },
  ];

  categories = ['Compliance', 'Media', 'Operations', 'Asset'];

  popupOpen = false;
  editingRow: DocumentTypeRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      allowedFileTypes: [''],
      maximumFileSize: [''],
      mandatory: [false],
      expiryApplicable: [false],
      retentionPeriod: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ mandatory: false, expiryApplicable: false, status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: DocumentTypeRow): void {
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
      this.rows.push({ id: `DOC-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: DocumentTypeRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
