import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface UnitRow {
  id: string;
  code: string;
  name: string;
  symbol: string;
  measurementType: string;
  baseUnit: string;
  conversionType: string;
  conversionFormula: string;
  decimalPrecision: number;
  minimumDisplayValue: number;
  maximumDisplayValue: number;
  siUnit: boolean;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-unit',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './unit.html',
  styleUrl: './unit.css',
})
export class Unit {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Unit' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Unit Code' },
    { key: 'name', label: 'Unit Name' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'measurementType', label: 'Measurement Type' },
    { key: 'baseUnit', label: 'Base Unit' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: UnitRow[] = [
    { id: 'UNIT-001', code: 'CEL', name: 'Celsius', symbol: '°C', measurementType: 'Temperature', baseUnit: 'Celsius', conversionType: 'None', conversionFormula: 'x', decimalPrecision: 1, minimumDisplayValue: -50, maximumDisplayValue: 150, siUnit: true, status: 'Active', displayOrder: 1 },
    { id: 'UNIT-002', code: 'FAH', name: 'Fahrenheit', symbol: '°F', measurementType: 'Temperature', baseUnit: 'Celsius', conversionType: 'Formula', conversionFormula: '(x*9/5)+32', decimalPrecision: 1, minimumDisplayValue: -58, maximumDisplayValue: 302, siUnit: false, status: 'Active', displayOrder: 2 },
    { id: 'UNIT-003', code: 'RH', name: 'Percent Relative Humidity', symbol: '%RH', measurementType: 'Humidity', baseUnit: '%RH', conversionType: 'None', conversionFormula: 'x', decimalPrecision: 1, minimumDisplayValue: 0, maximumDisplayValue: 100, siUnit: true, status: 'Active', displayOrder: 3 },
    { id: 'UNIT-004', code: 'PA', name: 'Pascal', symbol: 'Pa', measurementType: 'Pressure', baseUnit: 'Pascal', conversionType: 'None', conversionFormula: 'x', decimalPrecision: 0, minimumDisplayValue: 0, maximumDisplayValue: 200000, siUnit: true, status: 'Active', displayOrder: 4 },
    { id: 'UNIT-005', code: 'M', name: 'Meter', symbol: 'm', measurementType: 'Distance', baseUnit: 'Meter', conversionType: 'None', conversionFormula: 'x', decimalPrecision: 2, minimumDisplayValue: 0, maximumDisplayValue: 1000, siUnit: true, status: 'Inactive', displayOrder: 5 },
  ];

  measurementTypes = ['Temperature', 'Humidity', 'Pressure', 'Distance', 'Weight', 'Volume', 'Electrical'];
  conversionTypes = ['None', 'Linear', 'Formula'];

  popupOpen = false;
  editingRow: UnitRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      symbol: ['', Validators.required],
      measurementType: ['', Validators.required],
      baseUnit: [''],
      conversionType: ['None'],
      conversionFormula: ['x'],
      decimalPrecision: [1],
      minimumDisplayValue: [0],
      maximumDisplayValue: [100],
      siUnit: [false],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ conversionType: 'None', conversionFormula: 'x', decimalPrecision: 1, minimumDisplayValue: 0, maximumDisplayValue: 100, siUnit: false, status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: UnitRow): void {
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
      this.rows.push({ id: `UNIT-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: UnitRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
