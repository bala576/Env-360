import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Component, ElementRef, HostListener, Input } from '@angular/core';

type NotificationCategory = 'alert' | 'info' | 'system' | 'update';
type NotificationTab = 'all' | NotificationCategory;
type NotificationIcon = 'warning' | 'wrench' | 'visitor' | 'asset' | 'gear';

interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  category: NotificationCategory;
  icon: NotificationIcon;
  tone: 'red' | 'amber' | 'blue' | 'green' | 'purple';
  read: boolean;
}

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {

    @Input() pageTitle: string = 'Environment 360';

  userMenuOpen = false;
  currentLanguage = 'English';
  hasWhatsNew = true;
  notificationsOpen = false;
  activeTab: NotificationTab = 'all';

  tabs: { key: NotificationTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'alert', label: 'Alerts' },
    { key: 'info', label: 'Info' },
    { key: 'system', label: 'System' },
    { key: 'update', label: 'Updates' },
  ];

  notifications: AppNotification[] = [
    { id: 1, title: 'High Temperature Alert', message: 'Temperature in Cold Store 1 exceeded 8°C (current: 10.4°C)', time: '5 min ago', category: 'alert', icon: 'warning', tone: 'red', read: false },
    { id: 2, title: 'Maintenance Due', message: 'AC Unit AHU-03 is due for preventive maintenance on 25 May 2025', time: '30 min ago', category: 'alert', icon: 'wrench', tone: 'amber', read: false },
    { id: 3, title: 'New Visitor Check-in', message: 'John Smith checked in at Dubai Mall – Main Entrance', time: '1 hour ago', category: 'info', icon: 'visitor', tone: 'blue', read: false },
    { id: 4, title: 'Asset Moved', message: 'Forklift #FL-012 moved from Warehouse A to Loading Bay', time: '2 hours ago', category: 'info', icon: 'asset', tone: 'green', read: true },
    { id: 5, title: 'System Update', message: 'Environment360 platform updated to v2.4.1', time: '4 hours ago', category: 'update', icon: 'gear', tone: 'purple', read: true },
    { id: 6, title: 'Humidity Threshold Breach', message: 'Humidity in Server Room 2 reached 72% (limit: 60%)', time: '5 hours ago', category: 'alert', icon: 'warning', tone: 'red', read: true },
    { id: 7, title: 'Gateway Offline', message: 'Gateway GW-07 at Warehouse B stopped reporting', time: '6 hours ago', category: 'system', icon: 'gear', tone: 'purple', read: true },
    { id: 8, title: 'Visitor Check-out', message: 'Sarah Lee checked out from Head Office – Reception', time: '7 hours ago', category: 'info', icon: 'visitor', tone: 'blue', read: true },
    { id: 9, title: 'Door Left Open', message: 'Cold Store 2 door open for more than 10 minutes', time: '8 hours ago', category: 'alert', icon: 'warning', tone: 'red', read: true },
    { id: 10, title: 'Asset Returned', message: 'Pallet Jack #PJ-004 returned to Warehouse A', time: '9 hours ago', category: 'info', icon: 'asset', tone: 'green', read: true },
    { id: 11, title: 'Scheduled Backup', message: 'Nightly database backup completed successfully', time: '12 hours ago', category: 'system', icon: 'gear', tone: 'purple', read: true },
    { id: 12, title: 'New Shift Started', message: 'Night shift started at Dubai Mall – Security', time: '14 hours ago', category: 'info', icon: 'visitor', tone: 'blue', read: true },
  ];

  constructor(private elementRef: ElementRef<HTMLElement>, private router: Router) {}

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get filteredNotifications(): AppNotification[] {
    const list = this.activeTab === 'all'
      ? this.notifications
      : this.notifications.filter(n => n.category === this.activeTab);
    return list.slice(0, 5);
  }

  tabCount(tab: NotificationTab): number {
    return tab === 'all'
      ? this.notifications.length
      : this.notifications.filter(n => n.category === tab).length;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.userMenuOpen = false;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => (n.read = true));
  }

  markAsRead(notification: AppNotification): void {
    notification.read = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.notificationsOpen = false;
      this.userMenuOpen = false;
    }
  }

  currentUser = {
    name: 'ganesh@purpleiq.ai',
    role: 'Administrator',
    initials: 'AD'
  };

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.notificationsOpen = false;
  }

  logout(): void {
    this.userMenuOpen = false;
    this.router.navigate(['/login']);
  }

}
