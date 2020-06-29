import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Visite } from 'src/app/models/visite.technique.model';
import { Vehicule } from 'src/app/models/vehicule.model';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-visite-suivi',
  templateUrl: './visite-suivi.component.html',
  styleUrls: ['./visite-suivi.component.scss']
})
export class VisiteSuiviComponent implements OnInit {

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

  visites = new Array<Visite>();

  constructor(private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  async synchronisation() {
    this.enSynchronisation = true;
    for (let i = 0; i < this.visites.length; i++) {
      const visite = this.visites[i];
      visite.vehicule = await this.getVehicule(visite.vehicule.id);
    }
    this.enSynchronisation = false;
  }

  async getVehicule(id: string): Promise<Vehicule> {
    const db = firebase.firestore();
    const resultat = await db.collection('vehicules').doc(id).get();
    const vehicule = resultat.data() as Vehicule;
    return vehicule;
  }

  refresh() {
    this.dtTrigger = new Subject();
    const db = firebase.firestore();
    db.collection('visites').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        const visite = resultat.data() as Visite;
        this.visites.push(visite);
      });
      this.dtTrigger.next();
      this.visites = this.visites.filter((visite) => {
        const dateLimite = new Date(visite.dateLimite);
        const diff = this.differencesEnjour(dateLimite);
        return diff + 20 > 0;
      });
      this.visites.sort((a, b) => {
        return new Date(a.dateLimite).getTime() > new Date(b.dateLimite).getTime() ? 1 : -1;
      });
      this.synchronisation().then(() => {

      });
    });
  }

  differencesEnjour(dateLimite: Date): number {
    const difference = new Date().getTime() - new Date(dateLimite).getTime();
    const differenceEnSecondes = (difference / 1000);
    const differenceEnHeures = (differenceEnSecondes / 3600);
    const differenceEnJours = Math.ceil(differenceEnHeures / 24);
    return differenceEnJours;
  }

  edit(visite) {
    this.router.navigate(['visite', 'edit', visite.id]);
  }
  add() {
    this.router.navigate(['visite', 'edit']);
  }

}
