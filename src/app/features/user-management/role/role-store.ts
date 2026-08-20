import { Injectable } from '@angular/core';

export interface RoleAccessEntry {
  module: string;
  view: boolean;
  edit: boolean;
}

export interface RoleRow {
  id: string;
  roleName: string;
  description: string;
  accessPermission: string;
  clientId: string;
  hierarchyIds: string[];
  access: RoleAccessEntry[];
}

const INITIAL_ROWS: RoleRow[] = [
  { id: 'ADMIN', roleName: 'Administrator', description: 'Full administrative access to all modules', accessPermission: 'Full Access', clientId: 'ENV360-HQ', hierarchyIds: [], access: [] },
  { id: 'FAC_MGR', roleName: 'Facility Manager', description: 'Manages devices, reports and events for assigned sites', accessPermission: 'Devices, Reports, Events', clientId: 'ENV360-HQ', hierarchyIds: [], access: [] },
  { id: 'SAFETY', roleName: 'Safety Officer', description: 'Monitors alerts and gas/safety devices, acknowledges events', accessPermission: 'Alerts, Events, Devices (Read)', clientId: 'ENV360-HQ', hierarchyIds: [], access: [] },
  { id: 'ANALYST', roleName: 'Environment Analyst', description: 'Analyzes environmental data and generates reports', accessPermission: 'Reports, Analytics (Read)', clientId: 'ENV360-HQ', hierarchyIds: [], access: [] },
  { id: 'VIEWER', roleName: 'Viewer', description: 'Read-only access to dashboards and reports', accessPermission: 'Read Only', clientId: 'ENV360-HQ', hierarchyIds: [], access: [] },
];

@Injectable({ providedIn: 'root' })
export class RoleStore {

  rows: RoleRow[] = INITIAL_ROWS;

  getById(id: string): RoleRow | undefined {
    return this.rows.find(r => r.id === id);
  }

  add(row: RoleRow): void {
    this.rows.push(row);
  }

  update(id: string, patch: Partial<RoleRow>): void {
    const row = this.getById(id);
    if (row) Object.assign(row, patch);
  }

  delete(row: RoleRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  generateId(roleName: string): string {
    const base = roleName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'ROLE';
    let id = base;
    let suffix = 1;
    while (this.getById(id)) {
      id = `${base}_${++suffix}`;
    }
    return id;
  }
}
