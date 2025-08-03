import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(private router: Router) {}

  logout() {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    
    // Navigate back to login
    this.router.navigate(['/login']);
  }
}
