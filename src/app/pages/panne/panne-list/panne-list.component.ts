import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-panne-list',
  templateUrl: './panne-list.component.html',
  styleUrls: ['./panne-list.component.scss']
})
export class PanneListComponent implements OnInit {

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

  pannes = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dtTrigger = new Subject();
    this.enSynchronisation = true;
    const db = firebase.firestore();
    db.collection('pannes').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.pannes.push(resultat.data());
      });
      this.dtTrigger.next();
      this.enSynchronisation = false;
    }).catch(() => {
      this.enSynchronisation = false;
    });
  }

  edit(panne) {
    this.router.navigate(['panne', 'edit', panne.id]);
  }
  add() {
    this.router.navigate(['panne', 'edit']);
  }

}
