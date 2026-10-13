import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ACTIVITIES,
  ADMIN_ICONS,
  ADMIN_MODULES,
  ADMIN_STATS,
  ADMIN_TABS,
  ADMIN_USERS,
  AdminModule,
  AdminUser,
  GROUPS,
  LICENSES,
  ROLES,
  ROLE_COLORS,
  RoleShare,
  SECURITY_SETTINGS,
  SERVICES,
  SecuritySetting,
} from './administration.data';

const PAGE_SIZE = 5;

// Donut geometry (viewBox 0 0 160 160)
const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Surface gap between segments, in px along the ring
const SEGMENT_GAP = 2;

interface DonutSegment extends RoleShare {
  dash: string;
  offset: number;
  percent: number;
}

const pad = (n: number) => String(n).padStart(2, '0');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const stamp = (d = new Date()) => `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

@Component({
  selector: 'app-administration',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class Administration implements OnDestroy {

  private router = inject(Router);

  icons = ADMIN_ICONS;
  tabs = ADMIN_TABS;
  activeTab = ADMIN_TABS[0];
  modules = ADMIN_MODULES;
  activities = [...ACTIVITIES];
  securitySettings = SECURITY_SETTINGS.map(s => ({ ...s }));
  licenses = LICENSES;
  services = SERVICES;
  roleColors = ROLE_COLORS;

  ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
  }

  openModule(module: AdminModule): void {
    if (module.route) {
      this.router.navigateByUrl(module.route);
    } else if (module.tab) {
      this.activeTab = module.tab;
    }
  }

  // ---------- Stats (user-driven ones follow the table) ----------
  get stats() {
    return ADMIN_STATS.map(s => {
      if (s.label === 'Total Users') return { ...s, value: this.users.length };
      if (s.label === 'Active Users') return { ...s, value: this.users.filter(u => u.status === 'Active').length };
      return s;
    });
  }

  changeClass(change: number, goodWhenUp: boolean): string {
    if (change === 0) return 'flat';
    return (change > 0) === goodWhenUp ? 'good' : 'bad';
  }

  // ---------- Role distribution ----------
  get roleShares(): RoleShare[] {
    return ROLES.map(role => ({ role, count: this.users.filter(u => u.role === role).length, color: ROLE_COLORS[role] }));
  }

  get donut(): DonutSegment[] {
    const total = this.users.length || 1;
    let start = 0;
    return this.roleShares.filter(r => r.count > 0).map(r => {
      const length = (r.count / total) * CIRCUMFERENCE;
      const segment = {
        ...r,
        dash: `${Math.max(0, length - SEGMENT_GAP)} ${CIRCUMFERENCE}`,
        offset: -start,
        percent: Math.round((r.count / total) * 100),
      };
      start += length;
      return segment;
    });
  }

  hoveredRole: string | null = null;

  get donutCenter(): { value: number; label: string } {
    const hovered = this.roleShares.find(r => r.role === this.hoveredRole);
    return hovered ? { value: hovered.count, label: hovered.role } : { value: this.users.length, label: 'Users' };
  }

  // ---------- Users table ----------
  users: AdminUser[] = ADMIN_USERS.map(u => ({ ...u }));
  search = '';
  role = 'all';
  roleOptions: DropdownOption[] = [{ label: 'All Roles', value: 'all' }, ...ROLES.map(r => ({ label: r, value: r }))];
  page = 1;
  selected = new Set<number>();
  menuFor: number | null = null;

  get filtered(): AdminUser[] {
    const q = this.search.trim().toLowerCase();
    return this.users.filter(u =>
      (this.role === 'all' || u.role === this.role) &&
      (!q || [u.name, u.email, u.role, u.group].some(v => v.toLowerCase().includes(q))));
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE));
  }

  get pageRows(): AdminUser[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  }

  get rangeStart(): number {
    return this.filtered.length ? (this.page - 1) * PAGE_SIZE + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * PAGE_SIZE, this.filtered.length);
  }

  // Page buttons with gaps (null) collapsed into an ellipsis
  get pages(): (number | null)[] {
    const total = this.pageCount;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const near = this.page <= 4 ? [1, 2, 3, 4, 5] : this.page >= total - 3 ? [total - 4, total - 3, total - 2, total - 1] : [this.page - 1, this.page, this.page + 1];
    const sorted = [...new Set([1, ...near, total])].sort((a, b) => a - b);
    return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [null, p] : [p]));
  }

  goTo(page: number): void {
    this.page = Math.min(Math.max(1, page), this.pageCount);
  }

  onFilterChange(): void {
    this.page = 1;
  }

  initials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  get allOnPageSelected(): boolean {
    return this.pageRows.length > 0 && this.pageRows.every(u => this.selected.has(u.id));
  }

  toggleAll(): void {
    const select = !this.allOnPageSelected;
    this.pageRows.forEach(u => (select ? this.selected.add(u.id) : this.selected.delete(u.id)));
  }

  toggleRow(id: number): void {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id);
  }

  toggleMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.menuFor = this.menuFor === id ? null : id;
  }

  toggleStatus(user: AdminUser): void {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    this.menuFor = null;
    this.log(user.status === 'Active' ? 'User activated' : 'User deactivated', `${user.name} is now ${user.status.toLowerCase()}`, 'users', '#16a34a', '#dcfce7');
    this.notify(`${user.name} ${user.status === 'Active' ? 'activated' : 'deactivated'}`);
  }

  resetPassword(user: AdminUser): void {
    this.menuFor = null;
    this.notify(`Password reset link sent to ${user.email}`);
  }

  deleteUser(user: AdminUser): void {
    this.users = this.users.filter(u => u.id !== user.id);
    this.selected.delete(user.id);
    this.menuFor = null;
    this.goTo(this.page);
    this.log('User deleted', `${user.name} was removed`, 'alert', '#dc2626', '#fee2e2');
    this.notify(`${user.name} deleted`);
  }

  deleteSelected(): void {
    const count = this.selected.size;
    this.users = this.users.filter(u => !this.selected.has(u.id));
    this.selected.clear();
    this.goTo(this.page);
    this.log('Users deleted', `${count} user${count === 1 ? ' was' : 's were'} removed`, 'alert', '#dc2626', '#fee2e2');
    this.notify(`${count} user${count === 1 ? '' : 's'} deleted`);
  }

  // ---------- Add / edit user dialog ----------
  dialogOpen = false;
  editing: AdminUser | null = null;
  draft = this.emptyDraft();
  draftRoleOptions: DropdownOption[] = ROLES.map(r => ({ label: r, value: r }));
  groupOptions: DropdownOption[] = GROUPS.map(g => ({ label: g, value: g }));

  private emptyDraft() {
    return { name: '', email: '', role: 'Viewer', group: GROUPS[0] };
  }

  openAdd(): void {
    this.editing = null;
    this.draft = this.emptyDraft();
    this.dialogOpen = true;
  }

  openEdit(user: AdminUser): void {
    this.editing = user;
    this.draft = { name: user.name, email: user.email, role: user.role, group: user.group };
    this.menuFor = null;
    this.dialogOpen = true;
  }

  get emailTaken(): boolean {
    const email = this.draft.email.trim().toLowerCase();
    return this.users.some(u => u.email.toLowerCase() === email && u !== this.editing);
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.draft.email.trim()) && !this.emailTaken;
  }

  saveUser(): void {
    if (!this.canSave) return;
    const values = { name: this.draft.name.trim(), email: this.draft.email.trim(), role: this.draft.role, group: this.draft.group };
    if (this.editing) {
      const roleChanged = this.editing.role !== values.role;
      Object.assign(this.editing, values);
      if (roleChanged) this.log('Role updated', `${values.name} role changed to ${values.role}`, 'shield', '#2563eb', '#dbeafe');
      this.notify(`${values.name} updated`);
    } else {
      const id = Math.max(0, ...this.users.map(u => u.id)) + 1;
      this.users = [{ ...values, id, status: 'Active', lastLogin: 'Never' }, ...this.users];
      this.search = '';
      this.role = 'all';
      this.page = 1;
      this.log('New user created', `${values.name} was added to ${values.group} group`, 'users', '#16a34a', '#dcfce7');
      this.notify(`${values.name} added`);
    }
    this.dialogOpen = false;
  }

  // ---------- Security settings ----------
  toggleSetting(setting: SecuritySetting): void {
    if (!setting.toggle) {
      this.activeTab = 'Security';
      return;
    }
    const enabled = setting.value !== 'Enabled';
    setting.value = enabled ? 'Enabled' : 'Disabled';
    setting.tone = enabled ? 'good' : 'neutral';
    this.log('Security setting changed', `${setting.name} ${enabled ? 'enabled' : 'disabled'} by Admin User`, 'gear', '#6d28d9', '#ede9fe');
    this.notify(`${setting.name} ${enabled ? 'enabled' : 'disabled'}`);
  }

  licensePercent(used: number, total: number): number {
    return Math.min(100, Math.round((used / total) * 100));
  }

  get allServicesOnline(): boolean {
    return this.services.every(s => s.online);
  }

  // ---------- Activity log ----------
  showAllActivity = false;

  get visibleActivities() {
    return this.showAllActivity ? this.activities : this.activities.slice(0, 5);
  }

  private log(title: string, detail: string, icon: string, color: string, tint: string): void {
    this.activities.unshift({ title, detail, time: stamp(), icon, color, tint });
  }

  // ---------- Toast ----------
  toast = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  private notify(message: string): void {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 2800);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.menuFor = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dialogOpen = false;
    this.menuFor = null;
  }
}
