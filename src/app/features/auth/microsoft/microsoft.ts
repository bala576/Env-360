import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BrandPanel } from '../brand-panel/brand-panel';

interface MicrosoftAccount {
  name: string;
  email: string;
}

@Component({
  selector: 'app-microsoft',
  imports: [RouterLink, BrandPanel],
  templateUrl: './microsoft.html',
  styleUrl: '../google/google.css',
})
export class Microsoft {

  // Demo accounts until real Microsoft sign-in is wired up
  accounts: MicrosoftAccount[] = [
    { name: 'Rex Kumar', email: 'rex@company.com' },
  ];
  selectedEmail = '';

  constructor(private router: Router) { }

  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  selectAccount(account: MicrosoftAccount) {
    if (this.selectedEmail) return;

    this.selectedEmail = account.email;
    const fakeToken = 'demo-microsoft-token-' + btoa(account.email);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', fakeToken);
    }
    setTimeout(() => this.router.navigate(['/new-dashboard']), 600);
  }

  useAnotherAccount() {
    this.router.navigate(['/login']);
  }

}
