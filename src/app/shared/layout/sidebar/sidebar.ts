import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ADMIN_SECTIONS, AdminSection, AdminSubItem } from './admin-nav.data';


interface NavItem {
  label: string;
  icon: 'dashboard' | 'locating' | 'events' | 'report' | 'process' | 'admin';
  route?: string;
  matchRoutes?: string[];
  hasFlyout?: boolean;
}


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  isCollapsed = false;

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      matchRoutes: ['/dashboard', '/manhole-dashboard', '/equipment-dashboard']
    },
    { label: 'Locating', icon: 'locating', route: '/locating' },
    { label: 'Events', icon: 'events', route: '/events' },
    { label: 'Report', icon: 'report', route: '/report-list', matchRoutes: ['/report-list', '/report/generate'] },
    { label: 'Process & Automation', icon: 'process', route: '/process-automation' },
    { label: 'Administration', icon: 'admin', hasFlyout: true }
  ];

  adminSections: AdminSection[] = ADMIN_SECTIONS;

  adminPanelOpen = false;
  expandedAdminSection: string | null = null;
  expandedConfigGroup: string | null = null;
  isAdminActive = false;
  currentUrl = '';

  private adminRoutes: string[] = this.adminSections.flatMap(section => this.collectRoutes(section));

  constructor(private router: Router) {
    this.updateActiveState(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.updateActiveState(e.urlAfterRedirects));
  }

  private collectRoutes(node: AdminSection | AdminSubItem): string[] {
    const own = node.route ? [node.route] : [];
    const nested = node.children ? node.children.flatMap(child => this.collectRoutes(child)) : [];
    return [...own, ...nested];
  }

  private updateActiveState(url: string): void {
    this.currentUrl = url;
    this.isAdminActive = this.adminRoutes.some(route => url.startsWith(route));
  }

  isNavItemActive(item: NavItem): boolean {
    const routes = item.matchRoutes ?? (item.route ? [item.route] : []);
    return routes.some(route => this.currentUrl.startsWith(route));
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onNavItemClick(item: NavItem): void {
    if (item.hasFlyout) {
      this.adminPanelOpen = !this.adminPanelOpen;
      if (!this.adminPanelOpen) {
        this.expandedAdminSection = null;
      }
    }
  }

  toggleAdminSection(section: AdminSection): void {
    if (!section.children) return;
    this.expandedAdminSection = this.expandedAdminSection === section.label ? null : section.label;
    this.expandedConfigGroup = null;
  }

  toggleConfigGroup(item: AdminSubItem): void {
    if (!item.children) return;
    this.expandedConfigGroup = this.expandedConfigGroup === item.label ? null : item.label;
  }

  closeAdminPanel(): void {
    this.adminPanelOpen = false;
    this.expandedAdminSection = null;
    this.expandedConfigGroup = null;
  }

}
