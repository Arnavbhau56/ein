import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../common/footer/footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected title = 'seedstars';

  ngAfterViewInit() {
    AOS.init({
      duration: 700,
      once: false,
      easing: 'ease-in-out',
    });

    setTimeout(() => AOS.refresh(), 1000);
  }
}
