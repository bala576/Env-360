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

const NOTIFICATION_PROFILE_PAGE = '/administration/configuration/masters/monitoring-master/notification-profile';
const SEVERITY_PAGE = '/administration/configuration/masters/general-master/severity';

interface NotificationProfileRow {
  id: string;
  code: string;
  name: string;
  alarmSeverity: string;
  notificationChannels: string;
  primaryRecipientType: string;
  primaryRecipients: string;
  escalationEnabled: boolean;
  escalationLevel: string;
  escalationRecipient: string;
  escalationDelay: string;
  repeatNotification: boolean;
  repeatInterval: string;
  maximumAttempts: number;
  acknowledgementRequired: boolean;
  businessHoursOnly: boolean;
  quietHours: string;
  emailTemplate: string;
  smsTemplate: string;
  pushTemplate: string;
  webhook: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-notification-profile',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './notification-profile.html',
  styleUrl: './notification-profile.css',
})
export class NotificationProfile {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Monitoring Master', children: MONITORING_MASTER_DROPDOWN },
    { label: 'Notification Profile' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Profile Code' },
    { key: 'name', label: 'Profile Name' },
    { key: 'alarmSeverity', label: 'Alarm Severity' },
    { key: 'notificationChannels', label: 'Notification Channels' },
    { key: 'primaryRecipientType', label: 'Primary Recipient Type' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  rows: NotificationProfileRow[] = [
    { id: 'NTP-001', code: 'NTP-GAS-CRIT', name: 'Critical Gas Alarm Notification', alarmSeverity: 'Critical', notificationChannels: 'Email, SMS, Push', primaryRecipientType: 'Role', primaryRecipients: 'site-admins@env360.com', escalationEnabled: true, escalationLevel: 'Level 2', escalationRecipient: 'ops-manager@env360.com', escalationDelay: '5 min', repeatNotification: true, repeatInterval: '5 min', maximumAttempts: 5, acknowledgementRequired: true, businessHoursOnly: false, quietHours: '', emailTemplate: 'critical-alert-email-v1', smsTemplate: 'critical-alert-sms-v1', pushTemplate: 'critical-alert-push-v1', webhook: 'https://hooks.env360.com/critical-gas', description: 'Immediate multi-channel alert for critical gas concentration breaches.', status: 'Active' },
    { id: 'NTP-002', code: 'NTP-TEMP-WARN', name: 'Temperature Warning Notification', alarmSeverity: 'Warning', notificationChannels: 'Email, Push', primaryRecipientType: 'Individual', primaryRecipients: 'facility.lead@env360.com', escalationEnabled: false, escalationLevel: '', escalationRecipient: '', escalationDelay: '', repeatNotification: false, repeatInterval: '', maximumAttempts: 1, acknowledgementRequired: false, businessHoursOnly: true, quietHours: '22:00 - 06:00', emailTemplate: 'temp-warning-email-v1', smsTemplate: '', pushTemplate: 'temp-warning-push-v1', webhook: '', description: 'Alerts facility lead when temperature drifts outside normal range.', status: 'Active' },
    { id: 'NTP-003', code: 'NTP-DEV-OFFLINE', name: 'Device Offline Notification', alarmSeverity: 'Major', notificationChannels: 'Email, SMS', primaryRecipientType: 'Group', primaryRecipients: 'maintenance-team@env360.com', escalationEnabled: true, escalationLevel: 'Level 1', escalationRecipient: 'maintenance.head@env360.com', escalationDelay: '15 min', repeatNotification: true, repeatInterval: '30 min', maximumAttempts: 3, acknowledgementRequired: true, businessHoursOnly: false, quietHours: '', emailTemplate: 'device-offline-email-v1', smsTemplate: 'device-offline-sms-v1', pushTemplate: '', webhook: '', description: 'Notifies maintenance team when a monitoring device goes offline.', status: 'Active' },
    { id: 'NTP-004', code: 'NTP-DQ-ISSUE', name: 'Data Quality Issue Notification', alarmSeverity: 'Minor', notificationChannels: 'Email', primaryRecipientType: 'Role', primaryRecipients: 'data-team@env360.com', escalationEnabled: false, escalationLevel: '', escalationRecipient: '', escalationDelay: '', repeatNotification: false, repeatInterval: '', maximumAttempts: 1, acknowledgementRequired: false, businessHoursOnly: true, quietHours: '20:00 - 08:00', emailTemplate: 'data-quality-email-v1', smsTemplate: '', pushTemplate: '', webhook: '', description: 'Flags stale, missing, or outlier data readings to the data team.', status: 'Active' },
    { id: 'NTP-005', code: 'NTP-INFO-ROUTINE', name: 'Routine Info Notification', alarmSeverity: 'Info', notificationChannels: 'Push', primaryRecipientType: 'Individual', primaryRecipients: 'dashboard.viewer@env360.com', escalationEnabled: false, escalationLevel: '', escalationRecipient: '', escalationDelay: '', repeatNotification: false, repeatInterval: '', maximumAttempts: 1, acknowledgementRequired: false, businessHoursOnly: true, quietHours: '21:00 - 07:00', emailTemplate: '', smsTemplate: '', pushTemplate: 'info-routine-push-v1', webhook: '', description: 'Low-priority informational updates for dashboard viewers.', status: 'Inactive' },
  ];

  recipientTypes = ['Individual', 'Role', 'Group'];

  get alarmSeverities(): string[] {
    return this.severityStore.rows.map(r => r.name);
  }

  popupOpen = false;
  editingRow: NotificationProfileRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder, private severityStore: SeverityStore, private router: Router) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      alarmSeverity: ['', Validators.required],
      notificationChannels: [''],
      primaryRecipientType: ['', Validators.required],
      primaryRecipients: [''],
      escalationEnabled: [false],
      escalationLevel: [''],
      escalationRecipient: [''],
      escalationDelay: [''],
      repeatNotification: [false],
      repeatInterval: [''],
      maximumAttempts: [1],
      acknowledgementRequired: [false],
      businessHoursOnly: [false],
      quietHours: [''],
      emailTemplate: [''],
      smsTemplate: [''],
      pushTemplate: [''],
      webhook: [''],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      escalationEnabled: false,
      repeatNotification: false,
      maximumAttempts: 1,
      acknowledgementRequired: false,
      businessHoursOnly: false,
      status: 'Active',
    });
    this.popupOpen = true;
  }

  openEdit(row: NotificationProfileRow): void {
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
      this.rows.push({ id: `NTP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: NotificationProfileRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  isEditSeverityDisabled(): boolean {
    return !this.editingRow;
  }

  addSeverity(): void {
    this.router.navigate([SEVERITY_PAGE], { queryParams: { action: 'add', returnUrl: NOTIFICATION_PROFILE_PAGE } });
  }

  editSeverity(): void {
    if (this.isEditSeverityDisabled()) return;
    const severity = this.form.value.alarmSeverity;
    if (!severity) return;
    this.router.navigate([SEVERITY_PAGE], { queryParams: { action: 'edit', value: severity, returnUrl: NOTIFICATION_PROFILE_PAGE } });
  }
}
