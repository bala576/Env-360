import { Injectable } from '@angular/core';

export interface DeviceHealth {
  connectivity: string;
  battery: number;
  signal: string;
  lastCommunication: string;
  dataQuality: string;
}

export interface DeviceParameterAssignment {
  parameter: string;
  unit: string;
  thresholdProfile: string;
  dataCollectionProfile: string;
  dataQualityProfile: string;
  enabled: boolean;
  status: 'Active' | 'Inactive';
}

export interface DeviceRow {
  id: string;
  name: string;
  serialNumber: string;
  imeiDevEuiMac: string;
  deviceModel: string;
  deviceProfile: string;
  manufacturer: string;
  project: string;
  locationPath: string[];
  locationLabel: string;
  customerTenant: string;
  site: string;
  buildingArea: string;
  zone: string;
  asset: string;
  installationLocation: string;
  latitudeLongitude: string;
  installationDate: string;
  commissioningDate: string;
  warrantyExpiry: string;
  batteryReplacementDate: string;
  firmwareVersion: string;
  connectivity: string;
  gateway: string;
  status: 'Active' | 'Inactive';
  lastCommunication: string;
  healthStatus: string;
  health: DeviceHealth | null;
  installer: string;
  maintenanceOwner: string;
  photo: string;
  documents: string;
  parameters: DeviceParameterAssignment[];
}

