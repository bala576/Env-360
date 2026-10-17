import { DropdownOption } from '../../shared/dropdown/dropdown';

export type SectionId = 'basic' | 'location' | 'hierarchy' | 'specs' | 'contacts' | 'settings' | 'media';

export interface FormSection {
  id: SectionId;
  label: string;
  hint: string;
  icon: string;
}

export type AttachmentKind = 'image' | 'document';

export interface Attachment {
  id: number;
  name: string;
  bytes: number;
  kind: AttachmentKind;
  fileType: string;
  uploadedOn: string;
  category?: DocCategoryId;
  url?: string;
  caption?: string;
  gradient?: string;
}

export const ADD_ICONS: Record<string, string[]> = {
  basic: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 12h6M10 16h6'],
  location: ['M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z', 'M12 7.1a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z'],
  hierarchy: ['M12 3a2 2 0 100 4 2 2 0 000-4z', 'M5 17a2 2 0 100 4 2 2 0 000-4z', 'M19 17a2 2 0 100 4 2 2 0 000-4z', 'M12 7v5M5 17v-2a3 3 0 013-3h8a3 3 0 013 3v2'],
  specs: ['M6 3h12v18H6z', 'M9 7h6M9 11h6M9 15h4'],
  contacts: ['M12 4a4 4 0 100 8 4 4 0 000-8z', 'M4 21a8 8 0 0116 0'],
  settings: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z'],
  media: ['M6 3h9l4 4v14H6z', 'M9 12h6M9 16h6'],
  floorplan: ['M4 4h16v16H4z', 'M4 10h7v10M11 4v3M15 10h5M15 10v4'],
  back: ['M19 12H5', 'M12 19l-7-7 7-7'],
  close: ['M6 6l12 12M18 6L6 18'],
  info: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 11v5', 'M12 8h.01'],
  upload: ['M7 18a4 4 0 01-.5-8A6 6 0 0118 9a4.5 4.5 0 01-.5 9', 'M12 12v8', 'M9 15l3-3 3 3'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  expand: ['M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'],
  pdf: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M9 14h1.5a1.5 1.5 0 000-3H9v6M14 11v6h1a2 2 0 002-2v-2a2 2 0 00-2-2z'],
  pin: ['M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z', 'M12 7.1a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z'],
  mail: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'],
  phone: ['M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2'],
  clock: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v5l3 2'],
  check: ['M5 12l5 5 9-10'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  target: ['M12 4a8 8 0 100 16 8 8 0 000-16z', 'M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 1v3M12 20v3M1 12h3M20 12h3'],
  address: ['M4 21h16', 'M6 21V10l6-4 6 4v11', 'M12 3v3', 'M10 21v-5h4v5'],
  mapfold: ['M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z', 'M9 4v14M15 6v14'],
  refresh: ['M20 11a8 8 0 10-2.3 5.7', 'M20 4v7h-7'],
  locate: ['M12 3v3M12 18v3M3 12h3M18 12h3', 'M12 7a5 5 0 100 10 5 5 0 000-10z', 'M12 11a1 1 0 100 2 1 1 0 000-2z'],
  landmark: ['M12 2l3 6H9z', 'M10 8l-1 13h6l-1-13', 'M7 21h10'],
  camera: ['M4 8h3l2-3h6l2 3h3v11H4z', 'M12 10a3 3 0 100 6 3 3 0 000-6z'],
  globe: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M3 12h18', 'M12 3a14 14 0 010 18M12 3a14 14 0 000 18'],
  building: ['M6 21V4h8l4 4v13', 'M14 4v4h4', 'M4 21h16', 'M9 10h2M9 14h2M9 18h2M13 14h2M13 18h2'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5', 'M3 17.5l9 5 9-5'],
  group: ['M8 4a3 3 0 100 6 3 3 0 000-6z', 'M3 20v-1a5 5 0 0110 0v1', 'M16 6a2.5 2.5 0 110 5', 'M17 14a4 4 0 014 4v2'],
  chevron: ['M9 6l6 6-6 6'],
  grip: ['M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  trash: ['M4 7h16', 'M10 11v6M14 11v6', 'M6 7l1 13h10l1-13', 'M9 7V4h6v3'],
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  clipboard: ['M9 4h6v3H9z', 'M9 5H6v16h12V5h-3', 'M9 12h6M9 16h4'],
  template: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6M10 17h4'],
  area: ['M4 4h16v16H4z', 'M4 9h16M9 4v16'],
  usage: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M12 12l8-4.5M12 12v9M12 12L4 7.5'],
  construction: ['M3 21h18', 'M5 21V11l7-5 7 5v10', 'M9 21v-6h6v6'],
  people: ['M9 4a3 3 0 100 6 3 3 0 000-6z', 'M3 20v-1a6 6 0 0112 0v1', 'M16 4a3 3 0 010 6', 'M18 14a5 5 0 013 4.6V20'],
  status: ['M4 4h16v16H4z', 'M8 15l3-3 2 2 3-4'],
  department: ['M4 21V5h10v16', 'M14 9h6v12', 'M7 9h4M7 13h4M7 17h4', 'M3 21h18'],
  calendar: ['M4 6h16v15H4z', 'M4 10h16', 'M8 3v4M16 3v4', 'M8 14h2M12 14h2M16 14h.01M8 17h2M12 17h2'],
  sliders: ['M4 6h9M17 6h3', 'M4 12h3M11 12h9', 'M4 18h11M19 18h1', 'M15 4v4M9 10v4M17 16v4'],
  bell: ['M6 16V11a6 6 0 0112 0v5l2 2H4z', 'M10 20a2 2 0 004 0'],
  shield: ['M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z', 'M9 12l2 2 4-4'],
  download: ['M12 4v11', 'M7 10l5 5 5-5', 'M5 20h14'],
  more: ['M12 5h.01M12 12h.01M12 19h.01'],
  image: ['M4 5h16v14H4z', 'M8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3z', 'M20 15l-5-5-9 9'],
  star: ['M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z'],
  chevronLeft: ['M15 6l-6 6 6 6'],
  checkCircle: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M8 12l3 3 5-6'],
};

export const FORM_SECTIONS: FormSection[] = [
  { id: 'basic', label: 'Basic Information', hint: 'Name, type and details', icon: 'basic' },
  { id: 'location', label: 'Location & Map', hint: 'Address and geolocation', icon: 'location' },
  { id: 'hierarchy', label: 'Hierarchy', hint: 'Parent site/space', icon: 'hierarchy' },
  { id: 'specs', label: 'Specifications', hint: 'Area, floors and attributes', icon: 'specs' },
  { id: 'contacts', label: 'Contacts', hint: 'Site owners and managers', icon: 'contacts' },
  { id: 'settings', label: 'Settings', hint: 'Time zone, operational hours', icon: 'settings' },
  { id: 'media', label: 'Images & Documents', hint: 'Photos, plans and files', icon: 'media' },
];

const opts = (...labels: string[]): DropdownOption[] => labels.map(l => ({ label: l, value: l }));

export const TYPE_OPTIONS = opts('Group', 'Site', 'Building', 'Floor', 'Zone', 'Space', 'Room');
export const STATUS_OPTIONS = opts('Active', 'Inactive', 'Under Maintenance');
export const COUNTRY_OPTIONS = opts('United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'India');
export const CITY_OPTIONS: Record<string, DropdownOption[]> = {
  'United Arab Emirates': opts('Dubai', 'Abu Dhabi', 'Sharjah'),
  'Saudi Arabia': opts('Riyadh', 'Jeddah', 'Dammam'),
  Qatar: opts('Doha', 'Al Wakrah'),
  Oman: opts('Muscat', 'Salalah'),
  India: opts('Chennai', 'Bengaluru', 'Mumbai'),
};
export const CONSTRUCTION_OPTIONS = opts('Commercial', 'Residential', 'Industrial', 'Mixed Use');
export const USAGE_OPTIONS = opts('Retail & Entertainment', 'Office', 'Hospitality', 'Healthcare', 'Warehouse');
export const OPERATING_STATUS_OPTIONS = opts('Operational', 'Under Construction', 'Under Renovation', 'Closed');
export const FLOOR_USAGE_OPTIONS = opts('Retail', 'F&B', 'Parking', 'Office', 'Entertainment', 'Services', 'Storage', 'Plant Room');
export const FLOOR_STATUS_OPTIONS = opts('Active', 'Inactive', 'Under Maintenance');
export const TIMEZONE_OPTIONS = opts(
  '(UTC+04:00) Dubai, Abu Dhabi',
  '(UTC+03:00) Riyadh, Kuwait',
  '(UTC+03:00) Doha',
  '(UTC+04:00) Muscat',
  '(UTC+05:30) Chennai, Mumbai, New Delhi',
  '(UTC+00:00) UTC',
);
export const MAP_OPTIONS = opts('Dubai Mall - Level 1', 'Dubai Mall - Level 2', 'Dubai Mall - Ground Floor', 'Dubai Mall - Basement 1');

// ---------- Images & Documents ----------
export type MediaTab = 'images' | 'documents' | 'plans';
export type DocCategoryId = 'general' | 'floorplan' | 'compliance' | 'technical' | 'manual';

export interface DocCategory {
  id: DocCategoryId;
  label: string;
  summary: string;
  tone: RoleTone;
}

export const DOC_CATEGORIES: DocCategory[] = [
  { id: 'general', label: 'General', summary: 'General Documents', tone: 'blue' },
  { id: 'floorplan', label: 'Floor Plan', summary: 'Floor Plans', tone: 'purple' },
  { id: 'compliance', label: 'Compliance', summary: 'Compliance Documents', tone: 'green' },
  { id: 'technical', label: 'Technical', summary: 'Technical Documents', tone: 'red' },
  { id: 'manual', label: 'Manual', summary: 'Manuals', tone: 'yellow' },
];

export const MEDIA_TABS: { id: MediaTab; label: string }[] = [
  { id: 'images', label: 'Images' },
  { id: 'documents', label: 'Documents' },
  { id: 'plans', label: 'Floor Plans & Drawings' },
];

export interface UploadRule {
  extensions: string[];
  accept: string;
  label: string;
}

const rule = (...extensions: string[]): UploadRule => ({
  extensions,
  accept: extensions.map(e => `.${e}`).join(','),
  label: [...new Set(extensions.map(e => (e === 'jpeg' ? 'jpg' : e).toUpperCase()))].join(', '),
});

export const UPLOAD_RULES: Record<MediaTab, UploadRule> = {
  images: rule('jpg', 'jpeg', 'png', 'webp'),
  documents: rule('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'),
  plans: rule('pdf', 'png', 'jpg', 'jpeg', 'dwg', 'dxf'),
};

const MB = 1024 * 1024;

// Sample files have no binary; images render from a gradient placeholder
export const DEFAULT_ATTACHMENTS: Attachment[] = [
  { id: 1, name: 'dubaimal_front.jpg', bytes: 2.4 * MB, kind: 'image', fileType: 'JPG', uploadedOn: '21 May 2025', caption: 'Front View', gradient: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 48%, #94a3b8 49%, #475569 78%, #1e3a5f 100%)' },
  { id: 2, name: 'main_entrance.jpg', bytes: 1.9 * MB, kind: 'image', fileType: 'JPG', uploadedOn: '21 May 2025', caption: 'Main Entrance', gradient: 'linear-gradient(180deg, #93c5fd 0%, #e0f2fe 40%, #d6d3d1 41%, #a8a29e 70%, #57534e 100%)' },
  { id: 3, name: 'interior.jpg', bytes: 2.1 * MB, kind: 'image', fileType: 'JPG', uploadedOn: '21 May 2025', caption: 'Interior View', gradient: 'radial-gradient(circle at 50% 10%, #e0f2fe 0%, #bfdbfe 25%, transparent 45%), linear-gradient(180deg, #cbd5e1 0%, #fde68a 55%, #a16207 100%)' },
  { id: 4, name: 'parking_area.jpg', bytes: 1.6 * MB, kind: 'image', fileType: 'JPG', uploadedOn: '21 May 2025', caption: 'Parking Area', gradient: 'linear-gradient(180deg, #bae6fd 0%, #f0f9ff 38%, #e7e5e4 39%, #a8a29e 72%, #78716c 100%)' },
  { id: 5, name: 'Site Information Sheet.pdf', bytes: 1.2 * MB, kind: 'document', fileType: 'PDF', uploadedOn: '21 May 2025', category: 'general' },
  { id: 6, name: 'Building Layout Plan.pdf', bytes: 3.5 * MB, kind: 'document', fileType: 'PDF', uploadedOn: '21 May 2025', category: 'floorplan' },
  { id: 7, name: 'Fire Safety Certificate.pdf', bytes: 800 * 1024, kind: 'document', fileType: 'PDF', uploadedOn: '21 May 2025', category: 'compliance' },
  { id: 8, name: 'Electrical Drawings.pdf', bytes: 2.1 * MB, kind: 'document', fileType: 'PDF', uploadedOn: '21 May 2025', category: 'technical' },
  { id: 9, name: 'Maintenance Manual.pdf', bytes: 4.3 * MB, kind: 'document', fileType: 'PDF', uploadedOn: '21 May 2025', category: 'manual' },
];

// Simplified indoor map, coordinates in a 300x170 viewBox
export const MINI_PLAN_ROOMS = [
  { x: 10, y: 10, w: 60, h: 45, fill: '#c7d2fe' },
  { x: 74, y: 10, w: 50, h: 30, fill: '#bbf7d0' },
  { x: 128, y: 10, w: 55, h: 30, fill: '#fde68a' },
  { x: 187, y: 10, w: 50, h: 45, fill: '#fecaca' },
  { x: 241, y: 10, w: 49, h: 70, fill: '#fed7aa' },
  { x: 10, y: 60, w: 40, h: 40, fill: '#a5f3fc' },
  { x: 10, y: 105, w: 70, h: 55, fill: '#ddd6fe' },
  { x: 84, y: 120, w: 60, h: 40, fill: '#fbcfe8' },
  { x: 148, y: 120, w: 45, h: 40, fill: '#bfdbfe' },
  { x: 197, y: 95, w: 93, h: 65, fill: '#e9d5ff' },
  { x: 197, y: 60, w: 40, h: 30, fill: '#d9f99d' },
];

export type MapMode = 'map' | 'search' | 'coords';
export type MapType = 'map' | 'satellite' | 'hybrid';

export const MAP_MODES: { id: MapMode; label: string; hint: string; icon: string }[] = [
  { id: 'map', label: 'Select from Map', hint: 'Pick a location on the interactive map', icon: 'target' },
  { id: 'search', label: 'Search Location', hint: 'Search and select from Google Maps', icon: 'search' },
  { id: 'coords', label: 'Enter Coordinates', hint: 'Manually enter latitude and longitude', icon: 'locate' },
];

export const MAP_TYPES: { id: MapType; label: string }[] = [
  { id: 'map', label: 'Map' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'hybrid', label: 'Hybrid' },
];

export const AREA_OPTIONS: Record<string, DropdownOption[]> = {
  Dubai: opts('Downtown Dubai', 'Business Bay', 'DIFC', 'Dubai Marina', 'Deira'),
  'Abu Dhabi': opts('Al Maryah Island', 'Corniche', 'Yas Island'),
  Sharjah: opts('Al Majaz', 'Al Nahda'),
};

// Geographic window shown by the mock map (Downtown Dubai)
export const MAP_BOUNDS = { north: 25.204, south: 25.19, west: 55.266, east: 55.284 };

export interface MapPlace {
  name: string;
  address: string;
  lat: number;
  lng: number;
  icon: 'pin' | 'landmark' | 'camera';
}

export const MAP_PLACES: MapPlace[] = [
  { name: 'Dubai Mall', address: 'Financial Center Road, Downtown Dubai', lat: 25.1972, lng: 55.2744, icon: 'pin' },
  { name: 'Burj Khalifa', address: '1 Sheikh Mohammed bin Rashid Blvd', lat: 25.1972, lng: 55.2684, icon: 'landmark' },
  { name: 'Dubai Fountain', address: 'Burj Lake, Downtown Dubai', lat: 25.1955, lng: 55.2726, icon: 'camera' },
  { name: 'Dubai Opera', address: 'Sheikh Mohammed bin Rashid Blvd', lat: 25.1938, lng: 55.2712, icon: 'camera' },
];

export interface HierarchyNode {
  id: string;
  name: string;
  type: string;
  status: string;
  children?: HierarchyNode[];
}

export const NEW_NODE_ID = '__new__';

const levels = (prefix: string, count: number): HierarchyNode[] =>
  Array.from({ length: count }, (_, i) => ({ id: `${prefix}-l${i + 1}`, name: `Level ${i + 1}`, type: 'Floor', status: 'Active' }));

export const SITE_HIERARCHY: HierarchyNode[] = [
  {
    id: 'dm-group', name: 'Dubai Mall (Group)', type: 'Group', status: 'Active', children: [
      {
        id: 'dm', name: 'Dubai Mall', type: 'Site', status: 'Active', children: [
          { id: 'dm-npb', name: 'North Parking Building', type: 'Building', status: 'Active', children: levels('dm-npb', 3) },
          { id: 'dm-spb', name: 'South Parking Building', type: 'Building', status: 'Active', children: levels('dm-spb', 3) },
          { id: 'dm-svc', name: 'Service Building', type: 'Building', status: 'Inactive', children: levels('dm-svc', 2) },
        ],
      },
    ],
  },
  {
    id: 'moe-group', name: 'Mall of the Emirates (Group)', type: 'Group', status: 'Active', children: [
      { id: 'moe', name: 'Mall of the Emirates', type: 'Site', status: 'Active', children: [
        { id: 'moe-main', name: 'Main Mall', type: 'Building', status: 'Active', children: levels('moe-main', 3) },
      ] },
    ],
  },
  {
    id: 'cw-group', name: 'City Walk (Group)', type: 'Group', status: 'Active', children: [
      { id: 'cw', name: 'City Walk', type: 'Site', status: 'Active', children: [
        { id: 'cw-a', name: 'Block A', type: 'Building', status: 'Active' },
      ] },
    ],
  },
];

// ---------- Specifications ----------
export interface SiteFloor {
  id: number;
  level: string;
  name: string;
  area: string;
  usage: string;
  status: string;
}

export interface SiteAttribute {
  id: number;
  name: string;
  value: string;
  unit: string;
  description: string;
}

export const DEFAULT_FLOORS: SiteFloor[] = [
  { id: 1, level: 'Level 2', name: 'Level 2', area: '120,000', usage: 'Retail', status: 'Active' },
  { id: 2, level: 'Level 1', name: 'Level 1 (Ground)', area: '150,000', usage: 'Retail', status: 'Active' },
  { id: 3, level: 'Level 0', name: 'Basement', area: '80,000', usage: 'Parking', status: 'Active' },
  { id: 4, level: 'Level -1', name: 'Lower Basement', area: '80,000', usage: 'Parking', status: 'Active' },
  { id: 5, level: 'Level 3', name: 'Level 3', area: '70,000', usage: 'F&B', status: 'Active' },
];

export const DEFAULT_ATTRIBUTES: SiteAttribute[] = [
  { id: 1, name: 'Building Height', value: '35', unit: 'm', description: 'Overall building height' },
  { id: 2, name: 'Number of Entrances', value: '8', unit: '-', description: 'Public entrances' },
  { id: 3, name: 'Number of Parking Bays', value: '4,000', unit: '-', description: 'Car parking capacity' },
  { id: 4, name: 'HVAC Type', value: 'Central', unit: '-', description: 'Cooling system type' },
  { id: 5, name: 'Power Supply', value: '10', unit: 'MW', description: 'Total power capacity' },
];

export interface SpecTemplate {
  id: string;
  label: string;
  specs: { totalArea: string; floors: string; usage: string; construction: string; occupancy: string; operatingStatus: string };
  floors: Omit<SiteFloor, 'id'>[];
  attributes: Omit<SiteAttribute, 'id'>[];
}

export const SPEC_TEMPLATES: SpecTemplate[] = [
  {
    id: 'mall',
    label: 'Shopping Mall',
    specs: { totalArea: '500,000', floors: '5', usage: 'Retail & Entertainment', construction: 'Commercial', occupancy: '200,000', operatingStatus: 'Operational' },
    floors: DEFAULT_FLOORS.map(({ id, ...f }) => f),
    attributes: DEFAULT_ATTRIBUTES.map(({ id, ...a }) => a),
  },
  {
    id: 'office',
    label: 'Office Tower',
    specs: { totalArea: '60,000', floors: '4', usage: 'Office', construction: 'Commercial', occupancy: '3,500', operatingStatus: 'Operational' },
    floors: [
      { level: 'Level 0', name: 'Lobby', area: '4,000', usage: 'Services', status: 'Active' },
      { level: 'Level 1', name: 'Office Floor 1', area: '18,000', usage: 'Office', status: 'Active' },
      { level: 'Level 2', name: 'Office Floor 2', area: '18,000', usage: 'Office', status: 'Active' },
      { level: 'Level -1', name: 'Basement Parking', area: '20,000', usage: 'Parking', status: 'Active' },
    ],
    attributes: [
      { name: 'Building Height', value: '120', unit: 'm', description: 'Overall building height' },
      { name: 'Number of Elevators', value: '12', unit: '-', description: 'Passenger elevators' },
      { name: 'HVAC Type', value: 'VAV', unit: '-', description: 'Variable air volume system' },
      { name: 'Power Supply', value: '4', unit: 'MW', description: 'Total power capacity' },
    ],
  },
  {
    id: 'warehouse',
    label: 'Warehouse / Logistics',
    specs: { totalArea: '25,000', floors: '1', usage: 'Warehouse', construction: 'Industrial', occupancy: '150', operatingStatus: 'Operational' },
    floors: [{ level: 'Level 0', name: 'Ground Floor', area: '25,000', usage: 'Storage', status: 'Active' }],
    attributes: [
      { name: 'Clear Height', value: '12', unit: 'm', description: 'Usable racking height' },
      { name: 'Loading Docks', value: '24', unit: '-', description: 'Truck loading bays' },
      { name: 'Cold Storage', value: '3,000', unit: 'sq.m', description: 'Refrigerated area' },
    ],
  },
];

// ---------- Contacts ----------
export type RoleTone = 'blue' | 'purple' | 'orange' | 'cyan' | 'red' | 'gray' | 'green' | 'yellow';

export interface ContactRole {
  label: string;
  hint: string;
  tone: RoleTone;
}

export const CONTACT_ROLES: ContactRole[] = [
  { label: 'Site Manager', hint: 'Overall responsibility for the site/space', tone: 'blue' },
  { label: 'Facility Engineer', hint: 'Technical and maintenance contact', tone: 'purple' },
  { label: 'Security Contact', hint: 'Security and safety related matters', tone: 'orange' },
  { label: 'IT Contact', hint: 'IT infrastructure and network contact', tone: 'cyan' },
  { label: 'Operations', hint: 'Day-to-day operations contact', tone: 'red' },
  { label: 'Other', hint: 'Other relevant contacts', tone: 'gray' },
];

export const ROLE_OPTIONS = opts(...CONTACT_ROLES.map(r => r.label));

export const DIAL_CODE_OPTIONS: DropdownOption[] = [
  { label: '🇦🇪 +971', value: '+971' },
  { label: '🇸🇦 +966', value: '+966' },
  { label: '🇶🇦 +974', value: '+974' },
  { label: '🇴🇲 +968', value: '+968' },
  { label: '🇮🇳 +91', value: '+91' },
];

export interface SiteContact {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  dialCode: string;
  phone: string;
  designation: string;
  notes: string;
  status: 'Active' | 'Inactive';
}

export const DEFAULT_CONTACTS: SiteContact[] = [
  { id: 1, name: 'Fahad Al Mansoori', role: 'Site Manager', department: 'Facilities', email: 'fahad@dubaimall.com', dialCode: '+971', phone: '50 123 4567', designation: 'Senior Site Manager', notes: '', status: 'Active' },
  { id: 2, name: 'Sara Ahmed', role: 'Facility Engineer', department: 'Facilities', email: 'sara@dubaimall.com', dialCode: '+971', phone: '50 234 5678', designation: 'MEP Engineer', notes: '', status: 'Active' },
  { id: 3, name: 'Mohammed Khan', role: 'Security Contact', department: 'Security', email: 'm.khan@dubaimall.com', dialCode: '+971', phone: '50 345 6789', designation: 'Security Supervisor', notes: '', status: 'Active' },
  { id: 4, name: 'Ravi Lal', role: 'IT Contact', department: 'IT', email: 'ravi.lal@dubaimall.com', dialCode: '+971', phone: '50 456 7890', designation: 'Network Administrator', notes: '', status: 'Active' },
  { id: 5, name: 'Noor Khaled', role: 'Operations', department: 'Operations', email: 'noor@dubaimall.com', dialCode: '+971', phone: '50 567 8901', designation: 'Operations Coordinator', notes: '', status: 'Inactive' },
];

// ---------- Settings ----------
export const DATE_FORMAT_OPTIONS = opts('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD MMM YYYY');
export const TIME_FORMAT_OPTIONS: DropdownOption[] = [
  { label: '24 Hour (HH:mm)', value: '24 Hour' },
  { label: '12 Hour (hh:mm AM/PM)', value: '12 Hour' },
];
export const LANGUAGE_OPTIONS = opts('English', 'Arabic', 'Hindi', 'French');
export const VISIBILITY_OPTIONS = opts('Visible to all users', 'Visible to selected users and roles', 'Private (owners only)');
export const ACCESS_ROLE_OPTIONS = opts('Site Manager', 'Facility Engineer', 'Security Team', 'IT Team', 'Operations', 'Administrators', 'Viewers');
export const MAP_VIEW_OPTIONS = opts('Satellite', 'Map', 'Hybrid');
export const SEVERITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'];
export const NOTIFICATION_CHANNELS = ['Email', 'SMS', 'In-App', 'Push Notification'];
export const MAX_TIME_RANGES = 3;

export interface TimeRange {
  from: string;
  to: string;
}

export interface DaySchedule {
  id: string;
  label: string;
  open: boolean;
  ranges: TimeRange[];
}

export const DEFAULT_SCHEDULE: DaySchedule[] = [
  { id: 'weekdays', label: 'Monday - Friday', open: true, ranges: [{ from: '09:00', to: '22:00' }] },
  { id: 'saturday', label: 'Saturday', open: true, ranges: [{ from: '10:00', to: '22:00' }] },
  { id: 'sunday', label: 'Sunday', open: false, ranges: [{ from: '10:00', to: '22:00' }] },
];

export interface SiteFeature {
  key: string;
  label: string;
  summary: string;
  hint: string;
  enabled: boolean;
}

export const DEFAULT_FEATURES: SiteFeature[] = [
  { key: 'asset', label: 'Enable for Asset Tracking', summary: 'Asset Tracking', hint: 'Track tagged assets and equipment within this site/space', enabled: true },
  { key: 'people', label: 'Enable for People Tracking', summary: 'People Tracking', hint: 'Count and track occupancy and footfall', enabled: true },
  { key: 'env', label: 'Enable for Environmental Monitoring', summary: 'Environmental Monitoring', hint: 'Monitor temperature, humidity, air quality and energy', enabled: true },
  { key: 'access', label: 'Enable for Access Control', summary: 'Access Control', hint: 'Manage doors, readers and access events', enabled: true },
  { key: 'visitor', label: 'Enable for Visitor Management', summary: 'Visitor Management', hint: 'Register and manage visitors and passes', enabled: false },
  { key: 'emergency', label: 'Enable for Emergency & Evacuation', summary: 'Emergency & Evacuation', hint: 'Emergency alerts, mustering and evacuation workflows', enabled: true },
  { key: 'integrations', label: 'Enable for Integrations (API/Webhooks)', summary: 'Integrations (API/Webhooks)', hint: 'Expose data to external systems through APIs and webhooks', enabled: true },
];

export const DEFAULT_NOTIFICATIONS = {
  recipients: ['Site Manager', 'Facility Engineer'],
  severities: ['Critical', 'High', 'Medium', 'Low'],
  channels: ['Email', 'SMS', 'In-App'],
};
