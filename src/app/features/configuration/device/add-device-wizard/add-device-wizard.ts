import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericPopup } from '../../../../shared/generic-popup/generic-popup';
import { DeviceRow, DeviceStore } from '../device-store';
import { ProjectStore } from '../../project/project-store';
import { LocationNode } from '../../project/location-tree-node/location-tree-node';
import {
  CONNECTIVITY_OPTIONS,
  DEVICE_MODEL_OPTIONS,
  DEVICE_MODEL_SUPPORTED_PARAMETERS,
  DEVICE_PROFILE_BY_MODEL,
  DEVICE_PROFILE_OPTIONS,
  MANUFACTURER_BY_MODEL,
  PARAMETER_OPTIONS,
  PARAMETER_UNITS,
  THRESHOLD_PROFILE_BY_PARAMETER,
  DATA_QUALITY_PROFILE_BY_PARAMETER,
} from '../device-options.data';

const STEP_LABELS = ['Location', 'Device Model', 'Device ID', 'Parameters', 'Connectivity', 'Device Profile'];
const LOCATION_LEVEL_COUNT = 6; // Project, Country, Area, Building, Floor, Zone — "upto Zone", excludes Sub Zone

@Component({
  selector: 'app-add-device-wizard',
  imports: [CommonModule, ReactiveFormsModule, GenericPopup],
  templateUrl: './add-device-wizard.html',
  styleUrl: './add-device-wizard.css',
})
export class AddDeviceWizard implements OnChanges {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<DeviceRow>();

  stepLabels = STEP_LABELS;
  currentStep = 0;

  deviceModelOptions = DEVICE_MODEL_OPTIONS;
  parameterOptions = PARAMETER_OPTIONS;
  connectivityOptions = CONNECTIVITY_OPTIONS;
  deviceProfileOptions = DEVICE_PROFILE_OPTIONS;

  locationLevelNames: string[] = [];
  selectedPath: LocationNode[] = [];

  selectedParameters: string[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder, private store: DeviceStore, private projectStore: ProjectStore) {
    this.locationLevelNames = this.projectStore.levelNames.slice(0, LOCATION_LEVEL_COUNT);
    this.form = this.fb.group({
      deviceModel: ['', Validators.required],
      deviceId: ['', Validators.required],
      connectivity: ['', Validators.required],
      deviceProfile: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.reset();
    }
  }

  private reset(): void {
    this.currentStep = 0;
    this.selectedParameters = [];
    this.selectedPath = [];
    this.form.reset({ deviceId: this.store.nextId() });
  }

  optionsAtLevel(level: number): LocationNode[] {
    return level === 0 ? this.projectStore.projects : (this.selectedPath[level - 1]?.children ?? []);
  }

  isLevelVisible(level: number): boolean {
    if (level === 0) return true;
    return !!this.selectedPath[level - 1] && this.optionsAtLevel(level).length > 0;
  }

  selectAtLevel(level: number, nodeId: string): void {
    const node = this.optionsAtLevel(level).find(n => n.id === nodeId);
    if (!node) return;
    this.selectedPath = [...this.selectedPath.slice(0, level), node];
  }

  get locationStepValid(): boolean {
    if (!this.selectedPath.length) return false;
    const depth = this.selectedPath.length;
    return depth === this.locationLevelNames.length || this.optionsAtLevel(depth).length === 0;
  }

  onDeviceModelChange(): void {
    const model = this.form.value.deviceModel;
    this.selectedParameters = [...(DEVICE_MODEL_SUPPORTED_PARAMETERS[model] ?? [])];
    this.form.patchValue({ deviceProfile: DEVICE_PROFILE_BY_MODEL[model] ?? '' });
  }

  toggleParameter(name: string): void {
    this.selectedParameters = this.selectedParameters.includes(name)
      ? this.selectedParameters.filter(p => p !== name)
      : [...this.selectedParameters, name];
  }

  isParameterSelected(name: string): boolean {
    return this.selectedParameters.includes(name);
  }

  get currentStepControlName(): string | null {
    return [null, 'deviceModel', 'deviceId', null, 'connectivity', 'deviceProfile'][this.currentStep];
  }

  get canGoNext(): boolean {
    if (this.currentStep === 0) return this.locationStepValid;
    if (this.currentStep === 3) return this.selectedParameters.length > 0;
    const controlName = this.currentStepControlName;
    return !controlName || this.form.get(controlName)!.valid;
  }

  next(): void {
    if (!this.canGoNext) return;
    if (this.currentStep < this.stepLabels.length - 1) this.currentStep++;
  }

  back(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    if (this.form.invalid || this.selectedParameters.length === 0 || !this.locationStepValid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const locationPath = this.selectedPath.map(n => n.name);
    const row: DeviceRow = {
      id: value.deviceId,
      name: `${value.deviceModel} - ${locationPath[locationPath.length - 1]}`,
      serialNumber: '', imeiDevEuiMac: '',
      deviceModel: value.deviceModel,
      deviceProfile: value.deviceProfile,
      manufacturer: MANUFACTURER_BY_MODEL[value.deviceModel] ?? '',
      project: locationPath[0] ?? '',
      locationPath,
      locationLabel: locationPath.join(' > '),
      customerTenant: 'Environment 360 HQ',
      site: '', buildingArea: '', zone: '', asset: '',
      installationLocation: locationPath[locationPath.length - 1] ?? '',
      latitudeLongitude: '',
      installationDate: '',
      commissioningDate: '', warrantyExpiry: '', batteryReplacementDate: '',
      firmwareVersion: '',
      connectivity: value.connectivity,
      gateway: '',
      status: 'Active',
      lastCommunication: 'Just now',
      healthStatus: 'Healthy',
      health: { connectivity: 'Good', battery: 100, signal: 'Good', lastCommunication: 'Just now', dataQuality: 'Good' },
      installer: '', maintenanceOwner: '', photo: '', documents: '',
      parameters: this.selectedParameters.map(parameter => ({
        parameter,
        unit: PARAMETER_UNITS[parameter] ?? '',
        thresholdProfile: THRESHOLD_PROFILE_BY_PARAMETER[parameter] ?? '-',
        dataCollectionProfile: '-',
        dataQualityProfile: DATA_QUALITY_PROFILE_BY_PARAMETER[parameter] ?? '-',
        enabled: true,
        status: 'Active',
      })),
    };

    this.created.emit(row);
  }
}
