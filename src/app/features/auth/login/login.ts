import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandPanel } from '../brand-panel/brand-panel';

interface LoginData {
  email: string;
  password: string;

}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, BrandPanel],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

    credentials: LoginData = { email: '', password: '' };
  errorMsg = '';
  isLoading = false;
  showPassword = false;
  rememberMe = false;
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

  socialLogin(provider: 'Google' | 'Microsoft') {
    this.router.navigate([provider === 'Google' ? '/google-signin' : '/microsoft-signin']);
  }


  login() {
    if (this.isLoading) return;

    this.errorMsg = '';
    this.popupVisible = false;
    this.isLoading = true;

    if (!this.credentials.email || !this.credentials.password) {
      this.isLoading = false;
      this.showPopup('Invalid email or password.', 'Error', 'error');
      return;
    }

    this.isLoading = false;
    this.router.navigate(['/otp'], { state: { email: this.credentials.email } });
  }

}
