// Static mock data for the Devices & Sensors page. Replace with API calls when available.

export type DeviceKind = 'sensor' | 'gateway' | 'controller' | 'other';
export type DeviceStatus = 'online' | 'offline';
// Picks the little product illustration drawn in the table and detail panel
export type DeviceShape = 'box' | 'puck' | 'parking' | 'tall' | 'probe' | 'display' | 'router';
// null battery = mains powered; undefined = unknown (offline)
export type Battery = number | null | undefined;

export interface DeviceKpi {
  label: string;
  value: string;
  change: string;
  direction: 'up' | 'down';
  good: boolean;
  icon: string;
  tone: string;
}

export interface Device {
  name: string;
  serial: string;
  type: string;
  category: string;
  location: string;
  kind: DeviceKind;
  shape: DeviceShape;
  status: DeviceStatus;
  lastSeen: string;
  battery: Battery;
  firmware: string;
  gateway: string;
}

export interface DeviceReading {
  label: string;
  value: string;
  unit: string;
  icon: string;
  tone: string;
  delta: string;
  direction: 'up' | 'down';
}

export interface DeviceTab {
  key: DeviceKind | 'all';
  label: string;
  count: number;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const DEVICE_ICONS: Record<string, string[]> = {
  devices: ['M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z', 'M14 3v6h6', 'M8 13h8M8 17h5'],
  wifi: ['M2 9a15 15 0 0120 0', 'M5 12.5a10 10 0 0114 0', 'M8.5 16a5 5 0 017 0', 'M12 19.5h.01'],
  offline: ['M2 9a15 15 0 0120 0', 'M5 12.5a10 10 0 0114 0', 'M8.5 16a5 5 0 017 0', 'M12 19.5h.01', 'M3 3l18 18'],
  alarm: ['M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z', 'M12 9v4', 'M12 17h.01'],
  gateway: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z'],
  plus: ['M12 5v14M5 12h14'],
  chevron: ['M6 9l6 6 6-6'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  filter: ['M3 5h18l-7 8.5V19l-4 2v-7.5z'],
  more: ['M5 12h.01M12 12h.01M19 12h.01'],
  plug: ['M9 2v5M15 2v5', 'M6 7h12v4a6 6 0 01-12 0z', 'M12 17v5'],
  external: ['M14 4h6v6', 'M10 14L20 4', 'M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5'],
  temperature: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  humidity: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  pressure: ['M12 4a9 9 0 100 18 9 9 0 000-18z', 'M12 13l4-4', 'M12 13h.01'],
};

export const DEVICE_KPIS: DeviceKpi[] = [
  { label: 'Total Devices', value: '3,120', change: '8%', direction: 'up', good: true, icon: 'devices', tone: 'purple' },
  { label: 'Online', value: '2,687', change: '10%', direction: 'up', good: true, icon: 'wifi', tone: 'green' },
  { label: 'Offline', value: '233', change: '12%', direction: 'down', good: false, icon: 'offline', tone: 'red' },
  { label: 'With Alarms', value: '47', change: '20%', direction: 'down', good: false, icon: 'alarm', tone: 'orange' },
  { label: 'Gateways', value: '15', change: '7%', direction: 'up', good: true, icon: 'gateway', tone: 'purple' },
];

export const DEVICE_TABS: DeviceTab[] = [
  { key: 'all', label: 'All Devices', count: 3120 },
  { key: 'sensor', label: 'Sensors', count: 2450 },
  { key: 'gateway', label: 'Gateways', count: 15 },
  { key: 'controller', label: 'Controllers', count: 35 },
  { key: 'other', label: 'Other Devices', count: 620 },
];

type Seed = Omit<Device, 'serial' | 'firmware' | 'gateway'>;

// The first rows shown, matching the design
const SEED_DEVICES: Seed[] = [
  { name: 'TEMP-RT-001', type: 'Temperature Sensor', category: 'Data Centre', location: 'DC-1 / Rack A3', kind: 'sensor', shape: 'box', status: 'online', lastSeen: '1 min ago', battery: 95 },
  { name: 'WL-CH-015', type: 'Water Leak Sensor', category: 'Server Room', location: 'SR-2', kind: 'sensor', shape: 'puck', status: 'online', lastSeen: '2 min ago', battery: 88 },
  { name: 'AQ-OF-102', type: 'Air Quality Sensor', category: 'Office Space', location: 'Level 5 - Office', kind: 'sensor', shape: 'box', status: 'online', lastSeen: '2 min ago', battery: 92 },
  { name: 'PK-SLOT-028', type: 'Parking Sensor', category: 'Smart Parking', location: 'B1 - Zone A', kind: 'sensor', shape: 'parking', status: 'online', lastSeen: '3 min ago', battery: 78 },
  { name: 'CS-TEMP-006', type: 'Temperature Sensor', category: 'Cold Storage', location: 'Cold Room 1', kind: 'sensor', shape: 'box', status: 'offline', lastSeen: '2 hours ago', battery: undefined },
  { name: 'WS-AG-011', type: 'Soil Moisture Sensor', category: 'Agriculture', location: 'Greenhouse 2', kind: 'sensor', shape: 'tall', status: 'online', lastSeen: '4 min ago', battery: 90 },
  { name: 'RM-CTRL-003', type: 'Room Controller', category: 'Room Automation', location: 'Meeting Room 3', kind: 'controller', shape: 'box', status: 'online', lastSeen: '5 min ago', battery: null },
  { name: 'LE-CT-042', type: 'Level Sensor', category: 'Water Monitoring', location: 'Manhole 12', kind: 'sensor', shape: 'probe', status: 'online', lastSeen: '6 min ago', battery: 85 },
  { name: 'DSP-001', type: 'Digital Display', category: 'Digital Signage', location: 'Main Lobby', kind: 'other', shape: 'display', status: 'online', lastSeen: '7 min ago', battery: null },
  { name: 'GW-01', type: 'Gateway', category: 'Network', location: 'Rooftop', kind: 'gateway', shape: 'router', status: 'online', lastSeen: '1 min ago', battery: null },
];

const TEMPLATES: Record<DeviceKind, Seed[]> = {
  sensor: SEED_DEVICES.filter(d => d.kind === 'sensor'),
  gateway: [SEED_DEVICES[9]],
  controller: [SEED_DEVICES[6]],
  other: [SEED_DEVICES[8]],
};

const GATEWAYS = ['GW-DC-01', 'GW-01', 'GW-B1-02', 'GW-L5-03'];

function serial(i: number): string {
  return `SN-${4589210001 + i}`;
}

// Fill each tab up to its count with deterministic variations of the templates
function buildDevices(): Device[] {
  const devices: Device[] = SEED_DEVICES.map((d, i) => ({
    ...d,
    serial: serial(i),
    firmware: 'v1.2.3',
    gateway: d.kind === 'gateway' ? '-' : GATEWAYS[0],
  }));
  for (const tab of DEVICE_TABS) {
    if (tab.key === 'all') continue;
    const kind = tab.key;
    const templates = TEMPLATES[kind];
    let existing = devices.filter(d => d.kind === kind).length;
    for (let n = 0; existing < tab.count; n++, existing++) {
      const i = devices.length;
      const t = templates[n % templates.length];
      const offline = i % 13 === 0;
      const prefix = t.name.split('-').slice(0, 2).join('-');
      devices.push({
        ...t,
        name: `${prefix}-${String(100 + n).padStart(3, '0')}`,
        serial: serial(i),
        status: offline ? 'offline' : 'online',
        lastSeen: offline ? `${1 + (i % 5)} hours ago` : `${1 + (i % 9)} min ago`,
        battery: t.battery === null ? null : offline ? undefined : 40 + ((i * 7) % 60),
        firmware: `v1.${1 + (i % 3)}.${i % 7}`,
        gateway: kind === 'gateway' ? '-' : GATEWAYS[i % GATEWAYS.length],
      });
    }
  }
  return devices;
}

export const DEVICES: Device[] = buildDevices();

export const DEVICE_READINGS: DeviceReading[] = [
  { label: 'Temperature', value: '22.4', unit: '°C', icon: 'temperature', tone: 'red', delta: '-0.8°C', direction: 'down' },
  { label: 'Humidity', value: '45', unit: '%', icon: 'humidity', tone: 'blue', delta: '-2%', direction: 'down' },
  { label: 'Air Pressure', value: '1013', unit: 'hPa', icon: 'pressure', tone: 'purple', delta: '+1 hPa', direction: 'up' },
];
