import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type RuleType = 'Standard' | 'Advanced';
type RuleStatus = 'Pending' | 'Completed' | 'Failed';

interface RuleRow {
  id: string;
  ruleName: string;
  type: RuleType;
  lastActivated: string;
  createdOn: string;
  status: RuleStatus;
  editing: boolean;
  draftType: RuleType;
  draftStatus: RuleStatus;
}

@Component({
  selector: 'app-process-and-automation',
  imports: [CommonModule, FormsModule],
  templateUrl: './process-and-automation.html',
  styleUrl: './process-and-automation.css',
})
export class ProcessAndAutomation {

  typeOptions: RuleType[] = ['Standard', 'Advanced'];
  statusOptions: RuleStatus[] = ['Pending', 'Completed', 'Failed'];

  searchTerm = '';

  rows: RuleRow[] = [
    { id: 'RULE-001', ruleName: 'State One', type: 'Advanced', lastActivated: '2026-07-06', createdOn: '2026-05-01', status: 'Completed', editing: false, draftType: 'Advanced', draftStatus: 'Completed' },
    { id: 'RULE-002', ruleName: 'Zone Level Process', type: 'Standard', lastActivated: '2026-07-06', createdOn: '2026-05-01', status: 'Completed', editing: false, draftType: 'Standard', draftStatus: 'Completed' },
    { id: 'RULE-003', ruleName: 'Controller', type: 'Standard', lastActivated: '2026-07-06', createdOn: '2026-05-01', status: 'Pending', editing: false, draftType: 'Standard', draftStatus: 'Pending' },
    { id: 'RULE-004', ruleName: 'Operation 1', type: 'Standard', lastActivated: '2026-07-06', createdOn: '2026-07-06', status: 'Pending', editing: false, draftType: 'Standard', draftStatus: 'Pending' },
  ];

  constructor(private router: Router) {}

  get filteredRows(): RuleRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.rows;
    return this.rows.filter(r => r.ruleName.toLowerCase().includes(term));
  }

  addRule(): void {
    this.router.navigate(['/process-automation/create']);
  }

  onUploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const today = new Date().toISOString().slice(0, 10);
    this.rows.push({
      id: `RULE-${String(this.rows.length + 1).padStart(3, '0')}`,
      ruleName: file.name.replace(/\.[^/.]+$/, ''),
      type: 'Standard',
      lastActivated: today,
      createdOn: today,
      status: 'Pending',
      editing: false,
      draftType: 'Standard',
      draftStatus: 'Pending',
    });

    input.value = '';
  }

  downloadRows(): void {
    const headers = ['Rule Name', 'Type', 'Last Activated', 'Created On', 'Status'];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const lines = [
      headers.map(escape).join(','),
      ...this.filteredRows.map(row => [row.ruleName, row.type, row.lastActivated, row.createdOn, row.status].map(escape).join(',')),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'process-automation-rules.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  onRefresh(): void {
    this.searchTerm = '';
  }

  deleteAllFiltered(): void {
    const ids = new Set(this.filteredRows.map(r => r.id));
    this.rows = this.rows.filter(r => !ids.has(r.id));
  }

  startEdit(row: RuleRow): void {
    row.draftType = row.type;
    row.draftStatus = row.status;
    row.editing = true;
  }

  confirmEdit(row: RuleRow): void {
    row.type = row.draftType;
    row.status = row.draftStatus;
    row.editing = false;
  }

  cancelEdit(row: RuleRow): void {
    row.editing = false;
  }

  deleteRow(row: RuleRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
