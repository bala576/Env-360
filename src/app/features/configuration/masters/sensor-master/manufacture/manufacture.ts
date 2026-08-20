import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, SENSOR_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface ManufacturerRow {
  id: string;
  code: string;
  name: string;
  manufacturerType: string;
  country: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  contactPerson: string;
  logo: string;
  description: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-manufacture',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './manufacture.html',
  styleUrl: './manufacture.css',
})
export class Manufacture {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Sensor Master', children: SENSOR_MASTER_DROPDOWN },
    { label: 'Manufacture' },
  ];

  manufacturerTypes = ['OEM', 'Sensor Manufacturer', 'Device Integrator', 'Third Party'];

  columns: TableColumn[] = [
    { key: 'code', label: 'Manufacturer Code' },
    { key: 'name', label: 'Manufacturer Name' },
    { key: 'manufacturerType', label: 'Manufacturer Type' },
    { key: 'country', label: 'Country' },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: ManufacturerRow[] = [
    {
      id: 'MFR-001',
      code: 'SENTECH',
      name: 'SenTech Industries',
      manufacturerType: 'Sensor Manufacturer',
      country: 'Germany',
      website: 'https://www.sentechindustries.com',
      supportEmail: 'support@sentechindustries.com',
      supportPhone: '+49 30 1234 5678',
      address: 'Industriestrasse 12, Munich, Germany',
      contactPerson: 'Hans Mueller',
      logo: 'https://cdn.example.com/logos/sentech.png',
      description: 'Manufacturer of precision environmental sensors.',
      status: 'Active',
      displayOrder: 1,
    },
    {
      id: 'MFR-002',
      code: 'ENVSENSE',
      name: 'EnviroSense Corp',
      manufacturerType: 'OEM',
      country: 'United States',
      website: 'https://www.envirosensecorp.com',
      supportEmail: 'help@envirosensecorp.com',
      supportPhone: '+1 415 555 0192',
      address: '450 Bayshore Blvd, San Francisco, CA, USA',
      contactPerson: 'Laura Chen',
      logo: 'https://cdn.example.com/logos/envirosense.png',
      description: 'OEM supplier of air quality and climate monitoring hardware.',
      status: 'Active',
      displayOrder: 2,
    },
    {
      id: 'MFR-003',
      code: 'GASGUARD',
      name: 'GasGuard Systems',
      manufacturerType: 'Sensor Manufacturer',
      country: 'United Kingdom',
      website: 'https://www.gasguardsystems.co.uk',
      supportEmail: 'support@gasguardsystems.co.uk',
      supportPhone: '+44 20 7946 0958',
      address: '18 Kings Road, London, UK',
      contactPerson: 'Oliver Brooks',
      logo: 'https://cdn.example.com/logos/gasguard.png',
      description: 'Specialist in confined-space gas detection sensors.',
      status: 'Active',
      displayOrder: 3,
    },
    {
      id: 'MFR-004',
      code: 'AQUAMET',
      name: 'AquaMetrics Ltd',
      manufacturerType: 'Device Integrator',
      country: 'India',
      website: 'https://www.aquametrics.in',
      supportEmail: 'support@aquametrics.in',
      supportPhone: '+91 80 4567 8901',
      address: 'Electronic City, Bengaluru, India',
      contactPerson: 'Priya Nair',
      logo: 'https://cdn.example.com/logos/aquametrics.png',
      description: 'Integrator of water quality monitoring devices.',
      status: 'Active',
      displayOrder: 4,
    },
    {
      id: 'MFR-005',
      code: 'CLIMATECH',
      name: 'ClimaTech Devices',
      manufacturerType: 'Third Party',
      country: 'Singapore',
      website: 'https://www.climatechdevices.com',
      supportEmail: 'contact@climatechdevices.com',
      supportPhone: '+65 6123 4567',
      address: '1 Marina Boulevard, Singapore',
      contactPerson: 'Wei Lim',
      logo: 'https://cdn.example.com/logos/climatech.png',
      description: 'Third-party reseller of climate control sensing equipment.',
      status: 'Inactive',
      displayOrder: 5,
    },
  ];

  popupOpen = false;
  editingRow: ManufacturerRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      manufacturerType: ['', Validators.required],
      country: [''],
      website: [''],
      supportEmail: ['', Validators.email],
      supportPhone: [''],
      address: [''],
      contactPerson: [''],
      logo: [''],
      description: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: ManufacturerRow): void {
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
      this.rows.push({ id: `MFR-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: ManufacturerRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
