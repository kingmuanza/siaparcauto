import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ravitaillement-list',
  templateUrl: './ravitaillement-list.component.html',
  styleUrls: ['./ravitaillement-list.component.scss']
})
export class RavitaillementListComponent implements OnInit {


  ravitaillements = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getRavitaillements();
  }

  getRavitaillements() {

    const db = firebase.firestore();
    db.collection('ravitaillements').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.ravitaillements.push(resultat.data());
      });
    });

  }

  edit(ravitaillement) {
    this.router.navigate(['ravitaillement', 'edit', ravitaillement.id]);
  }
  addRavitaillement() {
    this.router.navigate(['ravitaillement', 'edit']);
  }

}
