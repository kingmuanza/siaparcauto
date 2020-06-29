import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { notifierSucces, notifierErreur } from '../../../../assets/js/muanza';

@Component({
  selector: 'app-assurance-list',
  templateUrl: './assurance-list.component.html',
  styleUrls: ['./assurance-list.component.scss']
})
export class AssuranceListComponent implements OnInit {


  assurances = [];
  enSynchronisation = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.getAssurances();
  }

  getAssurances() {
    console.log('getAssurances()');
    this.enSynchronisation = true;
    const db = firebase.firestore();
    db.collection('assurances').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.assurances.push(resultat.data());
        this.enSynchronisation = false;
      });
    }).catch((e) => {
      console.log('errueur');
      console.log(e);
      this.enSynchronisation = false;
      notifierErreur('Impossible de récupérer les informations');
    }).finally(() => {
      console.log('Finallement');
      this.enSynchronisation = false;
    });

  }

  edit(assurance) {
    this.router.navigate(['assurance', 'edit', assurance.id]);
  }
  add() {
    this.router.navigate(['assurance', 'edit']);
  }

}
