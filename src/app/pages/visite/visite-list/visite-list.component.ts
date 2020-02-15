import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visite-list',
  templateUrl: './visite-list.component.html',
  styleUrls: ['./visite-list.component.scss']
})
export class VisiteListComponent implements OnInit {

  visites = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getVisites();
  }

  getVisites() {

    const db = firebase.firestore();
    db.collection('visites').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.visites.push(resultat.data());
      });
    });

  }

  edit(visite) {
    this.router.navigate(['visite', 'edit', visite.id]);
  }
  addVisite() {
    this.router.navigate(['visite', 'edit']);
  }

}
