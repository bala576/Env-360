// Static content for the Integrations overview page. Replace with API calls when available.

export interface Vendor {
  name: string;
  // Wordmark styling: text colour and optional icon shown before the name
  color: string;
  weight?: number;
  icon?: string;
}

export interface SourceCategory {
  key: string;
  title: string;
  icon: string;
  tone: string;
  vendors: Vendor[];
  connected: number;
}

export interface FlowItem {
  key: string;
  label: string;
  sub?: string;
  icon: string;
  color: string;
}

export interface Method {
  title: string;
  sub: string;
  icon: string;
}

export interface Deployment {
  key: string;
  label: string;
  sub?: string;
  icon: string;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const INT_ICONS: Record<string, string[]> = {
  building: ['M5 21V5l7-2v18', 'M12 8h7v13', 'M8 8h.01M8 12h.01M8 16h.01M15 12h.01M15 16h.01', 'M3 21h18'],
  video: ['M3 6h13v12H3z', 'M16 10l5-3v10l-5-3'],
  door: ['M6 3h10v18H6z', 'M16 5h3v16h-3', 'M13 12h.01'],
  user: ['M12 4a4 4 0 100 8 4 4 0 000-8z', 'M4 21a8 8 0 0116 0'],
  gear: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
  network: ['M12 4a2 2 0 100 4 2 2 0 000-4z', 'M5 16a2 2 0 100 4 2 2 0 000-4z', 'M19 16a2 2 0 100 4 2 2 0 000-4z', 'M12 8v3M12 11l-6 5M12 11l6 5'],
  cloud: ['M7 18a4 4 0 01-.5-8 6 6 0 0111.5 1.5A3.5 3.5 0 0117.5 18z'],
  signal: ['M12 12h.01', 'M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7', 'M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8'],
  bell: ['M6 16V11a6 6 0 0112 0v5l2 2H4z', 'M10 20a2 2 0 004 0'],
  db: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z', 'M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6', 'M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6'],
  clock: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v5l3 2'],
  link: ['M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1', 'M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1'],
  file: ['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 13h6M9 17h6'],
  chart: ['M4 20V10M10 20V4M16 20v-8M22 20H2'],
  flow: ['M4 6h6v4H4zM14 14h6v4h-6z', 'M7 10v4a2 2 0 002 2h5', 'M17 14v-4a2 2 0 00-2-2h-5'],
  apps: ['M12 4a2 2 0 100 4 2 2 0 000-4z', 'M5 14a2 2 0 100 4 2 2 0 000-4z', 'M19 14a2 2 0 100 4 2 2 0 000-4z', 'M10.5 7.5l-4 7M13.5 7.5l4 7M7 16h10'],
  api: ['M4 6h16v12H4z', 'M8 10l-2 2 2 2M16 10l2 2-2 2', 'M13 9l-2 6'],
  webhook: ['M9 7a3 3 0 115 2.2L12 13', 'M7 17a3 3 0 11-1.5-5.6', 'M17 17a3 3 0 10-1.5-5.6L12 13 7 17h10'],
  protocol: ['M4 4h7v7H4zM13 13h7v7h-7z', 'M11 7.5h4a2 2 0 012 2V13', 'M13 16.5H9a2 2 0 01-2-2V11'],
  check: ['M5 12l4 4 10-10'],
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  box: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M4 7.5l8 4.5 8-4.5', 'M12 12v9'],
  leaf: ['M5 19c0-8 6-14 15-14 0 9-6 15-14 15', 'M5 19l7-7'],
  server: ['M4 4h16v6H4zM4 14h16v6H4z', 'M8 7h.01M8 17h.01'],
  lock: ['M6 11h12v10H6z', 'M8 11V8a4 4 0 018 0v3'],
  shield: ['M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  map: ['M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z', 'M9 4v14M15 6v14'],
  sun: ['M12 8a4 4 0 100 8 4 4 0 000-8z', 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5'],
  card: ['M3 6h18v12H3z', 'M3 10h18', 'M7 15h4'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  monitor: ['M3 5h18v11H3z', 'M8 20h8M12 16v4'],
  monitorPulse: ['M3 5h18v11H3z', 'M8 20h8M12 16v4', 'M6 11h3l2-3 2 5 2-2h3'],
  transform: ['M4 12a8 8 0 0114-5.3', 'M20 12a8 8 0 01-14 5.3', 'M18 3v4h-4M6 21v-4h4'],
  map2: ['M4 6h16M4 12h10M4 18h7', 'M17 15l3 3-3 3'],
  report: ['M6 3h12v18H6z', 'M9 8h6M9 12h6M9 16h3'],
};

export const INT_TABS = ['Overview', 'Integration Catalog', 'Data Flows', 'API Management', 'Webhooks', 'Status & Monitoring', 'Audit Logs'];

export const SOURCES: SourceCategory[] = [
  {
    key: 'bms', title: 'Building Management Systems (BMS)', icon: 'building', tone: 'blue', connected: 3,
    vendors: [{ name: 'Johnson Controls', color: '#1d4ed8' }, { name: 'SIEMENS', color: '#0f9e9e', weight: 800 }, { name: 'Honeywell', color: '#dc2626', weight: 800 }],
  },
  {
    key: 'vms', title: 'Video Management Systems (VMS)', icon: 'video', tone: 'blue', connected: 3,
    vendors: [{ name: 'Genetec', color: '#1e293b', weight: 700 }, { name: 'Milestone', color: '#1e40af', weight: 700 }, { name: 'AVIGILON', color: '#111827', weight: 600 }],
  },
  {
    key: 'access', title: 'Access Control', icon: 'door', tone: 'red', connected: 3,
    vendors: [{ name: 'HID', color: '#1e3a8a', weight: 900 }, { name: 'ASSA ABLOY', color: '#111827', weight: 800 }, { name: 'suprema', color: '#be123c', weight: 800 }],
  },
  {
    key: 'hr', title: 'HR & Identity Management', icon: 'user', tone: 'red', connected: 3,
    vendors: [{ name: 'Microsoft Entra ID', color: '#1e293b', icon: 'shield' }, { name: 'Active Directory', color: '#1e293b', icon: 'server' }, { name: 'ORACLE', color: '#dc2626', weight: 800 }],
  },
  {
    key: 'erp', title: 'Enterprise Systems', icon: 'gear', tone: 'purple', connected: 3,
    vendors: [{ name: 'SAP', color: '#0369a1', weight: 900 }, { name: 'ORACLE', color: '#dc2626', weight: 800 }, { name: 'Microsoft Dynamics 365', color: '#1e293b', icon: 'box' }],
  },
  {
    key: 'iot', title: 'IoT Platforms & Devices', icon: 'network', tone: 'blue', connected: 4,
    vendors: [{ name: 'Milesight', color: '#1e3a8a', weight: 700 }, { name: 'Teltonika', color: '#1e293b', weight: 700 }, { name: 'Minew', color: '#b91c1c', weight: 700 }, { name: 'LoRaWAN', color: '#1e3a8a', weight: 800 }],
  },
  {
    key: 'third', title: 'Third-party Applications', icon: 'cloud', tone: 'blue', connected: 4,
    vendors: [{ name: 'Weather APIs', color: '#374151', icon: 'sun' }, { name: 'Maps & GIS', color: '#374151', icon: 'map' }, { name: 'Payment Systems', color: '#374151', icon: 'card' }, { name: 'Email/SMS/Teams', color: '#374151', icon: 'mail' }],
  },
];

export const DATA_INPUTS: FlowItem[] = [
  { key: 'realtime', label: 'Real-time Data', sub: '(Devices & Sensors)', icon: 'signal', color: '#16a34a' },
  { key: 'events', label: 'Event & Alarm Data', icon: 'bell', color: '#ef4444' },
  { key: 'master', label: 'Master Data', sub: '(People, Assets, Locations)', icon: 'db', color: '#2563eb' },
  { key: 'sync', label: 'Scheduled Data Sync', icon: 'clock', color: '#1e3a8a' },
  { key: 'api', label: 'API / Webhooks', icon: 'link', color: '#2563eb' },
  { key: 'import', label: 'File Import (CSV, Excel)', icon: 'file', color: '#16a34a' },
];

export const DATA_OUTPUTS: FlowItem[] = [
  { key: 'dash', label: 'Dashboards & Reports', icon: 'chart', color: '#2563eb' },
  { key: 'alerts', label: 'Alerts & Notifications', icon: 'bell', color: '#ef4444' },
  { key: 'auto', label: 'Automation & Workflows', icon: 'gear', color: '#6d28d9' },
  { key: 'apps', label: 'Third-party Applications', icon: 'apps', color: '#0d9488' },
  { key: 'export', label: 'Data Export (CSV, Excel, PDF)', icon: 'file', color: '#2563eb' },
  { key: 'custom', label: 'APIs for Custom Integrations', icon: 'api', color: '#1d4ed8' },
];

export const PRODUCTS = [
  { label: 'People360', icon: 'people', color: '#6d28d9' },
  { label: 'Asset360', icon: 'box', color: '#16a34a' },
  { label: 'Environment360', icon: 'leaf', color: '#7c3aed' },
];

export const DEPLOYMENTS: Deployment[] = [
  { key: 'saas', label: 'Cloud', sub: '(SaaS – Multi-tenant)', icon: 'cloud' },
  { key: 'private', label: 'Private Cloud', icon: 'server' },
  { key: 'onprem', label: 'On-Premises', icon: 'server' },
  { key: 'hybrid', label: 'Hybrid Deployment', icon: 'cloud' },
];

export const METHODS: Method[] = [
  { title: 'REST APIs', sub: '(Secure API access for real-time and batch data exchange)', icon: 'api' },
  { title: 'Webhooks', sub: '(Receive real-time event notifications)', icon: 'webhook' },
  { title: 'Database Integration', sub: '(Direct database connectivity)', icon: 'db' },
  { title: 'File Based Integration', sub: '(CSV, Excel, XML, JSON)', icon: 'file' },
  { title: 'Protocol Integration', sub: '(MQTT, OPC UA, BACnet, Modbus, ONVIF)', icon: 'protocol' },
];

export const BENEFITS = [
  'Unified view across all systems',
  'Real-time data exchange',
  'Automated workflows and alerts',
  'Improved operational efficiency',
  'Reduced manual intervention',
  'Scalable and secure integration framework',
];

export const SAMPLE_SOURCES = [
  { label: 'BMS', icon: 'building', color: '#2563eb' },
  { label: 'VMS', icon: 'video', color: '#2563eb' },
  { label: 'Access Control', icon: 'door', color: '#dc2626' },
  { label: 'HR System', icon: 'user', color: '#1e3a8a' },
  { label: 'SAP / ERP', icon: 'gear', color: '#0369a1' },
  { label: 'IoT Devices', icon: 'network', color: '#2563eb' },
];

export const SAMPLE_LAYER = [
  { label: 'API Gateway', icon: 'api' },
  { label: 'Data Mapping', icon: 'map2' },
  { label: 'Transformation', icon: 'transform' },
  { label: 'Security & Authentication', icon: 'shield' },
  { label: 'Monitoring & Logging', icon: 'monitorPulse' },
];

export const SAMPLE_TARGETS = [
  { label: 'Dashboards', icon: 'chart', color: '#f59e0b' },
  { label: 'Reports', icon: 'report', color: '#16a34a' },
  { label: 'Automation', icon: 'gear', color: '#2563eb' },
  { label: 'Notifications', icon: 'bell', color: '#f59e0b' },
  { label: 'External Applications', icon: 'apps', color: '#7c3aed' },
  { label: 'Data Export', icon: 'file', color: '#16a34a' },
];
