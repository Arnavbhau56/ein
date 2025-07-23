import { Component, OnInit, Inject, PLATFORM_ID, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { STARTUP_STAGE_OPTIONS } from '../../enums/registration';
import { GENDER_OPTIONS } from '../../../enums/registration_options';
import { COUNTRIES } from '../../../enums/countries';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { SECTOR_OPTIONS } from '../../../enums/registration_options';
import { Router } from '@angular/router';

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
  page1Submitted: boolean = false;
  page2Submitted: boolean = false;
  page3Submitted: boolean = false;
  originalEmail: string = '';
  postalCodeAutoFilled: boolean = false;
  pitchdeckFile: File | null = null;

  formData: any = {
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    country_code: '',
    contact_number: '',
    country: '',
    postal_code: '',
    state: '',
    city: '',
    linkedin_url: '',
    startup_name: '',
    startup_sector: '',
    dpiit_registered: '',
    dpiit_recognition_number: '',
    startup_description: '',
    startup_traction: '',
    startup_stage: '', 
    startup_website: '',
    pitchdeck: '',
  };

  genderOptions = GENDER_OPTIONS;
  countries = COUNTRIES;
  startupStageOptions = STARTUP_STAGE_OPTIONS;
  sectorOptions = SECTOR_OPTIONS;

  filteredCountriesList: any[] = this.countries;
  showCountryDropdown: boolean = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit() {
    this.restoreFormData();
  }

  // --- OTP Methods ---
  async sendOtp() {
    if (!this.formData.email) {
      this.showError('Please enter your email.');
      return;
    }
    this.originalEmail = this.formData.email;
    Swal.fire({
      title: 'Sending OTP...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); },
      background: 'rgb(17, 24, 39)',
      color: '#fff',
      customClass: {
        popup: 'swal2-sans-serif',
        title: 'swal2-sans-serif',
        htmlContainer: 'swal2-sans-serif',
        confirmButton: 'swal2-sans-serif',
        cancelButton: 'swal2-sans-serif',
        actions: 'swal2-sans-serif'
      }
    });
    try {
      const response = await fetch(`${environment.BASE_URL}/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.formData.email })
      });
      if (!response.ok) {
        throw new Error('Failed to send OTP.');
      }
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'Check your email for the OTP.',
        background: 'rgb(17, 24, 39)',
        color: '#fff',
        customClass: {
          popup: 'swal2-sans-serif',
          title: 'swal2-sans-serif',
          htmlContainer: 'swal2-sans-serif',
          confirmButton: 'swal2-sans-serif',
          cancelButton: 'swal2-sans-serif',
          actions: 'swal2-sans-serif'
        },
        timer: 1500,
        showConfirmButton: false
      });
      this.otpSent = true;
      this.startTimer();
    } catch (error: any) {
      Swal.close();
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
    this.startTimer();
  }

  onOtpInput(index: number, event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) value = value.slice(-1);
    // ngModel already updates otpDigits[index], so we only need to correct the value in the input if needed
    if (event.target.value !== value) {
      event.target.value = value;
    }
    // Do NOT reassign this.otpDigits[index] here, let ngModel handle it.
    // Move to next input if a digit is entered and not the last box
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
    } else if (this.currentPage === 2) {
      this.validatePage2();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // --- Validation ---
  async validatePage1() {
    this.page1Submitted = true;
    if (!this.formData.email || !this.isOtpComplete()) {
      this.showError('Please fill all required fields.');
      return;
    }
    Swal.fire({
      title: 'Verifying OTP...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); },
      background: 'rgb(17, 24, 39)',
      color: '#fff',
      customClass: {
        popup: 'swal2-sans-serif',
        title: 'swal2-sans-serif',
        htmlContainer: 'swal2-sans-serif',
        confirmButton: 'swal2-sans-serif',
        cancelButton: 'swal2-sans-serif',
        actions: 'swal2-sans-serif'
      }
    });
    try {
      const response = await fetch(`${environment.BASE_URL}/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.formData.email, otp: this.getOtpString() })
      });
      const data = await response.json();
      Swal.close();
      if (response.ok) {
        this.currentPage = 2;
        this.saveFormData();
      } else {
        this.showError(data.error || 'OTP verification failed.');
      }
    } catch (error: any) {
      Swal.close();
      this.showError(error.message || 'OTP verification failed.');
    }
  }

  validatePage2() {
    this.page2Submitted = true;
    const requiredFields = [
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'gender', label: 'Gender' },
      { key: 'country_code', label: 'Country Code' },
      { key: 'contact_number', label: 'Contact Number' },
      { key: 'country', label: 'Country' },
      { key: 'linkedin_url', label: 'LinkedIn URL' }
    ];
    const missingFields = requiredFields.filter(f => !this.formData[f.key]).map(f => f.label);
    if (missingFields.length > 0) {
      this.showError('Please fill: ' + missingFields.join(', '));
      return;
    }
    if (this.formData.country.toLowerCase() === 'india') {
      const indiaFields = [];
      if (!this.formData.postal_code) indiaFields.push('Postal Code');
      if (!this.formData.state) indiaFields.push('State');
      if (!this.formData.city) indiaFields.push('City');
      if (indiaFields.length > 0) {
        this.showError('Please fill: ' + indiaFields.join(', '));
        return;
      }
    }
    if (this.formData.postal_code && this.formData.postal_code.length !== 6) {
      this.showError('Postal code must be exactly 6 digits.');
      return;
    }
    if (this.formData.contact_number && this.formData.contact_number.length > 16) {
      this.showError('Contact number cannot exceed 16 digits.');
      return;
    }
    if (!this.isValidLinkedInUrl(this.formData.linkedin_url)) {
      this.showError('Please enter a valid LinkedIn URL.');
      return;
    }
    this.currentPage = 3;
    this.saveFormData();
  }

  validatePage3() {
    this.page3Submitted = true;
    const requiredFields = [
      { key: 'startup_name', label: 'Startup Name' },
      { key: 'startup_sector', label: 'Startup Sector' },
      { key: 'startup_description', label: 'Startup Description' },
      { key: 'startup_traction', label: 'Startup Traction' },
      { key: 'startup_stage', label: 'Current Registration Status' }
    ];
    const missingFields = requiredFields.filter(f => !this.formData[f.key]).map(f => f.label);
    if (missingFields.length > 0) {
      this.showError('Please fill: ' + missingFields.join(', '));
      return false;
    }
    if (this.formData.dpiit_registered === 'yes' && !this.formData.dpiit_recognition_number) {
      this.showError('Please enter DPIIT Recognition Number.');
      return false;
    }
    if (this.formData.startup_website && !this.isValidWebsiteUrl(this.formData.startup_website)) {
      this.showError('Please enter a valid Website URL.');
      return false;
    }
    if (!this.pitchdeckFile) {
      this.showError('Please upload your pitchdeck (PDF).');
      return false;
    }
    return true;
  }

  // --- API Calls ---
  async submit() {
    if (!this.validatePage3()) return;
    Swal.fire({
      title: 'Submitting Registration...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); },
      background: 'rgb(17, 24, 39)',
      color: '#fff',
      customClass: {
        popup: 'swal2-sans-serif',
        title: 'swal2-sans-serif',
        htmlContainer: 'swal2-sans-serif',
        confirmButton: 'swal2-sans-serif',
        cancelButton: 'swal2-sans-serif',
        actions: 'swal2-sans-serif'
      }
    });
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      for (const key in this.formData) {
        if (this.formData[key] !== undefined && this.formData[key] !== null) {
          formDataToSend.append(key, this.formData[key]);
        }
      }
      if (this.pitchdeckFile) {
        formDataToSend.append('pitchdeck', this.pitchdeckFile);
      }
      const response = await fetch(`${environment.BASE_URL}/reg/`, {
        method: 'POST',
        body: formDataToSend
      });
      const data = await response.json();
      Swal.close();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your registration has been submitted successfully!',
          background: 'rgb(17, 24, 39)',
          color: '#fff',
          customClass: {
            popup: 'swal2-sans-serif',
            title: 'swal2-sans-serif',
            htmlContainer: 'swal2-sans-serif',
            confirmButton: 'swal2-sans-serif',
            cancelButton: 'swal2-sans-serif',
            actions: 'swal2-sans-serif'
          },
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/']);
        });
        this.saveFormData();
        localStorage.removeItem('registerFormData');
      } else {
        this.showError(data.error || 'Registration failed.');
      }
    } catch (error: any) {
      Swal.close();
      this.showError(error.message || 'Registration failed.');
    }
  }

  // --- File Upload ---
  onPitchdeckChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.pitchdeckFile = file;
    } else {
      this.showError('Please upload a PDF file.');
      event.target.value = '';
    }
  }

  // --- Country/Postal Code Autofill ---
  filterCountryCodes(value: string) {
    const filterValue = value ? value.toLowerCase() : '';
    this.filteredCountriesList = this.countries.filter(country =>
      country.countryCallingCode.toLowerCase().includes(filterValue) ||
      (country.countryNameEn && country.countryNameEn.toLowerCase().includes(filterValue))
    );
    this.showCountryDropdown = true;
  }

  selectCountryCode(country: any) {
    this.formData.country_code = country.countryCallingCode;
    this.showCountryDropdown = false;
    this.formData.country = country.countryNameEn;
    this.saveFormData();
  }

  hideCountryDropdown() {
    setTimeout(() => {
      this.showCountryDropdown = false;
      const valid = this.countries.some(c => c.countryCallingCode === this.formData.country_code);
      if (!valid) {
        this.formData.country_code = '';
      }
    }, 200);
  }

  async onPostalCodeChange() {
    if (this.formData.postal_code && this.formData.postal_code.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${this.formData.postal_code}`);
        const data = await response.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          this.formData.state = postOffice.State;
          this.formData.city = postOffice.District;
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
    if (this.postalCodeAutoFilled && this.formData.postal_code.length < 6) {
      this.postalCodeAutoFilled = false;
      this.formData.state = '';
      this.formData.city = '';
    }
  }

  // --- Persistence ---
  saveFormData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('registerFormData', JSON.stringify(this.formData));
    }
  }

  restoreFormData() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('registerFormData');
      if (data) {
        this.formData = { ...this.formData, ...JSON.parse(data) };
      }
    }
  }

  // --- Utility ---
  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      background: 'rgb(17, 24, 39)',
      color: '#fff',
      customClass: {
        popup: 'swal2-sans-serif',
        title: 'swal2-sans-serif',
        htmlContainer: 'swal2-sans-serif',
        confirmButton: 'swal2-sans-serif',
        cancelButton: 'swal2-sans-serif',
        actions: 'swal2-sans-serif'
      }
    });
  }

  isValidLinkedInUrl(url: string): boolean {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;
    return linkedinPattern.test(url);
  }

  isValidWebsiteUrl(url: string): boolean {
    const urlPattern = /^https?:\/\/.+/i;
    return urlPattern.test(url);
  }
}
