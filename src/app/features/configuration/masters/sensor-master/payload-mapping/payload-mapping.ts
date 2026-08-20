import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, SENSOR_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface PayloadMappingRow {
  id: string;
  mappingCode: string;
  mappingName: string;
  deviceModel: string;
  protocol: string;
  payloadFormat: string;
  payloadStructure: string;
  dataEncoding: string;
  timestampField: string;
  deviceIdField: string;
  parameterKey: string;
  jsonPathOrRegisterAddress: string;
  parameter: string;
  unit: string;
  dataType: string;
  multiplier: number;
  offset: number;
  conversionFormula: string;
  byteOrder: string;
  bitPosition: number;
  validationRule: string;
  defaultValue: string;
  invalidValueHandling: string;
  examplePayload: string;
  description: string;
  version: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-payload-mapping',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './payload-mapping.html',
  styleUrl: './payload-mapping.css',
})
export class PayloadMapping {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Sensor Master', children: SENSOR_MASTER_DROPDOWN },
    { label: 'Payload Mapping' },
  ];

  protocols = ['MQTT', 'HTTP/REST', 'CoAP', 'Modbus TCP'];
  payloadFormats = ['JSON', 'Binary', 'CSV', 'XML'];
  dataEncodings = ['UTF-8', 'Hex', 'Base64'];
  dataTypes = ['Numeric', 'Text', 'Boolean'];
  byteOrders = ['Big Endian', 'Little Endian'];
  invalidValueHandlingOptions = ['Discard', 'Use Default', 'Flag as Error'];

  columns: TableColumn[] = [
    { key: 'mappingCode', label: 'Mapping Code' },
    { key: 'mappingName', label: 'Mapping Name' },
    { key: 'deviceModel', label: 'Device Model' },
    { key: 'protocol', label: 'Protocol' },
    { key: 'parameter', label: 'Parameter' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  rows: PayloadMappingRow[] = [
    {
      id: 'PMAP-001',
      mappingCode: 'MAP-TEMP',
      mappingName: 'Temperature Mapping',
      deviceModel: 'ClimaTech CT-100',
      protocol: 'MQTT',
      payloadFormat: 'JSON',
      payloadStructure: '{ "data": { "temp": 0.0 } }',
      dataEncoding: 'UTF-8',
      timestampField: 'data.ts',
      deviceIdField: 'data.deviceId',
      parameterKey: 'temp',
      jsonPathOrRegisterAddress: '$.data.temp',
      parameter: 'Temperature',
      unit: 'Celsius',
      dataType: 'Numeric',
      multiplier: 1,
      offset: 0,
      conversionFormula: 'x',
      byteOrder: 'Big Endian',
      bitPosition: 0,
      validationRule: '-50 <= x <= 150',
      defaultValue: '0',
      invalidValueHandling: 'Flag as Error',
      examplePayload: '{"data":{"deviceId":"CT100-01","ts":1699999999,"temp":24.6}}',
      description: 'Extracts temperature reading from ClimaTech JSON payload.',
      version: 'v1.0',
      status: 'Active',
    },
    {
      id: 'PMAP-002',
      mappingCode: 'MAP-HUM',
      mappingName: 'Humidity Mapping',
      deviceModel: 'ClimaTech CT-100',
      protocol: 'MQTT',
      payloadFormat: 'JSON',
      payloadStructure: '{ "data": { "hum": 0.0 } }',
      dataEncoding: 'UTF-8',
      timestampField: 'data.ts',
      deviceIdField: 'data.deviceId',
      parameterKey: 'hum',
      jsonPathOrRegisterAddress: '$.data.hum',
      parameter: 'Humidity',
      unit: '%RH',
      dataType: 'Numeric',
      multiplier: 1,
      offset: 0,
      conversionFormula: 'x',
      byteOrder: 'Big Endian',
      bitPosition: 0,
      validationRule: '0 <= x <= 100',
      defaultValue: '0',
      invalidValueHandling: 'Flag as Error',
      examplePayload: '{"data":{"deviceId":"CT100-01","ts":1699999999,"hum":58.2}}',
      description: 'Extracts relative humidity reading from ClimaTech JSON payload.',
      version: 'v1.0',
      status: 'Active',
    },
    {
      id: 'PMAP-003',
      mappingCode: 'MAP-CO2',
      mappingName: 'CO2 Mapping',
      deviceModel: 'AirSense AS-200',
      protocol: 'HTTP/REST',
      payloadFormat: 'JSON',
      payloadStructure: '{ "readings": { "co2_ppm": 0 } }',
      dataEncoding: 'UTF-8',
      timestampField: 'readings.timestamp',
      deviceIdField: 'readings.id',
      parameterKey: 'co2_ppm',
      jsonPathOrRegisterAddress: '$.readings.co2_ppm',
      parameter: 'Carbon Dioxide',
      unit: 'ppm',
      dataType: 'Numeric',
      multiplier: 1,
      offset: 0,
      conversionFormula: 'x',
      byteOrder: 'Big Endian',
      bitPosition: 0,
      validationRule: '0 <= x <= 5000',
      defaultValue: '400',
      invalidValueHandling: 'Use Default',
      examplePayload: '{"readings":{"id":"AS200-07","timestamp":1699999999,"co2_ppm":612}}',
      description: 'Extracts CO2 concentration from AirSense REST payload.',
      version: 'v1.2',
      status: 'Active',
    },
    {
      id: 'PMAP-004',
      mappingCode: 'MAP-H2S',
      mappingName: 'H2S Gas Mapping',
      deviceModel: 'GasGuard GG-50',
      protocol: 'Modbus TCP',
      payloadFormat: 'Binary',
      payloadStructure: 'Holding register block, 16-bit unsigned',
      dataEncoding: 'Hex',
      timestampField: 'N/A (polled)',
      deviceIdField: 'Unit ID',
      parameterKey: 'h2s_reg',
      jsonPathOrRegisterAddress: '40001',
      parameter: 'H2S Gas',
      unit: 'ppm',
      dataType: 'Numeric',
      multiplier: 0.1,
      offset: 0,
      conversionFormula: 'x * 0.1',
      byteOrder: 'Big Endian',
      bitPosition: 0,
      validationRule: '0 <= x <= 100',
      defaultValue: '0',
      invalidValueHandling: 'Discard',
      examplePayload: '01 03 02 00 1E B8 44',
      description: 'Reads H2S gas concentration from Modbus holding register 40001.',
      version: 'v2.0',
      status: 'Active',
    },
    {
      id: 'PMAP-005',
      mappingCode: 'MAP-BATT',
      mappingName: 'Battery Level Mapping',
      deviceModel: 'ClimaTech CT-100',
      protocol: 'CoAP',
      payloadFormat: 'CSV',
      payloadStructure: 'deviceId,timestamp,battery',
      dataEncoding: 'UTF-8',
      timestampField: 'column 2',
      deviceIdField: 'column 1',
      parameterKey: 'battery',
      jsonPathOrRegisterAddress: 'column 3',
      parameter: 'Battery Level',
      unit: '%',
      dataType: 'Numeric',
      multiplier: 1,
      offset: 0,
      conversionFormula: 'x',
      byteOrder: 'Little Endian',
      bitPosition: 0,
      validationRule: '0 <= x <= 100',
      defaultValue: '100',
      invalidValueHandling: 'Use Default',
      examplePayload: 'CT100-01,1699999999,87',
      description: 'Extracts battery charge percentage from CSV payload.',
      version: 'v1.0',
      status: 'Inactive',
    },
  ];

  popupOpen = false;
  editingRow: PayloadMappingRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      mappingCode: ['', Validators.required],
      mappingName: ['', Validators.required],
      deviceModel: ['', Validators.required],
      protocol: ['', Validators.required],
      payloadFormat: ['', Validators.required],
      payloadStructure: [''],
      dataEncoding: [''],
      timestampField: [''],
      deviceIdField: [''],
      parameterKey: [''],
      jsonPathOrRegisterAddress: [''],
      parameter: ['', Validators.required],
      unit: [''],
      dataType: ['Numeric'],
      multiplier: [1],
      offset: [0],
      conversionFormula: ['x'],
      byteOrder: ['Big Endian'],
      bitPosition: [0],
      validationRule: [''],
      defaultValue: [''],
      invalidValueHandling: ['Discard'],
      examplePayload: [''],
      description: [''],
      version: ['v1.0'],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      dataType: 'Numeric',
      multiplier: 1,
      offset: 0,
      conversionFormula: 'x',
      byteOrder: 'Big Endian',
      bitPosition: 0,
      invalidValueHandling: 'Discard',
      version: 'v1.0',
      status: 'Active',
    });
    this.popupOpen = true;
  }

  openEdit(row: PayloadMappingRow): void {
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
      this.rows.push({ id: `PMAP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: PayloadMappingRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
