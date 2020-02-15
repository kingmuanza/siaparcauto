import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-affectation-list',
  templateUrl: './affectation-list.component.html',
  styleUrls: ['./affectation-list.component.scss']
})
export class AffectationListComponent implements OnInit {

  affectations = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getAffectations();
  }

  getAffectations() {

    const db = firebase.firestore();
    db.collection('affectations').orderBy('date', 'desc').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.affectations.push(resultat.data());
      });
    });

  }

  edit(affectation) {
    this.router.navigate(['affectation', 'edit', affectation.id]);
  }
  addAffectation() {
    this.router.navigate(['affectation', 'edit']);
  }
}
