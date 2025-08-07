import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Header } from '../../common/header/header';

// Declare google to avoid TypeScript errors with Google Identity Services
declare var google: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, Header],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is already logged in
    const userEmail = localStorage.getItem('iento');
    if (userEmail) {
      // User is already logged in, redirect to dashboard
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Wait a bit for the Google script to load, then initialize
    setTimeout(() => {
      this.initializeGoogleSignIn();
    }, 1000);
  }

  initializeGoogleSignIn() {
    // Check if Google script is loaded
    if (typeof google === 'undefined') {
      setTimeout(() => {
        this.initializeGoogleSignIn();
      }, 500);
      return;
    }

    if (google.accounts && google.accounts.id) {
      try {
        google.accounts.id.initialize({
          client_id: environment.GOOGLE_CLIENT_ID,
          callback: (response: any) => this.handleGoogleLoginSuccess(response),
          error_callback: (error: any) => this.handleGoogleLoginFailure(error),
        });

        const googleButton = document.getElementById('google-login-container');
        if (googleButton) {
          google.accounts.id.renderButton(
            googleButton,
            { 
              theme: 'filled_blue', 
              size: 'large', 
              shape: 'rectangle',
              type: 'standard', 
              text: 'signin_with',
              width: 250
            }
          );
        } else {
          // Google login button element not found
        }
              } catch (error) {
          Swal.fire(
            'Service Unavailable',
            'Google Login is currently unavailable. Please try again later or contact support.',
            'error'
          );
        }
    } else {
      // Don't show error to user if Google is not configured
      if (environment.GOOGLE_CLIENT_ID && environment.GOOGLE_CLIENT_ID !== 'your-google-client-id-here') {
        Swal.fire(
          'Service Unavailable',
          'Google Login is currently unavailable. Please try again later or contact support.',
          'error'
        );
      }
    }
  }

  handleGoogleLoginSuccess(response: any) {
    const idToken = response.credential;

    // Send Google login request to backend
    fetch(`${environment.BASE_URL}/google-login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken })
    })
    .then(response => response.json())
    .then(data => {
      
      if (data.message && data.message.toLowerCase().includes('login successful')) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Save user email to localStorage for authentication
        if (data.email) {
          localStorage.setItem('iento', data.email);
        }
        
        this.showSuccess('Google login successful!');

        this.router.navigate(['/dashboard']).then(() => {
        }).catch(err => {
        });
      } else {
        // Handle error response
        const errorMessage = data.error || data.message || data.detail || 'Google login failed. Please try again.';
        this.showError(errorMessage);
      }
    })
    .catch(err => {
      
      if (err.status === 404 ||
          (err.error && (typeof err.error.message === 'string' && err.error.message.toLowerCase().includes('user not found'))) ||
          (err.error && (typeof err.error.detail === 'string' && err.error.detail.toLowerCase().includes('user not found'))) ||
          (err.error && (typeof err.error.error === 'string' && err.error.error.toLowerCase().includes('user not found')))) {
        Swal.fire(
          'Registration Required',
          'This Google account is not registered with us. Please register first.',
          'warning'
        );
      } else {
        const errorMessage = err.error?.error || err.error?.message || err.error?.detail || err.message || 'Google login failed. Please try again.';
        Swal.fire('Login Failed', errorMessage, 'error');
      }
    });
  }

  handleGoogleLoginFailure(error: any) {
    let message = 'Google Sign-In failed. Please try again.';
    if (error) {
        if (error.type === 'popup_closed_by_user' || error.reason === 'popup_closed_by_user' || error.error === 'popup_closed') {
            message = 'Google Sign-In was cancelled by the user.';
        } else if (error.type === 'access_denied' || error.reason === 'access_denied' || error.error === 'access_denied') {
            message = 'Access to Google Sign-In was denied.';
        } else if (error.details) {
            message = `Google Sign-In failed: ${error.details}`;
        }
    }
    Swal.fire('Google Sign-In Error', message, 'error');
  }

  async onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.showError('Please fill in all fields.');
      return;
    }

    this.isLoading = true;

    try {
      const response = await fetch(`${environment.BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.loginData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Save user email to localStorage for authentication
        localStorage.setItem('iento', this.loginData.email);
        
        this.showSuccess('Login successful!');

        this.router.navigate(['/dashboard']).then(() => {
        }).catch(err => {
        });
      } else {
        // Check for "User not found" message
        if (data.message && data.message.toLowerCase().includes('user not found')) {
          Swal.fire({
            icon: 'warning',
            title: 'Registration Required',
            text: 'This account is not registered with us. Please register first.',
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
        } else {
          // Extract error message from backend response
          const errorMessage = data.error || data.message || data.detail || data.msg || 'Login failed. Please check your credentials.';
          this.showError(errorMessage);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Network error. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  navigateToRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  navigateToReset(event: Event) {
    event.preventDefault();
    this.router.navigate(['/reset-password']);
  }

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
