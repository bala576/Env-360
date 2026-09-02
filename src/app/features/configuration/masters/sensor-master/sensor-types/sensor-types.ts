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

const SENSOR_TYPES_PAGE = '/administration/configuration/masters/sensor-master/sensor-types';
const CATEGORIES_PAGE = '/administration/configuration/masters/environment-master/categories';

interface SensorTypeRow {
  id: string;
  code: string;
  name: string;
  sensorCategory: string;
  environmentCategory: string;
  measurementPrinciple: string;
  supportedParameters: string;
  measurementRange: string;
  accuracy: string;
  resolution: string;
  responseTime: string;
  samplingCapability: string;
  calibrationRequired: boolean;
  calibrationInterval: string;
  indoorOutdoor: string;
  ipRating: string;
  operatingTemperature: string;
  operatingHumidity: string;
  powerType: string;
  description: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-sensor-types',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './sensor-types.html',
  styleUrl: './sensor-types.css',
})
export class SensorTypes {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Sensor Master', children: SENSOR_MASTER_DROPDOWN },
    { label: 'Sensor Types' },
  ];

  indoorOutdoorOptions = ['Indoor', 'Outdoor', 'Both'];

  get environmentCategories(): string[] {
    return this.categoriesStore.rows.map(r => r.name);
  }

  columns: TableColumn[] = [
    { key: 'code', label: 'Sensor Type Code' },
    { key: 'name', label: 'Sensor Type Name' },
    { key: 'sensorCategory', label: 'Sensor Category' },
    { key: 'environmentCategory', label: 'Environment Category' },
    { key: 'indoorOutdoor', label: 'Indoor / Outdoor' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: SensorTypeRow[] = [
    {
      id: 'SNTYPE-001',
      code: 'SNT-TH',
      name: 'Temperature & Humidity Sensor',
      sensorCategory: 'Temperature Sensor',
      environmentCategory: 'Air Quality',
      measurementPrinciple: 'Capacitive',
      supportedParameters: 'Temperature, Humidity',
      measurementRange: '-40 to 85 °C / 0-100% RH',
      accuracy: '±0.3°C, ±2% RH',
      resolution: '0.1°C, 0.1% RH',
      responseTime: '15s',
      samplingCapability: 'Continuous',
      calibrationRequired: true,
      calibrationInterval: '12 months',
      indoorOutdoor: 'Both',
      ipRating: 'IP65',
      operatingTemperature: '-40 to 85 °C',
      operatingHumidity: '0-100% RH',
      powerType: 'Battery',
      description: 'Combined temperature and humidity sensing unit for ambient monitoring.',
      status: 'Active',
      displayOrder: 1,
    },
    {
      id: 'SNTYPE-002',
      code: 'SNT-CO2',
      name: 'CO2 Sensor',
      sensorCategory: 'Gas Sensor',
      environmentCategory: 'Air Quality',
      measurementPrinciple: 'NDIR',
      supportedParameters: 'CO2',
      measurementRange: '0-5000 ppm',
      accuracy: '±50 ppm',
      resolution: '1 ppm',
      responseTime: '60s',
      samplingCapability: 'Interval-based',
      calibrationRequired: true,
      calibrationInterval: '6 months',
      indoorOutdoor: 'Indoor',
      ipRating: 'IP54',
      operatingTemperature: '0 to 50 °C',
      operatingHumidity: '0-95% RH',
      powerType: 'Wired',
      description: 'Non-dispersive infrared CO2 concentration sensor.',
      status: 'Active',
      displayOrder: 2,
    },
    {
      id: 'SNTYPE-003',
      code: 'SNT-H2S',
      name: 'H2S Gas Sensor',
      sensorCategory: 'Gas Sensor',
      environmentCategory: 'Air Quality',
      measurementPrinciple: 'Electrochemical',
      supportedParameters: 'H2S',
      measurementRange: '0-100 ppm',
      accuracy: '±2 ppm',
      resolution: '0.1 ppm',
      responseTime: '20s',
      samplingCapability: 'Continuous',
      calibrationRequired: true,
      calibrationInterval: '3 months',
      indoorOutdoor: 'Outdoor',
      ipRating: 'IP67',
      operatingTemperature: '-20 to 60 °C',
      operatingHumidity: '0-99% RH',
      powerType: 'Battery',
      description: 'Electrochemical hydrogen sulfide gas detection sensor for confined spaces.',
      status: 'Active',
      displayOrder: 3,
    },
    {
      id: 'SNTYPE-004',
      code: 'SNT-PH',
      name: 'pH Sensor',
      sensorCategory: 'Water Quality Sensor',
      environmentCategory: 'Water Quality',
      measurementPrinciple: 'Ion-selective electrode',
      supportedParameters: 'pH',
      measurementRange: '0-14 pH',
      accuracy: '±0.1 pH',
      resolution: '0.01 pH',
      responseTime: '10s',
      samplingCapability: 'Continuous',
      calibrationRequired: true,
      calibrationInterval: '1 month',
      indoorOutdoor: 'Outdoor',
      ipRating: 'IP68',
      operatingTemperature: '0 to 50 °C',
      operatingHumidity: 'N/A',
      powerType: 'Solar',
      description: 'Ion-selective electrode sensor for water pH measurement.',
      status: 'Active',
      displayOrder: 4,
    },
    {
      id: 'SNTYPE-005',
      code: 'SNT-UWL',
      name: 'Ultrasonic Water Level Sensor',
      sensorCategory: 'Level Sensor',
      environmentCategory: 'Water Quality',
      measurementPrinciple: 'Ultrasonic',
      supportedParameters: 'Water Level',
      measurementRange: '0-10 m',
      accuracy: '±1 cm',
      resolution: '1 mm',
      responseTime: '5s',
      samplingCapability: 'Interval-based',
      calibrationRequired: false,
      calibrationInterval: 'N/A',
      indoorOutdoor: 'Outdoor',
      ipRating: 'IP68',
      operatingTemperature: '-20 to 70 °C',
      operatingHumidity: 'N/A',
      powerType: 'Solar',
      description: 'Non-contact ultrasonic sensor for measuring water level in tanks and channels.',
      status: 'Inactive',
      displayOrder: 5,
    },
  ];

  popupOpen = false;
  editingRow: SensorTypeRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder, private categoriesStore: CategoriesStore, private router: Router) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      sensorCategory: [''],
      environmentCategory: ['', Validators.required],
      measurementPrinciple: [''],
      supportedParameters: [''],
      measurementRange: [''],
      accuracy: [''],
      resolution: [''],
      responseTime: [''],
      samplingCapability: [''],
      calibrationRequired: [false],
      calibrationInterval: [''],
      indoorOutdoor: ['Indoor', Validators.required],
      ipRating: [''],
      operatingTemperature: [''],
      operatingHumidity: [''],
      powerType: [''],
      description: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      environmentCategory: '',
      calibrationRequired: false,
      indoorOutdoor: 'Indoor',
      status: 'Active',
      displayOrder: this.rows.length + 1,
    });
    this.popupOpen = true;
  }

  openEdit(row: SensorTypeRow): void {
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
      this.rows.push({ id: `SNTYPE-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: SensorTypeRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  isEditCategoryDisabled(): boolean {
    return !this.editingRow;
  }

  addCategory(): void {
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'add', returnUrl: SENSOR_TYPES_PAGE } });
  }

  editCategory(): void {
    if (this.isEditCategoryDisabled()) return;
    const category = this.form.value.environmentCategory;
    if (!category) return;
    this.router.navigate([CATEGORIES_PAGE], { queryParams: { action: 'edit', value: category, returnUrl: SENSOR_TYPES_PAGE } });
  }
}
