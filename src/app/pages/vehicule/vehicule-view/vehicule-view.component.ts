import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Vehicule } from 'src/app/models/vehicule.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Affectation } from 'src/app/models/affectation.model';
import { ReleveKilometrique } from 'src/app/models/releve.kilometrique.model';
import { Ravitaillement } from 'src/app/models/ravitaillement.model';
import { Panne } from 'src/app/models/panne.model';
import { Reparation } from 'src/app/models/reparation.model';
import { Visite } from 'src/app/models/visite.technique.model';
import { Assurance } from 'src/app/models/assurance.model';

@Component({
  selector: 'app-vehicule-view',
  templateUrl: './vehicule-view.component.html',
  styleUrls: ['./vehicule-view.component.scss']
})
export class VehiculeViewComponent implements OnInit {

  vehicule: Vehicule;
  affectations = new Array<Affectation>();
  kilometrages = new Array<ReleveKilometrique>();
  ravitaillements = new Array<Ravitaillement>();
  pannes = new Array<Panne>();
  reparations = new Array<Reparation>();
  visites = new Array<Visite>();
  assurances = new Array<Assurance>();

  constructor(private router: Router, private route: ActivatedRoute) { }

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
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getVehicule(id).then(() => {
        });
        this.getAffectations(id).then(() => {
          console.log('Affectations !');
        });
        this.getKilometrages(id).then(() => {
          console.log('Affectations !');
        });
        this.getRavitaillements(id).then(() => {
          console.log('Ravitaillements !');
        });
        this.getPannes(id).then(() => {
          console.log('Pannes !');
        });
        this.getReparattions(id).then(() => {
          console.log('Reoaraions !');
        });
        this.getVisites(id).then(() => {
          console.log('Visites !');
        });
        this.getAssurances(id).then(() => {
          console.log('Visites !');
        });
      }
    });
  }


  getVehicule(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('vehicules').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.vehicule = resultat.data() as Vehicule;
        resolve();
      });
    });
  }

  getAffectations(id) {
    this.kilometrages = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('kilometrages').where('vehicule.id', '==', id).orderBy('date', 'desc').get().then((resultats) => {
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

  getKilometrages(id) {
    this.affectations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('affectations').where('vehicule.id', '==', id).orderBy('date', 'desc').get().then((resultats) => {
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

  getPannes(id) {
    this.pannes = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('pannes').where('vehicule.id', '==', id).orderBy('date', 'desc').get().then((resultats) => {
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

  getRavitaillements(id) {
    this.ravitaillements = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('ravitaillements').where('vehicule.id', '==', id).orderBy('date', 'desc').get().then((resultats) => {
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

  getReparattions(id) {
    this.reparations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('reparations').where('vehicule.id', '==', id).orderBy('date', 'desc').get().then((resultats) => {
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
  getVisites(id) {
    this.reparations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('visites').where('vehicule.id', '==', id).orderBy('date', 'desc').get().then((resultats) => {
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
  getAssurances(id) {
    this.assurances = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('assurances').where('vehicule.id', '==', id).orderBy('date', 'desc').get().then((resultats) => {
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
