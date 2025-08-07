import { Component, Input, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < 700;
      this.scrolled = window.pageYOffset > 10 || document.documentElement.scrollTop > 10;
    }
  }

  onNavLinkClick(link: any) {
    if (link.isButton) {
      this.router.navigate(['/register']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else if (link.label === 'BROCHURE') {
      window.open('https://ecell.in/seedstars', '_blank', 'noopener,noreferrer');
    } else {
      if (this.router.url === '/') {
        setTimeout(() => this.scrollToSection(link.id === 'ABOUT' ? 'ABOUT US' : link.id), 100);
      } else {
        this.router.navigate(['/']).then(() => {
          setTimeout(() => this.scrollToSection(link.id === 'ABOUT' ? 'ABOUT US' : link.id), 300);
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
}
