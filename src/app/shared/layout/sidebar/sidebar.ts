import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ADMIN_SECTIONS, AdminSection, AdminSubItem } from './admin-nav.data';


interface NavItem {
  label: string;
  icon: string;
  route?: string;
  matchRoutes?: string[];
  hasFlyout?: boolean;
  badge?: number;
}

// Stroke-only icon paths (24x24 viewBox), rendered with currentColor
const NAV_ICONS: Record<string, string[]> = {
  dashboard: ['M3 10.5L12 3l9 7.5', 'M5 9v11h5v-6h4v6h5V9'],
  sites: ['M3 21h18', 'M5 21V7l7-4 7 4v14', 'M9 21v-5h6v5', 'M9 9h.01M15 9h.01M9 13h.01M15 13h.01'],
  monitoring: ['M3 12h4l3-7 4 14 3-7h4'],
  devices: ['M5 4h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z', 'M8 20h8M12 16v4', 'M9 10a3 3 0 016 0M7 8a6 6 0 0110 0'],
  automation: ['M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  alarms: ['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 01-3.4 0'],
  analytics: ['M3 3v18h18', 'M7 15l4-4 3 3 6-6', 'M16 8h4v4'],
  operations: ['M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z'],
  parking: ['M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z', 'M9 17V7h4a3 3 0 010 6H9'],
  occupancy: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7a2 2 0 100 4 2 2 0 000-4z', 'M8 17a4 4 0 018 0'],
  displays: ['M3 4h18v12H3z', 'M8 20h8M12 16v4', 'M7 8h6M7 11h10'],
  reports: ['M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z', 'M14 3v6h6', 'M8 13h8M8 17h5'],
  maps: ['M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z', 'M12 7.1a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z'],
  integrations: ['M4 16l4-4 4 4-4 4z', 'M12 8l4-4 4 4-4 4z', 'M10 14l4-4'],
  templates: ['M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z', 'M17 14v6M14 17h6'],
  masters: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z'],
  admin: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M12 9a2 2 0 100 4 2 2 0 000-4z', 'M8.5 17a3.5 3.5 0 017 0'],
};


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
      route: '/new-dashboard',
      matchRoutes: ['/dashboard', '/new-dashboard', '/manhole-dashboard', '/equipment-dashboard']
    },
    { label: 'Sites & Spaces', icon: 'sites', route: '/sites' },
    { label: 'Monitoring', icon: 'monitoring', route: '/monitoring' },
    { label: 'Devices & Sensors', icon: 'devices', route: '/devices', matchRoutes: ['/devices'] },
    { label: 'Automation & Control', icon: 'automation', route: '/automation', matchRoutes: ['/automation', '/process-automation'] },
    { label: 'Alarms & Events', icon: 'alarms', route: '/alarms', matchRoutes: ['/alarms', '/events'] },
    { label: 'Analytics & Predictions', icon: 'analytics', route: '/analytics' },
    { label: 'Operations & Maintenance', icon: 'operations', route: '/operations' },
    { label: 'Parking', icon: 'parking', route: '/parking' },
    { label: 'Space & Occupancy', icon: 'occupancy', route: '/space' },
    { label: 'Digital Displays', icon: 'displays', route: '/digital-displays' },
    { label: 'Reports & Compliance', icon: 'reports', route: '/reports', matchRoutes: ['/reports', '/report-list', '/report/generate'] },
    { label: 'Maps & Digital Twin', icon: 'maps', route: '/maps', matchRoutes: ['/maps', '/locating'] },
    { label: 'Integrations', icon: 'integrations', route: '/integrations' },
    { label: 'Solution Templates', icon: 'templates', route: '/solution-templates' },
    { label: 'Masters & Configuration', icon: 'masters', route: '/masters', matchRoutes: ['/masters', '/administration/configuration/project', '/administration/configuration/masters'] },
    { label: 'Administration', icon: 'admin', route: '/administration', hasFlyout: true }
  ];

  navIcons = NAV_ICONS;

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
    const path = url.split(/[?#]/)[0];
    this.isAdminActive = path === '/administration' || this.adminRoutes.some(route => url.startsWith(route));
  }

  isNavItemActive(item: NavItem): boolean {
    const routes = item.matchRoutes ?? (item.route ? [item.route] : []);
    return routes.some(route => this.currentUrl.startsWith(route));
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // The item opens its overview page; the chevron opens the flyout of sub-screens
  onNavItemClick(item: NavItem): void {
    if (!item.hasFlyout) return;
    if (item.route) {
      this.closeAdminPanel();
      this.router.navigateByUrl(item.route);
    } else {
      this.toggleAdminPanel();
    }
  }

  toggleAdminPanel(event?: Event): void {
    event?.stopPropagation();
    this.adminPanelOpen = !this.adminPanelOpen;
    if (!this.adminPanelOpen) {
      this.expandedAdminSection = null;
      this.expandedConfigGroup = null;
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
