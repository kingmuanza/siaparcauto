import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import * as Metro from 'metro4-dist';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';


@Component({
  selector: 'app-vehicule-list',
  templateUrl: './vehicule-list.component.html',
  styleUrls: ['./vehicule-list.component.scss']
})
export class VehiculeListComponent implements OnInit {


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

  vehicules = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.enSynchronisation = true;
    this.dtTrigger = new Subject();
    const db = firebase.firestore();
    db.collection('vehicules').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.vehicules.push(resultat.data());
      });
      this.dtTrigger.next();
      this.enSynchronisation = false;
    }).catch((e) => {
      this.enSynchronisation = false;
    });
  }

  edit(vehicule) {
    this.router.navigate(['vehicule', 'edit', vehicule.id]);
  }
  add() {
    this.router.navigate(['vehicule', 'edit']);
  }

}
