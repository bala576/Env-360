import { Injectable } from '@angular/core';

export interface EnvironmentCategoryRow {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultParameterGroups: string;
  defaultSensorTypes: string;
  defaultDashboardTemplate: string;
  defaultComplianceStandard: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

const INITIAL_ROWS: EnvironmentCategoryRow[] = [
  { id: 'CAT-001', code: 'AIR', name: 'Air Quality', description: 'Ambient and indoor air quality monitoring', icon: '', color: '#3b82f6', defaultParameterGroups: 'Air Pollutants, Climate', defaultSensorTypes: 'PM2.5, PM10, CO2, VOC', defaultDashboardTemplate: 'Air Quality Overview', defaultComplianceStandard: 'CPCB NAAQS', status: 'Active', displayOrder: 1 },
  { id: 'CAT-002', code: 'WATER', name: 'Water Quality', description: 'Surface and ground water quality monitoring', icon: '', color: '#0ea5e9', defaultParameterGroups: 'Water Quality', defaultSensorTypes: 'pH, Turbidity, Dissolved Oxygen', defaultDashboardTemplate: 'Water Quality Overview', defaultComplianceStandard: 'CPCB Water Standards', status: 'Active', displayOrder: 2 },
  { id: 'CAT-003', code: 'NOISE', name: 'Noise', description: 'Ambient noise level monitoring', icon: '', color: '#f97316', defaultParameterGroups: 'Acoustics', defaultSensorTypes: 'Sound Level Meter', defaultDashboardTemplate: 'Noise Levels Overview', defaultComplianceStandard: 'CPCB Noise Rules', status: 'Active', displayOrder: 3 },
  { id: 'CAT-004', code: 'ENERGY', name: 'Energy', description: 'Energy consumption and efficiency monitoring', icon: '', color: '#eab308', defaultParameterGroups: 'Power, Consumption', defaultSensorTypes: 'Energy Meter, Current Sensor', defaultDashboardTemplate: 'Energy Consumption Overview', defaultComplianceStandard: 'ISO 50001', status: 'Active', displayOrder: 4 },
  { id: 'CAT-005', code: 'WASTE', name: 'Waste', description: 'Waste generation and disposal monitoring', icon: '', color: '#6b7280', defaultParameterGroups: 'Waste Volume', defaultSensorTypes: 'Level Sensor, Weight Sensor', defaultDashboardTemplate: 'Waste Management Overview', defaultComplianceStandard: 'Solid Waste Management Rules', status: 'Inactive', displayOrder: 5 },
];

@Injectable({ providedIn: 'root' })
export class CategoriesStore {

  rows: EnvironmentCategoryRow[] = INITIAL_ROWS;

  getById(id: string): EnvironmentCategoryRow | undefined {
    return this.rows.find(r => r.id === id);
  }

  getByName(name: string): EnvironmentCategoryRow | undefined {
    return this.rows.find(r => r.name === name);
  }

  add(row: EnvironmentCategoryRow): void {
    this.rows.push(row);
  }

  update(id: string, patch: Partial<EnvironmentCategoryRow>): void {
    const row = this.getById(id);
    if (row) Object.assign(row, patch);
  }

  delete(row: EnvironmentCategoryRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  nextId(): string {
    return `CAT-${String(this.rows.length + 1).padStart(3, '0')}`;
  }
}
