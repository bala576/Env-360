import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BrandPanel } from '../brand-panel/brand-panel';

const CODE_LENGTH = 6;

@Component({
  selector: 'app-verify-auth',
  imports: [FormsModule, RouterLink, BrandPanel],
  templateUrl: './verify-auth.html',
  styleUrl: './verify-auth.css',
})
export class VerifyAuth {

  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  digits: string[] = Array(CODE_LENGTH).fill('');
  rememberDevice = false;
  isVerifying = false;
  errorMsg = '';
  infoMsg = '';

  // Demo user until the backend returns the signed-in user
  email = 'rex@company.com';

  constructor(private router: Router) {
    const stateEmail = this.router.getCurrentNavigation()?.extras.state?.['email'];
    if (stateEmail) {
      this.email = stateEmail;
    }
  }

  get isComplete(): boolean {
    return this.digits.every(d => d !== '');
  }

  private focusDigit(index: number) {
    const input = this.digitInputs.get(index)?.nativeElement;
    input?.focus();
    input?.select();
  }

  onDigitInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    this.errorMsg = '';

    if (value.length > 1) {
      // Autofill or fast typing can drop several digits into one box
      this.fillFrom(index, value);
      return;
    }

    this.digits[index] = value;
    input.value = value;
    if (value && index < CODE_LENGTH - 1) {
      this.focusDigit(index + 1);
    }
  }

  onDigitKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      event.preventDefault();
      this.digits[index - 1] = '';
      this.focusDigit(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusDigit(index - 1);
    } else if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      event.preventDefault();
      this.focusDigit(index + 1);
    } else if (event.key === 'Enter' && this.isComplete) {
      this.verify();
    }
  }

  onPaste(index: number, event: ClipboardEvent) {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    if (pasted) {
      this.fillFrom(index, pasted);
    }
  }

  private fillFrom(index: number, value: string) {
    const chars = value.slice(0, CODE_LENGTH - index).split('');
    chars.forEach((char, offset) => this.digits[index + offset] = char);
    this.digits = [...this.digits];
    this.focusDigit(Math.min(index + chars.length, CODE_LENGTH - 1));
  }

  verify() {
    if (this.isVerifying) return;

    if (!this.isComplete) {
      this.errorMsg = 'Enter all 6 digits of the code.';
      return;
    }

    this.isVerifying = true;
    this.errorMsg = '';

    // Demo: any 6-digit code completes setup until the verify API is wired up
    const fakeToken = 'demo-token-' + btoa(this.email + ':' + Date.now());
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', fakeToken);
    }
    setTimeout(() => this.router.navigate(['/new-dashboard']), 600);
  }

  useDifferentMethod() {
    this.infoMsg = 'Other verification methods are not available yet.';
  }

}
