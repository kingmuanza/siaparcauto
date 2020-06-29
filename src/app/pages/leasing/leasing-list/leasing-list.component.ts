import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-leasing-list',
  templateUrl: './leasing-list.component.html',
  styleUrls: ['./leasing-list.component.scss']
})
export class LeasingListComponent implements OnInit {

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

  leasings = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.leasings = [];
    this.dtTrigger = new Subject();
    this.enSynchronisation = true;
    const db = firebase.firestore();
    db.collection('leasings').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.leasings.push(resultat.data());
      });
      this.enSynchronisation = false;
      this.dtTrigger.next();
    }).catch((e) => {
      this.enSynchronisation = false;
    });
  }

  edit(leasing) {
    this.router.navigate(['leasing', 'edit', leasing.id]);
  }
  add() {
    this.router.navigate(['leasing', 'edit']);
  }

}
