import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

interface ContactObj {
  order?: number;
  image: string;
  name: string;
  position: string;
  linkedin: string;
  mail: string;
  phone: string;
  whatsapp?: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  contacts: ContactObj[] = [];
  loading = true;
  error = '';
  faLinkedin = faLinkedin;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faWhatsapp = faWhatsapp;

  ngOnInit() {
    fetch(`${environment.BASE_URL}/contact/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch contacts');
        return res.json();
      })
      .then(data => {
        this.contacts = Array.isArray(data) ? data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message || 'Error fetching contacts';
        this.loading = false;
      });
  }
}
