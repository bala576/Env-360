import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../shared/generic-table/generic-table';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { DeviceHealthPopup } from '../../../shared/device-health-popup/device-health-popup';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN } from '../../../shared/layout/sidebar/admin-nav.data';
import { DeviceStore, DeviceRow } from './device-store';
import { AddDeviceWizard } from './add-device-wizard/add-device-wizard';
import { DEVICE_MODEL_OPTIONS } from './device-options.data';

@Component({
  selector: 'app-device',
  imports: [CommonModule, FormsModule, GenericTable, Breadcrumb, DeviceHealthPopup, AddDeviceWizard],
  templateUrl: './device.html',
  styleUrl: './device.css',
})
export class Device {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Devices' },
  ];

  columns: TableColumn[] = [
    { key: 'id', label: 'Device ID' },
    { key: 'name', label: 'Device' },
    { key: 'locationLabel', label: 'Project' },
    { key: 'installationLocation', label: 'Location' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'health', label: 'Health', type: 'health' },
  ];

  deviceModelOptions = ['All', ...DEVICE_MODEL_OPTIONS];
  statusOptions = ['All', 'Active', 'Inactive'];

  selectedProject = 'All';
  selectedEnvironment = 'All';
  selectedDeviceModel = 'All';
  selectedStatus = 'All';

  wizardOpen = false;
  healthPopupOpen = false;
  healthPopupDevice: DeviceRow | null = null;

  constructor(private store: DeviceStore, private router: Router) {}

  get rows(): DeviceRow[] {
    return this.store.rows;
  }

  get environmentOptions(): string[] {
    const unique = Array.from(new Set(this.rows.map(r => r.deviceProfile)));
    return ['All', ...unique];
  }

  get projectOptions(): string[] {
    const unique = Array.from(new Set(this.rows.map(r => r.project)));
    return ['All', ...unique];
  }

  get filteredRows(): DeviceRow[] {
    return this.rows.filter(row =>
      (this.selectedProject === 'All' || row.project === this.selectedProject) &&
      (this.selectedEnvironment === 'All' || row.deviceProfile === this.selectedEnvironment) &&
      (this.selectedDeviceModel === 'All' || row.deviceModel === this.selectedDeviceModel) &&
      (this.selectedStatus === 'All' || row.status === this.selectedStatus)
    );
  }

  goToDetails(row: DeviceRow): void {
    this.router.navigate(['/administration/configuration/devices', row.id]);
  }

  openHealth(event: { row: DeviceRow }): void {
    this.healthPopupDevice = event.row;
    this.healthPopupOpen = true;
  }

  closeHealthPopup(): void {
    this.healthPopupOpen = false;
    this.healthPopupDevice = null;
  }

  viewDeviceFromHealth(): void {
    if (this.healthPopupDevice) {
      this.goToDetails(this.healthPopupDevice);
    }
    this.closeHealthPopup();
  }

  openWizard(): void {
    this.wizardOpen = true;
  }

  closeWizard(): void {
    this.wizardOpen = false;
  }

  onDeviceCreated(row: DeviceRow): void {
    this.store.add(row);
    this.closeWizard();
  }

  deleteRow(row: DeviceRow): void {
    this.store.delete(row);
  }
}
