import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Vehicule } from 'src/app/models/vehicule.model';

@Component({
  selector: 'app-carte-grise-suivi',
  templateUrl: './carte-grise-suivi.component.html',
  styleUrls: ['./carte-grise-suivi.component.scss']
})
export class CarteGriseSuiviComponent implements OnInit {

  vehicules = new Array<Vehicule>();
  enSynchronisation = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.getVehicules();
  }

  getVehicules() {
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
    });
  }

  differencesEnjour(dateLimite: Date): number {
    const difference = new Date().getTime() - new Date(dateLimite).getTime();
    const differenceEnSecondes = (difference / 1000);
    const differenceEnHeures = (differenceEnSecondes / 3600);
    const differenceEnJours = Math.ceil(differenceEnHeures / 24);
    return differenceEnJours;
  }

  addCarte() {

  }

  voir(vehicule: Vehicule) {
    this.router.navigate(['cartesgrises', vehicule.id]);
  }
}
