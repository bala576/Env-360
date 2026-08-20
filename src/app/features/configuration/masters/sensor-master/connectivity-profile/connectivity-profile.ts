import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, SENSOR_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface ConnectivityProfileRow {
  id: string;
  profileCode: string;
  profileName: string;
  communicationTechnology: string;
  protocol: string;
  networkType: string;
  gatewayRequired: boolean;
  serverAddress: string;
  port: number | null;
  topicEndpoint: string;
  authenticationType: string;
  username: string;
  credentialReference: string;
  encryption: string;
  tlsEnabled: boolean;
  certificateRequired: boolean;
  qos: string;
  keepAlive: number | null;
  pollingInterval: string;
  retryCount: number | null;
  timeout: number | null;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-connectivity-profile',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './connectivity-profile.html',
  styleUrl: './connectivity-profile.css',
})
export class ConnectivityProfile {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Sensor Master', children: SENSOR_MASTER_DROPDOWN },
    { label: 'Connectivity Profile' },
  ];

  communicationTechnologies = ['LoRaWAN', 'NB-IoT', 'WiFi', 'Cellular (4G/5G)', 'Ethernet'];
  protocols = ['MQTT', 'HTTP/REST', 'CoAP', 'Modbus TCP'];
  networkTypes = ['Public', 'Private', 'Hybrid'];
  authenticationTypes = ['None', 'Username/Password', 'Certificate', 'API Key'];
  qosLevels = ['0', '1', '2'];

  columns: TableColumn[] = [
    { key: 'profileCode', label: 'Profile Code' },
    { key: 'profileName', label: 'Profile Name' },
    { key: 'communicationTechnology', label: 'Communication Technology' },
    { key: 'protocol', label: 'Protocol' },
    { key: 'networkType', label: 'Network Type' },
    { key: 'status', label: 'Status', type: 'toggle' },
  ];

  rows: ConnectivityProfileRow[] = [
    {
      id: 'CNP-001',
      profileCode: 'CNP-LORA-OUT',
      profileName: 'LoRaWAN Outdoor Sensor Profile',
      communicationTechnology: 'LoRaWAN',
      protocol: 'MQTT',
      networkType: 'Private',
      gatewayRequired: true,
      serverAddress: 'mqtt.env360.io',
      port: 1883,
      topicEndpoint: 'env360/outdoor/+/data',
      authenticationType: 'Username/Password',
      username: 'lora_gw01',
      credentialReference: 'VAULT-CNP-001',
      encryption: 'AES-128',
      tlsEnabled: false,
      certificateRequired: false,
      qos: '1',
      keepAlive: 60,
      pollingInterval: '5 min',
      retryCount: 3,
      timeout: 30,
      description: 'Connectivity profile for LoRaWAN based outdoor sensors reporting via a private gateway.',
      status: 'Active',
    },
    {
      id: 'CNP-002',
      profileCode: 'CNP-WIFI-IND',
      profileName: 'MQTT over WiFi Indoor Profile',
      communicationTechnology: 'WiFi',
      protocol: 'MQTT',
      networkType: 'Private',
      gatewayRequired: false,
      serverAddress: 'mqtt.internal.env360.io',
      port: 8883,
      topicEndpoint: 'env360/indoor/+/telemetry',
      authenticationType: 'Certificate',
      username: '',
      credentialReference: 'VAULT-CNP-002',
      encryption: 'TLS 1.2',
      tlsEnabled: true,
      certificateRequired: true,
      qos: '1',
      keepAlive: 30,
      pollingInterval: '1 min',
      retryCount: 5,
      timeout: 20,
      description: 'Secure MQTT over WiFi profile for indoor room and floor sensors.',
      status: 'Active',
    },
    {
      id: 'CNP-003',
      profileCode: 'CNP-NBIOT-MH',
      profileName: 'NB-IoT Manhole Profile',
      communicationTechnology: 'NB-IoT',
      protocol: 'CoAP',
      networkType: 'Public',
      gatewayRequired: false,
      serverAddress: 'coap.env360.io',
      port: 5683,
      topicEndpoint: 'manhole/{deviceId}/gas',
      authenticationType: 'API Key',
      username: '',
      credentialReference: 'VAULT-CNP-003',
      encryption: 'DTLS',
      tlsEnabled: true,
      certificateRequired: false,
      qos: '0',
      keepAlive: 120,
      pollingInterval: '10 min',
      retryCount: 4,
      timeout: 45,
      description: 'Low-power NB-IoT profile for remote manhole gas sensors on the public carrier network.',
      status: 'Active',
    },
    {
      id: 'CNP-004',
      profileCode: 'CNP-CELL-WX',
      profileName: 'Cellular Weather Station Profile',
      communicationTechnology: 'Cellular (4G/5G)',
      protocol: 'HTTP/REST',
      networkType: 'Public',
      gatewayRequired: false,
      serverAddress: 'api.env360.io',
      port: 443,
      topicEndpoint: '/v1/weather/ingest',
      authenticationType: 'API Key',
      username: '',
      credentialReference: 'VAULT-CNP-004',
      encryption: 'TLS 1.3',
      tlsEnabled: true,
      certificateRequired: false,
      qos: '1',
      keepAlive: 60,
      pollingInterval: '15 min',
      retryCount: 3,
      timeout: 30,
      description: 'Cellular REST profile for remote outdoor weather stations without WiFi coverage.',
      status: 'Active',
    },
    {
      id: 'CNP-005',
      profileCode: 'CNP-MODBUS-LEG',
      profileName: 'Modbus TCP Legacy Gateway Profile',
      communicationTechnology: 'Ethernet',
      protocol: 'Modbus TCP',
      networkType: 'Private',
      gatewayRequired: true,
      serverAddress: '192.168.10.20',
      port: 502,
      topicEndpoint: 'N/A',
      authenticationType: 'None',
      username: '',
      credentialReference: '',
      encryption: 'None',
      tlsEnabled: false,
      certificateRequired: false,
      qos: '0',
      keepAlive: 0,
      pollingInterval: '30s',
      retryCount: 2,
      timeout: 10,
      description: 'Legacy Modbus TCP profile for integrating older building management gateways.',
      status: 'Inactive',
    },
  ];

  popupOpen = false;
  editingRow: ConnectivityProfileRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      profileCode: ['', Validators.required],
      profileName: ['', Validators.required],
      communicationTechnology: ['', Validators.required],
      protocol: ['', Validators.required],
      networkType: ['', Validators.required],
      gatewayRequired: [false],
      serverAddress: [''],
      port: [null],
      topicEndpoint: [''],
      authenticationType: ['None'],
      username: [''],
      credentialReference: [''],
      encryption: [''],
      tlsEnabled: [false],
      certificateRequired: [false],
      qos: ['0'],
      keepAlive: [60],
      pollingInterval: [''],
      retryCount: [3],
      timeout: [30],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({
      gatewayRequired: false,
      authenticationType: 'None',
      tlsEnabled: false,
      certificateRequired: false,
      qos: '0',
      keepAlive: 60,
      retryCount: 3,
      timeout: 30,
      status: 'Active',
    });
    this.popupOpen = true;
  }

  openEdit(row: ConnectivityProfileRow): void {
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
      this.rows.push({ id: `CNP-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: ConnectivityProfileRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
