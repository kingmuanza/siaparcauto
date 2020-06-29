import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leasing-list',
  templateUrl: './leasing-list.component.html',
  styleUrls: ['./leasing-list.component.scss']
})
export class LeasingListComponent implements OnInit {


  leasings = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getLeasings();
  }

  getLeasings() {

    const db = firebase.firestore();
    db.collection('leasings').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.leasings.push(resultat.data());
      });
    });

  }

  edit(leasing) {
    this.router.navigate(['leasing', 'edit', leasing.id]);
  }
  addLeasing() {
    this.router.navigate(['leasing', 'edit']);
  }

}
