import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kilometrage-list',
  templateUrl: './kilometrage-list.component.html',
  styleUrls: ['./kilometrage-list.component.scss']
})
export class KilometrageListComponent implements OnInit {

  kilometrages = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getKilometrages();
  }

  getKilometrages() {

    const db = firebase.firestore();
    db.collection('kilometrages').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.kilometrages.push(resultat.data());
      });
    });

  }

  edit(kilometrage) {
    this.router.navigate(['kilometrage', 'edit', kilometrage.id]);
  }
  addKilometrage() {
    this.router.navigate(['kilometrage', 'edit']);
  }

}
