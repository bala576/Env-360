import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GenericTable, TableColumn } from '../../../shared/generic-table/generic-table';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, USER_MANAGEMENT_DROPDOWN } from '../../../shared/layout/sidebar/admin-nav.data';
import { RoleStore, RoleRow } from './role-store';

@Component({
  selector: 'app-role',
  imports: [CommonModule, GenericTable, Breadcrumb],
  templateUrl: './role.html',
  styleUrl: './role.css',
})
export class Role {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'User Management', children: USER_MANAGEMENT_DROPDOWN },
    { label: 'Role' },
  ];

  columns: TableColumn[] = [
    { key: 'id', label: 'Id' },
    { key: 'roleName', label: 'Role Name' },
    { key: 'description', label: 'Description' },
    { key: 'accessPermission', label: 'Access Permission' },
    { key: 'clientId', label: 'ClientId' },
  ];

  constructor(private store: RoleStore, private router: Router) {}

  get rows(): RoleRow[] {
    return this.store.rows;
  }

  openAdd(): void {
    this.router.navigate(['/role/create']);
  }

  openEdit(row: RoleRow): void {
    this.router.navigate(['/role', row.id, 'edit']);
  }

  deleteRow(row: RoleRow): void {
    this.store.delete(row);
  }
}
