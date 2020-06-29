import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-ravitaillement-list',
  templateUrl: './ravitaillement-list.component.html',
  styleUrls: ['./ravitaillement-list.component.scss']
})
export class RavitaillementListComponent implements OnInit {

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

  ravitaillements = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dtTrigger = new Subject();
    this.enSynchronisation = true;
    const db = firebase.firestore();
    db.collection('ravitaillements').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.ravitaillements.push(resultat.data());
      });
      this.dtTrigger.next();
      this.enSynchronisation = false;
    }).catch(() => {
      this.enSynchronisation = false;
    });
  }

  edit(ravitaillement) {
    this.router.navigate(['ravitaillement', 'edit', ravitaillement.id]);
  }
  add() {
    this.router.navigate(['ravitaillement', 'edit']);
  }

}
