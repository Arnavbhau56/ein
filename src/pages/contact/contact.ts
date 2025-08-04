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
      name: 'Sunil Meena',
      designation: 'Hospitality and PR head',
      whatsapp: 'https://wa.me/919319401143',
      linkedin: 'https://www.linkedin.com/in/sunil57/',
      image: 'assets/Sunil.jpeg',
      mail: 'mailto:user@sunil@ecell.in',
    },
    {
      name: 'Vaibhav Semwal',
      designation: 'Operations Head',
      whatsapp: 'https://wa.me/917065995990',
      linkedin: 'https://www.linkedin.com/in/vaibhav-semwal-48aa50293/',
      image: 'assets/Semwal.jpeg',
      mail: 'mailto:user@vaibhavsemwal@ecell.in',
    },
    {
      name: 'Arnav Gautam',
      designation: 'Web and Tech Head',
      image: 'assets/Arnav.jpeg',
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
