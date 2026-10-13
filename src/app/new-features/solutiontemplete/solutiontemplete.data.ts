// Static content for the Solution Templates page. Replace with API calls when available.

export type SceneArt = 'retail' | 'office' | 'warehouse' | 'parking' | 'healthcare' | 'education' | 'industrial' | 'city' | 'custom';

export interface SolutionTemplate {
  key: string;
  name: string;
  icon: string;
  // Icon tile colours
  color: string;
  tint: string;
  industry: string;
  description: string;
  modules: string[];
  useCases: string[];
  technologies: string[];
  art: SceneArt;
  custom?: boolean;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const TPL_ICONS: Record<string, string[]> = {
  bag: ['M5 8h14l-1 12H6z', 'M9 8V6a3 3 0 016 0v2'],
  building: ['M5 21V5l7-2v18', 'M12 8h7v13', 'M8 8h.01M8 12h.01M8 16h.01M15 12h.01M15 16h.01', 'M3 21h18'],
  forklift: ['M4 17V8h6l3 5v4', 'M13 13h2V5', 'M15 17h6', 'M6 19a2 2 0 100-4 2 2 0 000 4zM12 19a2 2 0 100-4 2 2 0 000 4z'],
  parking: ['M4 4h16v16H4z', 'M9 17V7h4a3 3 0 010 6H9'],
  medical: ['M4 7h16v13H4z', 'M9 7V4h6v3', 'M12 10v7M8.5 13.5h7'],
  school: ['M2 9l10-5 10 5-10 5z', 'M6 11v5c3 2 9 2 12 0v-5', 'M22 9v6'],
  factory: ['M3 21V11l5 3V11l5 3V7l8 4v10z', 'M3 21h18'],
  city: ['M3 21V9h5v12', 'M8 21V4h7v17', 'M15 21v-9h6v9', 'M3 21h18'],
  plus: ['M12 5v14M5 12h14'],
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M20 20l-4-4'],
  pointer: ['M4 4l6 16 2-7 7-2z'],
  gear: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
  db: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z', 'M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6', 'M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6'],
  chart: ['M4 20V10M10 20V4M16 20v-8M22 20H2'],
  file: ['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 13h6M9 17h6'],
  upload: ['M7 18a4 4 0 01-.5-8 6 6 0 0111.5 1.5A3.5 3.5 0 0117.5 18z', 'M12 16v-6M9.5 12.5L12 10l2.5 2.5'],
  monitor: ['M3 5h18v11H3z', 'M8 20h8M12 16v4', 'M7 12l3-3 2 2 4-4'],
  close: ['M6 6l12 12M18 6L6 18'],
  check: ['M5 12l4 4 10-10'],
  star: ['M12 3l2.8 5.6 6.2.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.2-.9z'],
};

export const TPL_TABS = ['All Templates', 'By Industry', 'By Use Case', 'My Templates'];

export const TEMPLATES: SolutionTemplate[] = [
  {
    key: 'retail', name: 'Smart Retail', icon: 'bag', color: '#f59e0b', tint: '#fef3c7', industry: 'Retail', art: 'retail',
    description: 'People analytics, space utilization, digital displays and environment monitoring for retail stores.',
    modules: ['People Analytics', 'Space & Occupancy', 'Digital Displays'],
    useCases: ['Occupancy', 'Customer Experience'], technologies: ['People Counters', 'Digital Signage', 'IoT Sensors'],
  },
  {
    key: 'office', name: 'Smart Office', icon: 'building', color: '#2563eb', tint: '#dbeafe', industry: 'Commercial Real Estate', art: 'office',
    description: 'Workplace utilization, meeting room automation, indoor navigation and environment monitoring.',
    modules: ['Space & Occupancy', 'Room Automation', 'Indoor Navigation'],
    useCases: ['Occupancy', 'Energy Efficiency'], technologies: ['IoT Sensors', 'BMS', 'Access Control'],
  },
  {
    key: 'warehouse', name: 'Smart Warehouse', icon: 'forklift', color: '#f59e0b', tint: '#fef3c7', industry: 'Logistics', art: 'warehouse',
    description: 'Asset tracking, environment monitoring, safety and operational visibility.',
    modules: ['Asset Tracking', 'Environment Monitoring', 'Operations'],
    useCases: ['Asset Tracking', 'Safety'], technologies: ['RTLS', 'IoT Sensors'],
  },
  {
    key: 'parking', name: 'Smart Parking', icon: 'parking', color: '#0d9488', tint: '#ccfbf1', industry: 'Transportation', art: 'parking',
    description: 'Parking guidance, occupancy monitoring, ANPR integration and digital display.',
    modules: ['Parking Guidance', 'ANPR', 'Space Analytics'],
    useCases: ['Occupancy', 'Customer Experience'], technologies: ['ANPR Cameras', 'Bay Sensors', 'Digital Signage'],
  },
  {
    key: 'healthcare', name: 'Smart Healthcare', icon: 'medical', color: '#0d9488', tint: '#ccfbf1', industry: 'Healthcare', art: 'healthcare',
    description: 'People and asset tracking, patient safety, environment monitoring and staff workflows.',
    modules: ['Asset Tracking', 'Environment Monitoring', 'Staff & Patient Safety'],
    useCases: ['Asset Tracking', 'Safety'], technologies: ['RTLS', 'IoT Sensors', 'Access Control'],
  },
  {
    key: 'education', name: 'Smart Education', icon: 'school', color: '#7c3aed', tint: '#ede9fe', industry: 'Education', art: 'education',
    description: 'Campus safety, space utilization, asset tracking and smart displays.',
    modules: ['People Tracking', 'Space & Occupancy', 'Digital Displays'],
    useCases: ['Safety', 'Occupancy'], technologies: ['Access Control', 'Digital Signage', 'IoT Sensors'],
  },
  {
    key: 'industrial', name: 'Smart Industrial', icon: 'factory', color: '#2563eb', tint: '#dbeafe', industry: 'Manufacturing', art: 'industrial',
    description: 'Equipment monitoring, environment monitoring, safety and predictive maintenance.',
    modules: ['Environment Monitoring', 'Predictive Maintenance', 'Safety'],
    useCases: ['Predictive Maintenance', 'Safety', 'Energy Efficiency'], technologies: ['IoT Sensors', 'SCADA', 'BMS'],
  },
  {
    key: 'city', name: 'Smart City', icon: 'city', color: '#2563eb', tint: '#dbeafe', industry: 'Government', art: 'city',
    description: 'Public space monitoring, environment monitoring, smart parking and digital signage.',
    modules: ['Space & Occupancy', 'Environment Monitoring', 'Digital Displays'],
    useCases: ['Occupancy', 'Energy Efficiency', 'Safety'], technologies: ['IoT Sensors', 'ANPR Cameras', 'Digital Signage'],
  },
];

export const FEATURED = {
  name: 'Smart Mall',
  description: 'End-to-end solution for retail malls with people analytics, smart parking, digital displays and environment monitoring.',
  modules: ['People Analytics', 'Smart Parking', 'Digital Displays', 'Environment Monitoring'],
};

export const HOW_IT_WORKS = [
  { title: 'Choose a Template', sub: 'Select an industry-specific template', icon: 'pointer' },
  { title: 'Configure', sub: 'Customize settings, devices and integrations', icon: 'gear' },
  { title: 'Deploy', sub: 'Apply to one or multiple sites', icon: 'db' },
  { title: 'Monitor', sub: 'Start monitoring and get insights', icon: 'chart' },
];

export const QUICK_DEPLOY = [
  { title: 'Select Template', sub: 'Choose from pre-defined templates', icon: 'file' },
  { title: 'Configure', sub: 'Set parameters and integrations', icon: 'gear' },
  { title: 'Deploy', sub: 'Apply to sites', icon: 'upload' },
  { title: 'Go Live', sub: 'Start monitoring', icon: 'monitor' },
];

export const SITES = ['Dubai Mall', 'City Center (Deira)', 'Abu Dhabi Mall', 'Sharjah City Center', 'Ajman Mall'];

// Every module a custom template can include
export const ALL_MODULES = [
  'People Analytics', 'Space & Occupancy', 'Digital Displays', 'Environment Monitoring', 'Asset Tracking',
  'Smart Parking', 'Predictive Maintenance', 'Room Automation', 'Safety', 'Energy Management',
];

// Tag colours, by module name; anything else uses the default grey-violet
export const MODULE_TONES: Record<string, string> = {
  'People Analytics': 'violet',
  'Space & Occupancy': 'green',
  'Digital Displays': 'violet',
  'Room Automation': 'violet',
  'Indoor Navigation': 'violet',
  'Asset Tracking': 'green',
  'Environment Monitoring': 'green',
  'Operations': 'violet',
  'Parking Guidance': 'green',
  'ANPR': 'violet',
  'Space Analytics': 'green',
  'Staff & Patient Safety': 'violet',
  'People Tracking': 'green',
  'Predictive Maintenance': 'violet',
  'Safety': 'pink',
  'Smart Parking': 'violet',
};
