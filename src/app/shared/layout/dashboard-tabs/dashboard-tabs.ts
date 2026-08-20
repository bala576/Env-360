import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface DashboardTab {
  label: string;
  route: string;
  icon: 'grid' | 'manhole' | 'equipment';
}

@Component({
  selector: 'app-dashboard-tabs',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-tabs.html',
  styleUrl: './dashboard-tabs.css',
})
export class DashboardTabs {

  tabs: DashboardTab[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'grid' },
    { label: 'Manhole Dashboard', route: '/manhole-dashboard', icon: 'manhole' },
    { label: 'Equipment Dashboard', route: '/equipment-dashboard', icon: 'equipment' },
  ];

  visible = false;

  constructor(private router: Router) {
    this.updateVisibility(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.updateVisibility(e.urlAfterRedirects));
  }

  private updateVisibility(url: string): void {
    this.visible = this.tabs.some(tab => url.startsWith(tab.route));
  }

}
