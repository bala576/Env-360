// Static content for the Administration page. Replace with API calls when available.

export interface AdminStat {
  label: string;
  value: number;
  change: number;
  // Whether a rise is good (users) or bad (failed logins)
  goodWhenUp: boolean;
  icon: string;
  color: string;
  tint: string;
}

export interface AdminModule {
  name: string;
  description: string;
  icon: string;
  color: string;
  tint: string;
  // Existing screen this card opens; otherwise it switches to the matching tab
  route?: string;
  tab?: string;
}

export interface RoleShare {
  role: string;
  count: number;
  color: string;
}

export type UserStatus = 'Active' | 'Inactive';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  group: string;
  status: UserStatus;
  lastLogin: string;
}

export interface Activity {
  title: string;
  detail: string;
  time: string;
  icon: string;
  color: string;
  tint: string;
}

export interface SecuritySetting {
  name: string;
  icon: string;
  value: string;
  // Pill styling; plain text when absent
  tone?: 'good' | 'neutral';
  toggle?: boolean;
}

export interface LicenseUsage {
  product: string;
  used: number;
  total: number;
  color: string;
}

export interface ServiceStatus {
  name: string;
  online: boolean;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
export const ADMIN_ICONS: Record<string, string[]> = {
  user: ['M12 11a4 4 0 100-8 4 4 0 000 8z', 'M4 21a8 8 0 0116 0'],
  users: ['M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M2.5 20a6.5 6.5 0 0113 0', 'M16 4.5a3.5 3.5 0 010 6.5M18 14a6 6 0 013.5 6'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
  team: ['M12 10a3 3 0 100-6 3 3 0 000 6z', 'M6 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', 'M7 20a5 5 0 0110 0', 'M2 19a4 4 0 015-3.8M22 19a4 4 0 00-5-3.8'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 018 0v4', 'M12 15v2'],
  file: ['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 13h6M9 17h6'],
  clipboard: ['M7 4h10v17H7z', 'M9 3h6v3H9z', 'M10 11h4M10 15h4'],
  cloud: ['M7 18a4 4 0 01-.5-8 6 6 0 0111.5 1.5A3.5 3.5 0 0117.5 18z', 'M10 14l2-2 2 2M12 12v4'],
  alert: ['M12 3l10 18H2z', 'M12 10v4M12 17h.01'],
  gear: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1'],
  key: ['M8 15a4 4 0 100-8 4 4 0 000 8z', 'M11 11h10M17 11v3M20 11v2'],
  sso: ['M4 6h16v12H4z', 'M8 10h4M8 14h8'],
  clock: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v5l3 2'],
  globe: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M3 12h18', 'M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18'],
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M20 20l-4-4'],
  plus: ['M12 5v14M5 12h14'],
  dots: ['M5 12h.01M12 12h.01M19 12h.01'],
  close: ['M6 6l12 12M18 6L6 18'],
  chevron: ['M9 6l6 6-6 6'],
  left: ['M15 6l-6 6 6 6'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13'],
  toggle: ['M5 12a7 7 0 1014 0 7 7 0 00-14 0', 'M12 5v7'],
  reset: ['M4 4v6h6', 'M5 15a8 8 0 102-8.5L4 10'],
};

export const ADMIN_TABS = ['User Management', 'Access Control', 'Licensing', 'System Settings', 'Security', 'Audit Logs', 'Backup & Recovery', 'Tenant Management'];

export const ADMIN_STATS: AdminStat[] = [
  { label: 'Total Users', value: 86, change: 12, goodWhenUp: true, icon: 'user', color: '#6d28d9', tint: '#ede9fe' },
  { label: 'Active Users', value: 72, change: 8, goodWhenUp: true, icon: 'users', color: '#16a34a', tint: '#dcfce7' },
  { label: 'User Roles', value: 12, change: 0, goodWhenUp: true, icon: 'shield', color: '#2563eb', tint: '#dbeafe' },
  { label: 'User Groups', value: 18, change: 6, goodWhenUp: true, icon: 'team', color: '#ea580c', tint: '#ffedd5' },
  { label: 'Failed Login Attempts', value: 5, change: -50, goodWhenUp: false, icon: 'lock', color: '#dc2626', tint: '#fee2e2' },
];

export const ADMIN_MODULES: AdminModule[] = [
  { name: 'User Management', description: 'Create and manage users, groups and profiles', icon: 'users', color: '#6d28d9', tint: '#ede9fe', route: '/user' },
  { name: 'Roles & Permissions', description: 'Define roles and granular access control', icon: 'shield', color: '#6d28d9', tint: '#ede9fe', route: '/role' },
  { name: 'License Management', description: 'View, assign and monitor licenses', icon: 'file', color: '#2563eb', tint: '#dbeafe', route: '/licence-management' },
  { name: 'Security Settings', description: 'Password policies, SSO, MFA and session control', icon: 'lock', color: '#d97706', tint: '#fef3c7', tab: 'Security' },
  { name: 'Audit Logs', description: 'Track user activities and system changes', icon: 'clipboard', color: '#2563eb', tint: '#dbeafe', tab: 'Audit Logs' },
  { name: 'Backup & Recovery', description: 'Manage backups and restore platform data', icon: 'cloud', color: '#6d28d9', tint: '#ede9fe', tab: 'Backup & Recovery' },
];

// Order and colours checked with the dataviz palette validator (no red/green neighbours)
export const ROLE_COLORS: Record<string, string> = {
  'Super Admin': '#6d28d9',
  'Facility Manager': '#16a34a',
  'Site Admin': '#3b82f6',
  'Security': '#dc2626',
  'Viewer': '#0891b2',
  'Maintenance': '#d97706',
};

export const ROLES = Object.keys(ROLE_COLORS);

const ROLE_COUNTS: Record<string, number> = {
  'Super Admin': 6,
  'Facility Manager': 16,
  'Site Admin': 18,
  'Security': 12,
  'Viewer': 20,
  'Maintenance': 14,
};

const ROLE_GROUP: Record<string, string> = {
  'Super Admin': 'Management',
  'Facility Manager': 'Operations',
  'Site Admin': 'Operations',
  'Security': 'Security',
  'Viewer': 'Management',
  'Maintenance': 'Maintenance',
};

export const GROUPS = ['Management', 'Operations', 'Maintenance', 'Security'];

const FIRST = ['Ahmed', 'Sarah', 'Ravi', 'Fatima', 'Omar', 'Layla', 'John', 'Priya', 'Khalid', 'Maria', 'Yusuf', 'Aisha', 'David', 'Noor', 'Arjun', 'Hessa', 'Michael', 'Zainab'];
const LAST = ['Al Mansoori', 'Johnson', 'Kumar', 'Ali', 'Hassan', 'Rahman', 'Smith', 'Nair', 'Al Hashimi', 'Garcia', 'Ibrahim', 'Khan', 'Brown', 'Saeed', 'Menon', 'Al Falasi'];

const pad = (n: number) => String(n).padStart(2, '0');

// The first five rows match the overview mock; the rest are generated deterministically
const SEED: Omit<AdminUser, 'id'>[] = [
  { name: 'Ahmed Al Mansoori', email: 'ahmed@dxbmall.ae', role: 'Site Admin', group: 'Operations', status: 'Active', lastLogin: '27 May 2025 10:45' },
  { name: 'Sarah Johnson', email: 'sarah@dxbmall.ae', role: 'Facility Manager', group: 'Operations', status: 'Active', lastLogin: '27 May 2025 09:12' },
  { name: 'Ravi Kumar', email: 'ravi@dxbmall.ae', role: 'Maintenance', group: 'Maintenance', status: 'Active', lastLogin: '26 May 2025 18:30' },
  { name: 'Fatima Ali', email: 'fatima@dxbmall.ae', role: 'Viewer', group: 'Management', status: 'Active', lastLogin: '26 May 2025 14:20' },
  { name: 'Omar Hassan', email: 'omar@dxbmall.ae', role: 'Security', group: 'Security', status: 'Inactive', lastLogin: '24 May 2025 11:08' },
];

function buildUsers(): AdminUser[] {
  const remaining = { ...ROLE_COUNTS };
  SEED.forEach(u => remaining[u.role]--);
  const roles = ROLES.flatMap(r => Array(remaining[r]).fill(r) as string[]);
  const generated = roles.map((role, i): Omit<AdminUser, 'id'> => {
    const first = FIRST[(i * 7 + 5) % FIRST.length];
    const last = LAST[(i * 5 + 3) % LAST.length];
    const day = 26 - (i % 20);
    return {
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.split(' ').pop()!.toLowerCase()}${i}@dxbmall.ae`,
      role,
      group: ROLE_GROUP[role],
      // 72 of 86 active, as in the stats
      status: i % 6 === 5 && i < 78 ? 'Inactive' : 'Active',
      lastLogin: `${pad(day)} May 2025 ${pad(8 + (i % 11))}:${pad((i * 13) % 60)}`,
    };
  });
  return [...SEED, ...generated].map((u, i) => ({ ...u, id: i + 1 }));
}

export const ADMIN_USERS: AdminUser[] = buildUsers();

export const ACTIVITIES: Activity[] = [
  { title: 'New user created', detail: 'Ravi Kumar was added to Maintenance group', time: '27 May 2025 10:45', icon: 'users', color: '#16a34a', tint: '#dcfce7' },
  { title: 'Role updated', detail: 'Sarah Johnson role changed to Facility Manager', time: '27 May 2025 09:12', icon: 'shield', color: '#2563eb', tint: '#dbeafe' },
  { title: 'Login failed', detail: 'Multiple failed login attempts for omar@dxbmall.ae', time: '26 May 2025 22:18', icon: 'alert', color: '#dc2626', tint: '#fee2e2' },
  { title: 'System setting changed', detail: 'Notification rule updated by Admin User', time: '26 May 2025 19:30', icon: 'gear', color: '#6d28d9', tint: '#ede9fe' },
  { title: 'License assigned', detail: 'Environment360 license assigned to Dubai Mall', time: '26 May 2025 16:20', icon: 'file', color: '#2563eb', tint: '#dbeafe' },
];

export const SECURITY_SETTINGS: SecuritySetting[] = [
  { name: 'Two-Factor Authentication (2FA)', icon: 'key', value: 'Enabled', tone: 'good', toggle: true },
  { name: 'Single Sign-On (SSO)', icon: 'sso', value: 'Enabled', tone: 'good', toggle: true },
  { name: 'Password Policy', icon: 'lock', value: 'Strong', tone: 'good' },
  { name: 'Session Timeout', icon: 'clock', value: '30 minutes' },
  { name: 'IP Whitelisting', icon: 'globe', value: 'Configured', tone: 'good' },
];

export const LICENSES: LicenseUsage[] = [
  { product: 'People360', used: 72, total: 100, color: '#4f46e5' },
  { product: 'Asset360', used: 48, total: 75, color: '#0d9488' },
  { product: 'Environment360', used: 120, total: 200, color: '#6d28d9' },
];

export const SERVICES: ServiceStatus[] = [
  { name: 'Application Server', online: true },
  { name: 'Database', online: true },
  { name: 'IoT Data Ingestion', online: true },
  { name: 'API Services', online: true },
  { name: 'Backup Service', online: true },
];
