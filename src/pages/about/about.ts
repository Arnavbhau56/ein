import { Component, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements AfterViewInit {
  private startupTarget = 300;
  private investorTarget = 18;
  private startupDuration = 1200; // ms
  private investorDuration = 1200; // ms
  private observer?: IntersectionObserver;

  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter('startupCount', this.startupTarget, this.startupDuration);
            this.animateCounter('investorCount', this.investorTarget, this.investorDuration);
            this.observer?.disconnect();
          }
        });
      }, { threshold: 0.3 });
      const aboutSection = document.querySelector('.about-section');
      if (aboutSection) {
        this.observer.observe(aboutSection);
      }
    }
  }

  private animateCounter(id: string, target: number, duration: number) {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(id);
      if (!el) return;
      let start = 0;
      const step = (timestamp: number, startTime: number) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value.toString();
        if (progress < 1) {
          this.ngZone.runOutsideAngular(() => {
            requestAnimationFrame(ts => step(ts, startTime));
          });
        } else {
          el.textContent = target.toString();
        }
      };
      requestAnimationFrame(ts => step(ts, ts));
    }
  }
}
