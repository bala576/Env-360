import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface OrganizationRow {
  id: string;
  code: string;
  name: string;
  type: string;
  parentOrganization: string;
  description: string;
  logo: string;
  country: string;
  timeZone: string;
  defaultCurrency: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: 'Active' | 'Inactive';
  effectiveFrom: string;
  effectiveTo: string;
  displayOrder: number;
}

@Component({
  selector: 'app-organization',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './organization.html',
  styleUrl: './organization.css',
})
export class Organization {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Organization' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Organization Code' },
    { key: 'name', label: 'Organization Name' },
    { key: 'type', label: 'Organization Type' },
    { key: 'parentOrganization', label: 'Parent Organization' },
    { key: 'country', label: 'Country' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: OrganizationRow[] = [
    {
      id: 'ORG-001',
      code: 'ENV-HQ',
      name: 'Environment 360 HQ',
      type: 'Head Office',
      parentOrganization: '-',
      description: 'Corporate headquarters',
      logo: '',
      country: 'India',
      timeZone: 'Asia/Kolkata (GMT+5:30)',
      defaultCurrency: 'INR',
      contactPerson: 'Anita Sharma',
      contactEmail: 'anita.sharma@env360.com',
      contactPhone: '+91 98765 43210',
      address: 'Plot 12, Tech Park, Bengaluru',
      status: 'Active',
      effectiveFrom: '2024-01-01',
      effectiveTo: '',
      displayOrder: 1,
    },
    {
      id: 'ORG-002',
      code: 'ENV-WEST',
      name: 'Environment 360 West Region',
      type: 'Regional Office',
      parentOrganization: 'Environment 360 HQ',
      description: 'West region operations',
      logo: '',
      country: 'India',
      timeZone: 'Asia/Kolkata (GMT+5:30)',
      defaultCurrency: 'INR',
      contactPerson: 'Rahul Mehta',
      contactEmail: 'rahul.mehta@env360.com',
      contactPhone: '+91 98220 11223',
      address: 'MIDC, Pune',
      status: 'Inactive',
      effectiveFrom: '2024-03-15',
      effectiveTo: '',
      displayOrder: 2,
    },
  ];

  countries = ['India', 'United States', 'United Kingdom', 'Singapore', 'UAE'];
  timeZones = ['Asia/Kolkata (GMT+5:30)', 'UTC (GMT+0:00)', 'America/New_York (GMT-5:00)', 'Asia/Singapore (GMT+8:00)'];
  currencies = ['INR', 'USD', 'GBP', 'SGD', 'AED'];
  orgTypes = ['Head Office', 'Regional Office', 'Branch', 'Site'];

  popupOpen = false;
  editingRow: OrganizationRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      parentOrganization: [''],
      description: [''],
      logo: [''],
      country: ['', Validators.required],
      timeZone: [''],
      defaultCurrency: [''],
      contactPerson: [''],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      address: [''],
      status: ['Active', Validators.required],
      effectiveFrom: [''],
      effectiveTo: [''],
      displayOrder: [this.rows.length + 1],
    });
  }

  get parentOptions(): OrganizationRow[] {
    return this.rows.filter(row => row.id !== this.editingRow?.id);
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: OrganizationRow): void {
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
      this.rows.push({ id: `ORG-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: OrganizationRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
