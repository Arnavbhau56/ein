import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { FooterComponent } from '../common/footer/footer';
import { SidebarComponent } from '../common/sidebar/sidebar';
import { Header } from '../common/header/header';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, SidebarComponent, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'iento';
  showHeader = false;
  showLogout = false;
  showNavLinks = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateHeaderVisibility(event.url);
    });
  }

  private updateHeaderVisibility(url: string) {
    const showHeaderRoutes = ['/login', '/register', '/reset', '/dashboard'];
    const navLinkRoutes = ['/', '/login', '/register', '/reset'];
    
    this.showHeader = showHeaderRoutes.some(route => url.startsWith(route));
    this.showLogout = url.startsWith('/dashboard');
    this.showNavLinks = navLinkRoutes.some(route => url.startsWith(route));
  }
}
