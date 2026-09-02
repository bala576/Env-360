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

const PARAMETER_GROUPS_PAGE = '/administration/configuration/masters/environment-master/parameter-groups';
const CATEGORIES_PAGE = '/administration/configuration/masters/environment-master/categories';

interface ParameterGroupRow {
  id: string;
  code: string;
  name: string;
  environmentCategory: string;
  environmentType: string;
  description: string;
  parameters: string;
  primaryParameter: string;
  secondaryParameters: string;
  defaultUnit: string;
  defaultSamplingInterval: string;
  defaultAggregation: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-parameter-groups',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './parameter-groups.html',
  styleUrl: './parameter-groups.css',
})
export class ParameterGroups {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Environment Master', children: ENVIRONMENT_MASTER_DROPDOWN },
    { label: 'Parameter Groups' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Parameter Group Code' },
    { key: 'name', label: 'Parameter Group Name' },
    { key: 'environmentCategory', label: 'Environment Category' },
    { key: 'primaryParameter', label: 'Primary Parameter' },
    { key: 'defaultUnit', label: 'Default Unit' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: ParameterGroupRow[] = [
    { id: 'PGRP-001', code: 'PG-CLIMATE', name: 'Climate Group', environmentCategory: 'Air Quality', environmentType: 'Indoor Air', description: 'Ambient climate parameters', parameters: 'Temperature, Humidity', primaryParameter: 'Temperature', secondaryParameters: 'Humidity', defaultUnit: 'Celsius', defaultSamplingInterval: '5 min', defaultAggregation: 'Average', status: 'Active', displayOrder: 1 },
    { id: 'PGRP-002', code: 'PG-AIRQ', name: 'Air Quality Group', environmentCategory: 'Air Quality', environmentType: 'Outdoor Air', description: 'Air pollution parameters', parameters: 'CO2, PM2.5', primaryParameter: 'PM2.5', secondaryParameters: 'CO2', defaultUnit: 'µg/m³', defaultSamplingInterval: '15 min', defaultAggregation: 'Average', status: 'Active', displayOrder: 2 },
    { id: 'PGRP-003', code: 'PG-GASSAFE', name: 'Gas Safety Group', environmentCategory: 'Air Quality', environmentType: 'Confined Space', description: 'Hazardous gas detection parameters', parameters: 'H2S, CH4, O2', primaryParameter: 'H2S', secondaryParameters: 'CH4, O2', defaultUnit: 'ppm', defaultSamplingInterval: '1 min', defaultAggregation: 'Max', status: 'Active', displayOrder: 3 },
    { id: 'PGRP-004', code: 'PG-WATERQ', name: 'Water Quality Group', environmentCategory: 'Water Quality', environmentType: 'Surface Water', description: 'Water quality parameters', parameters: 'pH, Turbidity', primaryParameter: 'pH', secondaryParameters: 'Turbidity', defaultUnit: 'pH', defaultSamplingInterval: '30 min', defaultAggregation: 'Average', status: 'Active', displayOrder: 4 },
    { id: 'PGRP-005', code: 'PG-POWER', name: 'Power Group', environmentCategory: 'Energy', environmentType: 'Device Health', description: 'Device power and connectivity parameters', parameters: 'Battery Level, Signal Strength', primaryParameter: 'Battery Level', secondaryParameters: 'Signal Strength', defaultUnit: '%', defaultSamplingInterval: '10 min', defaultAggregation: 'Last', status: 'Inactive', displayOrder: 5 },
  ];

  aggregationMethods = ['Average', 'Sum', 'Min', 'Max', 'Last'];

  get environmentCategories(): string[] {
    return this.categoriesStore.rows.map(r => r.name);
  }

  popupOpen = false;
  editingRow: ParameterGroupRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder, private categoriesStore: CategoriesStore, private router: Router) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      environmentCategory: ['', Validators.required],
      environmentType: [''],
      description: [''],
      parameters: [''],
      primaryParameter: ['', Validators.required],
      secondaryParameters: [''],
      defaultUnit: [''],
      defaultSamplingInterval: [''],
      defaultAggregation: ['Average'],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ defaultAggregation: 'Average', status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: ParameterGroupRow): void {
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
      this.rows.push({ id: `PGRP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: ParameterGroupRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  isEditCategoryDisabled(): boolean {
    return !this.editingRow;
  }

  addCategory(): void {
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'add', returnUrl: PARAMETER_GROUPS_PAGE } });
  }

  editCategory(): void {
    if (this.isEditCategoryDisabled()) return;
    const category = this.form.value.environmentCategory;
    if (!category) return;
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'edit', value: category, returnUrl: PARAMETER_GROUPS_PAGE } });
  }
}
