import { Component, Input, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  @Input() showLogout: boolean = false;
  @Input() showNavLinks: boolean = false;
  menuOpen = false;
  scrolled = false;

  isMobileView = false;

  navLinks = [
    { label: 'ABOUT', id: 'ABOUT US' },
    { label: 'BROCHURE', id: 'BENEFITS' },
    { label: 'IMPORTANT DATES', id: 'TIMELINE' },
    { label: 'FAQs', id: 'FAQ' },
    { label: 'CONTACT US', id: 'CONTACT' },
    { label: 'REGISTER', id: 'APPLY', isButton: true }
  ];

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('iento');
  }

  get isDashboard(): boolean {
    return this.router.url.startsWith('/dashboard');
  }

  get isMainPage(): boolean {
    return this.router.url === '/';
  }

  get computedNavLinks() {
    if (!this.showNavLinks) {
      return [];
    }
    if (this.isDashboard) {
      return this.navLinks.filter(link => link.label !== 'REGISTER');
    }
    // On main page and logged in, replace REGISTER with DASHBOARD
    if (this.isMainPage && this.isLoggedIn) {
      return this.navLinks.map(link =>
        link.label === 'REGISTER'
          ? { ...link, label: 'DASHBOARD', id: 'DASHBOARD' }
          : link
      );
    }
    return this.navLinks;
  }

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < 700;
      this.scrolled = window.pageYOffset > 10 || document.documentElement.scrollTop > 10;
    }
  }

  onNavLinkClick(link: any) {
    console.log('Click detected:', link.label);
    if (link.isButton) {
      if (link.label === 'DASHBOARD') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/register']).then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    } else if (link.label === 'BROCHURE') {
      window.open('https://ecell.in/seedstars', '_blank', 'noopener,noreferrer');
    } else {
      const sectionId = link.id === 'ABOUT' ? 'ABOUT US' : link.id;
      
      if (this.router.url === '/') {
        this.scrollToSection(sectionId);
      } else {
        // Navigate to main page first, then scroll
        this.router.navigateByUrl('/').then(() => {
          // Wait for navigation and DOM to be ready
          setTimeout(() => {
            this.scrollToSection(sectionId);
          }, 300);
        });
      }
      this.closeMenuOnNavClick();
    }
  }

  closeMenuOnNavClick() {
    if (this.isMobileView) {
      this.menuOpen = false;
    }
  }

  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const navbar = document.querySelector('.navbar');
      let lastTop: number | null = null;
      let attempts = 0;
      const maxAttempts = 40; // 2s
      const tryScroll = () => {
        const section = document.getElementById(sectionId);
        if (section) {
          // First, use scrollIntoView for best browser support
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // After a short delay, adjust for navbar height
          setTimeout(() => {
            const navbarHeight = navbar ? navbar.clientHeight : 0;
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            const scrollTarget = sectionTop - navbarHeight - 5;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll - scrollTarget < 30) {
              window.scrollTo({ top: maxScroll, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
            }
          }, 200);
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryScroll, 50);
        }
      };
      tryScroll();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
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

  logout(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('iento');
    this.closeMenu();
    this.router.navigate(['/']);
  }

  goToDashboard(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/dashboard']);
    this.closeMenu();
  }
}
