import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, SENSOR_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';
import { CategoriesStore } from '../../environment-master/categories/categories-store';

const DEVICE_PROFILE_PAGE = '/administration/configuration/masters/sensor-master/device-profile';
const CATEGORIES_PAGE = '/administration/configuration/masters/environment-master/categories';

interface DeviceProfileRow {
  id: string;
  profileCode: string;
  profileName: string;
  deviceType: string;
  deviceModel: string;
  environmentCategory: string;
  environmentType: string;
  parameterGroup: string;
  sensorChannels: number;
  reportingInterval: string;
  samplingInterval: string;
  thresholdProfile: string;
  dataQualityProfile: string;
  dataCollectionProfile: string;
  notificationProfile: string;
  calibrationProfile: string;
  maintenanceProfile: string;
  defaultDashboard: string;
  description: string;
  version: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-device-profile',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './device-profile.html',
  styleUrl: './device-profile.css',
})
export class DeviceProfile {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Sensor Master', children: SENSOR_MASTER_DROPDOWN },
    { label: 'Device Profile' },
  ];

  get environmentCategories(): string[] {
    return this.categoriesStore.rows.map(r => r.name);
  }

  columns: TableColumn[] = [
    { key: 'profileCode', label: 'Profile Code' },
    { key: 'profileName', label: 'Profile Name' },
    { key: 'deviceType', label: 'Device Type' },
    { key: 'deviceModel', label: 'Device Model' },
    { key: 'environmentCategory', label: 'Environment Category' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  rows: DeviceProfileRow[] = [
    {
      id: 'DVP-001',
      profileCode: 'DVP-IAQ',
      profileName: 'Indoor Air Quality Profile',
      deviceType: 'Wireless Sensor',
      deviceModel: 'ClimaTech CT-100',
      environmentCategory: 'Air Quality',
      environmentType: 'Indoor Air Quality',
      parameterGroup: 'Air Quality Group',
      sensorChannels: 4,
      reportingInterval: '5 min',
      samplingInterval: '1 min',
      thresholdProfile: 'IAQ Standard Profile',
      dataQualityProfile: 'Standard Quality Profile',
      dataCollectionProfile: 'Continuous Collection Profile',
      notificationProfile: 'IAQ Alert Profile',
      calibrationProfile: 'Annual Calibration Profile',
      maintenanceProfile: 'Quarterly Maintenance Profile',
      defaultDashboard: 'IAQ Dashboard',
      description: 'Device profile for indoor air quality monitoring endpoints.',
      version: 'v1.0',
      status: 'Active',
    },
    {
      id: 'DVP-002',
      profileCode: 'DVP-MGAS',
      profileName: 'Manhole Gas Detection Profile',
      deviceType: 'Confined Space Sensor',
      deviceModel: 'GasGuard GX-200',
      environmentCategory: 'Air Quality',
      environmentType: 'Manhole Gas Environment',
      parameterGroup: 'Gas Safety Group',
      sensorChannels: 3,
      reportingInterval: '1 min',
      samplingInterval: '30 sec',
      thresholdProfile: 'Confined Space Safety Profile',
      dataQualityProfile: 'Critical Quality Profile',
      dataCollectionProfile: 'High Frequency Collection Profile',
      notificationProfile: 'Gas Safety Alert Profile',
      calibrationProfile: 'Monthly Calibration Profile',
      maintenanceProfile: 'Monthly Maintenance Profile',
      defaultDashboard: 'Gas Safety Dashboard',
      description: 'Device profile for manhole and confined space gas detection.',
      version: 'v1.2',
      status: 'Active',
    },
    {
      id: 'DVP-003',
      profileCode: 'DVP-COLD',
      profileName: 'Cold Storage Profile',
      deviceType: 'Wireless Sensor',
      deviceModel: 'ClimaTech CT-100',
      environmentCategory: 'Energy',
      environmentType: 'Cold Chain Storage',
      parameterGroup: 'Cold Chain Group',
      sensorChannels: 2,
      reportingInterval: '5 min',
      samplingInterval: '2 min',
      thresholdProfile: 'Cold Chain Profile',
      dataQualityProfile: 'Standard Quality Profile',
      dataCollectionProfile: 'Continuous Collection Profile',
      notificationProfile: 'Cold Chain Alert Profile',
      calibrationProfile: 'Annual Calibration Profile',
      maintenanceProfile: 'Quarterly Maintenance Profile',
      defaultDashboard: 'Cold Chain Dashboard',
      description: 'Device profile for cold storage temperature and humidity tracking.',
      version: 'v1.0',
      status: 'Active',
    },
    {
      id: 'DVP-004',
      profileCode: 'DVP-WATER',
      profileName: 'Water Quality Profile',
      deviceType: 'Water Sensor Buoy',
      deviceModel: 'AquaSense AQ-300',
      environmentCategory: 'Water Quality',
      environmentType: 'Ambient Water Body',
      parameterGroup: 'Water Quality Group',
      sensorChannels: 3,
      reportingInterval: '15 min',
      samplingInterval: '5 min',
      thresholdProfile: 'Water Quality Profile',
      dataQualityProfile: 'Standard Quality Profile',
      dataCollectionProfile: 'Periodic Collection Profile',
      notificationProfile: 'Water Quality Alert Profile',
      calibrationProfile: 'Quarterly Calibration Profile',
      maintenanceProfile: 'Quarterly Maintenance Profile',
      defaultDashboard: 'Water Quality Dashboard',
      description: 'Device profile for ambient water body quality monitoring.',
      version: 'v2.0',
      status: 'Active',
    },
    {
      id: 'DVP-005',
      profileCode: 'DVP-WEATHER',
      profileName: 'Weather Station Profile',
      deviceType: 'Weather Station',
      deviceModel: 'SkyWatch SW-400',
      environmentCategory: 'Energy',
      environmentType: 'Outdoor Weather Zone',
      parameterGroup: 'Weather Group',
      sensorChannels: 5,
      reportingInterval: '10 min',
      samplingInterval: '1 min',
      thresholdProfile: 'Weather Alert Profile',
      dataQualityProfile: 'Standard Quality Profile',
      dataCollectionProfile: 'Continuous Collection Profile',
      notificationProfile: 'Weather Alert Profile',
      calibrationProfile: 'Annual Calibration Profile',
      maintenanceProfile: 'Semi-Annual Maintenance Profile',
      defaultDashboard: 'Weather Dashboard',
      description: 'Device profile for outdoor weather monitoring stations.',
      version: 'v1.1',
      status: 'Inactive',
    },
  ];

  popupOpen = false;
  editingRow: DeviceProfileRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder, private categoriesStore: CategoriesStore, private router: Router) {
    this.form = this.fb.group({
      profileCode: ['', Validators.required],
      profileName: ['', Validators.required],
      deviceType: [''],
      deviceModel: [''],
      environmentCategory: ['', Validators.required],
      environmentType: [''],
      parameterGroup: [''],
      sensorChannels: [1],
      reportingInterval: [''],
      samplingInterval: [''],
      thresholdProfile: [''],
      dataQualityProfile: [''],
      dataCollectionProfile: [''],
      notificationProfile: [''],
      calibrationProfile: [''],
      maintenanceProfile: [''],
      defaultDashboard: [''],
      description: [''],
      version: ['v1.0'],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ sensorChannels: 1, version: 'v1.0', status: 'Active' });
    this.popupOpen = true;
  }

  openEdit(row: DeviceProfileRow): void {
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
      this.rows.push({ id: `DVP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: DeviceProfileRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  isEditCategoryDisabled(): boolean {
    return !this.editingRow;
  }

  addCategory(): void {
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'add', returnUrl: DEVICE_PROFILE_PAGE } });
  }

  editCategory(): void {
    if (this.isEditCategoryDisabled()) return;
    const category = this.form.value.environmentCategory;
    if (!category) return;
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'edit', value: category, returnUrl: DEVICE_PROFILE_PAGE } });
  }
}
