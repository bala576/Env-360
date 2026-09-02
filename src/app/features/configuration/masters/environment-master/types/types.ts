import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, ENVIRONMENT_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';
import { CategoriesStore } from '../categories/categories-store';

const TYPES_PAGE = '/administration/configuration/masters/environment-master/types';
const CATEGORIES_PAGE = '/administration/configuration/masters/environment-master/categories';

interface EnvironmentTypeRow {
  id: string;
  code: string;
  name: string;
  environmentCategory: string;
  applicationName: string;
  applicationCode: string;
  description: string;
  indoorOutdoor: string;
  defaultMonitoringPointType: string;
  defaultParameterGroup: string;
  defaultSensorTypes: string;
  defaultThresholdProfile: string;
  defaultComplianceStandard: string;
  defaultDashboardTemplate: string;
  icon: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-types',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './types.html',
  styleUrl: './types.css',
})
export class Types {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Environment Master', children: ENVIRONMENT_MASTER_DROPDOWN },
    { label: 'Types' },
  ];

  indoorOutdoorOptions = ['Indoor', 'Outdoor', 'Both'];

  get environmentCategories(): string[] {
    return this.categoriesStore.rows.map(r => r.name);
  }

  columns: TableColumn[] = [
    { key: 'code', label: 'Environment Type Code' },
    { key: 'name', label: 'Environment Type Name' },
    { key: 'environmentCategory', label: 'Environment Category' },
    { key: 'indoorOutdoor', label: 'Indoor / Outdoor' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: EnvironmentTypeRow[] = [
    {
      id: 'ENVTYPE-001',
      code: 'ENV-IAQ',
      name: 'Indoor Air Quality',
      environmentCategory: 'Air Quality',
      applicationName: 'IAQ Monitor',
      applicationCode: 'APP-IAQ',
      description: 'Monitors indoor air quality parameters across enclosed spaces.',
      indoorOutdoor: 'Indoor',
      defaultMonitoringPointType: 'Room Sensor',
      defaultParameterGroup: 'Air Quality Group',
      defaultSensorTypes: 'CO2, PM2.5, VOC',
      defaultThresholdProfile: 'IAQ Standard Profile',
      defaultComplianceStandard: 'ASHRAE 62.1',
      defaultDashboardTemplate: 'IAQ Dashboard',
      icon: 'wind',
      status: 'Active',
      displayOrder: 1,
    },
    {
      id: 'ENVTYPE-002',
      code: 'ENV-MGAS',
      name: 'Manhole Gas Environment',
      environmentCategory: 'Air Quality',
      applicationName: 'Confined Space Monitor',
      applicationCode: 'APP-CSM',
      description: 'Tracks hazardous gas concentration in manholes and confined spaces.',
      indoorOutdoor: 'Outdoor',
      defaultMonitoringPointType: 'Manhole Sensor',
      defaultParameterGroup: 'Gas Safety Group',
      defaultSensorTypes: 'H2S, CH4, O2',
      defaultThresholdProfile: 'Confined Space Safety Profile',
      defaultComplianceStandard: 'OSHA 1910.146',
      defaultDashboardTemplate: 'Gas Safety Dashboard',
      icon: 'alert-triangle',
      status: 'Active',
      displayOrder: 2,
    },
    {
      id: 'ENVTYPE-003',
      code: 'ENV-COLD',
      name: 'Cold Chain Storage',
      environmentCategory: 'Energy',
      applicationName: 'Cold Chain Monitor',
      applicationCode: 'APP-CCM',
      description: 'Ensures temperature-controlled storage stays within safe range.',
      indoorOutdoor: 'Indoor',
      defaultMonitoringPointType: 'Storage Sensor',
      defaultParameterGroup: 'Cold Chain Group',
      defaultSensorTypes: 'Temperature, Humidity',
      defaultThresholdProfile: 'Cold Chain Profile',
      defaultComplianceStandard: 'GDP Guidelines',
      defaultDashboardTemplate: 'Cold Chain Dashboard',
      icon: 'snowflake',
      status: 'Active',
      displayOrder: 3,
    },
    {
      id: 'ENVTYPE-004',
      code: 'ENV-WATER',
      name: 'Ambient Water Body',
      environmentCategory: 'Water Quality',
      applicationName: 'Water Quality Monitor',
      applicationCode: 'APP-WQM',
      description: 'Monitors ambient water bodies for pollutant and quality levels.',
      indoorOutdoor: 'Outdoor',
      defaultMonitoringPointType: 'Water Sensor Buoy',
      defaultParameterGroup: 'Water Quality Group',
      defaultSensorTypes: 'pH, Turbidity, DO',
      defaultThresholdProfile: 'Water Quality Profile',
      defaultComplianceStandard: 'CPCB Water Standards',
      defaultDashboardTemplate: 'Water Quality Dashboard',
      icon: 'droplet',
      status: 'Active',
      displayOrder: 4,
    },
    {
      id: 'ENVTYPE-005',
      code: 'ENV-WEATHER',
      name: 'Outdoor Weather Zone',
      environmentCategory: 'Energy',
      applicationName: 'Weather Station Monitor',
      applicationCode: 'APP-WSM',
      description: 'Captures outdoor meteorological conditions for site-wide analytics.',
      indoorOutdoor: 'Outdoor',
      defaultMonitoringPointType: 'Weather Station',
      defaultParameterGroup: 'Weather Group',
      defaultSensorTypes: 'Wind Speed, Rainfall, Temperature',
      defaultThresholdProfile: 'Weather Alert Profile',
      defaultComplianceStandard: 'N/A',
      defaultDashboardTemplate: 'Weather Dashboard',
      icon: 'cloud',
      status: 'Inactive',
      displayOrder: 5,
    },
  ];

  popupOpen = false;
  editingRow: EnvironmentTypeRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder, private categoriesStore: CategoriesStore, private router: Router) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      environmentCategory: ['', Validators.required],
      applicationName: [''],
      applicationCode: [''],
      description: [''],
      indoorOutdoor: ['Indoor', Validators.required],
      defaultMonitoringPointType: [''],
      defaultParameterGroup: [''],
      defaultSensorTypes: [''],
      defaultThresholdProfile: [''],
      defaultComplianceStandard: [''],
      defaultDashboardTemplate: [''],
      icon: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      environmentCategory: '',
      indoorOutdoor: 'Indoor',
      status: 'Active',
      displayOrder: this.rows.length + 1,
    });
    this.popupOpen = true;
  }

  openEdit(row: EnvironmentTypeRow): void {
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
      this.rows.push({ id: `ENVTYPE-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: EnvironmentTypeRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  isEditCategoryDisabled(): boolean {
    return !this.editingRow;
  }

  addCategory(): void {
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'add', returnUrl: TYPES_PAGE } });
  }

  editCategory(): void {
    if (this.isEditCategoryDisabled()) return;
    const category = this.form.value.environmentCategory;
    if (!category) return;
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'edit', value: category, returnUrl: TYPES_PAGE } });
  }
}
