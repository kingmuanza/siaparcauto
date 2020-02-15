import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conducteur-list',
  templateUrl: './conducteur-list.component.html',
  styleUrls: ['./conducteur-list.component.scss']
})
export class ConducteurListComponent implements OnInit {

  conducteurs = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getConducteurs();
  }

  getConducteurs() {
    const db = firebase.firestore();
    db.collection('conducteurs').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.conducteurs.push(resultat.data());
      });
    });
  }

  edit(conducteur) {
    this.router.navigate(['conducteur', 'edit', conducteur.id]);
  }

}
