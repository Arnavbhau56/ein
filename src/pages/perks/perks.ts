import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

interface Perk {
  order: number;
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-perks',
  imports: [CommonModule],
  templateUrl: './perks.html',
  styleUrl: './perks.css'
})

export class Perks implements OnInit {
  perks: Perk[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    fetch(`${environment.BASE_URL}/perk/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch perks');
        return res.json();
      })
      .then(data => {
        this.perks = Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : [];
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message || 'Error fetching perks';
        this.loading = false;
      });
  }
}
