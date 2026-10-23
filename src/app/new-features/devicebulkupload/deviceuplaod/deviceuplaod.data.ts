import { DropdownOption } from '../../../shared/dropdown/dropdown';

export type StepId = 1 | 2 | 3 | 4;
export type FieldType = 'Text' | 'Dropdown';
export type RuleKind = 'input' | 'select' | 'none';
export type RecordStatus = 'valid' | 'invalid' | 'duplicate';

export interface UploadStep {
  id: StepId;
  title: string;
  subtitle: string;
}

export interface TargetField {
  value: string;
  label: string;
  type: FieldType;
  mandatory?: boolean;
}

export interface ColumnMapping {
  column: string;
  sample: string;
  field: string | null;
  required: boolean;
  ruleKind: RuleKind;
  rule: string;
  ruleOptions?: DropdownOption[];
}

export interface ImportRecord {
  index: number;
  name: string;
  type: string;
  model: string;
  serial: string;
  assetTag: string;
  location: string;
  status: RecordStatus;
  message: string;
}

export interface UploadedFile {
  name: string;
  sizeKb: number;
  rows: number;
}

export const UPLOAD_STEPS: UploadStep[] = [
  { id: 1, title: 'Upload File', subtitle: 'Upload and validate' },
  { id: 2, title: 'Map Columns', subtitle: 'Map spreadsheet columns' },
  { id: 3, title: 'Preview & Validate', subtitle: 'Review data and fix issues' },
  { id: 4, title: 'Import', subtitle: 'Complete the upload' },
];

export const DEMO_FILE: UploadedFile = { name: 'devices_bulk_upload.xlsx', sizeKb: 12, rows: 156 };

export const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const TARGET_FIELDS: TargetField[] = [
  { value: 'name', label: 'Device Name', type: 'Text', mandatory: true },
  { value: 'type', label: 'Device Type', type: 'Dropdown', mandatory: true },
  { value: 'model', label: 'Model', type: 'Text' },
  { value: 'manufacturer', label: 'Manufacturer', type: 'Dropdown' },
  { value: 'serial', label: 'Serial Number', type: 'Text', mandatory: true },
  { value: 'assetTag', label: 'Asset Tag', type: 'Text' },
  { value: 'category', label: 'Category', type: 'Dropdown' },
  { value: 'site', label: 'Site', type: 'Dropdown', mandatory: true },
  { value: 'building', label: 'Building', type: 'Dropdown' },
  { value: 'floor', label: 'Floor', type: 'Dropdown' },
  { value: 'space', label: 'Space', type: 'Dropdown' },
  { value: 'tags', label: 'Tags (Comma/Semicolon separated)', type: 'Text' },
];

export const FIELD_OPTIONS: DropdownOption[] = [
  { label: 'Do not import', value: null },
  ...TARGET_FIELDS.map(f => ({ label: f.label, value: f.value })),
];

const MATCH_RULES: DropdownOption[] = [
  { label: 'Match by name', value: 'Match by name' },
  { label: 'Match by name (case-insensitive)', value: 'Match by name (case-insensitive)' },
  { label: 'Match by code', value: 'Match by code' },
];

const SPLIT_RULES: DropdownOption[] = [
  { label: 'Split by , or ;', value: 'Split by , or ;' },
  { label: 'Split by ,', value: 'Split by ,' },
  { label: 'Split by ;', value: 'Split by ;' },
];

export const SAVED_MAPPINGS: DropdownOption[] = [
  { label: 'Default Mapping', value: 'default' },
  { label: 'Last Used Mapping', value: 'last' },
];

