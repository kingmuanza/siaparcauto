import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { notifierSucces, notifierErreur } from '../../../../assets/js/muanza';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-assurance-list',
  templateUrl: './assurance-list.component.html',
  styleUrls: ['./assurance-list.component.scss']
})
export class AssuranceListComponent implements OnInit {


  assurances = [];
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

  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dtTrigger = new Subject();
    console.log('getAssurances()');
    this.enSynchronisation = true;
    const db = firebase.firestore();
    db.collection('assurances').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.assurances.push(resultat.data());
        this.enSynchronisation = false;
      });
      this.dtTrigger.next();
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
