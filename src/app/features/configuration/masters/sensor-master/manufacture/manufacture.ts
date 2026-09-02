import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, SENSOR_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';
import { ManufactureStore, ManufacturerRow } from './manufacture-store';

@Component({
  selector: 'app-manufacture',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './manufacture.html',
  styleUrl: './manufacture.css',
})
export class Manufacture implements OnInit {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Sensor Master', children: SENSOR_MASTER_DROPDOWN },
    { label: 'Manufacture' },
  ];

  manufacturerTypes = ['OEM', 'Sensor Manufacturer', 'Device Integrator', 'Third Party'];

  columns: TableColumn[] = [
    { key: 'code', label: 'Manufacturer Code' },
    { key: 'name', label: 'Manufacturer Name' },
    { key: 'manufacturerType', label: 'Manufacturer Type' },
    { key: 'country', label: 'Country' },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  get rows(): ManufacturerRow[] {
    return this.store.rows;
  }

  popupOpen = false;
  editingRow: ManufacturerRow | null = null;
  form: FormGroup;
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private store: ManufactureStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      manufacturerType: ['', Validators.required],
      country: [''],
      website: [''],
      supportEmail: ['', Validators.email],
      supportPhone: [''],
      address: [''],
      contactPerson: [''],
      logo: [''],
      description: [''],
      status: ['Active', Validators.required],
      displayOrder: [this.rows.length + 1],
    });
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.returnUrl = params.get('returnUrl') || '';
    const action = params.get('action');

    if (action === 'add') {
      this.openAdd();
    } else if (action === 'edit') {
      const name = params.get('value');
      const row = name ? this.store.getByName(name) : undefined;
      if (row) this.openEdit(row);
    }
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset({ status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: ManufacturerRow): void {
    this.editingRow = row;
    this.form.reset(row);
    this.popupOpen = true;
  }

  closePopup(): void {
    this.popupOpen = false;
    this.editingRow = null;
  }

  cancel(): void {
    this.closePopup();
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.editingRow) {
      this.store.update(this.editingRow.id, value);
    } else {
      this.store.add({ id: this.store.nextId(), ...value });
    }

    this.closePopup();
  }

  deleteRow(row: ManufacturerRow): void {
    this.store.delete(row);
  }
}
