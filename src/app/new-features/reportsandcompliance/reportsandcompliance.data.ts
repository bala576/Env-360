// Static mock data for the Reports & Compliance page. Replace with API calls when available.

export type ComplianceState = 'Compliant' | 'Minor Issues' | 'Non-Compliant' | 'Not Assessed';
export type ExportFormat = 'PDF' | 'Excel' | 'CSV';

export interface ReportKpi {
  key: 'total' | 'score' | 'nonconformities' | 'audits' | 'due';
  label: string;
  icon: string;
  tone: string;
  color: string;
  change?: number;
  // Whether a rise in this figure is good news (drives the arrow colour)
  upIsGood?: boolean;
  foot: string;
  spark: number[];
}

export interface ReportCategory {
  name: string;
  count: number;
  color: string;
}

export interface TopReport {
  name: string;
  category: string;
  frequency: string;
  lastGenerated: string;
  icon: string;
  color: string;
}

export interface Requirement {
  standard: string;
  status: ComplianceState;
  lastAudit: string;
  nextDue: string;
}

export interface DueItem {
  title: string;
  authority: string;
  // Due date as YYYY-MM-DD
  due: string;
}

export interface ScheduledReport {
  name: string;
  frequency: string;
  recipients: string;
  nextRun: string;
  enabled: boolean;
}

