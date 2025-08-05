import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { About } from '../about/about';
import { TimelineComponent } from '../timeline/timeline';
import { Structure } from '../structure/structure';
import { Incentives } from "../incentives/incentives";
import { Faq } from '../faq/faq';
import { Guideline } from '../guideline/guideline';
import { Contact } from '../contact/contact';

declare var VANTA: any;

@Component({
  selector: 'app-main',
  imports: [CommonModule, About, TimelineComponent, Structure, Incentives, Faq, Guideline, Contact],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit, OnDestroy {
  menuOpen = false;
  scrolled = false;
  isMobileView = false;
  private vantaEffect: any = null;

  navLinks = [
    { label: 'ABOUT', id: 'ABOUT US' },
    { label: 'BROCHURE', id: 'BENEFITS' },
    { label: 'IMPORTANT DATES', id: 'TIMELINE' },
    { label: 'FAQs', id: 'FAQ' },
    { label: 'CONTACT US', id: 'CONTACT' },
    { label: 'REGISTER', id: 'APPLY', isButton: true }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  onApplyNow() {
    this.router.navigateByUrl('/register');
  }

  onApplyLogin() {
    this.router.navigateByUrl('/login');
  }

  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const navbar = document.querySelector('.navbar');
      const section = document.getElementById(sectionId);
      if (section) {
        const navbarHeight = navbar ? navbar.clientHeight : 0;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionTop - navbarHeight,
          behavior: 'smooth'
        });
      }
    }
  }

  scrollToAboutUs() {
    this.scrollToSection('ABOUT US');
  }

  onNavLinkClick(link: any) {
    if (link.isButton) {
      this.onApplyNow();
    } else if (link.label === 'BROCHURE') {
      // Open ecell.in/seedstars in new tab
      window.open('https://ecell.in/seedstars', '_blank', 'noopener,noreferrer');
    } else {
      this.scrollToSection(link.id === 'ABOUT' ? 'ABOUT US' : link.id);
      this.closeMenuOnNavClick();
    }
  }

  closeMenuOnNavClick() {
    if (this.isMobileView) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled = window.scrollY > 10;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < 700;
      this.handleVantaResize();
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < 700;
      this.handleVantaResize();
      
      // Check if user is already logged in
      const userEmail = localStorage.getItem('iento');
      if (userEmail) {
        // User is logged in, redirect to dashboard
        this.router.navigate(['/dashboard']);
      }
    }
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

  private handleVantaResize() {
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth < 150) {
      // Remove Vanta.js if viewport width is less than 850px
      if (this.vantaEffect) {
        this.vantaEffect.destroy();
        this.vantaEffect = null;
      }
    } else {
      // Initialize Vanta.js if viewport width is 850px or greater
      if (!this.vantaEffect) {
        this.initVantaGlobe();
      }
    }
  }

  private initVantaGlobe() {
    if (isPlatformBrowser(this.platformId) && typeof VANTA !== 'undefined') {
      this.vantaEffect = VANTA.GLOBE({
        el: "#vanta-globe",
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.0,
        scaleMobile: 1.00,
        color: 0xff7b28,
        size: 0.85,
        backgroundColor: 0x222222
      });
    }
  }
}
