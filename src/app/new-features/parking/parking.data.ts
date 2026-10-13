// Static mock data for the Parking Management page. Replace with API calls when available.

export type BayStatus = 'available' | 'occupied' | 'reserved' | 'ev' | 'accessible';

export interface ParkingKpi {
  key: 'total' | 'occupied' | 'available' | 'visitors' | 'vip' | 'ev';
  label: string;
  icon: string;
  tone: string;
  bar?: string;
}

export interface Zone {
  code: string;
  name: string;
  occupied: number;
  capacity: number;
}

export interface AnprEvent {
  time: string;
  plate: string;
  type: 'Entry' | 'Exit';
  area: string;
  status: 'Allowed' | 'VIP' | 'Denied';
  color: string;
}

export interface Reservation {
  space: string;
  by: string;
  start: string;
  end: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const PARKING_ICONS: Record<string, string[]> = {
  car: ['M5 17h14v-5l-2-5H7l-2 5z', 'M5 12h14', 'M7.5 17v2M16.5 17v2', 'M8 14.5h.01M16 14.5h.01'],
  carFront: ['M6 10l1.5-4h9L18 10', 'M4 10h16v6H4z', 'M6 16v2M18 16v2', 'M7 13h.01M17 13h.01'],
  people: ['M9 7a3 3 0 100 6 3 3 0 000-6z', 'M3 20a6 6 0 0112 0', 'M16 4a3 3 0 010 6', 'M17 14a5 5 0 014 6'],
  vip: ['M12 4a3 3 0 100 6 3 3 0 000-6z', 'M5 20a7 7 0 0114 0', 'M9 15l3 2 3-2'],
  plug: ['M9 3v5M15 3v5', 'M6 8h12v3a6 6 0 01-12 0z', 'M12 17v4'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  expand: ['M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'],
  close: ['M6 6l12 12M18 6L6 18'],
};

export const PARKING_TABS = ['Overview', 'Live Map', 'Parking Areas', 'Occupancy', 'ANPR', 'Reservations', 'Violations', 'EV Charging', 'Reports'];

export const TOTAL_SPACES = 2450;
export const INITIAL_OCCUPIED = 1842;
export const VISITORS = 420;
export const VIP_RESERVED = 120;
export const EV = { used: 68, total: 80 };
export const ACCESSIBLE = 24;
export const TOTAL_CHANGE = 3;

export const PARKING_KPIS: ParkingKpi[] = [
  { key: 'total', label: 'Total Parking Spaces', icon: 'car', tone: 'purple' },
  { key: 'occupied', label: 'Occupied', icon: 'car', tone: 'green', bar: '#16a34a' },
  { key: 'available', label: 'Available', icon: 'carFront', tone: 'blue', bar: '#3b82f6' },
  { key: 'visitors', label: 'Visitors', icon: 'people', tone: 'amber', bar: '#f59e0b' },
  { key: 'vip', label: 'VIP / Reserved', icon: 'vip', tone: 'purple', bar: '#8b5cf6' },
  { key: 'ev', label: 'EV Charging', icon: 'plug', tone: 'green', bar: '#16a34a' },
];

export const BAY_META: Record<BayStatus, { label: string; color: string }> = {
  available: { label: 'Available', color: '#22c55e' },
  occupied: { label: 'Occupied', color: '#ef4444' },
  reserved: { label: 'Reserved', color: '#2563eb' },
  ev: { label: 'EV Charging', color: '#f59e0b' },
  accessible: { label: 'Accessible', color: '#7c3aed' },
};

export const BAY_ORDER: BayStatus[] = ['available', 'occupied', 'reserved', 'ev', 'accessible'];

export const ZONES: Zone[] = [
  { code: 'P1', name: 'Retail', occupied: 420, capacity: 520 },
  { code: 'P2', name: 'Fashion', occupied: 380, capacity: 500 },
  { code: 'P3', name: 'Cinema', occupied: 310, capacity: 480 },
  { code: 'P4', name: 'Food Court', occupied: 260, capacity: 420 },
  { code: 'P5', name: 'VIP', occupied: 75, capacity: 120 },
  { code: 'P6', name: 'Office', occupied: 180, capacity: 280 },
  { code: 'P7', name: 'EV Charging', occupied: 68, capacity: 80 },
];

// Occupancy (%) every hour, for today (up to 22:00) and yesterday
export const OCCUPANCY_TODAY = [26, 24, 22, 21, 22, 25, 31, 38, 47, 55, 61, 66, 70, 74, 76, 78, 77, 75, 73, 74, 72, 70, 71];
export const OCCUPANCY_YESTERDAY = [28, 25, 23, 22, 23, 27, 33, 41, 50, 58, 63, 68, 72, 75, 79, 81, 80, 78, 76, 75, 72, 66, 58, 44];

export const ANPR_EVENTS: AnprEvent[] = [
  { time: '21 May 10:24', plate: 'D 12345', type: 'Entry', area: 'P1 - Retail', status: 'Allowed', color: '#64748b' },
  { time: '21 May 10:22', plate: 'A 67890', type: 'Exit', area: 'P2 - Fashion', status: 'Allowed', color: '#e2e8f0' },
  { time: '21 May 10:20', plate: 'K 54321', type: 'Entry', area: 'P3 - Cinema', status: 'Allowed', color: '#334155' },
  { time: '21 May 10:18', plate: 'Z 98765', type: 'Exit', area: 'P1 - Retail', status: 'Allowed', color: '#94a3b8' },
  { time: '21 May 10:16', plate: 'B 11223', type: 'Entry', area: 'P4 - Food Court', status: 'VIP', color: '#f8fafc' },
  { time: '21 May 10:14', plate: 'M 44556', type: 'Entry', area: 'P7 - EV Charging', status: 'Allowed', color: '#cbd5e1' },
  { time: '21 May 10:11', plate: 'J 77001', type: 'Entry', area: 'P6 - Office', status: 'Denied', color: '#1e293b' },
  { time: '21 May 10:09', plate: 'C 30418', type: 'Exit', area: 'P3 - Cinema', status: 'Allowed', color: '#b91c1c' },
];

export const RESERVATIONS: Reservation[] = [
  { space: 'P1-012', by: 'Visitor', start: '21 May 10:00', end: '21 May 12:00', status: 'Active' },
  { space: 'P5-003', by: 'Corporate', start: '21 May 09:00', end: '21 May 18:00', status: 'Active' },
  { space: 'P5-010', by: 'VIP', start: '21 May 10:00', end: '21 May 14:00', status: 'Active' },
  { space: 'P3-045', by: 'Visitor', start: '21 May 11:00', end: '21 May 13:00', status: 'Upcoming' },
  { space: 'P6-102', by: 'Employee', start: '21 May 08:00', end: '21 May 17:00', status: 'Active' },
  { space: 'P1-088', by: 'Visitor', start: '21 May 14:00', end: '21 May 16:00', status: 'Upcoming' },
  { space: 'P2-031', by: 'Visitor', start: '21 May 07:30', end: '21 May 09:30', status: 'Completed' },
];

// ---------- Parking analytics ----------
export const ANALYTICS_TABS = ['Vehicle Count', 'Dwell Time', 'Peak Hours', 'User Type'];
export const USER_TYPES = [
  { label: 'Visitors', color: '#8b5cf6' },
  { label: 'Employees', color: '#2563eb' },
  { label: 'VIP', color: '#fbbf24' },
  { label: 'Others', color: '#a8a8b8' },
];

// Daily vehicles per user type for the last 14 days ending 21 May
export const ANALYTICS_END = new Date(2025, 4, 21);
export const VEHICLE_DAILY: number[][] = [
  [1300, 520, 160, 120], [1420, 560, 170, 140], [1250, 500, 150, 110], [1500, 610, 180, 150],
  [1620, 640, 200, 160], [1880, 520, 240, 190], [1950, 480, 260, 200],
  [1200, 520, 170, 150], [1280, 560, 200, 170], [1360, 610, 230, 190], [1700, 640, 260, 210],
  [1820, 660, 290, 230], [1760, 700, 300, 240], [2050, 720, 330, 260],
];
// Average dwell time in minutes for the same days
export const DWELL_DAILY = [96, 102, 94, 110, 118, 142, 150, 98, 104, 108, 121, 128, 125, 139];
// Average vehicles entering per hour of the day (06:00 - 23:00)
export const PEAK_HOURS = [40, 85, 160, 210, 240, 260, 300, 340, 310, 280, 290, 330, 380, 420, 360, 260, 170, 90];
