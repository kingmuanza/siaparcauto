import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicule-suivi',
  templateUrl: './vehicule-suivi.component.html',
  styleUrls: ['./vehicule-suivi.component.scss']
})
export class VehiculeSuiviComponent implements OnInit {

  vehicules = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getVehicules();
  }

  getVehicules() {
    const db = firebase.firestore();
    db.collection('vehicules').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.vehicules.push(resultat.data());
      });
    });
  }

  view(vehicule) {
    this.router.navigate(['vehicules', vehicule.id]);
  }

}
