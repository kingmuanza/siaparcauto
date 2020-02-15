import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Affectation } from 'src/app/models/affectation.model';
import { ReleveKilometrique } from 'src/app/models/releve.kilometrique.model';
import { Ravitaillement } from 'src/app/models/ravitaillement.model';
import { Panne } from 'src/app/models/panne.model';
import { Reparation } from 'src/app/models/reparation.model';
import { Visite } from 'src/app/models/visite.technique.model';
import { Assurance } from 'src/app/models/assurance.model';
import * as firebase from 'firebase';
import { Vehicule } from 'src/app/models/vehicule.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  affectations = new Array<Affectation>();
  kilometrages = new Array<ReleveKilometrique>();
  ravitaillements = new Array<Ravitaillement>();
  pannes = new Array<Panne>();
  reparations = new Array<Reparation>();
  visites = new Array<Visite>();
  assurances = new Array<Assurance>();

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    {
        this.getAffectations().then(() => {
          console.log('Affectations !');
        });
        this.getKilometrages().then(() => {
          console.log('Affectations !');
        });
        this.getRavitaillements().then(() => {
          console.log('Ravitaillements !');
        });
        this.getPannes().then(() => {
          console.log('Pannes !');
        });
        this.getReparattions().then(() => {
          console.log('Reoaraions !');
        });
        this.getVisites().then(() => {
          console.log('Visites !');
        });
        this.getAssurances().then(() => {
          console.log('Visites !');
        });
      }
  }


  getTotalCarburants(ravitaillements: Array<Ravitaillement>) {
    let total = 0;
    ravitaillements.forEach(r => {
      total += Number(r.prixTotal);
    });
    return total;
  }
  getTotalReparations(ravitaillements: Array<Reparation>) {
    let total = 0;
    ravitaillements.forEach(r => {
      total += Number(r.coutTotal);
    });
    return total;
  }
  getTotalVisites(visites: Array<Visite>) {
    let total = 0;
    visites.forEach(r => {
      total += Number(r.prixTotal);
    });
    return total;
  }
  getTotalAssurances(assurances: Array<Assurance>) {
    let total = 0;
    assurances.forEach(r => {
      total += Number(r.prixTotal);
    });
    return total;
  }

  getAffectations() {
    this.kilometrages = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('kilometrages').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const kilometrage = resultat.data() as ReleveKilometrique;
          this.kilometrages.push(kilometrage);
        });
        resolve();
      });
    });
  }

  getKilometrages() {
    this.affectations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('affectations').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const affectation = resultat.data() as Affectation;
          this.affectations.push(affectation);
        });
        resolve();
      });
    });
  }

  getPannes() {
    this.pannes = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('pannes').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const panne = resultat.data() as Panne;
          this.pannes.push(panne);
        });
        resolve();
      });
    });
  }

  getRavitaillements() {
    this.ravitaillements = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('ravitaillements').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const ravitaillement = resultat.data() as Ravitaillement;
          this.ravitaillements.push(ravitaillement);
        });
        resolve();
      });
    });
  }

  getReparattions() {
    this.reparations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('reparations').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const reparation = resultat.data() as Reparation;
          this.reparations.push(reparation);
        });
        resolve();
      });
    });
  }
  getVisites() {
    this.reparations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('visites').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const visite = resultat.data() as Visite;
          this.visites.push(visite);
        });
        resolve();
      });
    });
  }
  getAssurances() {
    this.assurances = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('assurances').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const assurance = resultat.data() as Assurance;
          this.assurances.push(assurance);
        });
        resolve();
      });
    });
  }

  goTo(menu) {
    this.router.navigate([menu]);
  }



}
