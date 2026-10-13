// Static mock data for the Automation & Control page. Replace with API calls when available.

export type Priority = 'High' | 'Medium' | 'Low';

export interface AutomationKpi {
  label: string;
  value: number;
  icon: string;
  tone: string;
  // Either a status breakdown or a trend line
  breakdown?: { label: string; value: number; color: string }[];
  trend?: { change: string; note: string };
}

export interface Rule {
  id: number;
  name: string;
  icon: string;
  color: string;
  trigger: string[];
  action: string[];
  appliesTo: string;
  enabled: boolean;
  priority: Priority;
  lastTriggered: [string, string];
  spaceType: string;
  ruleType: string;
  description: string;
  path: string;
  createdBy: string;
  createdOn: string;
  modifiedOn: string;
}

export interface ControlDevice {
  key: string;
  label: string;
  icon: string;
  tone: string;
  // on/off devices
  on?: boolean;
  onLabel?: string;
  offLabel?: string;
  onAction?: string;
  offAction?: string;
}

export interface RecentAction {
  time: string;
  action: string;
  by: string;
  status: 'Success' | 'Failed';
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const AUTOMATION_ICONS: Record<string, string[]> = {
  rules: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
  play: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M10 8.5v7l5.5-3.5z'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  scenes: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  calendar: ['M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z', 'M4 10h16M8 3v4M16 3v4', 'M8 14h2M12 14h2M16 14h.01M8 17h2'],
  plus: ['M12 5v14M5 12h14'],
  chevron: ['M6 9l6 6 6-6'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M21 21l-4.3-4.3'],
  more: ['M5 12h.01M12 12h.01M19 12h.01'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  refresh: ['M20 11a8 8 0 10-2.3 5.7', 'M20 4v7h-7'],
  thermometer: ['M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z', 'M12 17.5a.5.5 0 100 1 .5.5 0 000-1z'],
  door: ['M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17', 'M3 21h18', 'M15 12h.01'],
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  fan: ['M12 12a2 2 0 100-.01', 'M12 10c0-4 1-7 4-7s3 4-4 7', 'M14 12c4 0 7 1 7 4s-4 3-7-4', 'M12 14c0 4-1 7-4 7s-3-4 4-7', 'M10 12c-4 0-7-1-7-4s4-3 7 4'],
  parking: ['M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z', 'M9 17V7h4a3 3 0 010 6H9'],
  server: ['M5 3h14v6H5zM5 9h14v6H5zM5 15h14v6H5z', 'M8 6h.01M8 12h.01M8 18h.01'],
  leaf: ['M5 19c0-9 6-14 15-14 0 9-5 15-14 15', 'M5 19l7-7'],
  wind: ['M3 8h11a3 3 0 10-3-3', 'M3 12h16a3 3 0 11-3 3', 'M3 16h7'],
  drop: ['M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z'],
  display: ['M3 4h18v12H3z', 'M8 20h8M12 16v4'],
  snow: ['M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7', 'M9 4l3 2 3-2M9 20l3-2 3 2'],
  lock: ['M6 11h12v10H6z', 'M8 11V7a4 4 0 018 0v4', 'M12 15v2'],
  siren: ['M6 18v-6a6 6 0 0112 0v6', 'M4 18h16v3H4z', 'M12 2v2M4.2 5.2l1.4 1.4M19.8 5.2l-1.4 1.4'],
  bulb: ['M9 18h6M10 21h4', 'M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z'],
};

export const AUTOMATION_TABS = ['Overview', 'Rules', 'Scenes', 'Schedules', 'Manual Control', 'Control Groups', 'History'];
export const RULE_DETAIL_TABS = ['Overview', 'Conditions', 'Actions', 'Schedule', 'History'];

export const AUTOMATION_KPIS: AutomationKpi[] = [
  {
    label: 'Total Rules', value: 86, icon: 'rules', tone: 'purple',
    breakdown: [{ label: 'Active', value: 62, color: '#16a34a' }, { label: 'Inactive', value: 18, color: '#f59e0b' }, { label: 'Error', value: 6, color: '#ef4444' }],
  },
  { label: 'Triggered Today', value: 124, icon: 'play', tone: 'green', trend: { change: '18%', note: 'vs yesterday' } },
  { label: 'Control Actions', value: 96, icon: 'bolt', tone: 'orange', trend: { change: '12%', note: 'vs yesterday' } },
  {
    label: 'Scenes', value: 14, icon: 'scenes', tone: 'blue',
    breakdown: [{ label: 'Active', value: 8, color: '#16a34a' }, { label: 'Inactive', value: 6, color: '#9ca3af' }],
  },
  {
    label: 'Schedules', value: 22, icon: 'calendar', tone: 'red',
    breakdown: [{ label: 'Active', value: 16, color: '#16a34a' }, { label: 'Inactive', value: 6, color: '#9ca3af' }],
  },
];

type SeedRule = Pick<Rule, 'name' | 'icon' | 'color' | 'trigger' | 'action' | 'appliesTo' | 'enabled' | 'priority' | 'lastTriggered' | 'spaceType' | 'ruleType' | 'description' | 'path'>;

const SEED_RULES: SeedRule[] = [
  { name: 'Cold Room High Temperature', icon: 'thermometer', color: '#dc2626', trigger: ['Temperature > -15 °C', 'for 5 minutes'], action: ['Turn ON Cooling', 'Send Alert'], appliesTo: 'Cold Room 01', enabled: true, priority: 'High', lastTriggered: ['21 May 2025', '10:24'], spaceType: 'Cold Room', ruleType: 'Threshold', description: 'Automatically activate cooling and send an alert when temperature in cold room exceeds -15 °C for 5 minutes.', path: 'Dubai Mall > Building A > Level 1' },
  { name: 'Cold Room Door Open', icon: 'door', color: '#1d4ed8', trigger: ['Door Open > 2 minutes'], action: ['Send Alert', 'Turn ON Alarm'], appliesTo: 'Cold Room 01', enabled: true, priority: 'High', lastTriggered: ['21 May 2025', '09:18'], spaceType: 'Cold Room', ruleType: 'Event', description: 'Raise an alarm when the cold room door stays open longer than 2 minutes.', path: 'Dubai Mall > Building A > Level 1' },
  { name: 'Meeting Room Auto Control', icon: 'people', color: '#1d4ed8', trigger: ['Occupancy > 0'], action: ['Turn ON Lights', 'Set AC to 22 °C'], appliesTo: 'Meeting Room 3', enabled: true, priority: 'Medium', lastTriggered: ['21 May 2025', '08:55'], spaceType: 'Meeting Room', ruleType: 'Occupancy', description: 'Switch on lights and comfort cooling as soon as someone enters the meeting room.', path: 'Dubai Mall > Building A > Level 2' },
  { name: 'Meeting Room Vacancy', icon: 'people', color: '#1d4ed8', trigger: ['No Occupancy', 'for 15 minutes'], action: ['Turn OFF Lights', 'Set AC to 26 °C'], appliesTo: 'Meeting Room 3', enabled: true, priority: 'Medium', lastTriggered: ['20 May 2025', '17:42'], spaceType: 'Meeting Room', ruleType: 'Occupancy', description: 'Save energy by dimming lights and raising the set point when the room is empty for 15 minutes.', path: 'Dubai Mall > Building A > Level 2' },
  { name: 'Restroom Ventilation', icon: 'fan', color: '#1d4ed8', trigger: ['Occupancy > 3', 'or VOC > 500 ppm'], action: ['Turn ON Exhaust Fan'], appliesTo: 'Restroom - West', enabled: true, priority: 'Medium', lastTriggered: ['21 May 2025', '11:10'], spaceType: 'Restroom', ruleType: 'Threshold', description: 'Boost ventilation when the restroom is busy or air quality drops.', path: 'Dubai Mall > Building A > Level 1' },
  { name: 'Parking Lighting Control', icon: 'parking', color: '#1d4ed8', trigger: ['Occupancy > 10%'], action: ['Turn ON Lights'], appliesTo: 'Parking - Zone A', enabled: true, priority: 'Low', lastTriggered: ['21 May 2025', '07:30'], spaceType: 'Parking', ruleType: 'Occupancy', description: 'Light parking zones only when vehicles are present.', path: 'Dubai Mall > Parking Building > B1' },
  { name: 'Server Room Temperature', icon: 'server', color: '#1d4ed8', trigger: ['Temperature > 28 °C'], action: ['Turn ON AC', 'Send Alert'], appliesTo: 'Server Room 1', enabled: true, priority: 'High', lastTriggered: ['21 May 2025', '06:15'], spaceType: 'IT Room', ruleType: 'Threshold', description: 'Protect IT equipment by starting backup cooling above 28 °C.', path: 'Dubai Mall > Building B > Basement 1' },
  { name: 'Energy Demand Response', icon: 'bolt', color: '#f59e0b', trigger: ['Energy > 500 kW'], action: ['Turn OFF Non-Essential', 'Loads'], appliesTo: 'Main DB', enabled: false, priority: 'Medium', lastTriggered: ['19 May 2025', '14:22'], spaceType: 'Service Room', ruleType: 'Threshold', description: 'Shed non-essential loads during peak demand to stay under the contracted limit.', path: 'Dubai Mall > Service Building > Ground Floor' },
  { name: 'Irrigation Control', icon: 'leaf', color: '#16a34a', trigger: ['Soil Moisture < 30%'], action: ['Turn ON Irrigation', 'for 20 minutes'], appliesTo: 'Landscape Zone 1', enabled: true, priority: 'Low', lastTriggered: ['21 May 2025', '05:40'], spaceType: 'Landscape', ruleType: 'Threshold', description: 'Water landscape zones only when the soil is dry.', path: 'Dubai Mall > Landscape' },
  { name: 'CO₂ Ventilation', icon: 'wind', color: '#2563eb', trigger: ['CO₂ > 1,000 ppm'], action: ['Increase Fresh Air', 'Set Fan Speed High'], appliesTo: 'Office Area - L1', enabled: true, priority: 'Medium', lastTriggered: ['21 May 2025', '12:05'], spaceType: 'Office', ruleType: 'Threshold', description: 'Increase fresh air intake when CO₂ builds up in the office.', path: 'Dubai Mall > Building A > Level 1' },
  { name: 'Water Tank Auto Fill', icon: 'drop', color: '#2563eb', trigger: ['Level < 20%'], action: ['Turn ON Inlet Valve'], appliesTo: 'Water Tank 01', enabled: true, priority: 'High', lastTriggered: ['21 May 2025', '03:20'], spaceType: 'Utility', ruleType: 'Threshold', description: 'Refill the rooftop tank automatically when it runs low.', path: 'Dubai Mall > Building A > Roof' },
  { name: 'Digital Display Update', icon: 'display', color: '#1d4ed8', trigger: ['Parking Occupancy > 80%'], action: ['Update Display Content'], appliesTo: 'Parking - Zone A', enabled: true, priority: 'Low', lastTriggered: ['21 May 2025', '11:35'], spaceType: 'Parking', ruleType: 'Event', description: 'Show "Zone nearly full" guidance on parking displays.', path: 'Dubai Mall > Parking Building > B1' },
];

function buildRules(total: number): Rule[] {
  return Array.from({ length: total }, (_, i) => {
    const seed = SEED_RULES[i % SEED_RULES.length];
    const round = Math.floor(i / SEED_RULES.length);
    return {
      ...seed,
      id: i + 1,
      name: round === 0 ? seed.name : `${seed.name} ${round + 1}`,
      // Spread the inactive count across later copies
      enabled: round === 0 ? seed.enabled : (i * 7) % 5 !== 0,
      createdBy: 'Admin User',
      createdOn: '10 May 2025 14:22',
      modifiedOn: '18 May 2025 11:35',
    };
  });
}

export const RULES: Rule[] = buildRules(86);

export const CONTROL_ZONES = ['Cold Room 01', 'Meeting Room 3', 'Server Room 1'];

export const CONTROL_DEVICES: ControlDevice[] = [
  { key: 'cooling', label: 'Cooling System', icon: 'snow', tone: 'blue', on: true, onLabel: 'ON', offLabel: 'OFF', onAction: 'Turn Off', offAction: 'Turn On' },
  { key: 'door', label: 'Door Lock', icon: 'lock', tone: 'blue', on: true, onLabel: 'Locked', offLabel: 'Unlocked', onAction: 'Unlock', offAction: 'Lock' },
  { key: 'siren', label: 'Alarm Siren', icon: 'siren', tone: 'red', on: false, onLabel: 'ON', offLabel: 'OFF', onAction: 'Turn Off', offAction: 'Turn On' },
  { key: 'fan', label: 'Ventilation Fan', icon: 'fan', tone: 'blue', on: true, onLabel: 'ON', offLabel: 'OFF', onAction: 'Turn Off', offAction: 'Turn On' },
  { key: 'light', label: 'Light', icon: 'bulb', tone: 'green', on: true, onLabel: 'ON', offLabel: 'OFF', onAction: 'Turn Off', offAction: 'Turn On' },
];

export const RECENT_ACTIONS: RecentAction[] = [
  { time: '21 May 2025 10:24', action: 'Cooling System ON', by: 'Rule Triggered', status: 'Success' },
  { time: '21 May 2025 10:24', action: 'Alert Notification Sent', by: 'Rule Triggered', status: 'Success' },
  { time: '21 May 2025 08:12', action: 'Cooling System OFF', by: 'Manual (User)', status: 'Success' },
  { time: '20 May 2025 22:18', action: 'Temperature Set to -18 °C', by: 'Schedule', status: 'Success' },
];
