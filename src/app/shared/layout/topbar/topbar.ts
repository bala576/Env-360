import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {

    @Input() pageTitle: string = 'Environment 360';

  notificationCount = 3;
  userMenuOpen = false;

  currentUser = {
    name: 'ganesh@purpleiq.ai',
    role: 'Administrator',
    initials: 'AD'
  };

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    console.log('logging out...');
  }

}
