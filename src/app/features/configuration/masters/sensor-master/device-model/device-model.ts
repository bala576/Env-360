import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, SENSOR_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface DeviceModelRow {
  id: string;
  code: string;
  modelName: string;
  manufacturer: string;
  deviceType: string;
  sensorType: string;
  modelNumber: string;
  description: string;
  supportedParameters: string;
  communicationProfile: string;
  powerType: string;
  batteryType: string;
  expectedBatteryLife: string;
  operatingTemperature: string;
  operatingHumidity: string;
  ipRating: string;
  firmwareFamily: string;
  defaultReportingInterval: string;
  datasheet: string;
  image: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-device-model',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './device-model.html',
  styleUrl: './device-model.css',
})
export class DeviceModel {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Sensor Master', children: SENSOR_MASTER_DROPDOWN },
    { label: 'Device Model' },
  ];

  manufacturers = ['SenTech Industries', 'EnviroSense Corp', 'GasGuard Systems', 'AquaMetrics Ltd', 'ClimaTech Devices'];
  powerTypes = ['Battery', 'Solar', 'Wired', 'Hybrid'];

  columns: TableColumn[] = [
    { key: 'code', label: 'Device Model Code' },
    { key: 'modelName', label: 'Model Name' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'deviceType', label: 'Device Type' },
    { key: 'sensorType', label: 'Sensor Type' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: DeviceModelRow[] = [
    {
      id: 'DVM-001',
      code: 'CT-100',
      modelName: 'ClimaTech CT-100 Temp/Humidity Sensor',
      manufacturer: 'ClimaTech Devices',
      deviceType: 'Wireless Sensor',
      sensorType: 'Temperature & Humidity',
      modelNumber: 'CT100-2024',
      description: 'Wireless temperature and humidity sensor for indoor climate monitoring.',
      supportedParameters: 'Temperature, Humidity',
      communicationProfile: 'LoRaWAN',
      powerType: 'Battery',
      batteryType: 'AA Lithium',
      expectedBatteryLife: '2 years',
      operatingTemperature: '-20°C to 60°C',
      operatingHumidity: '0% to 95% RH',
      ipRating: 'IP54',
      firmwareFamily: 'CT-FW-1.x',
      defaultReportingInterval: '5 min',
      datasheet: 'https://example.com/datasheets/ct-100.pdf',
      image: 'https://example.com/images/ct-100.png',
      status: 'Active',
      displayOrder: 1,
    },
    {
      id: 'DVM-002',
      code: 'GG-H2S-200',
      modelName: 'GasGuard GG-H2S-200',
      manufacturer: 'GasGuard Systems',
      deviceType: 'Gas Detector',
      sensorType: 'H2S Gas',
      modelNumber: 'GGH2S200-2023',
      description: 'Hydrogen sulfide gas detector for confined space and manhole monitoring.',
      supportedParameters: 'H2S',
      communicationProfile: 'NB-IoT',
      powerType: 'Battery',
      batteryType: 'Li-SOCl2',
      expectedBatteryLife: '3 years',
      operatingTemperature: '-40°C to 70°C',
      operatingHumidity: '0% to 99% RH',
      ipRating: 'IP67',
      firmwareFamily: 'GG-FW-2.x',
      defaultReportingInterval: '1 min',
      datasheet: 'https://example.com/datasheets/gg-h2s-200.pdf',
      image: 'https://example.com/images/gg-h2s-200.png',
      status: 'Active',
      displayOrder: 2,
    },
    {
      id: 'DVM-003',
      code: 'AM-PH-50',
      modelName: 'AquaMetrics AM-PH-50',
      manufacturer: 'AquaMetrics Ltd',
      deviceType: 'Water Sensor Buoy',
      sensorType: 'pH',
      modelNumber: 'AMPH50-2022',
      description: 'Floating buoy sensor for continuous water pH monitoring.',
      supportedParameters: 'pH, Temperature',
      communicationProfile: 'Cellular 4G',
      powerType: 'Solar',
      batteryType: 'Li-ion (Solar Backup)',
      expectedBatteryLife: '5 years',
      operatingTemperature: '-10°C to 50°C',
      operatingHumidity: 'N/A (Submersible)',
      ipRating: 'IP68',
      firmwareFamily: 'AM-FW-3.x',
      defaultReportingInterval: '15 min',
      datasheet: 'https://example.com/datasheets/am-ph-50.pdf',
      image: 'https://example.com/images/am-ph-50.png',
      status: 'Active',
      displayOrder: 3,
    },
    {
      id: 'DVM-004',
      code: 'ST-CO2-300',
      modelName: 'SenTech ST-CO2-300',
      manufacturer: 'SenTech Industries',
      deviceType: 'Wireless Sensor',
      sensorType: 'CO2',
      modelNumber: 'STCO2300-2024',
      description: 'Indoor CO2 sensor for air quality and ventilation monitoring.',
      supportedParameters: 'CO2, Temperature, Humidity',
      communicationProfile: 'Wi-Fi',
      powerType: 'Wired',
      batteryType: 'N/A',
      expectedBatteryLife: 'N/A',
      operatingTemperature: '0°C to 50°C',
      operatingHumidity: '0% to 90% RH',
      ipRating: 'IP20',
      firmwareFamily: 'ST-FW-1.x',
      defaultReportingInterval: '5 min',
      datasheet: 'https://example.com/datasheets/st-co2-300.pdf',
      image: 'https://example.com/images/st-co2-300.png',
      status: 'Active',
      displayOrder: 4,
    },
    {
      id: 'DVM-005',
      code: 'ES-MULTI-400',
      modelName: 'EnviroSense ES-Multi-400',
      manufacturer: 'EnviroSense Corp',
      deviceType: 'IoT Gateway',
      sensorType: 'Multi-parameter',
      modelNumber: 'ESM400-2021',
      description: 'Multi-parameter environmental gateway supporting several sensor inputs.',
      supportedParameters: 'Temperature, Humidity, CO2, Noise',
      communicationProfile: 'Ethernet',
      powerType: 'Hybrid',
      batteryType: 'Li-ion (Backup)',
      expectedBatteryLife: '1 year (backup only)',
      operatingTemperature: '-10°C to 55°C',
      operatingHumidity: '0% to 95% RH',
      ipRating: 'IP65',
      firmwareFamily: 'ES-FW-4.x',
      defaultReportingInterval: '10 min',
      datasheet: 'https://example.com/datasheets/es-multi-400.pdf',
      image: 'https://example.com/images/es-multi-400.png',
      status: 'Inactive',
      displayOrder: 5,
    },
  ];

  popupOpen = false;
  editingRow: DeviceModelRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      modelName: ['', Validators.required],
      manufacturer: ['', Validators.required],
      deviceType: [''],
      sensorType: [''],
      modelNumber: [''],
      description: [''],
      supportedParameters: [''],
      communicationProfile: [''],
      powerType: ['Battery'],
      batteryType: [''],
      expectedBatteryLife: [''],
      operatingTemperature: [''],
      operatingHumidity: [''],
      ipRating: [''],
      firmwareFamily: [''],
      defaultReportingInterval: [''],
      datasheet: [''],
      image: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      powerType: 'Battery',
      status: 'Active',
      displayOrder: this.rows.length + 1,
    });
    this.popupOpen = true;
  }

  openEdit(row: DeviceModelRow): void {
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
      this.rows.push({ id: `DVM-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: DeviceModelRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
