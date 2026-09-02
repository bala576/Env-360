import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../../../shared/generic-popup/generic-popup';
import { FormToggle } from '../../../../../shared/form-toggle/form-toggle';
import { Breadcrumb, BreadcrumbItem } from '../../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN, ENVIRONMENT_MASTER_DROPDOWN } from '../../../../../shared/layout/sidebar/admin-nav.data';
import { CategoriesStore, EnvironmentCategoryRow } from './categories-store';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Environment Master', children: ENVIRONMENT_MASTER_DROPDOWN },
    { label: 'Categories' },
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Category Code' },
    { key: 'name', label: 'Category Name' },
    { key: 'defaultParameterGroups', label: 'Default Parameter Groups' },
    { key: 'defaultSensorTypes', label: 'Default Sensor Types' },
    { key: 'status', label: 'Status', type: 'toggle' },
    { key: 'displayOrder', label: 'Display Order' },
  ];

  get rows(): EnvironmentCategoryRow[] {
    return this.store.rows;
  }

  popupOpen = false;
  editingRow: EnvironmentCategoryRow | null = null;
  form: FormGroup;
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private store: CategoriesStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      icon: [''],
      color: ['#7030a0'],
      defaultParameterGroups: [''],
      defaultSensorTypes: [''],
      defaultDashboardTemplate: [''],
      defaultComplianceStandard: [''],
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
    this.form.reset({ color: '#7030a0', status: 'Active', displayOrder: this.rows.length + 1 });
    this.popupOpen = true;
  }

  openEdit(row: EnvironmentCategoryRow): void {
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

  deleteRow(row: EnvironmentCategoryRow): void {
    this.store.delete(row);
  }
}
