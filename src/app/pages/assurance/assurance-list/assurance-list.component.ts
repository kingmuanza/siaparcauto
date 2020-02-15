import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assurance-list',
  templateUrl: './assurance-list.component.html',
  styleUrls: ['./assurance-list.component.scss']
})
export class AssuranceListComponent implements OnInit {


  assurances = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getAssurances();
  }

  getAssurances() {

    const db = firebase.firestore();
    db.collection('assurances').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.assurances.push(resultat.data());
      });
    });

  }

  edit(assurance) {
    this.router.navigate(['assurance', 'edit', assurance.id]);
  }
  addAssurance() {
    this.router.navigate(['assurance', 'edit']);
  }

}
