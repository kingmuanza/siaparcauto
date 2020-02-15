import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reparation-list',
  templateUrl: './reparation-list.component.html',
  styleUrls: ['./reparation-list.component.scss']
})
export class ReparationListComponent implements OnInit {

  reparations = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getReparations();
  }

  getReparations() {

    const db = firebase.firestore();
    db.collection('reparations').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.reparations.push(resultat.data());
      });
    });

  }

  edit(reparation) {
    this.router.navigate(['reparation', 'edit', reparation.id]);
  }
  addReparation() {
    this.router.navigate(['reparation', 'edit']);
  }


}
