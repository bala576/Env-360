// Static content for the Masters & Configuration page. Replace with API calls when available.

export interface MasterStat {
  label: string;
  value: number;
  change: number;
  icon: string;
  color: string;
  tint: string;
}

export interface MasterEntity {
  key: string;
  name: string;
  description: string;
  items: number;
  icon: string;
  color: string;
  tint: string;
  // Existing master screen this card opens, when one exists
  route?: string;
}

export interface ConfigItem {
  name: string;
  description: string;
  icon: string;
  color: string;
  tint: string;
}

export type SiteStatus = 'Active' | 'Offline';

export interface MasterSite {
  id: number;
  name: string;
  code: string;
  city: string;
  type: string;
  status: SiteStatus;
  buildings: number;
  devices: number;
}

export interface HierarchyNode {
  id: string;
  label: string;
  kind: 'site' | 'level' | 'zone';
  devices?: number;
  children?: HierarchyNode[];
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const MASTER_ICONS: Record<string, string[]> = {
  file: ['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 13h6M9 17h6'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5', 'M3 17l9 5 9-5'],
  zone: ['M4 5h16v12H4z', 'M8 21h8M12 17v4', 'M8 13l3-3 2 2 3-3'],
  device: ['M4 6h16v10H4z', 'M9 20h6M12 16v4', 'M8 10h.01M12 10h4'],
  users: ['M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M2.5 20a6.5 6.5 0 0113 0', 'M16 4.5a3.5 3.5 0 010 6.5M18 14a6 6 0 013.5 6'],
  gear: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
  org: ['M4 21V7l8-4 8 4v14', 'M9 21v-5h6v5', 'M8 10h.01M12 10h.01M16 10h.01M8 13h.01M16 13h.01', 'M2 21h20'],
  unit: ['M12 4a2.5 2.5 0 100 5 2.5 2.5 0 000-5z', 'M12 9v4', 'M5 17a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM19 17a2.5 2.5 0 100 5 2.5 2.5 0 000-5z', 'M5 17v-2h14v2'],
  team: ['M12 10a3 3 0 100-6 3 3 0 000 6z', 'M6 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', 'M7 20a5 5 0 0110 0', 'M2 19a4 4 0 015-3.8M22 19a4 4 0 00-5-3.8'],
  pin: ['M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z', 'M12 7a2.5 2.5 0 100 5 2.5 2.5 0 000-5z'],
  building: ['M5 21V5l7-2v18', 'M12 8h7v13', 'M8 8h.01M8 12h.01M8 16h.01M15 12h.01M15 16h.01', 'M3 21h18'],
  cube: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M12 12l8-4.5M12 12v9M12 12L4 7.5'],
  sensor: ['M4 5h16v11H4z', 'M8 20h8M12 16v4', 'M9 10.5a3 3 0 016 0', 'M12 12h.01'],
  boxes: ['M4 11h7v7H4zM13 11h7v7h-7zM8.5 3h7v7h-7z'],
  gauge: ['M4 16a8 8 0 1116 0', 'M12 16l4-5', 'M12 16h.01'],
  ruler: ['M3 17L17 3l4 4L7 21z', 'M7 13l2 2M10 10l2 2M13 7l2 2'],
  tag: ['M3 12V4h8l10 10-8 8z', 'M7.5 8.5h.01'],
  bell: ['M6 16V11a6 6 0 0112 0v5l1.5 2h-15z', 'M10 20a2 2 0 004 0'],
  play: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M10 8.5v7l6-3.5z'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  dashboard: ['M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z'],
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M20 20l-4-4'],
  plus: ['M12 5v14M5 12h14'],
  dots: ['M5 12h.01M12 12h.01M19 12h.01'],
  up: ['M12 19V5', 'M6 11l6-6 6 6'],
  folder: ['M3 6h6l2 2h10v11H3z'],
  close: ['M6 6l12 12M18 6L6 18'],
  chevron: ['M9 6l6 6-6 6'],
  left: ['M15 6l-6 6 6 6'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  toggle: ['M5 12a7 7 0 1014 0 7 7 0 00-14 0', 'M12 5v7'],
};

export const MASTER_TABS = ['Master Data', 'Configuration', 'System Settings', 'Workflow & Rules', 'Roles & Permissions', 'Audit Trail'];

export const MASTER_STATS: MasterStat[] = [
  { label: 'Sites', value: 25, change: 4, icon: 'file', color: '#6d28d9', tint: '#ede9fe' },
  { label: 'Buildings', value: 48, change: 6, icon: 'layers', color: '#16a34a', tint: '#dcfce7' },
  { label: 'Zones', value: 320, change: 8, icon: 'zone', color: '#dc2626', tint: '#fee2e2' },
  { label: 'Device Types', value: 42, change: 5, icon: 'device', color: '#2563eb', tint: '#dbeafe' },
  { label: 'Users', value: 86, change: 12, icon: 'users', color: '#ea580c', tint: '#ffedd5' },
  { label: 'Templates', value: 18, change: 20, icon: 'gear', color: '#7c3aed', tint: '#ede9fe' },
];

const MASTERS_BASE = '/administration/configuration/masters';

export const MASTER_ENTITIES: MasterEntity[] = [
  { key: 'organization', name: 'Organization', description: 'Manage company structure and business units', items: 12, icon: 'org', color: '#2563eb', tint: '#dbeafe', route: `${MASTERS_BASE}/general-master/organization` },
  { key: 'business-unit', name: 'Business Unit', description: 'Define business units and divisions', items: 24, icon: 'unit', color: '#7c3aed', tint: '#ede9fe' },
  { key: 'department', name: 'Department', description: 'Manage departments and teams', items: 56, icon: 'team', color: '#16a34a', tint: '#dcfce7' },
  { key: 'site', name: 'Site', description: 'Manage sites and geographical locations', items: 25, icon: 'pin', color: '#dc2626', tint: '#fee2e2' },
  { key: 'building', name: 'Building', description: 'Define buildings within sites', items: 48, icon: 'building', color: '#d97706', tint: '#fef3c7' },
  { key: 'zone', name: 'Zone', description: 'Manage zones and areas within buildings', items: 320, icon: 'cube', color: '#2563eb', tint: '#dbeafe' },
  { key: 'device-type', name: 'Device & Sensor Type', description: 'Configure device types and sensor categories', items: 42, icon: 'sensor', color: '#7c3aed', tint: '#ede9fe', route: `${MASTERS_BASE}/sensor-master/sensor-types` },
  { key: 'asset-category', name: 'Asset Category', description: 'Manage asset categories and classification', items: 36, icon: 'boxes', color: '#16a34a', tint: '#dcfce7', route: `${MASTERS_BASE}/environment-master/categories` },
  { key: 'location-type', name: 'Location Type', description: 'Define location types (e.g. room, floor, outdoor)', items: 18, icon: 'pin', color: '#dc2626', tint: '#fee2e2', route: `${MASTERS_BASE}/general-master/location` },
  { key: 'measurement-type', name: 'Measurement Type', description: 'Configure measurement parameters', items: 28, icon: 'gauge', color: '#16a34a', tint: '#dcfce7', route: `${MASTERS_BASE}/general-master/parameter` },
  { key: 'unit-of-measure', name: 'Unit of Measure', description: 'Manage units (°C, %, ppm, lux)', items: 48, icon: 'ruler', color: '#d97706', tint: '#fef3c7', route: `${MASTERS_BASE}/general-master/unit` },
  { key: 'tag-type', name: 'Tag Type', description: 'Configure tag types (RFID, BLE, QR, etc.)', items: 16, icon: 'tag', color: '#2563eb', tint: '#dbeafe' },
];

export const CONFIG_ITEMS: ConfigItem[] = [
  { name: 'Monitoring Rules', description: 'Set thresholds and alert rules', icon: 'bell', color: '#dc2626', tint: '#fee2e2' },
  { name: 'Automation', description: 'Configure actions and workflows', icon: 'play', color: '#2563eb', tint: '#dbeafe' },
  { name: 'Notification Templates', description: 'Manage email/SMS/push templates', icon: 'mail', color: '#7c3aed', tint: '#ede9fe' },
  { name: 'Device Configuration', description: 'Set device parameters and profiles', icon: 'gear', color: '#16a34a', tint: '#dcfce7' },
  { name: 'Dashboard Configuration', description: 'Customize dashboards and widgets', icon: 'dashboard', color: '#1e40af', tint: '#e0e7ff' },
];

const SITE_SEED: Omit<MasterSite, 'id' | 'code'>[] = [
  { name: 'Dubai Mall', city: 'Dubai', type: 'Mall', status: 'Active', buildings: 8, devices: 568 },
  { name: 'City Center (Deira)', city: 'Dubai', type: 'Mall', status: 'Active', buildings: 5, devices: 320 },
  { name: 'Abu Dhabi Mall', city: 'Abu Dhabi', type: 'Mall', status: 'Active', buildings: 4, devices: 286 },
  { name: 'Sharjah City Center', city: 'Sharjah', type: 'Mall', status: 'Active', buildings: 6, devices: 342 },
  { name: 'Ajman Mall', city: 'Ajman', type: 'Mall', status: 'Active', buildings: 4, devices: 210 },
  { name: 'Corporate Office', city: 'Dubai', type: 'Office', status: 'Active', buildings: 1, devices: 85 },
  { name: 'Warehouse - Al Quoz', city: 'Dubai', type: 'Warehouse', status: 'Offline', buildings: 2, devices: 140 },
  { name: 'Yas Mall', city: 'Abu Dhabi', type: 'Mall', status: 'Active', buildings: 3, devices: 298 },
  { name: 'Marina Tower', city: 'Dubai', type: 'Office', status: 'Active', buildings: 1, devices: 64 },
  { name: 'Jebel Ali Logistics Hub', city: 'Dubai', type: 'Warehouse', status: 'Active', buildings: 3, devices: 176 },
  { name: 'Al Ain Mall', city: 'Al Ain', type: 'Mall', status: 'Active', buildings: 2, devices: 154 },
  { name: 'RAK Mall', city: 'Ras Al Khaimah', type: 'Mall', status: 'Offline', buildings: 2, devices: 118 },
  { name: 'Business Bay HQ', city: 'Dubai', type: 'Office', status: 'Active', buildings: 2, devices: 92 },
  { name: 'Mussafah Warehouse', city: 'Abu Dhabi', type: 'Warehouse', status: 'Active', buildings: 2, devices: 88 },
  { name: 'Fujairah City Center', city: 'Fujairah', type: 'Mall', status: 'Active', buildings: 3, devices: 167 },
  { name: 'Mirdif City Center', city: 'Dubai', type: 'Mall', status: 'Active', buildings: 4, devices: 251 },
  { name: 'Dubai Silicon Oasis Office', city: 'Dubai', type: 'Office', status: 'Active', buildings: 1, devices: 58 },
  { name: 'Sharjah Industrial Store', city: 'Sharjah', type: 'Warehouse', status: 'Offline', buildings: 1, devices: 46 },
  { name: 'Galleria Mall', city: 'Abu Dhabi', type: 'Mall', status: 'Active', buildings: 2, devices: 189 },
  { name: 'DIFC Office', city: 'Dubai', type: 'Office', status: 'Active', buildings: 1, devices: 72 },
  { name: 'Umm Al Quwain Mall', city: 'Umm Al Quwain', type: 'Mall', status: 'Active', buildings: 1, devices: 96 },
  { name: 'KIZAD Warehouse', city: 'Abu Dhabi', type: 'Warehouse', status: 'Active', buildings: 2, devices: 104 },
  { name: 'Ibn Battuta Mall', city: 'Dubai', type: 'Mall', status: 'Active', buildings: 6, devices: 312 },
  { name: 'Al Wahda Mall', city: 'Abu Dhabi', type: 'Mall', status: 'Active', buildings: 2, devices: 176 },
  { name: 'Dubai Hills Mall', city: 'Dubai', type: 'Mall', status: 'Active', buildings: 3, devices: 264 },
];

export const MASTER_SITES: MasterSite[] = SITE_SEED.map((s, i) => ({
  ...s,
  id: i + 1,
  code: `SITE-${String(i + 1).padStart(3, '0')}`,
}));

export const SITE_TYPES = ['Mall', 'Office', 'Warehouse'];

export const HIERARCHY: HierarchyNode[] = [
  {
    id: 'dubai-mall', label: 'Dubai Mall', kind: 'site', children: [
      {
        id: 'l1', label: 'Level 1', kind: 'level', children: [
          { id: 'l1-ground', label: 'Ground Floor', kind: 'zone', devices: 48 },
          { id: 'l1-first', label: 'First Floor', kind: 'zone', devices: 62 },
          { id: 'l1-second', label: 'Second Floor', kind: 'zone', devices: 58 },
        ],
      },
      {
        id: 'l2', label: 'Level 2', kind: 'level', children: [
          { id: 'l2-park', label: 'Car Park', kind: 'zone', devices: 36 },
          { id: 'l2-food', label: 'Food Court', kind: 'zone', devices: 42 },
        ],
      },
      {
        id: 'l3', label: 'Level 3', kind: 'level', children: [
          { id: 'l3-outdoor', label: 'Outdoor Area', kind: 'zone', devices: 24 },
        ],
      },
    ],
  },
  {
    id: 'city-center', label: 'City Center (Deira)', kind: 'site', children: [
      {
        id: 'cc-l1', label: 'Level 1', kind: 'level', children: [
          { id: 'cc-l1-retail', label: 'Retail Wing', kind: 'zone', devices: 54 },
          { id: 'cc-l1-cinema', label: 'Cinema', kind: 'zone', devices: 28 },
        ],
      },
    ],
  },
  {
    id: 'corporate-office', label: 'Corporate Office', kind: 'site', children: [
      {
        id: 'co-l1', label: 'Level 1', kind: 'level', children: [
          { id: 'co-l1-open', label: 'Open Office', kind: 'zone', devices: 32 },
          { id: 'co-l1-meet', label: 'Meeting Rooms', kind: 'zone', devices: 18 },
        ],
      },
    ],
  },
];
