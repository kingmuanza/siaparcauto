import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import * as Metro from 'metro4-dist';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-vehicule-list',
  templateUrl: './vehicule-list.component.html',
  styleUrls: ['./vehicule-list.component.scss']
})
export class VehiculeListComponent implements OnInit {

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

  edit(vehicule) {
    this.router.navigate(['vehicule', 'edit', vehicule.id]);
  }
  addVehicule() {
    this.router.navigate(['vehicule', 'edit']);
  }

}
