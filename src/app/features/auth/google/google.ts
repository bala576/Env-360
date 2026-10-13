import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BrandPanel } from '../brand-panel/brand-panel';

interface GoogleAccount {
  name: string;
  email: string;
}

@Component({
  selector: 'app-google',
  imports: [RouterLink, BrandPanel],
  templateUrl: './google.html',
  styleUrl: './google.css',
})
export class Google {

  // Demo accounts until real Google OAuth is wired up
  accounts: GoogleAccount[] = [
    { name: 'Rex Kumar', email: 'rex@company.com' },
  ];
  selectedEmail = '';

  constructor(private router: Router) { }

  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  selectAccount(account: GoogleAccount) {
    if (this.selectedEmail) return;

    this.selectedEmail = account.email;
    const fakeToken = 'demo-google-token-' + btoa(account.email);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', fakeToken);
    }
    setTimeout(() => this.router.navigate(['/new-dashboard']), 600);
  }

  useAnotherAccount() {
    this.router.navigate(['/login']);
  }

}
