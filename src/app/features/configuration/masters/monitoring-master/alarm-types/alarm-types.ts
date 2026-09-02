import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, MONITORING_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';
import { SeverityStore } from '../../general-master/severity/severity-store';

const ALARM_TYPES_PAGE = '/administration/configuration/masters/monitoring-master/alarm-types';
const SEVERITY_PAGE = '/administration/configuration/masters/general-master/severity';

interface AlarmTypeRow {
  id: string;
  code: string;
  name: string;
  alarmCategory: string;
  environmentCategory: string;
  parameter: string;
  defaultSeverity: string;
  triggerType: string;
  description: string;
  acknowledgementRequired: boolean;
  autoClearEnabled: boolean;
  autoClearDuration: string;
  sla: string;
  defaultNotificationProfile: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-alarm-types',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './alarm-types.html',
  styleUrl: './alarm-types.css',
})
export class AlarmTypes {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Monitoring Master', children: MONITORING_MASTER_DROPDOWN },
    { label: 'Alarm Types' },
  ];

  environmentCategories = ['Air Quality', 'Water Quality', 'Noise', 'Energy', 'Waste'];
  triggerTypes = ['Threshold', 'Rate of Change', 'Device Status', 'Data Quality'];

  get severities(): string[] {
    return this.severityStore.rows.map(r => r.name);
  }

  columns: TableColumn[] = [
    { key: 'code', label: 'Alarm Code' },
    { key: 'name', label: 'Alarm Name' },
    { key: 'alarmCategory', label: 'Alarm Category' },
    { key: 'defaultSeverity', label: 'Default Severity' },
    { key: 'triggerType', label: 'Trigger Type' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: AlarmTypeRow[] = [
    {
      id: 'ALM-001',
      code: 'ALM-HTEMP',
      name: 'High Temperature Alarm',
      alarmCategory: 'Threshold Breach',
      environmentCategory: 'Air Quality',
      parameter: 'Temperature',
      defaultSeverity: 'Critical',
      triggerType: 'Threshold',
      description: 'Triggered when ambient temperature exceeds the configured upper limit.',
      acknowledgementRequired: true,
      autoClearEnabled: true,
      autoClearDuration: '10 min',
      sla: '15 min',
      defaultNotificationProfile: 'Critical Alert Profile',
      status: 'Active',
      displayOrder: 1,
    },
    {
      id: 'ALM-002',
      code: 'ALM-LOWBATT',
      name: 'Low Battery Alarm',
      alarmCategory: 'Device Offline',
      environmentCategory: 'Energy',
      parameter: 'Battery Level',
      defaultSeverity: 'Warning',
      triggerType: 'Threshold',
      description: 'Triggered when device battery level drops below the safe threshold.',
      acknowledgementRequired: false,
      autoClearEnabled: true,
      autoClearDuration: '30 min',
      sla: '60 min',
      defaultNotificationProfile: 'Standard Alert Profile',
      status: 'Active',
      displayOrder: 2,
    },
    {
      id: 'ALM-003',
      code: 'ALM-GASLEAK',
      name: 'Gas Leak Alarm',
      alarmCategory: 'Threshold Breach',
      environmentCategory: 'Air Quality',
      parameter: 'H2S',
      defaultSeverity: 'Critical',
      triggerType: 'Threshold',
      description: 'Triggered when hazardous gas concentration exceeds safety limits.',
      acknowledgementRequired: true,
      autoClearEnabled: false,
      autoClearDuration: 'N/A',
      sla: '5 min',
      defaultNotificationProfile: 'Critical Alert Profile',
      status: 'Active',
      displayOrder: 3,
    },
    {
      id: 'ALM-004',
      code: 'ALM-DEVOFF',
      name: 'Device Offline Alarm',
      alarmCategory: 'Device Offline',
      environmentCategory: 'Energy',
      parameter: 'Connectivity',
      defaultSeverity: 'Major',
      triggerType: 'Device Status',
      description: 'Triggered when a device stops reporting data beyond the expected interval.',
      acknowledgementRequired: true,
      autoClearEnabled: true,
      autoClearDuration: '5 min',
      sla: '30 min',
      defaultNotificationProfile: 'Standard Alert Profile',
      status: 'Active',
      displayOrder: 4,
    },
    {
      id: 'ALM-005',
      code: 'ALM-DATAQ',
      name: 'Data Quality Alarm',
      alarmCategory: 'Data Quality',
      environmentCategory: 'Water Quality',
      parameter: 'pH',
      defaultSeverity: 'Minor',
      triggerType: 'Data Quality',
      description: 'Triggered when incoming sensor data fails quality validation checks.',
      acknowledgementRequired: false,
      autoClearEnabled: true,
      autoClearDuration: '15 min',
      sla: '120 min',
      defaultNotificationProfile: 'Low Priority Profile',
      status: 'Inactive',
      displayOrder: 5,
    },
  ];

  popupOpen = false;
  editingRow: AlarmTypeRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder, private severityStore: SeverityStore, private router: Router) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      alarmCategory: [''],
      environmentCategory: ['', Validators.required],
      parameter: [''],
      defaultSeverity: ['Major', Validators.required],
      triggerType: ['Threshold', Validators.required],
      description: [''],
      acknowledgementRequired: [false],
      autoClearEnabled: [false],
      autoClearDuration: [''],
      sla: [''],
      defaultNotificationProfile: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      defaultSeverity: 'Major',
      triggerType: 'Threshold',
      acknowledgementRequired: false,
      autoClearEnabled: false,
      status: 'Active',
      displayOrder: this.rows.length + 1,
    });
    this.popupOpen = true;
  }

  openEdit(row: AlarmTypeRow): void {
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
      this.rows.push({ id: `ALM-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: AlarmTypeRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  isEditSeverityDisabled(): boolean {
    return !this.editingRow;
  }

  addSeverity(): void {
    this.router.navigate([SEVERITY_PAGE], { queryParams: { action: 'add', returnUrl: ALARM_TYPES_PAGE } });
  }

  editSeverity(): void {
    if (this.isEditSeverityDisabled()) return;
    const severity = this.form.value.defaultSeverity;
    if (!severity) return;
    this.router.navigate([SEVERITY_PAGE], { queryParams: { action: 'edit', value: severity, returnUrl: ALARM_TYPES_PAGE } });
  }
}