export function defaultMappings(): ColumnMapping[] {
  return [
    { column: 'device_name', sample: 'TEMP-RT-001, WL-CH-015, AQ-OF-102', field: 'name', required: true, ruleKind: 'input', rule: '' },
    { column: 'device_type', sample: 'Temperature Sensor, Water Leak Sensor, Air Quality Sensor', field: 'type', required: true, ruleKind: 'select', rule: 'Match by name (case-insensitive)', ruleOptions: MATCH_RULES },
    { column: 'model', sample: 'EM300-TH, EM320-WS, EM500-AQ', field: 'model', required: false, ruleKind: 'none', rule: '' },
    { column: 'manufacturer', sample: 'Milesight, Milesight, Milesight', field: 'manufacturer', required: true, ruleKind: 'select', rule: 'Match by name', ruleOptions: MATCH_RULES },
    { column: 'serial_number', sample: 'SN-4589210001, SN-4589210002, SN-4589210003', field: 'serial', required: true, ruleKind: 'none', rule: '' },
    { column: 'asset_tag', sample: 'ENV-TH-001, ENV-WS-002, ENV-AQ-003', field: 'assetTag', required: false, ruleKind: 'none', rule: '' },
    { column: 'category', sample: 'Environmental Sensor, Environmental Sensor, Environmental Sensor', field: 'category', required: true, ruleKind: 'select', rule: 'Match by name', ruleOptions: MATCH_RULES },
    { column: 'location_site', sample: 'Dubai Mall, Dubai Mall, Dubai Mall', field: 'site', required: true, ruleKind: 'select', rule: 'Match by name', ruleOptions: MATCH_RULES },
    { column: 'location_building', sample: 'Main Building, Main Building, Main Building', field: 'building', required: false, ruleKind: 'none', rule: '' },
    { column: 'location_floor', sample: 'Level 1, Level 1, Level 1', field: 'floor', required: false, ruleKind: 'none', rule: '' },
    { column: 'location_space', sample: 'Server Room 1, Server Room 2, Office 101', field: 'space', required: false, ruleKind: 'none', rule: '' },
    { column: 'tags', sample: 'Server Room;Temperature, Water;Leak Detection', field: 'tags', required: false, ruleKind: 'select', rule: 'Split by , or ;', ruleOptions: SPLIT_RULES },
  ];
}

export const FILE_REQUIREMENTS = [
  'Use the provided template format',
  'First row should contain column headers',
  'Maximum 5,000 records per file',
  'Supported formats: .xlsx, .xls, .csv',
  'File size up to 10 MB',
];

export const TEMPLATE_COLUMNS = [
  { name: 'device_name', description: 'Unique device name', required: true },
  { name: 'device_type', description: 'Type of device/sensor', required: true },
  { name: 'model', description: 'Device model', required: false },
  { name: 'manufacturer', description: 'Manufacturer name', required: false },
  { name: 'serial_number', description: 'Serial number', required: true },
  { name: 'asset_tag', description: 'Asset tag (optional)', required: false },
  { name: 'category', description: 'Device category', required: true },
  { name: 'location_site', description: 'Site name', required: true },
  { name: 'location_building', description: 'Building name', required: false },
  { name: 'location_floor', description: 'Floor name', required: false },
  { name: 'location_space', description: 'Space / room name', required: false },
  { name: 'tags', description: 'Tags, separated by , or ;', required: false },
];

export const OVERVIEW_ROWS = 5;

export const MAPPING_TIPS = [
  'Map each spreadsheet column to the correct Environment360 field.',
  'Required fields must be mapped.',
  'You can save this mapping for future uploads.',
];

export const RECORD_FILTERS: DropdownOption[] = [
  { label: 'All Records', value: 'all' },
  { label: 'Records with Issues', value: 'issues' },
  { label: 'Selected Records', value: 'selected' },
];

export const STATUS_FILTERS: DropdownOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Valid', value: 'valid' },
  { label: 'Invalid', value: 'invalid' },
  { label: 'Duplicate', value: 'duplicate' },
];

export const PAGE_SIZES: DropdownOption[] = [10, 25, 50, 100].map(n => ({ label: String(n), value: n }));

export const VALIDATION_RULES = [
  { title: 'Required fields', detail: 'Device name, device type, serial number, asset tag and site must have a value.' },
  { title: 'Unique serial number', detail: 'A serial number can appear only once in the file and must not already exist in Environment360.' },
  { title: 'Known device type', detail: 'Device type must match an existing type (case-insensitive).' },
  { title: 'Valid location', detail: 'Site, building and space must exist in the selected site hierarchy.' },
  { title: 'Model format', detail: 'Model must be an existing model for the chosen manufacturer.' },
];

