import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragScroll } from '../../shared/drag-scroll/drag-scroll';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  Battery,
  DEVICES,
  DEVICE_ICONS,
  DEVICE_KPIS,
  DEVICE_READINGS,
  DEVICE_TABS,
  Device,
  DeviceKind,
} from './devicesandsensor.data';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-devicesandsensor',
  imports: [CommonModule, FormsModule, RouterModule, Dropdown, DragScroll],
  templateUrl: './devicesandsensor.html',
  styleUrl: './devicesandsensor.css',
})
export class Devicesandsensor {

  icons = DEVICE_ICONS;
  kpis = DEVICE_KPIS;
  tabs = DEVICE_TABS;
  readings = DEVICE_READINGS;

  // ---------- Header ----------
  addMenuOpen = false;

  // ---------- Table ----------
  private devices = DEVICES;
  activeTab: DeviceKind | 'all' = 'all';
  search = '';
  filterOpen = false;
  statusFilter = 'all';
  batteryFilter = 'all';
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' },
  ];
  batteryOptions: DropdownOption[] = [
    { label: 'Any Battery', value: 'all' },
    { label: 'Low (< 50%)', value: 'low' },
    { label: 'Mains Powered', value: 'mains' },
  ];
  page = 1;
  checked = new Set<string>();

  // ---------- Detail panel ----------
  selected: Device = this.devices[0];
  mapZoom = 1;

  get filterCount(): number {
    return (this.statusFilter !== 'all' ? 1 : 0) + (this.batteryFilter !== 'all' ? 1 : 0);
  }

  get filteredDevices(): Device[] {
    const query = this.search.trim().toLowerCase();
    return this.devices.filter(d =>
      (this.activeTab === 'all' || d.kind === this.activeTab) &&
      (this.statusFilter === 'all' || d.status === this.statusFilter) &&
      (this.batteryFilter === 'all' ||
        (this.batteryFilter === 'low' && typeof d.battery === 'number' && d.battery < 50) ||
        (this.batteryFilter === 'mains' && d.battery === null)) &&
      (!query ||
        d.name.toLowerCase().includes(query) ||
        d.serial.toLowerCase().includes(query) ||
        d.type.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query))
    );
  }

  get pagedDevices(): Device[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredDevices.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDevices.length / PAGE_SIZE));
  }

  get rangeStart(): number {
    return this.filteredDevices.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filteredDevices.length);
  }

  // Page numbers with null marking an ellipsis gap
  get pageList(): (number | null)[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, 2, 3, 4, 5, total, this.page - 1, this.page, this.page + 1]);
    const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
    const result: (number | null)[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
      result.push(p);
    });
    return result;
  }

  setTab(key: DeviceKind | 'all'): void {
    this.activeTab = key;
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.page = 1;
  }

  clearFilters(): void {
    this.statusFilter = 'all';
    this.batteryFilter = 'all';
    this.onFilterChange();
  }

  goToPage(page: number): void {
    this.page = Math.min(this.totalPages, Math.max(1, page));
  }

  toggleRow(device: Device): void {
    this.checked.has(device.serial) ? this.checked.delete(device.serial) : this.checked.add(device.serial);
  }

  get allPageChecked(): boolean {
    return this.pagedDevices.length > 0 && this.pagedDevices.every(d => this.checked.has(d.serial));
  }

  toggleAllPage(): void {
    const check = !this.allPageChecked;
    this.pagedDevices.forEach(d => (check ? this.checked.add(d.serial) : this.checked.delete(d.serial)));
  }

  // ---------- Detail panel ----------
  selectDevice(device: Device): void {
    this.selected = device;
    this.mapZoom = 1;
  }

  zoomMap(step: number): void {
    this.mapZoom = Math.min(2, Math.max(1, +(this.mapZoom + step * 0.25).toFixed(2)));
  }

  batteryLabel(battery: Battery): string {
    return typeof battery === 'number' ? `${battery}%` : battery === null ? 'Mains powered' : '-';
  }

  batteryLow(battery: Battery): boolean {
    return typeof battery === 'number' && battery < 50;
  }

  // Close the header and filter popovers when clicking elsewhere. composedPath()
  // is used because a dropdown option removes itself from the DOM on click.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const path = event.composedPath();
    const inside = (cls: string) => path.some(el => el instanceof Element && el.classList.contains(cls));
    if (this.addMenuOpen && !inside('add-split')) this.addMenuOpen = false;
    if (this.filterOpen && !inside('filter-wrap')) this.filterOpen = false;
  }
}
