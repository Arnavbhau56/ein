import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

interface FaqItem {
  order: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class Faq implements OnInit {
  faqs: FaqItem[] = [];
  loading = true;
  error = '';
  openIndex: number | null = null;

  ngOnInit() {
    fetch(`${environment.BASE_URL}/faq/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch FAQs');
        return res.json();
      })
      .then(data => {
        this.faqs = Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : [];
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message || 'Error fetching FAQs';
        this.loading = false;
      });
  }

  toggleAccordion(idx: number) {
    this.openIndex = this.openIndex === idx ? null : idx;
  }
}
