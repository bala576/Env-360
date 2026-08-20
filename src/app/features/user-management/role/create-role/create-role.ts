import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, USER_MANAGEMENT_DROPDOWN } from '../../../../shared/layout/sidebar/admin-nav.data';
import { ProjectStore } from '../../../configuration/project/project-store';
import { LocationNode } from '../../../configuration/project/location-tree-node/location-tree-node';
import { HierarchyTreeNode } from './hierarchy-tree-node/hierarchy-tree-node';
import { RoleStore, RoleAccessEntry } from '../role-store';

const ACCESS_MODULES = [
  'Dashboard',
  'Locating',
  'Events',
  'Report',
  'Process & Automation',
  'Configuration',
  'User Management',
  'Licence Management',
];

@Component({
  selector: 'app-create-role',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Breadcrumb, HierarchyTreeNode],
  templateUrl: './create-role.html',
  styleUrl: './create-role.css',
})
export class CreateRole implements OnInit {

  breadcrumb: BreadcrumbItem[] = [];
  isEdit = false;
  roleId: string | null = null;

  form: FormGroup;
  access: RoleAccessEntry[] = ACCESS_MODULES.map(module => ({ module, view: false, edit: false }));
  hierarchySelectedIds = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectStore: ProjectStore,
    private roleStore: RoleStore,
  ) {
    this.form = this.fb.group({
      roleName: ['', Validators.required],
      description: [''],
    });
  }

  get projects(): LocationNode[] {
    return this.projectStore.projects;
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('roleId');
    this.isEdit = !!this.roleId;

    this.breadcrumb = [
      { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
      { label: 'User Management', children: USER_MANAGEMENT_DROPDOWN },
      { label: 'Role', route: '/role' },
      { label: this.isEdit ? 'Edit Role' : 'Create Role' },
    ];

    if (this.isEdit && this.roleId) {
      const existing = this.roleStore.getById(this.roleId);
      if (existing) {
        this.form.reset({ roleName: existing.roleName, description: existing.description });
        this.hierarchySelectedIds = new Set(existing.hierarchyIds);
        if (existing.access.length) {
          this.access = ACCESS_MODULES.map(module => {
            const found = existing.access.find(a => a.module === module);
            return found ? { ...found } : { module, view: false, edit: false };
          });
        }
      }
    }
  }

  toggleHierarchy(node: LocationNode): void {
    if (this.hierarchySelectedIds.has(node.id)) {
      this.hierarchySelectedIds.delete(node.id);
    } else {
      this.hierarchySelectedIds.add(node.id);
    }
  }

  private summarizeAccess(): string {
    const granted = this.access
      .filter(a => a.view || a.edit)
      .map(a => `${a.module} (${[a.view ? 'View' : null, a.edit ? 'Edit' : null].filter(Boolean).join('/')})`);
    return granted.length ? granted.join(', ') : 'No Access';
  }

  cancel(): void {
    this.router.navigate(['/role']);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const accessPermission = this.summarizeAccess();
    const hierarchyIds = Array.from(this.hierarchySelectedIds);
    const access = this.access.map(a => ({ ...a }));

    if (this.isEdit && this.roleId) {
      this.roleStore.update(this.roleId, {
        roleName: value.roleName,
        description: value.description,
        accessPermission,
        hierarchyIds,
        access,
      });
    } else {
      this.roleStore.add({
        id: this.roleStore.generateId(value.roleName),
        roleName: value.roleName,
        description: value.description,
        accessPermission,
        clientId: 'ENV360-HQ',
        hierarchyIds,
        access,
      });
    }

    this.router.navigate(['/role']);
  }
}
