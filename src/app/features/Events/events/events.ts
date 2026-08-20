import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GenericTable, TableColumn } from '../../../shared/generic-table/generic-table';

interface EventRow {
  timeStamp: string;
  category: string;
  description: string;
  deviceName: string;
  deviceId: string;
  timeRaised: string;
  hostName: string;
  deviceMac: string;
  clientMac: string;
}

@Component({
  selector: 'app-events',
  imports: [CommonModule, GenericTable],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {

  columns: TableColumn[] = [
    { key: 'timeStamp', label: 'Time Stamp' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'deviceName', label: 'Device Name' },
    { key: 'deviceId', label: 'Device ID' },
    { key: 'timeRaised', label: 'Time Raised' },
    { key: 'hostName', label: 'Host Name' },
    { key: 'deviceMac', label: 'Device MAC' },
    { key: 'clientMac', label: 'Client MAC' },
  ];

  rows: EventRow[] = [
    {
      timeStamp: '2026-08-18 09:42:11', category: 'Critical', description: 'H2S concentration exceeded threshold',
      deviceName: 'Manhole Gas Sensor - MH-14', deviceId: 'DEV-002', timeRaised: '2026-08-18 09:42:05',
      hostName: 'GW-BLR-N1', deviceMac: '86:61:23:45:67:89', clientMac: '00:14:22:01:23:45',
    },
    {
      timeStamp: '2026-08-18 09:15:33', category: 'Warning', description: 'Battery level below 20%',
      deviceName: 'Water Quality Buoy - Reservoir 1', deviceId: 'DEV-003', timeRaised: '2026-08-18 09:15:30',
      hostName: 'GW-BLR-L1', deviceMac: '86:62:23:45:67:89', clientMac: '00:14:22:01:24:11',
    },
    {
      timeStamp: '2026-08-18 08:58:02', category: 'Info', description: 'Firmware updated successfully',
      deviceName: 'IAQ Sensor - Building A Floor 2', deviceId: 'DEV-001', timeRaised: '2026-08-18 08:57:50',
      hostName: 'GW-BLR-A1', deviceMac: '00:14:22:01:23:45', clientMac: '00:14:22:01:23:46',
    },
    {
      timeStamp: '2026-08-18 08:40:19', category: 'Major', description: 'Device went offline unexpectedly',
      deviceName: 'Rooftop Weather Station', deviceId: 'DEV-004', timeRaised: '2026-08-18 08:40:10',
      hostName: '-', deviceMac: '86:63:23:45:67:89', clientMac: '00:14:22:01:25:22',
    },
    {
      timeStamp: '2026-08-18 07:55:47', category: 'Info', description: 'Scheduled maintenance completed',
      deviceName: 'Cold Storage Sensor - Warehouse 2', deviceId: 'DEV-005', timeRaised: '2026-08-18 07:55:40',
      hostName: 'GW-PUN-A1', deviceMac: '86:64:23:45:67:89', clientMac: '00:14:22:01:26:33',
    },
  ];

  downloadCsv(rows: EventRow[]): void {
    const headers = this.columns.map(c => c.label);
    const keys = this.columns.map(c => c.key as keyof EventRow);
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const lines = [
      headers.map(escape).join(','),
      ...rows.map(row => keys.map(key => escape(row[key])).join(',')),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'events.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
