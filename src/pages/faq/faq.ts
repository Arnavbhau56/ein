import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

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
export class Faq implements OnInit, AfterViewInit {
  faqItems: FaqItem[] = [];
  isLoading: boolean = true;
  error: string = '';

  ngOnInit() {
    this.fetchFaqData();
  }

  ngAfterViewInit() {
    // Initialize accordion after data is loaded
    this.initializeAccordionAfterDataLoad();
  }

  async fetchFaqData() {
    try {
      this.isLoading = true;
      this.error = '';
      
      const response = await fetch(`${environment.BASE_URL}/faq/`);
      const data = await response.json();
      
      if (response.ok) {
        this.faqItems = data;
        // Sort by order if provided
        this.faqItems.sort((a, b) => a.order - b.order);
        // Initialize accordion after data is loaded
        setTimeout(() => {
          this.initializeAccordion();
        }, 100);
      } else {
        this.error = 'Failed to load FAQ data';
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

  private initializeAccordionAfterDataLoad() {
    // This method is called from ngAfterViewInit but we'll handle initialization in fetchFaqData
  }

  private initializeAccordion() {
    const headers = document.querySelectorAll(".accordion-header");
    
    headers.forEach((header, index) => {
      header.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        // Get the content element
        const content = header.nextElementSibling as HTMLElement;
        
        // Check if this accordion is already open
        const isOpen = header.classList.contains("active");
        
        // Close all other accordions
        const allHeaders = document.querySelectorAll(".accordion-header");
        allHeaders.forEach((otherHeader) => {
          if (otherHeader !== header) {
            otherHeader.classList.remove("active");
            const otherContent = otherHeader.nextElementSibling as HTMLElement;
            if (otherContent) {
              otherContent.style.maxHeight = "0px";
            }
          }
        });
        
        // Toggle current accordion
        if (isOpen) {
          // Close
          header.classList.remove("active");
          if (content) {
            content.style.maxHeight = "0px";
          }
        } else {
          // Open
          header.classList.add("active");
          if (content) {
            const scrollHeight = content.scrollHeight;
            content.style.maxHeight = scrollHeight + "px";
          }
        }
      });
    });
  }
}
