import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Instructions } from '../instructions/instructions';

interface PersonalDetails {
  poc_first_name: string;
  poc_last_name: string;
  school_city: string;
  school_state: string;
  school_address: string;
  email: string;
  contact: string;
  school_id: string;
  exam_date: string;
  csv_status: string;
  csv_issue?: string;
  students_number?: number;
  students_details?: {
    [key: string]: number;
  };
}

interface UpdateItem {
  order: number;
  title: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, Instructions],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  userEmail: string = '';
  personalDetails: PersonalDetails | null = null;
  updates: UpdateItem[] = [];
  isLoading: boolean = true;
  error: string = '';

  // Modal properties
  showUpdateModal: boolean = false;
  updateFormData: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    // Check if user is authenticated
    const userEmail = localStorage.getItem('iento');
    if (!userEmail) {
      // User is not authenticated, redirect to login
      this.router.navigate(['/login']);
      return;
    }
    
    this.userEmail = userEmail;
    this.fetchDashboardData();
  }

  async fetchDashboardData() {
    try {
      this.isLoading = true;
      this.error = '';

      // Fetch personal details with email from localStorage
      const userEmail = localStorage.getItem('iento');
      if (!userEmail) {
        this.showError('User email not found');
        return;
      }
      const detailsResponse = await fetch(`${environment.BASE_URL}/get-details/?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const detailsData = await detailsResponse.json();

      if (detailsResponse.ok) {
        this.personalDetails = detailsData;
      } else {
        this.showError('Failed to load personal details');
        return;
      }

      // Fetch updates
      const updatesResponse = await fetch(`${environment.BASE_URL}/update/`);
      const updatesData = await updatesResponse.json();

      if (updatesResponse.ok) {
        this.updates = updatesData.sort((a: UpdateItem, b: UpdateItem) => a.order - b.order);
      } else {
        this.showError('Failed to load updates');
      }

    } catch (error: any) {
      this.showError('Network error. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  openUpdateModal() {
    if (this.personalDetails) {
      this.updateFormData = { ...this.personalDetails };
      this.showUpdateModal = true;
    }
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.updateFormData = {};
  }

  async updatePersonalDetails() {
    try {
      // Only send the form data from modal and email
      const updateData = {
        poc_first_name: this.updateFormData.poc_first_name,
        poc_last_name: this.updateFormData.poc_last_name,
        contact: this.updateFormData.contact,
        school_id: this.updateFormData.school_id,
        school_city: this.updateFormData.school_city,
        school_state: this.updateFormData.school_state,
        school_address: this.updateFormData.school_address,
        exam_date: this.updateFormData.exam_date,
        email: this.userEmail // Add email from localStorage
      };
      
      const response = await fetch(`${environment.BASE_URL}/update-details/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        this.showSuccess('Details updated successfully!');
        this.closeUpdateModal();
        this.fetchDashboardData(); // Refresh data
      } else {
        const errorMessage = data.error || data.message || data.detail || data.msg || 'Update failed.';
        this.showError(errorMessage);
      }
    } catch (error: any) {
      this.showError('Network error. Please try again.');
    }
  }

  handleCSVUpload() {
    if (this.personalDetails?.csv_status === 'verified') {
      this.showError('Contact Team E-Cell to change it');
      return;
    }
  }

  async uploadCSV(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.showError('Please select a CSV file.');
      return;
    }

    // Check if exam_date is null or empty
    if (!this.personalDetails?.exam_date) {
      this.showError('Please fill Exam Date first.');
      return;
    }

    // Show confirmation dialog before uploading
    const result = await Swal.fire({
      title: 'Confirm CSV Upload',
      text: 'You would not be able to change it further. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary-green)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload',
      cancelButtonText: 'Cancel',
      background: '#222',
      color: '#fff',
      customClass: {
        popup: 'swal2-dark',
        title: 'swal2-dark',
        htmlContainer: 'swal2-dark',
        confirmButton: 'swal2-dark',
        cancelButton: 'swal2-dark'
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('csv_file', file);
      formData.append('email', this.userEmail); // Add email to form data

      const response = await fetch(`${environment.BASE_URL}/upload-csv/`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        this.showSuccess('CSV uploaded successfully!');
        this.fetchDashboardData(); // Refresh data
      } else {
        const errorMessage = data.error || data.message || data.detail || data.msg || 'CSV upload failed.';
        this.showError(errorMessage);
      }
    } catch (error: any) {
      this.showError('Network error. Please try again.');
    }
  }

  downloadTemplateCSV() {
    window.open('https://docs.google.com/spreadsheets/d/1jdOcFhi1qCQwJeREQ8a36BmRptCOnO1EK-BrbUY77hc/edit?gid=0#gid=0', '_blank');
  }

  logout() {
    // Clear all stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_track');
    localStorage.removeItem('iento');
    
    // Navigate back to login
    this.router.navigate(['/login']);
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

  getCsvStatusText(status: string): string {
    switch (status) {
      case 'not_uploaded':
        return 'Not Uploaded';
      case 'uploaded_verification_pending':
        return 'Uploaded but Verification Pending';
      case 'verified':
        return 'Verified';
      case 'issue':
        return 'Issue';
      default:
        return status;
    }
  }

  getStudentClassData(): Array<{class: string, count: number}> {
    if (!this.personalDetails?.students_details) {
      return [];
    }
    
    return Object.entries(this.personalDetails.students_details)
      .map(([classNum, count]) => ({
        class: classNum,
        count: count
      }))
      .sort((a, b) => parseInt(a.class) - parseInt(b.class));
  }

  showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      background: '#222',
      color: '#fff',
      confirmButtonColor: 'var(--primary-green)',
      timer: 2000,
      showConfirmButton: false
    });
  }
}
