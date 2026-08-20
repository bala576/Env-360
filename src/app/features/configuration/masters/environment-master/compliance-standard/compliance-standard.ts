import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, ENVIRONMENT_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface ComplianceStandardRow {
  id: string;
  standardCode: string;
  standardName: string;
  organizationAuthority: string;
  version: string;
  environmentCategory: string;
  environmentType: string;
  parameter: string;
  unit: string;
  limitType: string;
  limitValue: number | null;
  lowerLimit: number | null;
  upperLimit: number | null;
  averagingPeriod: string;
  applicableLocation: string;
  applicableIndustry: string;
  effectiveFrom: string;
  effectiveTo: string;
  referenceDocument: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-compliance-standard',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './compliance-standard.html',
  styleUrl: './compliance-standard.css',
})
export class ComplianceStandard {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Environment Master', children: ENVIRONMENT_MASTER_DROPDOWN },
    { label: 'Compliance Standard' },
  ];

  columns: TableColumn[] = [
    { key: 'standardCode', label: 'Standard Code' },
    { key: 'standardName', label: 'Standard Name' },
    { key: 'parameter', label: 'Parameter' },
    { key: 'limitType', label: 'Limit Type' },
    { key: 'unit', label: 'Unit' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  environmentCategories = ['Air Quality', 'Water Quality', 'Noise', 'Energy', 'Waste'];
  limitTypes = ['Maximum', 'Minimum', 'Range'];

  rows: ComplianceStandardRow[] = [
    {
      id: 'STD-001',
      standardCode: 'WHO-PM25',
      standardName: 'WHO Air Quality Guideline for PM2.5',
      organizationAuthority: 'World Health Organization',
      version: '2021',
      environmentCategory: 'Air Quality',
      environmentType: 'Ambient Air',
      parameter: 'PM2.5',
      unit: 'µg/m³',
      limitType: 'Maximum',
      limitValue: 15,
      lowerLimit: null,
      upperLimit: null,
      averagingPeriod: '24 Hours',
      applicableLocation: 'Outdoor',
      applicableIndustry: 'General',
      effectiveFrom: '2021-09-01',
      effectiveTo: '',
      referenceDocument: 'WHO Global Air Quality Guidelines 2021',
      description: 'Maximum permissible PM2.5 concentration in ambient air.',
      status: 'Active',
    },
    {
      id: 'STD-002',
      standardCode: 'EPA-NOISE-IND',
      standardName: 'EPA Noise Standard for Industrial Zones',
      organizationAuthority: 'Environmental Protection Agency',
      version: '3.2',
      environmentCategory: 'Noise',
      environmentType: 'Industrial',
      parameter: 'Sound Pressure Level',
      unit: 'dB(A)',
      limitType: 'Maximum',
      limitValue: 75,
      lowerLimit: null,
      upperLimit: null,
      averagingPeriod: '1 Hour',
      applicableLocation: 'Industrial Zone Boundary',
      applicableIndustry: 'Manufacturing',
      effectiveFrom: '2019-06-01',
      effectiveTo: '',
      referenceDocument: 'EPA Noise Control Regulation No. 44',
      description: 'Maximum allowable noise level at industrial zone boundary.',
      status: 'Active',
    },
    {
      id: 'STD-003',
      standardCode: 'ISO-WQ-PH',
      standardName: 'ISO Water Quality Standard for pH',
      organizationAuthority: 'International Organization for Standardization',
      version: '2017',
      environmentCategory: 'Water Quality',
      environmentType: 'Surface Water',
      parameter: 'pH',
      unit: 'pH',
      limitType: 'Range',
      limitValue: null,
      lowerLimit: 6.5,
      upperLimit: 8.5,
      averagingPeriod: 'Instantaneous',
      applicableLocation: 'Surface Water Bodies',
      applicableIndustry: 'General',
      effectiveFrom: '2017-01-01',
      effectiveTo: '',
      referenceDocument: 'ISO 10523:2008 Water Quality',
      description: 'Acceptable pH range for surface water discharge.',
      status: 'Active',
    },
    {
      id: 'STD-004',
      standardCode: 'OSHA-H2S-CS',
      standardName: 'OSHA Confined Space Gas Limit for H2S',
      organizationAuthority: 'Occupational Safety and Health Administration',
      version: '1.0',
      environmentCategory: 'Air Quality',
      environmentType: 'Confined Space',
      parameter: 'Hydrogen Sulfide (H2S)',
      unit: 'ppm',
      limitType: 'Maximum',
      limitValue: 10,
      lowerLimit: null,
      upperLimit: null,
      averagingPeriod: '8 Hours',
      applicableLocation: 'Manholes, Confined Spaces',
      applicableIndustry: 'Utilities',
      effectiveFrom: '2016-03-01',
      effectiveTo: '',
      referenceDocument: 'OSHA 29 CFR 1910.146',
      description: 'Maximum permissible exposure limit for H2S in confined spaces.',
      status: 'Active',
    },
    {
      id: 'STD-005',
      standardCode: 'MUN-CO2-OCC',
      standardName: 'Local Municipal Standard for CO2 in Occupied Spaces',
      organizationAuthority: 'City Environmental Board',
      version: '1.4',
      environmentCategory: 'Air Quality',
      environmentType: 'Indoor Air',
      parameter: 'Carbon Dioxide (CO2)',
      unit: 'ppm',
      limitType: 'Maximum',
      limitValue: 1000,
      lowerLimit: null,
      upperLimit: null,
      averagingPeriod: '1 Hour',
      applicableLocation: 'Occupied Indoor Spaces',
      applicableIndustry: 'Commercial',
      effectiveFrom: '2015-01-01',
      effectiveTo: '2024-12-31',
      referenceDocument: 'Municipal Indoor Air Quality Bylaw 12',
      description: 'Maximum CO2 concentration permitted in occupied indoor spaces.',
      status: 'Inactive',
    },
  ];

  popupOpen = false;
  editingRow: ComplianceStandardRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      standardCode: ['', Validators.required],
      standardName: ['', Validators.required],
      organizationAuthority: [''],
      version: [''],
      environmentCategory: ['', Validators.required],
      environmentType: [''],
      parameter: [''],
      unit: [''],
      limitType: ['Maximum', Validators.required],
      limitValue: [null],
      lowerLimit: [null],
      upperLimit: [null],
      averagingPeriod: [''],
      applicableLocation: [''],
      applicableIndustry: [''],
      effectiveFrom: [''],
      effectiveTo: [''],
      referenceDocument: [''],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ limitType: 'Maximum', status: 'Active' });
    this.popupOpen = true;
  }

  openEdit(row: ComplianceStandardRow): void {
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
      this.rows.push({ id: `STD-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: ComplianceStandardRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
