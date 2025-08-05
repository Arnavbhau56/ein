import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

interface Perk {
  order: number;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-incentives',
  imports: [CommonModule],
  templateUrl: './incentives.html',
  styleUrl: './incentives.css'
})
export class Incentives implements OnInit {
  perks: Perk[] = [];
  loading = true;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPerks();
  }

  fetchPerks() {
    this.http.get<Perk[]>(`${environment.BASE_URL}/perk/`)
      .subscribe({
        next: (data) => {
          this.perks = data.sort((a, b) => a.order - b.order);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching perks:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }
}
