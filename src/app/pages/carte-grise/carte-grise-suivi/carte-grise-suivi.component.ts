import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Vehicule } from 'src/app/models/vehicule.model';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-carte-grise-suivi',
  templateUrl: './carte-grise-suivi.component.html',
  styleUrls: ['./carte-grise-suivi.component.scss']
})
export class CarteGriseSuiviComponent implements OnInit {

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

  vehicules = new Array<Vehicule>();
  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dtTrigger = new Subject();
    this.enSynchronisation = true;
    const db = firebase.firestore();
    db.collection('vehicules').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        const vehicule = resultat.data() as Vehicule;
        this.vehicules.push(vehicule);
      });
      this.vehicules = this.vehicules.filter((vehicule) => {
        if (vehicule.dateFinCarteGrise) {

          const dateLimite = new Date(vehicule.dateFinCarteGrise);
          const diff = this.differencesEnjour(dateLimite);
          return diff + 20 > 0;
        } else {
          return true;
        }
      });
      this.vehicules.sort((a, b) => {
        if (!a.dateFinCarteGrise) {
          return 0;
        }
        if (!a.dateFinCarteGrise) {
          return -1;
        }
        return new Date(a.dateFinCarteGrise).getTime() > new Date(b.dateFinCarteGrise).getTime() ? 1 : -1;
      });
      this.enSynchronisation = false;
      this.dtTrigger.next();
    }).catch(() => {
      this.enSynchronisation = false;
      this.dtTrigger.next();
    });
  }

  differencesEnjour(dateLimite: Date): number {
    const difference = new Date().getTime() - new Date(dateLimite).getTime();
    const differenceEnSecondes = (difference / 1000);
    const differenceEnHeures = (differenceEnSecondes / 3600);
    const differenceEnJours = Math.ceil(differenceEnHeures / 24);
    return differenceEnJours;
  }

  add() {

  }

  voir(vehicule: Vehicule) {
    this.router.navigate(['cartesgrises', vehicule.id]);
  }
}
