import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

interface InvestorObj {
  order?: number;
  image: string;
  name: string;
  position: string;
}

@Component({
  selector: 'app-investor',
  imports: [CommonModule],
  templateUrl: './investor.html',
  styleUrl: './investor.css'
})

export class Investor implements OnInit {
  investors: InvestorObj[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    fetch(`${environment.BASE_URL}/investor/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch investors');
        return res.json();
      })
      .then(data => {
        this.investors = Array.isArray(data) ? data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message || 'Error fetching investors';
        this.loading = false;
      });
  }
}