// The first rows mirror the sample file; the rest are generated to fill out the 156-row demo
const SAMPLE_RECORDS: Omit<ImportRecord, 'index'>[] = [
  { name: 'TEMP-RT-001', type: 'Temperature Sensor', model: 'EM300-TH', serial: 'MS20250521001', assetTag: 'ENV-TH-001', location: 'Dubai Mall > Main Building > Server Room 1', status: 'valid', message: '' },
  { name: 'WL-CH-015', type: 'Water Leak Sensor', model: 'EM500-WL', serial: 'MS20250521002', assetTag: 'ENV-WL-015', location: 'Dubai Mall > Main Building > Level 1', status: 'valid', message: '' },
  { name: 'AQ-OF-102', type: 'Air Quality Sensor', model: 'EM500-AQ', serial: 'MS20250521003', assetTag: 'ENV-AQ-102', location: 'Dubai Mall > Main Building > Office 101', status: 'valid', message: '' },
  { name: 'PK-SLOT-028', type: 'Parking Sensor', model: 'EM400-P', serial: 'MS20250521004', assetTag: 'ENV-PK-028', location: 'Dubai Mall > Car Park > Zone A', status: 'valid', message: '' },
  { name: 'CS-TEMP-006', type: 'Temperature Sensor', model: 'EM320-TH', serial: '', assetTag: 'ENV-TH-006', location: 'Dubai Mall > Cold Storage > Room 1', status: 'invalid', message: 'Serial number is required' },
  { name: 'WS-AG-011', type: 'Soil Moisture Sensor', model: 'EM500-SM', serial: 'MS20250521006', assetTag: 'ENV-SM-011', location: 'Dubai Mall > Greenhouse > Zone 2', status: 'valid', message: '' },
  { name: 'RMC-CTRL-003', type: 'Room Controller', model: 'EM300-R', serial: 'MS20250521007', assetTag: 'ENV-RM-003', location: 'Dubai Mall > Main Building > Meeting Room 3', status: 'valid', message: '' },
  { name: 'AQ-OF-103', type: 'Air Quality Sensor', model: 'EM300-AQ', serial: 'MS20250521008', assetTag: 'ENV-AQ-103', location: 'Dubai Mall > Main Building > Office 102', status: 'duplicate', message: 'Duplicate serial number' },
  { name: 'TEMP-RT-002', type: 'Temperature Sensor', model: 'EM300-TH', serial: 'MS20250521009', assetTag: 'ENV-TH-002', location: 'Dubai Mall > Main Building > Server Room 2', status: 'duplicate', message: 'Serial number already exists' },
  { name: 'DOOR-001', type: 'Door Sensor', model: 'EM500-ZLD', serial: 'MS20250521010', assetTag: 'ENV-DR-001', location: 'Dubai Mall > Main Building > Fire Exit', status: 'valid', message: '' },
  { name: 'WL-CH-016', type: 'Water Leak Sensor', model: 'EM500-WL', serial: '', assetTag: 'ENV-WL-016', location: 'Dubai Mall > Main Building > Level 2', status: 'invalid', message: 'Serial number is required' },
  { name: 'AQ-OF-104', type: 'Air Quality Sensor', model: 'EM500-TH', serial: 'MS20250521012', assetTag: 'ENV-AQ-104', location: 'Dubai Mall > Main Building > Office 104', status: 'valid', message: '' },
  { name: 'TEMP-RT-003', type: 'Temperature Sensor', model: 'EM300-TH', serial: 'MS20250521013', assetTag: '', location: 'Dubai Mall > Main Building > Server Room 3', status: 'invalid', message: 'Asset tag is required' },
  { name: 'WL-CH-017', type: 'Water Leak Sensor', model: 'EM500-WL', serial: 'MS20250521014', assetTag: 'ENV-WL-017', location: 'Dubai Mall > Main Building > Level 3', status: 'valid', message: '' },
  { name: 'AQ-OF-105', type: 'Air Quality Sensor', model: 'EM500-AQ', serial: 'MS20250521015', assetTag: 'ENV-AQ-105', location: 'Dubai Mall > Main Building > Office 105', status: 'valid', message: '' },
];

