import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panne-list',
  templateUrl: './panne-list.component.html',
  styleUrls: ['./panne-list.component.scss']
})
export class PanneListComponent implements OnInit {


  pannes = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getPannes();
  }

  getPannes() {

    const db = firebase.firestore();
    db.collection('pannes').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.pannes.push(resultat.data());
      });
    });

  }

  edit(panne) {
    this.router.navigate(['panne', 'edit', panne.id]);
  }
  addPanne() {
    this.router.navigate(['panne', 'edit']);
  }

}
