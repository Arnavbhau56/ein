import { Component, Pipe } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Pipe({
  name: 'formatContact',
  standalone: true,
  pure: true,
})
export class FormatContactPipe {
  transform(value: string): string {
    return value.replace(/\+(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
  }
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormatContactPipe, FontAwesomeModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})

export class Contact {
  // Font Awesome icons
  faWhatsapp = faWhatsapp;
  faEnvelope = faEnvelope;
  faLinkedin = faLinkedin;

  CONTACTS = [
    {
      name: 'Mehul Bafna',
      title: 'Events & PR Head',
      email: 'mehul@ecell.in',
      phone: '+919214247600',
      image: 'https://2k21.s3.amazonaws.com/images/Bafna.jpeg',
      linkedin: 'mehul-bafna-849390294',
    },

    {
      name: 'Prathmesh Walimbe',
      title: 'Events & PR Head',
      email: 'prathmesh@ecell.in',
      phone: '+917083707680',
      image: 'https://2k21.s3.amazonaws.com/images/Walimbe.jpeg',
      linkedin: 'prathmeshwalimbe28',
    },

    //  {
    //   name: 'Ved Patil',
    //   title: 'Marketing Head',
    //   email: 'ved@ecell.in',
    //   phone: '+918459403210',
    //   image: 'https://2k21.s3.amazonaws.com/images/Ved.jpeg',
    //   linkedin: 'vedvpatil',
    // },

    {
      name: 'Arnav Gautam',
      title: 'Web & Tech Head',
      email: 'arnavgautam@ecell.in',
      phone: '+919414454858',
      image: 'https://www.ecell.in/ca/img/arnav.png',
      linkedin: 'arnav-gautam-570553289',
    },
    {
      name: 'Bhavesh Chandra',
      title: 'Design Head',
      email: 'bhaveshchandra@ecell.in',
      phone: '+919347964686',
      image: 'https://2k21.s3.amazonaws.com/images/bhavesh_p9c0kmo.png',
      linkedin: 'bhavesh-chandra-kampa-133371286',
    },
  ];
}