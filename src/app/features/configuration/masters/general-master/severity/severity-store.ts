import { Injectable } from '@angular/core';

export interface SeverityRow {
  id: string;
  code: string;
  name: string;
  priority: number;
  description: string;
  color: string;
  icon: string;
  acknowledgementRequired: boolean;
  escalationRequired: boolean;
  slaMinutes: number;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

const INITIAL_ROWS: SeverityRow[] = [
  { id: 'SEV-001', code: 'CRIT', name: 'Critical', priority: 1, description: 'Immediate action required', color: '#ef4444', icon: '', acknowledgementRequired: true, escalationRequired: true, slaMinutes: 15, status: 'Active', displayOrder: 1 },
  { id: 'SEV-002', code: 'MAJ', name: 'Major', priority: 2, description: 'Significant impact', color: '#f97316', icon: '', acknowledgementRequired: true, escalationRequired: true, slaMinutes: 60, status: 'Active', displayOrder: 2 },
  { id: 'SEV-003', code: 'MIN', name: 'Minor', priority: 3, description: 'Limited impact', color: '#eab308', icon: '', acknowledgementRequired: true, escalationRequired: false, slaMinutes: 240, status: 'Active', displayOrder: 3 },
  { id: 'SEV-004', code: 'WARN', name: 'Warning', priority: 4, description: 'Informational warning', color: '#3b82f6', icon: '', acknowledgementRequired: false, escalationRequired: false, slaMinutes: 0, status: 'Active', displayOrder: 4 },
  { id: 'SEV-005', code: 'INFO', name: 'Info', priority: 5, description: 'For information only', color: '#9ca3af', icon: '', acknowledgementRequired: false, escalationRequired: false, slaMinutes: 0, status: 'Inactive', displayOrder: 5 },
];

@Injectable({ providedIn: 'root' })
export class SeverityStore {

  rows: SeverityRow[] = INITIAL_ROWS;

  getById(id: string): SeverityRow | undefined {
    return this.rows.find(r => r.id === id);
  }

  getByName(name: string): SeverityRow | undefined {
    return this.rows.find(r => r.name === name);
  }

  add(row: SeverityRow): void {
    this.rows.push(row);
  }

  update(id: string, patch: Partial<SeverityRow>): void {
    const row = this.getById(id);
    if (row) Object.assign(row, patch);
  }

  delete(row: SeverityRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  nextId(): string {
    return `SEV-${String(this.rows.length + 1).padStart(3, '0')}`;
  }
}
