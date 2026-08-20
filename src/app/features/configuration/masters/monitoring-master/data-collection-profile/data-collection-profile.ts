import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, MONITORING_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface DataCollectionProfileRow {
  id: string;
  profileCode: string;
  profileName: string;
  samplingInterval: string;
  reportingInterval: string;
  aggregationInterval: string;
  aggregationMethod: string;
  rawDataRetention: string;
  aggregatedDataRetention: string;
  timezone: string;
  timestampSource: string;
  bufferingEnabled: boolean;
  offlineStorageDuration: string;
  batchSize: number;
  transmissionMode: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-data-collection-profile',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './data-collection-profile.html',
  styleUrl: './data-collection-profile.css',
})
export class DataCollectionProfile {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Monitoring Master', children: MONITORING_MASTER_DROPDOWN },
    { label: 'Data Collection Profile' },
  ];

  aggregationMethods = ['Average', 'Sum', 'Min', 'Max', 'Last'];
  timestampSources = ['Device', 'Server', 'GPS'];
  transmissionModes = ['Real-time', 'Batch', 'Store and Forward'];

  columns: TableColumn[] = [
    { key: 'profileCode', label: 'Profile Code' },
    { key: 'profileName', label: 'Profile Name' },
    { key: 'samplingInterval', label: 'Sampling Interval' },
    { key: 'reportingInterval', label: 'Reporting Interval' },
    { key: 'aggregationMethod', label: 'Aggregation Method' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  rows: DataCollectionProfileRow[] = [
    {
      id: 'DCP-001',
      profileCode: 'DCP-IND-HF',
      profileName: 'High Frequency Indoor Sensors',
      samplingInterval: '30 sec',
      reportingInterval: '1 min',
      aggregationInterval: '5 min',
      aggregationMethod: 'Average',
      rawDataRetention: '30 days',
      aggregatedDataRetention: '1 year',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      timestampSource: 'Device',
      bufferingEnabled: true,
      offlineStorageDuration: '24 hours',
      batchSize: 50,
      transmissionMode: 'Real-time',
      description: 'High resolution data collection for indoor air quality sensors.',
      status: 'Active',
    },
    {
      id: 'DCP-002',
      profileCode: 'DCP-OUT-LP',
      profileName: 'Low Power Outdoor Sensors',
      samplingInterval: '5 min',
      reportingInterval: '15 min',
      aggregationInterval: '1 hour',
      aggregationMethod: 'Average',
      rawDataRetention: '15 days',
      aggregatedDataRetention: '6 months',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      timestampSource: 'Device',
      bufferingEnabled: true,
      offlineStorageDuration: '72 hours',
      batchSize: 20,
      transmissionMode: 'Batch',
      description: 'Battery-optimized collection profile for outdoor field sensors.',
      status: 'Active',
    },
    {
      id: 'DCP-003',
      profileCode: 'DCP-GAS-RT',
      profileName: 'Critical Gas Monitoring',
      samplingInterval: '5 sec',
      reportingInterval: '10 sec',
      aggregationInterval: '1 min',
      aggregationMethod: 'Max',
      rawDataRetention: '90 days',
      aggregatedDataRetention: '2 years',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      timestampSource: 'Server',
      bufferingEnabled: false,
      offlineStorageDuration: '1 hour',
      batchSize: 1,
      transmissionMode: 'Real-time',
      description: 'Zero-delay collection profile for confined space gas safety sensors.',
      status: 'Active',
    },
    {
      id: 'DCP-004',
      profileCode: 'DCP-COLD-CH',
      profileName: 'Cold Chain Monitoring',
      samplingInterval: '1 min',
      reportingInterval: '5 min',
      aggregationInterval: '15 min',
      aggregationMethod: 'Average',
      rawDataRetention: '60 days',
      aggregatedDataRetention: '3 years',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      timestampSource: 'Device',
      bufferingEnabled: true,
      offlineStorageDuration: '48 hours',
      batchSize: 30,
      transmissionMode: 'Store and Forward',
      description: 'Continuous cold storage temperature and humidity logging.',
      status: 'Active',
    },
    {
      id: 'DCP-005',
      profileCode: 'DCP-WTHR-BT',
      profileName: 'Weather Station Batch Reporting',
      samplingInterval: '10 min',
      reportingInterval: '1 hour',
      aggregationInterval: '1 day',
      aggregationMethod: 'Average',
      rawDataRetention: '7 days',
      aggregatedDataRetention: '5 years',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      timestampSource: 'GPS',
      bufferingEnabled: true,
      offlineStorageDuration: '7 days',
      batchSize: 100,
      transmissionMode: 'Batch',
      description: 'Daily aggregated batch reporting for outdoor weather stations.',
      status: 'Inactive',
    },
  ];

  popupOpen = false;
  editingRow: DataCollectionProfileRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      profileCode: ['', Validators.required],
      profileName: ['', Validators.required],
      samplingInterval: [''],
      reportingInterval: [''],
      aggregationInterval: [''],
      aggregationMethod: ['Average'],
      rawDataRetention: [''],
      aggregatedDataRetention: [''],
      timezone: [''],
      timestampSource: ['Device'],
      bufferingEnabled: [false],
      offlineStorageDuration: [''],
      batchSize: [1],
      transmissionMode: ['Real-time'],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      aggregationMethod: 'Average',
      timestampSource: 'Device',
      bufferingEnabled: false,
      batchSize: 1,
      transmissionMode: 'Real-time',
      status: 'Active',
    });
    this.popupOpen = true;
  }

  openEdit(row: DataCollectionProfileRow): void {
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
      this.rows.push({ id: `DCP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: DataCollectionProfileRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
