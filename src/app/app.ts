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
    console.log('AOS: About to initialize');
    AOS.init({
      duration: 700,
      once: false,
      easing: 'ease-in-out',
    });
    console.log('AOS: Initialized');

    setTimeout(() => {
      console.log('AOS: About to refresh');
      AOS.refresh();
      console.log('AOS: Refreshed');
    }, 1000);
  }
}