export interface GeneratedReport {
  name: string;
  generatedOn: string;
  format: ExportFormat;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const REPORT_ICONS: Record<string, string[]> = {
  doc: ['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 12h7M9 16h7'],
  shield: ['M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  alert: ['M12 3l10 18H2z', 'M12 10v5', 'M12 18h.01'],
  clipboard: ['M8 4h8v3H8z', 'M6 5H5v16h14V5h-1', 'M9 12l2 2 4-4', 'M9 17h6'],
  clock: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v5l3 2'],
  plus: ['M12 5v14M5 12h14'],
  chevron: ['M6 9l6 6 6-6'],
  download: ['M12 4v12', 'M7 11l5 5 5-5', 'M4 20h16'],
  bolt: ['M13 3L5 14h6l-1 7 8-11h-6z'],
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  fan: ['M12 12a2 2 0 100-4 2 2 0 000 4z', 'M12 8c0-4 4-5 5-2s-3 4-5 4', 'M14 11c4 0 5 4 2 5s-4-3-4-5', 'M10 11c-4 0-5-4-2-5s4 3 4 5'],
  wrench: ['M15 5a4 4 0 00-5 5l-6 6 3 3 6-6a4 4 0 005-5l-2 2-3-1-1-3z'],
  check: ['M5 12l4 4 10-10'],
  file: ['M6 3h9l4 4v14H6z', 'M14 3v5h5'],
  calendar: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3v4M16 3v4'],
};

export const REPORT_TABS = ['Overview', 'Scheduled Reports', 'Compliance Dashboard', 'Regulatory Reports', 'Audit Trail', 'Data Export', 'Report Templates'];

// "Today" for due dates and generated timestamps
export const TODAY = new Date(2025, 4, 27);

export const KPIS: ReportKpi[] = [
  { key: 'total', label: 'Total Reports', icon: 'doc', tone: 'purple', color: '#7c3aed', change: 32, upIsGood: true, foot: 'vs last month', spark: [3, 4, 3, 5, 4, 6, 5, 7, 8, 10] },
  { key: 'score', label: 'Compliance Score', icon: 'shield', tone: 'green', color: '#16a34a', change: 4, upIsGood: true, foot: 'vs last month', spark: [5, 6, 5, 7, 6, 7, 8, 7, 9, 10] },
  { key: 'nonconformities', label: 'Open Non-Conformities', icon: 'alert', tone: 'red', color: '#ef4444', change: -40, upIsGood: false, foot: 'vs last month', spark: [10, 9, 8, 9, 7, 6, 7, 5, 6, 4] },
  { key: 'audits', label: 'Completed Audits', icon: 'clipboard', tone: 'blue', color: '#2563eb', change: 50, upIsGood: true, foot: 'vs last month', spark: [3, 4, 4, 5, 6, 5, 7, 8, 9, 10] },
  { key: 'due', label: 'Upcoming Due Items', icon: 'clock', tone: 'amber', color: '#f59e0b', foot: 'in next 30 days', spark: [4, 6, 5, 7, 6, 8, 7, 9, 8, 10] },
];

export const SITES = ['Dubai Mall', 'City Center (Deira)', 'Abu Dhabi Mall', 'Sharjah City Center', 'Ajman Mall'];
export const BUILDINGS = ['Main Mall', 'Fashion Avenue', 'Grand Parking'];
export const STANDARDS = ['ISO 50001', 'ISO 14001', 'ISO 45001', 'Civil Defence', 'Municipality', 'DEWA'];

// Reports generated per category over the last 30 days; longer ranges scale these
export const CATEGORIES: ReportCategory[] = [
  { name: 'Operations', count: 32, color: '#2563eb' },
  { name: 'Maintenance', count: 28, color: '#10b981' },
  { name: 'Energy & Sustainability', count: 20, color: '#f59e0b' },
  { name: 'Security & Safety', count: 18, color: '#ef4444' },
  { name: 'Space & Occupancy', count: 14, color: '#8b5cf6' },
  { name: 'Compliance', count: 12, color: '#6d28d9' },
];

// Audits closed in the last 30 days
export const AUDITS_COMPLETED = 18;

export const RANGE_SCALE: Record<number, number> = { 30: 1, 90: 2.8, 365: 11.4 };

// Requirement checks per standard, plus the overall score shown for it
export const COMPLIANCE_BY_STANDARD: Record<string, { score: number; counts: Record<ComplianceState, number> }> = {
  all: { score: 96, counts: { 'Compliant': 48, 'Minor Issues': 3, 'Non-Compliant': 3, 'Not Assessed': 2 } },
  'ISO 50001': { score: 98, counts: { 'Compliant': 10, 'Minor Issues': 1, 'Non-Compliant': 0, 'Not Assessed': 0 } },
  'ISO 14001': { score: 97, counts: { 'Compliant': 9, 'Minor Issues': 1, 'Non-Compliant': 0, 'Not Assessed': 1 } },
  'ISO 45001': { score: 92, counts: { 'Compliant': 7, 'Minor Issues': 2, 'Non-Compliant': 0, 'Not Assessed': 0 } },
  'Civil Defence': { score: 99, counts: { 'Compliant': 8, 'Minor Issues': 0, 'Non-Compliant': 0, 'Not Assessed': 0 } },
  'Municipality': { score: 88, counts: { 'Compliant': 6, 'Minor Issues': 1, 'Non-Compliant': 3, 'Not Assessed': 1 } },
  'DEWA': { score: 100, counts: { 'Compliant': 8, 'Minor Issues': 0, 'Non-Compliant': 0, 'Not Assessed': 0 } },
};

export const COMPLIANCE_COLORS: Record<ComplianceState, string> = {
  'Compliant': '#16a34a',
  'Minor Issues': '#f59e0b',
  'Non-Compliant': '#ef4444',
  'Not Assessed': '#9ca3af',
};

// Daily audits and issues found for the 14 days ending 27 May
export const AUDITS_DAILY = [9, 11, 10, 13, 12, 14, 11, 8, 12, 13, 13, 15, 13, 15];
export const ISSUES_DAILY = [2, 3, 1, 4, 2, 3, 2, 1, 3, 3, 2, 3, 3, 2];

export const TOP_REPORTS: TopReport[] = [
  { name: 'Energy Consumption Report', category: 'Energy', frequency: 'Daily', lastGenerated: '27 May 2025 08:00', icon: 'bolt', color: '#16a34a' },
  { name: 'Space Utilization Report', category: 'Occupancy', frequency: 'Weekly', lastGenerated: '26 May 2025 10:00', icon: 'grid', color: '#2563eb' },
  { name: 'HVAC Performance Report', category: 'Operations', frequency: 'Weekly', lastGenerated: '26 May 2025 09:00', icon: 'fan', color: '#2563eb' },
  { name: 'Maintenance Work Orders Report', category: 'Maintenance', frequency: 'Weekly', lastGenerated: '26 May 2025 09:00', icon: 'wrench', color: '#ef4444' },
  { name: 'Alarm & Event Report', category: 'Security', frequency: 'Daily', lastGenerated: '27 May 2025 08:15', icon: 'alert', color: '#ef4444' },
  { name: 'Compliance Summary Report', category: 'Compliance', frequency: 'Monthly', lastGenerated: '01 May 2025 09:00', icon: 'check', color: '#2563eb' },
];

export const REQUIREMENTS: Requirement[] = [
  { standard: 'ISO 50001 (Energy)', status: 'Compliant', lastAudit: '12 Mar 2025', nextDue: '12 Mar 2026' },
  { standard: 'ISO 14001 (Environment)', status: 'Compliant', lastAudit: '10 Apr 2025', nextDue: '10 Apr 2026' },
  { standard: 'ISO 45001 (Health & Safety)', status: 'Minor Issues', lastAudit: '15 May 2025', nextDue: '15 May 2026' },
  { standard: 'Civil Defence (Fire Safety)', status: 'Compliant', lastAudit: '20 Apr 2025', nextDue: '20 Oct 2025' },
  { standard: 'Municipality Regulations', status: 'Non-Compliant', lastAudit: '05 May 2025', nextDue: '05 Aug 2025' },
  { standard: 'Local Authority (DEWA)', status: 'Compliant', lastAudit: '18 Apr 2025', nextDue: '18 Apr 2026' },
];

export const DUE_ITEMS: DueItem[] = [
  { title: 'Fire Alarm System Inspection', authority: 'Civil Defence', due: '2025-05-25' },
  { title: 'Generator Load Test', authority: 'Municipality', due: '2025-06-03' },
  { title: 'Energy Audit Submission', authority: 'DEWA', due: '2025-06-08' },
  { title: 'Water Quality Report', authority: 'Environment Authority', due: '2025-06-14' },
  { title: 'Safety Equipment Inspection', authority: 'ISO 45001', due: '2025-06-22' },
];

export const SCHEDULED: ScheduledReport[] = [
  { name: 'Daily Operations Summary', frequency: 'Daily', recipients: 'Operations Team', nextRun: '28 May 2025 08:00', enabled: true },
  { name: 'Weekly Maintenance Report', frequency: 'Weekly', recipients: 'FM Team', nextRun: '02 Jun 2025 09:00', enabled: true },
  { name: 'Monthly Compliance Report', frequency: 'Monthly', recipients: 'Management', nextRun: '01 Jun 2025 09:00', enabled: true },
  { name: 'Energy & Sustainability Report', frequency: 'Monthly', recipients: 'Sustainability Team', nextRun: '01 Jun 2025 09:00', enabled: true },
];

export const EXPORT_TYPES = ['Alarm Events', 'Energy Readings', 'Occupancy Data', 'Maintenance Work Orders', 'Compliance Checks'];

export const GENERATED: GeneratedReport[] = [
  { name: 'Energy Consumption Report', generatedOn: '27 May 2025 08:00', format: 'PDF' },
  { name: 'Space Utilization Report', generatedOn: '26 May 2025 10:00', format: 'Excel' },
  { name: 'HVAC Performance Report', generatedOn: '26 May 2025 09:30', format: 'PDF' },
  { name: 'Compliance Summary Report', generatedOn: '26 May 2025 09:00', format: 'Excel' },
  { name: 'Alarm & Event Report', generatedOn: '25 May 2025 08:00', format: 'CSV' },
];
