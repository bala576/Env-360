import { Injectable } from '@angular/core';

export interface ManufacturerRow {
  id: string;
  code: string;
  name: string;
  manufacturerType: string;
  country: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  contactPerson: string;
  logo: string;
  description: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

const INITIAL_ROWS: ManufacturerRow[] = [
  {
    id: 'MFR-001',
    code: 'SENTECH',
    name: 'SenTech Industries',
    manufacturerType: 'Sensor Manufacturer',
    country: 'Germany',
    website: 'https://www.sentechindustries.com',
    supportEmail: 'support@sentechindustries.com',
    supportPhone: '+49 30 1234 5678',
    address: 'Industriestrasse 12, Munich, Germany',
    contactPerson: 'Hans Mueller',
    logo: 'https://cdn.example.com/logos/sentech.png',
    description: 'Manufacturer of precision environmental sensors.',
    status: 'Active',
    displayOrder: 1,
  },
  {
    id: 'MFR-002',
    code: 'ENVSENSE',
    name: 'EnviroSense Corp',
    manufacturerType: 'OEM',
    country: 'United States',
    website: 'https://www.envirosensecorp.com',
    supportEmail: 'help@envirosensecorp.com',
    supportPhone: '+1 415 555 0192',
    address: '450 Bayshore Blvd, San Francisco, CA, USA',
    contactPerson: 'Laura Chen',
    logo: 'https://cdn.example.com/logos/envirosense.png',
    description: 'OEM supplier of air quality and climate monitoring hardware.',
    status: 'Active',
    displayOrder: 2,
  },
  {
    id: 'MFR-003',
    code: 'GASGUARD',
    name: 'GasGuard Systems',
    manufacturerType: 'Sensor Manufacturer',
    country: 'United Kingdom',
    website: 'https://www.gasguardsystems.co.uk',
    supportEmail: 'support@gasguardsystems.co.uk',
    supportPhone: '+44 20 7946 0958',
    address: '18 Kings Road, London, UK',
    contactPerson: 'Oliver Brooks',
    logo: 'https://cdn.example.com/logos/gasguard.png',
    description: 'Specialist in confined-space gas detection sensors.',
    status: 'Active',
    displayOrder: 3,
  },
  {
    id: 'MFR-004',
    code: 'AQUAMET',
    name: 'AquaMetrics Ltd',
    manufacturerType: 'Device Integrator',
    country: 'India',
    website: 'https://www.aquametrics.in',
    supportEmail: 'support@aquametrics.in',
    supportPhone: '+91 80 4567 8901',
    address: 'Electronic City, Bengaluru, India',
    contactPerson: 'Priya Nair',
    logo: 'https://cdn.example.com/logos/aquametrics.png',
    description: 'Integrator of water quality monitoring devices.',
    status: 'Active',
    displayOrder: 4,
  },
  {
    id: 'MFR-005',
    code: 'CLIMATECH',
    name: 'ClimaTech Devices',
    manufacturerType: 'Third Party',
    country: 'Singapore',
    website: 'https://www.climatechdevices.com',
    supportEmail: 'contact@climatechdevices.com',
    supportPhone: '+65 6123 4567',
    address: '1 Marina Boulevard, Singapore',
    contactPerson: 'Wei Lim',
    logo: 'https://cdn.example.com/logos/climatech.png',
    description: 'Third-party reseller of climate control sensing equipment.',
    status: 'Inactive',
    displayOrder: 5,
  },
];

@Injectable({ providedIn: 'root' })
export class ManufactureStore {

  rows: ManufacturerRow[] = INITIAL_ROWS;

  getById(id: string): ManufacturerRow | undefined {
    return this.rows.find(r => r.id === id);
  }

  getByName(name: string): ManufacturerRow | undefined {
    return this.rows.find(r => r.name === name);
  }

  add(row: ManufacturerRow): void {
    this.rows.push(row);
  }

  update(id: string, patch: Partial<ManufacturerRow>): void {
    const row = this.getById(id);
    if (row) Object.assign(row, patch);
  }

  delete(row: ManufacturerRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  nextId(): string {
    return `MFR-${String(this.rows.length + 1).padStart(3, '0')}`;
  }
}
