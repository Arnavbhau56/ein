import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register implements OnInit {
  currentPage: number = 1;
  otpSent: boolean = false;
  timer: number = 0;
  timerInterval: any = null;
  showResend: boolean = false;
  otpDigits: string[] = ['', '', '', '', '', ''];
  postalCodeAutoFilled: boolean = false;

  formData: any = {
    email: '',
    otp: '',
    poc_first_name: '',
    poc_last_name: '',
    school_name: '',
    school_nation: '',
    school_postalcode: '',
    school_state: '',
    school_city: '',
    school_address: '',
    class_number: [],
    contact: '',
    alternate_contact: '',
    reference: '',
    referral_id: '',
    referral_id_2: ''
  };

  referenceOptions = [
    { value: 'Email', label: 'Email' },
    { value: 'School', label: 'School' },
    { value: 'Friends', label: 'Friends' },
    { value: 'NEC Junior', label: 'NEC Junior' },
    { value: 'Eureka! Junior', label: 'Eureka! Junior' },
    { value: 'Both Eureka! Junior and NEC Junior', label: 'Both Eureka! Junior and NEC Junior' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Others', label: 'Others' }
  ];

  classOptions = [
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' }
  ];

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
    if (!this.formData.email) {
      this.showError('Please enter your email.');
      return;
    }
    
    try {
      const response = await fetch(`${environment.BASE_URL}/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.formData.email })
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

  // --- Navigation ---
  nextPage() {
    if (this.currentPage === 1) {
      this.validatePage1();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // --- Validation ---
  async validatePage1() {
    if (!this.formData.email || !this.isOtpComplete()) {
      this.showError('Please fill all required fields.');
      return;
    }

    try {
      const response = await fetch(`${environment.BASE_URL}/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: this.formData.email, 
          otp: this.getOtpString() 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Pre-fill form data from response
        if (data.firstName) this.formData.poc_first_name = data.firstName;
        if (data.lastName) this.formData.poc_last_name = data.lastName;
        if (data.contact) this.formData.contact = data.contact;
        if (data.college) this.formData.school_name = data.college;
        
        this.currentPage = 2;
        this.saveFormData();
      } else {
        this.showError(data.error || 'OTP verification failed.');
      }
    } catch (error: any) {
      this.showError(error.message || 'OTP verification failed.');
    }
  }

  validatePage2() {
    const requiredFields = [
      { key: 'poc_first_name', label: 'POC\'s First Name' },
      { key: 'poc_last_name', label: 'POC\'s Last Name' },
      { key: 'school_name', label: 'School Name' },
      { key: 'school_nation', label: 'School Country' },
      { key: 'school_address', label: 'School Address' },
      { key: 'contact', label: 'Contact' },
      { key: 'reference', label: 'Reference' }
    ];

    const missingFields = requiredFields.filter(f => !this.formData[f.key]).map(f => f.label);
    
    if (missingFields.length > 0) {
      this.showError('Please fill: ' + missingFields.join(', '));
      return;
    }

    if (this.formData.school_nation === 'India') {
      if (!this.formData.school_postalcode || !this.formData.school_state || !this.formData.school_city) {
        this.showError('Please fill all India-specific fields.');
        return;
      }
    }

    if (this.formData.class_number.length === 0) {
      this.showError('Please select at least one class.');
      return;
    }

    if (['NEC Junior', 'Eureka! Junior', 'Both Eureka! Junior and NEC Junior'].includes(this.formData.reference)) {
      if (!this.formData.referral_id) {
        this.showError('Please enter Referral ID.');
        return;
      }
    }

    if (this.formData.reference === 'Both Eureka! Junior and NEC Junior') {
      if (!this.formData.referral_id_2) {
        this.showError('Please enter second Referral ID.');
        return;
      }
    }

    this.submitForm();
  }

  // --- API Calls ---
  async submitForm() {
    try {
      const response = await fetch(`${environment.BASE_URL}/reg/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.showSuccess('Registration successful!');
        this.router.navigate(['/']);
        localStorage.removeItem('registerFormData');
      } else {
        this.showError(data.error || 'Registration failed.');
      }
    } catch (error: any) {
      this.showError(error.message || 'Registration failed.');
    }
  }

  // --- Postal Code Autofill ---
  async onPostalCodeChange() {
    if (this.formData.school_postalcode && this.formData.school_postalcode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${this.formData.school_postalcode}`);
        const data = await response.json();
        
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          this.formData.school_state = postOffice.State;
          this.formData.school_city = postOffice.District;
          this.postalCodeAutoFilled = true;
          this.saveFormData();
        } else {
          this.showError('Invalid or unknown postal code.');
          this.postalCodeAutoFilled = false;
        }
      } catch (error: any) {
        this.showError('Failed to fetch postal code details.');
        this.postalCodeAutoFilled = false;
      }
    } else {
      this.postalCodeAutoFilled = false;
    }
  }

  onPostalCodeInput() {
    if (this.postalCodeAutoFilled && this.formData.school_postalcode.length < 6) {
      this.postalCodeAutoFilled = false;
      this.formData.school_state = '';
      this.formData.school_city = '';
    }
  }

  // --- Class Selection ---
  onClassChange(value: string) {
    const index = this.formData.class_number.indexOf(value);
    if (index > -1) {
      this.formData.class_number.splice(index, 1);
    } else {
      this.formData.class_number.push(value);
    }
    this.saveFormData();
  }

  isClassSelected(value: string): boolean {
    return this.formData.class_number.includes(value);
  }

  // --- Reference Selection ---
  onReferenceChange() {
    if (!['NEC Junior', 'Eureka! Junior', 'Both Eureka! Junior and NEC Junior'].includes(this.formData.reference)) {
      this.formData.referral_id = '';
      this.formData.referral_id_2 = '';
    }
    this.saveFormData();
  }

  showReferralField(): boolean {
    return ['NEC Junior', 'Eureka! Junior', 'Both Eureka! Junior and NEC Junior'].includes(this.formData.reference);
  }

  showSecondReferralField(): boolean {
    return this.formData.reference === 'Both Eureka! Junior and NEC Junior';
  }

  // --- Persistence ---
  saveFormData() {
    localStorage.setItem('registerFormData', JSON.stringify(this.formData));
  }

  restoreFormData() {
    const data = localStorage.getItem('registerFormData');
    if (data) {
      this.formData = { ...this.formData, ...JSON.parse(data) };
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
