import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ReportRow {
  id: string;
  name: string;
  timeRange: string;
  expireOn: string;
  recurrence: 'Monthly' | 'Weekly' | 'Daily' | 'Once';
  createdOn: string;
  type: string;
  shareWith: string;
  generatedOn: string;
  status: 'Completed' | 'Pending';
}

@Component({
  selector: 'app-report-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './report-list.html',
  styleUrl: './report-list.css',
})
export class ReportList {

  frequencies: ReportRow['recurrence'][] = ['Monthly', 'Weekly', 'Daily', 'Once'];
  selectedFrequency: ReportRow['recurrence'] = 'Once';

  searchTerm = '';

  rows: ReportRow[] = [
    {
      id: 'RPT-001', name: 'Device Health Report', timeRange: '1 - Month', expireOn: '2027-07-01',
      recurrence: 'Once', createdOn: '2026-05-01', type: 'URL', shareWith: 'support4@purpleiq.ai',
      generatedOn: '2026-05-01', status: 'Completed',
    },
    {
      id: 'RPT-002', name: 'Alarm Summary Report', timeRange: '1 - Month', expireOn: '2027-07-01',
      recurrence: 'Once', createdOn: '2026-05-01', type: 'URL', shareWith: 'support4@purpleiq.ai',
      generatedOn: '2026-05-01', status: 'Completed',
    },
    {
      id: 'RPT-003', name: 'Air Quality Report', timeRange: '1 - Month', expireOn: '2027-07-01',
      recurrence: 'Once', createdOn: '2026-05-01', type: 'URL', shareWith: 'support4@purpleiq.ai',
      generatedOn: '2026-05-01', status: 'Completed',
    },
    {
      id: 'RPT-004', name: 'Water Quality Report', timeRange: '1 - Month', expireOn: '2027-07-01',
      recurrence: 'Once', createdOn: '2026-05-01', type: 'URL', shareWith: 'support4@purpleiq.ai',
      generatedOn: '2026-05-01', status: 'Pending',
    },
  ];

  constructor(private router: Router) {}

  get filteredRows(): ReportRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.rows
      .filter(r => r.recurrence === this.selectedFrequency)
      .filter(r => !term || r.name.toLowerCase().includes(term) || r.shareWith.toLowerCase().includes(term));
  }

  openAdd(): void {
    this.router.navigate(['/report/generate']);
  }

  onRefresh(): void {
    this.searchTerm = '';
  }

  downloadRows(): void {
    const headers = ['SI NO', 'Reports', 'Time Range', 'Expire On', 'Recurrence', 'Created On', 'Type', 'Share With', 'Generated On', 'Status'];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const lines = [
      headers.map(escape).join(','),
      ...this.filteredRows.map((row, i) => [
        i + 1, row.name, row.timeRange, row.expireOn, row.recurrence, row.createdOn, row.type, row.shareWith, row.generatedOn, row.status,
      ].map(escape).join(',')),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reports.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadRow(row: ReportRow): void {
    const blob = new Blob([JSON.stringify(row, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${row.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  deleteAllFiltered(): void {
    const ids = new Set(this.filteredRows.map(r => r.id));
    this.rows = this.rows.filter(r => !ids.has(r.id));
  }

  deleteRow(row: ReportRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
