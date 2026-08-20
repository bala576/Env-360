import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, MONITORING_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface MaintenanceProfileRow {
  id: string;
  profileCode: string;
  profileName: string;
  sensorType: string;
  deviceModel: string;
  parameter: string;
  calibrationRequired: boolean;
  calibrationFrequency: string;
  calibrationMethod: string;
  calibrationStandard: string;
  maintenanceRequired: boolean;
  maintenanceFrequency: string;
  maintenanceType: string;
  cleaningFrequency: string;
  inspectionFrequency: string;
  replacementInterval: string;
  batteryReplacementInterval: string;
  warningBeforeDue: string;
  certificateRequired: boolean;
  defaultMaintenanceDuration: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-maintenance-profile',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './maintenance-profile.html',
  styleUrl: './maintenance-profile.css',
})
export class MaintenanceProfile {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Monitoring Master', children: MONITORING_MASTER_DROPDOWN },
    { label: 'Maintenance Profile' },
  ];

  maintenanceTypes = ['Preventive', 'Corrective', 'Predictive'];

  columns: TableColumn[] = [
    { key: 'profileCode', label: 'Profile Code' },
    { key: 'profileName', label: 'Profile Name' },
    { key: 'sensorType', label: 'Sensor Type' },
    { key: 'calibrationFrequency', label: 'Calibration Frequency' },
    { key: 'maintenanceFrequency', label: 'Maintenance Frequency' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  rows: MaintenanceProfileRow[] = [
    {
      id: 'MTP-001',
      profileCode: 'MTP-GAS',
      profileName: 'Gas Sensor Maintenance',
      sensorType: 'H2S Gas Sensor',
      deviceModel: 'GasGuard GG-H2S-200',
      parameter: 'H2S',
      calibrationRequired: true,
      calibrationFrequency: '3 months',
      calibrationMethod: 'Reference Gas Calibration',
      calibrationStandard: 'ISO 17025',
      maintenanceRequired: true,
      maintenanceFrequency: '6 months',
      maintenanceType: 'Preventive',
      cleaningFrequency: '1 month',
      inspectionFrequency: '2 weeks',
      replacementInterval: '2 years',
      batteryReplacementInterval: '1 year',
      warningBeforeDue: '14 days',
      certificateRequired: true,
      defaultMaintenanceDuration: '2 hours',
      description: 'Frequent calibration profile for confined-space gas sensors.',
      status: 'Active',
    },
    {
      id: 'MTP-002',
      profileCode: 'MTP-TEMP',
      profileName: 'Temperature & Humidity Sensor Maintenance',
      sensorType: 'Temperature & Humidity Sensor',
      deviceModel: 'ClimaTech CT-100',
      parameter: 'Temperature',
      calibrationRequired: true,
      calibrationFrequency: '6 months',
      calibrationMethod: 'Reference Thermometer Comparison',
      calibrationStandard: 'ISO 17025',
      maintenanceRequired: true,
      maintenanceFrequency: '1 year',
      maintenanceType: 'Preventive',
      cleaningFrequency: '3 months',
      inspectionFrequency: '1 month',
      replacementInterval: '5 years',
      batteryReplacementInterval: '2 years',
      warningBeforeDue: '30 days',
      certificateRequired: true,
      defaultMaintenanceDuration: '1 hour',
      description: 'Standard maintenance profile for indoor climate sensors.',
      status: 'Active',
    },
    {
      id: 'MTP-003',
      profileCode: 'MTP-WATER',
      profileName: 'Water Quality Sensor Maintenance',
      sensorType: 'pH Sensor',
      deviceModel: 'AquaMetrics AM-PH-50',
      parameter: 'pH',
      calibrationRequired: true,
      calibrationFrequency: '1 month',
      calibrationMethod: 'Buffer Solution Calibration',
      calibrationStandard: 'ASTM D1293',
      maintenanceRequired: true,
      maintenanceFrequency: '3 months',
      maintenanceType: 'Preventive',
      cleaningFrequency: '2 weeks',
      inspectionFrequency: '1 month',
      replacementInterval: '18 months',
      batteryReplacementInterval: '1 year',
      warningBeforeDue: '7 days',
      certificateRequired: false,
      defaultMaintenanceDuration: '45 min',
      description: 'High-frequency calibration profile for water quality probes.',
      status: 'Active',
    },
    {
      id: 'MTP-004',
      profileCode: 'MTP-WIRELESS',
      profileName: 'Battery-Powered Wireless Sensor Maintenance',
      sensorType: 'Wireless Multi-Sensor',
      deviceModel: 'EnviroSense ES-Multi-400',
      parameter: 'Multiple',
      calibrationRequired: false,
      calibrationFrequency: 'N/A',
      calibrationMethod: 'N/A',
      calibrationStandard: 'N/A',
      maintenanceRequired: true,
      maintenanceFrequency: '1 year',
      maintenanceType: 'Predictive',
      cleaningFrequency: '6 months',
      inspectionFrequency: '3 months',
      replacementInterval: '3 years',
      batteryReplacementInterval: '1 year',
      warningBeforeDue: '21 days',
      certificateRequired: false,
      defaultMaintenanceDuration: '30 min',
      description: 'Battery and connectivity focused maintenance for wireless sensor nodes.',
      status: 'Inactive',
    },
    {
      id: 'MTP-005',
      profileCode: 'MTP-WEATHER',
      profileName: 'Weather Station Equipment Maintenance',
      sensorType: 'Weather Station',
      deviceModel: 'SenTech ST-Weather-500',
      parameter: 'Wind Speed, Rainfall, Temperature',
      calibrationRequired: true,
      calibrationFrequency: '1 year',
      calibrationMethod: 'Field Reference Comparison',
      calibrationStandard: 'WMO Guidelines',
      maintenanceRequired: true,
      maintenanceFrequency: '1 year',
      maintenanceType: 'Preventive',
      cleaningFrequency: '3 months',
      inspectionFrequency: '6 months',
      replacementInterval: '7 years',
      batteryReplacementInterval: 'N/A',
      warningBeforeDue: '30 days',
      certificateRequired: true,
      defaultMaintenanceDuration: '3 hours',
      description: 'Annual servicing profile for outdoor weather station equipment.',
      status: 'Active',
    },
  ];

  popupOpen = false;
  editingRow: MaintenanceProfileRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      profileCode: ['', Validators.required],
      profileName: ['', Validators.required],
      sensorType: [''],
      deviceModel: [''],
      parameter: [''],
      calibrationRequired: [false],
      calibrationFrequency: [''],
      calibrationMethod: [''],
      calibrationStandard: [''],
      maintenanceRequired: [false],
      maintenanceFrequency: [''],
      maintenanceType: ['Preventive'],
      cleaningFrequency: [''],
      inspectionFrequency: [''],
      replacementInterval: [''],
      batteryReplacementInterval: [''],
      warningBeforeDue: [''],
      certificateRequired: [false],
      defaultMaintenanceDuration: [''],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      calibrationRequired: false,
      maintenanceRequired: false,
      maintenanceType: 'Preventive',
      certificateRequired: false,
      status: 'Active',
    });
    this.popupOpen = true;
  }

  openEdit(row: MaintenanceProfileRow): void {
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
      this.rows.push({ id: `MTP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: MaintenanceProfileRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
