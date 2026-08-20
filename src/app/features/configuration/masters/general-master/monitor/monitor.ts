import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface MonitoringPointTypeRow {
  id: string;
  code: string;
  name: string;
  environmentCategory: string;
  environmentType: string;
  description: string;
  icon: string;
  defaultParameterGroup: string;
  expectedSensorTypes: string;
  criticality: string;
  indoorOutdoor: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-monitor',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './monitor.html',
  styleUrl: './monitor.css',
})
export class Monitor {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Monitor' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Monitoring Point Type Code' },
    { key: 'name', label: 'Monitoring Point Type Name' },
    { key: 'environmentCategory', label: 'Environment Category' },
    { key: 'environmentType', label: 'Environment Type' },
    { key: 'criticality', label: 'Criticality' },
    { key: 'indoorOutdoor', label: 'Indoor / Outdoor' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: MonitoringPointTypeRow[] = [
    { id: 'MON-001', code: 'MPT-AIR', name: 'Ambient Air Monitoring', environmentCategory: 'Air Quality', environmentType: 'Indoor Air', description: 'Monitors indoor ambient air conditions', icon: '', defaultParameterGroup: 'Climate', expectedSensorTypes: 'Temperature, Humidity, CO2', criticality: 'High', indoorOutdoor: 'Indoor', status: 'Active', displayOrder: 1 },
    { id: 'MON-002', code: 'MPT-GAS', name: 'Manhole Gas Monitoring', environmentCategory: 'Gas', environmentType: 'Confined Space', description: 'Monitors hazardous gas levels in confined spaces', icon: '', defaultParameterGroup: 'Gas Safety', expectedSensorTypes: 'H2S, CH4, O2', criticality: 'Critical', indoorOutdoor: 'Outdoor', status: 'Active', displayOrder: 2 },
    { id: 'MON-003', code: 'MPT-COLD', name: 'Cold Storage Monitoring', environmentCategory: 'Climate', environmentType: 'Cold Chain', description: 'Monitors cold storage temperature and humidity', icon: '', defaultParameterGroup: 'Climate', expectedSensorTypes: 'Temperature, Humidity', criticality: 'High', indoorOutdoor: 'Indoor', status: 'Active', displayOrder: 3 },
    { id: 'MON-004', code: 'MPT-WATER', name: 'Water Quality Monitoring', environmentCategory: 'Water', environmentType: 'Water Quality', description: 'Monitors water quality parameters', icon: '', defaultParameterGroup: 'Water Quality', expectedSensorTypes: 'pH, Turbidity, Dissolved Oxygen', criticality: 'Medium', indoorOutdoor: 'Outdoor', status: 'Active', displayOrder: 4 },
    { id: 'MON-005', code: 'MPT-WEATHER', name: 'Outdoor Weather Station', environmentCategory: 'Weather', environmentType: 'Meteorological', description: 'Tracks outdoor weather conditions', icon: '', defaultParameterGroup: 'Weather', expectedSensorTypes: 'Wind Speed, Rainfall, Temperature', criticality: 'Low', indoorOutdoor: 'Outdoor', status: 'Inactive', displayOrder: 5 },
  ];

  environmentCategories = ['Air Quality', 'Gas', 'Climate', 'Water', 'Weather'];
  criticalityLevels = ['Low', 'Medium', 'High', 'Critical'];
  indoorOutdoorOptions = ['Indoor', 'Outdoor', 'Both'];

  popupOpen = false;
  editingRow: MonitoringPointTypeRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      environmentCategory: ['', Validators.required],
      environmentType: [''],
      description: [''],
      icon: [''],
      defaultParameterGroup: [''],
      expectedSensorTypes: [''],
      criticality: ['Medium', Validators.required],
      indoorOutdoor: ['Indoor', Validators.required],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ criticality: 'Medium', indoorOutdoor: 'Indoor', status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: MonitoringPointTypeRow): void {
    this.editingRow = row;
    this.form.reset(row);
    this.popupOpen = true;
  }

  closePopup(): void {
    this.popupOpen = false;
    this.editingRow = null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.editingRow) {
      Object.assign(this.editingRow, value);
    } else {
      this.rows.push({ id: `MON-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: MonitoringPointTypeRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
