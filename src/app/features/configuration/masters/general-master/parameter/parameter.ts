import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface ParameterRow {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: string;
  group: string;
  dataType: string;
  unit: string;
  defaultUnit: string;
  minimumPossibleValue: number;
  maximumPossibleValue: number;
  defaultDecimalPrecision: number;
  aggregationMethod: string;
  rateOfChangeSupported: boolean;
  trendSupported: boolean;
  calculatedParameter: boolean;
  higherIsBetter: boolean;
  lowerIsBetter: boolean;
  description: string;
  icon: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-parameter',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './parameter.html',
  styleUrl: './parameter.css',
})
export class Parameter {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Parameter' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Parameter Code' },
    { key: 'name', label: 'Parameter Name' },
    { key: 'shortName', label: 'Short Name' },
    { key: 'category', label: 'Category' },
    { key: 'group', label: 'Group' },
    { key: 'dataType', label: 'Data Type' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: ParameterRow[] = [
    { id: 'PARAM-001', code: 'TEMP', name: 'Temperature', shortName: 'Temp', category: 'Environmental', group: 'Climate', dataType: 'Numeric', unit: 'Celsius', defaultUnit: 'Celsius', minimumPossibleValue: -50, maximumPossibleValue: 150, defaultDecimalPrecision: 1, aggregationMethod: 'Average', rateOfChangeSupported: true, trendSupported: true, calculatedParameter: false, higherIsBetter: false, lowerIsBetter: false, description: 'Ambient temperature', icon: '', status: 'Active', displayOrder: 1 },
    { id: 'PARAM-002', code: 'HUM', name: 'Humidity', shortName: 'Hum', category: 'Environmental', group: 'Climate', dataType: 'Numeric', unit: '%RH', defaultUnit: '%RH', minimumPossibleValue: 0, maximumPossibleValue: 100, defaultDecimalPrecision: 1, aggregationMethod: 'Average', rateOfChangeSupported: true, trendSupported: true, calculatedParameter: false, higherIsBetter: false, lowerIsBetter: false, description: 'Relative humidity', icon: '', status: 'Active', displayOrder: 2 },
    { id: 'PARAM-003', code: 'CO2', name: 'Carbon Dioxide', shortName: 'CO2', category: 'Environmental', group: 'Air Quality', dataType: 'Numeric', unit: 'ppm', defaultUnit: 'ppm', minimumPossibleValue: 0, maximumPossibleValue: 5000, defaultDecimalPrecision: 0, aggregationMethod: 'Average', rateOfChangeSupported: true, trendSupported: true, calculatedParameter: false, higherIsBetter: false, lowerIsBetter: true, description: 'CO2 concentration', icon: '', status: 'Active', displayOrder: 3 },
    { id: 'PARAM-004', code: 'BATT', name: 'Battery Level', shortName: 'Battery', category: 'Device', group: 'Power', dataType: 'Numeric', unit: '%', defaultUnit: '%', minimumPossibleValue: 0, maximumPossibleValue: 100, defaultDecimalPrecision: 0, aggregationMethod: 'Last', rateOfChangeSupported: false, trendSupported: true, calculatedParameter: false, higherIsBetter: true, lowerIsBetter: false, description: 'Device battery charge', icon: '', status: 'Active', displayOrder: 4 },
    { id: 'PARAM-005', code: 'SIG', name: 'Signal Strength', shortName: 'Signal', category: 'Device', group: 'Connectivity', dataType: 'Numeric', unit: 'dBm', defaultUnit: 'dBm', minimumPossibleValue: -120, maximumPossibleValue: 0, defaultDecimalPrecision: 0, aggregationMethod: 'Last', rateOfChangeSupported: false, trendSupported: true, calculatedParameter: false, higherIsBetter: true, lowerIsBetter: false, description: 'Network signal strength', icon: '', status: 'Inactive', displayOrder: 5 },
  ];

  categories = ['Environmental', 'Device', 'Compliance'];
  dataTypes = ['Numeric', 'Text', 'Boolean'];
  aggregationMethods = ['Average', 'Sum', 'Min', 'Max', 'Last'];

  popupOpen = false;
  editingRow: ParameterRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      shortName: [''],
      category: ['', Validators.required],
      group: [''],
      dataType: ['Numeric', Validators.required],
      unit: [''],
      defaultUnit: [''],
      minimumPossibleValue: [0],
      maximumPossibleValue: [100],
      defaultDecimalPrecision: [1],
      aggregationMethod: ['Average'],
      rateOfChangeSupported: [false],
      trendSupported: [false],
      calculatedParameter: [false],
      higherIsBetter: [false],
      lowerIsBetter: [false],
      description: [''],
      icon: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ dataType: 'Numeric', minimumPossibleValue: 0, maximumPossibleValue: 100, defaultDecimalPrecision: 1, aggregationMethod: 'Average', rateOfChangeSupported: false, trendSupported: false, calculatedParameter: false, higherIsBetter: false, lowerIsBetter: false, status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: ParameterRow): void {
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
      this.rows.push({ id: `PARAM-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: ParameterRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
