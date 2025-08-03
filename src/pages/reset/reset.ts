import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset.html',
  styleUrl: './reset.css'
})
export class Reset implements OnInit {
  otpSent: boolean = false;
  timer: number = 0;
  timerInterval: any = null;
  showResend: boolean = false;
  otpDigits: string[] = ['', '', '', '', '', ''];

  resetData: any = {
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  };

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(private router: Router) {}

  ngOnInit() {
    this.restoreFormData();
  }

  // Save form data whenever it changes
  onFormDataChange() {
    this.saveFormData();
  }

  // --- OTP Methods ---
  async sendOtp() {
    if (!this.resetData.email) {
      this.showError('Please enter your email.');
      return;
    }
    
    try {
      const response = await fetch(`${environment.BASE_URL}/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.resetData.email })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send OTP.');
      }
      
      this.otpSent = true;
      this.startTimer();
      this.showSuccess('OTP sent successfully! Check your email.');
    } catch (error: any) {
      this.showError(error.message || 'Failed to send OTP.');
    }
  }

  startTimer() {
    this.timer = 30;
    this.showResend = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.showResend = true;
      }
    }, 1000);
  }

  resendOtp() {
    this.sendOtp();
  }

  onOtpInput(index: number, event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) value = value.slice(-1);
    
    if (event.target.value !== value) {
      event.target.value = value;
    }
    
    if (value && index < this.otpDigits.length - 1) {
      setTimeout(() => {
        const nextInput = this.otpInputs.get(index + 1)?.nativeElement;
        if (nextInput) nextInput.focus();
      });
    }
  }

  onOtpKeydown(index: number, event: any) {
    if (event.key === 'Backspace') {
      if (this.otpDigits[index]) {
        this.otpDigits[index] = '';
        event.target.value = '';
      } else if (index > 0) {
        setTimeout(() => {
          const prevInput = this.otpInputs.get(index - 1)?.nativeElement;
          if (prevInput) {
            prevInput.focus();
            this.otpDigits[index - 1] = '';
            prevInput.value = '';
          }
        });
      }
      event.preventDefault();
    } else if (!/^[0-9]$/.test(event.key) && event.key !== 'Tab' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text') || '';
    if (/^\d{6}$/.test(paste)) {
      for (let i = 0; i < 6; i++) {
        this.otpDigits[i] = paste[i];
        const input = this.otpInputs.get(i)?.nativeElement;
        if (input) input.value = paste[i];
      }
      event.preventDefault();
      const lastInput = this.otpInputs.get(5)?.nativeElement;
      if (lastInput) lastInput.focus();
    }
  }

  isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  getOtpString(): string {
    return this.otpDigits.join('');
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  // --- Form Submission ---
  async onSubmit() {
    if (!this.resetData.email || !this.isOtpComplete() || !this.resetData.newPassword || !this.resetData.confirmPassword) {
      this.showError('Please fill all required fields.');
      return;
    }

    if (this.resetData.newPassword !== this.resetData.confirmPassword) {
      this.showError('Passwords do not match.');
      return;
    }

    if (this.resetData.newPassword.length < 6) {
      this.showError('Password must be at least 6 characters long.');
      return;
    }

    this.submitResetPassword();
  }

  // --- API Calls ---
  async submitResetPassword() {
    try {
      const response = await fetch(`${environment.BASE_URL}/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.resetData.email,
          password: this.resetData.newPassword,
          otp: this.getOtpString()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.showSuccess('Password reset successful!');
        this.router.navigate(['/login']);
        localStorage.removeItem('resetFormData');
      } else {
        this.showError(data.error || 'Password reset failed.');
      }
    } catch (error: any) {
      this.showError(error.message || 'Password reset failed.');
    }
  }

  // --- Persistence ---
  saveFormData() {
    localStorage.setItem('resetFormData', JSON.stringify(this.resetData));
  }

  restoreFormData() {
    const data = localStorage.getItem('resetFormData');
    if (data) {
      this.resetData = { ...this.resetData, ...JSON.parse(data) };
    }
  }

  // --- Utility ---
  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      background: '#222',
      color: '#fff',
      confirmButtonColor: 'var(--primary-green)',
      customClass: {
        popup: 'swal2-dark',
        title: 'swal2-dark',
        htmlContainer: 'swal2-dark',
        confirmButton: 'swal2-dark'
      }
    });
  }

  showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      background: '#222',
      color: '#fff',
      confirmButtonColor: 'var(--primary-green)',
      customClass: {
        popup: 'swal2-dark',
        title: 'swal2-dark',
        htmlContainer: 'swal2-dark',
        confirmButton: 'swal2-dark'
      },
      timer: 2000,
      showConfirmButton: false
    });
  }
}
