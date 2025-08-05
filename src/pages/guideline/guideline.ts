import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

interface GuidelineItem {
  order: number;
  guideline: string;
}

@Component({
  selector: 'app-guideline',
  imports: [CommonModule],
  templateUrl: './guideline.html',
  styleUrl: './guideline.css'
})
export class Guideline implements OnInit {
  guidelineItems: GuidelineItem[] = [];
  isLoading: boolean = true;
  error: string = '';

  ngOnInit() {
    this.fetchGuidelineData();
  }

  async fetchGuidelineData() {
    try {
      this.isLoading = true;
      this.error = '';
      
      const response = await fetch(`${environment.BASE_URL}/guideline/`);
      const data = await response.json();
      
      if (response.ok) {
        this.guidelineItems = data;
        // Sort by order if provided
        this.guidelineItems.sort((a, b) => a.order - b.order);
      } else {
        this.error = 'Failed to load guidelines';
      }
    } catch (error: any) {
      this.error = 'Network error. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }
}
