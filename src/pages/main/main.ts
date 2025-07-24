import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { About } from '../about/about';
import { Perks } from '../perks/perks';
import { Timeline } from '../timeline/timeline';
import { Investor } from '../investor/investor';
import { Faq } from '../faq/faq';
import { isPlatformBrowser } from '@angular/common';
import { Contact } from '../contact/contact';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [CommonModule, About, Perks, Timeline, Investor, Faq, Contact],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  menuOpen = false;
  scrolled = false;
  isMobileView = false;

  navLinks = [
    { label: 'ABOUT US', id: 'ABOUT US' },
    { label: 'BENEFITS', id: 'BENEFITS' },
    { label: 'TIMELINE', id: 'TIMELINE' },
    { label: 'PREVIOUS INVESTORS', id: 'PREVIOUS' },
    { label: 'FAQ', id: 'FAQ' },
    { label: 'CONTACT US', id: 'CONTACT' },
    { label: 'APPLY NOW', id: 'APPLY', isButton: true }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  onApplyNow() {
    this.router.navigateByUrl('/register');
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
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < 700;
    }
  }
}
