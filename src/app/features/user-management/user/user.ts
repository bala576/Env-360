import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericTable, TableColumn } from '../../../shared/generic-table/generic-table';
import { GenericPopup } from '../../../shared/generic-popup/generic-popup';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, USER_MANAGEMENT_DROPDOWN } from '../../../shared/layout/sidebar/admin-nav.data';

interface UserRow {
  id: string;
  userName: string;
  shortName: string;
  contactNo: string;
  emailId: string;
  role: string;
  roleName: string;
  adUserName: string;
}

const ROLE_NAME_BY_CODE: Record<string, string> = {
  ADMIN: 'Administrator',
  FAC_MGR: 'Facility Manager',
  SAFETY: 'Safety Officer',
  ANALYST: 'Environment Analyst',
  VIEWER: 'Viewer',
};

@Component({
  selector: 'app-user',
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericPopup, Breadcrumb],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'User Management', children: USER_MANAGEMENT_DROPDOWN },
    { label: 'User' },
  ];

  columns: TableColumn[] = [
    { key: 'id', label: 'User Id' },
    { key: 'userName', label: 'User Name' },
    { key: 'shortName', label: 'Short Name' },
    { key: 'contactNo', label: 'Contact No' },
    { key: 'emailId', label: 'Email Id' },
    { key: 'role', label: 'Role' },
    { key: 'roleName', label: 'Role Name' },
    { key: 'adUserName', label: 'AD User Name' },
  ];

  rows: UserRow[] = [
    { id: 'USR-001', userName: 'Rahul Mehta', shortName: 'RMehta', contactNo: '+91 98765 43210', emailId: 'rahul.mehta@env360.com', role: 'ADMIN', roleName: 'Administrator', adUserName: 'ENV360\\rmehta' },
    { id: 'USR-002', userName: 'Anita Sharma', shortName: 'ASharma', contactNo: '+91 98765 43211', emailId: 'anita.sharma@env360.com', role: 'SAFETY', roleName: 'Safety Officer', adUserName: 'ENV360\\asharma' },
    { id: 'USR-003', userName: 'Rajesh Kumar', shortName: 'RKumar', contactNo: '+91 98765 43212', emailId: 'rajesh.kumar@env360.com', role: 'ANALYST', roleName: 'Environment Analyst', adUserName: 'ENV360\\rkumar' },
    { id: 'USR-004', userName: 'Elena Rossi', shortName: 'ERossi', contactNo: '+39 348 123 4567', emailId: 'elena.rossi@env360.com', role: 'FAC_MGR', roleName: 'Facility Manager', adUserName: 'ENV360\\erossi' },
    { id: 'USR-005', userName: 'Omar Al-Farsi', shortName: 'OAlFarsi', contactNo: '+968 9123 4567', emailId: 'omar.alfarsi@env360.com', role: 'VIEWER', roleName: 'Viewer', adUserName: 'ENV360\\oalfarsi' },
  ];

  roleOptions = Object.keys(ROLE_NAME_BY_CODE);

  popupOpen = false;
  editingRow: UserRow | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      shortName: ['', Validators.required],
      contactNo: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      roleName: [''],
      adUserName: [''],
    });
  }

  onRoleChange(): void {
    const role = this.form.value.role;
    this.form.patchValue({ roleName: ROLE_NAME_BY_CODE[role] ?? '' });
  }

  openAdd(): void {
    this.editingRow = null;
    this.form.reset();
    this.popupOpen = true;
  }

  openEdit(row: UserRow): void {
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
      this.rows.push({ id: `USR-${String(this.rows.length + 1).padStart(3, '0')}`, ...value });
    }

    this.closePopup();
  }

  deleteRow(row: UserRow): void {
    this.rows = this.rows.filter(r => r.id !== row.id);
  }
}
