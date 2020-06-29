import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reparation-list',
  templateUrl: './reparation-list.component.html',
  styleUrls: ['./reparation-list.component.scss']
})
export class ReparationListComponent implements OnInit {

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

  reparations = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dtTrigger = new Subject();
    this.enSynchronisation = true;

    const db = firebase.firestore();
    db.collection('reparations').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.reparations.push(resultat.data());
      });
      this.dtTrigger.next();
      this.enSynchronisation = false;
    }).catch(() => {
      this.enSynchronisation = false;
    });

  }

  edit(reparation) {
    this.router.navigate(['reparation', 'edit', reparation.id]);
  }
  add() {
    this.router.navigate(['reparation', 'edit']);
  }


}
