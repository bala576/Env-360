import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, MONITORING_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface ThresholdProfileRow {
  id: string;
  code: string;
  name: string;
  environmentType: string;
  parameter: string;
  unit: string;
  normalLowerLimit: number | null;
  normalUpperLimit: number | null;
  warningLowerLimit: number | null;
  warningUpperLimit: number | null;
  criticalLowerLimit: number | null;
  criticalUpperLimit: number | null;
  triggerDuration: string;
  clearDuration: string;
  hysteresis: number | null;
  rateOfChangeLimit: string;
  schedule: string;
  description: string;
  version: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-threshold-profile',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './threshold-profile.html',
  styleUrl: './threshold-profile.css',
})
export class ThresholdProfile {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Monitoring Master', children: MONITORING_MASTER_DROPDOWN },
    { label: 'Threshold Profile' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Profile Code' },
    { key: 'name', label: 'Profile Name' },
    { key: 'parameter', label: 'Parameter' },
    { key: 'warningLowerLimit', label: 'Warning Lower Limit' },
    { key: 'warningUpperLimit', label: 'Warning Upper Limit' },
    { key: 'criticalLowerLimit', label: 'Critical Lower Limit' },
    { key: 'criticalUpperLimit', label: 'Critical Upper Limit' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  rows: ThresholdProfileRow[] = [
    { id: 'THP-001', code: 'THP-TEMP', name: 'Temperature Threshold', environmentType: 'Indoor Air Quality', parameter: 'Temperature', unit: '°C', normalLowerLimit: 18, normalUpperLimit: 26, warningLowerLimit: 15, warningUpperLimit: 30, criticalLowerLimit: 10, criticalUpperLimit: 35, triggerDuration: '5 min', clearDuration: '2 min', hysteresis: 0.5, rateOfChangeLimit: '2°C/min', schedule: '24x7', description: 'Temperature threshold profile for indoor air quality monitoring', version: 'v1.0', status: 'Active' },
    { id: 'THP-002', code: 'THP-HUM', name: 'Humidity Threshold', environmentType: 'Indoor Air Quality', parameter: 'Humidity', unit: '%RH', normalLowerLimit: 30, normalUpperLimit: 60, warningLowerLimit: 20, warningUpperLimit: 70, criticalLowerLimit: 10, criticalUpperLimit: 85, triggerDuration: '5 min', clearDuration: '2 min', hysteresis: 1, rateOfChangeLimit: '5%RH/min', schedule: '24x7', description: 'Humidity threshold profile for indoor air quality monitoring', version: 'v1.0', status: 'Active' },
    { id: 'THP-003', code: 'THP-CO2', name: 'CO2 Threshold', environmentType: 'Indoor Air Quality', parameter: 'CO2', unit: 'ppm', normalLowerLimit: 0, normalUpperLimit: 800, warningLowerLimit: 0, warningUpperLimit: 1000, criticalLowerLimit: 0, criticalUpperLimit: 1500, triggerDuration: '3 min', clearDuration: '2 min', hysteresis: 20, rateOfChangeLimit: '50 ppm/min', schedule: 'Business Hours', description: 'CO2 threshold profile for occupied spaces', version: 'v1.1', status: 'Active' },
    { id: 'THP-004', code: 'THP-H2S', name: 'H2S Gas Threshold', environmentType: 'Confined Space', parameter: 'H2S', unit: 'ppm', normalLowerLimit: 0, normalUpperLimit: 5, warningLowerLimit: 0, warningUpperLimit: 10, criticalLowerLimit: 0, criticalUpperLimit: 20, triggerDuration: '30s', clearDuration: '1 min', hysteresis: 0.5, rateOfChangeLimit: '2 ppm/min', schedule: '24x7', description: 'Hazardous gas threshold profile for manhole confined spaces', version: 'v1.0', status: 'Active' },
    { id: 'THP-005', code: 'THP-PH', name: 'Water pH Threshold', environmentType: 'Water Quality', parameter: 'pH', unit: 'pH', normalLowerLimit: 6.5, normalUpperLimit: 8.5, warningLowerLimit: 6, warningUpperLimit: 9, criticalLowerLimit: 5, criticalUpperLimit: 10, triggerDuration: '10 min', clearDuration: '5 min', hysteresis: 0.2, rateOfChangeLimit: '0.5 pH/min', schedule: '24x7', description: 'pH threshold profile for ambient water quality monitoring', version: 'v1.0', status: 'Inactive' },
  ];

  popupOpen = false;
  editingRow: ThresholdProfileRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      environmentType: [''],
      parameter: ['', Validators.required],
      unit: [''],
      normalLowerLimit: [null],
      normalUpperLimit: [null],
      warningLowerLimit: [null],
      warningUpperLimit: [null],
      criticalLowerLimit: [null],
      criticalUpperLimit: [null],
      triggerDuration: [''],
      clearDuration: [''],
      hysteresis: [null],
      rateOfChangeLimit: [''],
      schedule: [''],
      description: [''],
      version: ['v1.0'],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ version: 'v1.0', status: 'Active' });
    this.popupOpen = true;
  }

  openEdit(row: ThresholdProfileRow): void {
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
      this.rows.push({ id: `THP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: ThresholdProfileRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