const GENERATED_KINDS = [
  { prefix: 'TEMP-RT', type: 'Temperature Sensor', model: 'EM300-TH', tag: 'TH', place: 'Server Room' },
  { prefix: 'WL-CH', type: 'Water Leak Sensor', model: 'EM500-WL', tag: 'WL', place: 'Level' },
  { prefix: 'AQ-OF', type: 'Air Quality Sensor', model: 'EM500-AQ', tag: 'AQ', place: 'Office' },
  { prefix: 'PK-SLOT', type: 'Parking Sensor', model: 'EM400-P', tag: 'PK', place: 'Zone' },
  { prefix: 'DOOR', type: 'Door Sensor', model: 'EM500-ZLD', tag: 'DR', place: 'Exit' },
  { prefix: 'OCC-LB', type: 'Occupancy Sensor', model: 'VS121', tag: 'OC', place: 'Lobby' },
];

const GENERATED_ISSUES = ['Serial number is required', 'Asset tag is required', 'Unknown device type', 'Space not found in site hierarchy', 'Model not found for manufacturer'];

// Rows (by index) that fail validation beyond the sample rows: 9 more invalid for 12 in total
const GENERATED_INVALID = new Set([23, 37, 48, 61, 79, 94, 112, 128, 147]);

export function buildRecords(total = DEMO_FILE.rows): ImportRecord[] {
  const records: ImportRecord[] = SAMPLE_RECORDS.map((r, i) => ({ ...r, index: i + 1 }));
  for (let index = records.length + 1; index <= total; index++) {
    const kind = GENERATED_KINDS[index % GENERATED_KINDS.length];
    const seq = String(index + 20).padStart(3, '0');
    const building = kind.prefix === 'PK-SLOT' ? 'Car Park' : 'Main Building';
    const record: ImportRecord = {
      index,
      name: `${kind.prefix}-${seq}`,
      type: kind.type,
      model: kind.model,
      serial: `MS20250521${String(index).padStart(3, '0')}`,
      assetTag: `ENV-${kind.tag}-${seq}`,
      location: `Dubai Mall > ${building} > ${kind.place} ${(index % 9) + 1}`,
      status: 'valid',
      message: '',
    };
    if (GENERATED_INVALID.has(index)) {
      const issue = GENERATED_ISSUES[index % GENERATED_ISSUES.length];
      record.status = 'invalid';
      record.message = issue;
      if (issue.startsWith('Serial')) record.serial = '';
      if (issue.startsWith('Asset')) record.assetTag = '';
    }
    records.push(record);
  }
  return records;
}

export const UPLOAD_ICONS: Record<string, string[]> = {
  back: ['M19 12H5', 'M12 19l-7-7 7-7'],
  close: ['M18 6L6 18', 'M6 6l12 12'],
  check: ['M20 6L9 17l-5-5'],
  file: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8'],
  save: ['M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6', 'M10 11v6', 'M14 11v6'],
  info: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 16v-4', 'M12 8h.01'],
  arrow: ['M5 12h14', 'M12 5l7 7-7 7'],
  upload: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  download: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  alert: ['M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z', 'M12 9v4', 'M12 17h.01'],
  error: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M15 9l-6 6', 'M9 9l6 6'],
  search: ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.35-4.35'],
  more: ['M12 5h.01', 'M12 12h.01', 'M12 19h.01'],
  export: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  report: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M12 18v-6', 'M9 15l3 3 3-3'],
  sheet: ['M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M3 9h18', 'M3 15h18', 'M9 3v18'],
  cloud: ['M16 16l-4-4-4 4', 'M12 12v9', 'M20.4 18.4A5 5 0 0018 9h-1.3A8 8 0 103 16.3'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  plusCircle: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 8v8', 'M8 12h8'],
  refresh: ['M23 4v6h-6', 'M1 20v-6h6', 'M3.5 9a9 9 0 0114.9-3.4L23 10', 'M1 14l4.6 4.4A9 9 0 0020.5 15'],
};
