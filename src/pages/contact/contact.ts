import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})

export class Contact {
  teamMembers = [
    {
      name: 'Mehul Bafna',
      designation: 'Events and PR head',
      whatsapp: 'https://wa.me/917738447760',
      linkedin: 'https://www.linkedin.com/in/sunil57/',
      image: 'assets/Mehul.jpeg',
      mail: 'mailto:user@mehul@ecell.in',
    },
    {
      name: 'Prathmesh Walimbe',
      designation: 'Events and PR Head',
      whatsapp: 'https://wa.me/917083707680',
      linkedin: 'https://www.linkedin.com/in/prathmeshwalimbe28/',
      image: 'assets/Walimbe.jpeg',
      mail: 'mailto:user@prathmesh@ecell.in',
    },
    {
      name: 'Arnav Gautam',
      designation: 'Web and Tech Head',
      image: 'assets/arnav.jpeg',
      whatsapp: 'https://wa.me/919414454858',
      linkedin: 'https://www.linkedin.com/in/arnav-gautam-570553289/',
      mail: 'mailto:user@arnavgautam@ecell.in',
    },
    {
      name: 'Bhavesh Kampa',
      designation: 'Design Head',
      image: 'assets/bhavesh.png',
      whatsapp: 'https://wa.me/919347964686',
      linkedin: 'https://www.linkedin.com/in/bhavesh-chandra-kampa-133371286/',
      mail: 'mailto:user@bhavesh@ecell.in',
    }
  ];
}
