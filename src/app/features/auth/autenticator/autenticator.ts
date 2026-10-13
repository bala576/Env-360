import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import QRCode from 'qrcode';
import { BrandPanel } from '../brand-panel/brand-panel';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const SECRET_LENGTH = 32;

@Component({
  selector: 'app-autenticator',
  imports: [BrandPanel],
  templateUrl: './autenticator.html',
  styleUrl: './autenticator.css',
})
export class Autenticator implements OnInit {

  // Demo user until the backend returns the signed-in user
  email = 'rex@company.com';
  secret = '';
  qrDataUrl = '';
  copied = false;

  private copiedTimer?: ReturnType<typeof setTimeout>;

  constructor(private router: Router) {
    const stateEmail = this.router.getCurrentNavigation()?.extras.state?.['email'];
    if (stateEmail) {
      this.email = stateEmail;
    }
  }

  get formattedSecret(): string {
    return this.secret.match(/.{1,4}/g)?.join(' ') ?? '';
  }

  ngOnInit() {
    // Demo: secret is generated in the browser. In production the backend must
    // generate and store it, and send it here only once during setup.
    this.secret = this.generateSecret();
    this.renderQr();
  }

  private generateSecret(): string {
    const bytes = new Uint8Array(SECRET_LENGTH);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => BASE32_ALPHABET[b % 32]).join('');
  }

  private async renderQr() {
    const issuer = 'Environment360';
    const label = encodeURIComponent(`${issuer}:${this.email}`);
    const uri = `otpauth://totp/${label}?secret=${this.secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
    this.qrDataUrl = await QRCode.toDataURL(uri, {
      width: 320,
      margin: 1,
      color: { dark: '#1e1b4b', light: '#ffffff' },
    });
  }

  async copySecret() {
    try {
      await navigator.clipboard.writeText(this.secret);
      this.copied = true;
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => this.copied = false, 2000);
    } catch {
      this.copied = false;
    }
  }

  next() {
    this.router.navigate(['/verify-auth'], { state: { email: this.email } });
  }

  setUpLater() {
    this.router.navigate(['/new-dashboard']);
  }

}
