import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, GENERAL_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';
import { SeverityStore, SeverityRow } from './severity-store';

@Component({
  selector: 'app-severity',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './severity.html',
  styleUrl: './severity.css',
})
export class Severity implements OnInit {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'General Master', children: GENERAL_MASTER_DROPDOWN },
    { label: 'Severity' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Severity Code' },
    { key: 'name', label: 'Severity Name' },
    { key: 'priority', label: 'Priority' },
    { key: 'slaMinutes', label: 'SLA Minutes' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  get rows(): SeverityRow[] {
    return this.store.rows;
  }

  popupOpen = false;
  editingRow: SeverityRow | null = null;
  form: FormGroup;
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private store: SeverityStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      priority: [1, Validators.required],
      description: [''],
      color: ['#7030a0'],
      icon: [''],
      acknowledgementRequired: [false],
      escalationRequired: [false],
      slaMinutes: [0],
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
    this.form.reset({ priority: this.rows.length + 1, color: '#7030a0', acknowledgementRequired: false, escalationRequired: false, slaMinutes: 0, status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: SeverityRow): void {
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

  deleteRow(row: SeverityRow): void {
    this.store.delete(row);
  }
}
