import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, ENVIRONMENT_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface EnvironmentCategoryRow {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultParameterGroups: string;
  defaultSensorTypes: string;
  defaultDashboardTemplate: string;
  defaultComplianceStandard: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-categories',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Environment Master', children: ENVIRONMENT_MASTER_DROPDOWN },
    { label: 'Categories' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Category Code' },
    { key: 'name', label: 'Category Name' },
    { key: 'defaultParameterGroups', label: 'Default Parameter Groups' },
    { key: 'defaultSensorTypes', label: 'Default Sensor Types' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: EnvironmentCategoryRow[] = [
    { id: 'CAT-001', code: 'AIR', name: 'Air Quality', description: 'Ambient and indoor air quality monitoring', icon: '', color: '#3b82f6', defaultParameterGroups: 'Air Pollutants, Climate', defaultSensorTypes: 'PM2.5, PM10, CO2, VOC', defaultDashboardTemplate: 'Air Quality Overview', defaultComplianceStandard: 'CPCB NAAQS', status: 'Active', displayOrder: 1 },
    { id: 'CAT-002', code: 'WATER', name: 'Water Quality', description: 'Surface and ground water quality monitoring', icon: '', color: '#0ea5e9', defaultParameterGroups: 'Water Quality', defaultSensorTypes: 'pH, Turbidity, Dissolved Oxygen', defaultDashboardTemplate: 'Water Quality Overview', defaultComplianceStandard: 'CPCB Water Standards', status: 'Active', displayOrder: 2 },
    { id: 'CAT-003', code: 'NOISE', name: 'Noise', description: 'Ambient noise level monitoring', icon: '', color: '#f97316', defaultParameterGroups: 'Acoustics', defaultSensorTypes: 'Sound Level Meter', defaultDashboardTemplate: 'Noise Levels Overview', defaultComplianceStandard: 'CPCB Noise Rules', status: 'Active', displayOrder: 3 },
    { id: 'CAT-004', code: 'ENERGY', name: 'Energy', description: 'Energy consumption and efficiency monitoring', icon: '', color: '#eab308', defaultParameterGroups: 'Power, Consumption', defaultSensorTypes: 'Energy Meter, Current Sensor', defaultDashboardTemplate: 'Energy Consumption Overview', defaultComplianceStandard: 'ISO 50001', status: 'Active', displayOrder: 4 },
    { id: 'CAT-005', code: 'WASTE', name: 'Waste', description: 'Waste generation and disposal monitoring', icon: '', color: '#6b7280', defaultParameterGroups: 'Waste Volume', defaultSensorTypes: 'Level Sensor, Weight Sensor', defaultDashboardTemplate: 'Waste Management Overview', defaultComplianceStandard: 'Solid Waste Management Rules', status: 'Inactive', displayOrder: 5 },
  ];

  popupOpen = false;
  editingRow: EnvironmentCategoryRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      icon: [''],
      color: ['#7030a0'],
      defaultParameterGroups: [''],
      defaultSensorTypes: [''],
      defaultDashboardTemplate: [''],
      defaultComplianceStandard: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ color: '#7030a0', status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: EnvironmentCategoryRow): void {
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
      this.rows.push({ id: `CAT-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: EnvironmentCategoryRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