const INITIAL_ROWS: DeviceRow[] = [
  {
    id: 'DEV-001', name: 'IAQ Sensor - Building A Floor 2', serialNumber: 'SN-CT100-0001', imeiDevEuiMac: '00-14-22-01-23-45',
    deviceModel: 'ClimaTech CT-100', deviceProfile: 'Indoor Air Quality Profile', manufacturer: 'ClimaTech Devices',
    project: 'Corporate Campus Monitoring', locationPath: ['Corporate Campus Monitoring'], locationLabel: 'Corporate Campus Monitoring', customerTenant: 'Environment 360 HQ',
    site: 'Bengaluru Campus', buildingArea: 'Building A', zone: 'Floor 2 - East Wing', asset: 'AHU-02',
    installationLocation: 'Ceiling, Room 214', latitudeLongitude: '12.9716, 77.5946', installationDate: '2025-03-10',
    commissioningDate: '2025-03-12', warrantyExpiry: '2027-03-10', batteryReplacementDate: '2026-03-10',
    firmwareVersion: 'v2.1.3', connectivity: 'WiFi', gateway: 'GW-BLR-A1', status: 'Active',
    lastCommunication: '2026-08-17 09:42', healthStatus: 'Healthy',
    health: { connectivity: 'Excellent', battery: 86, signal: 'Excellent', lastCommunication: '12 sec ago', dataQuality: 'Good' },
    installer: 'Rahul Mehta', maintenanceOwner: 'Facilities Team', photo: '', documents: '',
    parameters: [
      { parameter: 'Temperature', unit: '°C', thresholdProfile: 'Temperature Threshold', dataCollectionProfile: 'High Frequency Indoor Sensors', dataQualityProfile: 'Temperature Data Quality', enabled: true, status: 'Active' },
      { parameter: 'Humidity', unit: '%RH', thresholdProfile: 'Humidity Threshold', dataCollectionProfile: 'High Frequency Indoor Sensors', dataQualityProfile: 'Humidity Data Quality', enabled: true, status: 'Active' },
    ],
  },
  {
    id: 'DEV-002', name: 'Manhole Gas Sensor - MH-14', serialNumber: 'SN-GG200-0002', imeiDevEuiMac: '866123456789012',
    deviceModel: 'GasGuard GG-H2S-200', deviceProfile: 'Confined Space Gas Profile', manufacturer: 'GasGuard Systems',
    project: 'Flood & Sewage Monitoring', locationPath: ['Flood & Sewage Monitoring'], locationLabel: 'Flood & Sewage Monitoring', customerTenant: 'Environment 360 HQ',
    site: 'Bengaluru Campus', buildingArea: 'Outdoor - Sector 4', zone: 'Manhole Cluster B', asset: 'MH-14',
    installationLocation: 'Manhole MH-14', latitudeLongitude: '12.9720, 77.5951', installationDate: '2025-05-02',
    commissioningDate: '2025-05-04', warrantyExpiry: '2027-05-02', batteryReplacementDate: '2026-02-02',
    firmwareVersion: 'v1.8.0', connectivity: 'NB-IoT', gateway: 'GW-BLR-N1', status: 'Active',
    lastCommunication: '2026-08-17 09:38', healthStatus: 'Warning',
    health: { connectivity: 'Fair', battery: 54, signal: 'Fair', lastCommunication: '2 min ago', dataQuality: 'Fair' },
    installer: 'Anita Sharma', maintenanceOwner: 'Safety Team', photo: '', documents: '',
    parameters: [
      { parameter: 'H2S', unit: 'ppm', thresholdProfile: 'H2S Gas Threshold', dataCollectionProfile: 'Critical Gas Monitoring', dataQualityProfile: 'Gas Sensor Data Quality', enabled: true, status: 'Active' },
    ],
  },
  {
    id: 'DEV-003', name: 'Water Quality Buoy - Reservoir 1', serialNumber: 'SN-AM50-0003', imeiDevEuiMac: '866223456789013',
    deviceModel: 'AquaMetrics AM-PH-50', deviceProfile: 'Water Quality Profile', manufacturer: 'AquaMetrics Ltd',
    project: 'Water Quality Monitoring', locationPath: ['Water Quality Monitoring'], locationLabel: 'Water Quality Monitoring', customerTenant: 'Environment 360 HQ',
    site: 'Bengaluru Campus', buildingArea: 'Outdoor - Reservoir Zone', zone: 'Reservoir 1', asset: 'RES-01',
    installationLocation: 'Reservoir 1, North Edge', latitudeLongitude: '12.9701, 77.5930', installationDate: '2025-01-20',
    commissioningDate: '2025-01-22', warrantyExpiry: '2027-01-20', batteryReplacementDate: '2026-01-20',
    firmwareVersion: 'v1.4.2', connectivity: 'LoRaWAN', gateway: 'GW-BLR-L1', status: 'Active',
    lastCommunication: '2026-08-17 08:55', healthStatus: 'Healthy',
    health: { connectivity: 'Good', battery: 91, signal: 'Good', lastCommunication: '47 sec ago', dataQuality: 'Good' },
    installer: 'Rajesh Kumar', maintenanceOwner: 'Environment Team', photo: '', documents: '',
    parameters: [
      { parameter: 'pH', unit: 'pH', thresholdProfile: 'Water pH Threshold', dataCollectionProfile: 'Low Power Outdoor Sensors', dataQualityProfile: 'Water Quality Data Quality', enabled: true, status: 'Active' },
      { parameter: 'Temperature', unit: '°C', thresholdProfile: 'Temperature Threshold', dataCollectionProfile: 'Low Power Outdoor Sensors', dataQualityProfile: 'Temperature Data Quality', enabled: true, status: 'Active' },
    ],
  },
  {
    id: 'DEV-004', name: 'Rooftop Weather Station', serialNumber: 'SN-ST300-0004', imeiDevEuiMac: '866323456789014',
    deviceModel: 'SenTech ST-CO2-300', deviceProfile: 'Weather Station Profile', manufacturer: 'SenTech Industries',
    project: 'Corporate Campus Monitoring', locationPath: ['Corporate Campus Monitoring'], locationLabel: 'Corporate Campus Monitoring', customerTenant: 'Environment 360 HQ',
    site: 'Bengaluru Campus', buildingArea: 'Building A', zone: 'Rooftop', asset: 'ROOF-01',
    installationLocation: 'Rooftop, Building A', latitudeLongitude: '12.9718, 77.5948', installationDate: '2024-11-05',
    commissioningDate: '2024-11-07', warrantyExpiry: '2026-11-05', batteryReplacementDate: '2025-11-05',
    firmwareVersion: 'v3.0.1', connectivity: 'Cellular (4G/5G)', gateway: '-', status: 'Inactive',
    lastCommunication: '2026-07-30 14:12', healthStatus: 'Offline',
    health: null,
    installer: 'Elena Rossi', maintenanceOwner: 'Facilities Team', photo: '', documents: '',
    parameters: [
      { parameter: 'Carbon Dioxide', unit: 'ppm', thresholdProfile: 'CO2 Threshold', dataCollectionProfile: 'Weather Station Batch Reporting', dataQualityProfile: 'CO2 Data Quality', enabled: true, status: 'Inactive' },
      { parameter: 'Temperature', unit: '°C', thresholdProfile: 'Temperature Threshold', dataCollectionProfile: 'Weather Station Batch Reporting', dataQualityProfile: 'Temperature Data Quality', enabled: true, status: 'Inactive' },
      { parameter: 'Humidity', unit: '%RH', thresholdProfile: 'Humidity Threshold', dataCollectionProfile: 'Weather Station Batch Reporting', dataQualityProfile: 'Humidity Data Quality', enabled: true, status: 'Inactive' },
    ],
  },
  {
    id: 'DEV-005', name: 'Cold Storage Sensor - Warehouse 2', serialNumber: 'SN-ES400-0005', imeiDevEuiMac: '866423456789015',
    deviceModel: 'EnviroSense ES-Multi-400', deviceProfile: 'Cold Chain Storage Profile', manufacturer: 'EnviroSense Corp',
    project: 'Cold Chain Monitoring', locationPath: ['Cold Chain Monitoring'], locationLabel: 'Cold Chain Monitoring', customerTenant: 'Environment 360 HQ',
    site: 'Pune Warehouse', buildingArea: 'Warehouse 2', zone: 'Cold Room B', asset: 'CR-B-02',
    installationLocation: 'Cold Room B, Rack 5', latitudeLongitude: '18.5204, 73.8567', installationDate: '2025-07-18',
    commissioningDate: '2025-07-19', warrantyExpiry: '2027-07-18', batteryReplacementDate: '2026-07-18',
    firmwareVersion: 'v2.5.0', connectivity: 'WiFi', gateway: 'GW-PUN-A1', status: 'Active',
    lastCommunication: '2026-08-17 09:50', healthStatus: 'Healthy',
    health: { connectivity: 'Excellent', battery: 78, signal: 'Excellent', lastCommunication: '8 sec ago', dataQuality: 'Good' },
    installer: 'Omar Al-Farsi', maintenanceOwner: 'Cold Chain Team', photo: '', documents: '',
    parameters: [
      { parameter: 'Temperature', unit: '°C', thresholdProfile: 'Temperature Threshold', dataCollectionProfile: 'Cold Chain Monitoring', dataQualityProfile: 'Temperature Data Quality', enabled: true, status: 'Active' },
      { parameter: 'Humidity', unit: '%RH', thresholdProfile: 'Humidity Threshold', dataCollectionProfile: 'Cold Chain Monitoring', dataQualityProfile: 'Humidity Data Quality', enabled: true, status: 'Active' },
      { parameter: 'Carbon Dioxide', unit: 'ppm', thresholdProfile: 'CO2 Threshold', dataCollectionProfile: 'Cold Chain Monitoring', dataQualityProfile: 'CO2 Data Quality', enabled: false, status: 'Inactive' },
      { parameter: 'Noise', unit: 'dB', thresholdProfile: '-', dataCollectionProfile: 'Cold Chain Monitoring', dataQualityProfile: '-', enabled: false, status: 'Inactive' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class DeviceStore {

  rows: DeviceRow[] = INITIAL_ROWS;

  getById(id: string): DeviceRow | undefined {
    return this.rows.find(r => r.id === id);
  }

  add(row: DeviceRow): void {
    this.rows.push(row);
  }

  delete(row: DeviceRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  nextId(): string {
    return `DEV-${String(this.rows.length + 1).padStart(3, '0')}`;
  }
}
