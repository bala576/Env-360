import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GenericTable, TableColumn } from '../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../shared/generic-popup/generic-popup';
import { Breadcrumb, BreadcrumbItem } from '../../../../shared/breadcrumb/breadcrumb';
import { DeviceHealthPopup } from '../../../../shared/device-health-popup/device-health-popup';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN } from '../../../../shared/layout/sidebar/admin-nav.data';
import { DeviceStore, DeviceRow, DeviceParameterAssignment } from '../device-store';
import {
  PARAMETER_OPTIONS,
  PARAMETER_UNITS,
  THRESHOLD_PROFILE_OPTIONS,
  DATA_COLLECTION_PROFILE_OPTIONS,
  DATA_QUALITY_PROFILE_OPTIONS,
} from '../device-options.data';

const TABS = ['Overview', 'Parameters', 'Live Data', 'History', 'Events', 'Configuration'];

@Component({
  selector: 'app-device-details',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GenericTable, GenericPopup, Breadcrumb, DeviceHealthPopup],
  templateUrl: './device-details.html',
  styleUrl: './device-details.css',
})
export class DeviceDetails implements OnInit {

  tabs = TABS;
  activeTab = 'Overview';

  device: DeviceRow | null = null;

  parameterColumns: TableColumn[] = [
    { key: 'parameter', label: 'Parameter' },
    { key: 'unit', label: 'Unit' },
    { key: 'enabled', label: 'Enabled', type: 'toggle' },
    { key: 'thresholdProfile', label: 'Threshold Profile' },
    { key: 'status', label: 'Status', type: 'badge' },
  ];

  parameterOptions = PARAMETER_OPTIONS;
  thresholdProfileOptions = THRESHOLD_PROFILE_OPTIONS;
  dataCollectionProfileOptions = DATA_COLLECTION_PROFILE_OPTIONS;
  dataQualityProfileOptions = DATA_QUALITY_PROFILE_OPTIONS;

  parameterPopupOpen = false;
  parameterForm: FormGroup;

  healthPopupOpen = false;

  breadcrumb: BreadcrumbItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: DeviceStore,
    private fb: FormBuilder,
  ) {
    this.parameterForm = this.fb.group({
      parameter: ['', Validators.required],
      unit: [''],
      thresholdProfile: [''],
      dataCollectionProfile: [''],
      dataQualityProfile: [''],
      enabled: [true],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('deviceId');
    const device = id ? this.store.getById(id) : undefined;

    if (!device) {
      this.router.navigate(['/administration/configuration/devices']);
      return;
    }

    this.device = device;
    this.breadcrumb = [
      { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
      { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
      { label: 'Devices', route: '/administration/configuration/devices' },
      { label: device.name },
    ];
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  onParameterChange(): void {
    const parameter = this.parameterForm.value.parameter;
    this.parameterForm.patchValue({ unit: PARAMETER_UNITS[parameter] ?? '' });
  }

  openAddParameter(): void {
    this.parameterForm.reset({ enabled: true });
    this.parameterPopupOpen = true;
  }

  closeParameterPopup(): void {
    this.parameterPopupOpen = false;
  }

  saveParameter(): void {
    if (this.parameterForm.invalid || !this.device) {
      this.parameterForm.markAllAsTouched();
      return;
    }

    const value = this.parameterForm.value;
    const assignment: DeviceParameterAssignment = {
      parameter: value.parameter,
      unit: value.unit,
      thresholdProfile: value.thresholdProfile || '-',
      dataCollectionProfile: value.dataCollectionProfile || '-',
      dataQualityProfile: value.dataQualityProfile || '-',
      enabled: value.enabled,
      status: value.enabled ? 'Active' : 'Inactive',
    };

    this.device.parameters.push(assignment);
    this.closeParameterPopup();
  }

  onParameterToggle(row: DeviceParameterAssignment): void {
    const isActive = row.enabled === true || (row.enabled as unknown) === 'Active';
    row.enabled = isActive;
    row.status = isActive ? 'Active' : 'Inactive';
  }

  deleteParameter(row: DeviceParameterAssignment): void {
    if (!this.device) return;
    this.device.parameters = this.device.parameters.filter(p => p !== row);
  }

  openHealth(): void {
    this.healthPopupOpen = true;
  }

  closeHealthPopup(): void {
    this.healthPopupOpen = false;
  }

  backToList(): void {
    this.router.navigate(['/administration/configuration/devices']);
  }
}
