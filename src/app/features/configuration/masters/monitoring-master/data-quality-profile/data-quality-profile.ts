import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, MONITORING_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface DataQualityProfileRow {
  id: string;
  code: string;
  name: string;
  parameter: string;
  minimumValidValue: number;
  maximumValidValue: number;
  maximumRateOfChange: number;
  staleDataTimeout: string;
  missingDataTimeout: string;
  duplicateDetection: boolean;
  spikeDetection: boolean;
  flatlineDetection: boolean;
  outlierDetection: boolean;
  timestampValidation: boolean;
  expectedSamplingInterval: string;
  dataGapTolerance: string;
  qualityScoreThreshold: number;
  invalidDataAction: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-data-quality-profile',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './data-quality-profile.html',
  styleUrl: './data-quality-profile.css',
})
export class DataQualityProfile {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Monitoring Master', children: MONITORING_MASTER_DROPDOWN },
    { label: 'Data Quality Profile' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Profile Code' },
    { key: 'name', label: 'Profile Name' },
    { key: 'parameter', label: 'Parameter' },
    { key: 'minimumValidValue', label: 'Minimum Valid Value' },
    { key: 'maximumValidValue', label: 'Maximum Valid Value' },
    { key: 'qualityScoreThreshold', label: 'Quality Score Threshold' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  invalidDataActions = ['Discard', 'Flag as Error', 'Use Last Known Value', 'Interpolate'];

  rows: DataQualityProfileRow[] = [
    { id: 'DQP-001', code: 'DQP-TEMP', name: 'Temperature Data Quality', parameter: 'Temperature', minimumValidValue: -50, maximumValidValue: 150, maximumRateOfChange: 5, staleDataTimeout: '15 min', missingDataTimeout: '30 min', duplicateDetection: true, spikeDetection: true, flatlineDetection: true, outlierDetection: true, timestampValidation: true, expectedSamplingInterval: '5 min', dataGapTolerance: '10 min', qualityScoreThreshold: 80, invalidDataAction: 'Flag as Error', description: 'Data quality rules for temperature sensor readings.', status: 'Active' },
    { id: 'DQP-002', code: 'DQP-HUM', name: 'Humidity Data Quality', parameter: 'Humidity', minimumValidValue: 0, maximumValidValue: 100, maximumRateOfChange: 10, staleDataTimeout: '15 min', missingDataTimeout: '30 min', duplicateDetection: true, spikeDetection: true, flatlineDetection: true, outlierDetection: false, timestampValidation: true, expectedSamplingInterval: '5 min', dataGapTolerance: '10 min', qualityScoreThreshold: 80, invalidDataAction: 'Use Last Known Value', description: 'Data quality rules for humidity sensor readings.', status: 'Active' },
    { id: 'DQP-003', code: 'DQP-CO2', name: 'CO2 Data Quality', parameter: 'CO2', minimumValidValue: 0, maximumValidValue: 5000, maximumRateOfChange: 200, staleDataTimeout: '10 min', missingDataTimeout: '20 min', duplicateDetection: true, spikeDetection: true, flatlineDetection: false, outlierDetection: true, timestampValidation: true, expectedSamplingInterval: '1 min', dataGapTolerance: '5 min', qualityScoreThreshold: 85, invalidDataAction: 'Flag as Error', description: 'Data quality rules for CO2 gas sensor readings.', status: 'Active' },
    { id: 'DQP-004', code: 'DQP-GAS', name: 'Gas Sensor Data Quality', parameter: 'H2S', minimumValidValue: 0, maximumValidValue: 100, maximumRateOfChange: 20, staleDataTimeout: '2 min', missingDataTimeout: '5 min', duplicateDetection: true, spikeDetection: true, flatlineDetection: true, outlierDetection: true, timestampValidation: true, expectedSamplingInterval: '30 sec', dataGapTolerance: '2 min', qualityScoreThreshold: 95, invalidDataAction: 'Discard', description: 'Data quality rules for hazardous gas sensor readings.', status: 'Active' },
    { id: 'DQP-005', code: 'DQP-WQ', name: 'Water Quality Data Quality', parameter: 'pH', minimumValidValue: 0, maximumValidValue: 14, maximumRateOfChange: 2, staleDataTimeout: '30 min', missingDataTimeout: '60 min', duplicateDetection: false, spikeDetection: true, flatlineDetection: true, outlierDetection: true, timestampValidation: false, expectedSamplingInterval: '15 min', dataGapTolerance: '30 min', qualityScoreThreshold: 70, invalidDataAction: 'Interpolate', description: 'Data quality rules for water quality sensor readings.', status: 'Inactive' },
  ];

  popupOpen = false;
  editingRow: DataQualityProfileRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      parameter: ['', Validators.required],
      minimumValidValue: [0],
      maximumValidValue: [100],
      maximumRateOfChange: [0],
      staleDataTimeout: [''],
      missingDataTimeout: [''],
      duplicateDetection: [true],
      spikeDetection: [true],
      flatlineDetection: [true],
      outlierDetection: [true],
      timestampValidation: [true],
      expectedSamplingInterval: [''],
      dataGapTolerance: [''],
      qualityScoreThreshold: [80],
      invalidDataAction: ['Flag as Error', Validators.required],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      minimumValidValue: 0,
      maximumValidValue: 100,
      maximumRateOfChange: 0,
      duplicateDetection: true,
      spikeDetection: true,
      flatlineDetection: true,
      outlierDetection: true,
      timestampValidation: true,
      qualityScoreThreshold: 80,
      invalidDataAction: 'Flag as Error',
      status: 'Active',
    });
    this.popupOpen = true;
  }

  openEdit(row: DataQualityProfileRow): void {
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
      this.rows.push({ id: `DQP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: DataQualityProfileRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
