import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-kilometrage-list',
  templateUrl: './kilometrage-list.component.html',
  styleUrls: ['./kilometrage-list.component.scss']
})
export class KilometrageListComponent implements OnInit {

  dtTrigger = new Subject();
  dtOptions = {
    dom: 'Bfrtip',
    buttons: [
      {
        text: 'Nouveau',
        action: (e, dt, node, config) => {
          this.add();
        },
        className: 'button muanza'
      },
      {
        text: 'Actualiser',
        action: (e, dt, node, config) => {
          this.refresh();
        },
        className: 'button muanza'
      },
      { extend: 'print', text: 'Imprimer', className: 'button muanza' },
      { extend: 'excel', text: 'Export vers Excel', className: 'button muanza' },
    ],
    language: DATATABLES_OPTIONS_LANGUAGE
  };
  enSynchronisation = false;

  kilometrages = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dtTrigger = new Subject();
    this.enSynchronisation = true;
    const db = firebase.firestore();
    db.collection('kilometrages').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.kilometrages.push(resultat.data());
      });
      this.enSynchronisation = false;
      this.dtTrigger.next();
    }).catch((e) => {
      this.enSynchronisation = false;
    });
  }

  edit(kilometrage) {
    this.router.navigate(['kilometrage', 'edit', kilometrage.id]);
  }
  add() {
    this.router.navigate(['kilometrage', 'edit']);
  }

}
