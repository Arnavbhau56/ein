import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class Faq implements OnInit, AfterViewInit {

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    console.log('FAQ component initialized');
    this.initializeAccordion();
  }

  private initializeAccordion() {
    console.log('Initializing accordion...');
    const headers = document.querySelectorAll(".accordion-header");
    console.log('Found accordion headers:', headers.length);
    
    headers.forEach((header, index) => {
      console.log(`Setting up header ${index + 1}:`, header.textContent);
      
      header.addEventListener("click", (event) => {
        console.log('Accordion header clicked:', header.textContent);
        event.preventDefault();
        event.stopPropagation();
        
        // Get the content element
        const content = header.nextElementSibling as HTMLElement;
        console.log('Content element found:', !!content);
        
        // Check if this accordion is already open
        const isOpen = header.classList.contains("active");
        console.log('Is currently open:', isOpen);
        
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
          console.log('Closing accordion');
          header.classList.remove("active");
          if (content) {
            content.style.maxHeight = "0px";
          }
        } else {
          // Open
          console.log('Opening accordion');
          header.classList.add("active");
          if (content) {
            const scrollHeight = content.scrollHeight;
            console.log('Setting maxHeight to:', scrollHeight + "px");
            content.style.maxHeight = scrollHeight + "px";
          }
        }
      });
    });
  }
}
