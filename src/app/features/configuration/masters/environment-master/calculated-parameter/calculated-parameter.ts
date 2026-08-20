import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, ENVIRONMENT_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';

interface CalculatedParameterRow {
  id: string;
  code: string;
  name: string;
  outputUnit: string;
  environmentCategory: string;
  inputParameters: string;
  formula: string;
  formulaType: string;
  calculationFrequency: string;
  aggregationMethod: string;
  minimumValidInputs: number;
  validityCondition: string;
  description: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-calculated-parameter',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './calculated-parameter.html',
  styleUrl: './calculated-parameter.css',
})
export class CalculatedParameter {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Environment Master', children: ENVIRONMENT_MASTER_DROPDOWN },
    { label: 'Calculated Parameter' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Parameter Code' },
    { key: 'name', label: 'Parameter Name' },
    { key: 'outputUnit', label: 'Output Unit' },
    { key: 'environmentCategory', label: 'Environment Category' },
    { key: 'formulaType', label: 'Formula Type' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  rows: CalculatedParameterRow[] = [
    { id: 'CALC-001', code: 'HEAT-IDX', name: 'Heat Index', outputUnit: '°C', environmentCategory: 'Air Quality', inputParameters: 'Temperature, Humidity', formula: 'f(Temp, Humidity)', formulaType: 'Statistical', calculationFrequency: 'Every 5 min', aggregationMethod: 'Average', minimumValidInputs: 2, validityCondition: 'Temperature > 0 AND Humidity > 0', description: 'Perceived temperature combining heat and humidity', status: 'Active', displayOrder: 1 },
    { id: 'CALC-002', code: 'AQI', name: 'Air Quality Index', outputUnit: 'Index', environmentCategory: 'Air Quality', inputParameters: 'CO2, PM2.5', formula: 'AQI = max(CO2_Index, PM25_Index)', formulaType: 'Conditional', calculationFrequency: 'Hourly', aggregationMethod: 'Max', minimumValidInputs: 1, validityCondition: 'CO2 >= 0 OR PM25 >= 0', description: 'Composite air quality index', status: 'Active', displayOrder: 2 },
    { id: 'CALC-003', code: 'DEW-PT', name: 'Dew Point', outputUnit: '°C', environmentCategory: 'Air Quality', inputParameters: 'Temperature, Humidity', formula: 'Temp - ((100 - Humidity) / 5)', formulaType: 'Arithmetic', calculationFrequency: 'Every 5 min', aggregationMethod: 'Average', minimumValidInputs: 2, validityCondition: 'Humidity BETWEEN 0 AND 100', description: 'Temperature at which condensation occurs', status: 'Active', displayOrder: 3 },
    { id: 'CALC-004', code: 'COMFORT-IDX', name: 'Comfort Index', outputUnit: 'Index', environmentCategory: 'Air Quality', inputParameters: 'Temperature, Humidity, CO2', formula: 'weighted(Temp, Humidity, CO2)', formulaType: 'Statistical', calculationFrequency: 'Hourly', aggregationMethod: 'Average', minimumValidInputs: 3, validityCondition: 'All inputs present', description: 'Overall occupant comfort score', status: 'Active', displayOrder: 4 },
    { id: 'CALC-005', code: 'WQI', name: 'Water Quality Index', outputUnit: 'Index', environmentCategory: 'Water Quality', inputParameters: 'pH, Turbidity, Dissolved Oxygen', formula: 'weighted(pH, Turbidity, DO)', formulaType: 'Statistical', calculationFrequency: 'Daily', aggregationMethod: 'Average', minimumValidInputs: 2, validityCondition: 'pH BETWEEN 0 AND 14', description: 'Composite water quality score', status: 'Inactive', displayOrder: 5 },
  ];

  environmentCategories = ['Air Quality', 'Water Quality', 'Noise', 'Energy', 'Waste'];
  formulaTypes = ['Arithmetic', 'Statistical', 'Conditional'];
  aggregationMethods = ['Average', 'Sum', 'Min', 'Max', 'Last'];

  popupOpen = false;
  editingRow: CalculatedParameterRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      outputUnit: [''],
      environmentCategory: ['', Validators.required],
      inputParameters: [''],
      formula: ['', Validators.required],
      formulaType: ['Arithmetic', Validators.required],
      calculationFrequency: [''],
      aggregationMethod: ['Average'],
      minimumValidInputs: [1],
      validityCondition: [''],
      description: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ formulaType: 'Arithmetic', aggregationMethod: 'Average', minimumValidInputs: 1, status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: CalculatedParameterRow): void {
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
      this.rows.push({ id: `CALC-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: CalculatedParameterRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
