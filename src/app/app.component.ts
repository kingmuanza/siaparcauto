import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Utilisateur } from './models/utilisateur.model';
import { Subscription } from 'rxjs';
import { IdentificationService } from './services/identification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'siaparcauto';

  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;


  constructor(private idService: IdentificationService) {
    const firebaseConfig = {
      apiKey: 'AIzaSyBlQS7MB361WSkOlyJrty2c-1BmfNAwg3s',
      authDomain: 'siaparcauto.firebaseapp.com',
      databaseURL: 'https://siaparcauto.firebaseio.com',
      projectId: 'siaparcauto',
      storageBucket: 'siaparcauto.appspot.com',
      messagingSenderId: '273031909976',
      appId: '1:273031909976:web:a780fd75f6c3ca68ab702d',
      measurementId: 'G-NBY4CQV2P9'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  ngOnInit() {
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }
}
