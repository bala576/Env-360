import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginData {
  email: string;
  password: string;

}

const HARDCODED_EMAIL = 'admin@test.com';
const HARDCODED_PASSWORD = 'admin123';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

    credentials: LoginData = { email: '', password: '' };
  errorMsg = '';
  isLoading = false;
  popupVisible = false;
  popupTitle = '';
  popupMessage = '';
  popupType: 'error' | 'success' | '' = '';

  constructor(private router: Router) { }

  showPopup(message: string, title = 'Error', type: 'error' | 'success' | '' = 'error') {
    this.popupMessage = message;
    this.popupTitle = title;
    this.popupType = type;
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
  }

  login() {
    if (this.isLoading) return;

    this.errorMsg = '';
    this.popupVisible = false;
    this.isLoading = true;

    if (this.credentials.email !== HARDCODED_EMAIL || this.credentials.password !== HARDCODED_PASSWORD) {
      this.isLoading = false;
      this.showPopup('Invalid email or password.', 'Error', 'error');
      return;
    }

    const fakeToken = 'demo-token-' + btoa(this.credentials.email + ':' + this.credentials.password);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', fakeToken);
    }
    this.isLoading = false;
    this.router.navigate(['/dashboard']);
  }

}
