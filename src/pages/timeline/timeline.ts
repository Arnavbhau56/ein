import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.css'],
})
export class TimelineComponent implements AfterViewInit {

  constructor(private http: HttpClient, private el: ElementRef) {}

ngAfterViewInit() {
  this.http.get('assets/timeline.svg', { responseType: 'text' }).subscribe(svgContent => {
    const container = this.el.nativeElement.querySelector('.timeline-section');
    container.innerHTML = svgContent;

    // Set specific width and height for the SVG
    const svg = container.querySelector('svg');
if (svg) {
  svg.setAttribute('width', '100%');
  const vw = window.innerWidth;

  if (vw <= 480) {
    svg.style.maxWidth = '95vw';
  } else if (vw <= 760) {
    svg.style.maxWidth = '90vw';
  } else {
    svg.style.maxWidth = '85vw';
  }
}


    const plane = container.querySelector('#plane');
    const path = container.querySelector('#path');

    // Start plane at 180 deg and smaller scale
    gsap.set(plane, {
      rotation: 150,
      scale: 0.4, // Start smaller
      transformOrigin: "center"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none none",
        markers: false, // remove after testing
      }
    });

    tl.to(plane, {
      duration: 4,
      ease: "power1.inOut",
      motionPath: {
        path: path,
        align: path,
        autoRotate: false,
        alignOrigin: [0.5, 0.5],
        start: 0.01,
        end: 1
      }
    }, 0)
    .to(plane, {
      duration: 3.5,
      ease: "power2.inOut",
      rotation: 360,
      transformOrigin: "center"
    }, 0)
    .to(plane, {
      duration: 3.5,
      ease: "back.inOut",
      scale: 0.8, // Scale up to full size
      transformOrigin: "center"
    }, 0);
  });
}

}
